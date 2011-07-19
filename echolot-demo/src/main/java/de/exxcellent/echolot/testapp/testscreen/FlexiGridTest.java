/*
 * This file (FlexiGridTest.java) is part of the Echolot Project (hereinafter "Echolot").
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

package de.exxcellent.echolot.testapp.testscreen;

import de.exxcellent.echolot.app.FlexiGrid;
import de.exxcellent.echolot.event.TableColumnToggleEvent;
import de.exxcellent.echolot.event.TableRowSelectEvent;
import de.exxcellent.echolot.event.TableSortingChangeEvent;
import de.exxcellent.echolot.listener.TableColumnToggleListener;
import de.exxcellent.echolot.listener.TableRowSelectListener;
import de.exxcellent.echolot.listener.TableSortingChangeListener;
import de.exxcellent.echolot.model.*;
import de.exxcellent.echolot.testapp.ButtonColumn;
import nextapp.echo.app.ApplicationInstance;
import nextapp.echo.app.Extent;
import nextapp.echo.app.ExtentConverter;
import nextapp.echo.app.Insets;
import nextapp.echo.app.Label;
import nextapp.echo.app.SplitPane;
import nextapp.echo.app.event.ActionEvent;
import nextapp.echo.app.event.ActionListener;
import nextapp.echo.app.layout.SplitPaneLayoutData;

/**
 * Interactive Test Module for testing <code>FlexiGridTest</code> component.
 */
public class FlexiGridTest extends SplitPane {
    private final TableSortingChangeListener sortingListener;

