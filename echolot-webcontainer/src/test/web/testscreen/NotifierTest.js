/*
 * This file (NotifierTest.js) is part of the Echolot Project (hereinafter "Echolot").
 * Copyright (C) 2008-2011 eXXcellent Solutions GmbH.
 *
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 */

/**
 * A test class for the Sync.Notifier.js
 *
 * @author Oliver Pehnke
 * @version $Id: NotifierTest.js
 */
exxcellent.test.NotifierTest = Core.extend(
{

    _mainContent: null,
    _notifier: null,

    $construct: function(testArea, mainContent) {
        this._mainContent = mainContent;
        this._mainContent.showMsg("Hello Notifier!", "", {});
        var self = this;
        var pane = new Echo.ContentPane();
        var testColumn = new Echo.Column({
            styleName: "TestControl"
        });
        testColumn.add(new Echo.Label({
            styleName: "Title",
            text: "Notifier"
        }));
        testColumn.add(new Echo.Label({
            styleName: "Default",
            text: "Styles"
        }));
        testColumn.add(this._createButton('btn.err', "Error (sticky, center)",
                function() {
                    self._showMsg(
                            "An error occured!",
                            this._EXCEPTION,
                            this._errorMsgOpts)
                }));
        testColumn.add(this._createButton('btn.errBtn', "Error with button",
                function() {
                    self._showMsg(
                            "Another kickass error occured!",
                            "java.lang.NullPointerException \n\t at org.hibernate.util.StringHelper.qualify(StringHelp er.java:264)",
                            this._shortErrorMsgOpts)
                }));
        testColumn.add(this._createButton('btn.war', "Warning (topright)",
                function() {
                    self._showMsg(
                            "This is to much text",
                            this._LOREM_IPSUM,
                            this._warningMsgOpts)
                }));
        testColumn.add(this._createButton('btn.onl', "Oliver online (bottomright)",
                function() {
                    self._showMsg(
                            "Oliver online.",
                            null,
                            this._onlineMsgOpts)
                }));
        testColumn.add(this._createButton('btn.doc', "Document saved. (center)",
                function() {
                    self._showMsg("Document saved.", "invoice-2010-09-11.csv", this._documentSavedMsgOpts)
                }));
        testColumn.add(new Echo.Label({
            styleName: "Default",
            text: "Misc"
        }));
        testColumn.add(this._createButton('btn.win', "Open Window",
                function() {
                    pane.add(new exxcellent.test.NotifierTestDialog());
                }));

        this._notifier = new exxcellent.Notifier({
            renderId: "C.notifier",
            events: {
                action: Core.method(this, this._dummyAction)
            }
        });
        pane.add(testColumn);
        pane.add(this._notifier);
        pane.add(new exxcellent.test.NotifierTestDialog());

        testArea.add(new Echo.SplitPane({
            styleName: "TestControl",
            children: [
                testColumn,
                pane]
        }));
    },
    _shortErrorMsgOpts: { 'background': '#990000',
        'foreground': '#ffffff',
        'headerForeground' : '#ffffff',
        'border': '#c60808 solid 2px',
        'font': { size: "10",
            typeface: ["Courier New", "Courier", "Monospace"]},
        'position': 'center',
        'sticky': true,
        'hoverInterrupt' : true,
        'overlayed': true,
        'btnShow': true,
        'btnText': 'Show me the details'
    },
    _errorMsgOpts: { 'background': '#990000',
        'foreground': '#ffffff',
        'headerForeground' : '#ffffff',
        'border': '#c60808 solid 2px',
        'font': { size: "10",
            typeface: ["Courier New", "Courier", "Monospace"]},
        'position': 'center',
        'sticky': true,
        'hoverInterrupt' : true,
        'overlayed': true,
        'btnShow': false
    },
    _warningMsgOpts: { 'background': '#ffe385',
        'foreground': '#665727',
        'headerForeground' : '#665727',
        'border': '#e6c867 solid 2px',
        'borderRadius': '0px',
        'insets': '10px',
        'headerFont' : null,
        'font': { size: "9",
            typeface: ["Courier New", "Courier", "Monospace"]},
        'humanized': false,
        'position': 'topright',
        'width': 300,
        'duration': 4000,
        'sticky': false,
        'hoverInterrupt' : true,
        'icon': 'image/alert.png'
    },
    _onlineMsgOpts:
    { 'background': '#333333',
        'foreground': '#ffffff',
        'headerForeground' : '#ffffff',
        'border': '#ffffff solid 2px',
        'borderRadius': '0px',
        'insets': '10px',
        'headerFont' : null,
        'font': { size: "5",
            typeface: ["Courier New", "Courier", "Monospace"]},
        'humanized': false,
        'position': 'bottomright',
        'width': 200,
        'duration': 2500,
        'sticky': false,
        'hoverInterrupt' : true,
        'icon': 'image/oliver.jpg'
    },
    _documentSavedMsgOpts: {
        'background': '#EAEAEA',
        'foreground': '#444444',
        'headerForeground' : '#444444',
        'border': '#444444 solid 2px',
        'borderRadius': null,
        'insets': null,
        'headerFont' : {
            size: "32",
            typeface: ["Courier New", "Courier", "Monospace"]
        },
        'font': null,
        'humanized': false,
        'position': 'center',
        'width': 400,
        'sticky': false,
        'hoverInterrupt': false,
        'duration': 1000,
        'icon': null
    },

    _showMsg: function(title, text, options) {
        var m = {};
        var p = $.extend(true, m, this._msgDefaults, options);

        this._notifier.set('id', "" + Math.random());

        this._notifier.set(exxcellent.Notifier.POSITION, p.position);
        this._notifier.set(exxcellent.Notifier.STICKY, p.sticky);
        this._notifier.set(exxcellent.Notifier.WIDTH, p.width);

        this._notifier.set(exxcellent.Notifier.TITLE, title);
        this._notifier.set(exxcellent.Notifier.TEXT, text);
        this._notifier.set(exxcellent.Notifier.ICON, p.icon);

        this._notifier.set('background', p.background);
        this._notifier.set('foreground', p.foreground);
        this._notifier.set(exxcellent.Notifier.HEADER_FOREGROUND, p.headerForeground);
        this._notifier.set('border', p.border);
        this._notifier.set(exxcellent.Notifier.BORDER_RADIUS, p.borderRadius);
        this._notifier.set(exxcellent.Notifier.HEADER_FONT, p.headerFont);
        this._notifier.set('font', p.font);
        this._notifier.set("insets", p.insets);
        this._notifier.set(exxcellent.Notifier.HUMANIZED, p.humanized);
        this._notifier.set(exxcellent.Notifier.HOVER_INTERRUPT, p.hoverInterrupt);
        this._notifier.set(exxcellent.Notifier.DURATION, p.duration);
        this._notifier.set(exxcellent.Notifier.OVERLAYED, p.overlayed);

        this._notifier.set('btnShow', p.btnShow);
        if (p.btnShow) {
            this._notifier.set('btnText', p.btnText);
            this._notifier.set('onBtnClick', p.onBtnClick);
        }
    },

    _msgDefaults: { 'background': '#cfd0d1',
        'foreground': '#444444',
        'headerForeground' : '#444444',
        'border': '#444444 solid 2px',
        'borderRadius': null,
        'insets': null,
        'headerFont' : {
            size: "16",
            typeface: ["Courier New", "Courier", "Monospace"]
        },
        'font': null,
        'humanized': false,
        'position': 'bottomleft',
        'width': 400,
        'sticky': false,
        'hoverInterrupt': true,
        'duration': 5000,
        'icon': null
    },

    _dummyAction: function(event) {
        if (event && window.console) {
            console.log("Action triggered event: " + event.type + " data: " + event.data);
        }
        this._mainContent.showMsg("Action triggered!", event.type + " data: " + event.data);
        return false;
    },

    _createButton: function(id, text, action) {
        return new Echo.Button({
            text: text,
            renderId: id,
            styleName: "Default",
            width: 240,
            events: {
                action: Core.method(
                        this, action)
            }
        });
    },

    _LOREM_IPSUM: "Lorem ipsum dolor sit amet, consetetur" +
            " sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et " +
            "dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et " +
            "justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata " +
            "sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet",

    _EXCEPTION: "java.lang.NullPointerException" +
            " \n\t at org.hibernate.util.StringHelper.qualify(StringHelp er.java:264)" +
            " \n\t at org.hibernate.cfg.ToOneMappedBySecondPass.doSecond Pass(ToOneMappedBySecondPass.java:38)" +
            " \n\t at org.hibernate.cfg.Configuration.secondPassCompile( Configuration.java:1023)" +
            " \n\t at org.hibernate.cfg.AnnotationConfiguration.secondPa ssCompile(AnnotationConfiguration.java:218)" +
            " \n\t at org.hibernate.cfg.Configuration.buildSessionFactor y(Configuration.java:1138)" +
            " \n\t at de.hr.util.db.HibernateUtil.<clinit>(HibernateUtil .java:24)" +
            " \n\t at java.lang.Class.forName0(Native Method)" +
            " \n\t at java.lang.Class.forName(Class.java:164)" +
            " \n\t at de.hr.ui.Console.main(Console.java:17)" +
            " \n\t Exception in thread 'main' java.lang.ExceptionInInitializerError" +
            " \n\t at de.hr.util.db.HibernateUtil.<clinit>(HibernateUtil .java:28)" +
            " \n\t at java.lang.Class.forName0(Native Method)" +
            " \n\t at java.lang.Class.forName(Class.java:164)" +
            " \n\t at de.hr.ui.Console.main(Console.java:17)" +
            " \n\t Caused by: java.lang.NullPointerException" +
            " \n\t at org.hibernate.util.StringHelper.qualify(StringHelp er.java:264)" +
            " \n\t at org.hibernate.cfg.ToOneMappedBySecondPass.doSecond Pass(ToOneMappedBySecondPass.java:38)" +
            " \n\t at org.hibernate.cfg.Configuration.secondPassCompile( Configuration.java:1023)" +
            " \n\t at org.hibernate.cfg.AnnotationConfiguration.secondPa ssCompile(AnnotationConfiguration.java:218)" +
            " \n\t at org.hibernate.cfg.Configuration.buildSessionFactor y(Configuration.java:1138)" +
            " \n\t at de.hr.util.db.HibernateUtil.<clinit>(HibernateUtil .java:24)" +
            " \n\t ... 3 more"

});

exxcellent.test.NotifierTestDialog = Core.extend(Echo.WindowPane, {

    $construct: function() {
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
                close: function(e) {
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
                            layoutData: {
                                title: "Just a testing window.",
                                icon: "image/icon/Icon24Help.png"
                            },
                            insets: "15px 25px",
                            cellSpacing: 10,
                            children: [
                                new Echo.Label({
                                    icon: "image/logo/echolot-logo-96.png"
                                }),
                                new Echo.Label({
                                    text: "Just some window content."
                                }),
                                new Echo.Button({
                                    styleName: "Default",
                                    text: "Do Nothing."
                                }),
                                new Echo.TextField({
                                    styleName: "Default"
                                })
                            ]
                        })
                    ]
                })
            ]
        });
    }
});
