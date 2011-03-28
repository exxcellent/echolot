/*
 * This file (PieChart.java) is part of the Echolot Project (hereinafter "Echolot").
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

import de.exxcellent.echolot.event.PieSectorSelectEvent;
import de.exxcellent.echolot.listener.PieSectorSelectListener;
import de.exxcellent.echolot.model.*;
import nextapp.echo.app.Color;
import nextapp.echo.app.Component;
import nextapp.echo.app.Font;

import java.util.EventListener;

/**
 * Echo3 Component to represent a PieChart
 *
 * @author Ralf Enderle
 */
public class PieChart extends Component {


    public static final String PROPERTY_PIEMODEL = "pieModel";


    public static final String PIE_SECTORSELECT_LISTENERS_CHANGED_PROPERTY = "pieSectorSelectListeners";

    public static final String INPUT_PIE_SECTOR_SELECT = "pieSectorSelect";

    public static final String PROPERTY_LEGEND_POSITION = "legendPosition";

    /**
     * The gap-factor that's used while calculating the space of the legendValues
     * Default is 1.2 - it's also possible to set negative values here
     */
    public static final String PROPERTY_LEGEND_GAP_FACTOR = "legendGapFactor";

    public static final String PROPERTY_SHOW_LEGEND = "showLegend";

    public static final String PROPERTY_SHOW_POPUP = "showPopUp";
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

    public static final String PROPERTY_DO_ANIMATION = "doAnimation";
    public static final String PROPERTY_ANIMATION_TYPE = "animationType";

    /**
     * wanna have some defined abbreviation in your sectors, toggle this to: true
     */
    public static final String PROPERTY_SECTOR_ABBREV_SHOW = "sectorAbbrevShow";
    /**
     * the font of the Abbreviation
     */
    public static final String PROPERTY_SECTOR_ABBREV_FONT = "sectorAbbrevFont";
    /**
     * the foreground-color of the abbreviation, every sector can define it's own if there is a need to do so
     */
    public static final String PROPERTY_SECTOR_ABBREV_FOREGROUND = "sectorAbbrevForeground";

    /**
     * the width of the component
     */
    public static final String PROPERTY_WIDTH = "width";
    /**
     * the height of the component
     */
    public static final String PROPERTY_HEIGHT = "height";

    // some fallback-colors - this will be used, if you don't define a color for a sector
    public static final String PROPERTY_FALLBACK_SECTOR_COLOR_0 = "fallbackSectorColor_0";
    public static final String PROPERTY_FALLBACK_SECTOR_COLOR_1 = "fallbackSectorColor_1";
    public static final String PROPERTY_FALLBACK_SECTOR_COLOR_2 = "fallbackSectorColor_2";
    public static final String PROPERTY_FALLBACK_SECTOR_COLOR_3 = "fallbackSectorColor_3";
    public static final String PROPERTY_FALLBACK_SECTOR_COLOR_4 = "fallbackSectorColor_4";
    public static final String PROPERTY_FALLBACK_SECTOR_COLOR_5 = "fallbackSectorColor_5";
    public static final String PROPERTY_FALLBACK_SECTOR_COLOR_6 = "fallbackSectorColor_6";
    public static final String PROPERTY_FALLBACK_SECTOR_COLOR_7 = "fallbackSectorColor_7";
    public static final String PROPERTY_FALLBACK_SECTOR_COLOR_8 = "fallbackSectorColor_8";
    public static final String PROPERTY_FALLBACK_SECTOR_COLOR_9 = "fallbackSectorColor_9";


    /**
     * Constructor
     */
    public PieChart() {
        super();
    }

    public void setLegendPosition(Location location) {
        set(PROPERTY_LEGEND_POSITION, location.getLocationValue());
    }

    public Location getLegendPosition() {
        return Location.toLocationValue((String) get(PROPERTY_LEGEND_POSITION));
    }

    /**
     * Set the gap-factor that's used while calculating the space of the legendValues
     *
     * @param factor
     */
    public void setLegendGapFactor(double factor) {
        set(PROPERTY_LEGEND_GAP_FACTOR, factor);
    }

    public double getLegendGapFactor() {
        return (Double) get(PROPERTY_LEGEND_GAP_FACTOR);
    }

    public Boolean isShowLegend() {
        return (Boolean) get(PROPERTY_SHOW_LEGEND);
    }

    public void setShowLegend(final Boolean showLegend) {
        set(PROPERTY_SHOW_LEGEND, showLegend);
    }

    public Boolean isShowPopUp() {
        return (Boolean) get(PROPERTY_SHOW_POPUP);
    }

    public void setShowPopUp(final Boolean showPopU) {
        set(PROPERTY_SHOW_POPUP, showPopU);
    }

    // --- Property: PROPERTY_POPUP_BACKGROUND

    /**
     * Returns the background-color of the popup
     *
     * @return
     */
    public Color getPopupBackground() {
        return (Color) get(PROPERTY_POPUP_BACKGROUND);
    }