    /**
     * A constructor for a {@link FlexiGridTest}.
     */
//    public FlexiGridTest() {
//        super(SplitPane.ORIENTATION_HORIZONTAL, new Extent(250, Extent.PX));
//        setStyleName("DefaultResizable");
//
//        ButtonColumn controlsColumn = new ButtonColumn();
//        controlsColumn.setStyleName("TestControlsColumn");
//        add(controlsColumn);
//
//        final FlexiGrid flexiGrid = new FlexiGrid();
//        sortingListener = new SimpleTableSortingChangeListener(flexiGrid);
//
//        // model
//        //final Object[] models = createEmailSampleTableModel();
//        final Object[] models = createMultiplicationTableModel(30, 50);
//        final TableModel dataModel = (TableModel) models[0];
//        final ColumnModel colModel = (ColumnModel) models[1];
//
//        final SortingModel sortModel =
//                new SortingModel(new SortingColumn[] { new SortingColumn(1, SortDirection.ASCENDING),
//                        new SortingColumn(3, SortDirection.DESCENDING) });
//        // do initially sorting
//        TableModelSorter.sort(dataModel, colModel, sortModel);
//
//        flexiGrid.setClientSorting(true);
//        flexiGrid.setDebug(true);
//        flexiGrid.setColumnModel(colModel);
//        flexiGrid.setTableModel(dataModel);
//        flexiGrid.setResultsPerPageOption(new ResultsPerPageOption(4, new int[] { 2, 4 }));
//        flexiGrid.setSortingModel(sortModel);
//
//        flexiGrid.setTitle("Test Flexigrid");
//        flexiGrid.setRenderId("flex1");
//        flexiGrid.setStyleName("Default");
//        flexiGrid.setTitle("Test grid");
//
//        flexiGrid.setResizable(true);
//        flexiGrid.setShowTableToggleButton(false);
//        flexiGrid.setShowPager(false);
//        flexiGrid.setShowPageStatistics(true);
//        flexiGrid.setMessagePageStatistics("Displaying {total} items");
//
//        flexiGrid.setSingleSelect(true);
//
//        // uncomment this line to specify a width instead of 'auto' width
//        //flexiGrid.setWidth(750);
//        //flexiGrid.setHeight(400);
//        flexiGrid.setHeightOffset(100);// only if height is unset or 'auto'
//        flexiGrid.setColumnWidthUnit(ExtentConverter.getStringValueFromExtentUnit(Extent.PX));
//
//        flexiGrid.setShowResultsPerPage(true);
//        flexiGrid.setStriped(true);
//
//        // set focus into flexigrid
//        ApplicationInstance.getActive().setFocusedComponent(flexiGrid);
//
//        flexiGrid.addTableRowSelectListener(new TableRowSelectListener() {
//            public void rowSelection(TableRowSelectEvent e) {
//                System.out.println("Row selection : " + e.getRowSelection().getRowId());
//            }
//        });
//        flexiGrid.addTableColumnToggleListener(new TableColumnToggleListener() {
//            public void columnToggle(TableColumnToggleEvent e) {
//                System.out.println("Column : " + e.getColumnVisibility().getColumnId() + " changed visibility to "
//                        + e.getColumnVisibility().isVisible());
//            }
//        });
//        SplitPaneLayoutData data = new SplitPaneLayoutData();
//        data.setInsets(new Insets(10));
//        data.setOverflow(SplitPaneLayoutData.OVERFLOW_HIDDEN);
//        flexiGrid.setLayoutData(data);
//
//        // Add the component to the testarea
//        add(flexiGrid);
//
//        controlsColumn.add(new Label("Sorting"));
//        controlsColumn.addButton("Enable clientside sorting", new ActionListener() {
//            public void actionPerformed(ActionEvent e) {
//                flexiGrid.setClientSorting(true);
//                flexiGrid.removeTableSortingChangeListener(sortingListener);
//            }
//        });
//        controlsColumn.addButton("Enable serverside sorting", new ActionListener() {
//            public void actionPerformed(ActionEvent e) {
//                flexiGrid.setClientSorting(false);
//                flexiGrid.addTableSortingChangeListener(sortingListener);
//            }
//        });
//        controlsColumn.addButton("Set client sort delimiter to '.'", new ActionListener() {
//            public void actionPerformed(ActionEvent e) {
//                flexiGrid.setDigitGroupDelimiter(".");
//                flexiGrid.setClientSorting(true);
//                flexiGrid.removeTableSortingChangeListener(sortingListener);
//            }
//        });
//        controlsColumn.addButton("Set client sort delimiter to ','", new ActionListener() {
//            public void actionPerformed(ActionEvent e) {
//                flexiGrid.setDigitGroupDelimiter(",");
//                flexiGrid.setClientSorting(true);
//                flexiGrid.removeTableSortingChangeListener(sortingListener);
//            }
//        });
//        controlsColumn.addButton("Set client sort decimal-delimiter to ','", new ActionListener() {
//            public void actionPerformed(ActionEvent e) {
//                flexiGrid.setDecimalDelimiter(",");
//                flexiGrid.setClientSorting(true);
//                flexiGrid.removeTableSortingChangeListener(sortingListener);
//            }
//        });
//        controlsColumn.addButton("Set client sort decimal-delimiter to '.'", new ActionListener() {
//            public void actionPerformed(ActionEvent e) {
//                flexiGrid.setDecimalDelimiter(".");
//                flexiGrid.setClientSorting(true);
//                flexiGrid.removeTableSortingChangeListener(sortingListener);
//            }
//        });
//        controlsColumn.addButton("Set page statistics to 'Test'", new ActionListener() {
//            public void actionPerformed(ActionEvent e) {
//                flexiGrid.setMessagePageStatistics("Test");
//            }
//        });
//
//        controlsColumn.add(new Label("Model"));
//        controlsColumn.addButton("Set Email Table Model", new ActionListener() {
//			public void actionPerformed(ActionEvent e) {
//                final Object[] modelContainer = createEmailSampleTableModel(true);
//                final TableModel tableModel = (TableModel) modelContainer[0];
//                final ColumnModel columnModel = (ColumnModel) modelContainer[1];
//
//                final SortingModel sortingModel =
//                        new SortingModel(new SortingColumn[] { new SortingColumn(0, SortDirection.DESCENDING),
//                                new SortingColumn(2, SortDirection.ASCENDING) });
//                // do initially sorting
//                TableModelSorter.sort(tableModel, columnModel, sortingModel);
//
//                flexiGrid.setColumnModel(columnModel);
//                flexiGrid.setTableModel(tableModel);
//                flexiGrid.setSortingModel(sortingModel);
//            }
//        });
//        controlsColumn.addButton("Update with Empty Rows", new ActionListener() {
//            public void actionPerformed(ActionEvent e) {
//                final Object[] modelContainer = createEmailSampleTableModel(false);
//                final TableModel tableModel = (TableModel) modelContainer[0];
//
//                flexiGrid.setTableModel(tableModel);
//            }
//        });
//        controlsColumn.addButton("Set Numbers Table Model (','= DIGIT-Delimiter '.'= DecimalDelimiter", new ActionListener() {
//            public void actionPerformed(ActionEvent e) {
//                final Object[] modelContainer = createNumbersTableModel(",", ".");
//                final TableModel tableModel = (TableModel) modelContainer[0];
//                final ColumnModel columnModel = (ColumnModel) modelContainer[1];
//
//                final SortingModel sortingModel =
//                        new SortingModel(new SortingColumn[] { new SortingColumn(0, SortDirection.ASCENDING) });
//                // do initially sorting
//                TableModelSorter.sort(tableModel, columnModel, sortingModel);
//
//                flexiGrid.setColumnModel(columnModel);
//                flexiGrid.setTableModel(tableModel);
//                flexiGrid.setSortingModel(sortingModel);
//            }
//        });
//        controlsColumn.addButton("Set Numbers Table Model ('.'= DIGIT-Delimiter ','= DecimalDelimiter", new ActionListener() {
//            public void actionPerformed(ActionEvent e) {
//                final Object[] modelContainer = createNumbersTableModel(".", ",");
//                final TableModel tableModel = (TableModel) modelContainer[0];
//                final ColumnModel columnModel = (ColumnModel) modelContainer[1];
//
//                final SortingModel sortingModel =
//                        new SortingModel(new SortingColumn[] { new SortingColumn(0, SortDirection.ASCENDING) });
//                // do initially sorting
//                TableModelSorter.sort(tableModel, columnModel, sortingModel);
//
//                flexiGrid.setColumnModel(columnModel);
//                flexiGrid.setTableModel(tableModel);
//                flexiGrid.setSortingModel(sortingModel);
//            }
//        });
//        controlsColumn.addButton("Clear Model (null)", new ActionListener() {
//            public void actionPerformed(ActionEvent e) {
//                flexiGrid.setSortingModel(null);
//                Page page = new Page(1, 0, new Row[] {});
//                TableModel tableModel = new TableModel(new Page[] { page });
//                flexiGrid.setTableModel(tableModel);
//            }
//        });
//        controlsColumn.addButton("Set Multiplication Model (2*2)", new ActionListener() {
//            public void actionPerformed(ActionEvent e) {
//                setMultiplicationTableModel(flexiGrid, 2, 2, false);
//            }
//        });
//        controlsColumn.addButton("Set Multiplication Model (30*50)", new ActionListener() {
//            public void actionPerformed(ActionEvent e) {
//                final long timeA = System.currentTimeMillis();
//                final Object[] modelContainer = createMultiplicationTableModel(30, 50);
//                final TableModel tableModel = (TableModel) modelContainer[0];
//                final ColumnModel columnModel = (ColumnModel) modelContainer[1];
//                final long timeB = System.currentTimeMillis();
//                String msg = "Model created in " + String.valueOf(timeB - timeA) + " ms";
//
//                // do initially sorting
//                SortingModel sortingModel =
//                        new SortingModel(new SortingColumn[] { new SortingColumn(1, SortDirection.ASCENDING) });
//                TableModelSorter.sort(tableModel, columnModel, sortingModel);
//                msg += " sorted in " + String.valueOf(System.currentTimeMillis() - timeB) + " ms";
//                System.out.println(msg);
//
//                flexiGrid.setColumnModel(columnModel);
//                flexiGrid.setSortingModel(sortingModel);
//                flexiGrid.setTableModel(tableModel);
//            }
//        });
//        controlsColumn.addButton("Set Multiplication Model (50*250)", new ActionListener() {
//            public void actionPerformed(ActionEvent e) {
//                setMultiplicationTableModel(flexiGrid, 50, 250, false);
//            }
//        });
//        controlsColumn.addButton("Set Multiplication Model (20*50)", new ActionListener() {
//            public void actionPerformed(ActionEvent e) {
//                setMultiplicationTableModel(flexiGrid, 20, 50, false);
//            }
//        });
//        controlsColumn.addButton("Update Multiplication Model (20*50)", new ActionListener() {
//            public void actionPerformed(ActionEvent e) {
//                updateMultiplicationTableModel(flexiGrid, 20, 50, false);
//            }
//        });
//        controlsColumn.addButton("Update Multiplication Model (20*50) Reverse", new ActionListener() {
//            public void actionPerformed(ActionEvent e) {
//                updateMultiplicationTableModel(flexiGrid, 20, 50, true);
//            }
//        });
//
//        controlsColumn.add(new Label("Layout"));
//        controlsColumn.addButton("Set width to 'auto'", new ActionListener() {
//            public void actionPerformed(ActionEvent e) {
//                flexiGrid.setWidth(-1);
//            }
//        });
//        controlsColumn.addButton("Set height to 'auto'", new ActionListener() {
//            public void actionPerformed(ActionEvent e) {
//                flexiGrid.setHeight(-1);
//            }
//        });
//        controlsColumn.addButton("Set width to '500px'", new ActionListener() {
//            public void actionPerformed(ActionEvent e) {
//                flexiGrid.setWidth(500);
//            }
//        });
//        controlsColumn.addButton("Set width to '250px'", new ActionListener() {
//            public void actionPerformed(ActionEvent e) {
//                flexiGrid.setHeight(250);
//            }
//        });
//    }
    public FlexiGridTest() {
        super(SplitPane.ORIENTATION_HORIZONTAL, new Extent(250, Extent.PX));
        setStyleName("DefaultResizable");

        ButtonColumn controlsColumn = new ButtonColumn();
        controlsColumn.setStyleName("TestControlsColumn");
        add(controlsColumn);

        final FlexiGrid flexiGrid = new FlexiGrid();
        final FlexTableModel flexTableModel = new TestTableModel();
        sortingListener = new SimpleTableSortingChangeListener(flexiGrid);

        // model
        //final Object[] models = createEmailSampleTableModel();
        flexiGrid.setFlexTableModel(flexTableModel);

        // Sorting
        final SortingModel sortModel =
                new SortingModel(new SortingColumn[]{new SortingColumn(1, SortDirection.ASCENDING),
                        new SortingColumn(2, SortDirection.DESCENDING)});

        flexiGrid.setClientSorting(false);
        flexiGrid.setSortingModel(sortModel);

        flexiGrid.setDebug(true);

        flexiGrid.setTitle("Test Flexigrid");
        flexiGrid.setRenderId("flex1");
        flexiGrid.setStyleName("Default");
        flexiGrid.setTitle("Test grid");

        flexiGrid.setResizable(true);
        flexiGrid.setShowTableToggleButton(false);
        flexiGrid.setShowPager(true);
        flexiGrid.setShowPageStatistics(true);
        flexiGrid.setMessagePageStatistics("Displaying {total} items");

        flexiGrid.setSingleSelect(true);

        // uncomment this line to specify a width instead of 'auto' width
        //flexiGrid.setWidth(750);
        //flexiGrid.setHeight(400);
        flexiGrid.setHeightOffset(100);// only if height is unset or 'auto'
        flexiGrid.setColumnWidthUnit(ExtentConverter.getStringValueFromExtentUnit(Extent.PX));

        flexiGrid.setShowResultsPerPage(false);
        flexiGrid.setStriped(true);

        // some listener
        // ----------------------------------------------------------------------------------
        flexiGrid.addTableRowSelectListener(new TableRowSelectListener() {
            public void rowSelection(TableRowSelectEvent e) {
                System.out.println("Row selection : " + e.getRowSelection().getRowId());
            }
        });
        flexiGrid.addTableColumnToggleListener(new TableColumnToggleListener() {
            public void columnToggle(TableColumnToggleEvent e) {
                System.out.println("Column : " + e.getColumnVisibility().getColumnId() + " changed visibility to "
                        + e.getColumnVisibility().isVisible());
            }
        });


        // set focus into flexigrid
        ApplicationInstance.getActive().setFocusedComponent(flexiGrid);

        SplitPaneLayoutData data = new SplitPaneLayoutData();
        data.setInsets(new Insets(10));
        data.setOverflow(SplitPaneLayoutData.OVERFLOW_HIDDEN);
        flexiGrid.setLayoutData(data);

        // Add the component to the testarea
        // ---------------------------------------------------------------------------------------
        add(flexiGrid);

        // some action on the controlsColumn
        // ----------------------------------------------------------------------------------------

        controlsColumn.add(new Label("Sorting"));
        controlsColumn.addButton("Add serverside sorting listener", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                flexiGrid.addTableSortingChangeListener(sortingListener);
            }
        });
        // client sorting does not work any more...
