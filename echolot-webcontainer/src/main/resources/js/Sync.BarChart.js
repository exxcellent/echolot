/**
 * BarChart Version 1.0
 * Used to draw fancy BarCharts as an Echo-Component with the help
 * of raphael and the eXXcellent Addon-Library 'exx.raphael'
 * See 'http://raphaeljs.com/' for further information
 * (This component was inspired from: http://g.raphaeljs.com/barchart2.html)
 *
 * @author Ralf Enderle <r.enderle@exxcellent.de>
 * @version 1.0
 */
exxcellent.BarChart = Core.extend(Echo.Component, {
    $load: function() {
        Echo.ComponentFactory.registerType('exxcellent.BarChart', this);
    },
    $static: {
        // some Layout-Data
        WIDTH: 'width',
        HEIGHT: 'height',
        BACKGROUND: 'background',
        // FOREGROUND and FONT can not be set on this component - it makes no sence at this time... maybe we will find some use for them later on
        //        FOREGROUND: 'foreground',
        //        FONT: 'font',
        XGAP: 'xgap',
        YGAP: 'ygap',
        BAR_ALIGNMENT: 'barAlignment',
        HEAD_TYPE: 'headType',
        STACKED: 'stacked',

        SHOW_POPUP: 'showPopup',
        POPUP_BACKGROUND: 'popupBackground',
        POPUP_BORDER_COLOR: 'popupBorderColor',
        POPUP_FOREGROUND: 'popupForeground',
        POPUP_FONT: 'popupFont',

        SHOW_TOOLTIP: 'showTooltip',
        AUTO_ADJUST_POPUP: 'autoAdjustPopup',

        // - comes from JSON
        BAR_CHART_MODEL: 'barChartModel',

        // Action-data
        BAR_SELECTION: 'barSelection'
    },
    componentType: 'exxcellent.BarChart',
    doSelectBar : function(barIdentifier) {
        // 	Notify table row select listeners.
        this.fireEvent({
            type : exxcellent.BarChart.BAR_SELECTION,
            source : this,
            data : barIdentifier
        });
    }

});

// some dataObjects for BarChart:
// -----------------------------

/**
 * The data object for the PieModel.
 * The only thing you HAVE to specify is 'sectors'
 */
exxcellent.model.BarChartModel = Core.extend({

    // The bars in this barChart
    // CAUTION! It's an array of arrays containing bars
    // e.g. [[bar1, bar2],[bar3, bar4]]
    barValues: null,

    $construct : function(barValues) {
        this.barValues = barValues;
    },

    /** Return the string representation of this PieModel. */
    toString : function() {
        return 'I am a BAR-Chart';
    }
});

/**
 * The data object for a Bar
 */
exxcellent.model.Bar = Core.extend({
    value: null,
    identifier: null,
    label: '',
    color: null,

    $construct : function(value, label, identifier, color) {
        this.value = value;
        this.label = label;
        this.identifier = identifier;
        this.color = color;
    },

    /** Return the string representation of this Bar */
    toString : function() {
        return 'Label:' + this.label + ' value:' + this.value + ' color:' + this.color + ' identifier:' + this.identifier;
    }
});

/**
 * LayoutObject for a barChart
 */
exxcellent.model.BarChartLayout = Core.extend({
    // vertical: |__
    //           |__
    //
    // horizontal: | |
    //             |_|_|
    barAlignment: 'vertical',
    // Visual type of the bar-Head
    //         _          _         _         _
    // square: |_| soft : |_] round |_) sharp |_>
    headType: 'square',
    // should the different values be stacked
    stacked: false,
    // show the PopUp?
    showPopup: true,
    // styling of the popup
    popupBackground: '#000',
    popupBorderColor: '#666',
    popupForeground: '#fff',
    popupFont: null,
    // wanna have some Tooltips
    showTooltip: false,
    // should we try to autoAdjust the PopUp?
    autoAdjustPopup: false,

    width: 100,
    height: 100,

    xgap: 1,
    ygap: 1


});

/**
 * Sync.BarChart
 *
 * BarChartSync Version 1.0
 * Component rendering peer: Sync.BarChart.js
 * This sync renders a BarChart to the DOM.
 *
 * @author Ralf Enderle <r.enderle@exxcellent.de>
 * @version 1.0
 */
