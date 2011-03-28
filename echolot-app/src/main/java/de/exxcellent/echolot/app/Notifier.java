/*
 * This file (Notifier.java) is part of the Echolot Project (hereinafter "Echolot").
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

import de.exxcellent.echolot.model.Notification;
import nextapp.echo.app.*;
import nextapp.echo.app.event.ActionEvent;
import nextapp.echo.app.event.ActionListener;

import java.util.EventListener;

/**
 * Notifier component: displays messages on the top of everything. The Notifier is a fire-and-forget
 * component that is should only have one instance per Application. It shows a message by setting the
 * message properties upon the next sync.
 * <p/>
 * <pre>
 * +----------------------------------------+
 * |      | A title                       x |
 * | Icon |                                 |
 * |      | This text describes the warning |
 * | Button (optional)                      |
 * +----------------------------------------+
 * </pre>
 * <p/>
 * The Notifier features an animated and highly customizable message component, with the following
 * features:
 * <ul>
 * <li>show multiple messages as stack</li>
 * <li>automatically fading-out OR sticky mode (click to hide) or humanized mode (move to hide)</li>
 * <li>different positions (center, topright, topleft, etc)</li>
 * <li>highly customizable style with predefined presets (message, warning, error)</li>
 * <li>optional button at the bottom of the message</li>
 * </ul>
 */
public class Notifier extends Component implements FloatingPane {
    /**
     * Serial Version UID.
     */
    private static final long serialVersionUID = 20100927L;

    public static final String POSITION_CENTER = "center";
    public static final String POSITION_TOPRIGHT = "topright";
    public static final String POSITION_BOTTOMRIGHT = "bottomright";
    public static final String POSITION_BOTTOMLEFT = "bottomleft";
    public static final String POSITION_TOPLEFT = "topleft";
    public static final String POSITION_TOPCENTER = "topcenter";
    public static final String POSITION_BOTTOMCENTER = "bottomcenter";

    public static final String PROPERTY_ICON = "icon";
    public static final String PROPERTY_TITLE = "title";
    public static final String PROPERTY_TEXT = "text";
    public static final String PROPERTY_STICKY = "sticky";
    public static final String PROPERTY_HUMANIZED = "humanized";
    public static final String PROPERTY_POSITION = "position";
    public static final String PROPERTY_RANDOM_ID = "randomId";
    public static final String PROPERTY_DURATION = "duration";

    public static final String PROPERTY_BACKGROUND_IMAGE = "backgroundImage";
    public static final String PROPERTY_BORDER = "border";
    public static final String PROPERTY_WIDTH = "width";
    public static final String PROPERTY_HEIGHT = "height";
    public static final String PROPERTY_INSETS = "insets";
    public static final String PROPERTY_ALIGNMENT = "alignment";

    public static final String PROPERTY_HEADER_FONT = "headerFont";
    public static final String PROPERTY_HEADER_FOREGROUND = "headerForeground";
    public static final String PROPERTY_OPACITY = "opacity";
    public static final String PROPERTY_HOVER_INTERRUPT = "hoverInterrupt";
    public static final String PROPERTY_OVERLAYED = "overlayed";

    public static final String PROPERTY_ID = "id";
    public static final String PROPERTY_BTN_SHOW = "btnShow";
    public static final String PROPERTY_BTN_TEXT = "btnText";

	public static final String ACTION_LISTENERS_CHANGED_PROPERTY = "actionListeners";
	public static final String ACTION_COMMAND_CHANGED_PROPERTY = "actionCommand";
	public static final String INPUT_ACTION = "action";

    private String actionCommand;
    /**
     * Creates a new <code>Notifier</code>.
     */
    public Notifier() {
        super();
    }

    /**
     * Shows the notification on the screen. The execution is delayed to the next
     * server/client sync (like any other component).
     *
     * @param notification the notification to show
     */
    public void showNotification(Notification notification) {        
        setId(notification.getId());
        setBackground(notification.getBackground());
        setForeground(notification.getForeground());
        setBorder(notification.getBorder());
        setTitle(notification.getTitle());
        setText(notification.getText());
        setIcon(notification.getIcon());
        setPosition(getStringPosition(notification.getPosition()));
        setWidth(notification.getWidth());
        setHeight(notification.getHeight());
        setSticky(notification.isSticky());
        setOpacity(notification.getOpacity());
        setFont(notification.getFont());
        setHeaderFont(notification.getTitleFont());
        setHeaderForeground(notification.getTitleForeground());
        setHumanized(notification.isHumanized());
        setDuration(notification.getDuration());
        setHoverInterrupt(notification.isHoverInterrupt());
        setOverlayed(notification.isOverlayed());
        setBtnShow(notification.isShowButton());
        setBtnText(notification.getButtonText());
    }

