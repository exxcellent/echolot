/*
 * This file (PieSector.java) is part of the Echolot Project (hereinafter "Echolot").
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

import com.thoughtworks.xstream.annotations.XStreamAlias;
import nextapp.echo.app.ApplicationInstance;
import nextapp.echo.app.Color;
import nextapp.echo.app.serial.SerialException;
import nextapp.echo.app.serial.property.ColorPeer;

import java.io.Serializable;

/**
 * This class describes a PieSector in the PieModel.
 * Be careful - if you want to add a PieSectorSelectListener on the PieChart the name-value Pairs of all Sectors of the
 * models have to be unique. This is ugly - we know - but it's just a tiny limitation :-)
 *
 * @author Ralf Enderle
 */
@XStreamAlias("sectors")
public class PieSector implements Serializable {

    /**
     * The name of the pie-sector
     */
    private final String name;

    /**
     * The data-value for this PieSector
     */
    private final Integer value;

    /**
     * The label displayed in PopUp on MouseOver
     */
    private final String popUpLabel;

    /**
     * The abbreviation - will be shown inside a pieSector
     */
    private final String abbreviation;

    /**
     * The Foreground-color of the abbreviation
     * if you define nothing, the default SECTOR_ABBREV_FOREGROUND from PieChart itself will be used
     */
    private final String abbreviationForeground;

    /**
     * Should we show the percentage of the sector in the legend
     */
    private final boolean showPercentage;

    /**
     * The color of the PieSector
     */
    private final String color;

    /**
     * The unique echo-identifier will be set by constructor, don't touch this manually
     */
     private final String identifier;

    /**
     * UserObject to identify the PieSector by the user
     */
    private final transient Object userObject;

    // because all attributes are final we have some more constructors - never mind
    // echo3 doen's recognize changing some attributes inside a json-message -> no setter means no changing after calling constructor ;-)

    /**
     * Constructor
     *
     * @param name  - the name of the sector (will be displayed in the legend)
     * @param value - the value (will be used to calculate the pie)
     */
    public PieSector(final String name, final Integer value) {
        this(name, value, null, null, false, null, null, null);
    }

    /**
     * Constructor
     *
     * @param name       - the name of the sector (will be displayed in the legend)
     * @param value      - the value (will be used to calculate the pie)
     * @param color      - the color of the sector; if yopu define nothing some default-colors of the pie will be used
     * @param userObject - your userObject to identify the sector
     */
    public PieSector(final String name, final Integer value, final Color color, final Object userObject) {
        this(name, value, null, null, false, color, null, userObject);
    }

    /**
     * Constructor
     *
     * @param name       - the name of the sector (will be displayed in the legend)
     * @param value      - the value (will be used to calculate the pie)
     * @param popUpLabel - label to be shown in the popUp
     * @param color      - the color of the sector; if yopu define nothing some default-colors of the pie will be used
     * @param userObject - your userObject to identify the sector
     */
    public PieSector(final String name, final Integer value, final String popUpLabel, final Color color, final Object userObject) {
        this(name, value, popUpLabel, null, false, color, null, userObject);
    }

    /**
     * Constructor
     *
     * @param name         - the name of the sector (will be displayed in the legend)
     * @param value        - the value (will be used to calculate the pie)
     * @param popUpLabel   - label to be shown in the popUp
     * @param abbreviation - small abbreviation (will be printed inside into the sector)
     * @param color        - the color of the sector; if yopu define nothing some default-colors of the pie will be used
     * @param userObject   - your userObject to identify the sector
     */
    public PieSector(final String name, final Integer value, final String popUpLabel, final String abbreviation, final Color color, final Object userObject) {
        this(name, value, popUpLabel, abbreviation, false, color, null, userObject);
    }

