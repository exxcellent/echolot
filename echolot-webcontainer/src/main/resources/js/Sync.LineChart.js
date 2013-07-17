/**
 * LineChart Version 1.0
 * Used to draw fancy LineCharts as an Echo-Component with the help
 * of raphael and the eXXcellent Addon-Library 'exx.raphael'
 * See 'http://raphaeljs.com/' for further information
 * (This component was inspired from: http://raphaeljs.com/analytics.html)
 *
 * @author Ralf Enderle <r.enderle@exxcellent.de>
 * @version 1.0
 */

exxcellent.LineChart = Core.extend(Echo.Component, {
    $load: function () {
        Echo.ComponentFactory.registerType('exxcellent.LineChart', this);
    },
    $static: {
        DRAW_GRID: 'drawGrid',
        GRID_COLOR: 'gridColor',

        XAXIS_SECTORS: 'xaxisSectors',
        YAXIS_SECTORS: 'yaxisSectors',


        FILL_CHART: 'fillChart',
        LINE_COLOR: 'lineColor',
        DOT_COLOR: 'dotColor',
        WIDTH: 'width',
        HEIGHT: 'height',
        BACKGROUND: 'background',
        FOREGROUND: 'foreground',
        INTERPOLATION: 'interpolation',

        XSCALE_MAX: 'xscaleMax',
        YSCALE_MAX: 'yscaleMax',

        SHOW_POPUP: 'showPopup',
        POPUP_BACKGROUND: 'popupBackground',
        POPUP_BORDER_COLOR: 'popupBorderColor',
        POPUP_FOREGROUND: 'popupForeground',
        POPUP_FONT: 'popupFont',
        // - comes from JSON
        LINE_CHART_MODEL: 'lineChartModel',
        AXIS_MODEL: 'axisModel',

        // Action-data
        POINT_SELECTION: 'pointSelection'
    },
    componentType: 'exxcellent.LineChart',
    doSelectPoint: function (pointIdentifier) {
        // Notify table row select listeners.
        this.fireEvent({
            type: exxcellent.LineChart.POINT_SELECTION,
            source: this,
            data: pointIdentifier
        });
    }
});

// some DataObjects for the LineChart:
// -----------------------------

/**
 * The data object for the LineChart.
 * The only thing you HAVE to specify is 'points'
 * All other attributes will come with suitable default values.
 */
exxcellent.model.LineChartModel = Core.extend({
    /** Should this PIE be animated */
    points: null,

    $construct: function (points) {
        this.points = points;
    },

    /** Return the string representation of this PieModel. */
    toString: function () {
        return 'I am a LineChartModel';
    }
});

/**
 * DataObject for a AxisModel
 */
exxcellent.model.AxisModel = Core.extend({
    xAxisValues: null,
    yAxisValues: null,


    $construct: function (xAxisValues, yAxisValues) {
        this.xAxisValues = xAxisValues;
        this.yAxisValues = yAxisValues;
    },

    toString: function () {
        return 'AxisModel - xAxis: ' + this.xAxisValues + ' yAxis: ' + this.yAxisValues;
    }
});

/**
 * The data object for a Point
 */
exxcellent.model.Point = Core.extend({
    xValue: null,
    yValue: null,
    identifier: null,

    label: '',

    $construct: function (xValue, yValue, label, identifier) {
        this.xValue = xValue;
        this.yValue = yValue;
        this.label = label;
        this.identifier = identifier;
    },

    /** Return the string representation of this Point */
    toString: function () {
        return 'Label:' + this.label + ' xValue:' + this.xValue + ' yValue:' + this.yValue;
    }
});

/**
 * Helper-Class - is not serialized with server
 */
exxcellent.model.LineChartLayout = Core.extend({
    drawGrid: true,
    gridColor: '#000',
    xaxisSectors: 10,
    yaxisSectors: 10,
    axisFont: null,
    foreground: '#000',
    showPopup: true,
    popupBackground: '#000',
    popupBorderColor: '#666',
    popupForeground: '#fff',
    popupFont: null,
    fillChart: true,
    lineColor: '#383',
    dotColor: '#000',
    interpolation: 'bezier',
    xscaleMax: 100,
    yscaleMax: 100,
    width: 300,
    height: 200,

    $construct: function () {
        // nothing to do yet
    },

    isDrawGrid: function () {
        return this.drawGrid;
    },

    getGridColor: function () {
        return this.gridColor;
    },

    getXaxisSectors: function () {
        return this.xaxisSectors;
    },

    getYaxisSectors: function () {
        return this.yaxisSectors;
    },

    getAxisFont: function () {
        return this.axisFont;
    },

    getForeground: function () {
        return this.foreground;
    },

    isShowPopup: function () {
        return this.showPopup;
    },

    getPopupBackground: function () {
        return this.popupBackground;
    },

    getPopupBorderColor: function () {
        return this.popupBorderColor;
    },

    getPopupForeground: function () {
        return this.popupForeground;
    },

    getPopupFont: function () {
        return this.popupFont;
    },

    isFillChart: function () {
        return this.fillChart;
    },

    getLineColor: function () {
        return this.lineColor;
    },

    getDotColor: function () {
        return this.dotColor;
    },

    getInterpolation: function () {
        return this.interpolation;
    },

    getXscaleMax: function () {
        return this.xscaleMax;
    },

    getYscaleMax: function () {
        return this.yscaleMax;
    },

    getWidth: function () {
        return this.width;
    },

    getHeight: function () {
        return this.height;
    },

    toString: function () {
        return 'LineChartModel';
    }
});