//        controlsColumn.addButton("Set client sort delimiter to '.'", new ActionListener() {
//            public void actionPerformed(ActionEvent e) {
//                flexiGrid.setDigitGroupDelimiter(".");
//                flexiGrid.setClientSorting(true);
//                flexiGrid.removeTableSortingChangeListener(sortingListener);
//            }
//        });
//        controlsColumn.addButton("Set client sort delimiter to ','", new ActionListener() {
//            public void actionPerformed(ActionEvent e) {
//                flexiGrid.setDigitGroupDelimiter(",");
//                flexiGrid.setClientSorting(true);
//                flexiGrid.removeTableSortingChangeListener(sortingListener);
//            }
//        });
//        controlsColumn.addButton("Set client sort decimal-delimiter to ','", new ActionListener() {
//            public void actionPerformed(ActionEvent e) {
//                flexiGrid.setDecimalDelimiter(",");
//                flexiGrid.setClientSorting(true);
//                flexiGrid.removeTableSortingChangeListener(sortingListener);
//            }
//        });
//        controlsColumn.addButton("Set client sort decimal-delimiter to '.'", new ActionListener() {
//            public void actionPerformed(ActionEvent e) {
//                flexiGrid.setDecimalDelimiter(".");
//                flexiGrid.setClientSorting(true);
//                flexiGrid.removeTableSortingChangeListener(sortingListener);
//            }
//        });
        controlsColumn.add(new Label("NavBar"));
        controlsColumn.addButton("Set page statistics to 'Test'", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                flexiGrid.setMessagePageStatistics("Test");
            }
        });
        controlsColumn.addButton("Set page statistics to 'Displaying xx items'", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                flexiGrid.setMessagePageStatistics("Displaying {total} items");
            }
        });

        controlsColumn.add(new Label("Model"));
        controlsColumn.addButton("Set Sample Table Model", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                flexiGrid.setFlexTableModel(new TestTableModel());
            }
        });
        controlsColumn.addButton("Set Email Table Model", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                final FlexTableModel emailFlexTableModel = createEmailSampleTableModel(true);
                final SortingModel sortingModel =
                        new SortingModel(new SortingColumn[]{new SortingColumn(0, SortDirection.DESCENDING),
                                new SortingColumn(2, SortDirection.ASCENDING)});
                flexiGrid.setFlexTableModel(emailFlexTableModel);
                flexiGrid.setSortingModel(sortingModel);
            }
        });
