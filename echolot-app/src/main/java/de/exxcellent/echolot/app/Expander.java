/*
 * This file (Expander.java) is part of the Echolot Project (hereinafter "Echolot").
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

package de.exxcellent.echolot.app;

import nextapp.echo.app.*;
import nextapp.echo.app.event.ActionEvent;
import nextapp.echo.app.event.ActionListener;

import java.util.EventListener;

/**
 /**
 * Expander component: A container which has either one or two children. It renders a section
 * line with an optional title at the top of its content. The content can be toggled by
 * clicking the header. The first child is shown by default.
 * May contain one or two child component. Doesn't support a pane component as a child.
 * <p>
 * The initially visible child is depending on the visible_child_idx property. The first child is
 * always the one shown by default.
 * <ul>
 *  <li>If two children exists, the first child is shown by default. A click on the header will hide the first child and show the second child.</li>
 *  <li>If only one child is provided, this child will be visible by default. A click on the header will hide the child.</li>
 * </ul>
 * <p/>
 * <pre>
 * +----------------------------------------+
 * | Title                     (showHide) v |  <= Header, 'v' = collapse and fold image
 * +----------------------------------------+
 * | any content                            |
 * +----------------------------------------+
 * </pre>
 * <p/>
 * The Expander is an animated and highly customizable container component, with the following
 * features:
 * <ul>
 *  <li>minimalistic stylable header</li>
 *  <li>styleable through echo stylesheet (style properties)</li>
 *  <li>some nice animation effects while toggling</li>
 *  <li>rollover effect on header</li>
 *  <li>callback after toggling with index of the visible child</li>
 *  <li>focus management and keyboard control (hide on enter or space)</li>
 * </ul>
 */
public class Expander extends Component {
    /** Serial Version UID.*/
    private static final long serialVersionUID = 20101015L;

    /**
     * Constant value for <code>TITLE_POSITION</code> property indicating the
     * the title is left handed.
     */
    public static final String TITLE_POSITION_LEFT = "left";

    /**
     * Constant value for <code>TITLE_POSITION</code> property indicating the
     * the title is right handed.
     */
    public static final String TITLE_POSITION_RIGHT = "right";

    public static final String PROPERTY_TITLE = "title";
    public static final String PROPERTY_HIDE_TEXT = "hideText";
    public static final String PROPERTY_SHOW_TEXT = "showText";
    public static final String PROPERTY_SPEED = "speed";
    public static final String PROPERTY_HIDE_IMAGE = "hideImage";
    public static final String PROPERTY_SHOW_IMAGE = "showImage";
    public static final String PROPERTY_SHOW = "show";

    public static final String PROPERTY_ROLLOVER_FOREGROUND = "rolloverForeground";
    public static final String PROPERTY_ROLLOVER_BACKGROUND = "rolloverBackground";
    public static final String PROPERTY_ROLLOVER_BACKGROUND_IMAGE = "rolloverBackgroundImage";

    public static final String PROPERTY_TITLE_FOREGROUND = "titleForeground";
    public static final String PROPERTY_TITLE_FONT = "titleFont";
    public static final String PROPERTY_TITLE_INSETS = "titleInsets";
    public static final String PROPERTY_TITLE_POSITION = "titlePosition";

    public static final String PROPERTY_HEADER_BACKGROUND = "headerBackground";
    public static final String PROPERTY_HEADER_BACKGROUND_IMAGE = "titleBackgroundImage";
    public static final String PROPERTY_HEADER_BORDER = "headerBorder";
    public static final String PROPERTY_HEADER_HEIGHT = "headerHeight";
    public static final String PROPERTY_HEADER_INSETS = "headerInsets";

    public static final String PROPERTY_BORDER = "border";        
    public static final String PROPERTY_INSETS = "insets";

    public static final String PROPERTY_ICON_TEXT_FOREGROUND = "iconTextForeground";
    public static final String PROPERTY_ICON_TEXT_FONT = "iconTextFont";
    public static final String PROPERTY_ICON_TEXT_MARGIN = "iconTextMargin";
    public static final String PROPERTY_ICON_TEXT_MARGIN_TOP = "iconTextMarginTop";
    
