/*
 * This file (BlockLayoutData.java) is part of the Echolot Project (hereinafter "Echolot").
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

package de.exxcellent.echolot.layout;

import nextapp.echo.app.Extent;
import nextapp.echo.app.layout.CellLayoutData;

/**
 * A <code>LayoutData</code> object used to describe how a 
 * <code>Component</code> is rendered within a <code>Column</code>. 
 */
public class BlockLayoutData extends CellLayoutData {

    /** Serial Version UID. */
    private static final long serialVersionUID = 20070101L;

    private Extent height = null;

    private String floating;

    private Extent marginTop;

    private Extent marginBottom;

    private Extent marginLeft;

    private Extent marginRight;

    private Extent width;
    
    /**
     * Returns the height of the cell.
     * This property only supports <code>Extent</code>s with
     * fixed (i.e., not percent) units.
     * 
     * @return the cell height
     */
    public Extent getHeight() {
        return height;
    }
    
    /**
     * Sets the height of the cell.
     * This property only supports <code>Extent</code>s with
     * fixed (i.e., not percent) units.
     * 
     * @param height The cell height
     */
    public void setHeight(Extent height) {
        this.height = height;
    }
    /**
     * Returns the width of the cell. This property only supports <code>Extent</code>s with fixed (i.e., not percent)
     * units.
     * 
     * @return the cell width
     */
    public Extent getWidth() {
        return width;
    }

    /**
     * Sets the width of the cell. This property only supports <code>Extent</code>s with fixed (i.e., not percent)
     * units.
     * 
     * @param width The cell width
     */
    public void setWidth(Extent width) {
        this.width = width;
    }
    
    public void setFloating(String floating) {
        this.floating = floating;
    }

    public String getFloating() {
        return floating;
    }

    public void setMarginTop(Extent marginTop) {
        this.marginTop = marginTop;
    }

    public Extent getMarginTop() {
        return marginTop;
    }

    public void setMarginBottom(Extent marginBottom) {
        this.marginBottom = marginBottom;
    }

    public Extent getMarginBottom() {
        return marginBottom;
    }

    public Extent getMarginLeft() {
        return marginLeft;
    }

    public void setMarginLeft(Extent marginLeft) {
        this.marginLeft = marginLeft;
    }

    public Extent getMarginRight() {
        return marginRight;
    }

    public void setMarginRight(Extent marginRight) {
        this.marginRight = marginRight;
    }
    
}
