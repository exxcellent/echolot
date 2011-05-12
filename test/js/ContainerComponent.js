/**
 * Here's another trivial free client-side component. This one allows you to create a button with 
 * rollover effects that contains children. License for this component is public domain (use it however you like).
 * @see http://echo.nextapp.com/site/node/5146
 */
Contrib.ContainerButton = Core.extend(Echo.Component, {

    componentType: "Contrib.ContainerButton",

    doAction: function() {
        this.fireEvent({ type: "action", source: this, actionCommand: this.render("actionCommand") });
    }
});

/**
 * Synchronization peer for ContainerButton component.
 */
Contrib.ContainerButtonSync = Core.extend(Echo.Render.ComponentSync, {

    $load: function() {
        Echo.Render.registerPeer("Contrib.ContainerButton", this);
    },

    _div: null,
    
    _processRolloverEnter: function(e) {
        var backgroundImage = Echo.Sync.getEffectProperty(this.component, "backgroundImage", "rolloverBackgroundImage", true);
        Echo.Sync.FillImage.renderClear(backgroundImage, this._div);
        Echo.Sync.Color.renderClear(this.component.render("rolloverForeground"), this._div, "color");
        Echo.Sync.Color.renderClear(this.component.render("rolloverBackground"), this._div, "backgroundColor");
    },
    
    _processRolloverExit: function(e) {
        Echo.Sync.FillImage.renderClear(this.component.render("backgroundImage"), this._div);
        Echo.Sync.Color.renderClear(this.component.render("foreground"), this._div, "color");
        Echo.Sync.Color.renderClear(this.component.render("background"), this._div, "backgroundColor");
    },
    
    _processClick: function(e) {
        this.component.doAction();
    },

    renderAdd: function(update, parentElement) {
        this._div = document.createElement("div");
        this._div.style.cssText = "cursor: pointer;";
        Echo.Sync.Insets.render(this.component.render("insets"), this._div, "padding");
        Echo.Sync.Font.render(this.component.render("font"), this._div);
        Echo.Sync.Color.renderFB(this.component, this._div);
        Echo.Sync.Border.render(this.component.render("border"), this._div);
        Echo.Sync.FillImage.render(this.component.render("backgroundImage"), this._div);

        if (this.component.children.length == 1) {
            Echo.Render.renderComponentAdd(update, this.component.children[0], this._div);
        } else if (this.component.children.length != 0) {
            throw new Error("Too many children in ContainerButton (max is 1).");
        }

        Core.Web.Event.add(this._div, "click", Core.method(this, this._processClick), false);
        
        if (this.component.render("rolloverEnabled")) {
            Core.Web.Event.add(this._div, "mouseover", Core.method(this, this._processRolloverEnter), false);
            Core.Web.Event.add(this._div, "mouseout", Core.method(this, this._processRolloverExit), false);
        }
        parentElement.appendChild(this._div);
    },

    renderDispose: function(update) {
        Core.Web.Event.removeAll(this._div);
        this._div = null;
    },
    
    renderUpdate: function(update) {
        var element = this._div;
        var containerElement = element.parentNode;
        this.renderDispose(update);
        containerElement.removeChild(element);
        this.renderAdd(update, containerElement);
        return true;
    }
});