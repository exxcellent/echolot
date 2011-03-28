/*
 * This file (Bar.java) is part of the Echolot Project (hereinafter "Echolot").
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

/**
 * @author Ralf Enderle <r.enderle@exxcellent.de>
 */
@XStreamAlias("bar")
public class Bar {

    private final Integer value;
    private final String identifier;
    private final String label;
    private final String color;

    private final transient Object userObject;

    /**
     * Constructor
     *
     * @param value
     */
    public Bar(Integer value) {
        this(value, "", null);
    }

    /**
     * Constructor
     *
     * @param value
     * @param label - label could be shown in a popup or a tooltip
     */
    public Bar(Integer value, String label) {
        this(value, label, null);
    }

    /**
     * Constructor
     *
     * @param value
     * @param label - label could be shown in a popup or a tooltip
     * @param color
     */
    public Bar(Integer value, String label, Color color) {
        this(value, label, color, null);

    }

    /**
     * Constructor
     *
     * @param value
     * @param label - label could be shown in a popup or a tooltip
     * @param color
     * @param userObject
     */
    public Bar(Integer value, String label, Color color, Object userObject) {
        this.value = value;
        this.label = label;
        this.color = convertColor(color);
        this.userObject = userObject;

        // and at least the identifier (we will use the built-in echo feature to generate a unique identifier)
        this.identifier = ApplicationInstance.getActive().generateId();
    }

    /**
     * Returns the value
     *
     * @return
     */
    public Integer getValue() {
        return value;
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
     * Returns the label
     *
     * @return
     */
    public String getLabel() {
        return label;
    }

    /**
     * Returns the color of the Bar
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
        return "#000000";
    }


}
