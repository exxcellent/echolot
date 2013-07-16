/**
 * This is a text area component that expands to fill a pane. Resizing the pane
 * will grow/shrink the text area appropriately. It's not 100% finished at the
 * moment (border size calculation doesn't work properly with borders with
 * variable heights, for example).
 *
 * @see http://echo.nextapp.com/site/node/5287
 */
Contrib.TextPane = Core.extend(Echo.Component, {

    $load: function () {
        Echo.ComponentFactory.registerType("Contrib.TextPane", this);
    },

    componentType: "Contrib.TextPane",
    focusable: true,
    pane: true,

    /**
     * Programatically performs a text component action.
     */
    doAction: function () {
        this.fireEvent({
            type: "action",
            source: this,
            actionCommand: this.get("actionCommand")
        });
    }
});

/**
 * Component rendering peer: TextComponent
 */
Contrib.TextPane.Sync = Core.extend(Echo.Render.ComponentSync, {

    $static: {
        _supportedPartialProperties: ["text"]
    },

    $load: function () {
        Echo.Render.registerPeer("Contrib.TextPane", this);
    },

    _div: null,
    _textArea: null,

    _processBlur: function (e) {
        if (!this.client.verifyInput(this.component,
            Echo.Client.FLAG_INPUT_PROPERTY)) {
            return;
        }
        this.sanitizeInput();
        this.component.set("text", e.registeredTarget.value);
    },

    _processClick: function (e) {
        if (!this.client.verifyInput(this.component,
            Echo.Client.FLAG_INPUT_PROPERTY)) {
            return;
        }
        this.component.application.setFocusedComponent(this.component);
    },

    _processKeyPress: function (e) {
        if (!this.client.verifyInput(this.component,
            Echo.Client.FLAG_INPUT_PROPERTY)) {
            Core.Web.DOM.preventEventDefault(e);
            return true;
        }
    },

    _processKeyUp: function (e) {
        if (!this.client.verifyInput(this.component,
            Echo.Client.FLAG_INPUT_PROPERTY)) {
            Core.Web.DOM.preventEventDefault(e);
            return true;
        }
        this.sanitizeInput();

        // Store last updated text in local value, to ensure that we do not
        // attempt to
        // reset it to this value in renderUpdate() and miss any characters that
        // were
        // typed between repaints.
        this._text = e.registeredTarget.value;

        this.component.set("text", this._text);
        if (e.keyCode == 13) {
            this.component.doAction();
        }
        return true;
    },

    renderAdd: function (update, parentElement) {
        this._div = document.createElement("div");
        this._div.id = this.component.renderId;
        this._div.style.cssText = "position:absolute;top:0;left:0;bottom:0;right:0;overflow:hidden;";

        this._textArea = document.createElement("textarea");
        this._textArea.style.cssText = "margin:0;padding:0;border:0px none;width:100%;";
        this._div.appendChild(this._textArea);

        this._textArea.style.overflow = "auto";

        if (this.component.get("text")) {
            this._text = this._textArea.value = this.component.get("text");
        }

        var border = this.component.render("border");
        this._borderSizeVertical = Echo.Sync.Border.getPixelSize(border);

        if (this.component.isRenderEnabled()) {
            Echo.Sync.Border.render(border, this._div);
            Echo.Sync.Color.renderFB(this.component, this._textArea);
            Echo.Sync.Font
                .render(this.component.render("font"), this._textArea);
            Echo.Sync.FillImage.render(
                this.component.render("backgroundImage"), this._textArea);
        } else {
            Echo.Sync.Border.render(Echo.Sync.getEffectProperty(this.component,
                "border", "disabledBorder", true), this._div);
            Echo.Sync.Color.render(Echo.Sync.getEffectProperty(this.component,
                "foreground", "disabledForeground", true),
                this._textArea, "color");
            Echo.Sync.Color.render(Echo.Sync.getEffectProperty(this.component,
                "background", "disabledBackground", true),
                this._textArea, "backgroundColor");
            Echo.Sync.Font.render(Echo.Sync.getEffectProperty(this.component,
                "font", "disabledFont", true), this._textArea);
            Echo.Sync.FillImage.render(Echo.Sync.getEffectProperty(
                this.component, "backgroundImage",
                "disabledBackgroundImage", true), this._textArea);
        }

        Core.Web.Event.add(this._textArea, "click", Core.method(this,
            this._processClick), false);
        Core.Web.Event.add(this._textArea, "blur", Core.method(this,
            this._processBlur), false);
        Core.Web.Event.add(this._textArea, "keypress", Core.method(this,
            this._processKeyPress), false);
        Core.Web.Event.add(this._textArea, "keyup", Core.method(this,
            this._processKeyUp), false);

        parentElement.appendChild(this._div);
    },

    renderDisplay: function () {
        Core.Web.VirtualPosition.redraw(this._div);
        var height = this._div.parentNode.offsetHeight
            - this._borderSizeVertical;
        if (height > 0) {
            this._textArea.style.height = height + "px";
        }
    },

    renderDispose: function (update) {
        Core.Web.Event.removeAll(this._textArea);
        this._textArea = null;
        this._div = null;
    },

    renderFocus: function () {
        Core.Web.DOM.focusElement(this._textArea);
    },

    renderUpdate: function (update) {
        var fullRender = !Core.Arrays.containsAll(
            Echo.Sync.TextComponent._supportedPartialProperties, update
                .getUpdatedPropertyNames(), true);

        if (fullRender) {
            var element = this._textArea;
            var containerElement = element.parentNode;
            this.renderDispose(update);
            containerElement.removeChild(element);
            this.renderAdd(update, containerElement);
        } else {
            if (update.hasUpdatedProperties()) {
                var textUpdate = update.getUpdatedProperty("text");
                if (textUpdate && textUpdate.newValue != this._text) {
                    this._textArea.value = textUpdate.newValue === null
                        ? ""
                        : textUpdate.newValue;
                }
            }
        }

        // Store text in local value.
        this._text = this.component.get("text");

        return false; // Child elements not supported: safe to return false.
    },

    sanitizeInput: function () {
        var maximumLength = this.component.render("maximumLength", -1);
        if (maximumLength >= 0) {
            if (this._textArea.value
                && this._textArea.value.length > maximumLength) {
                this._textArea.value = this._textArea.value.substring(0,
                    maximumLength);
            }
        }
    }
});
