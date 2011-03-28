/*
 * This file (BarChart.java) is part of the Echolot Project (hereinafter "Echolot").
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

import de.exxcellent.echolot.event.BarSelectEvent;
import de.exxcellent.echolot.listener.BarSelectListener;
import de.exxcellent.echolot.model.Bar;
import de.exxcellent.echolot.model.BarChartModel;
import de.exxcellent.echolot.model.BarType;
import de.exxcellent.echolot.model.ChartOrientation;
import nextapp.echo.app.Color;
import nextapp.echo.app.Component;
import nextapp.echo.app.Font;

import java.util.EventListener;

/**
 * Echo-Component to draw a BarChart
 *
 * @author Ralf Enderle <r.enderle@exxcellent.de>
 * @version 1.0
 */
public class BarChart extends Component {

    public static final String PROPERTY_WIDTH = "width";
    public static final String PROPERTY_HEIGHT = "height";
    public static final String PROPERTY_XGAP = "xgap";
    public static final String PROPERTY_YGAP = "ygap";
    public static final String PROPERTY_BAR_ALIGNMENT = "barAlignment";
    public static final String PROPERTY_HEAD_TYPE = "headType";
    public static final String PROPERTY_STACKED = "stacked";
    /**
     * Wanna have some nice looking Popup
     */
    public static final String PROPERTY_SHOW_POPUP = "showPopup";
    /**
     * The Background of the Popup
     */
    public static final String PROPERTY_POPUP_BACKGROUND = "popupBackground";
    /**
     * The Border-Color of the Popup
     */
    public static final String PROPERTY_POPUP_BORDER_COLOR = "popupBorderColor";
    /**
     * The Foreground of the Popup
     */
    public static final String PROPERTY_POPUP_FOREGROUND = "popupForeground";
    /**
     * The Font of the Popup
     */
    public static final String PROPERTY_POPUP_FONT = "popupFont";
    public static final String PROPERTY_SHOW_TOOLTIP = "showTooltip";
    public static final String PROPERTY_AUTO_ADJUST_POPUP = "autoAdjustPopup";

    // - comes from JSON
    public static final String PROPERTY_BAR_CHART_MODEL = "barChartModel";

    // Listener
    public static final String BARSELECT_LISTENERS_CHANGED_PROPERTY = "barSelectListeners";
    public static final String INPUT_BAR_SELECTION = "barSelection";

    /**
     * Returns the width
     *
     * @return
     */
    public int getWidth() {
        return (Integer) get(PROPERTY_WIDTH);
    }

    /**
     * Set the width
     *
     * @param width
     */
    public void setWidth(final int width) {
        set(PROPERTY_WIDTH, Integer.valueOf(width));
    }

    /**
     * Returns the height
     *
     * @return
     */
    public int getHeight() {
        return (Integer) get(PROPERTY_HEIGHT);
    }

    /**
     * Set the height
     *
     * @param height
     */
    public void setHeight(final int height) {
        set(PROPERTY_HEIGHT, Integer.valueOf(height));
    }

    /**
     * Returns the xgap
     *
     * @return
     * @see #setXgap(int)
     */
    public int getXgap() {
        return (Integer) get(PROPERTY_XGAP);
    }

    /**
     * Set the xgap<br>
     * The xGap specifies the space between the left beginning of the component and the bars itself<br>
     * _____________ <br>
     * | <xGap> _   |<br>
     * |       | |  |<br>
     * |_______|_|__|<br>
     *
     * @param xgap
     */
    public void setXgap(int xgap) {
        set(PROPERTY_XGAP, Integer.valueOf(xgap));
    }

    /**
     * Returns the ygap
     *
     * @return
     * @see #setYgap(int)
     */
    public int getYgap() {
        return (Integer) get(PROPERTY_YGAP);
    }

