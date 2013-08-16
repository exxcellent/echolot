/**
 * PieChart Version 1.0
 * Used to draw nice PieCharts as an Echo-Component with the help
 * of raphael and g.raphael.
 * See
 * - http://raphaeljs.com/
 * - http://g.raphaeljs.com/
 * for further information
 *
 * @author Ralf Enderle  <r.enderle@exxcellent.de>
 * @version 1.0
 */
exxcellent.PieChart = Core.extend(Echo.Component, {
    $load: function () {
        Echo.ComponentFactory.registerType('exxcellent.PieChart', this);
    },

    $static: {
        PIE_MODEL: 'pieModel',

        LEGEND_FONT: 'font', // <- it is the property of 'Echo.Component'
        LEGEND_FOREGROUND: 'foreground', // <- it is the property of 'Echo.Component'
        LEGEND_POSITION: 'legendPosition',
        LEGEND_GAP_FACTOR: 'legendGapFactor',
        LEGEND_HIDE_ZERO_VALUES: 'legendHideZeroValues', // Hide zero values in legend?
        SHOW_LEGEND: 'showLegend',

        SHOW_POPUP: 'showPopUp',
        POPUP_BACKGROUND: 'popupBackground',
        POPUP_BORDER_COLOR: 'popupBorderColor',
        POPUP_FOREGROUND: 'popupForeground',
        POPUP_FONT: 'popupFont',

        DO_ANIMATION: 'doAnimation',
        ANIMATION_TYPE: 'animationType',

        DO_CLIENT_SORTING: 'doClientSorting',

        SECTOR_ABBREV_SHOW: 'sectorAbbrevShow', // wanna have some defined abbreviation in your sectors, toggle this to: true
        SECTOR_ABBREV_FONT: 'sectorAbbrevFont', // the font of the Abbreviation
        SECTOR_ABBREV_FOREGROUND: 'sectorAbbrevForeground', // the foreground-color of the abbreviation, every sector can define it's own if there is a need to do so

        WIDTH: 'width',
        HEIGHT: 'height',
        BACKGROUND: 'background',

        // fallback-colors - if you define no special color for a sector in the pie the next valid fallback-color will be used
        FALLBACK_SECTOR_COLOR_0: 'fallbackSectorColor_0',
        FALLBACK_SECTOR_COLOR_1: 'fallbackSectorColor_1',
        FALLBACK_SECTOR_COLOR_2: 'fallbackSectorColor_2',
        FALLBACK_SECTOR_COLOR_3: 'fallbackSectorColor_3',
        FALLBACK_SECTOR_COLOR_4: 'fallbackSectorColor_4',
        FALLBACK_SECTOR_COLOR_5: 'fallbackSectorColor_5',
        FALLBACK_SECTOR_COLOR_6: 'fallbackSectorColor_6',
        FALLBACK_SECTOR_COLOR_7: 'fallbackSectorColor_7',
        FALLBACK_SECTOR_COLOR_8: 'fallbackSectorColor_8',
        FALLBACK_SECTOR_COLOR_9: 'fallbackSectorColor_9',

        PIE_SECTOR_SELECT: 'pieSectorSelect'
    },
    componentType: 'exxcellent.PieChart',
    /** Perform when an select sector action is triggered in the PieChart. */
    doSelectPieSector: function (pieSectorSelection) {
        this.fireEvent({
            type: exxcellent.PieChart.PIE_SECTOR_SELECT,
            source: this,
            data: pieSectorSelection
        });
    }
});

// some DataObjects for the PIE:
// -----------------------------

/**
 * The data object for the PieModel.
 * The only thing you HAVE to specify is 'sectors'
 * All other attributes will come with suitable default values.
 */
exxcellent.model.PieModel = Core.extend({

    /** The sectors in this pie */
    sectors: null,

    $construct: function (sectors) {
        this.sectors = sectors;
    },

    /** Return the string representation of this PieModel. */
    toString: function () {
        return 'I am a PIE';
    }
});

/** The data object for a sector in a pie. */
exxcellent.model.PieSector = Core.extend({

    // The name of the pie
    name: null,

    // The data-value for this PieSector
    value: null,

    // The label shown on popUp
    popUpLabel: null,

    // the abbreviation
    abbreviation: null,

    // the foreground of the abbreviation
    abbreviationForeground: null,

    // Should we show the percent-Value of the sector in the legend...?
    showPercentage: false,

    // the color of this sector
    color: null,

    identifier: null,

    $construct: function (name, value, popUpLabel, showPercentage, color, abbreviation, abbreviationForeground, identifier) {
        this.name = name;
        this.value = value;
        this.popUpLabel = popUpLabel;
        if (typeof showPercentage != 'undefined') {
            this.showPercentage = showPercentage;
        }
        this.color = color;
        this.abbreviation = abbreviation;
        this.abbreviationForeground = abbreviationForeground;
        this.identifier = identifier;
    },

    /** Return the string representation of this sector. */
    toString: function () {
        return this.name;
    }
});

