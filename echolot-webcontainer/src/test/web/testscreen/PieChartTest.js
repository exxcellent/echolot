/*
 * This file (PieChartTest.js) is part of the Echolot Project (hereinafter "Echolot").
 * Copyright (C) 2008-2011 eXXcellent Solutions GmbH.
 *
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 */

/**
 * Testclass for the PieChart
 *
 * @author Ralf Enderle
 */
exxcellent.test.PieChartTest = Core.extend({

    _pieChart: null,
    _mainContent: null,

    $construct: function (testArea, mainContent) {
        this._mainContent = mainContent;

        var controlColumn = new Echo.Column({
            styleName: "TestControl",
            children: [
                new Echo.Label({
                    text: "PieChart", styleName: "Title"
                }),
                new Echo.Label({
                    text: "Models", styleName: "Default"
                }),
                this._createButton("Model 1 - 3 sectors",
                    function () {
                        this._pieChart.set(exxcellent.PieChart.PIE_MODEL, this._createPieModel_1().pieModel);
                    }
                ),
                this._createButton("Model 2 - 3 sectors",
                    function () {
                        this._pieChart.set(exxcellent.PieChart.PIE_MODEL, this._createPieModel_2().pieModel);
                    }
                ),
                this._createButton("Model 3 - More Sectors",
                    function () {
                        this._pieChart.set(exxcellent.PieChart.PIE_MODEL, this._createPieModel_3().pieModel);
                    }
                ),
                this._createButton("Model 4 - 3 Sectors",
                    function () {
                        this._pieChart.set(exxcellent.PieChart.PIE_MODEL, this._createPieModel_4().pieModel);
                    }
                ),
                new Echo.Label({
                    text: "Size", styleName: "Default"
                }),
                this._createButton("Height +10",
                    function () {
                        this._pieChart.set(exxcellent.PieChart.HEIGHT, this._pieChart.get(exxcellent.PieChart.HEIGHT) + 10);
                    }
                ),
                this._createButton("Height -10",
                    function () {
                        this._pieChart.set(exxcellent.PieChart.HEIGHT, this._pieChart.get(exxcellent.PieChart.HEIGHT) - 10);
                    }
                ),
                new Echo.Label({
                    text: "Animation", styleName: "Default"
                }),
                this._createButton("Toggle Animation",
                    function () {
                        this._pieChart.set(exxcellent.PieChart.DO_ANIMATION, !this._pieChart.get(exxcellent.PieChart.DO_ANIMATION));
                    }
                ),
                this._createButton("Bounce",
                    function () {
                        this._pieChart.set(exxcellent.PieChart.ANIMATION_TYPE, "bounce");
                    }
                ),
                new Echo.Label({
                    text: "Styling", styleName: "Default"
                }),
                this._createButton("toggle sectorAbbrev ON/OFF ",
                    function () {
                        this._pieChart.set(exxcellent.PieChart.SECTOR_ABBREV_SHOW, !this._pieChart.get(exxcellent.PieChart.SECTOR_ABBREV_SHOW));
                    }
                ),
                this._createButton("toggle clientSorting ON/OFF ",
                    function () {
                        this._pieChart.set(exxcellent.PieChart.DO_CLIENT_SORTING, !this._pieChart.get(exxcellent.PieChart.DO_CLIENT_SORTING));
                    }
                ),
                this._createButton("toggle hide slices with value 0 from legend ON/OFF ",
                    function () {
                        this._pieChart.set(exxcellent.PieChart.LEGEND_HIDE_ZERO_VALUES, !this._pieChart.get(exxcellent.PieChart.LEGEND_HIDE_ZERO_VALUES));
                    }
                )
            ]
        });

        this._pieChart = this._createPieChart();
        this._pieChart.set(exxcellent.PieChart.PIE_MODEL, this._createPieModel_1().pieModel);

        var splitPane = new Echo.SplitPane({
            styleName: "TestControl",
            children: [
                controlColumn,
                new Echo.Column({
                    styleName: "Default",
                    children: [this._pieChart]
                })
            ]
        });
        testArea.add(splitPane);
    },

    _createPieChart: function () {
        return new exxcellent.PieChart({
            font: {
                size: "18",
                typeface: ["Courier New", "Courier", "Monospace"],
                italic: true
            },
            fallbackSectorColor_0: 'red',
            fallbackSectorColor_1: 'green',
            fallbackSectorColor_2: 'blue',
            fallbackSectorColor_3: 'maroon',
            foreground: '#aaffaa',
            legendPosition: 'east',
            showLegend: true,
            showPopUp: true,
            doAnimation: true,
            width: 400,
            height: 200,
            events: {
                pieSectorSelect: Core.method(this, this._dummyAction) }
        });
    },

    /**
     * Creates a Pie model with a few sectors
     */
    _createPieModel_1: function () {
        // the sectors
        var sectors = [
            new exxcellent.model.PieSector("Blubber", 260, "Blubber PopUp", true, '#33FF99', 'Abbrev 1', "#000", 10)
            ,
            new exxcellent.model.PieSector("Bar", 1000, "Bar PopUp", true, '#666633', 'Abbrev 3', null, "#000", 12)
            ,
            new exxcellent.model.PieSector("One", 1, "one", true, '#666633', 'Abbrev 3', null, "#000", 12)
            ,
            new exxcellent.model.PieSector("Bar", 500, "Bar PopUp", true, '#666633', 'Abbrev 3', null, "#000", 12)
            ,
            new exxcellent.model.PieSector("Also one", 1, "also one", true, '#666633', 'Abbrev 3', null, "#000", 12)
            ,
            new exxcellent.model.PieSector("zero2", 0, "zero", true, '#666633', 'Abbrev 3', null, "#000", 12)
        ];

        // return the whole thing
        return {
            pieModel: new exxcellent.model.PieModel(sectors)
        };
    },
    /**
     * Creates a Pie model with a few sectors
     */
    _createPieModel_2: function () {
        // the sectors
        var sectors = [
            new exxcellent.model.PieSector("A", 90, "A PopUp", true, '#33FF99'),
            new exxcellent.model.PieSector("B", 60, "B PupUp", true, '#33AA99'),
            new exxcellent.model.PieSector("C", 90, "C PopUp", true, '#33BB99')
        ];
        var pieModel = new exxcellent.model.PieModel(sectors);
        // return the whole thing
        return {
            pieModel: pieModel

        };
    },
    /**
     * Creates a Pie model with a few sectors
     */
    _createPieModel_3: function () {
        // the sectors
        var sectors = [
            new exxcellent.model.PieSector("Ba", 90, "PopUp 0", true),
            new exxcellent.model.PieSector("Be", 60, "PopUp 1", true),
            new exxcellent.model.PieSector("Bi", 120, "PopUp 2", true),
            new exxcellent.model.PieSector("Bo", 40, "PopUp 3", true),
            new exxcellent.model.PieSector("Bo", 40, "PopUp 4", true),
            new exxcellent.model.PieSector("Bo", 40, "PopUp 5", true),
            new exxcellent.model.PieSector("Bo", 40, "PopUp 6", true),
            new exxcellent.model.PieSector("Bo", 40, "PopUp 7", true),
            new exxcellent.model.PieSector("Bo", 40, "PopUp 8", true),
            new exxcellent.model.PieSector("Bo", 40, "PopUp 9", true),
            new exxcellent.model.PieSector("Bo", 40, "PopUp 10", true),
            new exxcellent.model.PieSector("Bo", 40, "PopUp 11", true),
            new exxcellent.model.PieSector("Bo", 40, "PopUp 12", true),
            new exxcellent.model.PieSector("Bo", 40, "PopUp 13", true),
            new exxcellent.model.PieSector("Bo", 40, "PopUp 14", true),
            new exxcellent.model.PieSector("Bu", 20, "PopUp 15", true)

        ];
        var pieModel = new exxcellent.model.PieModel(sectors);
        pieModel.radius = 150;
        // return the whole thing
        return {
            pieModel: pieModel
        };
    },

    /**
     * Creates a Pie model with a few sectors
     */
    _createPieModel_4: function () {
        // the sectors
        var sectors = [
            new exxcellent.model.PieSector("Blubber", 80, "PopUp", true, '#11DD99'),
            new exxcellent.model.PieSector("Foo", 100, "PopUp", true, '#33AA66'),
            new exxcellent.model.PieSector("Bar", 300, "PopUp", true, '#33CC22')
        ];
        var pieModel = new exxcellent.model.PieModel(sectors);
        pieModel.legendPos = 'south';
        // return the whole thing
        return {
            pieModel: pieModel
        };
    },

    /**
     * Helper
     * @param text
     * @param action
     */
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