/**
 * Component implementation for a Spin Button
 */
exxcellent.SpinButton = Core.extend(Echo.Component, {

    $load: function () {
        Echo.ComponentFactory.registerType("exxcellent.SpinButton", this);
    },

    doAction: function () {
        this.fireEvent({
            type: "action",
            source: this,
            actionCommand: this.get("actionCommand")
        });
    },

    componentType: "exxcellent.SpinButton",
    focusable: true
});

/**
 * Component rendering peer: SpinButton
 */
exxcellent.SpinButton.Sync = Core.extend(Echo.Render.ComponentSync, {

    $load: function () {
        Echo.Render.registerPeer("exxcellent.SpinButton", this);
    },

    _div: null,
    _decSpan: null,
    _input: null,

    renderAdd: function (update, parentElement) {
        this._div = document.createElement("div");
        this._div.id = this.component.renderId;

        this._decSpan = document.createElement("span");
        this._decSpan.style.cursor = "pointer";
        this._decSpan.appendChild(document.createTextNode("<"));
        this._div.appendChild(this._decSpan);

        var value = this.component.get("value");
        this._input = document.createElement("input");
        this._input.type = "text";
        this._input.value = !value ? "0" : parseInt(value, 10);
        this._input.style.textAlign = "right";
        this._div.appendChild(this._input);

        this._incSpan = document.createElement("span");
        this._incSpan.setAttribute("tabindex", 0);

        this._incSpan.appendChild(document.createTextNode(">"));
        this._incSpan.style.cursor = "pointer";
        this._div.appendChild(this._incSpan);

        // Register the events for _process methods
        Core.Web.Event.add(this._decSpan, "click",
            Core.method(this, this._processDecrement), false);
        Core.Web.Event.add(this._incSpan, "click",
            Core.method(this, this._processIncrement), false);
        Core.Web.Event.add(this._input, "change",
            Core.method(this, this._processTextChange), false);

        // Register Key up events for actions
        Core.Web.Event.add(this._input, "keyup",
            Core.method(this, this._processKeyUp), false);

        parentElement.appendChild(this._div);
    },

    renderDispose: function (update) {
        // Unregister the events
        Core.Web.Event.removeAll(this._decSpan);
        Core.Web.Event.removeAll(this._incSpan);
        Core.Web.Event.removeAll(this._input);

        this._decSpan = null;
        this._input = null;
        this._incSpan = null;
        this._div = null;
    },

    renderUpdate: function (update) {
        var element = this._div;
        var containerElement = element.parentNode;
        Echo.Render.renderComponentDispose(update, update.parent);
        containerElement.removeChild(element);
        this.renderAdd(update, containerElement);
        return true;
    },

    _processDecrement: function (e) {
        var value = parseInt(this._input.value, 10);
        value--;
        this._input.value = isNaN(value) ? 0 : value;
        this.component.set("value", value);
    },

    _processIncrement: function (e) {
        var value = parseInt(this._input.value, 10);
        value++;
        this._input.value = isNaN(value) ? 0 : value;
        this.component.set("value", value);
    },

    _processTextChange: function (e) {
        var value = parseInt(this._input.value, 10);
        this._input.value = isNaN(value) ? 0 : value;
        this.component.set("value", value);
    },

    // if ENTER key was pressed doAction!
    _processKeyUp: function (e) {
        if (e.keyCode == 13) {
            this.component.doAction();
        }
        if (e.keyCode == 38) {
            this._processIncrement(e);
        }
        if (e.keyCode == 40) {
            this._processDecrement(e);
        }
    },

    renderFocus: function () {
        Core.Web.DOM.focusElement(this._incSpan);
    }

});
