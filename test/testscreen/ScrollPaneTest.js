/*
 * This file (ScrollPaneTest.js) is part of the Echolot Project (hereinafter "Echolot").
 * Copyright (C) 2008-2011 eXXcellent Solutions GmbH.
 *
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 */

/**
 * A test class for the ScrollPane.js
 *
 * @author Oliver Pehnke
 * @version $Id: ScrollPaneTest.js
 */
exxcellent.test.ScrollPaneTest = Core.extend(
{
    $construct: function(testArea) {
        var testColumn = new Echo.Column({
            styleName: "TestArea"
        });
        var scrollPane = this._createScrollPane();
        scrollPane.add(this._createScrollingText());

        testColumn.add(this._createNote());
        testColumn.add(scrollPane);

        var controlColumn = new Echo.Column({
            styleName: "TestControl",
            children: [
                new Echo.Label({
                    text: "ScrollPane", styleName: "Title"
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

    _createScrollPane: function() {
        return new Contrib.ScrollPane(
        {
            renderId: "exxcellentUnitTestScrollPane",
            styleName: "Default",
            insets: 30
        });
    },
    _createScrollingText: function() {
        return new Echo.Label(
        {
            renderId: "exxcellentUnitTestScrollPaneText",
            text: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet."
        });
    },
    _createNote: function() {
        var row = new Echo.Row(
        {
            renderId: "exxcellentUnitTestScrollPaneNoteRow",
            insets: 30,
            cellSpacing: 30
        });
        row.add(new Echo.Label(
        {
            renderId: "exxcellentUnitTestScrollPaneNoteLabel",
            text: "Please resize the window and use the keys down and up to scroll the activated scroll container"
        }));
        return row;
    }
});