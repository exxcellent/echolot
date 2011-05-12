/*
 * This file (Sync.NotifierContainer.js) is part of the Echolot Project (hereinafter "Echolot").
 * Copyright (C) 2008-2011 eXXcellent Solutions GmbH.
 *
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * Notification container: renders messages hovering over a given parent component
 * like a window. On the other hand its a complete Echo.ContentPane.
 */
exxcellent.NotifierContentPane = Core.extend(Echo.Component, {

    $load: function() {
        Echo.ComponentFactory.registerType("exxcellent.NotifierContentPane", this);
    },

    /** Properties defined for this component. */
	$static : {
		ID: "id", // identifies a message
        TITLE: "title",
        TEXT: "text",
        ICON: "icon",
        POSITION: "position",
        WIDTH: "width",
        HEIGHT: "height",
        DURATION: "duration",
        STICKY: "sticky",
        FADE: "fade",
        BORDER_RADIUS: "borderRadius",
        OPACITY: 'opacity',
        HEADER_FONT: 'headerFont',
        HEADER_FOREGROUND: 'headerForeground',
        HUMANIZED: 'humanized',
        HOVER_INTERRUPT: 'hoverInterrupt',
        OVERLAYED: 'overlayed',
        BTN_SHOW: 'btnShow',
        BTN_TEXT: 'btnText',
        ACTION: 'action'
    },

    /** @see Echo.Component#componentType */
    componentType: "exxcellent.NotifierContentPane",

    /**
     * Render as floating pane in ContentPanes. If the value is 'false' the component
     * will block all other components in the contentpane.
     * @see Echo.ContentPane
     */
    floatingPane: true,

    pane: true,

    /** @see Echo.Component#focusable */
    focusable: false,

    /**
     * Performed after the (optional) button on a message is clicked.
     * @param id the id of the notification message that was clicked.
     */
  	doClickButton : function(id) {
		this.fireEvent({
				type : exxcellent.Notifier.ACTION,
				source : this,
				data : id
		});
	}
});

/**
 * Component rendering peer: NotifierContentPane.
 *
 * The component actually doesn't have any elements here but will render itself
 * as soon as the properties are filled if setting a property.
 */
exxcellent.NotifierContentPaneSync = Core.extend(Echo.Render.ComponentSync, {

    $load: function() {
        Echo.Render.registerPeer("exxcellent.NotifierContentPane", this);
    },

    _notifier: null,

    $construct: function {
    }


    /**
     * Renders the notification if the properties like text etc are set. Using
     * renderUpdate instead of renderDisplay avoids the execution on "creation".
     */
    showNotification: function() {
        // the width & height arrive as Extent e.g. '5px' or '50em' this has to be mapped to '5' (pixels)
        var width = Echo.Sync.Extent.toPixels(this.component.render(exxcellent.NotifierContentPane.WIDTH), true, true);
        var height = Echo.Sync.Extent.toPixels(this.component.render(exxcellent.NotifierContentPane.HEIGHT), false, true);
        var icon = Echo.Sync.ImageReference.getUrl(this.component.render(exxcellent.NotifierContentPane.ICON));
        var font = this.component.render("font");
        var headerFont = this.component.render(exxcellent.NotifierContentPane.HEADER_FONT);
        var text = this.component.render(exxcellent.NotifierContentPane.TEXT);
        var foreground = this.component.render('foreground');
        var headerForeground = this.component.render('headerForeground');

        var self = this;
        $('body').notifier(
            { title: this.component.render(exxcellent.NotifierContentPane.TITLE),
              text: text ? this._formatWhitespace(text) : "",
              icon: icon,
              position: this.component.render(exxcellent.NotifierContentPane.POSITION),
              width: width,
              height: height,
              padding: this.component.render("insets"),
              pFont: this._renderFont(font, foreground),
              hFont: this._renderFont(headerFont, headerForeground),
              duration: this.component.render(exxcellent.NotifierContentPane.DURATION),
              sticky: this.component.render(exxcellent.NotifierContentPane.STICKY),
              humanized: this.component.render(exxcellent.NotifierContentPane.HUMANIZED),
              hoverInterrupt: this.component.render(exxcellent.NotifierContentPane.HOVER_INTERRUPT),
              overlayed: this.component.render(exxcellent.NotifierContentPane.OVERLAYED),
              fade: this.component.render(exxcellent.NotifierContentPane.FADE),
              borderRadius: this.component.render(exxcellent.NotifierContentPane.BORDER_RADIUS),
              opacity: this.component.render(exxcellent.NotifierContentPane.OPACITY),
              background: this.component.render('background'),
              border: this.component.render('border'),
              msgId: this.component.render('id', "unknown id"),
              btnShow: this.component.render(exxcellent.NotifierContentPane.BTN_SHOW, false),
              btnText: this.component.render(exxcellent.NotifierContentPane.BTN_TEXT, "Details"),
              onBtnClick: function(id){
                  self._onButtonClick(id);
              }
            });
    },
    /**
     * A callback if the optional button (btnShow = true) in the message is clicked.
     * @param id the message id to identify the message, whos button was clicked
     */
    _onButtonClick: function(id) {
        this.component.doClickButton(id);
    },

    /**
     * Formats the whitespace in the given text for use in HTML.
     *
     * @param text {String} the (java) text to format
     * @return the html formatted string
     */
    _formatWhitespace: function(text) {
        // switch between spaces and non-breaking spaces to preserve line wrapping
        var textStr = text.replace(/\t/g, " \u00a0 \u00a0");
        textStr = textStr.replace(/ {2}/g, " \u00a0");
        textStr = textStr.replace(/\n/g, "<br/>");
        return textStr;
    },

    /**
     * Renders the font to be used by the notifier component.
     * @param font {Echo.Sync.Font} the font to render as notifier compatible font
     * @param color {Echo.Sync.Color} the foreground color of the text used with this font
     * @return the notifier compatible font
     */
    _renderFont: function(font, color) {
        var nFont = {};
        if (font) {
            if (font.typeface) {
                if (font.typeface instanceof Array) {
                    nFont.face = font.typeface.join(",");
                } else {
                    nFont.face = font.typeface;
                }
            }

            if (font.size) { nFont.sizePx = Echo.Sync.Extent.toPixels(font.size, true, true);}
            if (font.bold) { nFont.weight = 'bold';}
        }
        if (color) {nFont.color = color;}
        return nFont;
    }
});
