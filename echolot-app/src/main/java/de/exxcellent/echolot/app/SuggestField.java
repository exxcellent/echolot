/*
 * This file (SuggestField.java) is part of the Echolot Project (hereinafter "Echolot").
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

import de.exxcellent.echolot.event.ServerFilterTriggerEvent;
import de.exxcellent.echolot.event.SuggestItemSelectEvent;
import de.exxcellent.echolot.listener.ServerFilterListener;
import de.exxcellent.echolot.listener.SuggestItemSelectListener;
import de.exxcellent.echolot.model.SuggestItem;
import de.exxcellent.echolot.model.SuggestModel;
import nextapp.echo.app.Color;
import nextapp.echo.app.FillImage;
import nextapp.echo.app.Font;
import nextapp.echo.app.text.StringDocument;
import nextapp.echo.app.text.TextComponent;

import java.util.EventListener;

/**
 * Echo-Serverside component for the SuggestField
 *
 * @author Ralf Enderle
 * @version 1.0
 */
public class SuggestField extends TextComponent {

    public static final String PROPERTY_MIN_LENGTH = "minLength";
    public static final String PROPERTY_DELAY = "delay";
    public static final String PROPERTY_DISABLED = "disabled";
    public static final String PROPERTY_DO_SERVER_FILTER = "doServerFilter";
    public static final String PROPERTY_SHOW_DESCRIPTION = "showDescription";
    public static final String PROPERTY_SHOW_CATEGORY = "showCategory";
    public static final String PROPERTY_GROW_LEFT = "growLeft";

    // Layout and Styling
    public static final String PROPERTY_MAGNIFIER_IMG = "magnifierImg";
    public static final String PROPERTY_LOADING_IMG = "loadingImg";
    public static final String PROPERTY_SUGGEST_FONT = "suggestFont";
    public static final String PROPERTY_SUGGEST_FOREGROUND = "suggestForeground";
    public static final String PROPERTY_DESCRIPTION_FONT = "descriptionFont";
    public static final String PROPERTY_DESCRIPTION_FOREGROUND = "descriptionForeground";
    public static final String PROPERTY_SUGGEST_AREA_COLOR = "suggestAreaColor";
    public static final String PROPERTY_SUGGEST_AREA_HOVER = "suggestAreaHover";


    public static final String PROPERTY_SUGGEST_MODEL = "suggestModel";

    // Listener
    public static final String SERVER_FILTER_CHANGED_PROPERTY = "serverFilterTriggers";
    public static final String INPUT_TRIGGER_SERVER_FILTER = "async_triggerServerFilter";

    public static final String SUGGESTITEMSELECT_LISTENER_CHANGED_PROPERTY = "suggestItemSelectListeners";
    public static final String INPUT_SUGGEST_ITEM_SELECTED = "suggestItemSelected";

    public Integer getMinLength() {
        return (Integer) get(PROPERTY_MIN_LENGTH);
    }

    public void setMinLength(Integer minLength) {
        set(PROPERTY_MIN_LENGTH, minLength);
    }

    public Integer getDelay() {
        return (Integer) get(PROPERTY_DELAY);
    }

    public void setDelay(Integer delay) {
        set(PROPERTY_DELAY, delay);
    }

    public Boolean isDisabled() {
        return (Boolean) get(PROPERTY_DISABLED);
    }

    public void setDisabled(Boolean isDisabled) {
        set(PROPERTY_DISABLED, isDisabled);
    }

    public Boolean isShowDescription() {
        return (Boolean) get(PROPERTY_SHOW_DESCRIPTION);
    }

    public void setShowDescription(Boolean isShowDescription) {
        set(PROPERTY_SHOW_DESCRIPTION, isShowDescription);
    }

    public Boolean isShowCategory() {
        return (Boolean) get(PROPERTY_SHOW_CATEGORY);
    }

    public void setShowCategory(Boolean isShowCategory) {
        set(PROPERTY_SHOW_CATEGORY, isShowCategory);
    }

