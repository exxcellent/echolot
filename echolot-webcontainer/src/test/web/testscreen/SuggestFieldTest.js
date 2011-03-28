/*
 * This file (SuggestFieldTest.js) is part of the Echolot Project (hereinafter "Echolot").
 * Copyright (C) 2008-2011 eXXcellent Solutions GmbH.
 *
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 */

/**
 * A test to verify the suggestField.
 */
exxcellent.test.SuggestFieldTest = Core.extend({
    _mainContent:null,
    _suggestField : null,
    _suggestModel : null,

    $construct: function(testArea, mainContent) {
        this._mainContent = mainContent;
        var testColumn = new Echo.Column({styleName: "Default"});
        var controlColumn = new Echo.Column({
            styleName: "TestControl",
            children: [
                new Echo.Label({
                    text: "SuggestField", styleName: "Title"
                }),
                new Echo.Label({
                    text: "Models", styleName: "Default"
                }),
                this._createButton("Default Model",
                        function() {
                            hintLabel.set('text', "Try e.g. typing 'T'");
                            this._suggestModel = this._getSuggestModel_1();
                            this._suggestField.set(exxcellent.SuggestField.SUGGEST_MODEL, this._suggestModel);
                        }),

                this._createButton("Language Model",
                        function() {
                            hintLabel.set('text', "Try e.g. typing 'J'");
                            this._suggestModel = this._getSuggestModel_2();
                            this._suggestField.set(exxcellent.SuggestField.SUGGEST_MODEL, this._suggestModel);
                        }),
                new Echo.Label({
                    text: "Config", styleName: "Default"
                }),
                this._createButton("Show current Config",
                        function() {
                            var text = '';
                            for (var j in  this._suggestField.getLocalStyleData()) {
                                if (j != 'suggestModel') {
                                    text = text + j + ': ' + this._suggestField.get(j).toString() + ' ';
                                }
                            }

                            text = text + '\n\n';

                            for (var i in this._suggestModel.suggestItems) {
                                text = text + this._suggestModel.suggestItems[i].toString() + '\n';
                            }

                            this._mainContent.showMsg('Current config', text);
                        }),


                this._createButton("Delay - 100ms",
                        function() {
                            this._suggestField.set(exxcellent.SuggestField.DELAY, this._suggestField.get(exxcellent.SuggestField.DELAY) - 100);
                        }),

                this._createButton("Delay + 100ms",
                        function() {
                            this._suggestField.set(exxcellent.SuggestField.DELAY, this._suggestField.get(exxcellent.SuggestField.DELAY) + 100);
                        }),

                this._createButton("MinLength + 1",
                        function() {
                            this._suggestField.set(exxcellent.SuggestField.MIN_LENGTH, this._suggestField.get(exxcellent.SuggestField.MIN_LENGTH) + 1);
                        }),

                this._createButton("MinLength - 1",
                        function() {
                            this._suggestField.set(exxcellent.SuggestField.MIN_LENGTH, this._suggestField.get(exxcellent.SuggestField.MIN_LENGTH) - 1);
                        }),

                this._createButton("Toggle showDescr",
                        function() {
                            this._suggestField.set(exxcellent.SuggestField.SHOW_DESCRIPTION, !this._suggestField.get(exxcellent.SuggestField.SHOW_DESCRIPTION));
                        }),

                this._createButton("Toggle disabled",
                        function() {
                            this._suggestField.set(exxcellent.SuggestField.DISABLED, !this._suggestField.get(exxcellent.SuggestField.DISABLED));
                        }),

                this._createButton("Toggle serverFilter",
                        function() {
                            this._suggestField.set(exxcellent.SuggestField.DO_SERVER_FILTER, !this._suggestField.get(exxcellent.SuggestField.DO_SERVER_FILTER));
                        })
            ]
        });


        var hintLabel = new Echo.Label({ text: "Try e.g. typing 'T'",
            foreground: '#060', formatWhitespace: true });

        this.suggestModel = this._getSuggestModel_1();
        this._suggestField = new exxcellent.SuggestField({
            minLength:1,
            delay:200,
            suggestModel: this.suggestModel,
            magnifierImg: 'image/magnifier.png',
            loadingImg: 'image/load.gif',
            suggestFont : {
                size: "14",
                typeface:["Arial", "Times New Roman"],
                italic: true
            },
            suggestForeground: '#800000',
            descriptionFont : {
                size: "10",
                typeface:["Courier", "Times New Roman", "serif"],
                bold: true
            },
            descriptionForeground: '#808000',
            suggestAreaColor: '#CCCCCC',
            suggestAreaHover: '#CC9933',
            events: {
                async_triggerServerFilter: Core.method(this, this._dummyAction),
                suggestItemSelected:  Core.method(this, this._dummyListener__SuggestItemSelected)}
        });

        testColumn.add(hintLabel);
        testColumn.add(this._suggestField);

        testArea.add(testColumn);
        testArea.add(new Echo.SplitPane({
            styleName: "TestControl",
            children: [
                controlColumn,
                testColumn]
        }));
    } ,

    _getSuggestModel_1 : function() {
        var suggestModel = new exxcellent.model.SuggestModel([
            new exxcellent.model.SuggestItem('Alpha', 'desrciption 1', 'Cat 1', 1),
            new exxcellent.model.SuggestItem('Beta', 'desrciption 1', 'Cat 1', 2),
            new exxcellent.model.SuggestItem('Gamma', '', 'Cat 1', 3),
            new exxcellent.model.SuggestItem('Foo', '', 'Cat 1', 4),
            new exxcellent.model.SuggestItem('Bar', 'desrciption 1', 'Cat 1', 5),
            new exxcellent.model.SuggestItem('TestLabel_1', 'description 1', 'Cat 1', 6),
            new exxcellent.model.SuggestItem('TestLabel_2', 'description 2', 'Cat 2', 7),
            new exxcellent.model.SuggestItem('TestLabel_3', 'description 3', 'Cat 2', 8),
            new exxcellent.model.SuggestItem('TestLabel_4', 'description 4', 'Cat 1', 9)
        ]);
        return suggestModel;
    },

    _getSuggestModel_2 : function() {
        var suggestModel = new exxcellent.model.SuggestModel([
            new exxcellent.model.SuggestItem('ActionScript', 'description 1', 'Cat 1', 1),
            new exxcellent.model.SuggestItem('AppleScript', 'description 1', 'Cat 1', 2),
            new exxcellent.model.SuggestItem('Asp', '', 'Cat 1', 3),
            new exxcellent.model.SuggestItem('BASIC', '', 'Cat 1', 4),
            new exxcellent.model.SuggestItem('C', 'description 1', 'Cat 1', 5),
            new exxcellent.model.SuggestItem('C++', 'description 1', 'Cat 1', 6),
            new exxcellent.model.SuggestItem('Clojure', 'description 2', 'Cat 2', 7),
            new exxcellent.model.SuggestItem('COBOL', 'description 3', 'Cat 2', 8),
            new exxcellent.model.SuggestItem('ColdFusion', 'description 4', 'Cat 1', 9),
            new exxcellent.model.SuggestItem('Erlang', 'description 4', 'Cat 1', 10),
            new exxcellent.model.SuggestItem('Fortran', 'description 4', 'Cat 1', 11),
            new exxcellent.model.SuggestItem('Java', 'description 4', 'Cat 1', 12),
            new exxcellent.model.SuggestItem('JavaScript', 'description 4', 'Cat 1', 13),
            new exxcellent.model.SuggestItem('Lisp', 'description 4', 'Cat 1', 14),
            new exxcellent.model.SuggestItem('Python', 'description 4', 'Cat 1', 15),
            new exxcellent.model.SuggestItem('Ruby', 'description 4', 'Cat 1', 16),
            new exxcellent.model.SuggestItem('Scala', 'description 4', 'Cat 1', 17),
            new exxcellent.model.SuggestItem('Scheme', 'description 4', 'Cat 1', 18)
        ]);
        return suggestModel;
    },
    
    /**
     * Helper
     * @param text
     * @param action
     */
    _createButton: function(text, action, width) {
        return new Echo.Button({
            text: text,
            styleName: "Default",
            events: {
                action: Core.method(this, action)
            }
        });
    },
    
    _dummyAction: function(event) {
        var self = this;
        this._suggestModel.suggestItems = this._suggestModel.suggestItems.concat(new exxcellent.model.SuggestItem('TestLabel ' + Math.round(Math.random() * 100), '', 'Cat 1', Math.round(Math.random() * 100)));

        setTimeout(function() {
            self._triggerClient();
        }, 500);
        this._mainContent.showMsg("Action triggered!", event.type + " data: " + event.data);
    },

    _dummyListener__SuggestItemSelected: function(event) {
        this._mainContent.showMsg("SuggestItem selected", "Identifier: " + event.data);        
    },

    _triggerClient: function() {
        this._suggestField.set(exxcellent.SuggestField.SUGGEST_MODEL, null);
        this._suggestField.set(exxcellent.SuggestField.SUGGEST_MODEL, this._suggestModel);
    }
});