    /**
     * Set the background-color of the popup
     *
     * @param background
     */
    public void setPopupBackground(final Color background) {
        set(PROPERTY_POPUP_BACKGROUND, background);
    }

    // --- Property: PROPERTY_POPUP_BORDER_COLOR

    /**
     * Returns the border-color of the popup
     *
     * @return
     */
    public Color getPopupBorderColor() {
        return (Color) get(PROPERTY_POPUP_BORDER_COLOR);
    }

    /**
     * Set the border-color of the popup
     *
     * @param borderColor
     */
    public void setPopupBorderColor(final Color borderColor) {
        set(PROPERTY_POPUP_BORDER_COLOR, borderColor);
    }
    // --- Property: PROPERTY_POPUP_FOREGROUND

    /**
     * Returns the foreground-color of the popup
     *
     * @return
     */
    public Color getPopupForeground() {
        return (Color) get(PROPERTY_POPUP_FOREGROUND);
    }

    /**
     * Set the foreground-color of the popup (will have an effect on the color of the text)
     *
     * @param foreground
     */
    public void setPopupForeground(final Color foreground) {
        set(PROPERTY_POPUP_FOREGROUND, foreground);
    }

    // --- Property: PROPERTY_POPUP_FONT

    /**
     * Returns the font of the popup-text
     *
     * @return
     */
    public Font getPopupFont() {
        return (Font) get(PROPERTY_POPUP_FONT);
    }

    /**
     * Set the font inside the popup
     *
     * @param font
     */
    public void setPopupFont(final Font font) {
        set(PROPERTY_POPUP_FONT, font);
    }

    public Boolean isDoAnimation() {
        return (Boolean) get(PROPERTY_DO_ANIMATION);
    }

    public void setDoAnimation(final boolean doAnimation) {
        set(PROPERTY_DO_ANIMATION, doAnimation);
    }

    public AnimationType getAnimationType() {
        return AnimationType.toAnimationType((String) get(PROPERTY_ANIMATION_TYPE));
    }

    public void setAnimationType(AnimationType animationType) {
        set(PROPERTY_ANIMATION_TYPE, animationType.getAnimationTypeValue());
    }

    /**
     * wanna have some defined abbreviation in your sectors, toggle this to: true
     *
     * @param show
     */
    public void setSectorAbbrevShow(final boolean show) {
        set(PROPERTY_SECTOR_ABBREV_SHOW, show);
    }

    /**
     * Returns true, if the abbbreviation will be showed, false if not
     *
     * @return
     */
    public Boolean isSectorAbbrevShow() {
        return (Boolean) get(PROPERTY_SECTOR_ABBREV_SHOW);
    }

    /**
     * the font of the Abbreviation
     *
     * @param font
     */
    public void setSectorAbbrevFont(final Font font) {
        set(PROPERTY_SECTOR_ABBREV_FONT, font);
    }

    /**
     * Return the font of the abbbreviation
     *
     * @return
     */
    public Font getSectorAbbrevFont() {
        return (Font) get(PROPERTY_SECTOR_ABBREV_FONT);
    }

    /**
     * the foreground-color of the abbreviation, every sector can define it's own if there is a need to do so
     *
     * @param color
     */
    public void setSectorAbbrevForeground(final Color color) {
        set(PROPERTY_SECTOR_ABBREV_FOREGROUND, color);
    }

    /**
     * Returns the foreground of the abbbreviation
     *
     * @return
     */
    public Color getSectorAbbrevForeground() {
        return (Color) get(PROPERTY_SECTOR_ABBREV_FOREGROUND);
    }


    public Integer getWidth() {
        return (Integer) get(PROPERTY_WIDTH);
    }

    public void setWidth(Integer width) {
        set(PROPERTY_WIDTH, width);
    }


    public Integer getHeight() {
        return (Integer) get(PROPERTY_HEIGHT);
    }

    public void setHeight(Integer height) {
        set(PROPERTY_HEIGHT, height);
    }

    // The Fallback-Colors

    public void setFallbackSectorColor0(Color color) {
        set(PROPERTY_FALLBACK_SECTOR_COLOR_0, color);
    }

    public Color getFallbackSectorColor0() {
        return (Color) get(PROPERTY_FALLBACK_SECTOR_COLOR_0);
    }

    public void setFallbackSectorColor1(Color color) {
        set(PROPERTY_FALLBACK_SECTOR_COLOR_1, color);
    }

    public Color getFallbackSectorColor1() {
        return (Color) get(PROPERTY_FALLBACK_SECTOR_COLOR_1);
    }

    public void setFallbackSectorColor2(Color color) {
        set(PROPERTY_FALLBACK_SECTOR_COLOR_2, color);
    }

    public Color getFallbackSectorColor2() {
        return (Color) get(PROPERTY_FALLBACK_SECTOR_COLOR_2);
    }

    public void setFallbackSectorColor3(Color color) {
        set(PROPERTY_FALLBACK_SECTOR_COLOR_3, color);
    }

