/**
 * SuggestField
 * Component to show a suggestField with the possibility of a serverFilter
 * Makes use of an extended jQuerUI autocomplete PlugIn jQuery.ui.autocomplete
 * @author Ralf Enderle <r.enderle@exxcellent.de>
 * @version 1.0
 */
exxcellent.SuggestField = Core.extend(Echo.TextComponent, {

    $load: function () {
        Echo.ComponentFactory.registerType("exxcellent.SuggestField", this);
    },

    $static: {
        //SUGGEST_CONFIG: 'suggestConfig',
        SUGGEST_MODEL: 'suggestModel',
        DO_SERVER_FILTER: 'doServerFilter',

        // SUGGEST_CONFIG
        MIN_LENGTH: 'minLength',
        DELAY: 'delay',
        DISABLED: 'disabled',
        SHOW_DESCRIPTION: 'showDescription',
        SHOW_CATEGORY: 'showCategory',
        GROW_LEFT: 'growLeft',

        // Styling
        MAGNIFIER_IMG: 'magnifierImg',
        LOADING_IMG: 'loadingImg',
        SUGGEST_FONT: 'suggestFont',
        SUGGEST_FOREGROUND: 'suggestForeground',
        DESCRIPTION_FONT: 'descriptionFont',
        DESCRIPTION_FOREGROUND: 'descriptionForeground',
        SUGGEST_AREA_COLOR: 'suggestAreaColor',
        SUGGEST_AREA_HOVER: 'suggestAreaHover',

        TRIGGER_SERVER_FILTER: 'async_triggerServerFilter', // async-Method
        SUGGEST_ITEM_SELECTED: 'suggestItemSelected'
    },

    /** @see Echo.Component#componentType */
    componentType: "exxcellent.SuggestField",

    doTriggerServerFilter: function (inputData) {
        this.fireEvent({
            type: exxcellent.SuggestField.TRIGGER_SERVER_FILTER,
            source: this,
            data: inputData
        });
    },

    doFireSuggestItemSelected: function (inputData) {
        this.fireEvent({
            type: exxcellent.SuggestField.SUGGEST_ITEM_SELECTED,
            source: this,
            data: inputData
        });
    }


});

/**
 * DataObject for a suggestConfig
 */
exxcellent.config.SuggestConfig = Core.extend({
    minLength: 1,
    delay: 300,
    disabled: false,
    doServerFilter: false,
    showDescription: false,
    showCategory: false,
    growLeft: false,

    $construct: function () {
    },

    /** Return the string representation of this PieModel. */
    toString: function () {
        return '[SuggestConfig] - minLength: ' + this.minLength + ' delay: ' + this.delay +
            ' disabled: ' + this.disabled + ' serverFilter: ' + this.doServerFilter +
            ' showDescription: ' + this.showDescription + ' showCategory: ' + this.showCategory + ' growLeft' + this.growLeft;
    }
});

/**
 * DataObject for a SuggestModel
 */
exxcellent.model.SuggestModel = Core.extend({
    suggestItems: null,

    $construct: function (suggestItems) {
        this.suggestItems = suggestItems;
    },

    /** Return the string representation of this PieModel. */
    toString: function () {
        return '[SuggestModel] - Items: ' + this.suggestItems;
    }
});

/**
 * DataObject for a SuggestItem
 */
exxcellent.model.SuggestItem = Core.extend({
    label: null,
    description: null,
    category: null,
    idnetifier: null,


    $construct: function (label, description, category, identifier) {
        this.label = label;
        this.description = description;
        this.category = category;
        this.identifier = identifier;
    },

    /** Return the string representation of this PieModel. */
    toString: function () {
        return '[SuggestItem] - Label: ' + this.label + ' Description: ' + this.description + ' Category: ' + this.category + ' Identifier: ' + this.identifier;
    }
});

/**
 * Sync.SuggestField
 * Synchronisation component for Sync.SuggestField.js
 *
 * Makes use of an extended jQuerUI autocomplete PlugIn jQuery.ui.autocomplete
 * @author Ralf Enderle <r.enderle@exxcellent.de>
 * @version 1.0
 */
