/*
 * This file (DatePickerTest.js) is part of the Echolot Project (hereinafter "Echolot").
 * Copyright (C) 2008-2011 eXXcellent Solutions GmbH.
 *
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 */

/**
 * A test class for the DatePicker.js
 *
 * @author Oliver Pehnke
 * @version $Id: DatePickerTest.js
 */
exxcellent.test.DatePickerTest = Core.extend(
    {
        _mainContent: null,
        _datePickerA: null,
        _datePickerB: null,

        $construct: function (testArea, mainContent) {
            this._mainContent = mainContent;
            var testColumn = new Echo.Column({styleName: "Default"});

            this._datePickerA = this._createDatePicker("exxcellentUnitTestDatePickerA", "25.02.2010", false, null, "bottom"); // German
            this._datePickerB = this._createDatePicker("exxcellentUnitTestDatePickerB", "2010-08-12", true, 'multiple', "bottom-left");  // French
            this._datePickerRange = this._createDatePicker("exxcellentUnitTestDatePickerRange", "2010-08-12 ÷ 2010-08-14", false, 'range');  // German

            testColumn.add(this._createEmptyButton());

            var testRow1 = new Echo.Row();
            testRow1.add(this._createTextfield());
            testRow1.add(this._datePickerA);
            testRow1.add(this._datePickerB);
            testRow1.add(this._createTextfield());
            testColumn.add(testRow1);
            var testRow2 = new Echo.Row();

            testRow2.add(this._createTextfield());
            testRow2.add(this._datePickerRange);
            testRow2.add(this._createTextfield());
            testColumn.add(testRow2);

            testColumn.add(new Echo.Button({
                text: "Toggle enabled",
                foreground: "#000000",
                background: "#aaaabb",
                styleName: "Default",
                width: 240,
                events: {
                    action: Core.method(
                        this, this._toggleDatePicker)
                }
            }));
            testColumn.add(this._createEmptyButton());
            testColumn.add(new Echo.Button({
                text: "Clear #1 DatePicker",
                foreground: "#000000",
                background: "#aaaabb",
                styleName: "Default",
                width: 240,
                events: {
                    action: Core.method(
                        this, this._clearDatePicker)
                }
            }));
            var controlColumn = new Echo.Column({
                styleName: "TestControl",
                children: [
                    new Echo.Label({
                        text: "DatePicker", styleName: "Title"
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
        _clearDatePicker: function () {
            this._datePickerA.set(exxcellent.DatePicker.TEXT, "");
        },

        _createTextfield: function () {
            return new Echo.TextField({
                styleName: "Default",
                text: "TextField",
                maximumLength: 10,
                width: '100px',
                editable: true
            });
        },
        _createLocaleModel: function (alternate) {
            if (alternate) {
                return new exxcellent.model.LocaleModel(
                    '&#9664;',
                    '&#9654;',
                    'Sem',
                    ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
                    ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'],
                    ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
                    ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
                    ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'],
                    'yyyy-MM-dd',
                    1
                );
            } else {
                return new exxcellent.model.LocaleModel(
                    '&lt;',
                    '&gt;',
                    'KW',
                    ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
                    ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
                    ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
                    ['Son', 'Mon', 'Die', 'Mit', 'Don', 'Fre', 'Sam'],
                    ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
                    'dd.MM.yyyy',
                    1
                );
            }
        },

        _createEmptyButton: function () {
            return new Echo.Button({
                text: "< Dummy: no function >",
                foreground: "#000000",
                background: "#aaaabb",
                styleName: "Default",
                width: 240
            });
        },

        _toggleDatePicker: function (event) {
            this._dummyAction(event);
            var editable = this._datePickerA.get(exxcellent.DatePicker.EDITABLE);
            this._datePickerA.set(exxcellent.DatePicker.EDITABLE, !editable);
        },

        _createDatePicker: function (renderId, date, alternate, mode, location) {
            return new exxcellent.DatePicker(
                {
                    renderId: renderId,
                    styleName: "Default",
                    width: "100px",
                    alignment: "left",
                    text: date,
                    regex: "^[\\d\\-]*$",
                    editable: true,
                    selectionMode: mode,
                    numberOfCalendars: 1,
                    localeModel: this._createLocaleModel(alternate),
                    position: location,
                    layoutData: {
                        background: "#8eabcc",
                        insets: "5px 10px"
                    },
                    events: {
                        action: Core.method(this, this._dummyAction)
                    }
                });
        },

        _dummyAction: function (event) {
            if (event && window.console && window.console.log) {
                window.console.log("Action triggered event: " + event.type + " data: " + event.data);
            }
            this._mainContent.showMsg("Action triggered!", event.type + " data: " + event.data);
            return false;
        }

    });