    private static String getStringPosition(Notification.Position position) {
        final String posStr;
        switch (position) {
            case CENTER:
                posStr = POSITION_CENTER;
                break;
            case TOPRIGHT:
                posStr = POSITION_TOPRIGHT;
                break;
            case BOTTOMRIGHT:
                posStr = POSITION_BOTTOMRIGHT;
                break;
            case BOTTOMLEFT:
                posStr = POSITION_BOTTOMLEFT;
                break;
            case TOPLEFT:
                posStr = POSITION_TOPLEFT;
                break;
            case TOPCENTER:
                posStr = POSITION_TOPCENTER;
                break;
            case BOTTOMCENTER:
                posStr = POSITION_BOTTOMCENTER;
                break;
            default:
                posStr = null;
                break;
        }
        return posStr;
    }

    /**
     * Returns the alignment of the message component.
     *
     * @return the alignment
     */
    public Alignment getAlignment() {
        return (Alignment) get(PROPERTY_ALIGNMENT);
    }

    /**
     * Returns the default background image of the message component.
     *
     * @return the background image
     */
    public FillImage getBackgroundImage() {
        return (FillImage) get(PROPERTY_BACKGROUND_IMAGE);
    }

    /**
     * Returns the border of the message component.
     *
     * @return the border
     */
    public Border getBorder() {
        return (Border) get(PROPERTY_BORDER);
    }

    /**
     * Returns the height of the message component. This property only supports <code>Extent</code>s with fixed (i.e., not
     * percent) units.
     *
     * @return the height
     */
    public Extent getHeight() {
        return (Extent) get(PROPERTY_HEIGHT);
    }

    /**
     * Returns the width of the message component. This property supports <code>Extent</code>s with either fixed or
     * percentage-based units.
     *
     * @return the width
     */
    public Extent getWidth() {
        return (Extent) get(PROPERTY_WIDTH);
    }

    /**
     * Returns the insets of the message component. (padding)
     *
     * @return the insets
     */
    public Insets getInsets() {
        return (Insets) get(PROPERTY_INSETS);
    }

    /**
     * Returns the title contained in the message.
     *
     * @return the title contained in the message
     */
    public String getTitle() {
        return (String) get(PROPERTY_TITLE);
    }

    /**
     * Returns the text contained in the message of this component.
     *
     * @return the text contained in the message
     */
    public String getText() {
        return (String) get(PROPERTY_TEXT);
    }

    /**
     * This component does not support children.
     */
    @Override
    public boolean isValidChild(Component component) {
        return false;
    }

    /**
     * Sets the alignment of the message component.
     *
     * @param newValue the new alignment
     */
    public void setAlignment(Alignment newValue) {
        set(PROPERTY_ALIGNMENT, newValue);
    }

    /**
     * Sets the default background image of the message component.
     *
     * @param newValue the new background image
     */
    public void setBackgroundImage(FillImage newValue) {
        set(PROPERTY_BACKGROUND_IMAGE, newValue);
    }

    /**
     * Sets the border of the message component.
     *
     * @param newValue the new border
     */
    public void setBorder(Border newValue) {
        set(PROPERTY_BORDER, newValue);
    }

    /**
     * Sets the height of the message component. This property only supports <code>Extent</code>s with fixed (i.e., not
     * percent) units.
     *
     * @param newValue the new height
     */
    public void setHeight(Extent newValue) {
        set(PROPERTY_HEIGHT, newValue);
    }

    /**
     * Sets the insets of the message component.
     *
     * @param newValue the new insets
     */
    public void setInsets(Insets newValue) {
        set(PROPERTY_INSETS, newValue);
    }

    /**
     * Sets the text of the message component.
     *
     * @param newValue the new text
     */
    public void setText(String newValue) {
        set(PROPERTY_TEXT, newValue);
    }

    /**
     * Sets the title text (displayed above the text) of this message component.
     *
     * @param newValue the new title text
     */
    public void setTitle(String newValue) {
        set(PROPERTY_TITLE, newValue);
    }

