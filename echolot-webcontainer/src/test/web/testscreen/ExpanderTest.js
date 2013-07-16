/*
 * This file (ExpanderTest.js) is part of the Echolot Project (hereinafter "Echolot").
 * Copyright (C) 2008-2011 eXXcellent Solutions GmbH.
 *
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 */

/**
 * A test class for the exxcellent.Expander.
 *
 * @author Oliver Pehnke
 */
exxcellent.test.ExpanderTest = Core.extend({
    _mainContent: null,
    _expander1: null,

    $construct: function (testArea, mainContent) {
        this._mainContent = mainContent;
        this._expander1 = new exxcellent.Expander({
            title: "This is a Test",
            outsets: "20px",
            styleName: "Default",
            events: {
                contentToggled: Core.method(this, this._dummyAction)
            },
            children: [
                // the content
                new Echo.Grid({
                    styleName: "Default",
                    size: 2,
                    children: [
                        new Echo.Label({text: "Photo"}), new Echo.Label({icon: "image/oliver.jpg"}),
                        new Echo.Label({text: "Name"}), new Echo.TextField({text: "Oliver", styleName: "Default"}),
                        new Echo.Label({text: "Country"}), new Echo.TextField({text: "Germany", styleName: "Default"}),
                        new Echo.Label({text: "Status"}), new Echo.CheckBox({selected: true, styleName: "Default"})
                    ]
                }),
                // optional hide content
                new Echo.Grid({
                    styleName: "Default",
                    size: 2,
                    children: [
                        new Echo.Label({icon: "image/oliver.jpg"}),
                        new Echo.Label({text: "Name: Oliver, Country: Germany, State: online"})
                    ]
                })
            ]
        });

        var controlColumn = new Echo.Column({
            styleName: "TestControl",
            children: [
                new Echo.Label({
                    text: "Expander", styleName: "Title"
                }),
                new Echo.Label({
                    text: "First Expander", styleName: "Default"
                }),
                this._createButton('btn.exp1inchheight', "height + 10",
                    function () {
                        var pixelHeight = Echo.Sync.Extent.toPixels(
                            this._expander1.render(exxcellent.Expander.HEADER_HEIGHT), false);
                        this._expander1.set(exxcellent.Expander.HEADER_HEIGHT, (pixelHeight + 10) + "px");
                    }),
                this._createButton('btn.exp1dechheight', "height - 10",
                    function () {
                        var pixelHeight = Echo.Sync.Extent.toPixels(
                            this._expander1.render(exxcellent.Expander.HEADER_HEIGHT), false);
                        this._expander1.set(exxcellent.Expander.HEADER_HEIGHT, (pixelHeight - 10) + "px");
                    }),
                this._createButton('btn.exp1set0Child', "Show",
                    function () {
                        this._expander1.set(exxcellent.Expander.SHOW, true);
                    }),
                this._createButton('btn.exp1set1Child', "Hide",
                    function () {
                        this._expander1.set(exxcellent.Expander.SHOW, false);
                    }),
                this._createButton('btn.exp1togChild', "Toggle",
                    function () {
                        this._expander1.set(exxcellent.Expander.SHOW,
                            !this._expander1.get(exxcellent.Expander.SHOW));
                    }),
                this._createButton('btn.exp1hinsetsChild', "Header Insets",
                    function () {
                        this._expander1.set(exxcellent.Expander.HEADER_INSETS,
                            "20px 0 20px 0");
                    }),
                new Echo.Label({
                    text: "Misc", styleName: "Default"
                }),
                this._createButton('btn.win', "Open Window",
                    function () {
                        testArea.add(new exxcellent.test.ExpanderTestDialog());
                    })
            ]
        });
        var testColumn = new Echo.Column({styleName: "Default"});

        testColumn.add(this._expander1);
        testColumn.add(new Echo.Grid({
            styleName: "Default",
            size: 1,
            insets: "5px",
            cellSpacing: 10,
            background: "#FFFFFF",
            children: [
                new Echo.Label({
                    text: "Even more content that will appear right under the hideable Section."
                }),
                new Echo.Label({
                    icon: "image/logo/echolot-logo-small.png"
                })
            ]}));
        // only one child
        testColumn.add(new exxcellent.Expander({
            styleName: "ExpanderTest",
            // the content
            children: [new Echo.Grid({
                styleName: "Default",
                size: 2,
                children: [
                    new Echo.Label({text: "Photo"}), new Echo.Label({icon: "image/oliver.jpg"}),
                    new Echo.Label({text: "Name"}), new Echo.TextField({styleName: "Default", text: "Oliver"}),
                    new Echo.Label({text: "Country"}), new Echo.TextField({styleName: "Default", text: "Germany"}),
                    new Echo.Label({text: "Status"}), new Echo.CheckBox({selected: true})
                ]})

            ]
        }));
        // defining a title component
        testColumn.add(new exxcellent.Expander({
            styleName: "ExpanderTest",
            // the content
            children: [new Echo.Grid({
                styleName: "Default",
                size: 2,
                children: [
                    new Echo.Label({text: "Photo"}), new Echo.Label({icon: "image/oliver.jpg"}),
                    new Echo.Label({text: "Name"}), new Echo.TextField({styleName: "Default", text: "Oliver"}),
                    new Echo.Label({text: "Country"}), new Echo.TextField({styleName: "Default", text: "Germany"}),
                    new Echo.Label({text: "Status"}), new Echo.CheckBox({selected: true})
                ]}),
                // optional hide content
                new Echo.Grid({
                    styleName: "Default",
                    size: 2,
                    children: [
                        new Echo.Label({icon: "image/oliver.jpg"}),
                        new Echo.Label({text: "Name: Oliver, Country: Germany, State: online"})
                    ]
                }),
                // optional title content
                new Echo.Grid({
                    styleName: "Default",
                    size: 2,
                    children: [
                        new Echo.Label({text: "Name: Oliver, ..."}),
                        new Echo.Label({icon: "image/magnifier.png"})
                    ]
                })
            ]
        }));
        var hideExpander = new exxcellent.Expander({
            styleName: "ExpanderTest",
            headerHide: true,
            show: false,
            // the content
            children: [new Echo.Grid({
                styleName: "Default",
                size: 2,
                children: [
                    new Echo.Label({text: "Photo"}), new Echo.Label({icon: "image/oliver.jpg"}),
                    new Echo.Label({text: "Name"}), new Echo.TextField({styleName: "Default", text: "Oliver"}),
                    new Echo.Label({text: "Country"}), new Echo.TextField({styleName: "Default", text: "Germany"}),
                    new Echo.Label({text: "Status"}), new Echo.CheckBox({selected: true})
                ]})
            ]});
        // a button with a hidden expander component
        testColumn.add(new Echo.Grid({
            styleName: "Default",
            size: 2,
            children: [
                new Echo.Label({icon: "image/magnifier.png"}),
                this._createButton('btn.hideexp', "Click me!",
                    function () {
                        hideExpander.set(exxcellent.Expander.SHOW, !hideExpander.get(exxcellent.Expander.SHOW));
                    }),
                hideExpander
            ]})
        );

        var contentPane = new Echo.ContentPane({
            styleName: "TestArea",
            children: [testColumn]
        });
        testArea.add(new Echo.SplitPane({
            styleName: "TestControl",
            children: [
                controlColumn,
                contentPane]
        }));
    },

    _createButton: function (renderId, label, action) {
        return new Echo.Button({
            renderId: renderId,
            text: label,
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
        this._mainContent.showMsg(
            "Action triggered!", event.type
                + " data: " + event.data
                + " show: " + event.source.get(exxcellent.Expander.SHOW));
        return false;
    }
});

exxcellent.test.ExpanderTestDialog = Core.extend(Echo.WindowPane, {

    $construct: function () {
        Echo.WindowPane.call(this, {
            styleName: "Default",
            width: "40em",
            height: "18em",
            title: "A helper window",
            iconInsets: "6px 10px",
            icon: "image/icon/Icon16About.png",
            modal: false,
            closable: true,
            events: {
                close: function (e) {
                    e.source.parent.remove(e.source);
                }
            },
            children: [
                new Echo.ContentPane({
                    backgroundImage: {
                        url: "image/fill/tree-bg.png",
                        y: -135
                    },
                    children: [
                        new Echo.Column({
                            styleName: "Default",
                            layoutData: {
                                title: "Just a testing window.",
                                icon: "image/icon/Icon24Help.png"
                            },
                            insets: "15px 25px",
                            cellSpacing: 10,
                            children: [new exxcellent.Expander({
                                title: "Only one child",
                                fold: "verstecken",
                                collapse: "anzeigen",
                                styleName: "Default",
                                children: [new Echo.Grid({
                                    size: 2,
                                    children: [
                                        new Echo.Label({text: "Photo"}), new Echo.Label({icon: "image/oliver.jpg"}),
                                        new Echo.Label({text: "Name"}), new Echo.TextField({styleName: "Default", text: "Oliver"}),
                                        new Echo.Label({text: "Country"}), new Echo.TextField({styleName: "Default", text: "Germany"}),
                                        new Echo.Label({text: "Online"}), new Echo.CheckBox({selected: true}),
                                        new Echo.Label({text: "JavaScript"}), new Echo.CheckBox({selected: true}),
                                        new Echo.Label({text: "Java"}), new Echo.CheckBox({selected: true})
                                    ]})

                                ]
                            })]
                        })
                    ]
                })
            ]
        });
    }
});