    public static final String PROPERTY_FOCUSED_BACKGROUND = "focusedBackground";
    public static final String PROPERTY_FOCUSED_BACKGROUND_IMAGE = "focusedBackgroundImage";
    public static final String PROPERTY_FOCUSED_BORDER = "focusedBorder";

    // events
    public static final String PROPERTY_ACTION_COMMAND = "actionCommand";
    public static final String INPUT_CONTENT_TOGGLED = "contentToggled";
    public static final String ACTION_LISTENERS_CHANGED_PROPERTY = "actionListeners";


    /**
     * Creates a new <code>Expander</code>.
     */
    public Expander() {
        super();
    }

    /**
     * Adds an <code>ActionListener</code> to the <code>Expander</code>.
     * The <code>ActionListener</code> will be invoked when the user
     * toggles the content.
     *
     * @param l the <code>ActionListener</code> to add
     */
    public void addContentToggledListener(ActionListener l) {
        getEventListenerList().addListener(ActionListener.class, l);
        // Notification of action listener changes is provided due to
        // existence of hasActionListeners() method.
        firePropertyChange(ACTION_LISTENERS_CHANGED_PROPERTY, null, l);
    }

    /**
     * Fires an action event to all listeners.
     */
    private void fireActionEvent() {
        if (!hasEventListenerList()) {
            return;
        }
        EventListener[] listeners = getEventListenerList().getListeners(ActionListener.class);
        ActionEvent e = null;
        for (int i = 0; i < listeners.length; ++i) {
            if (e == null) {
                e = new ActionEvent(this, (String) getRenderProperty(PROPERTY_ACTION_COMMAND));
            }
            ((ActionListener) listeners[i]).actionPerformed(e);
        }
    }

    /**
     * @see nextapp.echo.app.Component#processInput(java.lang.String, java.lang.Object)
     */
    public void processInput(String inputName, Object inputValue) {
        super.processInput(inputName, inputValue);

        if (INPUT_CONTENT_TOGGLED.equals(inputName)) {
            fireActionEvent();
        }
    }

    /**
     * Removes an <code>ActionListener</code> from the <code>TextField</code>.
     *
     * @param l the <code>ActionListener</code> to remove
     */
    public void removeActionListener(ActionListener l) {
        if (!hasEventListenerList()) {
            return;
        }
        getEventListenerList().removeListener(ActionListener.class, l);
        // Notification of action listener changes is provided due to
        // existence of hasActionListeners() method.
        firePropertyChange(ACTION_LISTENERS_CHANGED_PROPERTY, l, null);
    }

    /**
     * Sets the action command which will be provided in
     * <code>ActionEvent</code>s fired by this <code>TextField</code>.
     *
     * @param newValue the new action command
     */
    public void setActionCommand(String newValue) {
        set(PROPERTY_ACTION_COMMAND, newValue);
    }

    /**
     * Returns the action command which will be provided in
     * <code>ActionEvent</code>s fired by this <code>TextField</code>.
     *
     * @return the action command
     */
    public String getActionCommand() {
        return (String) get(PROPERTY_ACTION_COMMAND);
    }

    /**
     * Returns the background color of the header when the expander is focused.
     *
     * @return the color
     */
    public Color getFocusedBackground() {
        return (Color) get(PROPERTY_FOCUSED_BACKGROUND);
    }

    /**
     * Returns the background image displayed when the expander is focused.
     *
     * @return the background image
     */
    public FillImage getFocusedBackgroundImage() {
        return (FillImage) get(PROPERTY_FOCUSED_BACKGROUND_IMAGE);
    }

    /**
     * Returns the border displayed around the header when the expander is
     * focused.
     *
     * @return the border
     */
    public Border getFocusedBorder() {
        return (Border) get(PROPERTY_FOCUSED_BORDER);
    }

    /**
     * Sets the background color of the header when the expander is focused.
     *
     * @param newValue the new <code>Color</code>
     */
    public void setFocusedBackground(Color newValue) {
        set(PROPERTY_FOCUSED_BACKGROUND, newValue);
    }