    /**
     * Set the ygap<br>
     * The yGap specifies the space between the bottom beginning of the component and the bars itself<br>
     * _____________ <br>
     * |        _   |<br>
     * |       | |  |<br>
     * |       |_|  |<br>
     * |     ^      |<br>
     * |     | yGap |<br>
     * |_____v______|<br>
     *
     * @param ygap
     */
    public void setYgap(int ygap) {
        set(PROPERTY_YGAP, Integer.valueOf(ygap));
    }

    /**
     * Returns the alignment of the chart.
     * Could be vertical or horizontal
     *
     * @return
     */
    public ChartOrientation getBarAlignment() {
        return ChartOrientation.toChartOrientation((String) get(PROPERTY_BAR_ALIGNMENT));
    }

    /**
     * Set the alignment of the chart
     *
     * @param barAlignment
     */
    public void setBarAlignment(ChartOrientation barAlignment) {
        set(PROPERTY_BAR_ALIGNMENT, barAlignment.getChartOrientationValue());
    }

    /**
     * Returns the type of the Bar
     *
     * @return
     */
    public BarType getHeadType() {
        return BarType.toBarType((String) get(PROPERTY_HEAD_TYPE));
    }

    /**
     * Set the Type of the Bar (specifies the visual appearance of the head)
     *
     * @param barType
     */
    public void setHeadType(BarType barType) {
        set(PROPERTY_HEAD_TYPE, barType.getBarTypeValue());
    }

    /**
     * Returns true, if the chart is displayed as a stacked-chart
     *
     * @return
     */
    public boolean isStacked() {
        return ((Boolean) get(PROPERTY_STACKED)).booleanValue();
    }

    /**
     * Specify, whether the chart should be displayed as stacked or not
     *
     * @param doStacked
     */
    public void setStacked(boolean doStacked) {
        set(PROPERTY_STACKED, Boolean.valueOf(doStacked));
    }

    /**
     * Returns true, if the popUp should be shown
     *
     * @return
     */
    public boolean isShowPopup() {
        return ((Boolean) get(PROPERTY_SHOW_POPUP)).booleanValue();
    }

    /**
     * Specify, whether the popUp should be shown or not
     *
     * @param doShowPopup
     */
    public void setShowPopup(boolean doShowPopup) {
        set(PROPERTY_SHOW_POPUP, Boolean.valueOf(doShowPopup));
    }

    // --- Property: PROPERTY_POPUP_BACKGROUND

    /**
     * Returns the background-color of the popup
     * @return
     */
    public Color getPopupBackground() {
        return (Color) get(PROPERTY_POPUP_BACKGROUND);
    }

    /**
     * Set the background-color of the popup
     * @param background
     */
    public void setPopupBackground(final Color background) {
        set(PROPERTY_POPUP_BACKGROUND, background);
    }

    // --- Property: PROPERTY_POPUP_BORDER_COLOR

    /**
     * Returns the border-color of the popup
     * @return
     */
    public Color getPopupBorderColor() {
        return (Color) get(PROPERTY_POPUP_BORDER_COLOR);
    }

    /**
     * Set the border-color of the popup
     * @param borderColor
     */
    public void setPopupBorderColor(final Color borderColor) {
        set(PROPERTY_POPUP_BORDER_COLOR, borderColor);
    }
    // --- Property: PROPERTY_POPUP_FOREGROUND

    /**
     * Returns the foreground-color of the popup
     * @return
     */
    public Color getPopupForeground() {
        return (Color) get(PROPERTY_POPUP_FOREGROUND);
    }

    /**
     * Set the foreground-color of the popup (will have an effect on the color of the text)
     * @param foreground
     */
    public void setPopupForeground(final Color foreground) {
        set(PROPERTY_POPUP_FOREGROUND, foreground);
    }

    // --- Property: PROPERTY_POPUP_FONT

    /**
     * Returns the font of the popup-text
     * @return
     */
    public Font getPopupFont() {
        return (Font) get(PROPERTY_POPUP_FONT);
    }

