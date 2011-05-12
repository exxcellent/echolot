/*
 * This file (OverviewContent.js) is part of the Echolot Project (hereinafter "Echolot").
 * Copyright (C) 2008-2011 eXXcellent Solutions GmbH.
 *
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 */

/**
 * A class containing the content initially presented in the TestApp.
 *
 * @author Oliver Pehnke
 * @version $Id: OverviewContent.js
 */
exxcellent.test.OverviewContent = Core.extend(
{

    $construct: function(testArea) {
        var oColumn = new Echo.Column({
            styleName: "Overview",
            children: [
                new Echo.Row({
                    styleName: "OverviewTitle",
                    children: [
                        new Echo.Label({
                            styleName: "Title",
                            text: "It's showtime"
                        })
                    ]
                }),
                new Echo.Row({
                    styleName: "Overview",
                    children: [
                        new Echo.Label({
                            styleName: "Overview",
                            text: "Advanced Components"
                        })
                    ]
                }),
                new Echo.Row({
                    children: [
                         this._createIconStarter("Flexigrid\nData Grid", "image/starter/flexigrid.png", "FlexiGrid"),
                         this._createIconStarter("DatePicker", "image/starter/datepicker.png", "DatePicker"),
                         this._createIconStarter("Key Binding", "image/starter/keybinding.png", "KeystrokeListener"),
                         this._createIconStarter("Notifier\nPopups", "image/starter/notifier.png", "Notifier"),
                         this._createIconStarter("Suggest\nField", "image/starter/suggest.png", "SuggestField"),
                         this._createIconStarter("Expander", "image/starter/expander.png", "Expander")
                    ]
                }),
                new Echo.Row({
                    styleName: "Overview",
                    children: [
                        new Echo.Label({
                            styleName: "Overview",
                            text: "Charting Components"
                        })
                    ]
                }),
                new Echo.Row({
                    children: [
                         this._createIconStarter("SVG Line Chart", "image/starter/linechart.png", "LineChart"),
                         this._createIconStarter("SVG Pie Chart", "image/starter/piechart.png", "PieChart"),
                         this._createIconStarter("SVG Bar Chart", "image/starter/barchart.png", "BarChart")
                    ]
                }),
                new Echo.Row({
                    styleName: "Overview",
                    children: [
                        new Echo.Label({
                            styleName: "Overview",
                            text: "Layout & Utility Components"
                        })
                    ]
                }),
                new Echo.Row({
                    children: [
                         this._createIconStarter("HTML Components", "image/starter/xhtml.png", "PlainHtml"),
                         this._createIconStarter("Block", "image/starter/blocks.png", "Block")
                    ]
                }),
                new Echo.Row({
                    styleName: "Overview",
                    children: [
                        new Echo.Label({
                            styleName: "Overview",
                            text: "Experimental Components"
                        })
                    ]
                }),
                new Echo.Row({
                    children: [
                         this._createIconStarter("Spinbutton", "image/starter/experimental.png", "SpinButton"),
                         this._createIconStarter("Scroll Pane", "image/starter/experimental.png", "ScrollPane"),
                         this._createIconStarter("LazyBlock", "image/starter/experimental.png", "LazyBlock")
                    ]
                })
            ]
        });
        testArea.add(oColumn);
    },

    _createIconStarter: function(text, icon, component) {
        return new Echo.Button({
            styleName: "Overview",
            text: text,
            icon: icon,
            events:{
                action: Core.method(this, function() {
                    var mainContent = testApp.getMainContent();
                    var testArea = mainContent.getTestArea();
                    testArea.removeAll();
                    var testName = "exxcellent.test." + component + "Test";
                    var testclass = eval(testName);
                    new ( testclass )(testArea, mainContent);
                })
            }
        })
    }
});