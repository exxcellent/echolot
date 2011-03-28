/*
 * This file (BarType.java) is part of the Echolot Project (hereinafter "Echolot").
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
 * Enum for the Bar-Type.
 * These value specifies the visual appearance of the bar-head.
 * e.g.
 * ____      ___
 * |___| or |___)
 *
 * @author Ralf Enderle <r.enderle@exxcellent.de>
 */
public enum BarType {
    //          _          _         _         _
    // square: |_| soft : |_] round |_) sharp |_>
    SQUARE,
    SOFT,
    ROUND,
    SHARP;

    private static final String SQUARE_VALUE = "square";
    private static final String SOFT_VALUE = "soft";
    private static final String ROUND_VALUE = "round";
    private static final String SHARP_VALUE = "sharp";

    /**
     * Returns the suitable enum for the value
     *
     * @param value
     * @return
     */
    public static BarType toBarType(String value) {
        if (SQUARE_VALUE.equals(value)) {
            return BarType.SQUARE;
        } else if (SOFT_VALUE.equals(value)) {
            return BarType.SOFT;
        } else if (ROUND_VALUE.equals(value)) {
            return BarType.ROUND;
        } else if (SHARP_VALUE.equals(value)) {
            return BarType.SHARP;
        } else {
            // default
            return BarType.SQUARE;
        }
    }

    /**
     * Returns the String-representation for a specific
     * BarType
     *
     * @return
     */
    public String getBarTypeValue() {
        switch (this) {
            case SQUARE:
                return SQUARE_VALUE;
            case SOFT:
                return SOFT_VALUE;
            case ROUND:
                return ROUND_VALUE;
            case SHARP:
                return SHARP_VALUE;
            default:
                // default
                return SQUARE_VALUE;
        }
    }

}