/**
 * Sync.LineChart
 *
 * Component rendering peer: LineChart
 * This sync renders a LineChart to the DOM.
 *
 * @author Ralf Enderle <r.enderle@exxcellent.de>
 * @version 1.0
 */
exxcellent.LineChartSync = Core.extend(Echo.Render.ComponentSync, {
    $load: function () {
        Echo.Render.registerPeer('exxcellent.LineChart', this);
    },

    $static: {
        // tbd
    },

    // some globals
    _div: null,
    _raphael: null,

    /** @see Echo.Render.ComponentSync#renderAdd */
    renderAdd: function (update, parentElement) {
        this._div = document.createElement("div");
        var background = this.component.render(exxcellent.LineChart.BACKGROUND);
        if (background) {
            this._div.style.background = background;
        }
        // nothing else to do yet

        parentElement.appendChild(this._div);
    },

    /** @see Echo.Render.ComponentSync#renderDisplay */
    renderDisplay: function () {
        var self = this;
        if (this._raphael) {
            // if we have already a raphael, we do nothing att all - it's just a simple refresh
            return;
        }
        var margin = 55;
        var lineChartLayout = this._getLineChartLayout();
        var lineChartModel = this._getLineChartModel();
        var axisModel = this._getAxisModel();

        // Instead of throwing an error that something is undefined, we just show nothing
        if (!lineChartModel) {
            return;
        }

        var fillChartTMP = this.component.render(exxcellent.LineChart.FILL_CHART);

        this._raphael = Raphael(this._div, lineChartLayout.getWidth() + margin, lineChartLayout.getHeight() + margin);

        var lineChart = this._raphael.exx.linechart(lineChartModel, lineChartLayout, axisModel, this._clickCallback(this));

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
     * Returns the LineChartLayout - this Objects helps to deal with Layout
     */
    _getLineChartLayout: function () {
        var lineChartLayout = new exxcellent.model.LineChartLayout();
        lineChartLayout.showPopup = this.component.render(exxcellent.LineChart.SHOW_POPUP);
        lineChartLayout.popupBackground = this.component.render(exxcellent.LineChart.POPUP_BACKGROUND);
        lineChartLayout.popupBorderColor = this.component.render(exxcellent.LineChart.POPUP_BORDER_COLOR);
        lineChartLayout.popupForeground = this.component.render(exxcellent.LineChart.POPUP_FOREGROUND);
        lineChartLayout.popupFont = this._renderFont(this.component.render(exxcellent.LineChart.POPUP_FONT));
        lineChartLayout.drawGrid = this.component.render(exxcellent.LineChart.DRAW_GRID);
        lineChartLayout.xaxisSectors = this.component.render(exxcellent.LineChart.XAXIS_SECTORS);
        lineChartLayout.yaxisSectors = this.component.render(exxcellent.LineChart.YAXIS_SECTORS);
        lineChartLayout.foreground = this.component.render(exxcellent.LineChart.FOREGROUND);
        lineChartLayout.axisFont = this._renderFont(this.component.render('font')); // comes from Echo.Component
        lineChartLayout.fillChart = this.component.render(exxcellent.LineChart.FILL_CHART);
        lineChartLayout.lineColor = this.component.render(exxcellent.LineChart.LINE_COLOR);
        lineChartLayout.dotColor = this.component.render(exxcellent.LineChart.DOT_COLOR);
        lineChartLayout.gridColor = this.component.render(exxcellent.LineChart.GRID_COLOR);
        lineChartLayout.interpolation = this.component.render(exxcellent.LineChart.INTERPOLATION);
        lineChartLayout.xscaleMax = this.component.render(exxcellent.LineChart.XSCALE_MAX);
        lineChartLayout.yscaleMax = this.component.render(exxcellent.LineChart.YSCALE_MAX);
        lineChartLayout.width = this.component.render(exxcellent.LineChart.WIDTH);
        lineChartLayout.height = this.component.render(exxcellent.LineChart.HEIGHT);
        return lineChartLayout;
    },

    /**
     * Get the LineChart-Model.
     * In case of a JSON-Object we parse it to create the exxcellent.model.PieModel
     */
    _getLineChartModel: function () {
        var value = this.component.render(exxcellent.LineChart.LINE_CHART_MODEL);
        if (value instanceof exxcellent.model.LineChartModel) {
            return value;
        } else if (value) {
            return this._fromJsonString(value).lineChartModel;
        }
    },

    /**
     * Get the Axis-Model.
     * In case of a JSON-Object we parse it to create the exxcellent.model.PieModel
     */
    _getAxisModel: function () {
        var value = this.component.render(exxcellent.LineChart.AXIS_MODEL);
        if (value instanceof exxcellent.model.AxisModel) {
            return value;
        } else if (value) {
            return this._fromJsonString(value).axisModel;
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
    },

    /**
     * Callback - a click occured
     * @param self
     */
    _clickCallback: function (self) {
        return function () {
            self.component.doSelectPoint(this.identifier);
        };
    },

    /**
     * Renders the font to be used by the PieChart component.
     * @param font {Echo.Sync.Font} the font to render as notifier compatible font
     * @return the raphael compatible font
     */
    _renderFont: function (font) {
        if (font === null) {
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