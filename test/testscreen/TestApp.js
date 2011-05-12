/*
 * This file (TestApp.js) is part of the Echolot Project (hereinafter "Echolot").
 * Copyright (C) 2008-2011 eXXcellent Solutions GmbH.
 *
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 */

/**
 * Root namespace for the Echolot client-side test application.
 */
exxcellent.test = {};

/** The main application class implementation. */
exxcellent.test.TestApp = Core.extend( Echo.Application,
{
  /** The {@link MainContent} for the application. */
  _mainContent: null,

  $construct: function()
  {
    Echo.Application.call( this );
    this.rootComponent.removeAll();
    this._mainContent = new exxcellent.test.MainContent();
    this.rootComponent.add( this._mainContent );
  },

  /** Return {@link _mainContent}. */
  getMainContent: function() { return this._mainContent; }
});

/** The global application instance. */
var testApp = null;

/** Boostrapping code for the test application. */
function init()
{
  Core.Web.init();
  testApp = new exxcellent.test.TestApp();
  var client = new Echo.FreeClient( testApp, document.getElementById( "rootArea" ) );
  client.addResourcePath( "Echo", "lib/echo/" );
  client.addResourcePath( "exxcellent", "../" );
  testApp.setStyleSheet( exxcellent.test.TestApp.StyleSheet );
  client.init();

  Echo.DebugConsole.install();
};