    /**
     * Sets the width of the message component. This property supports <code>Extent</code>s with either fixed or
     * percentage-based units.
     *
     * @param newValue the new width
     */
    public void setWidth(Extent newValue) {
        set(PROPERTY_WIDTH, newValue);
    }

    /**
     * If the sticky flag is <code>true</code>, the message will not disappear automatically. The user has to click on it.
     * Default false.
     *
     * @param newValue the sticky mode
     */
    public void setSticky(boolean newValue) {
        set(PROPERTY_STICKY, Boolean.valueOf(newValue));
    }

    /**
     * If the sticky flag is <code>true</code>, the message will not disappear automatically. The user has to click on it.
     *
     * @return <code>true</code> if this component is in sticky mode
     */
    public boolean isSticky() {
        final Object property = get(PROPERTY_STICKY);
        return null == property || ((Boolean) property).booleanValue();
    }

    /**
     * Sets the icon image of the message component. It is displayed right to
     * the message.
     *
     * @param newValue the new icon image.
     */
    public void setIcon(ImageReference newValue) {
        set(PROPERTY_ICON, newValue);
    }

    /**
     * Returns the icon image of the message component.
     *
     * @return the icon image in the message
     */
    public ImageReference getIcon() {
        return (ImageReference) get(PROPERTY_ICON);
    }

    /**
     * Sets the position where this message will appear. Valid values are {@link Notifier#POSITION_BOTTOMRIGHT},
     * {@link Notifier#POSITION_TOPRIGHT} and {@link Notifier#POSITION_CENTER}.
     *
     * @param newValue the new position of the message appearance
     */
    public void setPosition(String newValue) {
        set(PROPERTY_POSITION, newValue);
    }

    /**
     * Returns the value of the position of the notification message.
     *
     * @return the current position
     */
    public String getPosition() {
        return (String) get(PROPERTY_POSITION);
    }

    /**
     * Sets the duration in milliseconds how long a message will appear before it fades out.
     *
     * @param newValue the new duration of the message appearance (ms)
     */
    public void setDuration(int newValue) {
        set(PROPERTY_DURATION, Integer.valueOf(newValue));
    }

    /**
     * Returns the value of the duration in milliseconds of the notification message appearance.
     *
     * @return the current duration
     */
    public int getDuration() {
        return Integer.parseInt((String) get(PROPERTY_DURATION));
    }

    /**
     * Sets the random value for this message component. This value
     * is needed to force an update. Background: If nothing changes echo will
     * not inform the client about changes. But in this case the update of
     * properties in the client is our event to show a message.
     *
     * @param newValue any 'new' value like Math.random()
     */
    public void setRandomId(String newValue) {
        set(PROPERTY_RANDOM_ID, newValue);
    }

    /**
     * Sets the opacity of the whole message. Must be a number between "1.0" (solid) and
     * 0.0 (invisible)
     * @param newValue the new value for the opacity
     */
    public void setOpacity(String newValue) {
        set(PROPERTY_OPACITY, newValue);
    }

    /**
     * Returns the value of the currently used opacity.
     * @return the opacity value, like "0.5"
     */
    public String getOpacity() {
        return (String) get(PROPERTY_OPACITY);
    }

    /**
     * Sets the default header font of the <code>Notifier</code>.
     *
     * @param newValue the new <code>Font</code>
     */
    public void setHeaderFont(Font newValue) {
        set(PROPERTY_HEADER_FONT, newValue);
    }

    /**
     * Returns the header font of the component.
     *
     * @return the font of the header
     */
    public Font getHeaderFont() {
        return (Font) get(PROPERTY_HEADER_FONT);
    }

    /**
     * Sets the color of the header.
     * @param newValue the new color used for the header
     */
    public void setHeaderForeground(final Color newValue) {
        set(PROPERTY_HEADER_FOREGROUND, newValue);
    }

    /**
     * Returns the color of the header.
     * @return the color of the header
     */
    public Color getHeaderForeground() {
        return (Color) get(PROPERTY_HEADER_FOREGROUND);
    }

     /**
     * If the humanized flag is <code>true</code>, the message will disappear automatically if the user moves the mouse or
     * presses any key. Default false.
     *
     * @param newValue the humanized mode
     */
    public void setHumanized(boolean newValue) {
        set(PROPERTY_HUMANIZED, Boolean.valueOf(newValue));
    }