    /**
     * Constructor
     *
     * @param name                   - the name of the sector (will be displayed in the legend)
     * @param value                  - the value (will be used to calculate the pie)
     * @param abbreviation           - small abbreviation (will be printed inside into the sector)
     * @param color                  - the color of the sector; if yopu define nothing some default-colors of the pie will be used
     * @param abbreviationForeground - the foregroundColor of the abbreviation; if you define nothing, some default from pie will be used
     * @param userObject             - your userObject to identify the sector
     */
    public PieSector(final String name, final Integer value, final String abbreviation, final Color color, final Color abbreviationForeground, final Object userObject) {
        this(name, value, null, abbreviation, false, color, abbreviationForeground, userObject);
    }

    /**
     * Constructor
     *
     * @param name                   - the name of the sector (will be displayed in the legend)
     * @param value                  - the value (will be used to calculate the pie)
     * @param popUpLabel             - label to be shown in the popUp
     * @param abbreviation           - small abbreviation (will be printed inside into the sector)
     * @param color                  - the color of the sector; if yopu define nothing some default-colors of the pie will be used
     * @param abbreviationForeground - the foregroundColor of the abbreviation; if you define nothing, some default from pie will be used
     * @param userObject             - your userObject to identify the sector
     */
    public PieSector(final String name, final Integer value, final String popUpLabel, final String abbreviation, final Color color, final Color abbreviationForeground, final Object userObject) {
        this(name, value, popUpLabel, abbreviation, false, color, abbreviationForeground, userObject);
    }

    /**
     * Constructor
     *
     * @param name                   - the name of the sector (will be displayed in the legend)
     * @param value                  - the value (will be used to calculate the pie)
     * @param popUpLabel             - label to be shown in the popUp
     * @param abbreviation           - small abbreviation (will be printed inside into the sector)
     * @param showPercentage         - there is some voodoo that calculates the percentage of a sector for you to print it in the legend. Toggle to true to see what happens
     * @param color                  - the color of the sector; if yopu define nothing some default-colors of the pie will be used
     * @param abbreviationForeground - the foregroundColor of the abbreviation; if you define nothing, some default from pie will be used
     * @param userObject             - your userObject to identify the sector
     */
    public PieSector(final String name, final Integer value, final String popUpLabel, final String abbreviation, final boolean showPercentage, final Color color, final Color abbreviationForeground, final Object userObject) {
        this.name = name;
        this.value = value;
        this.popUpLabel = popUpLabel;
        this.abbreviation = abbreviation;
        this.showPercentage = showPercentage;
        this.color = convertColor(color);
        this.abbreviationForeground = convertColor(abbreviationForeground);
        this.userObject = userObject;

        // and at least the identifier (we will use the built-in echo feature to generate a unique identifier)
        this.identifier = ApplicationInstance.getActive().generateId();

    }

    /**
     * Get the name of the sector - this is corresponding to the name displayed in the legend
     *
     * @return
     */
    public String getName() {
        return name;
    }

    /**
     * Get the value of the sector
     *
     * @return
     */
    public Integer getValue() {
        return value;
    }

    /**
     * Get the popUpLabel of this sector
     *
     * @return
     */
    public String getPopUpLabel() {
        return popUpLabel;
    }

    /**
     * Should we show the Percentage of the sector on the legend
     *
     * @return
     */
    public boolean isShowPercentage() {
        return showPercentage;
    }

    /**
     * Returns the color of the PieSector
     *
     * @return
     */
    public Color getColor() {
        try {
            return ColorPeer.fromString(this.color);
        } catch (SerialException e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * Sets the UserObject
     *
     * @return
     */
    public Object getUserObject() {
        return userObject;
    }

    /**
     * Returns the identifier
     *
     * @return
     */
    public String getIdentifier() {
        return identifier;
    }
    

    /**
     * Internal helper
     *
     * @param color
     * @return
     */
    private static String convertColor(Color color) {
        try {
            if (color != null) {
                return ColorPeer.toString(color);
            }
        } catch (SerialException e) {
            // we will do nothing at all
            // just return #000000
        }
        return null; // it's ok - there is some fallback solution in pie itself if you do not define a color on your own
    }
}
