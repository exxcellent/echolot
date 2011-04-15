/*
 * This file (Row.java) is part of the Echolot Project (hereinafter "Echolot").
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

/**
 * The row model object for use in the {@link de.exxcellent.echolot.app.FlexiGrid} component.
 * 
 * <pre>
 * {
 * 	page: 1,
 * 	total: 239,
 * 	rows: [
 * 	{id:'ZW', cell:['ZW','ZIMBABWE','Zimbabwe','ZWE','716']},
 * 	{id:'ZM', cell:['ZM','ZAMBIA','Zambia','ZMB','894']},
 * 	{id:'YE', cell:['YE','YEMEN','Yemen','YEM','887']},
 * 	{id:'EH', cell:['EH','WESTERN SAHARA','Western Sahara','ESH','732']},
 * 	{id:'WF', cell:['WF','WALLIS AND FUTUNA','Wallis and Futuna','WLF','876']},
 * 	{id:'VN', cell:['VN','VIET NAM','Viet Nam','VNM','704']},
 * 	{id:'VE', cell:['VE','VENEZUELA','Venezuela','VEN','862']},
 * 	{id:'VU', cell:['VU','VANUATU','Vanuatu','VUT','548']}]
 * 	}
 * </pre>
 * 
 * @author Oliver Pehnke <o.pehnke@exxcellent.de>
 */
public class Row implements Serializable {
	private static final long serialVersionUID = 2l;

	/** The id for the row. */
	private int id;

	/** The data of the row. Each field index represents a column index */
	private String[] cell;

	/** Default constructor. */
	public Row() {
	}

    /**
     * Create a new {@link Row} with the specified values.
     * 
     * @param id The id to use for the row.
     * @param cell The data to use as content for the row.
     */
	public Row(final int id, final String[] cell) {
		this.id = id;
		this.cell = cell;
	}

	/**
	 * Compares the specified object with this instance for equality.
	 * 
	 * @param object
	 *            The object to be compared.
	 * @return Returns <code>true</code> if the specified object is of the same
	 *         type and has the same values.
	 */
	@Override
	public boolean equals(final Object object) {
		if (this == object) {
            return true;
        }
		if (object == null) {
            return false;
        }

		boolean result = false;
		if (object instanceof Row) {
			final Row row = (Row) object;
			result = (id == row.id);
		}

		return result;
	}

	/**
	 * Calculates a hash code for this object using the class fields.
	 * 
	 * @return The hash code for this instance.
	 */
	@Override
	public int hashCode() {
		return id;
	}

	/**
	 * Accessor for property 'id'.
	 * 
	 * @return Value for property 'id'.
	 */
	public int getId() {
		return id;
	}

	/**
	 * Mutator for property 'id'.
	 * 
	 * @param id
	 *            Value to set for property 'id'.
	 */
	public void setId(final int id) {
		this.id = id;
	}

	/**
	 * Accessor for property 'cell'.
	 * 
	 * @return Value for property 'cell'.
	 */
	public String[] getCell() {
		return cell;
	}

    /**
     * Mutator for property 'cell'.
     * 
     * @param cell Value to set for property 'cell'.
     */
	public void setCell(final String[] cell) {
		this.cell = cell;
	}
}