    /**
     * Sets the background image displayed when the expander is focused.
     *
     * @param newValue the new background image
     */
    public void setFocusedBackgroundImage(FillImage newValue) {
        set(PROPERTY_FOCUSED_BACKGROUND_IMAGE, newValue);
    }

    /**
     * Sets the border displayed around the header when the expander is focused.
     *
     * @param newValue the new border
     */
    public void setFocusedBorder(Border newValue) {
        set(PROPERTY_FOCUSED_BORDER, newValue);
    }

    /**
     * Returns the "hide" text of the component.
     *
     * @return the "hide" text
     */
    public String getHideText() {
        return (String) get(PROPERTY_HIDE_TEXT);
    }

    /**
     * Returns the border of the component.
     *
     * @return the border
     */
    public Border getBorder() {
        return (Border) get(PROPERTY_BORDER);
    }

    /**
     * Returns the title border of the header.
     *
     * @return the border
     */
    public Border getHeaderBorder() {
        return (Border) get(PROPERTY_HEADER_BORDER);
    }

    /**
     * Returns the insets of the component. (padding)
     *
     * @return the insets
     */
    public Insets getInsets() {
        return (Insets) get(PROPERTY_INSETS);
    }

    /**
     * Returns the title insets of the component. (padding)
     *
     * @return the insets
     */
    public Insets getTitleInsets() {
        return (Insets) get(PROPERTY_TITLE_INSETS);
    }

    /**
     * Returns the title of the header.
     *
     * @return the title of the header
     */
    public String getTitle() {
        return (String) get(PROPERTY_TITLE);
    }

    /**
     * Returns the "show" text contained in the header of this component.
     *
     * @return the "show" text contained in the header
     */
    public String getShowText() {
        return (String) get(PROPERTY_SHOW_TEXT);
    }

    /**
     * This component supports at maximum two children and no Panes.
     */
    @Override
    public boolean isValidChild(Component component) {
        return !(getComponentCount() > 2 || component instanceof Pane);
    }

    /**
     * Sets the border of the component.
     *
     * @param newValue the new border
     */
    public void setBorder(Border newValue) {
        set(PROPERTY_BORDER, newValue);
    }

    /**
     * Sets the border of the header.
     *
     * @param newValue the new border
     */
    public void setHeaderBorder(Border newValue) {
        set(PROPERTY_HEADER_BORDER, newValue);
    }

    public void setHeaderHeight(Extent newValue) {
        set(PROPERTY_HEADER_HEIGHT, newValue);
    }

    /**
     * Sets the insets of the component.
     *
     * @param newValue the new insets
     */
    public void setInsets(Insets newValue) {
        set(PROPERTY_INSETS, newValue);
    }

    /**
     * Sets the title insets of the component.
     *
     * @param newValue the new title insets
     */
    public void setTitleInsets(Insets newValue) {
        set(PROPERTY_TITLE_INSETS, newValue);
    }

    /**
     * Sets the text of the "show" string in the header.
     *
     * @param newValue the new text
     */
    public void setShowText(String newValue) {
        set(PROPERTY_SHOW_TEXT, newValue);
    }

    /**
     * Sets the text of the "hide" string in the header.
     *
     * @param newValue the new text
     */
    public void setHideText(String newValue) {
        set(PROPERTY_HIDE_TEXT, newValue);
    }

    /**
     * Sets the title text in the header of this component.
     *
     * @param newValue the new title text
     */
    public void setTitle(String newValue) {
        set(PROPERTY_TITLE, newValue);
    }

    /**
     * Sets the "hide" image in the header.
     *
     * @param newValue the new "hide" image.
     */
    public void setHideImage(FillImage newValue) {
        set(PROPERTY_HIDE_IMAGE, newValue);
    }

    /**
     * Returns the "hide" image of the header.
     *
     * @return the "hide" image of the header
     */
    public FillImage getHideImage() {
        return (FillImage) get(PROPERTY_HIDE_IMAGE);
    }

    /**
     * Sets the "show" image in the header.
     *
     * @param newValue the new "show" image.
     */
    public void setShowImage(FillImage newValue) {
        set(PROPERTY_SHOW_IMAGE, newValue);
    }

