/*
 * This file (SpinButtonTest.js) is part of the Echolot Project (hereinafter "Echolot").
 * Copyright (C) 2008-2011 eXXcellent Solutions GmbH.
 *
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 */

/**
 * A test class for the SpinButton.js
 *
 * @author Oliver Pehnke
 * @version $Id: SpinButtonTest.js
 */
exxcellent.test.SpinButtonTest = Core.extend(
{
    $construct: function(testArea) {
        var testColumn = new Echo.Column({styleName: "Default"});
        testColumn.add(this._createDummyButton());
        testColumn.add(this._createSpinButton());
        testColumn.add(this._createDummyButton());

        var controlColumn = new Echo.Column({
            styleName: "TestControl",
            children: [
                new Echo.Label({
                    text: "SpinButton", styleName: "Title"
                })
            ]
        });
        testArea.add(new Echo.SplitPane({
            styleName: "TestControl",
            children: [
                controlColumn,
                testColumn]
        }));
    },

    _createSpinButton: function() {
        return new exxcellent.SpinButton(
        {
            renderId: "exxcellentUnitTestSpinButton",
            styleName: "Default"
        });
    },

    _createDummyButton: function() {
        return new Echo.Button({
            text: "Dummy Button",
            foreground: "#000000",
            background: "#aaaabb",
            width: 240,
            insets: 5
        });
    }
});