/**
 * g.bar - eXXcellent version
 * Extended to be used in echo3 Framework
 *
 * ---------------------------------------------------------------------------------------
 * Original version:
 * g.Raphael 0.4.1 - Charting library, based on Raphaël
 *
 * Copyright (c) 2009 Dmitry Baranovskiy (http://g.raphaeljs.com)
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 * ---------------------------------------------------------------------------------------
 *
 * @author Ralf Enderle <r.enderle@exxcellent.de>
 * @version 1.0
 */

/**
 * Construct a vertical barChart
 *
 *  _
 * | |       _
 * | |  _   | |
 * | | | |  | |
 * | | | |  | |
 * -------------
 *
 * @param x - vertical gap
 * @param y - horizontal gap
 * @param width - the width fo the whole chart
 * @param height - the height fo the whole chart
 * @param values - different values as array of array of 'echo.model.bar'
 * @param opts - different options, just have a deep look at the code to find them :-)
 */
Raphael.fn.g.barchart = function (x, y, width, height, values, opts, barChartModel) {
    opts = opts || {};
    var type = {round: "round", sharp: "sharp", soft: "soft"}[opts.type] || "square",
        // the gutter specifies the empty space between the bars:
        // e.g.  _         _
        //      | |gutter | |
        //      |_|       |_|
            gutter = parseFloat(opts.gutter || "20%"),
            chart = this.set(),
            bars = this.set(),
            covers = this.set(),
            covers2 = this.set(),
        // the max-value of all bars
        //total = Math.max.apply(Math, barChartModel.getAllValues()),
            total = Math.max.apply(Math, this.exx.getAllValues(barChartModel)),
            stacktotal = [],
            paper = this,
            multi = 0,
            colors = opts.colors || this.g.colors,
            len = barChartModel.barValues.length,
        // Array of Array of bars
            barValues = barChartModel.barValues;

    for (var i = 0; i < barValues.length; i++) {
        for (var j = 0; j < barValues[i].length; j++) {
            if (barValues[i][j] === null) {
                barValues[i][j] = new exxcellent.model.Bar(0, null, null, null);
            }
        }
    }

    if (this.raphael.is(barValues[0], "array")) {
        total = [];
        multi = len;
        len = 0;
        for (var i = barValues.length; i--;) {
            bars.push(this.set());
            total.push(Math.max.apply(Math, this.exx.getSpecifiedBarValues(barChartModel, i)));
            len = Math.max(len, barValues[i].length);
        }
        // if we have a multiBar with some arrays, smaller than maximum, we fill with dummies
        for (var i = barValues.length; i--;) {
            if (barValues[i].length < len) {
                for (var j = len - barValues[i].length; j--;) {
                    barValues[i].push(new exxcellent.model.Bar(0));
                }
            }
        }
        if (opts.stacked) {
            for (var i = len; i--;) {
                var tot = 0;
                for (var j = barValues.length; j--;) {
                    tot += + barValues[j][i].value || 0;
                }
                stacktotal.push(tot);
            }
        }

        total = Math.max.apply(Math, opts.stacked ? stacktotal : total);
    }

    total = (opts.to) || total;
    var barwidth = width / (len * (100 + gutter) + gutter) * 100,
            barhgutter = barwidth * gutter / 100,
            barvgutter = opts.vgutter == null ? 20 : opts.vgutter,
            stack = [],
            X = x + barhgutter,
            Y = (height - 2 * barvgutter) / total;
    if (!opts.stretch) {
        barhgutter = Math.round(barhgutter);
        barwidth = Math.floor(barwidth);
    }
    !opts.stacked && (barwidth /= multi || 1);
    for (var i = 0; i < len; i++) {
        stack = [];
        for (var j = 0; j < (multi || 1); j++) {
            var h = Math.round((multi ? barValues[j][i].value : values[i]) * Y),
                    top = y + height - barvgutter - h,
                    bar = this.g.finger(Math.round(X + barwidth / 2), top + h, barwidth, h, true, type).attr({stroke: "none", fill: barValues[j][i].color ? barValues[j][i].color : (colors[multi ? j : i])});
            if (multi) {
                bars[j].push(bar);
            } else {
                bars.push(bar);
            }
            bar.y = top;
            bar.x = Math.round(X + barwidth / 2);
            bar.w = barwidth;
            bar.h = h;
            bar.value = multi ? barValues[j][i].value : values[i];
            bar.Bar = barValues[j][i];
            if (!opts.stacked) {
                X += barwidth;
            } else {
                stack.push(bar);
            }
        }
        if (opts.stacked) {
            var cvr;
            covers2.push(cvr = this.rect(stack[0].x - stack[0].w / 2, y, barwidth, height).attr(this.g.shim));
            cvr.bars = this.set();
            var size = 0;
            for (var s = stack.length; s--;) {
                stack[s].toFront();
            }
            for (var s = 0, ss = stack.length; s < ss; s++) {
                var bar = stack[s],
                        cover,
                        h = (size + bar.value) * Y,
                        path = this.g.finger(bar.x, y + height - barvgutter - !!size * .5, barwidth, h, true, type, 1);
                cvr.bars.push(bar);
                size && bar.attr({path: path});
                bar.h = h;
                bar.y = y + height - barvgutter - !!size * .5 - h;
                covers.push(cover = this.rect(bar.x - bar.w / 2, bar.y, barwidth, bar.value * Y).attr(this.g.shim));
                // show tooltips or not?
                if (opts.showTooltip) {
                    cover.attr({title: bar.Bar.label});
                }
                cover.bar = bar;
                cover.value = bar.value;
                size += bar.value;
            }
            X += barwidth;
        }
        X += barhgutter;
    }
    covers2.toFront();
    X = x + barhgutter;
    if (!opts.stacked) {
        for (var i = 0; i < len; i++) {
            for (var j = 0; j < (multi || 1); j++) {
                var cover;
                covers.push(cover = this.rect(Math.round(X), y + barvgutter, barwidth, height - barvgutter).attr(this.g.shim));
                // show tooltips or not?
                bar = multi ? bars[j][i] : bars[i];
                if (opts.showTooltip) {
                    cover.attr({title: bar.Bar.label});
                }
                cover.bar = bar;
                cover.value = cover.bar.value;
                X += barwidth;
            }
            X += barhgutter;
        }
    }
    chart.label = function (labels, isBottom) {
        labels = labels || [];
        this.labels = paper.set();
        var L, l = -Infinity;
        if (opts.stacked) {
            for (var i = 0; i < len; i++) {
                var tot = 0;
                for (var j = 0; j < (multi || 1); j++) {
                    tot += multi ? values[j][i] : values[i];
                    if (j == multi - 1) {
                        var label = paper.g.labelise(labels[i], tot, total);
                        L = paper.g.text(bars[i * (multi || 1) + j].x, y + height - barvgutter / 2, label).insertBefore(covers[i * (multi || 1) + j]);
                        var bb = L.getBBox();
                        if (bb.x - 7 < l) {
                            L.remove();
                        } else {
                            this.labels.push(L);
                            l = bb.x + bb.width;
                        }
                    }
                }
            }
        } else {
            for (var i = 0; i < len; i++) {
                for (var j = 0; j < (multi || 1); j++) {
                    var label = paper.g.labelise(multi ? labels[j] && labels[j][i] : labels[i], multi ? values[j][i] : values[i], total);
                    L = paper.g.text(bars[i * (multi || 1) + j].x, isBottom ? y + height - barvgutter / 2 : bars[i * (multi || 1) + j].y - 10, label).insertBefore(covers[i * (multi || 1) + j]);
                    var bb = L.getBBox();
                    if (bb.x - 7 < l) {
                        L.remove();
                    } else {
                        this.labels.push(L);
                        l = bb.x + bb.width;
                    }
                }
            }
        }
        return this;
    };
    chart.hover = function (fin, fout) {
        covers2.hide();
        covers.show();
        covers.mouseover(fin).mouseout(fout);
        return this;
    };
    chart.hoverColumn = function (fin, fout) {
        covers.hide();
        covers2.show();
        fout = fout || function () {
        };
        covers2.mouseover(fin).mouseout(fout);
        return this;
    };
    chart.click = function (f) {
        covers2.hide();
        covers.show();
        covers.click(f);
        return this;
    };
    chart.each = function (f) {
        if (!Raphael.is(f, "function")) {
            return this;
        }
        for (var i = covers.length; i--;) {
            f.call(covers[i]);
        }
        return this;
    };
    chart.eachColumn = function (f) {
        if (!Raphael.is(f, "function")) {
            return this;
        }
        for (var i = covers2.length; i--;) {
            f.call(covers2[i]);
        }
        return this;
    };
    chart.clickColumn = function (f) {
        covers.hide();
        covers2.show();
        covers2.click(f);
        return this;
    };
    chart.push(bars, covers, covers2);
    chart.bars = bars;
    chart.covers = covers;
    return chart;
};

