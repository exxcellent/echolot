/**
 * ALPHA: Column alike component that hides the rendering and show a waiting message without
 * blocking the user thread: the layout container which renders its content in a single
 * vertical column of cells. May contain zero or more child components. Does not
 * support pane components as children.
 *
 * @sp {#Border} border the border displayed around the entire column
 * @sp {#Extent} cellSpacing the extent margin between cells of the column
 * @sp {#Insets} insets the inset margin between the column border and its cells
 *
 * @ldp {#Alignment} alignment the alignment of the child component within its
 *      cell
 * @ldp {#Color} background the background of the child component's cell
 * @ldp {#FillImage} backrgoundImage the background image of the child
 *      component's cell
 * @ldp {#Extent} height the height of the child component's cell
 * @ldp {#Insets} insets the insets margin of the child component's cell (this
 *      inset is added to any inset set on the container component)
 */
exxcellent.LazyBlock = Core.extend(Echo.Component, {

    $load: function() {
        Echo.ComponentFactory.registerType("exxcellent.LazyBlock", this);
    },

    /** @see Echo.Component#componentType */
    componentType: "exxcellent.LazyBlock"
});

/**
 * ALPHA: Component rendering peer: Block (Column)
 */
exxcellent.LazyBlockSync = Core.extend(Echo.Render.ComponentSync, {

	$load: function() {
        Echo.Render.registerPeer("exxcellent.LazyBlock", this);
    },
    
    prevFocusKey: 38,
    
    prevFocusFlag: Echo.Render.ComponentSync.FOCUS_PERMIT_ARROW_UP,

    nextFocusKey: 40,

    nextFocusFlag: Echo.Render.ComponentSync.FOCUS_PERMIT_ARROW_DOWN,
    
    /**
     * The DOM element name of child container cells.
     * @type String
	 * @see Echo.Render.ComponentSync#cellElementNodeName
     */
    cellElementNodeName: "div",
        
    /**
     * The root DOM element of the rendered array container.
     * @type Element
     */
    element: null,
    /**
     * The root DOM element of the rendered array container.
     * @type Element
     */
    _waitElement: null,

    /**
     * The DOM element to which child elements should be added.  May be equivalent to <code>element</code>.
     * @type Element
     */
    containerElement: null,
    
    /**
     * Prototype Element to be cloned and added between cells of the array container.
     * 
     * @type Element
     */
    spacingPrototype: null,

    /** 
     * Number of pixels to be rendered as spacing between child cells of the container.
     * @type Number
     */
    cellSpacing: null,

    /**
     * Mapping between child render ids and child container cell elements. 
     */
    _childIdToElementMap: null,

    /**
     * Processes a key press event.  Provides support for adjusting focus via arrow keys.
     * 
     * @param e the event
     */
    processKeyPress: function(e) {
        if (!this.client) {
            return;
        }
        
        switch (e.keyCode) {
        case this.prevFocusKey:
        case this.nextFocusKey:
            var focusPrevious = e.keyCode == this.prevFocusKey;
            if (this.invertFocusRtl && !this.component.getRenderLayoutDirection().isLeftToRight()) {
                focusPrevious = !focusPrevious;
            }
            var focusedComponent = this.client.application.getFocusedComponent();
            if (focusedComponent && focusedComponent.peer && focusedComponent.peer.getFocusFlags) {
                var focusFlags = focusedComponent.peer.getFocusFlags();
                if ((focusPrevious && focusFlags & this.prevFocusFlag) || (!focusPrevious && focusFlags & this.nextFocusFlag)) {
                    var focusChild = this.client.application.focusManager.findInParent(this.component, focusPrevious);
                    if (focusChild) {
                        this.client.application.setFocusedComponent(focusChild);
                        Core.Web.DOM.preventEventDefault(e);
                        return false;
                    }
                }
            }
            break;
        }
        return true;
    },

    /**
     * Renders the specified child to the containerElement.
     * 
     * @param {Echo.Update.ComponentUpdate} the update
     * @param {Echo.Component} the child component
     * @param {Number} index the index of the child within the parent 
     */
    _renderAddChild: function(update, child, index) {
        var cellElement = document.createElement(this.cellElementNodeName);
        this._childIdToElementMap[child.renderId] = cellElement;
        
        // instead of Echo.Render.renderComponentAdd(update, child, cellElement);
        // we do only:
        Echo.Render._loadPeer(child.parent.peer.client, child); 
        child.peer.renderAdd(update, cellElement); 

        this.renderChildLayoutData(child, cellElement);

        if (index != null) {
            var currentChildCount;
            if (this.containerElement.childNodes.length >= 3 && this.cellSpacing) {
                currentChildCount = (this.containerElement.childNodes.length + 1) / 2;
            } else {
                currentChildCount = this.containerElement.childNodes.length;
            }
            if (index == currentChildCount) {
                index = null;
            }
        }
        if (index == null || !this.containerElement.firstChild) {
            // Full render, append-at-end scenario, or index 0 specified and no children rendered.
            
            // Render spacing cell first if index != 0 and cell spacing enabled.
            if (this.cellSpacing && this.containerElement.firstChild) {
                this.containerElement.appendChild(this.spacingPrototype.cloneNode(false));
            }
    
            // Render child cell second.
            this.containerElement.appendChild(cellElement);
        } else {
            // Partial render insert at arbitrary location scenario (but not at end)
            var insertionIndex = this.cellSpacing ? index * 2 : index;
            var beforeElement = this.containerElement.childNodes[insertionIndex];
            
            // Render child cell first.
            this.containerElement.insertBefore(cellElement, beforeElement);
            
            // Then render spacing cell if required.
            if (this.cellSpacing) {
                this.containerElement.insertBefore(this.spacingPrototype.cloneNode(false), beforeElement);
            }
        }
    },
    
    _getWaitElement : function () {
    	if (!this._waitElement) {
	    	this._waitElement = document.createElement("div");
		    this._waitElement.style.width = '200px';
		    this._waitElement.style.margin = 'auto';
		    this._waitElement.style.padding = '10px';
	        
        	// icon
	        var waitIcon = document.createElement("div");
    		var icon = this.component.render("icon");
	        img = document.createElement("img");
	        Echo.Sync.ImageReference.renderImg(icon, img);
		    waitIcon.appendChild(img);
		    
		    // text
	        var waitText = document.createElement("div");
	        waitText.style.cssFloat = "right"; // all major browsers use float? no cssFloat, since float became a reserved word in js.
	        waitText.style.styleFloat = "right"; // IE wants its own float var name
	        var text = this.component.render("text");
		    waitText.appendChild(document.createTextNode(text));
	        
		    this._waitElement.appendChild(waitText);
		    this._waitElement.appendChild(waitIcon);
    	}
    	return this._waitElement;
    },
    
	/** render the busy state */
    _setBusy : function (parentNode, busyState) {
    	var waitElement = this._getWaitElement();
		if (busyState) {
    		parentNode.appendChild(waitElement);
		} else {
    		parentNode.removeChild(waitElement);
    		parentNode.appendChild(this.element);
		}
    },
    
    /**
     * Renders all children.  Must be invoked by derived <code>renderAdd()</code> implementations.
     * 
     * @param {Echo.Update.ComponentUpdate} the update
     */
    _lazyRenderAddChildren: function(parentNode, update) {
    	this._setBusy(parentNode, true);
    	
    	// Create map to contain removed components (for peer unloading).
        Echo.Render._disposedComponents = {};
        
        this._childIdToElementMap = {};
    	var ji = 0;
        var componentCount = this.component.getComponentCount();
        var synchronBlockComponent = this;
       	function doLongRunningTask() {
			if(componentCount > ji) {
            	var child = synchronBlockComponent.component.getComponent(ji);
            	synchronBlockComponent._renderAddChild(update, child);
				ji++;
		    	setTimeout(doLongRunningTask, 1);
			} else {
				finalizeRendering();
			}
        }
        
        function finalizeRendering() {
    		synchronBlockComponent._setBusy(parentNode, false);
	        Core.Web.Event.add(this.element, 
	                Core.Web.Env.QUIRK_IE_KEY_DOWN_EVENT_REPEAT ? "keydown" : "keypress",
	                Core.method(this, this.processKeyPress), false);
    	}
    	
    	// start the lazy time consuming task
    	setTimeout(doLongRunningTask, 1);
    },
    
    /** @see Echo.Render.ComponentSync#renderDispose */
    renderDispose: function(update) { 
        Core.Web.Event.removeAll(this.element);
        this.element = null;
        this.containerElement = null;
        this._childIdToElementMap = null;
        this.spacingPrototype = null;
    },

    /**
     * Removes a child cell.
     * 
     * @param {Echo.Update.ComponentUpdate} the update
     * @param {Echo.Component} the child to remove
     */
    _renderRemoveChild: function(update, child) {
        var childElement = this._childIdToElementMap[child.renderId];
        if (!childElement) {
            return;
        }
        
        if (this.cellSpacing) {
            // If cell spacing is enabled, remove a spacing element, either before or after the removed child.
            // In the case of a single child existing in the Row, no spacing element will be removed.
            if (childElement.previousSibling) {
                this.containerElement.removeChild(childElement.previousSibling);
            } else if (childElement.nextSibling) {
                this.containerElement.removeChild(childElement.nextSibling);
            }
        }
        
        this.containerElement.removeChild(childElement);
        
        delete this._childIdToElementMap[child.renderId];
    },

    /** @see Echo.Render.ComponentSync#renderUpdate */
    renderUpdate: function(update) {
        var i, fullRender = false;
        if (update.hasUpdatedProperties() || update.hasUpdatedLayoutDataChildren()) {
            // Full render
            fullRender = true;
        } else {
            var removedChildren = update.getRemovedChildren();
            if (removedChildren) {
                // Remove children.
                for (i = 0; i < removedChildren.length; ++i) {
                    this._renderRemoveChild(update, removedChildren[i]);
                }
            }
            var addedChildren = update.getAddedChildren();
            if (addedChildren) {
                // Add children.
                for (i = 0; i < addedChildren.length; ++i) {
                    this._renderAddChild(update, addedChildren[i], this.component.indexOf(addedChildren[i])); 
                }
            }
        }
        if (fullRender) {
            var element = this.element;
            var containerElement = element.parentNode;
            Echo.Render.renderComponentDispose(update, update.parent);
            containerElement.removeChild(element);
            this.renderAdd(update, containerElement);
        }
        
        return fullRender;
    },
    
    // here once started the "column"
    
    /** @see Echo.Render.ComponentSync#renderAdd */
    renderAdd: function(update, parentElement) {
        this.element = this.containerElement = document.createElement("div");
        this.element.id = this.component.renderId;
        this.element.style.outlineStyle = "none";
        this.element.tabIndex = "-1";
    
        Echo.Sync.renderComponentDefaults(this.component, this.element);
        Echo.Sync.Border.render(this.component.render("border"), this.element);
        Echo.Sync.Insets.render(this.component.render("insets"), this.element, "padding");
    
        this.cellSpacing = Echo.Sync.Extent.toPixels(this.component.render("cellSpacing"), false);
        if (this.cellSpacing) {
            this.spacingPrototype = document.createElement("div");
            this.spacingPrototype.style.height = this.cellSpacing + "px";
            this.spacingPrototype.style.fontSize = "1px";
            this.spacingPrototype.style.lineHeight = "0";
        }

        this._lazyRenderAddChildren(parentElement, update);
    },
    
    /** @see Echo.Sync.ArrayContainer#renderChildLayoutData */
    renderChildLayoutData: function(child, cellElement) {
        var layoutData = child.render("layoutData");
        if (layoutData) {
            Echo.Sync.Color.render(layoutData.background, cellElement, "backgroundColor");
            Echo.Sync.FillImage.render(layoutData.backgroundImage, cellElement);
            Echo.Sync.Insets.render(layoutData.insets, cellElement, "padding");
            Echo.Sync.Alignment.render(layoutData.alignment, cellElement, true, this.component);
            
            if (layoutData.marginLeft) {
            	cellElement.style.marginLeft = layoutData.marginLeft;
            }
            if (layoutData.marginRight) {
	            cellElement.style.marginRight = layoutData.marginRight;
            }
            if (layoutData.marginTop) {
	            cellElement.style.marginTop = layoutData.marginTop;
            }
            if (layoutData.marginBottom) {
	            cellElement.style.marginBottom = layoutData.marginBottom;
            }
            if (layoutData.width) {
                cellElement.style.width = Echo.Sync.Extent.toPixels(layoutData.width, false) + "px";
            }
            if (layoutData.height) {
                cellElement.style.height = Echo.Sync.Extent.toPixels(layoutData.height, false) + "px";
            }
            if (layoutData.floating) {
            	// all major browsers use float? no cssFloat, since float became a reserved word in js.
	            cellElement.style.cssFloat = layoutData.floating;
	            // IE wants its own float var name
	            cellElement.style.styleFloat = layoutData.floating;
            }
        }
    }
});