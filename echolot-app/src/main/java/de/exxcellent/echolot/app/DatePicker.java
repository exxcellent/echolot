/*
 * This file (DatePicker.java) is part of the Echolot Project (hereinafter "Echolot").
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

import com.thoughtworks.xstream.XStream;
import com.thoughtworks.xstream.io.json.JettisonMappedXmlDriver;
import java.util.EventListener;
import nextapp.echo.app.Alignment;
import nextapp.echo.app.Border;
import nextapp.echo.app.Color;
import nextapp.echo.app.Component;
import nextapp.echo.app.Extent;
import nextapp.echo.app.FillImage;
import nextapp.echo.app.Font;
import nextapp.echo.app.ImageReference;
import nextapp.echo.app.Insets;
import nextapp.echo.app.ResourceImageReference;
import nextapp.echo.app.event.ActionEvent;
import nextapp.echo.app.event.ActionListener;
import nextapp.echo.app.event.DocumentEvent;
import nextapp.echo.app.event.DocumentListener;
import nextapp.echo.app.text.Document;
import de.exxcellent.echolot.model.LocaleModel;

/**
 * DatePicker component: an calendar that can be used to select dates. The DatePicker can
 * <ul>
 * <li>rendered as plain calendar component</li>
 * <li>rendered as input textfield with a click or focus appearing calendar</li>
 * <li>rendered as input textfield with an icon that will trigger the calendar</li>
 * </ul>
 * 
 * <pre>
 * +----------------------+----+
 * | text field           |Icon|
 * +----------------------+----+
 * | < | March   2008 | > |
 * +----------------------+
 * | Su|Mo|Tu|We|Th|Fr|Sa |
 * |    1 |2 |3 |4 |5 |6  |
 * | 7 |8 |9 |10|11|12|13 |
 * | 14|15|16|17|18|19|20 |
 * | 21|22|23|24|25|26|27 |
 * | 28|29|30             |
 * +----------------------+
 * </pre>
 * 
 * The DatePicker features an animated and highly customizable calendar selection component, with the following
 * features:
 * <ul>
 * <li>show multiple calendars at once</li>
 * <li>complete keyboard navigation</li>
 * <li>restrict the input field to the given date format</li>
 * <li>allows text input as text or via date picker including synchronization</li>
 * <li>support for i18n using the localeModel</li>
 * <li>allows restriction of date range</li>
 * </ul>
 */
public class DatePicker extends Component {
    /** Serial Version UID. */
    private static final long serialVersionUID = 20090909L;

    private static final String CSS_REFERENCE =
            ResourceHelper.getFileAsString("js/datepicker/css/datepicker-template.css");

    // datepicker component properties
    /** the locale model to setup the dateformat and labels. */
    public static final String PROPERTY_LOCALE_MODEL = "localeModel";

    /**
     * the css as string injected in the html-head, since echo3 doesn't support any css styling by default
     */
    public static final String PROPERTY_CSS = "css";
    /** The desired event to trigger the date picker. Default: 'click'. */
    public static final String PROPERTY_TRIGGER_EVENT = "triggerEvent";
    /** Number of calendars to render inside the date picker. Default 1. */
    public static final String PROPERTY_NUMBER_OF_CALENDARS = "numberOfCalendars";
    /** default date if no input is available. */
    public static final String PROPERTY_DEFAULT_DATE = "defaultDate";
    /** Start view mode. Default 'days', one of ['days'|'months'|'years']. */
    public static final String PROPERTY_VIEW_MODE = "viewMode";
    /** Date selection mode. Default 'single', one of ['single'|'multiple'|'range']. */
    public static final String PROPERTY_SELECTION_MODE = "selectionMode";
    /** Whatever if the date picker is appended to the element or triggered by an event. Default false */
    public static final String PROPERTY_HIDE_ON_SELECT = "hideOnSelect";
    /** Whatever if the date picker is appended to the element or triggered by an event. Default false */
    public static final String PROPERTY_FLAT_MODE = "flatMode";
    /**
     * Date picker's position relative to the trigegr element (non flat mode only). Default 'bottom', one of
     * ['top'|'left'|'right'|'bottom'].
     */
    public static final String PROPERTY_POSITION = "position";
    /** if true the debug mode is enabled with some debug information. */
    public static final String PROPERTY_DEBUG = "debug";