/**
 * PieChartSync Version 1.0
 * Component rendering peer: PieChart
 * This sync renders a PieChart to the DOM.
 *
 * @author Ralf Enderle <r.enderle@exxcellent.de>
 */
exxcellent.PieChartSync = Core.extend(Echo.Render.ComponentSync, {
    $load: function () {
        Echo.Render.registerPeer("exxcellent.PieChart", this);
    },

    $static: {
        _offsetValue: 16, // static offset to calculate spacing
        _scaleFactor: 1.1, // the scaling of the animation
        _percentageDelimiter: '-', // delimiter for percentage maybe we want to configure this via styling properties
        _minHorizontalSpaceForLegend: 100
    },

    _div: null,
    _raphael: null,

    /**
     * Add the containerDiv of the pie to the DOM
     * @param update
     * @param parentElement
     */
    renderAdd: function (update, parentElement) {
        this._div = document.createElement("div");

        // if there is a background defined
        var background = this.component.render(exxcellent.PieChart.BACKGROUND);
        if (background) {
            this._div.style.background = background;
        }

        // nothing else to do yet

        parentElement.appendChild(this._div);
    },

    /**
     * Render the pie itself to the containerDiv
     */
    renderDisplay: function () {
        var self = this;
        if (this._raphael) {
            // if we have already a raphael, we do nothing att all - it's just a simple refresh
            return;
        }

        var pieModel = this._getPieModel();
        // if there is no pie-Model defined, we just do nothing... better than creating an error inside raphael
        if (!pieModel) {
            return;
        }
        var style = this._getStyle();
        style.nextFallbackColor = function () {
            // closure for fallback-colors
            var currentCount = -1; // start at -1, we will do a ++ first in closure
            var fallbackColorArrayInner = style.fallbackColorArray;
            return function () {
                currentCount++;
                // if the next defined color in the is null, we start looping
                while (fallbackColorArrayInner[currentCount % 10] === null) {
                    currentCount++;
                    // we stop at 0 - makes no sensee to search any more
                    if (currentCount % 10 === 0) {
                        // if we are at position 0 and have no color, then return some kind of black
                        return fallbackColorArrayInner[currentCount % 10] || '#000';
                    }
                }
                // normally we just return the color in the array
                return fallbackColorArrayInner[currentCount % 10];
            };
        };

        var height = this.component.render(exxcellent.PieChart.HEIGHT) || 100; // <- we have some default
        var width = this.component.render(exxcellent.PieChart.WIDTH) || 100; // we have some default

        var radius = this._calculatePieRadius(width, height, style.showLegend, style.legendPosition, pieModel.sectors.length);

        var sectors = pieModel.sectors; // the various sectors of the pie

        // calculate layout-data
        var x_offset = radius + (exxcellent.PieChartSync._offsetValue * exxcellent.PieChartSync._scaleFactor);
        var y_offset = radius + (exxcellent.PieChartSync._offsetValue * exxcellent.PieChartSync._scaleFactor);

        this._raphael = Raphael(this._div, width, height);
        var raphael_self = this._raphael;


        var sectorsToPaint = []; // will contain all sectors with: value > ZERO
        var sectorsNotToPaint = [];  // will contain all sectors with: value == ZERO
        // we step through all sectors and put those with ZERO in sectorsNotToPaint
        var count;
        for (count in sectors) {
            if (sectors[count].value !== 0) {
                sectorsToPaint.push(sectors[count]);
            } else {
                sectorsNotToPaint.push(sectors[count]);
            }
        }

        // collect the legend values
        var legendValues = [];
        if (style.showLegend) {
            for (var i = 0; i < sectorsToPaint.length; i++) {
                if (sectorsToPaint[i].showPercentage) {
                    // if we should show percentage
                    legendValues[i] = '%%.%%' + exxcellent.PieChartSync._percentageDelimiter + sectorsToPaint[i].name;
                } else {
                    legendValues[i] = sectorsToPaint[i].name;
                }
            }
            for (i = 0; i < sectorsNotToPaint.length; i++) {
                if (sectorsNotToPaint[i].showPercentage) {
                    // if we should show percentage
                    legendValues.push('%%.%%' + exxcellent.PieChartSync._percentageDelimiter + sectorsNotToPaint[i].name);
                } else {
                    legendValues.push(sectorsNotToPaint[i].name);
                }
            }
        } else {
            // if we don't want to have a legend we just pass 'null' to raphael -it will handle this for us
            legendValues = null;
        }

        var pie = this._raphael.g.piechart(x_offset, y_offset, radius, sectorsToPaint, sectorsNotToPaint, {legend: legendValues, legendpos: style.legendPosition, legendcolor: style.legendForeground}, style);

        // if animation is defined we inject a callback into raphael
        if (style.doAnimation) {
            // Let's do some animation
            pie.hover(
                // on 'mouseover'-callback
                function () {
                    this.sector.stop();
                    this.sector.scale(exxcellent.PieChartSync._scaleFactor, exxcellent.PieChartSync._scaleFactor, this.cx, this.cy);
                    // - popUp section
                    if (style.showPopUp) {
                        var popupTextFill = {fill: style.popupForeground};
                        var popUpFont = style.popupFont;
                        this.popUpLabel = raphael_self.text(0, 0, this.sector.value.popUpLabel).attr(popupTextFill).attr(popUpFont);
                        // if the sector is over middle, we open the PopUp zto bottom, if the sector is under the middle, we open the PopUp to top
                        var direction = 'top'; // default
                        if (this.cy > this.my) {
                            // if we are over middle, we open to bottom
                            direction = 'bottom';
                        }
                        this.popUp = raphael_self.popup(this.mx, this.my, this.popUpLabel, direction).attr({fill: style.popupBackground, stroke: style.popupBorderColor, "stroke-width": 2, "fill-opacity": 0.7});
                    }
                    // - label section, animate, if we have one
                    if (this.label) {
                        this.label[0].stop();
                        this.label[0].scale(1.5);
                        this.label[1].attr({"font-weight": 800});
                    }
                },
                // on 'mouseout'-callback
                function () {
                    // hide popUp
                    if (style.showPopUp) {
                        this.popUpLabel.hide();
                        this.popUp.hide();
                    }
                    // animate sector to default
                    this.sector.animate({scale: [1, 1, this.cx, this.cy]}, 900, style.animationType);
                    // if we have a legend, set do default
                    if (this.label) {
                        this.label[0].animate({scale: 1}, 900, style.animationType);
                        this.label[1].attr({"font-weight": 400});
                    }
                });
        }

        // eventHandler...
        pie.click(function () {
            var _sectorValue = this.sector.value;

            self._onSelectPieSector(_sectorValue.identifier);
        });

        //this._div.style.width = this._raphael.width + 'px';
        //this._div.style.height = this._raphael.height + 'px';


    },

    /**
     * Called when the component is destroyed!
     * We clean all allocated data
     * @param update
     */
    renderDispose: function (update) {
        this._div = null;
        this._raphael = null;
    },

    /**
     * Called when an update happens.
     *
     * @param update
     */
    renderUpdate: function (update) {
        // Brut-force - just create everything new
        var element = this._div;
        this._raphael = null; // we set the Raphael to null to force a redraw
        var containerElement = element.parentNode;
        Echo.Render.renderComponentDispose(update, update.parent);
        containerElement.removeChild(element);
        this.renderAdd(update, containerElement);
        return true;
    },

    /**
     * Get the PIE-Model.
     * In case of a JSON-Object we parse it to create the exxcellent.model.PieModel
     */
    _getPieModel: function () {
        var value = this.component.render(exxcellent.PieChart.PIE_MODEL);
        if (value instanceof exxcellent.model.PieModel) {
            return value;
        } else if (value) {
            return this._fromJsonString(value).pieModel;
        }
    },

    /**
     * Returns the style of the Pie
     */
    _getStyle: function () {
        var style = {
            legendFont: this._renderFont(this.component.render(exxcellent.PieChart.LEGEND_FONT)),
            legendForeground: this.component.render(exxcellent.PieChart.LEGEND_FOREGROUND),
            legendHideZeroValues: this.component.render(exxcellent.PieChart.LEGEND_HIDE_ZERO_VALUES) || false,
            legendPosition: this.component.render(exxcellent.PieChart.LEGEND_POSITION) || 'east',
            legendGapFactor: this.component.render(exxcellent.PieChart.LEGEND_GAP_FACTOR) || 1.2,
            showLegend: this.component.render(exxcellent.PieChart.SHOW_LEGEND),
            doAnimation: this.component.render(exxcellent.PieChart.DO_ANIMATION),
            animationType: this.component.render(exxcellent.PieChart.ANIMATION_TYPE) || 'bounce',
            doClientSorting: this.component.render(exxcellent.PieChart.DO_CLIENT_SORTING) || false, // default - no client sorting!
            showPopUp: this.component.render(exxcellent.PieChart.SHOW_POPUP),
            popupBackground: this.component.render(exxcellent.PieChart.POPUP_BACKGROUND) || '#000',
            popupBorderColor: this.component.render(exxcellent.PieChart.POPUP_BORDER_COLOR) || '#666',
            popupForeground: this.component.render(exxcellent.PieChart.POPUP_FOREGROUND) || '#fff',
            popupFont: this._renderFont(this.component.render(exxcellent.PieChart.POPUP_FONT)) || {font: '10px Helvetica, Arial'},
            sectorAbbrevShow: this.component.render(exxcellent.PieChart.SECTOR_ABBREV_SHOW) || false, // default is false -> no abbreviation in the sectors
            sectorAbbrevFont: this._renderFont(this.component.render(exxcellent.PieChart.SECTOR_ABBREV_FONT)) || {font: '10px Helvetica, Arial'},
            sectorAbbrevForeground: this.component.render(exxcellent.PieChart.SECTOR_ABBREV_FOREGROUND) || '#000',

            fallbackColorArray: [
                this.component.render(exxcellent.PieChart.FALLBACK_SECTOR_COLOR_0) || null,
                this.component.render(exxcellent.PieChart.FALLBACK_SECTOR_COLOR_1) || null,
                this.component.render(exxcellent.PieChart.FALLBACK_SECTOR_COLOR_2) || null,
                this.component.render(exxcellent.PieChart.FALLBACK_SECTOR_COLOR_3) || null,
                this.component.render(exxcellent.PieChart.FALLBACK_SECTOR_COLOR_4) || null,
                this.component.render(exxcellent.PieChart.FALLBACK_SECTOR_COLOR_5) || null,
                this.component.render(exxcellent.PieChart.FALLBACK_SECTOR_COLOR_6) || null,
                this.component.render(exxcellent.PieChart.FALLBACK_SECTOR_COLOR_7) || null,
                this.component.render(exxcellent.PieChart.FALLBACK_SECTOR_COLOR_8) || null,
                this.component.render(exxcellent.PieChart.FALLBACK_SECTOR_COLOR_9) || null
            ]
        };
        return style;
    },

    /**
     * Calculate PieRadius
     * @param width
     * @param height
     * @param showLegend
     * @param legendPos
     * @param amountOfSectors
     *
     * @return pieRadius
     */
    _calculatePieRadius: function (width, height, showLegend, legendPos, amountOfSectors) {
        var radius = 0;
        // if we have a legend
        if (showLegend) {
            if (legendPos === 'east' || legendPos === 'west') {
                radius = height / 2;
                //var correctionByWidth = (width - exxcellent.PieChartSync._minHorizontalSpaceForLegend) / 2; // May there is not enough space for it...
                //radius = Math.min(radius, correctionByWidth) - (exxcellent.PieChartSync._offsetValue * exxcellent.PieChartSync._scaleFactor);
                radius = radius - (exxcellent.PieChartSync._offsetValue * exxcellent.PieChartSync._scaleFactor);
            }

            if (legendPos === 'north' || legendPos === 'south') {
                radius = width / 2;
                //var correctionByHeight = (height - (15 * amountOfSectors)) / 2;
                //radius = Math.min(radius, correctionByHeight) - (exxcellent.PieChartSync._offsetValue * exxcellent.PieChartSync._scaleFactor);
                radius = radius - (exxcellent.PieChartSync._offsetValue * exxcellent.PieChartSync._scaleFactor);
            }
        } else {
            // if we don't have a legend, it's easy
            radius = Math.min(height / 2, width / 2) - (exxcellent.PieChartSync._offsetValue * exxcellent.PieChartSync._scaleFactor);
        }

        // just a little fallback, we don't want to have a pie with radius < 10
        if (radius < 10) {
            return 10;
        }
        // default:
        return radius;
    },

    /**
     * Method to process the event on selecting a cell.
     * Used JSON format :
     * {"rowSelection": {
     *      "sectorIdId": 1
     *      "sectorName": Foo
     * }}
     * @param {Number} sectorId - the internal RaphaelID of the selected Sector
     * @param {String} sectorName - the name of the selected Sector
     * @param {Number} sectorValue - the value of the sector
     */
    _onSelectPieSector: function (identifier) {
        this.component.doSelectPieSector(identifier);
        return false;
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
    },

    /**
     * Renders the font to be used by the PieChart component.
     * @param font {Echo.Sync.Font} the font to render as notifier compatible font
     * @return the raphael compatible font
     */
    _renderFont: function (font) {
        if (!font) {
            return null;
        }
        var fontByEcho = {
            style: {}
        };
        Echo.Sync.Font.render(font, fontByEcho);
        var echoStyle = fontByEcho.style;

        return {
            'font': echoStyle.fontSize + ' ' + echoStyle.fontFamily,
            'font-family': echoStyle.fontFamily,
            'font-size': echoStyle.fontSize,
            'font-style': echoStyle.fontStyle
        };

    }
});
