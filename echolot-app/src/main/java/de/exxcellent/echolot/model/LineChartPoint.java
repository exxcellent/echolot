/*
 * This file (LineChartPoint.java) is part of the Echolot Project (hereinafter "Echolot").
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

import nextapp.echo.app.ApplicationInstance;

import java.io.Serializable;

/**
 * Object that represents a Point on the LineChart
 *
 * @author Ralf Enderle
 * @version 1.0
 */
public class LineChartPoint implements Serializable {

    private final Integer xValue;
    private final Integer yValue;
    private final String identifier;

    private final String label;

    /**
     * UserObject to identify the PieSector by the user
     */
    private final transient Object userObject;

    /**
     * Constructor
     *
     * @param xValue - the xValue
     * @param yValue - the yValue
     * @param label  - the label of the point
     */
    public LineChartPoint(final Integer xValue, final Integer yValue, final String label) {
        this(xValue, yValue, label, null);
    }

    /**
     * Constructor
     *
     * @param xValue     - the xValue
     * @param yValue     - the yValue
     * @param label      - the label of the point
     * @param userObject - associated userObject
     */
    public LineChartPoint(final Integer xValue, final Integer yValue, final String label, final Object userObject) {
        this.xValue = xValue;
        this.yValue = yValue;
        this.label = label;
        this.userObject = userObject;

        // and at least the identifier (we will use the built-in echo feature to generate a unique identifier)
        this.identifier = ApplicationInstance.getActive().generateId();
    }

    /**
     * Returns the xValue
     *
     * @return - the xValue
     */
    public Integer getxValue() {
        return xValue;
    }

    /**
     * Returns the yValue
     *
     * @return - the yValue
     */
    public Integer getyValue() {
        return yValue;
    }

    /**
     * Returns the label
     *
     * @return - the label
     */
    public String getLabel() {
        return label;
    }

    /**
     * Returns the identifier
     *
     * @return - the echo unique identifier
     */
    public String getIdentifier() {
        return identifier;
    }

    /**
     * Returns the UserObject
     *
     * @return - the associated userObject
     */
    public Object getUserObject() {
        return userObject;
    }
}