    // inputfield properties
    public static final String INPUT_ACTION = "action";
    public static final String PROPERTY_ACTION_COMMAND = "actionCommand";
    public static final String PROPERTY_ALIGNMENT = "alignment";
    public static final String PROPERTY_BACKGROUND_IMAGE = "backgroundImage";
    public static final String PROPERTY_BORDER = "border";
    public static final String PROPERTY_DISABLED_BACKGROUND = "disabledBackground";
    public static final String PROPERTY_DISABLED_BACKGROUND_IMAGE = "disabledBackgroundImage";
    public static final String PROPERTY_DISABLED_BORDER = "disabledBorder";
    public static final String PROPERTY_DISABLED_FONT = "disabledFont";
    public static final String PROPERTY_DISABLED_FOREGROUND = "disabledForeground";
    public static final String PROPERTY_EDITABLE = "editable";
    public static final String PROPERTY_HEIGHT = "height";
    public static final String PROPERTY_INSETS = "insets";
    public static final String PROPERTY_MAXIMUM_LENGTH = "maximumLength";
    public static final String PROPERTY_TOOL_TIP_TEXT = "toolTipText";
    public static final String PROPERTY_WIDTH = "width";
    public static final String PROPERTY_REGEX = "regex";
    
    public static final String ACTION_LISTENERS_CHANGED_PROPERTY = "actionListeners";
    public static final String DOCUMENT_CHANGED_PROPERTY = "document";
    public static final String TEXT_CHANGED_PROPERTY = "text";

    // css styling images
    public static final String PROPERTY_DATEPICKER_T_IMG = "DATEPICKER_T_IMG";
    public static final String PROPERTY_DATEPICKER_B_IMG = "DATEPICKER_B_IMG";
    public static final String PROPERTY_DATEPICKER_L_IMG = "DATEPICKER_L_IMG";
    public static final String PROPERTY_DATEPICKER_R_IMG = "DATEPICKER_R_IMG";
    public static final String PROPERTY_DATEPICKER_W_IMG = "DATEPICKER_W_IMG";//TL
    public static final String PROPERTY_DATEPICKER_X_IMG = "DATEPICKER_X_IMG";//TR
    public static final String PROPERTY_DATEPICKER_Y_IMG = "DATEPICKER_Y_IMG";//BL
    public static final String PROPERTY_DATEPICKER_Z_IMG = "DATEPICKER_Z_IMG";//BR
    
    private static final ImageReference DATEPICKER_T_IMG =
            new ResourceImageReference("js/datepicker/css/images/datepicker_t.png");
    private static final ImageReference DATEPICKER_B_IMG =
            new ResourceImageReference("js/datepicker/css/images/datepicker_b.png");
    private static final ImageReference DATEPICKER_L_IMG =
            new ResourceImageReference("js/datepicker/css/images/datepicker_l.png");
    private static final ImageReference DATEPICKER_R_IMG =
            new ResourceImageReference("js/datepicker/css/images/datepicker_r.png");
    private static final ImageReference DATEPICKER_W_IMG =
            new ResourceImageReference("js/datepicker/css/images/datepicker_w.png");
    private static final ImageReference DATEPICKER_X_IMG =
            new ResourceImageReference("js/datepicker/css/images/datepicker_x.png");
    private static final ImageReference DATEPICKER_Y_IMG =
            new ResourceImageReference("js/datepicker/css/images/datepicker_y.png");
    private static final ImageReference DATEPICKER_Z_IMG =
            new ResourceImageReference("js/datepicker/css/images/datepicker_z.png");
    
    /** The serializer used to serialize model instances. */
    protected static final XStream xstream;

    static {
        /* The JsonHierarchicalStreamDriver can only write JSON */
        xstream = new XStream(new JettisonMappedXmlDriver());
        xstream.processAnnotations(LocaleModel.class);
    }
    
    private Document document;

    /**
     * Local listener to monitor changes to document.
     */
    private final DocumentListener documentListener = new DocumentListener() {

        /** Serial Version UID. */
        private static final long serialVersionUID = 20070101L;

        /**
         * @see nextapp.echo.app.event.DocumentListener#documentUpdate(nextapp.echo.app.event.DocumentEvent)
         */
        public void documentUpdate(DocumentEvent e) {
            firePropertyChange(TEXT_CHANGED_PROPERTY, null, ((Document) e.getSource()).getText());
        }
    };

