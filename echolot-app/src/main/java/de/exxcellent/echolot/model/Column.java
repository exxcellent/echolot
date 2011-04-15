/*
 * This file (Column.java) is part of the Echolot Project (hereinafter "Echolot").
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
 * The column model object for use in the {@link de.exxcellent.echolot.app.FlexiGrid} component.
 * 
 * <pre>
 *      columnModel[
 *              {display: 'Name', name: 0},
 *              {display: 'EMail', name: 1}
 * </pre>
 * 
 * @author Oliver Pehnke <o.pehnke@exxcellent.de>
 */
public class Column implements Serializable {
	private static final long serialVersionUID = 1l;

	/** The name for the column, i.e. id */
	private int id;
	
	/** The display/title for the column (headline). */
	private String display;

	/** The column width */
	private int width;
	
	/** The column is sortable */
	private boolean sortable = true;

	/** The alignment of the column, e.g. "right", "left", "center" */
	private String align = "left";
	
	/** if <code>true</code> the column is hidden by default */
    private boolean hide;
    
    /** the column tooltip visible if the user hovers over the column. */
    private String tooltip;

    /** Default constructor. */
	public Column() {
	}

	/**
     * Create a new {@link Column} with the specified values.
     * 
     * @param id the id to use as unique id in this model.
     * @param columnLabel the name to display as header value.
     * @param width the initial width of the column itself, e.g. "100px" or "auto".
     * @param sortable if <code>true</code> the column is sortable
     * @param align the column alignment, e.g. "right", "left", "center"
     * @param hide if <code>true</code> the column is hidden.
     * @param tooltip the column tooltip visible if the user hovers over the column.
     */
    public Column(final int id, final String columnLabel, final int width, final boolean sortable, final String align,
            final boolean hide, final String tooltip) {
        this.id = id;
        this.display = columnLabel;
        this.width = width;
        this.sortable = sortable;
        this.align = align;
        this.hide = hide;
        this.tooltip = tooltip;
    }
	
    /**
     * Create a new {@link Column} with the specified values.
     * 
     * @param id the id to use as unique id in this model.
     * @param columnLabel the name to display as header value.
     * @param width the initial width of the column itself, e.g. "100px" or "auto".
     * @param sortable if <code>true</code> the column is sortable
     * @param align the column alignment, e.g. "right", "left", "center"
     * @param hide if <code>true</code> the column is hidden.
     */
	public Column(final int id, final String columnLabel, final int width, final boolean sortable, final String align,
            final boolean hide) {
		this(id, columnLabel, width, sortable, align, hide, null);
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
		if (object instanceof Column) {
			final Column column = (Column) object;
			result = id == column.id;
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
	 * Accessor for property 'display'.
	 * 
	 * @return Value for property 'display'.
	 */
	public String getDisplay() {
		return display;
	}

	/**
	 * Mutator for property 'display'.
	 * 
	 * @param display
	 *            Value to set for property 'display'.
	 */
	public void setDisplay(final String display) {
		this.display = display;
	}

	/**
	 * Accessor for property 'width'.
	 * 
	 * @return Value for property 'width'.
	 */
	public int getWidth() {
		return width;
	}

	/**
	 * Mutator for property 'width'.
	 * 
	 * @param width
	 *            Value to set for property 'width'.
	 */
	public void setWidth(final int width) {
		this.width = width;
	}
	
	/**
	 * Accessor for property 'name'.
	 * 
	 * @return Value for property 'name'.
	 */
	public int getId() {
		return id;
	}
	
	/**
	 * Mutator for property 'name'.
	 * 
	 * @param id
	 *            Value to set for property 'name'.
	 */
	public void setId(int id) {
		this.id = id;
	}
	/**
     * Accessor for property 'sortable'.
     * 
     * @return Value for property 'sortable'.
     */
	public boolean isSortable() {
		return sortable;
	}
	/**
     * Mutator for property 'sortable'.
     * 
     * @param sortable Value to set for property 'sortable'.
     */
	public void setSortable(boolean sortable) {
		this.sortable = sortable;
	}
	/**
     * Accessor for property 'align'.
     * 
     * @return Value for property 'align'.
     */
	public String getAlign() {
		return align;
	}
	/**
     * Mutator for property 'align'.
     * 
     * @param align Value to set for property 'align'.
     */
	public void setAlign(String align) {
		this.align = align;
	}
	
	/**
     * Accessor for property 'hide'.
     * 
     * @return Value for property 'hide'.
     */
    public boolean getHide() {
        return hide;
    }

    /**
     * Mutator for property 'hide'.
     * 
     * @param hide Value to set for property 'hide'.
     */
    public void setHide(boolean hide) {
        this.hide = hide;
    }

    /**
     * Accessor for property 'tooltip'. The column tooltip visible if the user hovers over the column.
     * 
     * @return Value for property 'tooltip'.
     */
    public String getTooltip() {
        return tooltip;
    }

    /**
     * Mutator for property 'tooltip'. The column tooltip visible if the user hovers over the column.
     * 
     * @param tooltip Value to set for property 'tooltip'.
     */
    public void setTooltip(String tooltip) {
        this.tooltip = tooltip;
    }
    
    /**
     * @inheritDoc
     */
    @Override
    public String toString() {
        return "Column id: " + id + ", width: " + width + ", sortable: " + sortable + ", align: " + align + ", hide: " + hide;
    }
}