/**
 * Construct a horizontal barChart
 *
 * |_______
 * |_______|
 * |____________
 * |____________|
 * |___
 * |___|
 * |
 *
 *
 * @param x - vertical gap
 * @param y - horizontal gap
 * @param width - the width fo the whole chart
 * @param height - the height fo the whole chart
 * @param values - different values as array (different values could contain an array too
 * @param opts - different options, just have a deep look at the code to find them :-)
 */
Raphael.fn.g.hbarchart = function (x, y, width, height, values, opts, barChartModel) {
    opts = opts || {};
    var type = {round: "round", sharp: "sharp", soft: "soft"}[opts.type] || "square",
            gutter = parseFloat(opts.gutter || "20%"),
            chart = this.set(),
            bars = this.set(),
            covers = this.set(),
            covers2 = this.set(),
        // the max-value of all bars
            total = Math.max.apply(Math, this.exx.getAllValues(barChartModel)),
            stacktotal = [],
            paper = this,
            multi = 0,
            colors = opts.colors || this.g.colors,
            len = barChartModel.barValues.length,
        // Array of Array of bars
            barValues = barChartModel.barValues;

    for (var i = 0; i < barValues.length; i++) {
        for (var j = 0; j < barValues[i].length; j++) {
            if (barValues[i][j] === null) {
                barValues[i][j] = new exxcellent.model.Bar(0, null, null, null);
            }
        }
    }

    if (this.raphael.is(barValues[0], "array")) {
        total = [];
        multi = len;
        len = 0;
        for (var i = barValues.length; i--;) {
            bars.push(this.set());
            total.push(Math.max.apply(Math, this.exx.getSpecifiedBarValues(barChartModel, i)));
            len = Math.max(len, barValues[i].length);
        }
        // if we have a multiBar with some arrays, smaller than maximum, we fill with dummies
        for (var i = barValues.length; i--;) {
            if (barValues[i].length < len) {
                for (var j = len - barValues[i].length; j--;) {
                    barValues[i].push(new exxcellent.model.Bar(0));
                }
            }
        }
        if (opts.stacked) {
            for (var i = len; i--;) {
                var tot = 0;
                for (var j = barValues.length; j--;) {
                    tot += + barValues[j][i].value || 0;
                }
                stacktotal.push(tot);
            }
        }

        total = Math.max.apply(Math, opts.stacked ? stacktotal : total);
    }

    total = (opts.to) || total;
    var barheight = Math.floor(height / (len * (100 + gutter) + gutter) * 100),
            bargutter = Math.floor(barheight * gutter / 100),
            stack = [],
            Y = y + bargutter,
            X = (width - 1) / total;
    !opts.stacked && (barheight /= multi || 1);
    for (var i = 0; i < len; i++) {
        stack = [];
        for (var j = 0; j < (multi || 1); j++) {
            var val = multi ? barValues[j][i].value : values[i],
                    bar = this.g.finger(x, Y + barheight / 2, Math.round(val * X), barheight - 1, false, type).attr({stroke: "none", fill: barValues[j][i].color ? barValues[j][i].color : (colors[multi ? j : i])});
            if (multi) {
                bars[j].push(bar);
            } else {
                bars.push(bar);
            }
            bar.x = x + Math.round(val * X);
            bar.y = Y + barheight / 2;
            bar.w = Math.round(val * X);
            bar.h = barheight;
            bar.value = +val;
            // we add exxcellent.model.Bar to the raphael-Object
            bar.Bar = barValues[j][i];
            if (!opts.stacked) {
                Y += barheight;
            } else {
                stack.push(bar);
            }
        }
        if (opts.stacked) {
            var cvr = this.rect(x, stack[0].y - stack[0].h / 2, width, barheight).attr(this.g.shim);
            covers2.push(cvr);
            cvr.bars = this.set();
            var size = 0;
            for (var s = stack.length; s--;) {
                stack[s].toFront();
            }
            for (var s = 0, ss = stack.length; s < ss; s++) {
                var bar = stack[s],
                        cover,
                        val = Math.round((size + bar.value) * X),
                        path = this.g.finger(x, bar.y, val, barheight - 1, false, type, 1);
                cvr.bars.push(bar);
                size && bar.attr({path: path});
                bar.w = val;
                bar.x = x + val;
                covers.push(cover = this.rect(x + size * X, bar.y - bar.h / 2, bar.value * X, barheight).attr(this.g.shim));
                // show tooltips or not?
                if (opts.showTooltip) {
                    cover.attr({title: bar.Bar.label});
                }
                cover.bar = bar;
                size += bar.value;
            }
            Y += barheight;
        }
        Y += bargutter;
    }
    covers2.toFront();
    Y = y + bargutter;
    if (!opts.stacked) {
        for (var i = 0; i < len; i++) {
            for (var j = 0; j < (multi || 1); j++) {
                var cover = this.rect(x, Y, width, barheight).attr(this.g.shim);
                covers.push(cover);
                // show tooltips or not?
                bar =  multi ? bars[j][i] : bars[i];
                if (opts.showTooltip) {
                    cover.attr({title: bar.Bar.label});
                }
                cover.bar = bar;
                cover.value = cover.bar.value;
                Y += barheight;
            }
            Y += bargutter;
        }
    }
    chart.label = function (labels, isRight) {
        labels = labels || [];
        this.labels = paper.set();
        for (var i = 0; i < len; i++) {
            for (var j = 0; j < multi; j++) {
                var label = paper.g.labelise(multi ? labels[j] && labels[j][i] : labels[i], multi ? values[j][i] : values[i], total);
                var X = isRight ? bars[i * (multi || 1) + j].x - barheight / 2 + 3 : x + 5,
                        A = isRight ? "end" : "start",
                        L;
                this.labels.push(L = paper.g.text(X, bars[i * (multi || 1) + j].y, label).attr({"text-anchor": A}).insertBefore(covers[0]));
                if (L.getBBox().x < x + 5) {
                    L.attr({x: x + 5, "text-anchor": "start"});
                } else {
                    bars[i * (multi || 1) + j].label = L;
                }
            }
        }
        return this;
    };
    chart.hover = function (fin, fout) {
        covers2.hide();
        covers.show();
        fout = fout || function () {
        };
        covers.mouseover(fin).mouseout(fout);
        return this;
    };
    chart.hoverColumn = function (fin, fout) {
        covers.hide();
        covers2.show();
        fout = fout || function () {
        };
        covers2.mouseover(fin).mouseout(fout);
        return this;
    };
    chart.each = function (f) {
        if (!Raphael.is(f, "function")) {
            return this;
        }
        for (var i = covers.length; i--;) {
            f.call(covers[i]);
        }
        return this;
    };
    chart.eachColumn = function (f) {
        if (!Raphael.is(f, "function")) {
            return this;
        }
        for (var i = covers2.length; i--;) {
            f.call(covers2[i]);
        }
        return this;
    };
    chart.click = function (f) {
        covers2.hide();
        covers.show();
        covers.click(f);
        return this;
    };
    chart.clickColumn = function (f) {
        covers.hide();
        covers2.show();
        covers2.click(f);
        return this;
    };
    chart.push(bars, covers, covers2);
    chart.bars = bars;
    chart.covers = covers;
    return chart;
};
