/**
 * g.pie Raphael - eXXcellent version
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
 * Construct a piechart
 *
 * @param cx - xOffset
 * @param cy - yOffset
 * @param r - radius
 * @param values - pieValues [will be an Array of exxcellent.model.PieSector]
 * @param valuesToIgnore - the pieValues with ZERO-value, will be ignored in most cases
 * @param opts - the options, contains also the legend
 * @param style - echo-specific styling
 */
Raphael.fn.g.piechart = function (cx, cy, r, values, valuesToIgnore, opts, style) {
    opts = opts || {};
    var paper = this,
            sectors = [],
            covers = this.set(),
            chart = this.set(),
            series = this.set(),
            order = [],
            len = values.length,
            angle = 0,
            total = 0,
            others = 0,
            cut = 24, // maximum of segments
            defcut = true;
    chart.covers = covers;

    var fallbackColorFactory = style.nextFallbackColor();

    if (len == 1) {
        values[0] = {value: values[0].value,  order: 0, name: values[0].name, abbreviation: values[0].abbreviation, abbreviationForeground: values[0].abbreviationForeground, popUpLabel: values[0].popUpLabel, color: values[0].color, identifier: values[0].identifier, valueOf: function () {
            return this.value;
        }};

        series.push(this.circle(cx, cy, r).attr({fill: values[0].color || fallbackColorFactory(), stroke: opts.stroke || "#fff", "stroke-width": opts.strokewidth == null ? 1 : opts.strokewidth}));
        covers.push(this.circle(cx, cy, r).attr(this.g.shim));

        total = values[0].value;
        series[0].middle = {x: cx, y: cy};
        series[0].mangle = 180;
        series[0].value = values[0];

        if (style.sectorAbbrevShow) {
            // let's print it in the middle of the actual path we defined
            var abbrevTextFill = {fill: values[0].abbreviationForeground || style.sectorAbbrevForeground};
            var abbrevFont = style.sectorAbbrevFont;
            paper.text(cx, cy, values[0].abbreviation).attr(abbrevFont).attr(abbrevTextFill);
        }
    }
    else {
        function sector(cx, cy, r, startAngle, endAngle, fill) {
            var rad = Math.PI / 180,
                    x1 = cx + r * Math.cos(-startAngle * rad),
                    x2 = cx + r * Math.cos(-endAngle * rad),
                    xm = cx + r / 2 * Math.cos(-(startAngle + (endAngle - startAngle) / 2) * rad),
                    y1 = cy + r * Math.sin(-startAngle * rad),
                    y2 = cy + r * Math.sin(-endAngle * rad),
                    ym = cy + r / 2 * Math.sin(-(startAngle + (endAngle - startAngle) / 2) * rad),
                    res = ["M", cx, cy, "L", x1, y1, "A", r, r, 0, +(Math.abs(endAngle - startAngle) > 180), 1, x2, y2, "z"];
            res.middle = {x: xm, y: ym};
            return res;
        }

        for (var i = 0; i < len; i++) {
            // we sum up all values to get the whole
            total += values[i].value;
            values[i] = {value: values[i].value,  order: i, name: values[i].name, abbreviation: values[i].abbreviation, abbreviationForeground: values[i].abbreviationForeground, popUpLabel: values[i].popUpLabel, color: values[i].color, identifier: values[i].identifier, valueOf: function () {
                return this.value;
            }};
        }
        if(style.doClientSorting) {
            // when doing clientSorting we sort from big to small to show the biggest sector at top
            values.sort(function (a, b) {
                return b.value - a.value;
            });
        }
        for (i = 0; i < len; i++) {
            if (defcut && values[i].value != 0 && values[i].value * 360 / total <= 1.5) {
                cut = i;
                defcut = false;
            }
            if (i > cut) {
                defcut = false;
                values[cut].value += values[i];
                values[cut].others = true;
                others = values[cut].value;
            }
        }
        len = Math.min(cut + 1, values.length);
        others && values.splice(len) && (values[cut].others = true);
        for (i = 0; i < len; i++) {

            var mangle = angle - 360 * values[i].value / total / 2;
            if (!i) {
                angle = 90 - mangle;
                mangle = angle - 360 * values[i].value / total / 2;
            }
            if (opts.init) {
                var ipath = sector(cx, cy, 1, angle, angle - 360 * values[i].value / total).join(",");
            }
            var path = sector(cx, cy, r, angle, angle -= 360 * values[i].value / total);
            var p = this.path(opts.init ? ipath : path).attr({fill: values[i].color || fallbackColorFactory(), stroke: opts.stroke || "#fff", "stroke-width": (opts.strokewidth == null ? 1 : opts.strokewidth), "stroke-linejoin": "round"});
            p.value = values[i];
            p.middle = path.middle;
            p.mangle = mangle;
            sectors.push(p);
            series.push(p);
            opts.init && p.animate({path: path.join(",")}, (+opts.init - 1) || 1000, ">");


            // maybe we wanna have some text in the sectors
            if (style.sectorAbbrevShow) {
                // let's print it in the middle of the actual path we defined
                var abbrevTextFill = {fill: values[i].abbreviationForeground || style.sectorAbbrevForeground};
                var abbrevFont = style.sectorAbbrevFont;
                paper.text(p.middle.x, p.middle.y, values[i].abbreviation).attr(abbrevFont).attr(abbrevTextFill);
            }
        }
        for (i = 0; i < len; i++) {
            p = paper.path(sectors[i].attr("path")).attr(this.g.shim);
            opts.href && opts.href[i] && p.attr({href: opts.href[i]});
            p.attr = function () {
            };
            covers.push(p);
            series.push(p);
        }
    }

    /**
     * Callback for hover
     * @param fin - In-Callback
     * @param fout - Out-Callback
     */
    chart.hover = function (fin, fout) {
        fout = fout || function () {
        };
        var that = this;
        for (var i = 0; i < len; i++) {
            (function (sector, cover, j) {
                var o = {
                    sector: sector,
                    cover: cover,
                    cx: cx,
                    cy: cy,
                    mx: sector.middle.x,
                    my: sector.middle.y,
                    mangle: sector.mangle,
                    r: r,
                    value: values[j],
                    total: total,
                    label: that.labels && that.labels[j]
                };
                cover.mouseover(
                        function () {
                            fin.call(o);
                        }).mouseout(function () {
                    fout.call(o);
                });
            })(series[i], covers[i], i);
        }
        return this;
    };

    /**
     * Callback - will be applied to all sectors
     * @param f - the callback function
     */
    chart.each = function (f) {
        var that = this;
        for (var i = 0; i < len; i++) {
            (function (sector, cover, j) {
                var o = {
                    sector: sector,
                    cover: cover,
                    cx: cx,
                    cy: cy,
                    x: sector.middle.x,
                    y: sector.middle.y,
                    mangle: sector.mangle,
                    r: r,
                    value: values[j],
                    total: total,
                    label: that.labels && that.labels[j]
                };
                f.call(o);
            })(series[i], covers[i], i);
        }
        return this;
    };

    /**
     * Callback to handle a click of a sector
     * @param f - callback function that will be triggered by clicking a sector
     */
    chart.click = function (f) {
        var that = this;
        for (var i = 0; i < len; i++) {
            (function (sector, cover, j) {
                var o = {
                    sector: sector,
                    cover: cover,
                    cx: cx,
                    cy: cy,
                    mx: sector.middle.x,
                    my: sector.middle.y,
                    mangle: sector.mangle,
                    r: r,
                    value: values[j],
                    total: total,
                    label: that.labels && that.labels[j]
                };
                cover.click(function () {
                    f.call(o);
                });
            })(series[i], covers[i], i);
        }
        return this;
    };

    /**
     * Inject a sector dynamically
     * <i>Untested in this echo3 use</i>
     * @param element - the element you want to add
     */
    chart.inject = function (element) {
        element.insertBefore(covers[0]);
    };

    /**
     * Drawing the legend of the pie
     * @param labels
     * @param otherslabel
     * @param mark
     * @param dir
     */
    var legend = function (labels, otherslabel, mark, dir) {
        var x = cx + r + r / 5,
                y = cy,
                h = y + 10;
        labels = labels || [];
        dir = (dir && dir.toLowerCase && dir.toLowerCase()) || "east";
        mark = paper.g.markers[mark && mark.toLowerCase()] || "disc";
        chart.labels = paper.set();
        for (var i = 0; i < labels.length; i++) {
            // if it's a label that fits to a values-Object:
            if (i < len) {
                var clr = series[i].attr("fill"),
                        j = values[i].order,
                        txt;
                values[i].others && (labels[j] = otherslabel || "Others");
                labels[j] = paper.g.labelise(labels[j], values[i], total);
                chart.labels.push(paper.set());
                chart.labels[i].push(paper.g[mark](x + 5, h, 5).attr({fill: clr, stroke: "none"}));
                chart.labels[i].push(txt = paper.text(x + 20, h, labels[j] || values[j]).attr(style.legendFont || paper.g.txtattr).attr({fill: opts.legendcolor || "#000", "text-anchor": "start"}));
                covers[i].label = chart.labels[i];
                h += txt.getBBox().height * style.legendGapFactor;
            }
            // if it's a label for a 'ZERO' value:
            else {
                var clr = valuesToIgnore[i-len].color || fallbackColorFactory(),
                        j = i,
                        txt;
                labels[i] = paper.g.labelise(labels[i], 0, total); // we labelise with ZERO
                chart.labels.push(paper.set());
                chart.labels[i].push(paper.g[mark](x + 5, h, 5).attr({fill: clr, stroke: "none"}));
                chart.labels[i].push(txt = paper.text(x + 20, h, labels[i] || 0).attr(style.legendFont || paper.g.txtattr).attr({fill: opts.legendcolor || "#000", "text-anchor": "start"}));
                h += txt.getBBox().height * style.legendGapFactor;
            }
        }
        var bb = chart.labels.getBBox(),
                tr = {
                    east: [0, -bb.height / 2],
                    west: [-bb.width - 2 * r - 20, -bb.height / 2],
                    north: [-r - bb.width / 2, -r - bb.height - 10],
                    south: [-r - bb.width / 2, r + 10]
                }[dir];
        chart.labels.translate.apply(chart.labels, tr);
        chart.push(chart.labels);
    };
    if (opts.legend) {
        legend(opts.legend, opts.legendothers, opts.legendmark, opts.legendpos);
    }
    chart.push(series, covers);
    chart.series = series;
    chart.covers = covers;
    return chart;
};