//        controlsColumn.addButton("Update with Empty Rows", new ActionListener() {
//            public void actionPerformed(ActionEvent e) {
//                final Object[] modelContainer = createEmailSampleTableModel(false);
//                final TableModel tableModel = (TableModel) modelContainer[0];
//
//                flexiGrid.setTableModel(tableModel);
//            }
//        });
//        controlsColumn.addButton("Set Numbers Table Model (','= DIGIT-Delimiter '.'= DecimalDelimiter", new ActionListener() {
//            public void actionPerformed(ActionEvent e) {
//                final Object[] modelContainer = createNumbersTableModel(",", ".");
//                final TableModel tableModel = (TableModel) modelContainer[0];
//                final ColumnModel columnModel = (ColumnModel) modelContainer[1];
//
//                final SortingModel sortingModel =
//                        new SortingModel(new SortingColumn[] { new SortingColumn(0, SortDirection.ASCENDING) });
//                // do initially sorting
//                TableModelSorter.sort(tableModel, columnModel, sortingModel);
//
//                flexiGrid.setColumnModel(columnModel);
//                flexiGrid.setTableModel(tableModel);
//                flexiGrid.setSortingModel(sortingModel);
//            }
//        });
//        controlsColumn.addButton("Set Numbers Table Model ('.'= DIGIT-Delimiter ','= DecimalDelimiter", new ActionListener() {
//            public void actionPerformed(ActionEvent e) {
//                final Object[] modelContainer = createNumbersTableModel(".", ",");
//                final TableModel tableModel = (TableModel) modelContainer[0];
//                final ColumnModel columnModel = (ColumnModel) modelContainer[1];
//
//                final SortingModel sortingModel =
//                        new SortingModel(new SortingColumn[] { new SortingColumn(0, SortDirection.ASCENDING) });
//                // do initially sorting
//                TableModelSorter.sort(tableModel, columnModel, sortingModel);
//
//                flexiGrid.setColumnModel(columnModel);
//                flexiGrid.setTableModel(tableModel);
//                flexiGrid.setSortingModel(sortingModel);
//            }
//        });
//        controlsColumn.addButton("Clear Model (null)", new ActionListener() {
//            public void actionPerformed(ActionEvent e) {
//                flexiGrid.setSortingModel(null);
//                Page page = new Page(1, 0, new Row[] {});
//                TableModel tableModel = new TableModel(new Page[] { page });
//                flexiGrid.setTableModel(tableModel);
//            }
//        });
//        controlsColumn.addButton("Set Multiplication Model (2*2)", new ActionListener() {
//            public void actionPerformed(ActionEvent e) {
//                setMultiplicationTableModel(flexiGrid, 2, 2, false);
//            }
//        });
//        controlsColumn.addButton("Set Multiplication Model (30*50)", new ActionListener() {
//            public void actionPerformed(ActionEvent e) {
//                final long timeA = System.currentTimeMillis();
//                final Object[] modelContainer = createMultiplicationTableModel(30, 50);
//                final TableModel tableModel = (TableModel) modelContainer[0];
//                final ColumnModel columnModel = (ColumnModel) modelContainer[1];
//                final long timeB = System.currentTimeMillis();
//                String msg = "Model created in " + String.valueOf(timeB - timeA) + " ms";
//
//                // do initially sorting
//                SortingModel sortingModel =
//                        new SortingModel(new SortingColumn[] { new SortingColumn(1, SortDirection.ASCENDING) });
//                TableModelSorter.sort(tableModel, columnModel, sortingModel);
//                msg += " sorted in " + String.valueOf(System.currentTimeMillis() - timeB) + " ms";
//                System.out.println(msg);
//
//                flexiGrid.setColumnModel(columnModel);
//                flexiGrid.setSortingModel(sortingModel);
//                flexiGrid.setTableModel(tableModel);
//            }
//        });
//        controlsColumn.addButton("Set Multiplication Model (50*250)", new ActionListener() {
//            public void actionPerformed(ActionEvent e) {
//                setMultiplicationTableModel(flexiGrid, 50, 250, false);
//            }
//        });
//        controlsColumn.addButton("Set Multiplication Model (20*50)", new ActionListener() {
//            public void actionPerformed(ActionEvent e) {
//                setMultiplicationTableModel(flexiGrid, 20, 50, false);
//            }
//        });
//        controlsColumn.addButton("Update Multiplication Model (20*50)", new ActionListener() {
//            public void actionPerformed(ActionEvent e) {
//                updateMultiplicationTableModel(flexiGrid, 20, 50, false);
//            }
//        });
//        controlsColumn.addButton("Update Multiplication Model (20*50) Reverse", new ActionListener() {
//            public void actionPerformed(ActionEvent e) {
//                updateMultiplicationTableModel(flexiGrid, 20, 50, true);
//            }
//        });
//
        controlsColumn.add(new Label("Layout"));
        controlsColumn.addButton("Set width to 'auto'", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                flexiGrid.setWidth(-1);
            }
        });
        controlsColumn.addButton("Set height to 'auto'", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                flexiGrid.setHeight(-1);
            }
        });
        controlsColumn.addButton("Set width to '500px'", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                flexiGrid.setWidth(500);
            }
        });
        controlsColumn.addButton("Set width to '250px'", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                flexiGrid.setHeight(250);
            }
        });


    }

    private void setMultiplicationTableModel(final FlexiGrid flexiGrid, int columns, int rows, boolean reverse) {
        final Object[] modelContainer;
        if (reverse) {
            modelContainer = createReverseMultiplicationTableModel(columns, rows);
        } else {
            modelContainer = createMultiplicationTableModel(columns, rows);
        }
        final TableModel tableModel = (TableModel) modelContainer[0];
        final ColumnModel columnModel = (ColumnModel) modelContainer[1];

        SortingModel sortingModel = new SortingModel(new SortingColumn[]{new SortingColumn(1, SortDirection.ASCENDING)});

        flexiGrid.setColumnModel(columnModel);
        flexiGrid.setTableModel(tableModel);
        flexiGrid.setSortingModel(sortingModel);
    }

    private void updateMultiplicationTableModel(final FlexiGrid flexiGrid, int columns, int rows, boolean reverse) {
        final Object[] modelContainer;
        if (reverse) {
            modelContainer = createReverseMultiplicationTableModel(columns, rows);
        } else {
            modelContainer = createMultiplicationTableModel(columns, rows);
        }
        final TableModel tableModel = (TableModel) modelContainer[0];
        flexiGrid.setTableModel(tableModel);
    }

    /**
     * Creates a complex multiplication model.
     */
    private Object[] createMultiplicationTableModel(int columnCount, int rowCount) {
        final Column[] columns = new Column[columnCount];
        final Row[] rows = new Row[rowCount];
        for (int i = 0; i < columns.length; i++) {
            columns[i] = new Column(i + 1, String.valueOf(i + 1), 25, true, "left", false);
        }
        for (int i = 0; i < rows.length; i++) {
            final String[] cellValue = new String[columns.length];
            for (int j = 0; j < columns.length; j++) {
                cellValue[j] = String.valueOf((j + 1) * (i + 1));
            }
            rows[i] = new Row(i, cellValue);
        }

        final Page[] pages = new Page[]{new Page(1, rowCount, rows)};
        return new Object[]{new TableModel(pages), new ColumnModel(columns)};
    }

    /**
     * Creates a complex multiplication model.
     */
    private Object[] createReverseMultiplicationTableModel(int columnCount, int rowCount) {
        final Column[] columns = new Column[columnCount];
        final Row[] rows = new Row[rowCount];
        for (int i = 0; i < columns.length; i++) {
            columns[i] = new Column(i + 1, String.valueOf(columns.length - i), 25, true, "left", false);
        }
        for (int i = 0; i < rows.length; i++) {
            final String[] cellValue = new String[columns.length];
            for (int j = 0; j < columns.length; j++) {
                cellValue[j] = String.valueOf((columns.length - j) * (rows.length - i));
            }
            rows[i] = new Row(i, cellValue);
        }

        final Page[] pages = new Page[]{new Page(1, rowCount, rows)};
        return new Object[]{new TableModel(pages), new ColumnModel(columns)};
    }

    /**
     * Creates a name and email sample Table Model.
     *
     * @param includeDataRows if <code>false</code> there will be no data rows, otherwise yes.
     */
    private FlexTableModel createEmailSampleTableModel(boolean includeDataRows) {

        return new FlexTableModel() {
            public int getRowsPerPageCount() {
                return FlexTableModel.SHOW_ALL_ROWS_ON_ONE_PAGE;
            }

            public int getRowCount() {
                return 8;
            }

            public int getColumnCount() {
                return 4;  //To change body of implemented methods use File | Settings | File Templates.
            }

            public FlexColumnModel getColumnModel(final int columnIndex) {
                final String[] titles = {"First name", "Name", "Email", "Amount"};
                final String[] tooltips = {"The first name of this person.", null, "The email address of this person.", null};

                return new FlexColumnModel() {
                    public int getId() {
                        return columnIndex;
                    }

                    public String getTitle() {
                        return titles[columnIndex];
                    }

                    public String getTooltip() {
                        return tooltips[columnIndex];
                    }

                    public int getWidth() {
                        return 200;
                    }

                    public boolean isSortable() {
                        return false;
                    }

                    public String getAlign() {
                        return "left";
                    }

                    public boolean isHiddenByDefault() {
                        return false;  //To change body of implemented methods use File | Settings | File Templates.
                    }
                };
            }

            public String getValueAt(int rowIndex, int columnIndex) {
                switch (rowIndex) {
                    case 0:
                        return new String[]{"Bob", "Doe", "bob.doe@email.com", "100"}[columnIndex];
                    case 1:
                        return new String[]{"Bob", "Minelli", "lisa.minelli@email.com", "50"}[columnIndex];
                    case 2:
                        return new String[]{"Bob", "McDonald", "ronald.mcdonald@email.com", "200"}[columnIndex];
                    case 3:
                        return new String[]{"Thomas", "Eddison", "thomas@email.com", "400"}[columnIndex];
                    case 4:
                        return new String[]{"Bruce", "Willis", "bruce@email.com", "320"}[columnIndex];
                    case 5:
                        return new String[]{"Chuck", "Norris", "chuck@email.com", "8040"}[columnIndex];
                    case 6:
                        return new String[]{"Hulk", "Hogan", "bob@email.com", "100"}[columnIndex];
                    case 7:
                        return new String[]{"Bob", "Hump", "bob@email.com", "705"}[columnIndex];
                    default:
                        return "an error occurred";
                }

            }
        };
    }

    /**
     * Creates a sample Table Model.
     */
    private Object[] createNumbersTableModel(String digitDelimiter, String decimalDelimiter) {
        final Column[] columns =
                new Column[]{new Column(0, "Id", 50, true, "center", false),
                        new Column(1, "Description", 300, false, "left", false),
                        new Column(2, "Amount", 100, true, "right", false), new Column(3, "Ratio", 50, true, "right", false)};
        final Row[] rows1 =
                new Row[]{new Row(0, new String[]{"ISD", "International security domain", "250" + digitDelimiter + "000" + decimalDelimiter + "123", "1.5 %"}),
                        new Row(1, new String[]{"QBA", "Quality based Archivments", "580" + digitDelimiter + "000" + decimalDelimiter + "32"}),
                        new Row(2, new String[]{"UDO", "Universal data objects", "1" + digitDelimiter + "980" + digitDelimiter + "000", "2.4 %"}),
                        new Row(3, new String[]{"ZBI", "Zen business international", "9" + digitDelimiter + "870" + digitDelimiter + "000" + decimalDelimiter + "3345", "0.2 %"})};
        final Row[] rows2 =
                new Row[]{new Row(4, new String[]{"NOI", "No ordered index", "4" + digitDelimiter + "565" + digitDelimiter + "000", "7.9 %"}),
                        new Row(5, new String[]{"DGD", "Damn good doodle", "127" + digitDelimiter + "500", "8.2 %"}),
                        new Row(6, new String[]{"LOA", "The limited organizations", "12" + digitDelimiter + "000", "5.5 %"}),
                        new Row(7, new String[]{"XZU", "Xenomorph zulu", "8" + digitDelimiter + "800", "25.3 %"})};
        final int rowsCount = rows1.length + rows2.length;
        final Page[] pages = new Page[]{new Page(1, rowsCount, rows1), new Page(2, rowsCount, rows2)};
        return new Object[]{new TableModel(pages), new ColumnModel(columns)};
    }

    private class SimpleTableSortingChangeListener implements TableSortingChangeListener {
        private final FlexiGrid flexiGrid;

        public SimpleTableSortingChangeListener(FlexiGrid flexiGrid) {
            this.flexiGrid = flexiGrid;
        }

        public void sortingChange(TableSortingChangeEvent event) {
            if (!flexiGrid.getClientSorting()) {
                System.out.println("Sorting server side: " + event.getSortingModel());
                final SortingModel eventSortingModel = event.getSortingModel();
                final TableModel model = flexiGrid.getTableModel();
                // do some sorting here
                //TableModelSorter.sort(model, flexiGrid.getColumnModel(), eventSortingModel);

                flexiGrid.setSortingModel(eventSortingModel);
                flexiGrid.setTableModel(model);
            } else {
                System.out.println("Sorting client side: " + event.getSortingModel());
            }
        }
    }

    private class TestTableModel implements FlexTableModel {
        public int getRowsPerPageCount() {
            return 5;
        }

        public int getRowCount() {
            return 20;
        }

        public int getColumnCount() {
            return 3;
        }

        public FlexColumnModel getColumnModel(int columnIndex) {
            switch (columnIndex) {
                case 0:
                    return new TestColumModel("Spalte_0", 0);
                case 1:
                    return new TestColumModel("Spalte_1", 1);
                case 2:
                    return new TestColumModel("Spalte_2", 2);
                default:
                    return new TestColumModel("DEFAULT", 0);
            }
        }

        public String getValueAt(int rowIndex, int columnIndex) {
            // Just add some delay - a real application would call Database here
            try {
                Thread.sleep(50);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            return "Value for row:" + rowIndex + " col:" + columnIndex + " id:" + System.currentTimeMillis();
        }
    }

    private class TestColumModel implements FlexColumnModel {

        final String title;
        final int id;

        private TestColumModel(String title, int id) {
            this.title = title;
            this.id = id;
        }

        public int getId() {
            return id;
        }

        public String getTitle() {
            return title;
        }

        public String getTooltip() {
            return null;
        }

        public int getWidth() {
            return 200;
        }

        public boolean isSortable() {
            return true;
        }

        public String getAlign() {
            return "left";
        }

        public boolean isHiddenByDefault() {
            return false;
        }
    }
}
