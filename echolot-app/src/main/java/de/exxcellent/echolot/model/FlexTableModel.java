/*
 * This file (FlexTableModel.java) is part of the Echolot Project (hereinafter "Echolot").
 * Copyright (C) 2008-2011 eXXcellent Solutions GmbH.
 *
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 */

package de.exxcellent.echolot.model;

/**
 * TableModel for FlexiGrid
 *
 * @author Ralf Enderle <r.enderle@exxcellent.de>
 */
public interface FlexTableModel {

    /**
     * Static identifier for all Rows on one Page
     */
    public static final int SHOW_ALL_ROWS_ON_ONE_PAGE = -1;

    /**
     * Returns the RowsPerPageCount
     *
     * @return the amount of Rows per Page
     * @see FlexTableModel.SHOW_ALL_ROWS_ON_ONE_PAGE
     */
    public int getRowsPerPageCount();

    /**
     * Returns the Rowcount of the TableModel
     *
     * @return the total amount of rows
     */
    public int getRowCount();

    /**
     * Returns the ColumnCount of the TableModel
     *
     * @return the total amount of columns
     */
    public int getColumnCount();

    /**
     * Returns the ColumnModel for a specific columnIndex
     *
     * @param columnIndex the requested index
     * @return the suitable columnModel
     */
    public FlexColumnModel getColumnModel(int columnIndex);

    /**
     * Returns the value at a specific row/col position of the TableModel
     *
     * @param rowIndex    the rowIndex
     * @param columnIndex the columnIndex
     * @return the value of the requested row/col index
     */
    public String getValueAt(int rowIndex, int columnIndex);

}