    /**
     * Indicates whether the suggestions grow from leftToRight or vice versa
     * @return
     *  true, if suggest grows from right-to-left
     *  false, if it grows from left-to-right
     */
    public boolean isGrowLeft() {
        final Object property = get(PROPERTY_GROW_LEFT);
        if (property == null) {
            return false;
        } else {
            return ((Boolean) property).booleanValue();
        }
    }

    /**
     * If growLeft is set to true, the suggestBox will start on the right side of the textField and grows to left
     * @param growLeft
     */
    public void setGrowLeft(boolean growLeft) {
        set(PROPERTY_GROW_LEFT, Boolean.valueOf(growLeft));
    }

    public SuggestModel getSuggestModel() {
        return (SuggestModel) get(PROPERTY_SUGGEST_MODEL);
    }

    public void setSuggestModel(SuggestModel suggestModel) {
        set(PROPERTY_SUGGEST_MODEL, suggestModel);
    }

    public Boolean isDoServerFilter() {
        return (Boolean) get(PROPERTY_DO_SERVER_FILTER);
    }

    public void setDoServerFilter(Boolean doServerFilter) {
        set(PROPERTY_DO_SERVER_FILTER, doServerFilter);
    }

    // Layout Properties

    public void setMagnifierImg(FillImage newValue) {
        set(PROPERTY_MAGNIFIER_IMG, newValue);
    }

    public FillImage getMagnifierImg() {
        return (FillImage) get(PROPERTY_MAGNIFIER_IMG);
    }

    public void setLoadingImg(FillImage newValue) {
        set(PROPERTY_LOADING_IMG, newValue);
    }

    public FillImage getLoadingImg() {
        return (FillImage) get(PROPERTY_LOADING_IMG);
    }

    public void setSuggestFont(Font suggestFont) {
        set(PROPERTY_SUGGEST_FONT, suggestFont);
    }

    public Font getSuggestFont() {
        return (Font) get(PROPERTY_SUGGEST_FONT);
    }

    public void setSuggestForeground(Color foreground) {
        set(PROPERTY_SUGGEST_FOREGROUND, foreground);
    }

    public Color getSuggestForeground() {
        return (Color) get(PROPERTY_SUGGEST_FOREGROUND);
    }

    public void setDescriptionFont(Font descriptionFont) {
        set(PROPERTY_DESCRIPTION_FONT, descriptionFont);
    }

    public Font getDescriptionFont() {
        return (Font) get(PROPERTY_DESCRIPTION_FONT);
    }

    public void setDescriptionForeground(Color foreground) {
        set(PROPERTY_DESCRIPTION_FOREGROUND, foreground);
    }

    public Color getDescriptionForeground() {
        return (Color) get(PROPERTY_DESCRIPTION_FOREGROUND);
    }

    public void setSuggestAreaColor(Color background) {
        set(PROPERTY_SUGGEST_AREA_COLOR, background);
    }

    public Color getSuggestAreaColor() {
        return (Color) get(PROPERTY_SUGGEST_AREA_COLOR);
    }

    public void setSuggestAreaHover(Color hoverColor) {
        set(PROPERTY_SUGGEST_AREA_HOVER, hoverColor);
    }

    public Color getSuggestAreaHover() {
        return (Color) get(PROPERTY_SUGGEST_AREA_HOVER);
    }


    public SuggestField() {
        super(new StringDocument());
    }

    @Override
    public void processInput(String inputName, Object inputValue) {
        super.processInput(inputName, inputValue);
        if (INPUT_TRIGGER_SERVER_FILTER.equals(inputName)) {
            triggerServerFilter(inputValue);
        }
        if (INPUT_SUGGEST_ITEM_SELECTED.equals(inputName)) {
            searchItemSelectedAction(inputValue);
        }
    }


    // ***********************
    // ** Handle Listeners: **
    // ***********************