    /**
     * Creates a new <code>DatePicker</code> with the specified <code>Document</code> as its model.
     * 
     * @param document the desired model
     */
    public DatePicker(Document document) {
        super();
        setDocument(document);
        setCSS(CSS_REFERENCE);

        /* set some default values. */
        setHideOnSelect(true);
        
        /* images in css */
        set(PROPERTY_DATEPICKER_T_IMG, DATEPICKER_T_IMG);
        set(PROPERTY_DATEPICKER_B_IMG, DATEPICKER_B_IMG);
        set(PROPERTY_DATEPICKER_L_IMG, DATEPICKER_L_IMG);
        set(PROPERTY_DATEPICKER_R_IMG, DATEPICKER_R_IMG);
        set(PROPERTY_DATEPICKER_W_IMG, DATEPICKER_W_IMG);
        set(PROPERTY_DATEPICKER_X_IMG, DATEPICKER_X_IMG);
        set(PROPERTY_DATEPICKER_Y_IMG, DATEPICKER_Y_IMG);
        set(PROPERTY_DATEPICKER_Z_IMG, DATEPICKER_Z_IMG);
        
    }

    /**
     * Adds an <code>ActionListener</code> to the <code>TextField</code>. The <code>ActionListener</code> will be
     * invoked when the user presses the ENTER key in the field.
     * 
     * @param l the <code>ActionListener</code> to add
     */
    public void addActionListener(ActionListener l) {
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
     * Returns the action command which will be provided in <code>ActionEvent</code>s fired by this
     * <code>TextField</code>.
     * 
     * @return the action command
     */
    public String getActionCommand() {
        return (String) get(PROPERTY_ACTION_COMMAND);
    }

    /**
     * Returns the alignment of the text component.
     * 
     * @return the alignment
     */
    public Alignment getAlignment() {
        return (Alignment) get(PROPERTY_ALIGNMENT);
    }

    /**
     * Returns the default background image of the text component.
     * 
     * @return the background image
     */
    public FillImage getBackgroundImage() {
        return (FillImage) get(PROPERTY_BACKGROUND_IMAGE);
    }

    /**
     * Returns the border of the text component.
     * 
     * @return the border
     */
    public Border getBorder() {
        return (Border) get(PROPERTY_BORDER);
    }
    
    /**
     * Returns the background color displayed when the text component is disabled.
     * 
     * @return the color
     */
    public Color getDisabledBackground() {
        return (Color) get(PROPERTY_DISABLED_BACKGROUND);
    }

    /**
     * Returns the background image displayed when the text component is disabled.
     * 
     * @return the background image
     */
    public FillImage getDisabledBackgroundImage() {
        return (FillImage) get(PROPERTY_DISABLED_BACKGROUND_IMAGE);
    }

    /**
     * Returns the border displayed when the text component is disabled.
     * 
     * @return the border
     */
    public Border getDisabledBorder() {
        return (Border) get(PROPERTY_DISABLED_BORDER);
    }

    /**
     * Returns the font displayed when the text component is disabled.
     * 
     * @return the font
     */
    public Font getDisabledFont() {
        return (Font) get(PROPERTY_DISABLED_FONT);
    }

    /**
     * Returns the foreground color displayed when the text component is disabled.
     * 
     * @return the color
     */
    public Color getDisabledForeground() {
        return (Color) get(PROPERTY_DISABLED_FOREGROUND);
    }

    /**
     * Returns the model associated with this <code>DatePicker</code>.
     * 
     * @return the model
     */
    public Document getDocument() {
        return document;
    }

    /**
     * Returns the height of the text component. This property only supports <code>Extent</code>s with fixed (i.e., not
     * percent) units.
     * 
     * @return the height
     */
    public Extent getHeight() {
        return (Extent) get(PROPERTY_HEIGHT);
    }

    /**
     * Returns the insets of the text component.
     * 
     * @return the insets
     */
    public Insets getInsets() {
        return (Insets) get(PROPERTY_INSETS);
    }
    
    /**
     * Returns the maximum length (in characters) of the text which may be entered into the component.
     * 
     * @return the maximum length, or -1 if no value is specified
     */
    public int getMaximumLength() {
        Integer value = (Integer) get(PROPERTY_MAXIMUM_LENGTH);
        return value == null ? -1 : value.intValue();
    }

    /**
     * Returns the text contained in the <code>Document</code> model of this text component.
     * 
     * @return the text contained in the document
     */
    public String getText() {
        return document.getText();
    }

    /**
     * Returns the tool tip text (displayed when the mouse cursor is hovered over the component).
     * 
     * @return the tool tip text
     */
    public String getToolTipText() {
        return (String) get(PROPERTY_TOOL_TIP_TEXT);
    }

    /**
     * Returns the width of the text component. This property supports <code>Extent</code>s with either fixed or
     * percentage-based units.
     * 
     * @return the width
     */
    public Extent getWidth() {
        return (Extent) get(PROPERTY_WIDTH);
    }

    /**
     * Determines the any <code>ActionListener</code>s are registered.
     * 
     * @return true if any action listeners are registered
     */
    public boolean hasActionListeners() {
        return hasEventListenerList() && getEventListenerList().getListenerCount(ActionListener.class) != 0;
    }

    /**
     * Determines the editable state of this component. Components that are not editable do not receive user input, but
     * they do gain focus, so it is possible to, say, copy the component's text using keyboard shortcuts.
     * 
     * @return <code>true</code> if this component is editable
     */
    public boolean isEditable() {
        Object property = get(PROPERTY_EDITABLE);
        return null == property ? true : ((Boolean) property).booleanValue();
    }

    /**
     * This component does not support children.
     * 
     * @see nextapp.echo.app.Component#isValidChild(nextapp.echo.app.Component)
     */
    @Override
    public boolean isValidChild(Component component) {
        return false;
    }

    /**
     * @see nextapp.echo.app.Component#processInput(java.lang.String, java.lang.Object)
     */
    @Override
    public void processInput(String inputName, Object inputValue) {
        super.processInput(inputName, inputValue);

        if (TEXT_CHANGED_PROPERTY.equals(inputName)) {
            setText((String) inputValue);
        } else if (INPUT_ACTION.equals(inputName)) {
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
     * Sets the action command which will be provided in <code>ActionEvent</code>s fired by this <code>TextField</code>.
     * 
     * @param newValue the new action command
     */
    public void setActionCommand(String newValue) {
        set(PROPERTY_ACTION_COMMAND, newValue);
    }

    /**
     * Sets the alignment of the text component.
     * 
     * @param newValue the new alignment
     */
    public void setAlignment(Alignment newValue) {
        set(PROPERTY_ALIGNMENT, newValue);
    }

    /**
     * Sets the default background image of the text component.
     * 
     * @param newValue the new background image
     */
    public void setBackgroundImage(FillImage newValue) {
        set(PROPERTY_BACKGROUND_IMAGE, newValue);
    }

    /**
     * Sets the border of the text component.
     * 
     * @param newValue the new border
     */
    public void setBorder(Border newValue) {
        set(PROPERTY_BORDER, newValue);
    }

    /**
     * Sets the background color displayed when the component is disabled.
     * 
     * @param newValue the new <code>Color</code>
     */
    public void setDisabledBackground(Color newValue) {
        set(PROPERTY_DISABLED_BACKGROUND, newValue);
    }

    /**
     * Sets the background image displayed when the component is disabled.
     * 
     * @param newValue the new background image
     */
    public void setDisabledBackgroundImage(FillImage newValue) {
        set(PROPERTY_DISABLED_BACKGROUND_IMAGE, newValue);
    }

    /**
     * Sets the border displayed when the component is disabled.
     * 
     * @param newValue the new border
     */
    public void setDisabledBorder(Border newValue) {
        set(PROPERTY_DISABLED_BORDER, newValue);
    }

    /**
     * Sets the font displayed when the component is disabled.
     * 
     * @param newValue the new <code>Font</code>
     */
    public void setDisabledFont(Font newValue) {
        set(PROPERTY_DISABLED_FONT, newValue);
    }

    /**
     * Sets the foreground color displayed when the component is disabled.
     * 
     * @param newValue the new <code>Color</code>
     */
    public void setDisabledForeground(Color newValue) {
        set(PROPERTY_DISABLED_FOREGROUND, newValue);
    }

    /**
     * Sets the model associated with this <code>DatePicker</code>.
     * 
     * @param newValue the new model (may not be null)
     */
    public void setDocument(Document newValue) {
        if (newValue == null) {
            throw new IllegalArgumentException("Document may not be null.");
        }
        Document oldValue = getDocument();
        if (oldValue != null) {
            oldValue.removeDocumentListener(documentListener);
        }
        newValue.addDocumentListener(documentListener);
        document = newValue;
    }

    /**
     * Sets the editable state of this component. Components that are not editable do not receive user input, but they
     * do gain focus, so it is possible to, say, copy the component's text using keyboard shortcuts.
     * 
     * @param newValue the new editable state
     */
    public void setEditable(boolean newValue) {
        set(PROPERTY_EDITABLE, Boolean.valueOf(newValue));
    }

    /**
     * Sets the height of the text component. This property only supports <code>Extent</code>s with fixed (i.e., not
     * percent) units.
     * 
     * @param newValue the new height
     */
    public void setHeight(Extent newValue) {
        set(PROPERTY_HEIGHT, newValue);
    }

    /**
     * Sets the insets of the text component.
     * 
     * @param newValue the new insets
     */
    public void setInsets(Insets newValue) {
        set(PROPERTY_INSETS, newValue);
    }
    
    /**
     * Sets the maximum length (in characters) of the text which may be entered into the component.
     * 
     * @param newValue the new maximum length, or -1 if to specify an unlimited length
     */
    public void setMaximumLength(int newValue) {
        if (newValue < 0) {
            set(PROPERTY_MAXIMUM_LENGTH, null);
        } else {
            set(PROPERTY_MAXIMUM_LENGTH, new Integer(newValue));
        }
    }

    /**
     * Sets the text of document model of this text component.
     * 
     * @param newValue the new text
     */
    public void setText(String newValue) {
        Integer maxLength = (Integer) get(PROPERTY_MAXIMUM_LENGTH);
        if (newValue != null && maxLength != null && maxLength.intValue() > 0 && newValue.length() > maxLength.intValue()) {
            getDocument().setText(newValue.substring(0, maxLength.intValue()));
        } else {
            getDocument().setText(newValue);
        }
    }

    /**
     * Sets the tool tip text (displayed when the mouse cursor is hovered over the component).
     * 
     * @param newValue the new tool tip text
     */
    public void setToolTipText(String newValue) {
        set(PROPERTY_TOOL_TIP_TEXT, newValue);
    }

    /**
     * Sets the width of the text component. This property supports <code>Extent</code>s with either fixed or
     * percentage-based units.
     * 
     * @param newValue the new width
     */
    public void setWidth(Extent newValue) {
        set(PROPERTY_WIDTH, newValue);
    }
    
    /**
     * Returns the locale model containing localized labels and a date format.
     * 
     * @return the locale model for i18n
     */
    public LocaleModel getLocaleModel() {
        return (LocaleModel) get(PROPERTY_LOCALE_MODEL);
    }

    /**
     * Sets the i18n values for the DatePicker in a LocaleModel.
     * 
     * @param newValue the i18n values in a LocaleModel
     */
    public void setLocaleModel(LocaleModel newValue) {
        set(PROPERTY_LOCALE_MODEL, newValue);
    }
    
    /**
     * Returns the cascading style sheet for this component.
     * 
     * @return the cascading style sheet
     */
    public String getCSS() {
        return (String) get(PROPERTY_CSS);
    }

    /**
     * Sets the cascading style sheet for this component.
     * 
     * @param newValue the new css
     */
    public void setCSS(String newValue) {
        set(PROPERTY_CSS, newValue);
    }

    /**
     * The desired event to trigger the date picker. Default: 'click'.
     * 
     * @return datepicker event trigger
     */
    public String getTriggerEvent() {
        return (String) get(PROPERTY_TRIGGER_EVENT);
    }

    /**
     * The desired event to trigger the date picker. Default: 'click'.
     * 
     * @param newValue datepicker event trigger
     */
    public void setTriggerEvent(String newValue) {
        set(PROPERTY_TRIGGER_EVENT, newValue);
    }

    /**
     * How many calendars to show at once. The value can be a straight integer, Default: 1.
     * 
     * @return how many calendars to show at once.
     */
    public int getNumberOfCalendars() {
        return Integer.parseInt(((String) get(PROPERTY_NUMBER_OF_CALENDARS)));
    }

    /**
     * Set how many calendars to show at once. The value can be a straight integer, Default: 1.
     * 
     * @param newValue how many calendars to show at once.
     */
    public void setNumberOfCalendars(int newValue) {
        set(PROPERTY_NUMBER_OF_CALENDARS, newValue);
    }

    /**
     * The date to highlight on first opening if the field is blank. The selected date(s) as string (will be converted
     * to Date object based on teh format suplied) and Date object for single selection, as Array of strings or Date
     * objects.
     * 
     * @return the date to highlight on first opening if the field is blank.
     */
    public String getDefaultDate() {
        return (String) get(PROPERTY_DEFAULT_DATE);
    }

    /**
     * Set The selected date(s) as string (will be converted to Date object based on teh format suplied) and Date object
     * for single selection, as Array of strings or Date objects.
     * 
     * @param newValue the date to highlight on first opening if the field is blank.
     */
    public void setDefaultDate(String newValue) {
        set(PROPERTY_DEFAULT_DATE, newValue);
    }
    
    /**
     * Start view mode. Default 'days', one of ['days'|'months'|'years'].
     * 
     * @return the start view mode
     */
    public String getViewMode() {
        return (String) get(PROPERTY_VIEW_MODE);
    }

    /**
     * Set the start view mode. Default 'days', one of ['days'|'months'|'years'].
     * 
     * @param newValue the start view mode
     */
    public void setViewMode(String newValue) {
        set(PROPERTY_VIEW_MODE, newValue);
    }

    /**
     * Date selection mode. Default 'single', one of ['single'|'multiple'|'range'].
     * 
     * @return the date selection mode.
     */
    public String getSelectionMode() {
        return (String) get(PROPERTY_SELECTION_MODE);
    }

    /**
     * Set the Date selection mode. Default 'single', one of ['single'|'multiple'|'range'].
     * 
     * @param newValue the date selection mode.
     */
    public void setSelectionMode(String newValue) {
        set(PROPERTY_SELECTION_MODE, newValue);
    }

    /**
     * Sets the behavior to hide the datePicker popup after selection of a date. default: true.
     * 
     * @param newValue the new hideOnSelect behavior
     */
    public void setHideOnSelect(boolean newValue) {
        set(PROPERTY_HIDE_ON_SELECT, Boolean.valueOf(newValue));
    }

    /**
     * Returns the behavior to hide the datePicker popup after selection of a date. default: true.
     * 
     * @return <code>true</code> if this component will hide on selecting a date.
     */
    public boolean isHideOnSelect() {
        Object property = get(PROPERTY_HIDE_ON_SELECT);
        return null == property ? true : ((Boolean) property).booleanValue();
    }

    /**
     * Whatever if the date picker is appended to the element or triggered by an event. Default false.
     * 
     * @param newValue the new flat mode
     */
    public void setFlatMode(boolean newValue) {
        set(PROPERTY_FLAT_MODE, Boolean.valueOf(newValue));
    }

    /**
     * Whatever if the date picker is appended to the element or triggered by an event. Default false.
     * 
     * @return <code>true</code> if this component is in flat mode
     */
    public boolean isFlatMode() {
        Object property = get(PROPERTY_FLAT_MODE);
        return null == property ? true : ((Boolean) property).booleanValue();
    }

    /**
     * Date picker's position relative to the trigger element (non flat mode only). Default 'bottom', one of
     * ['top'|'left'|'right'|'bottom'].
     * 
     * @return the popup position.
     */
    public String getPosition() {
        return (String) get(PROPERTY_POSITION);
    }

    /**
     * Date picker's position relative to the trigger element (non flat mode only). Default 'bottom', one of
     * ['top'|'left'|'right'|'bottom'].
     * 
     * @param newValue the popup position.
     */
    public void setPosition(String newValue) {
        set(PROPERTY_POSITION, newValue);
    }

    /**
     * if true the debug mode is enabled with some debug information.
     * 
     * @param newValue the debug mode.
     */
    public void setDebug(boolean newValue) {
        set(PROPERTY_DEBUG, Boolean.valueOf(newValue));
    }

    /**
     * if true the debug mode is enabled with some debug information.
     * 
     * @return <code>true</code> if debug is enabled
     */
    public boolean isDebug() {
        Object property = get(PROPERTY_DEBUG);
        return null == property ? true : ((Boolean) property).booleanValue();
    }
    /**
     * Date picker's regex is used to restrict the textfield input.
     * 
     * @return the regEx used to omit invalid input.
     */
    public String getRegEx() {
        return (String) get(PROPERTY_REGEX);
    }

    /**
     * Date picker's regex is used to restrict the textfield input, e.g. "^[0-9\\-]*$" will restrict to only use numbers
     * and "-" as valid input. All other values are omitted.
     * 
     * @param regEx the regEx used to omit invalid input.
     */
    public void setRegEx(String regEx) {
        set(PROPERTY_REGEX, regEx);
    }
}