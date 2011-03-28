/*
 * This file (Notification.java) is part of the Echolot Project (hereinafter "Echolot").
 * Copyright (C) 2008-2010 eXXcellent Solutions GmbH.
 *
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 */

package de.exxcellent.echolot.model;

import nextapp.echo.app.*;

/**
 * A notification is a message used to display information on the user screen on the top
 * of everything. There are several predefined types of notifications that are different
 * presets for messages.
 * <ul>
 * <li>(Normal) Message</li>
 * <li>Warning</li>
 * <li>Error</li>
 * </ul>
 */
public class Notification {
    private static final Color WARNING_FOREGROUND = new Color(102, 87, 39);      // #665727
    private static final Color WARNING_BACKGROUND = new Color(255, 227, 133);    // #ffe385
    private static final Border WARNING_BORDER = new Border(2, new Color(230, 200, 103), Border.STYLE_SOLID);  //#e6c867 solid 2px
    
    private static final Color ERROR_FOREGROUND = new Color(255, 255, 255);      // white
    private static final Color ERROR_BACKGROUND = new Color(153, 0, 0);          // #990000
    private static final Border ERROR_BORDER = new Border(2, new Color(198, 8, 8), Border.STYLE_SOLID);  //#c60808 solid 2px

    private static final Color MSG_FOREGROUND =new Color(255, 255, 255);        // white
    private static final Color MSG_BACKGROUND = new Color(68, 68, 68);          // #333333
    private static final Border MSG_BORDER = new Border(2, new Color(255, 255, 255), Border.STYLE_SOLID);  //white solid 2px

    private final String title;
    private final String text;
    private Color background;
    private Color foreground; // for text
    private Color titleForeground;  // for title
    private Border border;
    private ImageReference icon;
    private Position position;
    private Extent height;
    private Extent width;
    private boolean sticky;
    private Font titleFont;
    private Font font;
    private String opacity;
    private boolean humanized;
    private int duration = 5000;
    private boolean hoverInterrupt = true;
    private boolean overlayed;
    private boolean showButton;
    private String buttonText;
    private String id = String.valueOf(Math.random());

    /** The position on the screen of the message appearance.*/
    public enum Position {
        CENTER, TOPRIGHT, BOTTOMRIGHT, TOPLEFT, BOTTOMLEFT, TOPCENTER, BOTTOMCENTER
    }

    /** Private constructor - Creates the . */
    private Notification(final String title, final String text) {
        this.title = title;
        this.text = text;
    }

    /**
     * Creates a 'normal' message (not a warning, not an error).
     * @param title the title to show in the header of the message
     * @param text the text shown under the title of the message
     * @return the Notification
     */
    public static Notification createMessage(final String title, final String text) {
         return new Notification(title, text).background(
                 MSG_BACKGROUND).titleForeground(MSG_FOREGROUND)
                 .foreground(MSG_FOREGROUND).border(MSG_BORDER);
    }

    /**
     * Creates a Notification message with the preset 'warning'.
     * @param title the title to show in the header of the message
     * @param text the text shown under the title of the message
     * @return the Notification
     */
    public static Notification createWarning(final String title, final String text) {
         return new Notification(title, text).background(
                 WARNING_BACKGROUND).titleForeground(WARNING_FOREGROUND)
                 .foreground(WARNING_FOREGROUND).border(WARNING_BORDER);
    }

    /**
     * Creates a Notification message with the preset 'error'.
     * @param title the title to show in the header of the message
     * @param text the text shown under the title of the message
     * @return the Notification
     */
    public static Notification createError(final String title, final String text) {
         return new Notification(title, text).background(
                 ERROR_BACKGROUND).titleForeground(ERROR_FOREGROUND)
                 .foreground(ERROR_FOREGROUND).border(ERROR_BORDER).overlayed(true);
    }

    /**
     * If <code>true</code> the message will not disappear automatically. The user has to click
     * the message.
     * @param sticky true to be sticky, otherwise false
     */
    public Notification sticky(final boolean sticky) {
        this.sticky = sticky;
        return this;
    }

    /**
     * The optional height of the notification. Supports all kind of Extends. If no
     * height is provided the notification component will handle it.
     * @param height the height of the notification
     */
    public Notification height(final Extent height) {
        this.height = height;
        return this;
    }

    /**
     * The width of the notification message. Supports all kind of Extends.
     * @param width the width of the notification
     */
    public Notification width(final Extent width) {
        this.width = width;
        return this;
    }

    /**
     * The position where the notification is placed. Any value of {@link Position} is valid.
     * @param position the position on the screen to place the notification
     */
    public Notification position(final Position position) {
        this.position = position;
        return this;
    }

