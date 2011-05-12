/*
 * This file (PlainHtmlTest.js) is part of the Echolot Project (hereinafter "Echolot").
 * Copyright (C) 2008-2011 eXXcellent Solutions GmbH.
 *
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 */

exxcellent.test.PlainHtmlTest = Core.extend({

    _plainHtml : null,

    $construct: function(testArea) {
        var testColumn = new Echo.Column({styleName: "Default"});
        var controlColumn = new Echo.Column({
          styleName: "TestControl",
          children: [
               new Echo.Label({
                   text: "PlainHtml", styleName: "Title"
               }),
               new Echo.Label({
                   text: "Content", styleName: "Default"
               }),
               this._createButton("Default-Text", "Just a text"),
               this._createButton("Liste","<ul><li>Item 1</li><li>Item 2</li>" +
                        "<p>" +
                        "<b>Und noch was Fett</b>"),
               this._createButton('Show Table','<table border="1">  ' +
                        '<tr><th>Stadt</th> <th>Land</th> <th>Fluss</th> </tr>  ' +
                        '<tr> <td>Paris</td> <td>Frankreich</td> <td>Seine</td> </tr>' +
                        '<tr> <td>Frankfurt</td> <td>Deutschland</td> <td>Main</td> </tr>' +
                        '</table>  '),
               this._createButton("Youtube iFrame",
                '<iframe class="youtube-player" type="text/html" width="640" height="385" src="http://www.youtube.com/embed/9_xl9boG8Qg" frameborder="0"> </iframe>')
          ]
        });

        this._plainHtml = new exxcellent.PlainHtml({
            htmlText : "Just a text"
        });

        testColumn.add(this._plainHtml);

        testArea.add(new Echo.SplitPane({
            styleName: "TestControl",
            children: [
                controlColumn,
                testColumn]
        }));
    },
    /**
     * Helper
     * @param text
     * @param action
     */
    _createButton: function(text, anotherHtml) {
        return new Echo.Button({
            text: text,
            styleName: "Default",
            toolTipText: anotherHtml,
            events: {
                action: Core.method(
                        this, this._setAnotherHtml(anotherHtml))
            }
        });
    },

    _setAnotherHtml : function(anotherHtml) {
        return function() {
            this._plainHtml.set(exxcellent.PlainHtml.HTML_TEXT, anotherHtml);
        }
    }
});