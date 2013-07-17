/*
 * This file (ButtonToggleTest.js) is part of the Echolot Project (hereinafter "Echolot").
 * Copyright (C) 2008-2011 eXXcellent Solutions GmbH.
 *
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 */

/**
 * A test class for toggling different Buttons, invoked by a key.
 *
 * @author Michael Olp
 * @version $Id: ButtonTest.js
 */
exxcellent.test.ButtonToggleTest = Core.extend(
    {
        _mainContent: null,

        $construct: function (testArea, mainContent) {
            this._mainContent = mainContent;
            var testColumn = new Echo.Column({styleName: "Default"});
            var normalButton = this._createNormalButton(this._toggleButton);
            testColumn.add(normalButton);

            var toggleButton = this._createToggleButton();
            testColumn.add(toggleButton);

            var radioButton1 = this._createRadioButton();
            testColumn.add(radioButton1);

            var radioButton2 = this._createRadioButton();
            testColumn.add(radioButton2);

            var controlColumn = new Echo.Column({
                styleName: "TestControl",
                children: [
                    new Echo.Label({
                        text: "ButtonToggle", styleName: "Title"
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

        _createNormalButton: function () {
            return new Echo.Button({
                text: "normal button",
                foreground: "#000000",
                background: "#aaaabb",
                styleName: "Default",
                width: 240,
                events: {
                    action: Core.method(
                        this, this._toggleButton)
                }
            });
        },

        _createToggleButton: function () {
            return new Echo.CheckBox({
                text: "toggle button",
                foreground: "#000000",
                background: "#aaaabb",
                styleName: "Default",
                width: 240,
                events: {
                    action: Core.method(
                        this, this._toggleButton)
                }
            });
        },

        _createRadioButton: function () {
            return new Echo.RadioButton({
                text: "radio button",
                foreground: "#000000",
                background: "#aaaabb",
                styleName: "Default",
                width: 240,
                events: {
                    action: Core.method(
                        this, this._toggleButton)
                },
                group: "group1"
            });
        },

        _toggleButton: function (event) {
            if (window.console) {
                console.log("radio button clicked!");
            }
            this._mainContent.showMsg("Button pressed!", event.type + " data: " + event.data);
        }

    });