    /**
     * Set the font inside the popup
     * @param font
     */
    public void setPopupFont(final Font font) {
        set(PROPERTY_POPUP_FONT, font);
    }


    /**
     * Returns true, if the popUp should be auto-Adjusted
     *
     * @return
     */
    public boolean isAutoAdjustPopup() {
        return ((Boolean) get(PROPERTY_AUTO_ADJUST_POPUP)).booleanValue();
    }

    /**
     * Specify, whether the popUp should be auto-Adjusted or not
     *
     * @param doShowPopup
     */
    public void setAutoAdjustPopup(boolean doAutoAdjustPopup) {
        set(PROPERTY_AUTO_ADJUST_POPUP, Boolean.valueOf(doAutoAdjustPopup));
    }

    /**
     * Returns true, if the tooltip should be shown
     *
     * @return
     */
    public boolean isShowTooltip() {
        return ((Boolean) get(PROPERTY_SHOW_TOOLTIP)).booleanValue();
    }

    /**
     * Specify, whether the tooltip should be shown or not
     *
     * @param doShowTooltip
     */
    public void setShowTooltip(boolean doShowTooltip) {
        set(PROPERTY_SHOW_TOOLTIP, Boolean.valueOf(doShowTooltip));
    }

    /**
     * Returns the BarChartModel
     *
     * @return
     */
    public BarChartModel getBarChartModel() {
        return (BarChartModel) get(PROPERTY_BAR_CHART_MODEL);
    }

    /**
     * Set the BarChartModel
     *
     * @param barChartModel
     */
    public void setBarChartModel(final BarChartModel barChartModel) {
        set(PROPERTY_BAR_CHART_MODEL, barChartModel);
    }

    // Listener and Actions

    /**
     * Adds a {@link de.exxcellent.echolot.listener.BarSelectListener}.
     *
     * @param l will be informed if a bar is selected
     */
    public void addBarSelectListener(BarSelectListener l) {
        getEventListenerList().addListener(BarSelectListener.class, l);
        firePropertyChange(BARSELECT_LISTENERS_CHANGED_PROPERTY, null, l);
    }

    /**
     * Removes a {@link BarSelectListener}
     *
     * @param l will be removed from listener list.
     */
    public void removeBarSelectListener(BarSelectListener l) {
        getEventListenerList().removeListener(BarSelectListener.class, l);
        firePropertyChange(BARSELECT_LISTENERS_CHANGED_PROPERTY, l, null);
    }

    /**
     * Returns true, if there are BarSelectListeners registered
     *
     * @return
     */
    public boolean hasBarSelectListeners() {
        if (!hasEventListenerList()) {
            return false;
        }
        return getEventListenerList().getListenerCount(BarSelectListener.class) > 0;
    }

    /**
     * @inheritDoc
     */
    @Override
    public void processInput(String inputName, Object inputValue) {
        super.processInput(inputName, inputValue);
        if (INPUT_BAR_SELECTION.equals(inputName)) {
            fireAction(inputValue);
        }
    }

    /**
     * Notifies all Listener
     *
     * @param inputValue
     */
    private void fireAction(Object inputValue) {
        if (!hasEventListenerList()) {
            return;
        }
        EventListener[] listeners = getEventListenerList().getListeners(BarSelectListener.class);
        if (listeners.length == 0) {
            return;
        }
        BarSelectEvent e = new BarSelectEvent(this, findBar((String) inputValue));
        for (EventListener listener : listeners) {
            ((BarSelectListener) listener).barSelection(e);
        }
    }

    /**
     * Private helper to find the corresponding bar for a identifier
     *
     * @param identifier
     * @return
     */
    private Bar findBar(final String identifier) {
        if (getBarChartModel() != null) {
            for (Bar[] bars : getBarChartModel().getBarValues()) {
                for (Bar bar : bars) {
                    if (bar.getIdentifier().equals(identifier)) {
                        return bar;
                    }
                }
            }
        }
        return null;
    }
}
