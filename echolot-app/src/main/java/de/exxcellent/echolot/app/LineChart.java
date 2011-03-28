/*
 * This file (LineChart.java) is part of the Echolot Project (hereinafter "Echolot").
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

import de.exxcellent.echolot.event.PointSelectEvent;
import de.exxcellent.echolot.listener.PointSelectListener;
import de.exxcellent.echolot.model.AxisModel;
import de.exxcellent.echolot.model.Interpolation;
import de.exxcellent.echolot.model.LineChartModel;
import de.exxcellent.echolot.model.LineChartPoint;
import nextapp.echo.app.Color;
import nextapp.echo.app.Component;
import nextapp.echo.app.Font;

import java.util.EventListener;

/**
 * Echo-Component to draw a LineChart
 *
 * @author Ralf Enderle
 * @version 1.0
 */
public class LineChart extends Component {
    /**
     * Draw the grid?
     */
    public static final String PROPERTY_DRAW_GRID = "drawGrid";
    /**
     * Color of the grid
     */
    public static final String PROPERTY_GRID_COLOR = "gridColor";

    /**
     * Amount of xAxisSectors
     */
    public static final String PROPERTY_XAXIS_SECTORS = "xaxisSectors";
    /**
     * Amount of yAxisSectors
     */
    public static final String PROPERTY_YAXIS_SECTORS = "yaxisSectors";

    /**
     * Fill the Chart?
     */
    public static final String PROPERTY_FILL_CHART = "fillChart";
    /**
     * Color of the Line
     */
    public static final String PROPERTY_LINE_COLOR = "lineColor";
    /**
     * Color of the dots
     */
    public static final String PROPERTY_DOT_COLOR = "dotColor";

    /**
     * Interpolation you prefer
     */
    public static final String PROPERTY_INTERPOLATION = "interpolation";
    /**
     * the width
     */
    public static final String PROPERTY_WIDTH = "width";
    /**
     * the height
     */
    public static final String PROPERTY_HEIGHT = "height";
    /**
     * the maximum x-Scaling
     */
    public static final String PROPERTY_XSCALE_MAX = "xscaleMax";
    /**
     * the maximum y-scaling
     */
    public static final String PROPERTY_YSCALE_MAX = "yscaleMax";
    /**
     * Wanna have some Popup
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
    /**
     * The LineChartModel
     */
    public static final String PROPERTY_LINE_CHART_MODEL = "lineChartModel";

    /**
     * The AxisModel
     */
    public static final String PROPERTY_AXIS_MODEL = "axisModel";

    // Listener

    public static final String POINTSELECT_LISTENERS_CHANGED_PROPERTY = "pointSelectListeners";

    public static final String INPUT_POINT_SELECTION = "pointSelection";


    // --- Property: PROPERTY_DRAW_GRID

    public boolean isDrawGrid() {
        return ((Boolean) get(PROPERTY_DRAW_GRID)).booleanValue();
    }

    public void setDrawGrid(final boolean doDrawGrid) {
        set(PROPERTY_DRAW_GRID, Boolean.valueOf(doDrawGrid));
    }

    // --- Property: PROPERTY_GRID_COLOR

    public Color getGridColor() {
        return (Color) get(PROPERTY_GRID_COLOR);
    }

    public void setGridColor(final Color gridColor) {
        set(PROPERTY_GRID_COLOR, gridColor);
    }

    // --- Property: PROPERTY_XAXIS_SECTORS

    public int getXaxisSectors() {
        return (Integer) get(PROPERTY_XAXIS_SECTORS);
    }

    public void setXaxisSectors(final int xaxisSectors) {
        set(PROPERTY_XAXIS_SECTORS, Integer.valueOf(xaxisSectors));
    }

    // --- Property: PROPERTY_YAXIS_SECTORS

    public int getYaxisSectors() {
        return (Integer) get(PROPERTY_YAXIS_SECTORS);
    }

    public void setYaxisSectors(final int yaxisSectors) {
        set(PROPERTY_YAXIS_SECTORS, Integer.valueOf(yaxisSectors));
    }

    // --- Property: PROPERTY_FILL_CHART

    public boolean isFillChart() {
        return ((Boolean) get(PROPERTY_FILL_CHART)).booleanValue();
    }

    public void setFillChart(final boolean doFillChart) {
        set(PROPERTY_FILL_CHART, Boolean.valueOf(doFillChart));
    }

    // --- Property: PROPERTY_LINE_COLOR

    public Color getLineColor() {
        return (Color) get(PROPERTY_LINE_COLOR);
    }

    public void setLineColor(final Color lineColor) {
        set(PROPERTY_LINE_COLOR, lineColor);
    }

    // --- Property: PROPERTY_DOT_COLOR

    public Color getDotColor() {
        return (Color) get(PROPERTY_DOT_COLOR);
    }

    public void setDotColor(final Color dotColor) {
        set(PROPERTY_DOT_COLOR, dotColor);
    }

    public Interpolation getInterpolation() {
        return Interpolation.toInterpolation((String) get(PROPERTY_INTERPOLATION));
    }

    public void setInterpolation(final Interpolation interpoaltion) {
        set(PROPERTY_INTERPOLATION, interpoaltion.getInterpolationValue());
    }

    // --- Property: PROPERTY_WIDTH

    public int getWidth() {
        return (Integer) get(PROPERTY_WIDTH);
    }

    public void setWidth(final int width) {
        set(PROPERTY_WIDTH, Integer.valueOf(width));
    }

    // --- Property: PROPERTY_HEIGHT

