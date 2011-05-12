/**
 * Component implementation for a DatePicker.
 */
exxcellent.DatePicker = Core.extend(Echo.Component, {

    $load : function() {
        Echo.ComponentFactory.registerType("exxcellent.DatePicker", this);
    },

    /**
     * Properties defined for this component.
     */
	$static : {
		/* DatePicker properties. */
		TRIGGER_EVENT: "triggerEvent",
		NUMBER_OF_CALENDARS: "numberOfCalendars",
		DEFAULT_DATE: "defaultDate",
		LOCALE_MODEL: "localeModel",
		VIEW_MODE: "viewMode",
		SELECTION_MODE: "selectionMode",
		HIDE_ON_SELECT: "hideOnSelect",
		FLAT_MODE: "flatMode",
		POSITION: "position",
		CSS : "css",
		IMG_DATEPICKER_T : "DATEPICKER_T_IMG",
		IMG_DATEPICKER_B : "DATEPICKER_B_IMG",
		IMG_DATEPICKER_L : "DATEPICKER_L_IMG",
		IMG_DATEPICKER_R : "DATEPICKER_R_IMG",
		IMG_DATEPICKER_W : "DATEPICKER_W_IMG",//TL
		IMG_DATEPICKER_X : "DATEPICKER_X_IMG",//TR
		IMG_DATEPICKER_Y : "DATEPICKER_Y_IMG",//BL
		IMG_DATEPICKER_Z : "DATEPICKER_Z_IMG",//BR
		REGEX: "regex",
		/* Textfield properties. */
		TEXT: "text",
		MAX_LENGTH: "maximumLength",
		WIDTH: "width",
		EDITABLE: "editable",
		BORDER: "border",
		FOREGROUND: "foreground",
		DISABLED_FOREGROUND: "disabledForeground",
		BACKGROUND: "background",
		DISABLED_BACKGROUND: "disabledBackground",
		DISABLED_BORDER: "disabledBorder",
		FONT: "font",
		DISABLED_FONT: "disabledFont",
		BACKGROUND_IMG: "backgroundImage",
		DISABLED_BACKGROUND_IMG: "disabledBackgroundImage",
		ALIGNMENT: "alignment",
		INSETS: "insets",
		HEIGHT: "height",
		TOOLTIP_TEXT: "toolTipText"
	},

    componentType: "exxcellent.DatePicker",
    focusable: true,

    /**
     * Programmatically performs a text component action. The user hits Enter on the input textfield.
     */
    doAction: function() {
        this.fireEvent({
            type: "action",
            source: this,
            actionCommand: this.get("actionCommand")});
    }
});

/** The locale model object describes regional settings. */
exxcellent.model.LocaleModel = Core.extend({
	prevText : null,
	nextText : null,
	weekText : null,
	monthNames : null,
	monthNamesShort : null,
	dayNames : null,
	dayNamesShort : null,
	dayNamesMin : null,
	dateFormat : null,
	firstDay : null,

	$construct : function(prevText, nextText, weekText, monthNames, monthNamesShort, dayNames, dayNamesShort, dayNamesMin, dateFormat, firstDay) {
		this.prevText = prevText;
		this.nextText = nextText;
		this.weekText = weekText;
		this.monthNames = monthNames;
		this.monthNamesShort = monthNamesShort;
		this.dayNames = dayNames;
		this.dayNamesShort = dayNamesShort;
		this.dayNamesMin = dayNamesMin;
		this.dateFormat = dateFormat;
		this.firstDay =	firstDay;
	},

	/** Return the string representation of this model. */
	toString : function() {
		return this.monthNames;
	}
});
/**
 * Component rendering peer: DatePicker.
 * <br/>This component consists of an input field and a date selection component, that hides
 * until the input field is clicked. The whole input field is based (copied) on the
 * Sync.TextComponent.js of echo3. It inherits all features and bugs. It was not inherited directly because
 * the focus management and some callbacks are different and would require changing the TextComponent itself.
 * <p>
 * Furthermore this component only describes the rendering of the inputfield and delegates all events to
 * the DatePicker.
 * </p>
 * Features:
 * <ul>
 * <li>input field is a copy of the a echo3 Textfield</li>
 * <li>DatePicker has i18n capabilities via a separate locale model</li>
 * <li>Supports SimpleDateFormat as used in JAVA</li>
 * <li>Supports selecting a single date</li>
 * <li>Supports showing multiple calendars</li>
 * <li>Restricts input field to allow only the values defined in the date format (regular expression)</li>
 * <li>NOT YET IMPLEMENTED: select date ranges (native support is available)</li>
 * <li>NOT YET IMPLEMENTED: select multiple dates (native support is available)</li>
 * </ul>
 * @author oliver pehnke <o.pehnke@exxcellent.de>
 */
