Contrib.ScrollPane = Core.extend(Echo.Component, {

    $load: function () {
        Echo.ComponentFactory.registerType("Contrib.ScrollPane", this);
    },

    componentType: "Contrib.ScrollPane",

    cellElementNodeName: "div",
    prevFocusKey: 38,
    prevFocusFlag: Echo.Render.ComponentSync.FOCUS_PERMIT_ARROW_UP,
    nextFocusKey: 40,
    nextFocusFlag: Echo.Render.ComponentSync.FOCUS_PERMIT_ARROW_DOWN

});

Contrib.ScrollPane.Peer = Core.extend(Echo.Render.ComponentSync, {

    $load: function () {
        Echo.Render.registerPeer("Contrib.ScrollPane", this);
    },

    $abstract: {
        cellElementNodeName: true,

        renderChildLayoutData: function (child, cellElement) {
        }
    },

    element: null,
    containerElement: null,
    spacingPrototype: null,
    cellSpacing: null,
    _childIdToElementMap: null,

    processKeyPress: function (e) {
        switch (e.keyCode) {
            case this.prevFocusKey:
            case this.nextFocusKey:
                var focusPrevious = e.keyCode == this.prevFocusKey;
                var focusedComponent = this.component.application.getFocusedComponent();
                if (focusedComponent && focusedComponent.peer && focusedComponent.peer.getFocusFlags) {
                    var focusFlags = focusedComponent.peer.getFocusFlags();
                    if ((focusPrevious && focusFlags & this.prevFocusFlag) || (!focusPrevious && focusFlags & this.nextFocusFlag)) {
                        var focusChild = this.component.application.focusManager.findInParent(this.component, focusPrevious);
                        if (focusChild) {
                            this.component.application.setFocusedComponent(focusChild);
                            Core.Web.DOM.preventEventDefault(e);
                            return false;
                        }
                    }
                }
                break;
        }
        return true;
    },

    renderAdd: function (update, parentElement) {


        this.element = this.containerElement = document.createElement("div");
        this.element.id = "scrollPane" + this.component.renderId;
        this.element.style.overflow = "auto";
        this.element.style.outlineStyle = "none";
        this.element.tabIndex = "-1";
        var layoutData = this.component.render("layoutData");
        if (layoutData) {
            if (layoutData.height) {
                this.element.style.height = Echo.Sync.Extent.toPixels(layoutData.height, false) + "px";
            }
            Echo.Sync.Insets.render(layoutData.insets, parentElement, "padding");
        }

        Echo.Sync.Border.render(this.component.render("border"), this.element);
        Echo.Sync.Color.renderFB(this.component, this.element);
        Echo.Sync.Font.render(this.component.render("font"), this.element);
        Echo.Sync.Insets.render(this.component.render("insets"), this.element, "padding");

        this.cellSpacing = Echo.Sync.Extent.toPixels(this.component.render("cellSpacing"), false);
        if (this.cellSpacing) {
            this.spacingPrototype = document.createElement("div");
            this.spacingPrototype.style.height = this.cellSpacing + "px";
            this.spacingPrototype.style.fontSize = "1px";
            this.spacingPrototype.style.lineHeight = "0";
        }

        this.renderAddChildren(update);

        parentElement.appendChild(this.element);
    },

    renderChildLayoutData: function (child, cellElement) {
        var layoutData = child.render("layoutData");
        if (layoutData) {
            Echo.Sync.Color.render(layoutData.background, cellElement, "backgroundColor");
            Echo.Sync.FillImage.render(layoutData.backgroundImage, cellElement);
            Echo.Sync.Insets.render(layoutData.insets, cellElement, "padding");
            Echo.Sync.Alignment.render(layoutData.alignment, cellElement, true, this.component);
            if (layoutData.height) {
                cellElement.style.height = Echo.Sync.Extent.toPixels(layoutData.height, false) + "px";
            }
        }
    },

    renderAddChild: function (update, child, index) {
        var cellElement = document.createElement(this.cellElementNodeName);
        this._childIdToElementMap[child.renderId] = cellElement;
        Echo.Render.renderComponentAdd(update, child, cellElement);

        this.renderChildLayoutData(child, cellElement);

        if (index !== null) {
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
        if (index === null || !this.containerElement.firstChild) {
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

    renderAddChildren: function (update) {
        this._childIdToElementMap = {};

        var componentCount = this.component.getComponentCount();
        for (var i = 0; i < componentCount; ++i) {
            var child = this.component.getComponent(i);
            this.renderAddChild(update, child);
        }

        Core.Web.Event.add(this.element,
            Core.Web.Env.QUIRK_IE_KEY_DOWN_EVENT_REPEAT ? "keydown" : "keypress",
            Core.method(this, this.processKeyPress), false);
    },

    renderDispose: function (update) {
        Core.Web.Event.removeAll(this.element);
        this.element = null;
        this.containerElement = null;
        this._childIdToElementMap = null;
        this.spacingPrototype = null;
    },

    renderRemoveChild: function (update, child) {
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

    renderUpdate: function (update) {
        var fullRender = false;
        if (update.hasUpdatedProperties() || update.hasUpdatedLayoutDataChildren()) {
            // Full render
            fullRender = true;
        } else {
            var removedChildren = update.getRemovedChildren();
            var i;
            if (removedChildren) {
                // Remove children.
                for (i = 0; i < removedChildren.length; ++i) {
                    this.renderRemoveChild(update, removedChildren[i]);
                }
            }
            var addedChildren = update.getAddedChildren();
            if (addedChildren) {
                // Add children.
                for (i = 0; i < addedChildren.length; ++i) {
                    this.renderAddChild(update, addedChildren[i], this.component.indexOf(addedChildren[i]));
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
    }

});