    public Color getFallbackSectorColor3() {
        return (Color) get(PROPERTY_FALLBACK_SECTOR_COLOR_3);
    }

    public void setFallbackSectorColor4(Color color) {
        set(PROPERTY_FALLBACK_SECTOR_COLOR_4, color);
    }

    public Color getFallbackSectorColor4() {
        return (Color) get(PROPERTY_FALLBACK_SECTOR_COLOR_4);
    }

    public void setFallbackSectorColor5(Color color) {
        set(PROPERTY_FALLBACK_SECTOR_COLOR_5, color);
    }

    public Color getFallbackSectorColor5() {
        return (Color) get(PROPERTY_FALLBACK_SECTOR_COLOR_5);
    }

    public void setFallbackSectorColor6(Color color) {
        set(PROPERTY_FALLBACK_SECTOR_COLOR_6, color);
    }

    public Color getFallbackSectorColor6() {
        return (Color) get(PROPERTY_FALLBACK_SECTOR_COLOR_6);
    }

    public void setFallbackSectorColor7(Color color) {
        set(PROPERTY_FALLBACK_SECTOR_COLOR_7, color);
    }

    public Color getFallbackSectorColor7() {
        return (Color) get(PROPERTY_FALLBACK_SECTOR_COLOR_7);
    }

    public void setFallbackSectorColor8(Color color) {
        set(PROPERTY_FALLBACK_SECTOR_COLOR_8, color);
    }

    public Color getFallbackSectorColor8() {
        return (Color) get(PROPERTY_FALLBACK_SECTOR_COLOR_8);
    }

    public void setFallbackSectorColor9(Color color) {
        set(PROPERTY_FALLBACK_SECTOR_COLOR_9, color);
    }

    public Color getFallbackSectorColor9() {
        return (Color) get(PROPERTY_FALLBACK_SECTOR_COLOR_9);
    }


    /**
     * Fires a DUMMY property-Change event to update the view
     */
    public void firePropertyChanged() {
        firePropertyChange(PROPERTY_PIEMODEL, null, null);
    }

    /**
     * Return the pie model.
     *
     * @return The pie model object or {@code null} if no such exists.
     */
    public PieModel getPieModel() {
        return (PieModel) get(PROPERTY_PIEMODEL);
    }

    /**
     * Set the value of the {@link #PROPERTY_PIEMODEL} property.
     *
     * @param newPieModel The pie model to be represented in this component.
     */
    public void setPieModel(final PieModel newPieModel) {
        set(PROPERTY_PIEMODEL, newPieModel);
    }


    /**
     * {@inheritDoc}
     */
    @Override
    public void processInput(String inputName, Object inputValue) {
        super.processInput(inputName, inputValue);
        if (INPUT_PIE_SECTOR_SELECT.equals(inputName)) {
            final String identifier = (String) inputValue;
            firePieSectorSelect(identifier);
        }
    }


    /**
     * Adds a {@link de.exxcellent.echolot.listener.PieSectorSelectListener}.
     *
     * @param l will be informed if a row is selected
     */
    public void addPieSectorSelectListener(PieSectorSelectListener l) {
        getEventListenerList().addListener(PieSectorSelectListener.class, l);
        firePropertyChange(PIE_SECTORSELECT_LISTENERS_CHANGED_PROPERTY, null, l);
    }

    /**
     * Removes a {@link PieSectorSelectListener}
     *
     * @param l will be removed from listener list.
     */
    public void removePieSectorSelectListener(PieSectorSelectListener l) {
        getEventListenerList().removeListener(PieSectorSelectListener.class, l);
        firePropertyChange(PIE_SECTORSELECT_LISTENERS_CHANGED_PROPERTY, l, null);
    }


    /**
     * Notifies <code>PieSectorSelectListener</code>s that the user has selected a pieSector.
     */
    protected void firePieSectorSelect(String identifier) {
        if (!hasEventListenerList()) {
            return;
        }
        EventListener[] listeners = getEventListenerList().getListeners(PieSectorSelectListener.class);
        if (listeners.length == 0) {
            return;
        }
        PieSectorSelectEvent e = new PieSectorSelectEvent(this, findPieSectorForIdentifier(identifier));
        for (EventListener listener : listeners) {
            ((PieSectorSelectListener) listener).sectorSelection(e);
        }
    }

    /**
     * Determines the any <code>PieSectorSelectListener</code>s are registered.
     *
     * @return true if any <code>PieSectorSelectListener</code>s are registered
     */
    public boolean hasPieSectorSelectListeners() {
        if (!hasEventListenerList()) {
            return false;
        }
        return getEventListenerList().getListenerCount(PieSectorSelectListener.class) > 0;
    }

    private PieSector findPieSectorForIdentifier(String identifier) {
        if (getPieModel() != null) {
            for (PieSector sector : getPieModel().getSectors()) {
                if (sector.getIdentifier().equals(identifier)) {
                    return sector;
                }
            }
        }
        return null;
    }
}