exxcellent.DatePickerSync = Core.extend(Echo.Render.ComponentSync, {

    $load: function() {
        Echo.Render.registerPeer("exxcellent.DatePicker", this);
        Core.Web.Event.debugListenerCount = true;
    },

    $static: {

        /**
         * Array containing properties that may be updated without full re-render.
         * @type Array
         */
        _supportedPartialProperties: ["text", "editable"]
    },

    /** input field of the DatePicker. */
    _input: null,
    /** the jquery datePicker popup widget. */
    _datepicker: null,
    _renderRequired: null,

    /**
     * Flag indicating whether width has been set as a percentage.
     * @type Boolean
     */
    percentWidth: false,

    /**
     * The last processed value of the text field, i.e., the last value of the input field
     * that was stored in the component hierarchy.  When input is provided while restrictions
     * are in place, this value is not updated.
     */
    _lastProcessedValue: null,

    /**
     * Actual focus state of component, based on received DOM focus/blur events.
     * @type Boolean
     */
    _focused: false,

    /**
     * Describes how a component is initially built.
     */
    renderAdd: function(update, parentElement) {
        if (window.console && window.console.log) {
            window.console.log('Adding div (renderAdd).');
        }
        /* the input field for the date. */
        this._input = document.createElement("input");
        this._input.id = this.component.renderId;
        if (!this.component.render(exxcellent.DatePicker.EDITABLE, true)) {
            this._input.readOnly = true;
        }
        this._input.type = "text";
        var maximumLength = this.component.render(exxcellent.DatePicker.MAX_LENGTH, -1);
        if (maximumLength >= 0) {
            this._input.maxLength = maximumLength;
        }
        this._renderStyle(this._input);

        // add event listener to inputField
        Core.Web.Event.add(this._input, "focus", Core.method(this, this._processFocus), false);
        Core.Web.Event.add(this._input, "blur", Core.method(this, this._processBlur), false);
        Core.Web.Event.add(this._input, "keyup", Core.method(this, this._processKeyPresses), false);

        if (this.component.get(exxcellent.DatePicker.TEXT)) {
            this._input.value = this.component.get(exxcellent.DatePicker.TEXT);
        }

        /* add the modified stylesheet. */
        if (jQuery("#datepickerCss").length === 0) {
            var stylesheet = this._createStylesheet();
            jQuery("head").append("<style type=\"text/css\" id=\"datepickerCss\">" + stylesheet + "</style>");
        }
        this.renderAddToParent(parentElement);
    },

    /**
     * Describes how the component renders itself.<br/>
     * This method is also triggered if the renderUpdate decided to partially render the component!
     */
    renderDisplay: function() {
        if (window.console && window.console.log) {
            window.console.log('Displaying DatePicker (renderDisplay()).');
        }

        var width = this.component.render(exxcellent.DatePicker.WIDTH);
        if (width && Echo.Sync.Extent.isPercent(width) && this._input.parentNode.offsetWidth) {
            // If width is a percentage, reduce rendered percent width based on measured container size and border width,
            // such that border pixels will not make the component wider than specified percentage.
            var border = this.component.render(exxcellent.DatePicker.BORDER);
            var borderSize = border ?
                    (Echo.Sync.Border.getPixelSize(border, "left") + Echo.Sync.Border.getPixelSize(border, "right")) : 4;
            var insets = this.component.render(exxcellent.DatePicker.INSETS);
            if (insets) {
                var insetsPx = Echo.Sync.Insets.toPixels(insets);
                borderSize += insetsPx.left + insetsPx.right;
            }

            // Perform fairly ridiculous browser-specific adjustments.
            if (Core.Web.Env.ENGINE_MSHTML) {
                // Add additional 1px for IE.
                borderSize += 1;
                // Add default windows scroll bar width to border size for Internet Explorer browsers.
                if (this.container) {
                    this.container.style.width = this._adjustPercentWidth(parseInt(width, 10), 0,
                            this._input.parentNode.offsetWidth) + "%";
                    /*this.container.style.width = this._adjustPercentWidth(100, Core.Web.Measure.SCROLL_WIDTH,/ 
                     this._input.parentNode.offsetWidth) + "%";
                     */
                } else {
                    /*borderSize += Core.Web.Measure.SCROLL_WIDTH;*/
                }
            } else if (Core.Web.Env.BROWSER_SAFARI && this._input.nodeName.toLowerCase() == "input") {
                // Add additional 1px to INPUT elements for Safari.
                borderSize += 1;
            } else if (Core.Web.Env.ENGINE_PRESTO) {
                // Add additional 1px to all for Opera.
                borderSize += 1;
            }

            this._input.style.width = this._adjustPercentWidth(parseInt(width, 10), borderSize,
                    this._input.parentNode.offsetWidth) + "%";
        }
        if (!this._datepicker) {
            if (window.console && window.console.log) {
                window.console.log('Creating new DatePicker (renderDisplay()).');
            }
            var options = this._renderOptions();
            this._datepicker = $(this._input).datePicker(options);
        }
    },

    /**
     * Describes how a component is updated, e.g. destroyed and build again. The
     * DatePicker supports partially updates for text and editable property.
     */
    renderUpdate: function(update) {
        var fullRender = !Core.Arrays.containsAll(exxcellent.DatePickerSync._supportedPartialProperties,
                update.getUpdatedPropertyNames(), true);

        if (fullRender) {
            var element = this.container ? this.container : this._input;
            var containerElement = element.parentNode;
            this.renderDispose(update);
            containerElement.removeChild(element);
            this.renderAdd(update, containerElement);
        } else {
            if (update.hasUpdatedProperties()) {
                if (window.console && window.console.log) {
                    window.console.log('Rendering update.');
                }
                var textUpdate = update.getUpdatedProperty("text");
                if (textUpdate) {
                    var newValue = textUpdate.newValue === null ? "" : textUpdate.newValue;
                    if (newValue !== this._lastProcessedValue) {
                        this._input.value = newValue;
                        this._lastProcessedValue = newValue;
                    }
                }
                var editableUpdate = update.getUpdatedProperty("editable");
                if (editableUpdate != null) {
                    this._input.readOnly = !editableUpdate.newValue;
                    if (editableUpdate.newValue) {
                        $(this._input).removeClass("datepickerDisabled");
                    } else {
                        $(this._input).addClass("datepickerDisabled");
                    }
                }
            }
        }
        return false; // Child elements not supported: safe to return false.
    },

    /**
     * Describes how the component is destroyed.
     */
    renderDispose: function(update) {
        // These cleanup things are CRUCICAL to avoid DRASTIC memory leaks.
        //
        // Remove attached keylisteners from the DIV
        Core.Web.Event.removeAll(this._input);

        if (this._datepicker) {
            this._datepicker.pickerHide();
            this._datepicker.pickerDestroy();
        }

        this._focused = false;
        this._input = null;
        this._datepicker = null;
    },

    /**
     * Adds the input element to its parent in the DOM.
     * Wraps the element in a special container DIV if necessary to appease Internet Explorer's various text field/area bugs,
     * including percent-based text areas inducing scroll bars and the IE6 percentage width "growing" text area bug.
     *
     * @param parentElement the parent element
     */
    renderAddToParent: function(parentElement) {
        if (Core.Web.Env.BROWSER_INTERNET_EXPLORER && this.percentWidth) {
            this.container = document.createElement("div");
            this.container.appendChild(this._input);
            parentElement.appendChild(this.container);
        } else {
            parentElement.appendChild(this._input);
        }
    },

    /**
     * Reduces a percentage width by a number of pixels based on the container size.
     *
     * @param {Number} percentValue the percent span
     * @param {Number} reducePixels the number of pixels by which the percent span should be reduced
     * @param {Number} containerPixels the size of the container element
     */
    _adjustPercentWidth: function(percentValue, reducePixels, containerPixels) {
        var value = (100 - (100 * reducePixels / containerPixels)) * percentValue / 100;
        return value > 0 ? value : 0;
    },

    /**
     * Renders style information: colors, borders, font, insets, etc.
     * Sets percentWidth flag.
     */
    _renderStyle: function() {
        if (this.component.isRenderEnabled()) {
            Echo.Sync.renderComponentDefaults(this.component, this._input);
            Echo.Sync.Border.render(this.component.render(exxcellent.DatePicker.BORDER), this._input);
            Echo.Sync.FillImage.render(this.component.render(exxcellent.DatePicker.BACKGROUND_IMG), this._input);
        } else {
            Echo.Sync.LayoutDirection.render(this.component.getLayoutDirection(), this._input);
            Echo.Sync.Color.render(Echo.Sync.getEffectProperty(this.component, exxcellent.DatePicker.FOREGROUND, exxcellent.DatePicker.DISABLED_FOREGROUND, true),
                    this._input, "color");
            Echo.Sync.Color.render(Echo.Sync.getEffectProperty(this.component, exxcellent.DatePicker.BACKGROUND, exxcellent.DatePicker.DISABLED_BACKGROUND, true),
                    this._input, "backgroundColor");
            Echo.Sync.Border.render(Echo.Sync.getEffectProperty(this.component, exxcellent.DatePicker.BORDER, exxcellent.DatePicker.DISABLED_BORDER, true),
                    this._input);
            Echo.Sync.Font.render(Echo.Sync.getEffectProperty(this.component, exxcellent.DatePicker.FONT, exxcellent.DatePicker.DISABLED_FONT, true),
                    this._input);
            Echo.Sync.FillImage.render(Echo.Sync.getEffectProperty(this.component,
                    exxcellent.DatePicker.BACKGROUND_IMG, exxcellent.DatePicker.DISABLED_BACKGROUND_IMG, true), this._input);
        }
        Echo.Sync.Alignment.render(this.component.render(exxcellent.DatePicker.ALIGNMENT), this._input, false, null);
        Echo.Sync.Insets.render(this.component.render(exxcellent.DatePicker.INSETS), this._input, "padding");
        var width = this.component.render(exxcellent.DatePicker.WIDTH);
        this.percentWidth = Echo.Sync.Extent.isPercent(width);
        if (width) {
            if (this.percentWidth) {
                // Set width very small temporarily, renderDisplay will correct.
                this._input.style.width = "5px";
            } else {
                this._input.style.width = Echo.Sync.Extent.toCssValue(width, true);
            }
        }
        var height = this.component.render(exxcellent.DatePicker.HEIGHT);
        if (height) {
            this._input.style.height = Echo.Sync.Extent.toCssValue(height, false);
        }
        var toolTipText = this.component.render(exxcellent.DatePicker.TOOLTIP_TEXT);
        if (toolTipText) {
            this._input.title = toolTipText;
        }
    },

    /**
     * Renders all available options available for the DatePicker.
     * @see http://docs.jquery.com/UI/Datepicker#options
     */
    _renderOptions: function() {
        var localeModel = this._getLocaleModel();
        return Object({
            /* The desired event to trigger the date picker. Default: 'click'*/
            eventName: this.component.render(exxcellent.DatePicker.TRIGGER_EVENT),
            /* Callback function */
            onChange: this._onSelect,
            /* Number of calendars to render inside the date picker. Default 1*/
            calendars: this.component.render(exxcellent.DatePicker.NUMBER_OF_CALENDARS),
            /* HTML inserted to previous links. Default '◀' (UNICODE black left arrow)*/
            prev: localeModel.prevText,
            /* HTML inserted to next links. Default '▶' (UNICODE black right arrow)*/
            next: localeModel.nextText,
            /* The day week start. Default 1 (monday)*/
            start: localeModel.firstDay,
            /* Start view mode. Default 'days': ['days'|'months'|'years']*/
            view: this.component.render(exxcellent.DatePicker.VIEW_MODE),
            /* Date selection mode. Default 'single': ['single'|'multiple'|'range']*/
            mode: this.component.render(exxcellent.DatePicker.SELECTION_MODE),
            /* Whatever if the date picker is appended to the element or triggered by an event. Default false*/
            flat: this.component.render(exxcellent.DatePicker.FLAT_MODE),
            /* The initial date(s):
             * - as String (will be converted to Date object based on the format supplied),
             * - as Date object for single selection,
             * - as Array of Strings for multiple selection,
             * - as Array if Date objects for multiple selection*/
            //date: this._input.value,
            /* Undocumented well used field: should be the same as date? */
            //current: this._input.value,
            /* used for callbacks as THIS reference */
            owner: this,
            /* Date picker's position relative to the trigger element (non flat mode only): ['top'|'left'|'right'|'bottom'] */
            position: this.component.render(exxcellent.DatePicker.POSITION),
            /* Date format. Default 'Y-m-d'*/
            format: localeModel.dateFormat,
            /* If the datePicker is hidden after a date was selected. */
            hideOnSelect: this.component.render(exxcellent.DatePicker.HIDE_ON_SELECT),

            /* the locale hash*/
            locale: {
                days: localeModel.dayNames,
                daysShort: localeModel.dayNamesShort,
                daysMin: localeModel.dayNamesMin,
                months: localeModel.monthNames,
                monthsShort: localeModel.monthNamesShort,
                weekMin: localeModel.weekText
            }
        });
    },

    /**
     * Method to return the localeModel object.
     */
    _getLocaleModel : function() {
        var value = this.component.render(exxcellent.DatePicker.LOCALE_MODEL);
        var localeModel;
        if (value) {
            if (value instanceof exxcellent.model.LocaleModel) {
                localeModel = value;
            } else if (value) {
                localeModel = this._fromJsonString(value).localeModel;
            }
        }
        return localeModel;
    },

    /**
     * Method to parse a JSON string into an object.
     * @see "http://www.json.org/js.html"
     * @param {} json the string to be transformed into an object
     * @return {} the object
     */
    _fromJsonString : function(jsonStr) {
        return JSON.parse(jsonStr);
    },

    /**
     * Method to convert an object to a json string.
     * @see "http://www.json.org/js.html"
     * @param {} object the object to be transformed into string
     * @return {} the json string
     */
    _toJsonString : function(object) {
        return JSON.stringify(object);
    },

    /**
     * Creates a stylesheet with dynamically replaced images.
     * @return css String the stylesheet itself as text
     */
    _createStylesheet : function() {
        var css = this.component.render(exxcellent.DatePicker.CSS);
        if (css) {
            css = css.replace(/DATEPICKER_T/g, this.component.render(exxcellent.DatePicker.IMG_DATEPICKER_T));
            css = css.replace(/DATEPICKER_B/g, this.component.render(exxcellent.DatePicker.IMG_DATEPICKER_B));
            css = css.replace(/DATEPICKER_L/g, this.component.render(exxcellent.DatePicker.IMG_DATEPICKER_L));
            css = css.replace(/DATEPICKER_R/g, this.component.render(exxcellent.DatePicker.IMG_DATEPICKER_R));
            css = css.replace(/DATEPICKER_W/g, this.component.render(exxcellent.DatePicker.IMG_DATEPICKER_W));
            css = css.replace(/DATEPICKER_X/g, this.component.render(exxcellent.DatePicker.IMG_DATEPICKER_X));
            css = css.replace(/DATEPICKER_Y/g, this.component.render(exxcellent.DatePicker.IMG_DATEPICKER_Y));
            css = css.replace(/DATEPICKER_Z/g, this.component.render(exxcellent.DatePicker.IMG_DATEPICKER_Z));
        }
        return css;
    },

    /**
     * Method that is triggered if a date is selected in the DatePicker component popup.
     * 'this' refers to this component.
     * @param {} formatted - the date format
     * @param {} dates - the selected dates
     */
    _onSelect : function(formatted, dates) {
        if (this._debug && window.console && window.console.log) {
            window.console.log('OnSelect: ' + formated + ", " + dates);
        }
        this._input.value = formatted;
        this._storeValue.call(this, null);
    },

    /** Processes the blur event (focus lost).*/
    _processBlur: function(e) {
        if (window.console && window.console.log) {
            window.console.log('_processBlur()');
        }
        // dont set this._focused to true because _storeValue() triggers the renderUpdate
        // that will renderFocus again. This will show up the date picker again...
        this._focused = false;
        return this._storeValue();
    },

    /**
     * Processes all key up events. (keyPress event) hides the DatePicker.
     * @see http://www.quirksmode.org/dom/events/index.html
     */
    _processKeyPresses: function(e) {
        if (!this.client || !this.client.verifyInput(this.component)) {
            return true;
        }
        // any pressed key will trigger storing the value
        this._storeValue(e);

        //if (this._doFilterValue(e)) {
        // bubble the key event
        if (this._datepicker) {
            this._datepicker.pickerRemoteControl(e);
        }
        return true;
        //} else {
        // do not bubble event further, the key press is prevented.
        //	Core.Web.DOM.preventEventDefault(e);
        //	return false;
        //}
    },

    /**
     * Processes a focus event. Notifies application of focus.
     */
    _processFocus: function(e) {
        if (window.console && window.console.log) {
            window.console.log('_processFocus()');
        }
        this._focused = true;
        if (!this.client || !this.component.isActive()) {
            return true;
        }
        this.client.application.setFocusedComponent(this.component);
    },

    /**  @see Echo.Render.ComponentSync#getFocusFlags */
    getFocusFlags: function() {
        return Echo.Render.ComponentSync.FOCUS_PERMIT_ARROW_UP | Echo.Render.ComponentSync.FOCUS_PERMIT_ARROW_DOWN;
    },

    /**
     * Processes the focus receive event (focus receive).
     * @see Echo.Render.ComponentSync#renderFocus
     */
    renderFocus: function() {
        if (window.console && window.console.log) {
            window.console.log('renderFocus()');
        }
        Core.Web.DOM.focusElement(this._input);
    },

    /**
     * Event listener to process input after client input restrictions have been cleared.
     */
    _processRestrictionsClear: function() {
        if (!this.client) {
            // Component has been disposed, do nothing.
            return;
        }

        if (!this.client.verifyInput(this.component) || this._input.readOnly) {
            // Client is unwilling to accept input or component has been made read-only:
            // Reset value of text field to text property of component.
            this._input.value = this.component.get("text");
            return;
        }

        // All-clear, store current text value.
        this.component.set("text", this._input.value, true);
    },

    /**
     * Stores the current value of the input field, if the client will allow it.
     * If the client will not allow it, but the component itself is active, registers
     * a restriction listener to be notified when the client is clear of input restrictions
     * to store the value later.
     *
     * @param keyEvent the user keyboard event which triggered the value storage request (optional)
     */
    _storeValue: function(keyEvent) {
        if (window.console && window.console.log) {
            window.console.log('_storeValue(), keyEvent: ' + keyEvent + ', inputValue: ' + this._input.value + ', lastValue: ' + this._lastProcessedValue);
        }

        if (!this.client || !this.component.isActive()) {
            if (keyEvent) {
                // Prevent input.
                Core.Web.DOM.preventEventDefault(keyEvent);
            }
            return;
        }

        if (!this.client.verifyInput(this.component)) {
            // Component is willing to receive input, but client is not ready:  
            // Register listener to be notified when client input restrictions have been removed, 
            // but allow the change to be reflected in the text field temporarily.
            this.client.registerRestrictionListener(this.component, Core.method(this, this._processRestrictionsClear));
            return;
        }

        // Component and client are ready to receive input, set the component property and/or fire action event.
        this.component.set("text", this._input.value, true);
        this._lastProcessedValue = this._input.value;

        /* trigger the action if the user hits ENTER (13) */
        if (keyEvent && 13 == keyEvent.keyCode) {
            this.component.doAction();
        }
    },

    /**
     * The filter function implementation.
     * Inspired from echopoint.RegexTextField (@author Rakesh 2009-03-08)
     * @return <code>true</code> only if the key is allowed, otherwise <code>false</code>
     */
    _doFilterValue: function(event) {
        event = (event) ? event : window.event;
        var charCode = (event.which) ? event.which : event.keyCode;

        if (( charCode <= 31 ) || ( charCode == 37 ) || ( charCode == 39 )) {
            return true;
        }

        // Disable "paste" explicitly
        if (( event.metaKey || event.ctrlKey ) && ( charCode == 118 )) {
            return false;
        }

        var regexString = this.component.render(exxcellent.DatePicker.REGEX);
        if (regexString) {
            var position = this._getCaretPosition();
            var regex = new RegExp(regexString);
            var value = this._input.value.substring(0, position) + String.fromCharCode(charCode) + this._input.value.substring(position);
            return regex.test(value);
        } else {
            // no REGEX defined, so allow everything
            return true;
        }
    },

    /**
     * Return the caret position in the text field component.
     * Inspired from echopoint.RegexTextField (@author Rakesh 2009-03-08)
     */
    _getCaretPosition: function() {
        var position = ( this._input.value ) ? this._input.value.length : 0;

        if (document.selection) {
            // IE
            this._input.focus();
            var selection = document.selection.createRange();
            var length = document.selection.createRange().text.length;
            selection.moveStart('character', -this._input.value.length);
            position = selection.text.length - length;
        } else if (this._input.selectionStart ||
                this._input.selectionStart == '0') {
            // FireFox
            position = this._input.selectionStart;
        }
        return position;
    }
});
