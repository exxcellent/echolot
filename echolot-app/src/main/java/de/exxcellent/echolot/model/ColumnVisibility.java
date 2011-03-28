/*
 * This file (ColumnVisibility.java) is part of the Echolot Project (hereinafter "Echolot").
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

/**
 * JSON Message:
 * 
 * <pre>
 * {"columnVisibility": {
 *      "columnId": 0,
 *      "visible": true 
 * }}
 * </pre>
 * 
 * @author oliver
 */
@XStreamAlias("columnVisibility")
public class ColumnVisibility {
    private int columnId;
    private boolean visible;

    /**
     * Default constructor with initial column identifier and visibility state.
     * 
     * @param columnId the identifier of a column
     * @param visible <code>true</code> if the column is visible, otherwise <code>false</code>
     */
    public ColumnVisibility(int columnId, boolean visible) {
        this.columnId = columnId;
        this.visible = visible;
    }

    /**
     * @return the identifier of the column from the table model.
     */
    public int getColumnId() {
        return columnId;
    }

    /**
     * Sets the identifier of the column.
     * 
     * @param columnId the identifier of a column
     */
    public void setColumnId(int columnId) {
        this.columnId = columnId;
    }

    /**
     * @return <code>true</code> if the column is visible, otherwise <code>false</code>
     */
    public boolean isVisible() {
        return visible;
    }

    /**
     * Sets the visibility of the column.
     * 
     * @param visible <code>true</code> if the column is visible, otherwise <code>false</code>
     */
    public void setVisible(boolean visible) {
        this.visible = visible;
    }
}