    /**
     * Returns the "show" image of the header.
     *
     * @return the "show" image of the header
     */
    public FillImage getShowImage() {
        return (FillImage) get(PROPERTY_SHOW_IMAGE);
    }

    /**
     * Sets the speed in milliseconds how long the slide will be animated.
     *
     * @param newValue the new speed of the slide appearance (ms)
     */
    public void setSpeed(int newValue) {
        set(PROPERTY_SPEED, Integer.valueOf(newValue));
    }

    /**
     * Returns the value of the speed the animation will take in milliseconds.
     *
     * @return the current duration
     */
    public int getSpeed() {
        final Number speedValue = (Number) get(PROPERTY_SPEED);
        return speedValue == null ? 0 : speedValue.intValue();
    }

    /**
     * Sets the title font of the <code>Expander</code>.
     *
     * @param newValue the new <code>Font</code>
     */
    public void setTitleFont(Font newValue) {
        set(PROPERTY_TITLE_FONT, newValue);
    }

    /**
     * Returns the title font of the component.
     *
     * @return the font of the title
     */
    public Font getTitleFont() {
        return (Font) get(PROPERTY_TITLE_FONT);
    }

    /**
     * Sets the "hide and show" text font of the header.
     *
     * @param newValue the new <code>Font</code>
     */
    public void setIconTextFont(Font newValue) {
        set(PROPERTY_ICON_TEXT_FONT, newValue);
    }

    /**
     * Returns the "hide and show" text font of the header.
     *
     * @return the font of the "hide and show"
     */
    public Font getIconTextFont() {
        return (Font) get(PROPERTY_ICON_TEXT_FONT);
    }

    /**
     * Sets the color of the title.
     * @param newValue the new color used for the title
     */
    public void setTitleForeground(final Color newValue) {
        set(PROPERTY_TITLE_FOREGROUND, newValue);
    }

    /**
     * Returns the color of the title.
     * @return the color of the title
     */
    public Color getTitleForeground() {
        return (Color) get(PROPERTY_TITLE_FOREGROUND);
    }

    /**
     * Sets the color of the "hide and show" text.
     * @param newValue the new color used for the "hide and show"
     */
    public void setIconTextForeground(final Color newValue) {
        set(PROPERTY_ICON_TEXT_FOREGROUND, newValue);
    }

    /**
     * Returns the color of the "hide and show" text.
     * @return the color of the "hide and show"
     */
    public Color getIconTextForeground() {
        return (Color) get(PROPERTY_ICON_TEXT_FOREGROUND);
    }

    /**
     * Returns the overall header height.
     * @return the header height
     */
    public Extent getHeaderHeight() {
        return (Extent) get(PROPERTY_HEADER_HEIGHT);
    }

    /**
     * Returns the background color of the header used in the <code>Expander</code>.
     * @return the header background color
     */
    public Color getHeaderBackground() {
        return (Color) get(PROPERTY_HEADER_BACKGROUND);
    }

    /**
     * Sets the header background color of the <code>Expander</code>.
     * @param newValue the new rollover background <code>Color</code>
     */
    public void setHeaderBackground(Color newValue) {
        set(PROPERTY_HEADER_BACKGROUND, newValue);
    }

    /**
     * Returns the background color of the header used during the rollover effect in the <code>Expander</code>.
     * @return the header rollover background color
     */
    public Color getRolloverBackground() {
        return (Color) get(PROPERTY_ROLLOVER_BACKGROUND);
    }

    /**
     * Sets the rollover background color of the header in the <code>Expander</code>.
     * @param newValue the new rollover background <code>Color</code>
     */
    public void setRolloverBackground(Color newValue) {
        set(PROPERTY_ROLLOVER_BACKGROUND, newValue);
    }

    /**
     * Returns the rollover title foreground color of the header in the <code>Expander</code>.
     * @return the rollover foreground color
     */
    public Color getRolloverForeground() {
        return (Color) get(PROPERTY_ROLLOVER_FOREGROUND);
    }

    /**
     * Sets the rollover title foreground color of the header in the <code>Expander</code>.
     * @param newValue the new rollover foreground <code>Color</code>
     */
    public void setRolloverForeground(Color newValue) {
        set(PROPERTY_ROLLOVER_FOREGROUND, newValue);
    }

