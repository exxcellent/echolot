/*
 * This file (TestButton.js) is part of the Echolot Project (hereinafter "Echolot").
 * Copyright (C) 2008-2011 eXXcellent Solutions GmbH.
 *
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 */

/**
 * A custom button class that is used to trigger testing of a specified
 * Echolot client-side component.
 *
 * @author Rakesh 2008-06-26
 */
exxcellent.test.TestButton = Core.extend(Echo.Button,
    {
        /** The name of the component that is being tested. */
        _component: null,

        $construct: function (component) {
            this._component = component;

            Echo.Button.call(this,
                {
                    renderId: "exxcellentUnitTestButton" + component,
                    styleName: "Default",
                    text: component,
                    events: {
                        action: Core.method(this, this._actionPerformed)
                    }
                });
        },

        /**
         * The event listener for displaying the component test object in
         * {@link MainContent#getTestArea}.
         */
        _actionPerformed: function () {
            var mainContent = testApp.getMainContent();
            var testArea = mainContent.getTestArea();
            testArea.removeAll();
            var testName = "exxcellent.test." + this._component + "Test";
            var testclass = eval(testName);
            new ( testclass )(testArea, mainContent);
        }
    });