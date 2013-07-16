/*
 * This file (KeystrokeListenerTest.js) is part of the Echolot Project (hereinafter "Echolot").
 * Copyright (C) 2008-2011 eXXcellent Solutions GmbH.
 *
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 */

/**
 * A test class for the Key.js
 *
 * @author Benjamin Schmid
 */
exxcellent.test.KeystrokeListenerTest = Core.extend(
    {

        _testColumn: null,
        _keystrokeComponent1: null,
        _keystrokeComponent2: null,
        _toggleButton: null,
        _eventLabel: null,
        _textArea: null,

        $construct: function (testArea, mainContent) {
            this._testColumn = new Echo.Column({styleName: "Default"});
            Core.Web.Event.debugListenerCount = true;
            this._testColumn.add(new Echo.Label({ text: "Description:\n- Activate/Deactivate Shortcuts with the Button. If Key event was catched, the label will change.\n" +
                "- Try out the key 'h' - It will only work INSIDE the text\n" +
                "- Try out Ctrl-H - It should work regardless of the input focus\n.\n",
                foreground: '#060', formatWhitespace: true }));
            this._testColumn.add(this._createLabel());
            this._testColumn.add(this._createLabel());
            this._textArea = new Echo.TextArea({styleName: "Default", text: "A input text area. \n'h' will only work here!", width: 300});
            this._testColumn.add(this._textArea);

            this._toggleButton = new Echo.Button({text: "Activate Key-Listeners", styleName: "Default",
                events: { action: Core.method(this, this._toggleListener) }});
            this._testColumn.add(this._toggleButton);

            this._eventLabel = new Echo.Label({ text: "No Event yet", foreground: '#f00'});
            this._testColumn.add(this._eventLabel);

            var controlColumn = new Echo.Column({
                styleName: "TestControl",
                children: [
                    new Echo.Label({
                        text: "Keystroke", styleName: "Title"
                    })
                ]
            });
            testArea.add(new Echo.SplitPane({
                styleName: "TestControl",
                children: [
                    controlColumn,
                    this._testColumn]
            }));
        },

        _createLabel: function () {
            return new Echo.Label(
                {
                    styleName: "Default",
                    text: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. " +
                        "At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.\n " +
                        "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. " +
                        "At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.\n ",
                    formatWhitespace: true
                });
        },

        _toggleListener: function (e) {
            if (!this._keystrokeComponent1) {
                this._keystrokeComponent1 = new exxcellent.KeystrokeListener({ targetRenderId: this._textArea.renderId, actionCommand: "h", keyCode: "h" });
                this._keystrokeComponent2 = new exxcellent.KeystrokeListener({ /*targetRenderId: targetElement.renderId, */actionCommand: "strg+h", keyCode: "ctrl+h" });
                this._testColumn.add(this._keystrokeComponent1);
                this._testColumn.add(this._keystrokeComponent2);
                this._toggleButton.set("text", "Deactivate Key-Listeners");
                // register client side action listeners
                this._keystrokeComponent1.addListener("action", Core.method(this, this._createActionHandlerMethod("Event #1")));
                this._keystrokeComponent2.addListener("action", Core.method(this, this._createActionHandlerMethod("Event #2")));
            } else {
                this._testColumn.remove(this._keystrokeComponent1);
                this._testColumn.remove(this._keystrokeComponent2);
                this._keystrokeComponent1 = null;
                this._keystrokeComponent2 = null;
                this._toggleButton.set("text", "Activate Key-Listeners");
            }
        },

        _createActionHandlerMethod: function (eventName) {
            var en = eventName;
            return function (e) {
                this._eventLabel.set("text", "Event: " + en + " @ " + new Date().getTime());
            };
        }
    });