    public int getHeight() {
        return (Integer) get(PROPERTY_HEIGHT);
    }

    public void setHeight(final int height) {
        set(PROPERTY_HEIGHT, Integer.valueOf(height));
    }

    // --- Property: PROPERTY_VALUE_SCALE_MAX

    public int getXscaleMax() {
        return (Integer) get(PROPERTY_XSCALE_MAX);
    }

    public void setXscaleMax(final int xscaleMax) {
        set(PROPERTY_XSCALE_MAX, Integer.valueOf(xscaleMax));
    }

    // --- Property: PROPERTY_Y_SCALE_MAX

    public int getYscaleMax() {
        return (Integer) get(PROPERTY_YSCALE_MAX);
    }

    public void setYscaleMax(final int yscaleMax) {
        set(PROPERTY_YSCALE_MAX, Integer.valueOf(yscaleMax));
    }

    // --- Property: PROPERTY_SHOW_POPUP

    public boolean isShowPopup() {
        return ((Boolean) get(PROPERTY_SHOW_POPUP)).booleanValue();
    }

    public void setShowPopup(final boolean doShowPopup) {
        set(PROPERTY_SHOW_POPUP, Boolean.valueOf(doShowPopup));
    }

    // --- Property: PROPERTY_POPUP_BACKGROUND

    public Color getPopupBackground() {
        return (Color) get(PROPERTY_POPUP_BACKGROUND);
    }

    public void setPopupBackground(final Color background) {
        set(PROPERTY_POPUP_BACKGROUND, background);
    }

    // --- Property: PROPERTY_POPUP_BORDER_COLOR

    public Color getPopupBorderColor() {
        return (Color) get(PROPERTY_POPUP_BORDER_COLOR);
    }

    public void setPopupBorderColor(final Color borderColor) {
        set(PROPERTY_POPUP_BORDER_COLOR, borderColor);
    }
    // --- Property: PROPERTY_POPUP_FOREGROUND

    public Color getPopupForeground() {
        return (Color) get(PROPERTY_POPUP_FOREGROUND);
    }

    public void setPopupForeground(final Color foreground) {
        set(PROPERTY_POPUP_FOREGROUND, foreground);
    }

    public void setBorderForeground(final Color foreground) {
        set(PROPERTY_POPUP_FOREGROUND, foreground);
    }
    // --- Property: PROPERTY_POPUP_FONT

    public Font getPopupFont() {
        return (Font) get(PROPERTY_POPUP_FONT);
    }

    public void setPopupFont(final Font font) {
        set(PROPERTY_POPUP_FONT, font);
    }

    // --- Property: PROPERTY_LINE_CHART_MODEL

    public LineChartModel getLineChartModel() {
        return (LineChartModel) get(PROPERTY_LINE_CHART_MODEL);
    }

    public void setLineChartModel(final LineChartModel lineChartModel) {
        set(PROPERTY_LINE_CHART_MODEL, lineChartModel);
    }

    // --- Property: PROPERTY_AXIS_MODEL

    public AxisModel getAxisModel() {
        return (AxisModel) get(PROPERTY_AXIS_MODEL);
    }

    public void setAxisModel(final AxisModel axisModel) {
        set(PROPERTY_AXIS_MODEL, axisModel);
    }

    //

    /**
     * Adds a {@link de.exxcellent.echolot.listener.PointSelectListener}.
     *
     * @param l will be informed if a row is selected
     */
    public void addPointSelectListener(final PointSelectListener l) {
        getEventListenerList().addListener(PointSelectListener.class, l);
        firePropertyChange(POINTSELECT_LISTENERS_CHANGED_PROPERTY, null, l);
    }

    /**
     * Removes a {@link PointSelectListener}
     *
     * @param l will be removed from listener list.
     */
    public void removePointSelectListener(final PointSelectListener l) {
        getEventListenerList().removeListener(PointSelectListener.class, l);
        firePropertyChange(POINTSELECT_LISTENERS_CHANGED_PROPERTY, l, null);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void processInput(final String inputName, final Object inputValue) {
        super.processInput(inputName, inputValue);
        if (INPUT_POINT_SELECTION.equals(inputName)) {
            final String identifier = (String) inputValue;
            fireAction(identifier);
        }
    }

    /**
     * Notifies all Listener
     *
     * @param inputValue - the inputValue from client
     */
    private void fireAction(final String inputValue) {
        if (!hasEventListenerList()) {
            return;
        }
        EventListener[] listeners = getEventListenerList().getListeners(PointSelectListener.class);
        if (listeners.length == 0) {
            return;
        }
        PointSelectEvent e = new PointSelectEvent(this, findLineChartPoint(inputValue));
        for (EventListener listener : listeners) {
            ((PointSelectListener) listener).pointSelection(e);
        }
    }

    /**
     * Are some PointSelectListeners registered?
     *
     * @return - true, if there are some listeners registered
     */
    public boolean hasPointSelectListeners() {
        if (!hasEventListenerList()) {
            return false;
        }
        return getEventListenerList().getListenerCount(PointSelectListener.class) > 0;
    }

    /**
     * Searches the corresponding LineChartPoint for the identifier
     *
     * @param identifier
     * @return - the LineChartPoint that corresponds to the identifier
     */
    private LineChartPoint findLineChartPoint(final String identifier) {
        if (getLineChartModel() != null) {
            for (LineChartPoint point : getLineChartModel().getPoints()) {
                if (point.getIdentifier().equals(identifier)) {
                    return point;
                }
            }

        }
        return null;
    }
}
