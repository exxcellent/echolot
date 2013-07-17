/*
 * This file (BarChartTest.js) is part of the Echolot Project (hereinafter "Echolot").
 * Copyright (C) 2008-2011 eXXcellent Solutions GmbH.
 *
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 */

/**
 * Testclass for the BarChart
 *
 * @author Ralf Enderle <r.enderle@exxcellent.de>
 */
exxcellent.test.BarChartTest = Core.extend({
    _barChart: null,
    _mainContent: null,

    $construct: function (testArea, mainContent) {
        this._mainContent = mainContent;
        var controlColumn = new Echo.Column({
            styleName: "TestControl",
            children: [
                new Echo.Label({
                    text: "BarChart", styleName: "Title"
                }),
                new Echo.Label({
                    text: "Models", styleName: "Default"
                }),
                this._createButton("Model 1",
                    function () {
                        this._barChart.set(exxcellent.BarChart.BAR_CHART_MODEL, this._createBarChartModel_1().barChartModel);
                    }),
                this._createButton("Model 2",
                    function () {
                        this._barChart.set(exxcellent.BarChart.BAR_CHART_MODEL, this._createBarChartModel_2().barChartModel);
                    }),
                this._createButton("Model 3 - random color",
                    function () {
                        this._barChart.set(exxcellent.BarChart.BAR_CHART_MODEL, this._createBarChartModel_3().barChartModel);
                    }),

                new Echo.Label({
                    text: "Alignement", styleName: "Default"
                }),
                this._createButton("vertical",
                    function () {
                        this._barChart.set(exxcellent.BarChart.BAR_ALIGNMENT, 'vertical');
                    }),
                this._createButton("horizontal",
                    function () {
                        this._barChart.set(exxcellent.BarChart.BAR_ALIGNMENT, 'horizontal');
                    }),

                new Echo.Label({
                    text: "Layout", styleName: "Default"
                }),
                this._createButton("width +50",
                    function () {
                        this._barChart.set(exxcellent.BarChart.WIDTH, this._barChart.get(exxcellent.BarChart.WIDTH) + 50);
                    }),
                this._createButton("width -50",
                    function () {
                        this._barChart.set(exxcellent.BarChart.WIDTH, this._barChart.get(exxcellent.BarChart.WIDTH) - 50);
                    }),
                this._createButton("height +50",
                    function () {
                        this._barChart.set(exxcellent.BarChart.HEIGHT, this._barChart.get(exxcellent.BarChart.HEIGHT) + 50);
                    }),
                this._createButton("height -50",
                    function () {
                        this._barChart.set(exxcellent.BarChart.HEIGHT, this._barChart.get(exxcellent.BarChart.HEIGHT) - 50);
                    }),

                this._createButton("xGap +10",
                    function () {
                        this._barChart.set(exxcellent.BarChart.XGAP, this._barChart.get(exxcellent.BarChart.XGAP) + 10);
                    }),
                this._createButton("xGap -10",
                    function () {
                        this._barChart.set(exxcellent.BarChart.XGAP, this._barChart.get(exxcellent.BarChart.XGAP) - 10);
                    }),
                this._createButton("yGap +10",
                    function () {
                        this._barChart.set(exxcellent.BarChart.YGAP, this._barChart.get(exxcellent.BarChart.YGAP) + 10);
                    }),
                this._createButton("yGap -10",
                    function () {
                        this._barChart.set(exxcellent.BarChart.YGAP, this._barChart.get(exxcellent.BarChart.YGAP) - 10);
                    }),

                new Echo.Label({
                    text: "Styling", styleName: "Default"
                }),
                this._createButton("Toggle - showTooltip",
                    function () {
                        this._barChart.set(exxcellent.BarChart.SHOW_TOOLTIP, !this._barChart.get(exxcellent.BarChart.SHOW_TOOLTIP));
                    }),
                this._createButton("Toggle - showPopup",
                    function () {
                        this._barChart.set(exxcellent.BarChart.SHOW_POPUP, !this._barChart.get(exxcellent.BarChart.SHOW_POPUP));
                    }),
                this._createButton("Toggle - autoAdjustPopup",
                    function () {
                        this._barChart.set(exxcellent.BarChart.AUTO_ADJUST_POPUP, !this._barChart.get(exxcellent.BarChart.AUTO_ADJUST_POPUP));
                    }),
                this._createButton("Toggle - isStacked",
                    function () {
                        this._barChart.set(exxcellent.BarChart.STACKED, !this._barChart.get(exxcellent.BarChart.STACKED));
                    }),

                new Echo.Label({
                    text: "Head-Styling", styleName: "Default"
                }),
                this._createButton("Head - round )",
                    function () {
                        this._barChart.set(exxcellent.BarChart.HEAD_TYPE, 'round');
                    }),
                this._createButton("Head - sharp >",
                    function () {
                        this._barChart.set(exxcellent.BarChart.HEAD_TYPE, 'sharp');
                    }),
                this._createButton("Head - soft ]",
                    function () {
                        this._barChart.set(exxcellent.BarChart.HEAD_TYPE, 'soft');
                    }),
                this._createButton("Head - square |",
                    function () {
                        this._barChart.set(exxcellent.BarChart.HEAD_TYPE, 'square');
                    })
            ]
        });

        this._barChart = this._createBarChart(); // default
        this._barChart.set(exxcellent.BarChart.BAR_CHART_MODEL, this._createBarChartModel_1().barChartModel);

        var splitPane = new Echo.SplitPane({
            styleName: "Default",
            children: [
                controlColumn,
                new Echo.Column({
                    styleName: "Default",
                    children: [this._barChart]
                })
            ]
        });

        testArea.add(splitPane);
    },

    _createBarChart: function () {
        return new exxcellent.BarChart({
            width: 300,
            height: 300,
            xgap: 10,
            ygap: 10,
            barAlignment: 'vertical',
            headType: 'round',
            isStacked: false,
            showPopup: false,
            events: {
                barSelection: Core.method(this, this._dummyAction) }
        });
    },

    /**
     * Creates a BarChartModel
     */
    _createBarChartModel_1: function () {
        // the sectors
        var bars = [
            [
                new exxcellent.model.Bar(20, 'Label-Text 1', 1),
                new exxcellent.model.Bar(80, 'Label-Text 2', 2),
                new exxcellent.model.Bar(30, 'Label-Text 3', 3),
                new exxcellent.model.Bar(90, 'Label-Text 4', 4)
            ],
            [
                new exxcellent.model.Bar(50, 'Label-Text Bla', 1),
                new exxcellent.model.Bar(20, 'Label-Text Blub', 2),
                new exxcellent.model.Bar(40, 'Label-Text Blubber', 3),
                new exxcellent.model.Bar(10, 'Label-Text Foo', 4)
            ]
        ];

        // return the whole thing
        return {
            barChartModel: new exxcellent.model.BarChartModel(bars)
        };
    },

    /**
     * Creates a BarChartModel
     */
    _createBarChartModel_2: function () {
        // the sectors
        var bars = [
            [
                new exxcellent.model.Bar(20, 'Text 1', 1),
                new exxcellent.model.Bar(80, 'Text 2', 2),
                new exxcellent.model.Bar(30, 'Text 3', 3),
                new exxcellent.model.Bar(90, 'Text 4', 4),
                new exxcellent.model.Bar(120, 'Text 5', 5),
                new exxcellent.model.Bar(30, 'Text 6', 6)
            ],
            [
                new exxcellent.model.Bar(70, 'Foo', 1),
                new exxcellent.model.Bar(10, 'Bar', 2),
                new exxcellent.model.Bar(90, 'Fooo', 3)
            ],
            [
                new exxcellent.model.Bar(50, 'Text Bla', 1),
                new exxcellent.model.Bar(20, 'Text Blub', 2),
                new exxcellent.model.Bar(40, 'Text Blubber', 3),
                new exxcellent.model.Bar(10, 'Text Foo', 4)
            ]
        ];

        // return the whole thing
        return {
            barChartModel: new exxcellent.model.BarChartModel(bars)
        };
    },

    /**
     * Creates a BarChartModel with random color
     */
    _createBarChartModel_3: function () {
        // the sectors
        var bars = [
            [
                new exxcellent.model.Bar(20, 'Label-Text 1', 1, Raphael.getColor()),
                new exxcellent.model.Bar(80, 'Label-Text 2', 2, Raphael.getColor()),
                new exxcellent.model.Bar(30, 'Label-Text 3', 3, Raphael.getColor()),
                new exxcellent.model.Bar(90, 'Label-Text 4', 4, Raphael.getColor())
            ],
            [
                new exxcellent.model.Bar(50, 'Label-Text Bla', 1, Raphael.getColor()),
                new exxcellent.model.Bar(20, 'Label-Text Blub', 2, Raphael.getColor()),
                new exxcellent.model.Bar(40, 'Label-Text Blubber', 3, Raphael.getColor()),
                new exxcellent.model.Bar(10, 'Label-Text Foo', 4, Raphael.getColor())
            ]
        ];

        // return the whole thing
        return {
            barChartModel: new exxcellent.model.BarChartModel(bars)
        };
    },

    _createButton: function (text, action) {
        return new Echo.Button({
            text: text,
            styleName: "Default",
            events: {
                action: Core.method(this, action)
            }
        });
    },

    _dummyAction: function (event) {
        if (event && window.console) {
            console.log("Action triggered event: " + event.type + " data: " + event.data);
        }
        this._mainContent.showMsg("Action triggered!", event.type + " data: " + event.data);
        return false;
    }
});