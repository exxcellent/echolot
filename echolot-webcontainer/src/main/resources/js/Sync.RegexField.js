/**
 * Abstract base class for text fields that compare the text entered against a regular expression
 * and show a visual hint when it does not match.
 */
exxcellent.RegexComponent = Core.extend(Echo.TextComponent,
{
    $abstract: true,

    $load: function()
    {
        Echo.ComponentFactory.registerType("exxcellent.RegexComponent", this );
    },

    componentType: "exxcellent.RegexComponent",

    $static: {
        REGEX: "regex",
        REGEX_MISMATCH_FOREGROUND: "regexMismatchForeground",
        REGEX_MISMATCH_BORDER: "regexMismatchBorder"
    }
});


exxcellent.RegexTextField = Core.extend(exxcellent.RegexComponent,
{
    $load: function()
    {
        Echo.ComponentFactory.registerType("exxcellent.RegexTextField", this);
    },

    componentType: "exxcellent.RegexTextField"
});

exxcellent.RegexTextArea = Core.extend(exxcellent.RegexComponent,
{
    $load: function()
    {
        Echo.ComponentFactory.registerType("exxcellent.RegexTextArea", this);
    },

    componentType: "exxcellent.RegexTextArea"
});


exxcellent.RegexComponentSync = Core.extend(Echo.Sync.TextComponent, {
    $abstract: true,

    $construct: function()
    {
        Echo.Sync.TextComponent.call(this);
    },

    $virtual: {
        clientKeyDown: function(e) {
            var r = Echo.Sync.TextComponent.prototype.clientKeyDown.call(this, e);
            this._validateRegex();
            return r;
        },

        clientKeyPress: function(e) {
            var r = Echo.Sync.TextComponent.prototype.clientKeyPress.call(this, e);
            this._validateRegex();
            return r;
        },

        clientKeyUp: function(e) {
            var r = Echo.Sync.TextComponent.prototype.clientKeyUp.call(this, e);
            this._validateRegex();
            return r;
        },

        _validateRegex: function() {
            if (!this.component.render("regex")) {
                return;
            }
            var pattern = new RegExp(this.component.render("regex"));
            if (!pattern.test(this.component.get("text"))) {
                Echo.Sync.Border.renderClear(Echo.Sync.getEffectProperty(this.component, "border", "regexMismatchBorder", true), this.input, "border");
                Echo.Sync.Color.renderClear(Echo.Sync.getEffectProperty(this.component, "foreground", "regexMismatchForeground", true), this.input, "color");
            } else {
                Echo.Sync.Border.renderClear(this.component.render("border"), this.input, this.input, "border");
                Echo.Sync.Color.renderClear(this.component.render("foreground"), this.input, "color");
            }
        }
    }
});

exxcellent.RegexTextFieldSync = Core.extend(exxcellent.RegexComponentSync,
{
    $load: function() {
        Echo.Render.registerPeer("exxcellent.RegexTextField", this);
    },

    /** @see Echo.Render.ComponentSync#renderAdd */
    renderAdd: function(update, parentElement) {
        this.input = document.createElement("input");
        this.input.id = this.component.renderId;
        if (!this.component.render("editable", true)) {
            this.input.readOnly = true;
        }
        this.input.type = "text";
        var maximumLength = this.component.render("maximumLength", -1);
        if (maximumLength >= 0) {
            this.input.maxLength = maximumLength;
        }
        this._renderStyle(this.input);
        this._addEventHandlers(this.input);
        if (this.component.get("text")) {
            this.input.value = this.component.get("text");
        }
        this._validateRegex();

        this.renderAddToParent(parentElement);
    }
});

exxcellent.RegexTextAreaSync = Core.extend(exxcellent.RegexComponentSync,
{
    $load: function() {
        Echo.Render.registerPeer("exxcellent.RegexTextArea", this);
    },

    /** @see Echo.Render.ComponentSync#renderAdd */
    renderAdd: function(update, parentElement) {
        this.input = document.createElement("textarea");
        this.input.id = this.component.renderId;
        this.input.className = this.component.render("cssClasses", "");
        if (!this.component.render("editable", true)) {
            this.input.readOnly = true;
        }
        this._renderStyle(this.input);
        this.input.style.overflow = "auto";
        this._addEventHandlers(this.input);
        if (this.component.get("text")) {
            this.input.value = this.component.get("text");
        }
        this._validateRegex();

        this.renderAddToParent(parentElement);
    }
});