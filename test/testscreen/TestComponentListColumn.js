/*
 * This file (TestComponentListColumn.js) is part of the Echolot Project (hereinafter "Echolot").
 * Copyright (C) 2008-2011 eXXcellent Solutions GmbH.
 *
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 */

/**
 * A component used to display a list of control components used to display
 * the echolot component being tested.  Add components to be tested that
 * have an associated exxcellent.test.&lt;ComponentName&gt;Test class to the
 * {@link COMPONENTS} array.
 *
 * @author Rakesh 2008-06-26
 */
exxcellent.test.TestComponentListColumn = Core.extend(Echo.Column,
{
    $static:
    {
        COMPONENTS: [
            "FlexiGrid",
            "ScrollPane",
            "SpinButton",
            "KeystrokeListener",
            "Block",
            "LazyBlock",
            "DatePicker",
            "ButtonToggle",
            "Notifier",
            "Expander",
            "PieChart",
            "BarChart",
            "LineChart",
            "SuggestField",
            "PlainHtml"
        ]
    },
    _buttonColumn: null,

    $construct: function() {

        Echo.Column.call(this);

        this._buttonColumn = new Echo.Column({
            styleName: "TestControlList",
            renderId: "C.testControlListColumn"
        });
        for (var i = 0; i < exxcellent.test.TestComponentListColumn.COMPONENTS.length; ++i) {
            this._buttonColumn.add(new exxcellent.test.TestButton(
                    exxcellent.test.TestComponentListColumn.COMPONENTS[i]));
        }
        this.add(new Echo.Button({
            styleName: "TestControlList",
            renderId: "C.testControlLogo",
            events: {
                action: Core.method( this, this._actionPerformed )
            }
        }));
        this.add(this._buttonColumn);

        this.renderId = "C.flux";
        this.styleName = "TestControlBackground";
    },

    _actionPerformed: function () {
        var mainContent = testApp.getMainContent();
        var testArea = mainContent.getTestArea();
        testArea.removeAll();
        new exxcellent.test.OverviewContent(testArea);
    }
});