exxcellent.BarChartSync = Core.extend(Echo.Render.ComponentSync, {
    $load: function() {
        Echo.Render.registerPeer("exxcellent.BarChart", this);
    },

    $static: {
        // nothing yet
    },
    _div: null,
    _raphael: null,

    /**
     * Add the containerDiv of the bar to the DOM
     * @param update
     * @param parentElement
     */
    renderAdd: function(update, parentElement) {
        // we only need to create the holder' div for raphael - the rest will be done in renderDisplay
        this._div = document.createElement("div");

        // if there is a background defined
        var background = this.component.render(exxcellent.BarChart.BACKGROUND);
        if (background) {
            this._div.style.background = background;
        }

        parentElement.appendChild(this._div);
    },
    /**
     * Render the bar itself to the containerDiv
     */
    renderDisplay: function() {
        var self = this; // it's always good to know who you are in JS :-)
        if (this._raphael) {
            // if we have already a raphael, we do nothing att all - it's just a simple refresh
            return;
        }

        // some helperVars
        var barChartLayout = this._getBarChartLayout();
        var barChartModel = this._getBarChartModel();

        // Instead of throwing an error that something is undefined, we just show nothing
        if (!barChartModel) {
            return;
        }

        // we define the raphael
        this._raphael = Raphael(this._div, barChartLayout.width, barChartLayout.height);
        // a local pointer to raphael - we will pass this to the callbacks
        var raphael_self = this._raphael;
        // an now let's start raphael drawing the barChart

        // we decide between vertical and horizontal
        // Maybe we could use some JS-Voodoo to have just on call with +-h :-) - but it seems to work
        if (barChartLayout.barAlignment == 'horizontal') {
            this._raphael.g.hbarchart(
                    barChartLayout.xgap, // x-gap
                    barChartLayout.ygap, // y-gap
                    barChartLayout.width, // width
                    barChartLayout.height, // height
                    null, // original 'values' : Changed the behavior tu use this in Echo3 - the model is transported to simile via the attribute 'barChartModel'
                /*options*/
                /**/{
                /*->*/stacked: barChartLayout.stacked, // isStacked
                /*->*/type: barChartLayout.headType, // headType
                /*->*/vgutter: 0, // the empty-spacing vertically
                /*->*/showTooltip: barChartLayout.showTooltip
                /**/},
                    barChartModel // the barModel (array of array of exxcellent.model.Bar
                    ).// callbacks
                    hover(// MouseHovering:
                    this._fin(barChartLayout, raphael_self), // MouseIn
                    this._fout(barChartLayout, raphael_self) // MouseOut
                    ).// end of MouseHovering
                    click(this._click(this, raphael_self))// Click-Handler
                    ; // -> that's it :-)
        } else if (barChartLayout.barAlignment == 'vertical') {
            // just some little difference, we call barchart instead of hbarchart
            this._raphael.g.barchart(
                    barChartLayout.xgap, // x-gap
                    barChartLayout.ygap, // y-gap
                    barChartLayout.width, // width
                    barChartLayout.height, // height
                    null, // original 'values' : Changed the behavior tu use this in Echo3 - the model is transported to simile via the attribute 'barChartModel'
                /*options*/
                /**/{
                /*->*/stacked: barChartLayout.stacked, // isStacked
                /*->*/type: barChartLayout.headType, // headType
                /*->*/vgutter: 0, // the empty-spacing vertically
                /*->*/showTooltip: barChartLayout.showTooltip
                /**/},
                    barChartModel // the barModel (array of array of exxcellent.model.Bar
                    ).// callbacks
                    hover(// MouseHovering:
                    this._fin(barChartLayout, raphael_self), // MouseIn
                    this._fout(barChartLayout, raphael_self) // MouseOut
                    ).// end of MouseHovering
                    click(this._click(this, raphael_self))// Click-Handler
                    ; // -> that's it :-)

        }
    },

    /**
     * Called when the component is destroyed!
     * We clean all allocated data
     * @param update
     */
    renderDispose: function(update) {
        // setting all globals to null - we don't want them to live forever ;-)
        this._div = null;
        this._raphael = null;
    },
    /**
     * Called when an update happens.
     *
     * @param update
     */
    renderUpdate: function(update) {
        // Brut-force - just create everything new
        // we could think about of some ajax-feature, but there is no need so far
        var element = this._div;
        this._raphael = null; // we set the Raphael to null to force a redraw
        var containerElement = element.parentNode;
        Echo.Render.renderComponentDispose(update, update.parent);
        containerElement.removeChild(element);
        this.renderAdd(update, containerElement);
        return true;
    },

    // --- own methods ---
    // -------------------

    /**
     * Callback for MouseIn
     * @param raphael
     */
    _fin : function (barChartLayout, raphael) {
        return function() {
            if (barChartLayout.showPopup) {
                var direction = 'top';
                if (barChartLayout.autoAdjustPopup) {
                    // damn IE vs. FF... IE defines canvas.clientWidth and FF paper.width... :-(
                    var widthToTest = (this.paper.canvas.clientWidth && this.paper.canvas.clientWidth != 0) ? this.paper.canvas.clientWidth : this.paper.width;
                    var heightToTest = (this.paper.canvas.clientHeight && this.paper.canvas.clientHeight != 0) ? this.paper.canvas.clientHeight : this.paper.height;
                    // we try to adjust the PopUp
                    if (this.bar.x > widthToTest - 50 && this.bar.y > heightToTest - 50) {
                        direction = 'top-right';
                    } else if (this.bar.x < 50 && this.bar.y > heightToTest - 50) {
                        direction = 'top-left';
                    } else if (this.bar.x > widthToTest - 50) {
                        direction = 'bottom-right';
                    } else if (this.bar.x < 50) {
                        direction = 'bottom-left';
                    } else if (this.bar.y < 50) {
                        direction = 'bottom';
                    }
                }
                var popupTextFill = {fill: barChartLayout.popupForeground};
                var popUpFont = barChartLayout.popupFont;
                this.popUpLabel = raphael.text(0, 0, this.bar.Bar.label || "0").attr(popupTextFill).attr(popUpFont);
                this.popUpBubble = raphael.popup(this.bar.x, this.bar.y, this.popUpLabel, direction).attr({fill: barChartLayout.popupBackground, stroke: barChartLayout.popupBorderColor, "stroke-width": 2, "fill-opacity": .7});
            }
        }

    },

    /**
     * Callback for MouseOut
     * @param raphael
     */
    _fout : function (barChartLayout, raphael) {
        // we certainly don't need the variable raphael... bu who knows what's later on
        return function() {
            if (barChartLayout.showPopup) {
                this.popUpLabel.animate({opacity: 0}, 300, function () {
                    this.remove();
                });
                this.popUpBubble.animate({opacity: 0}, 300, function () {
                    this.remove();
                });
            }
        }
    },

    /**
     * Callback for clicking a bar
     * @param self
     * @param raphael
     */
    _click : function (self, raphael) {
        // we certainly don't need the variable raphael... bu who knows what's later on
        return function() {
            // throw the action 'doSelectBar' with the identifier
            self.component.doSelectBar(this.bar.Bar.identifier);
        }

    },

    /**
     * Returns the BarChartLayout - this Objects helps to deal with Layout
     * @see exxcellent.model.BarChartLayout for further details
     */
    _getBarChartLayout : function() {
        // We try to get all values defined by the user. For Fallback there are defaults defined where suitable
        var barChartLayout = new exxcellent.model.BarChartLayout();
        barChartLayout.width = this.component.render(exxcellent.BarChart.WIDTH) || 100;
        barChartLayout.height = this.component.render(exxcellent.BarChart.HEIGHT) || 100;
        barChartLayout.xgap = this.component.render(exxcellent.BarChart.XGAP) || 1;
        barChartLayout.ygap = this.component.render(exxcellent.BarChart.YGAP) || 1;
        barChartLayout.barAlignment = this.component.render(exxcellent.BarChart.BAR_ALIGNMENT) || 'vertical';
        barChartLayout.headType = this.component.render(exxcellent.BarChart.HEAD_TYPE) || 'square';
        barChartLayout.stacked = this.component.render(exxcellent.BarChart.STACKED) || false;
        barChartLayout.showPopup = this.component.render(exxcellent.BarChart.SHOW_POPUP) || false;
        barChartLayout.popupBackground = this.component.render(exxcellent.BarChart.POPUP_BACKGROUND) || '#000';
        barChartLayout.popupBorderColor = this.component.render(exxcellent.BarChart.POPUP_BORDER_COLOR) || '#666';
        barChartLayout.popupForeground = this.component.render(exxcellent.BarChart.POPUP_FOREGROUND) || '#fff';
        barChartLayout.popupFont = this._renderFont(this.component.render(exxcellent.BarChart.POPUP_FONT)) || {font: '10px Helvetica, Arial'};
        barChartLayout.showTooltip = this.component.render(exxcellent.BarChart.SHOW_TOOLTIP) || false;
        barChartLayout.autoAdjustPopup = this.component.render(exxcellent.BarChart.AUTO_ADJUST_POPUP) || false;
        return barChartLayout;
    },

    /**
     * Get the BarChart-Model.
     * In case of a JSON-Object we parse it to create the exxcellent.model.BarChartModel
     */
    _getBarChartModel : function () {
        var value = this.component.render(exxcellent.BarChart.BAR_CHART_MODEL);
        if (value instanceof exxcellent.model.BarChartModel) {
            return value;
        } else if (value) {
            return this._fromJsonString(value).barChartModel;
        }
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
     * Renders the font to be used by the PieChart component.
     * @param font {Echo.Sync.Font} the font to render as notifier compatible font
     * @return the raphael compatible font
     */
    _renderFont: function(font) {
        if (font == null) return null;
        var fontByEcho = {
            style: new Object()
        }
        Echo.Sync.Font.render(font, fontByEcho);
        var echoStyle = fontByEcho.style;

        return {
            'font' : echoStyle.fontSize + ' ' + echoStyle.fontFamily,
            'font-family' : echoStyle.fontFamily,
            'font-size' : echoStyle.fontSize,
            'font-style' : echoStyle.fontStyle
        }

    }
});