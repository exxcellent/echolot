/*
 * This file (TableModel.java) is part of the Echolot Project (hereinafter "Echolot").
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
 * {
 * 	page: 1,
 * 	total: 8,
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
public class TableModel implements Serializable {
	private static final long serialVersionUID = 4l;

	/** The page in the table model */
	private Page[] pages;

	/** Default constructor. */
	public TableModel() {
	}

    /**
     * Create a new {@link TableModel} with the specified values.
     * 
     * @param pages The page model to use.
     */
	public TableModel(final Page[] pages) {
        this.pages = pages;
	}

    /**
     * @return the content model as {@link Page} array.
     */
	public Page[] getPages() {
        return pages;
	}

    /**
     * Sets the content model as {@link Page}.
     * 
     * @param pages content model as {@link Page} array.
     */
	public void setPages(Page[] pages) {
        this.pages = pages;
	}

    /**
     * The total count of rows in all pages.
     * 
     * @return the amount of all rows in all pages
     */
    public int getTotal() {
        int total = 0;
        for (Page page : pages) {
            total += page.getTotal();
        }
        return total;
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + Arrays.hashCode(pages);
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
        TableModel other = (TableModel) obj;
        if (!Arrays.equals(pages, other.pages)) {
            return false;
        }
        return true;
    }
    
    
}
