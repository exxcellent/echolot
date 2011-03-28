/**
 * Raphael-Plugin to draw a lineChart
 * Inspired from: http://raphaeljs.com/analytics.html
 *
 * You have to make sure, that the following scripts are already loaded:
 * <code>exx.raphael.js - Version 1.0</code>
 * You might use a higher Version of these files, but without any warranty!
 *
 * @author Ralf Enderle
 */

/**
 * Will draw a lineChart
 * @param lineChartModel - exxcellent.model.LineChartModel
 * @param lineChartLayout - exxcellent.model.LineChartLayout
 */
Raphael.fn.exx.linechart = function(lineChartModel, lineChartLayout, axisModel, callback) {
    var xOffset = 30;
    var yOffset = 10;
    // the master contains everything
    //var master = this.set();
    // first of all we draw the grid, if it is configured
    if (lineChartLayout.isDrawGrid()) {
        this.exx.drawGrid(xOffset, yOffset, lineChartLayout, axisModel);
    }

    var pointArray = [];
    for (var i = 0; i < lineChartModel.points.length; i++) {
        var point = new Object();
        point.x = lineChartModel.points[i].xValue;
        point.y = lineChartModel.points[i].yValue;
        point.label = lineChartModel.points[i].label;
        point.identifier = lineChartModel.points[i].identifier;
        pointArray = pointArray.concat(point);
    }

    var line = this.exx.drawLine(xOffset, yOffset, pointArray, lineChartLayout, callback);

    //return master;
};