    /**
     * Sets the default header background image of the component.
     *
     * @param newValue the new header background image
     */
    public void setHeaderBackgroundImage(FillImage newValue) {
        set(PROPERTY_HEADER_BACKGROUND_IMAGE, newValue);
    }

    /**
     * Returns the header background image of the component.
     *
     * @return the header background image
     */
    public FillImage getHeaderBackgroundImage() {
        return (FillImage) get(PROPERTY_HEADER_BACKGROUND_IMAGE);
    }

    /**
     * Sets the rollover background image of the component.
     *
     * @param newValue the new rollover background image
     */
    public void setRolloverBackgroundImage(FillImage newValue) {
        set(PROPERTY_ROLLOVER_BACKGROUND_IMAGE, newValue);
    }

    /**
     * Returns the rollover background image of the component.
     *
     * @return the rollover background image
     */
    public FillImage getRolloverBackgroundImage() {
        return (FillImage) get(PROPERTY_ROLLOVER_BACKGROUND_IMAGE);
    }

    /**
     * Sets the spacing between the icon and the text in the header (show and hide
     * image and text).
     * @param newValue the spacing between icon and text
     */
    public void setIconTextMargin(Extent newValue) {
        set(PROPERTY_ICON_TEXT_MARGIN, newValue);
    }

    /**
     * Returns the spacing between the icon and the text in the header (show and hide
     * image and text).
     * @return the spacing between the icon and the text
     */
    public Extent getIconTextMargin() {
        return (Extent) get(PROPERTY_ICON_TEXT_MARGIN);
    }

    /**
     * Sets the spacing from the top of the header for the icon and the text (show and hide
     * image and text).
     * @param newValue the top spacing of icon and text
     */
    public void setIconTextMarginTop(Extent newValue) {
        set(PROPERTY_ICON_TEXT_MARGIN_TOP, newValue);
    }

    /**
     * Returns the spacing from the top of the header for the icon and the text (show and hide
     * image and text).
     * @return the top spacing for the icon and the text.
     */
    public Extent getIconTextMarginTop() {
        return (Extent) get(PROPERTY_ICON_TEXT_MARGIN_TOP);
    }

    /**
     * Returns the state of the first child. If true the first child
     * is visible otherwise its hidden (false). Hidden means no (or the second child) is visible.
     * @return true if the first child is visible.
     */
    public boolean isShow() {
        final Object property = get(PROPERTY_SHOW);
        return null == property || ((Boolean) property).booleanValue();
    }

    /**
     * Sets the state of the first child. True the first child is visible and false for
     * its hidden and the second or no child is visible.
     * @param newValue true will show the first child in the expander
     */
    public void setShow(final boolean newValue) {
        set(PROPERTY_SHOW, Boolean.valueOf(newValue));
    }

    /**
     * Returns the position of the title text. Valid values are "left" or "right".
     * @return the position of the title text
     */
    public String getTitlePosition() {
        return (String) get(PROPERTY_TITLE_POSITION);
    }

    /**
     * Sets the title position to either left or right handed. Valid values are
     * "left" or "right".
     * @param newValue the position of the title text
     */
    public void setTitlePosition(String newValue){
        set(PROPERTY_TITLE_POSITION, newValue);
    }

    /**
     * Sets the main content shown in the expander.
     * @param contentComponent the content of the expander
     */
    public void setContent(Component contentComponent) {
        add(contentComponent, 0);
    }

    /**
     * Sets the optional hidden content that is shown if the main
     * content is hidden.
     * @param hiddenComponent the optional hidden content.
     */
    public void setHiddenContent(Component hiddenComponent) {
        add(hiddenComponent, 1);
    }

    /**
     * Sets the header insets of the component. The header insets are the
     * padding for the whole clickable header.
     *
     * @param newValue the new title insets
     */
    public void setHeaderInsets(Insets newValue) {
        set(PROPERTY_HEADER_INSETS, newValue);
    }

    /**
     * Returns the header insets of the component. (padding)
     *
     * @return the insets
     */
    public Insets getHeaderInsets() {
        return (Insets) get(PROPERTY_HEADER_INSETS);
    }
}