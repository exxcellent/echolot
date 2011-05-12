/**
 * eXXcellent raphael-Extension library - Version 1.0
 *
 * Some helpful Methods in an extra eXXecellent-NameSpace to draw some nice things with raphael
 *
 * You have to make sure, that the following scripts are already loaded:
 * <code>raphael.js - Version 1.5.2</code>
 * <code>popup.raphael.js - Version 1.0</code>
 * You might use a higher Version of these files, but without any warranty!
 *
 * @author Ralf Enderle
 */
(function() {
    // we create a namespace in Raphael reserved for eXXcellent
    Raphael.fn.exx = Raphael.fn.exx || {};

    /**
     * Draws a Grid !!DRAFT!!
     * @param xOffset
     * @param yOffset
     * @param gridWidth
     * @param gridHeight
     * @param widthScale
     * @param heightScale
     * @param color
     */
    Raphael.fn.exx.drawGrid = function(xOffset, yOffset, lineChartLayout, axisModel) {
        /**
         * Draws something like that on screen:
         *  _ _ _ _
         * |_|_|_|_|
         * |_|_|_|_|
         * |_|_|_|_|
         */
        // we use a Fallback for every variable - this makes it easier to use this function 
        xOffset = xOffset || 0;
        yOffset = yOffset || 0;
        var gridWidth = lineChartLayout.getWidth() || 200;
        var gridHeight = lineChartLayout.getHeight() || 100;
        var widthScale = lineChartLayout.getXaxisSectors() || 10;
        var heightScale = lineChartLayout.getYaxisSectors() || 10;
        var color = lineChartLayout.getGridColor() || "#000";
        var axisForeground = lineChartLayout.getForeground() || '#000';
        var axisFont = lineChartLayout.getAxisFont() || null;
        var path = ["M", Math.round(xOffset) + .5, Math.round(yOffset) + .5, "L", Math.round(xOffset + gridWidth) + .5, Math.round(yOffset) + .5, Math.round(xOffset + gridWidth) + .5, Math.round(yOffset + gridHeight) + .5, Math.round(xOffset) + .5, Math.round(yOffset + gridHeight) + .5, Math.round(xOffset) + .5, Math.round(yOffset) + .5],
                rowHeight = gridHeight / heightScale,
                columnWidth = gridWidth / widthScale;
        for (var i = 1; i < heightScale; i++) {
            path = path.concat(["M", Math.round(xOffset) + .5, Math.round(yOffset + i * rowHeight) + .5, "H", Math.round(xOffset + gridWidth) + .5]);
        }
        for (i = 1; i < widthScale; i++) {
            path = path.concat(["M", Math.round(xOffset + i * columnWidth) + .5, Math.round(yOffset) + .5, "V", Math.round(yOffset + gridHeight) + .5]);
        }

        // --- Draw legendValues for x-y-Axis ---
        // --------------------------------------

        // -- xAxis --
        if (!axisModel || !axisModel.xAxisValues) {
            // Fallback, if axisModel is null or axisModel.xAxisValues is null
            var tmp_x = lineChartLayout.getXscaleMax() / widthScale;
            for (var i = 0; i <= widthScale; i++) {
                this.text((gridWidth / widthScale) * i + xOffset, gridHeight + yOffset + 15, Math.round(tmp_x * i)).attr({fill:axisForeground}).attr(axisFont);
            }
        } else {
            // if we have values for the xAxis, we draw them instead of the dummy-Numbers
            var xAxisArray = axisModel.xAxisValues;
            for (var i = 0; i < xAxisArray.length; i++) {
                this.text((gridWidth / (xAxisArray.length - 1)) * i + xOffset, gridHeight + yOffset + 15, xAxisArray[i]).attr({fill:axisForeground}).attr(axisFont);
            }
        }

        // -- yAxis --
        if (!axisModel || !axisModel.yAxisValues) {
            // Fallback, if axisModel is null or axisModel.yAxisValues is null
            var tmp_y = lineChartLayout.getYscaleMax() / heightScale;
            for (var i = 0; i <= heightScale; i++) {
                this.text(xOffset - 20, (gridHeight / heightScale) * i + yOffset, Math.round(tmp_y * (heightScale - i))).attr({fill:axisForeground}).attr(axisFont);
            }
        } else {
            // if we have values for the yAxis, we draw them instead of the dummy-Numbers
            var yAxisArray = axisModel.yAxisValues;
            for (var i = 0; i < yAxisArray.length; i++) {
                this.text(xOffset - 20, (gridHeight / (yAxisArray.length - 1)) * i + yOffset, yAxisArray[yAxisArray.length - i - 1]).attr({fill:axisForeground}).attr(axisFont);
            }
        }
        return this.path(path.join(",")).attr({stroke: color});
    };


    /**
     * Draws a line - DRAFT!!
     *
     * @param xOffset - xOffset-Value where to start drawing
     * @param yOffset - yOffset-Value where to start drawing
     * @param chartWidth
     * @param chartHeight
     * @param pointArray
     * @param xAxisMax - the maxValue of the xAxis
     * @param yAxisMax - the maxValue of the yAxis
     */
    Raphael.fn.exx.drawLine = function(xOffset, yOffset, pointArray, lineChartLayout, callback) {
        // a reference to this - wo only use tis reference from that time on to keep things clear
        var self = this;
        // some scalingVariables
        var chartWidth = lineChartLayout.getWidth();
        var chartHeight = lineChartLayout.getHeight();
        var xScale = chartWidth / lineChartLayout.getXscaleMax();
        var yScale = chartHeight / lineChartLayout.getYscaleMax();

        var color = lineChartLayout.getLineColor();
        var dotColor = lineChartLayout.getDotColor();
        var showPopup = lineChartLayout.isShowPopup();
        var fillChart = lineChartLayout.fillChart;
        var interpolation = lineChartLayout.getInterpolation() || 'linear';

        // some variables for PopUp
        var popUpBackground = lineChartLayout.getPopupBackground() || '#000';
        var popUpBorderColor = lineChartLayout.getPopupBorderColor() || '#666';
        var popUpForeground = lineChartLayout.getPopupForeground() || '#fff';
        var popUpFont = lineChartLayout.getPopupFont() || {font: '10px Helvetica, Arial'};

        // these functions help you to scale your chart
        // e.g. when your Chart is 300px wide but you want to display a points from 0...4800 on the xAxis you
        // can not just use PIXEL == AxisValue
        // -> this functions will scale for you
        function getScaledX(point) {
            return point.x * xScale;
        }

        function getScaledY(point) {
            return point.y * yScale;
        }

        /**
         * Just a little math-voodoo to draw a smooth line between Points: p1, p2, p3
         * @param p1x
         * @param p1y
         * @param p2x
         * @param p2y
         * @param p3x
         * @param p3y
         *
         * @return an Object containing to point-coordinates x1, y1 and x2, y2
         */
        function getAnchors(p1x, p1y, p2x, p2y, p3x, p3y) {
            // If you have good knowledge of trigonometry it would be nice if you leave some comments
            // here how this little code works :-)
            var l1 = (p2x - p1x) / 2;
            var l2 = (p3x - p2x) / 2;
            var a = Math.atan((p2x - p1x) / Math.abs(p2y - p1y));
            var b = Math.atan((p3x - p2x) / Math.abs(p2y - p3y));
            a = p1y < p2y ? Math.PI - a : a;
            b = p3y < p2y ? Math.PI - b : b;
            var alpha = Math.PI / 2 - ((a + b) % (Math.PI * 2)) / 2;
            var dx1 = l1 * Math.sin(alpha + a);
            var dy1 = l1 * Math.cos(alpha + a);
            var dx2 = l2 * Math.sin(alpha + b);
            var dy2 = l2 * Math.cos(alpha + b);
            return {
                x1: p2x - dx1,
                y1: p2y + dy1,
                x2: p2x + dx2,
                y2: p2y + dy2
            };
        }

        // self.clickDot(event) {
        //     alert(event);
        // }


        /**
         * Whole window with a chart and one Point
         * |----------------------------|
         * |                            |
         * |    y                       |
         * |    .                       |
         * |    .   *                   | <--- P(x,y) : P(2,3)
         * |    .                       |
         * |    .                       |
         * |    . . . . . . x           |
         * |                            |
         * |----------------------------|
         * Maybe this little picture helps to understand
         */

        // local path-Object - just a little styling now
        // this object is used to paint the later defind array with the values from the pointArray
        var path = self.path().attr({stroke: color, "stroke-width": 4, "stroke-linejoin": "round"});
        var backGroundPanelPath = self.path().attr({stroke: "none", opacity: .3, fill: color});

        // Text-Styling for PopUpLabel
        var popupTextFill = {fill: popUpForeground};
        // the two labels that are shown on the popup
        var label = self.set();
        // we have to initialize the labels with some dummy-Text that has same length as the data later on
        label.push(self.text(20, 20, "Dummy-Value").attr(popupTextFill).attr(popUpFont));
        label.hide;

        // the frame holding the popUp
        var frame = self.popup(100, 100, label, "right").attr({fill: popUpBackground, stroke: popUpBorderColor, "stroke-width": 2, "fill-opacity": .7}).hide();

        var leave_timer;
        var is_label_visible = false;
        // the blanket holds the rectangles for mouseOver
        var blanket = self.set();
        var pathArray;
        var backGroundPathArray;
        for (var i = 0, ii = pointArray.length; i < ii; i++) {
            // we calculate the next x and y value of the point to display in this iteration
            // Just a little Mathematics... the display 0-point is on top-left, but we want to draw from
            // bottom-left-corner of the Axis-chart
            var y = Math.round(chartHeight + yOffset - getScaledY(pointArray[i]));
            var x = Math.round(xOffset + getScaledX(pointArray[i]));

            // draw the dots
            var dot = self.circle(x, y, 4).attr({fill: dotColor, stroke: color, "stroke-width": 2});

            // calculate the next pathElements
            if (i === 0) {
                // when it's the first iteration, we have to add the 'StartPoint'...
                // only a path from x:y to itself :-)
                pathArray = ["M", x, y, "C", x, y];

                // some SVG-Logic
                // [M]: we start at Point (0/maxWidth) of the chart then...
                // [L] draw a line to the x-Value of the first Point on the bottom of the chart...
                // [L] draw a line to the first point of the chart
                // [C] and start the cubic-Bezier-curve with the x-y value
                // we will add all the other points of our chartCurve to this cubic-Bezier
                backGroundPathArray = ["M", xOffset + chartWidth, chartHeight + yOffset,"L", x,chartHeight + yOffset , "L", x,y , "C", x, y];
                //backGroundPathArray = ["M", xOffset + chartWidth, chartHeight + yOffset, "L", x,chartHeight + yOffset , "C", x, y];
            }
            if (i && i < ii - 1) {
                // We calculate the plain x/y values for the point before and after...
                var Y0 = Math.round(chartHeight + yOffset - getScaledY(pointArray[i - 1]));
                var X0 = Math.round(xOffset + getScaledX(pointArray[i - 1]));
                var Y2 = Math.round(chartHeight + yOffset - getScaledY(pointArray[i + 1]));
                var X2 = Math.round(xOffset + getScaledX(pointArray[i + 1]));
                // ...then calculate around with some trigonometry...

                var a = getAnchors(X0, Y0, x, y, X2, Y2);
                //var a = getAnchors(x, y, x, y, x, y);
                // ... so that we can draw a smooth line between 'PointBefore'(a.x1/a.y1)...'ActualPoint'(x/y)...'PointAfter'(a.x2/a.y2)
                var tmp_offset = 0;


                if (interpolation == 'bezier') {
                    pathArray = pathArray.concat([a.x1, a.y1, x + tmp_offset, y, a.x2, a.y2]);
                    backGroundPathArray = backGroundPathArray.concat([a.x1, a.y1, x + tmp_offset, y, a.x2, a.y2]);
                } else if (interpolation == 'linear') {
                    pathArray = pathArray.concat([ x + tmp_offset, y, x + tmp_offset, y,  x + tmp_offset, y]);  // <- for drawing just a line between the dots
                    backGroundPathArray = backGroundPathArray.concat([ x + tmp_offset, y, x + tmp_offset, y,  x + tmp_offset, y]);
                } else if (interpolation == 'none') {
                    backGroundPathArray = backGroundPathArray.concat([ x + tmp_offset, y, x + tmp_offset, y,  x + tmp_offset, y]);
                }

            }


            /**
             * In the example they draw a box from top to buttom of the chart with the width going
             * half to the next Point in the chart
             * |----------------------------|
             * |                            |
             * |    y  |   |   |            |
             * |    .  |   |   |            |
             * |    .  | * |   |            | <--- P(x,y) : P(2,3)
             * |    .  |   | * |            |
             * |    .  |   |   |            |
             * |    . . . . . . . .x        |
             * |                            |
             * |----------------------------|
             */
            // to have a greater area to consume a mouseOver we draw a rectangle - so feel free to change this
            // when you want to have a bigger area of mouseSensitive
            blanket.push(self.rect(x - 20, y - 20, 40, 40).attr({stroke: "none", fill: "#fff", opacity: 0}));
            var rect = blanket[blanket.length - 1];

            // show the popUp if the layout says yes
            if (showPopup) {
                (function (x, y, data, dot) {
                    var timer, i = 0;
                    /*
                     rect.click(function (event) {
                     dot.attr({fill: "red"});

                     });
                     */
                    rect.hover(function () {
                        clearTimeout(leave_timer);
                        var side = "right";
                        if (x + frame.getBBox().width > chartWidth) {
                            side = "left";
                        }
                        var hoverPopup = self.popup(x, y, label, side, 1);
                        frame.show().stop().animate({path: hoverPopup.path}, 200 * is_label_visible);
                        label[0].attr({text: data.label}).show().stop().animateWith(frame, {translation: [hoverPopup.dx, hoverPopup.dy]}, 200 * is_label_visible);
                        //label[1].attr({text: data.y + " y-Axis with more text"}).show().stop().animateWith(frame, {translation: [hoverPopup.dx, hoverPopup.dy]}, 200 * is_label_visible);
                        dot.attr("r", 6);
                        is_label_visible = true;
                    }, function () {
                        dot.attr("r", 4);
                        leave_timer = setTimeout(function () {
                            frame.hide();
                            label[0].hide();
                            //label[1].hide();
                            is_label_visible = false;
                        }, 1);
                    });
                })(x, y, pointArray[i], dot);
            } // Eon of popUp-Section

            // call callback for click-Events
            (function(data, dot) {
                rect.click(function () {
                    //self.clickDot("Blub");
                    callback.call(data);
                });
            })(pointArray[i], dot);


            // ---


            // ---

        }
        // After all we draw a path from the lastpoint to the lastpoint - sounds silly but we have to do this :-)
        // The last Point in the Array isn't processed in the iteration above - we don't have a point after this, so
        // it would make no sense to calculate a smooth line here - just stop at the end
        if (interpolation != 'none') pathArray = pathArray.concat([x, y, x, y]);
        backGroundPathArray = backGroundPathArray.concat([x, y, x, y, "L", x, chartHeight + yOffset, "z"]);

        // now we have the whole path in the pathArray - so lets set this as attribute to the path
        path.attr({path: pathArray});
        if (fillChart) {
            backGroundPanelPath.attr({path: backGroundPathArray});
        }
        // bring some elements to front - we want to display the popup on top
        frame.toFront();
        label[0].toFront();
        //label[1].toFront();
        blanket.toFront();
        label.hide();

        // at then end we hide a few things - we don´t want to display them yet
        frame.hide();
        label[0].hide();
        //label[1].hide();
        blanket.toFront();

        return self;

    };// End of draw line

    /**
     * Returns all values in one array
     * g.bar will use this to compute the maximum
     * @param barChartModel
     */
    Raphael.fn.exx.getAllValues = function(barChartModel) {
        var returnArray = new Array();
        for (var i = 0; i < barChartModel.barValues.length; i++) {
            for (var j = 0; j < barChartModel.barValues[i].length; j++) {
                returnArray.push(barChartModel.barValues[i][j].value);
            }
        }
        return returnArray;
    }; // End of getAllValues

    /**
     * Returns all numerical-Values from one specific Bar-Array
     * @param barChartModel
     * @param position
     */
    Raphael.fn.exx.getSpecifiedBarValues = function(barChartModel, position) {
        var returnArray = new Array();
        for (var i = 0; i < barChartModel.barValues[position].length; i++) {
            returnArray.push(barChartModel.barValues[position][i].value);
        }
        return returnArray;
    }; // End of getSpecifiedBarValues



})
        ();