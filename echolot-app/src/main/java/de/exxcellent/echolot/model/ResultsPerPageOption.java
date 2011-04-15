/*
 * This file (ResultsPerPageOption.java) is part of the Echolot Project (hereinafter "Echolot").
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
 * A class to specify the results per page options.
 * 
 * @author Oliver Pehnke <o.pehnke@exxcellent.de>
 */
public class ResultsPerPageOption {
    private int[] pageOptions;
    private int initialOption;
    
    /** Default constructor. */
    public ResultsPerPageOption() {
    }

    /**
     * Create a new {@link ResultsPerPageOption} with the specified values.
     * 
     * @param initialOption the initially used page option, e.g. '25'
     * @param pageOptions The data to use as page option, e.g. [10,25,50].
     */
    public ResultsPerPageOption(final int initialOption, final int[] pageOptions) {
        this.initialOption = initialOption;
        this.pageOptions = pageOptions;
    }
    
    /**
     * @return the results per page option
     */
    public int[] getPageOption() {
        return pageOptions;
    }
    
    /**
     * Sets the page options, e.g. [10,15,20].
     * 
     * @param pageOption a new array of page options.
     */
    public void setPageOption(int[] pageOption) {
        pageOptions = pageOption;
    }
    
    /**
     * @return the initially used page option, e.g. '25'
     */
    public int getInitialOption() {
        return initialOption;
    }

    /**
     * Sets the initially used page option, e.g. '25'
     * 
     * @param initialOption the initially used page option, e.g. '25'
     */
    public void setInitialOption(int initialOption) {
        this.initialOption = initialOption;
    }
}