    /**
     * An optional icon shown in the top left corner of the notification.
     * @param icon the icon in the top left corner of the notification.
     */
    public Notification icon(final ImageReference icon) {
        this.icon = icon;
        return this;
    }

    /**
     * The border surrounding the notification.
     * @param border the border surrounding the notification
     */
    public Notification border(final Border border) {
        this.border = border;
        return this;
    }

    /**
     * The color of the 'main' message text.
     * @param foreground the color of the main message text.
     */
    public Notification foreground(final Color foreground) {
        this.foreground = foreground;
        return this;
    }

    /**
     * The background for the whole notification.
     * @param background the background for the whole notification
     */
    public Notification background(final Color background) {
        this.background = background;
        return this;
    }

    /**
     * The color of the title in the notification.
     * @param headerForeground The color of the title in the notification
     */
    public Notification titleForeground(final Color headerForeground) {
        this.titleForeground = headerForeground;
        return this;
    }

    /**
     * The font of the title in the notification.
     * @param titleFont the font of the title
     */
    public Notification titleFont(final Font titleFont) {
        this.titleFont = titleFont;
        return this;
    }

    /**
     * The font of the main message text in the notification.
     * @param font the font of the main message text
     */
    public Notification font(final Font font) {
        this.font = font;
        return this;
    }

    /**
     * The opacity of the notification. Valid values are 0.0 (invisible) to
     * 1.0 (solid).
     * @param opacity
     */
    public Notification opacity(final String opacity) {
        this.opacity = opacity;
        return this;
    }

    /**
     * If the humanized flag is <code>true</code>, the message will disappear automatically if the user moves the mouse or
     * presses any key. Default false.
     * @param humanized the humanized mode
     */
    public Notification humanized(final boolean humanized) {
        this.humanized = humanized;
        return this;
    }

    /**
     * Returns the value of the duration in milliseconds of the
     * notification message appearance.
     *
     * @param duration the duration to wait before the notification goes away.
     */
    public Notification duration(final int duration) {
        this.duration = duration;
        return this;
    }

    /**
     * If 'true' the message will not fade if the user hovers the message (with the mouse).
     * Otherwise it will stop fading and wait for a click of the user.
     * @param hoverInterrupt if true the message will not fade if the user hovers the message
     */
    public Notification hoverInterrupt(final boolean hoverInterrupt) {
        this.hoverInterrupt = hoverInterrupt;
        return this;
    }

    /**
     * If 'true' the message will cover the whole application and will not allow any
     * user input except clicking to fade the blocking message away. Otherwise the message will not block
     * the content of the application.
     * @param overlayed if true the message will block any user input.
     */
    public Notification overlayed(final boolean overlayed) {
        this.overlayed = overlayed;
        return this;
    }

    /**
     * If 'true' the message has a clickable button. Otherwise the message will not show
     * the button. You may register for the click event to do something.
     * @param doShowBtn if true the message will have a clickable button
     */
    public Notification showButton(final boolean doShowBtn) {
        this.showButton = doShowBtn;
        return this;
    }

    /**
     * The text shown on the button.
     * @param buttonText the text on the button
     */
    public Notification buttonText(final String buttonText) {
        this.buttonText = buttonText;
        return this;
    }

    /**
     * The id used to identify a message. Useful if the optional button is clicked
     * to recognize the message.
     * @param id the message identifier
     */
    public Notification id(final String id) {
        this.id = id;
        return this;
    }
    //
    // Here are some getters... nothing interesting.
    //

    public String getTitle() {
        return title;
    }

    public String getText() {
        return text;
    }

    public boolean isSticky() {
        return sticky;
    }

    public Color getBackground() {
        return background;
    }

    public Color getForeground() {
        return foreground;
    }

    public Border getBorder() {
        return border;
    }

    public ImageReference getIcon() {
        return icon;
    }

    public Position getPosition() {
        return position;
    }

    public Extent getHeight() {
        return height;
    }

    public Extent getWidth() {
        return width;
    }

    public Color getTitleForeground() {
        return titleForeground;
    }

    public Font getTitleFont() {
        return titleFont;
    }

    public Font getFont() {
        return font;
    }

    public String getOpacity() {
        return opacity;
    }

    public boolean isHumanized() {
        return humanized;
    }

    public int getDuration() {
        return duration;
    }

    public boolean isHoverInterrupt() {
        return hoverInterrupt;
    }

    public boolean isOverlayed() {
        return overlayed;
    }

    public boolean isShowButton() {
        return showButton;
    }

    public String getButtonText() {
        return buttonText;
    }

    public String getId() {
        return id;
    }
}