exxcellent.SuggestFieldSync = Core.extend(Echo.Sync.TextComponent, {

    $load: function () {
        Echo.Render.registerPeer("exxcellent.SuggestField", this);
    },

    $virtual: {

        /**
         * Input element type, either "text" or "password"
         * @type String
         */
        _type: "text"
    },

    _number: 1,
    _lastInput: null,
    _obsoleteInput: null,
    _isValidSuggestUpdate: null, // marker, if we have a valid update - if false, updateEvents will not be processed

    /** @see Echo.Render.ComponentSync#getFocusFlags */
    getFocusFlags: function () {
        //return Echo.Render.ComponentSync.FOCUS_PERMIT_ARROW_UP | Echo.Render.ComponentSync.FOCUS_PERMIT_ARROW_DOWN;
    },

    /** @see Echo.Render.ComponentSync#renderAdd */
    renderAdd: function (update, parentElement) {
        // first of all, we create the input-field
        this.input = document.createElement("input");


        this.input.id = this.component.renderId;
        if (!this.component.render("editable", true)) {
            this.input.readOnly = true;
        }
        this.input.type = this._type;
        var maximumLength = this.component.render("maximumLength", -1);
        if (maximumLength >= 0) {
            this.input.maxLength = maximumLength;
        }
        this._renderStyle(this.input);
        this._addEventHandlers(this.input);
        if (this.component.get("text")) {
            this.input.value = this.component.get("text");
        }
        if (this._lastInput) {
            this.input.value = this._lastInput;
        }

        // set obsoleteInput to actual
        this._obsoleteInput = this.input.value;

        // no jQuery is going to play with us :-)
        var _id = this.input;
        var self = this;
        var suggestConfig = this._getSuggestConfig();
        var orientation = {};
        if (suggestConfig.growLeft) {
            orientation.my = "right top"; //  <- force to grow from right to left :-)
            orientation.at = "right bottom";
            orientation.collision = "none";
            orientation.offset = "0 0";
            orientation.of = $(this.input);
        } else {
            orientation.my = "left top"; // <- force to grow from left to right this is default
            orientation.at = "left bottom";
            orientation.collision = "none";
            orientation.offset = "0 0";

        }
        $(_id).autocomplete(
            {
                disabled: suggestConfig.disabled,          // are we disabled...?
                delay: suggestConfig.delay,                // the delay - how long do we wait before triggering a search (is only for none-Serverfilter)
                position: orientation,                      // specify, how the suggestBox should grow and where to start
                minLength: suggestConfig.minLength,          // the minimum length of input, before we trigger a search
                source: function (request, response) {       // this function is a hook to collect the suggestData
                    response(self._getData());
                },
                styling: this._getUserDefinedStyle(),       // the style of the autocomplete
                doServerFilter: suggestConfig.doServerFilter, // property to indicate, if we have a server filter
                select: function (event, ui) {
                    self._suggestSelectCallback(ui.item);
                    self.input.value = ui.item.value;
                    return false;
                }
            }).data("autocomplete")._renderItem = function (ul, item) {
            return self._getRenderItem(ul, item, this.term, this);  // <- call our own implementation
        };

        // finally we add a keyUp handler to the input-field
        Core.Web.Event.add(this.input, "keyup",
            Core.method(this, this._processKeyUpInternal), false);
        // and a keydown for consuming ESC

        this.renderAddToParent(parentElement);
        Core.Web.Event.add(this.input, "keydown",
            Core.method(this, this._processKeyDownInternal), false);
    },

    /**
     * Called when an update occurs
     * @param update
     */
    renderUpdate: function (update) {
        var id = this.input;
        if (update.getUpdatedProperty(exxcellent.SuggestField.SUGGEST_MODEL)) {
            if (this._isValidSuggestUpdate) {
                $(id).autocomplete('search', id.value);
                $(id).autocomplete('setLoadingAnimation', false);
                var length = 0;
                if (this._obsoleteInput && id.value) {
                    length = id.value.length - this._obsoleteInput.length;
                }
                var i = 0;
                for (i = 0; i <= length + 1; i++) {
                    // we repos the suggestBox n-times. jQuery is not a friend if asynchronous Echo calls like we do here
                    $(id).autocomplete('repos');
                }
                this._obsoleteInput = id.value;
                this._isValidSuggestUpdate = false;

            }
            return;
        } else {
            // if any other property changed, we call super.renderUpdate
            Echo.Sync.TextComponent.prototype.renderUpdate.call(this, update);
        }
    },
    /**
     * Destroy the component
     * @param update
     */
    renderDispose: function (update) {
        $(this.input).autocomplete('destroy');
        // call super
        Echo.Sync.TextField.prototype.renderDispose.call(this, update);
    },

    /**
     * Callback to retrieve data
     */
    _getData: function () {
        var availableTags = this._getSuggestModel().suggestItems;
        return availableTags;
    },

    /**
     * Returns the defined style - this will be merged will the default style of the jQuery UI autocomplete component
     */
    _getUserDefinedStyle: function () {
        var style = {
            magnifier_img: Echo.Sync.ImageReference.getUrl(this.component.render(exxcellent.SuggestField.MAGNIFIER_IMG)),
            loading_img: Echo.Sync.ImageReference.getUrl(this.component.render(exxcellent.SuggestField.LOADING_IMG)),
            suggestFont: this.component.render(exxcellent.SuggestField.SUGGEST_FONT),
            suggestForeground: this.component.render(exxcellent.SuggestField.SUGGEST_FOREGROUND),
            descriptionFont: this.component.render(exxcellent.SuggestField.DESCRIPTION_FONT),
            descriptionForeground: this.component.render(exxcellent.SuggestField.DESCRIPTION_FOREGROUND),
            suggestAreaColor: this.component.render(exxcellent.SuggestField.SUGGEST_AREA_COLOR),
            suggestAreaHover: this.component.render(exxcellent.SuggestField.SUGGEST_AREA_HOVER)
        };

        return style;
    },

    /**
     * Get the item that will be rendered in the suggestBox
     * @param ul
     * @param item
     * @param term - the term the user has written to the textField
     * @param that - the jQuery Object
     */
    _getRenderItem: function (ul, item, term, that) {
        // RegExp-Voodoo: replace the userInput in with a bold character
        var t = item.label.replace(
            new RegExp(
                "(?![^&;]+;)(?!<[^<>]*)(" +
                    $.ui.autocomplete.escapeRegex(term) +
                    ")(?![^<>]*>)(?![^&;]+;)", "gi"
            ), "<strong>$1</strong>");

        // now we first get the styling for the main-Text
        var mainStyle = this._getFontAsStyle(that.styling.suggestFont, that.styling.suggestForeground);
        var labelText = '' +
            '<a>' + // <- we open a section the we call 'a' ******************************
            '<span ' + mainStyle + '>' +
            t + // <- this is our text
            '</span>';

        var suggestConfig = this._getSuggestConfig();
        if (suggestConfig.showDescription) {
            // if we have to show a description, we get the stylung for description
            var descrStyle = this._getFontAsStyle(that.styling.descriptionFont, that.styling.descriptionForeground);
            labelText = labelText +
                '<br>' + // <- a new line
                '<span ' + descrStyle + '>' + // <- the styling
                ((item.description) ? item.description : '-') + // <- the description itself
                '</span>';
        }
        labelText = labelText + '</a>'; // <- finally we close the whole section ****************

        return $("<li></li>")
            .data("item.autocomplete", item)
            .append(labelText)
            .appendTo(ul);
    },

    /**
     * Returns the font and color as String for styling
     * @param font
     * @param color
     */
    _getFontAsStyle: function (font, color) {
        if (font === null) {
            return '';
        }
        var style = 'style = "' +
            ' font-family:' + (font.typeface instanceof Array ? '\'' + font.typeface.join('\', \'') + '\'' : ('\'' + font.typeface + '\'')) + ';' + // <- if it is an array, we have to split
            ' font-size:' + font.size + ';' +
            ' font-style:' + ((font.italic) ? 'italic' : 'normal') + ';' +
            ' font-weight:' + ((font.bold) ? 'bold' : 'normal') + ';' +
            ' text-decoration:' + ((font.underline) ? 'underline' : ((font.overline) ? 'overline' : ((font.lineThrough) ? 'line-through' : 'normal'))) + ';' +
            ' color:' + ((color) ? color : '#000000') +
            '" ';
        return style;
    },

    /**
     * Do not use anymore!
     * @param ul
     * @param item
     *
     * @deprecated
     */
    _getRenderItem_OLD: function (ul, item) {
        var suggestConfig = this._getSuggestConfig();
        var labelText = '<a>' + item.label;
        if (suggestConfig.showDescription) {
            labelText = labelText + '<br>' + '<i>' + item.description + '</i>';
        }
        labelText = labelText + '</a>';
        return $("<li></li>")
            .data("item.autocomplete", item)
            .append(labelText)
            .appendTo(ul);
    },

    /**
     * Allows all input.
     * @see Echo.Sync.TextComponent#sanitizeInput
     */
    sanitizeInput: function () {
        // allow all input
    },

    /**
     * Callback for a selection of a suggestItem
     * @param suggestItem
     */
    _suggestSelectCallback: function (suggestItem) {
        // force a setText and then call the super.clientKeyUp - we want to make sure, that the input is in sync with the component
        this.component.set("text", suggestItem.label, true);
        if (this.component.get("text")) {
            this.input.value = this.component.get("text");
        }
//        this._storeSelection();
        Echo.Sync.TextComponent.prototype.clientKeyUp.call(this);

        // now fire the SuggestItemSelected...:
        this.component.doFireSuggestItemSelected(suggestItem.identifier);
    },

    /**
     * Processes a KeyUp-Event
     * @param e
     */
    _processKeyUpInternal: function (e) {
        // we call the super.clientKeyUp - we want to make sure, that the input is in sync with the component
        Echo.Sync.TextComponent.prototype.clientKeyUp.call(this, e);
        var inField = this.input;
        var self = this;

        this._lastInput = inField.value;
        // if there is no serverFilter, we can return - jQuery will handle keyEvents for us :-)
        var suggestConfig = this._getSuggestConfig();
        if (!suggestConfig.doServerFilter) {
            return;
        }

        // if we have a server filter have some own implemetation on keyEvents because of the asynchronous behaviour
        var keyCode = $.ui.keyCode;
        switch (e.keyCode) {
            case keyCode.ENTER:
            case keyCode.NUMPAD_ENTER:
                clearTimeout(inField.searching);
                this._isValidSuggestUpdate = false;
                $(inField).autocomplete('setLoadingAnimation', false);
                $(inField).autocomplete('close');
                return true;
            case keyCode.PAGE_UP:
            case keyCode.PAGE_DOWN:
            case keyCode.UP:
            case keyCode.DOWN:
            case keyCode.TAB:
                // do nothing here - navigation is handled by jQuery
                break;
            case keyCode.ESCAPE:
                clearTimeout(inField.searching);
                $(inField).autocomplete('close');
                Core.Web.DOM.stopEventPropagation(e);
                break;
            default:
                // we start searching
                var defMinLength = suggestConfig.minLength;
                var currentLength = this.input.value.length;
                if (currentLength >= defMinLength) {
                    clearTimeout(self.searching);
                    this._isValidSuggestUpdate = true;
                    self.searching = setTimeout(function () {
                        self._triggerServerFilter();
                    }, 500);
                }
        }


    },

    /**
     * Processes KeyDown-Events from suggestField
     * @param e
     */
    _processKeyDownInternal: function (e) {
        var inField = this.input;
        var keyCode = $.ui.keyCode;
        switch (e.keyCode) {
            // Just in case of ESCAPE
            case keyCode.ESCAPE:
                if (!$(inField).autocomplete('isSuggestBoxVisible')) {
                    // if SuggestBox is not visible, we do not consume the event - maybe another GUI-Element will then react on it
                    // e.g. the active WorkingPanel could be closed by ESCAPE etc.
                    return true;
                }
                // but if the box is visible, the ESCAPE is OUR event - close suggest!
                clearTimeout(inField.searching);
                $(inField).autocomplete('close');
                Core.Web.DOM.stopEventPropagation(e);  // <- stop propagating, we don´t want others to inform about ESCAPE in this case
                break;
            // Handle ENTER and NUMPAD_ENTER -> do not consume it here, maybe there is another ActionListener, that will be informed
            case keyCode.ENTER:
            case keyCode.NUMPAD_ENTER:
                clearTimeout(inField.searching);
                this._isValidSuggestUpdate = false;
                $(inField).autocomplete('setLoadingAnimation', false);
                $(inField).autocomplete('close');
                // so we throw it back with true -> echo will look for other listeners for us
                return true;
        }


    },

    /**
     * will be triggered after a certain of time
     */
    _triggerServerFilter: function () {
        if (this._isValidSuggestUpdate) {
            var inField = this.input;
            $(inField).autocomplete('setLoadingAnimation', true);
            this.component.doTriggerServerFilter(inField.value);
        }
    },

    /**
     * Returns the config for the suggestField
     */
    _getSuggestConfig: function () {
        // we have some defaultValues
        var suggestConfig = new exxcellent.config.SuggestConfig();
        suggestConfig.minLength = this.component.render(exxcellent.SuggestField.MIN_LENGTH) || 1;
        suggestConfig.delay = this.component.render(exxcellent.SuggestField.DELAY) || 300;
        suggestConfig.disabled = this.component.render(exxcellent.SuggestField.DISABLED) || false;
        suggestConfig.doServerFilter = this.component.render(exxcellent.SuggestField.DO_SERVER_FILTER) || false;
        suggestConfig.showDescription = this.component.render(exxcellent.SuggestField.SHOW_DESCRIPTION) || false;
        suggestConfig.showCategory = this.component.render(exxcellent.SuggestField.SHOW_CATEGORY) || false;
        suggestConfig.growLeft = this.component.render(exxcellent.SuggestField.GROW_LEFT) || false;
        return suggestConfig;
    },
    /**
     * Get the Suggest-Model.
     * In case of a JSON-Object we parse it to create the exxcellent.model.SuggestModel
     */
    _getSuggestModel: function () {
        var value = this.component.render(exxcellent.SuggestField.SUGGEST_MODEL);
        if (value instanceof exxcellent.model.SuggestModel) {
            return value;
        } else if (value) {
            return this._fromJsonString(value).suggestModel;
        }
    },

    /**
     * Method to parse a JSON string into an object.
     * @see "http://www.json.org/js.html"
     * @param {} json the string to be transformed into an object
     * @return {} the object
     */
    _fromJsonString: function (jsonStr) {
        return JSON.parse(jsonStr);
    },

    /**
     * Method to convert an object to a json string.
     * @see "http://www.json.org/js.html"
     * @param {} object the object to be transformed into string
     * @return {} the json string
     */
    _toJsonString: function (object) {
        return JSON.stringify(object);
    }
});

