/*
 * This file (ColumnModel.java) is part of the Echolot Project (hereinafter "Echolot").
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

import java.io.Serializable;
import java.util.Arrays;

/**
 * The model object for use in the {@link de.exxcellent.echolot.app.FlexiGrid} component. The component expects a JSON data in this format:
 * 
 * <pre>
 *      columnModel[
 *              {display: 'Name', name: 0},
 *              {display: 'EMail', name: 1}
 * </pre>
 * 
 * @author Oliver Pehnke <o.pehnke@exxcellent.de>
 */
public class ColumnModel implements Serializable {
	private static final long serialVersionUID = 4l;

	/** The columns in the table model */
	private Column[] columns;

	/** Default constructor. */
	public ColumnModel() {
	}

    /**
     * Create a new {@link ColumnModel} with the specified values.
     * 
     * @param columns The column model to use.
     */
	public ColumnModel(final Column[] columns) {
		this.columns = columns;
	}

	/**
     * @return the columns, i.e. column model
     */
	public Column[] getColumns() {
		return columns;
	}

	/**
     * Sets the columns of the table model.
     * 
     * @param columns the columns representing the column model.
     */
	public void setColumns(Column[] columns) {
		this.columns = columns;
	}

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + Arrays.hashCode(columns);
        return result;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null) {
            return false;
        }
        if (getClass() != obj.getClass()) {
            return false;
        }
        ColumnModel other = (ColumnModel) obj;
        if (!Arrays.equals(columns, other.columns)) {
            return false;
        }
        return true;
    }
    
    /**
     * @inheritDoc
     */
    @Override
    public String toString() {
        return Arrays.toString(columns);
    }
    
}
