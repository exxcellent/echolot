/*
 * This file (ChartOrientation.java) is part of the Echolot Project (hereinafter "Echolot").
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

/**
 * Enum for the ChartOrientation: horizontal vs. vertical
 * @author Ralf Enderle <r.enderle@exxcellent.de>
 */
public enum ChartOrientation {
    VERTICAL, HORIZONTAL;

    private static final String VERTICAL_VALUE = "vertical";
    private static final String HORIZONTAL_VALUE = "horizontal";

    /**
     * Returns the suitable enum for the value
     * @param value
     * @return
     */
    public static ChartOrientation toChartOrientation(String value) {
        if (HORIZONTAL_VALUE.equals(value)) {
            return ChartOrientation.HORIZONTAL;
        } else {
            // default
            return ChartOrientation.VERTICAL;
        }
    }

    /**
     * Returns the String-representation for a specific
     * ChartOrientation
     * @return
     */
     public String getChartOrientationValue() {
        switch (this) {
            case VERTICAL:
                return VERTICAL_VALUE;
            case HORIZONTAL:
                return HORIZONTAL_VALUE;
            default:
                // default
                return VERTICAL_VALUE;
        }
    }
}
