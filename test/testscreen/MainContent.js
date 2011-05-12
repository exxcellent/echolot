/*
 * This file (MainContent.js) is part of the Echolot Project (hereinafter "Echolot").
 * Copyright (C) 2008-2011 eXXcellent Solutions GmbH.
 *
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 */

/**
 * The main content pane in which the application components are laid out.
 * Uses a split pane to display the {@link ComponentList} and the various
 * test components.
 *
 * @author Oliver Pehnke
 */
exxcellent.test.MainContent = Core.extend( Echo.ContentPane,
{
  /** The component list component that displays the component test controls. */
  _componentListColumn: null,

  /**
   * The container in which the component being tested and any supporting
   * components are displayed.
   */
  _testArea: null,
  _notifier: null,

  $construct: function() {
    this._notifier = new exxcellent.Notifier({
        styleName: "Default",
        renderId: "C.mainNotifier"
    }),
    this._testArea = new Echo.ContentPane({
        styleName: "TestArea"
    });

    this._componentListColumn = new exxcellent.test.TestComponentListColumn();
    Echo.ContentPane.call( this,
    {
      styleName: "TestControlBackground",
      children: [
          this._notifier,
          /** the split pane used to layout the whole interface. */
          new Echo.SplitPane({
              renderId: "C.mainSplitPane",
              styleName: "TestControlList",
              children: [
                  this._componentListColumn, this._testArea ]
            })
      ]
    });
    // inital overview
    new exxcellent.test.OverviewContent(this._testArea);
  },

  /** Return the {@link #_componentListColumn}. */
  getComponentListColumn: function() { return this._componentListColumn; },

  /** Return the {@link #_testArea}. */
  getTestArea: function() { return this._testArea; },

  /** Shows a message in the notifier. */
  showMsg: function(title, text, options) {
    // log the message
    if (window.console && window.console.log) {
        window.console.log("Message show triggered: " + title);
    }  

    var m = {};
    var p = $.extend(true, m, this._msgDefaults, options);

    this._notifier.set(exxcellent.Notifier.ID, "" + Math.random());

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
  }
});