    // ServerFilter:
    // -------------

    /**
     * Adds a {@link de.exxcellent.echolot.listener.ServerFilterListener}.
     *
     * @param l will be informed if a row is selected
     */
    public void addServerFilterListener(ServerFilterListener l) {
        getEventListenerList().addListener(ServerFilterListener.class, l);
        firePropertyChange(SERVER_FILTER_CHANGED_PROPERTY, null, l);
    }

    /**
     * Removes a {@link ServerFilterListener}
     *
     * @param l will be removed from listener list.
     */
    public void removeServerFilterListener(ServerFilterListener l) {
        getEventListenerList().removeListener(ServerFilterListener.class, l);
        firePropertyChange(SERVER_FILTER_CHANGED_PROPERTY, l, null);
    }

    /**
     * ActionHandler to trigger all {@link ServerFilterListener}
     *
     * @param inputValue
     */
    private void triggerServerFilter(Object inputValue) {
        if (!hasEventListenerList()) {
            return;
        }
        EventListener[] listeners = getEventListenerList().getListeners(ServerFilterListener.class);
        if (listeners.length == 0) {
            return;
        }
        ServerFilterTriggerEvent e = new ServerFilterTriggerEvent(this, (String) inputValue);
        for (EventListener listener : listeners) {
            ((ServerFilterListener) listener).serverFilter(e);
        }

    }

    /**
     * Returns true, if there are some ServerFilterListener registered
     *
     * @return
     */
    public boolean hasServerFilterListener() {
        if (!hasEventListenerList()) {
            return false;
        }
        return getEventListenerList().getListenerCount(ServerFilterListener.class) > 0;
    }

    // SuggestItemSelectListener
    // -------------------------

    /**
     * Adds a {@link de.exxcellent.echolot.listener.SuggestItemSelectListener}.
     *
     * @param l will be informed if a row is selected
     */
    public void addSuggestItemSelectListener(SuggestItemSelectListener l) {
        getEventListenerList().addListener(SuggestItemSelectListener.class, l);
        firePropertyChange(SUGGESTITEMSELECT_LISTENER_CHANGED_PROPERTY, null, l);
    }

    /**
     * Removes a {@link SuggestItemSelectListener}
     *
     * @param l will be removed from listener list.
     */
    public void removeSuggestItemSelectListener(SuggestItemSelectListener l) {
        getEventListenerList().removeListener(SuggestItemSelectListener.class, l);
        firePropertyChange(SUGGESTITEMSELECT_LISTENER_CHANGED_PROPERTY, l, null);
    }

    /**
     * Returns true, if there are some SuggestItemSelectListener registered
     *
     * @return
     */
    public boolean hasSuggestItemSelectListener() {
        if (!hasEventListenerList()) {
            return false;
        }
        return getEventListenerList().getListenerCount(SuggestItemSelectListener.class) > 0;
    }

    /**
     * ActionHandler to trigger all {@link SuggestItemSelectListener}
     *
     * @param inputValue
     */
    private void searchItemSelectedAction(Object inputValue) {
        if (!hasEventListenerList()) {
            return;
        }
        EventListener[] listeners = getEventListenerList().getListeners(SuggestItemSelectListener.class);
        if (listeners.length == 0) {
            return;
        }
        SuggestItemSelectEvent e = new SuggestItemSelectEvent(this, findSuggestItem((Integer) inputValue));
        for (EventListener listener : listeners) {
            ((SuggestItemSelectListener) listener).suggestItemSelected(e);
        }
    }

    /**
     * Private helper to search the corresponding SearchItem to an identifier
     *
     * @param identifier
     * @return
     */
    private SuggestItem findSuggestItem(final Integer identifier) {
        if (getSuggestModel() != null) {
            for (SuggestItem item : getSuggestModel().getSuggestItems()) {
                if (item.getIdentifier().equals(identifier)) {
                    return item;
                }
            }
        }
        return null;
    }
}