    /**
     * If the humanized flag is <code>true</code>, the message will not disappear automatically if the user moves the mouse
     * or presses any key.
     *
     * @return <code>true</code> if this component is in humanized mode
     */
    public boolean isHumanized() {
        final Object property = get(PROPERTY_HUMANIZED);
        return null == property ? true : ((Boolean) property).booleanValue();
    }

    /**
     * If the hoverInterrupt flag is <code>true</code>, the message will not disappear automatically if the user moves the mouse
     * over the message. Default true.
     *
     * @param newValue the hoverInterrupt mode
     */
    public void setHoverInterrupt(boolean newValue) {
        set(PROPERTY_HOVER_INTERRUPT, Boolean.valueOf(newValue));
    }

    /**
     * If the hoverInterrupt flag is <code>true</code>, the message will not disappear automatically if the user moves the mouse
     * over the message.
     *
     * @return <code>true</code> if this component is in hoverInterrupt mode
     */
    public boolean isHoverInterrupt() {
        final Object property = get(PROPERTY_HOVER_INTERRUPT);
        return null == property ? true : ((Boolean) property).booleanValue();
    }

    /**
     * If the overlayed flag is <code>true</code>, the message will block all content under id. Default false.
     *
     * @param newValue the overlayed mode
     */
    public void setOverlayed(boolean newValue) {
        set(PROPERTY_OVERLAYED, Boolean.valueOf(newValue));
    }

    /**
     * If the overlayed flag is <code>true</code>, the message will block all content under id. Default false.
     *
     * @return <code>true</code> if this component is in overlayed mode
     */
    public boolean isOverlayed() {
        final Object property = get(PROPERTY_OVERLAYED);
        return null == property ? true : ((Boolean) property).booleanValue();
    }

    /**
     * Sets the id of message. Used for callbacks to identify a message button click.
     * @param newValue the new value for the id
     */
    public void setId(String newValue) {
        set(PROPERTY_ID, newValue);
    }

    /**
     * Returns the value of the currently used id.
     * @return the id value, like "0.54564646BLABLA"
     */
    public String getId() {
        return (String) get(PROPERTY_ID);
    }


    /**
     * Sets the text of the optional button of the message.
     * @param newValue the new value for the text
     */
    public void setBtnText(String newValue) {
        set(PROPERTY_BTN_TEXT, newValue);
    }

    /**
     * Returns the value of the currently used text of the optional button.
     * @return the text value, like "Show Details"
     */
    public String getBtnText() {
        return (String) get(PROPERTY_BTN_TEXT);
    }

    /**
     * If the show button flag is <code>true</code>, the message will show a button below the main content. Default false.
     *
     * @param newValue the show button state
     */
    public void setBtnShow(boolean newValue) {
        set(PROPERTY_BTN_SHOW, Boolean.valueOf(newValue));
    }

    /**
     * If the show button flag is <code>true</code>, the message will show a button below the main content. Default false.
     *
     * @return <code>true</code> if this component shall show the button
     */
    public boolean isBtnShow() {
        final Object property = get(PROPERTY_BTN_SHOW);
        return null == property ? true : ((Boolean) property).booleanValue();
    }

    /*
     * Action event processing.
     */
    @Override
    public void processInput(String inputName, Object inputValue) {
        super.processInput(inputName, inputValue);
        if (INPUT_ACTION.equals(inputName)) {
            fireAction();
        }
    }

    public void addActionListener(ActionListener l) {
        getEventListenerList().addListener(ActionListener.class, l);
        firePropertyChange(ACTION_LISTENERS_CHANGED_PROPERTY, null, l);
    }

    public void removeActionListener(ActionListener l) {
        getEventListenerList().removeListener(ActionListener.class, l);
        firePropertyChange(ACTION_LISTENERS_CHANGED_PROPERTY, l, null);
    }

    public boolean hasActionListeners() {
        return hasEventListenerList()
                && getEventListenerList().getListenerCount(ActionListener.class) > 0;
    }

    public String getActionCommand() {
        return actionCommand;
    }

    public void setActionCommand(String newValue) {
        String oldValue = actionCommand;
        actionCommand = newValue;
        firePropertyChange(ACTION_COMMAND_CHANGED_PROPERTY, oldValue, newValue);
    }

    private void fireAction() {
        EventListener[] actionListeners
                = getEventListenerList().getListeners(ActionListener.class);
        ActionEvent e = new ActionEvent(this, getActionCommand());
        for (int i = 0; i < actionListeners.length; ++i) {
            ((ActionListener) actionListeners[i]).actionPerformed(e);
        }
    }
}