/*
 * This file (Page.java) is part of the Echolot Project (hereinafter "Echolot").
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
 * A Page is a logical part of the table model and describes the rows in paged model.
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
@XStreamAlias("page")
public class Page {
	private static final long serialVersionUID = 3l;
	
	/** The page of the rows. */
	private int page;
	
	/** The total amount of rows. */
	private int total;
	
	/** The row array itself */
	private Row[] rows;

	/**
     * Constructor to create easily a new {@link Page}.
     * 
     * @param page the page index.
     * @param total the total amount of rows for the {@link Page}.
     * @param rows the rows for the {@link Page}
     */
	public Page(int page, int total, Row[] rows) {
		super();
		this.page = page;
		this.total = total;
		this.rows = rows;
	}

	/**
     * Returns the the page index.
     * 
     * @return the page index
     */
	public int getPage() {
		return page;
	}
	/**
     * Sets the page index of the {@link Page}.
     * 
     * @param page the page index, e.g. "1"
     */
	public void setPage(int page) {
		this.page = page;
	}

	/**
     * Returns the total amount of rows in this {@link Page}.
     * 
     * @return the total amount of rows in this {@link Page}
     */
	public int getTotal() {
		return total;
	}
	/**
     * Sets the total count of rows in this {@link Page}.
     * 
     * @param total the count of rows
     */
	public void setTotal(int total) {
		this.total = total;
	}
	/**
     * Returns the rows containing the data itself.
     * 
     * @return the rows of the {@link Page}.
     */
	public Row[] getRows() {
		return rows;
	}

	/**
     * Sets the rows of the {@link Page} containing the cell data.
     * 
     * @param rows rows containing the cell data
     */
	public void setRows(Row[] rows) {
		this.rows = rows;
	}
	
}
