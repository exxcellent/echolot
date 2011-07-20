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
        controlsColumn.addButton("Update with Empty Rows", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                flexiGrid.setFlexTableModel(createEmailSampleTableModel(false));
            }
        });
        controlsColumn.addButton("Set Numbers Table Model (','= DIGIT-Delimiter '.'= DecimalDelimiter", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                flexiGrid.setFlexTableModel(createNumbersTableModel(",", "."));
            }
        });
        controlsColumn.addButton("Set Numbers Table Model ('.'= DIGIT-Delimiter ','= DecimalDelimiter", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                flexiGrid.setFlexTableModel(createNumbersTableModel(".", ","));
            }
        });
        controlsColumn.addButton("Clear Model (null)", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                flexiGrid.setSortingModel(null);
                flexiGrid.setFlexTableModel(null);
            }
        });
        controlsColumn.addButton("Set Multiplication Model (2*2)", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                flexiGrid.setFlexTableModel(createMultiplicationTableModel(2, 2));
            }
        });
        controlsColumn.addButton("Set Multiplication Model (30*50)", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                final long timeA = System.currentTimeMillis();
                flexiGrid.setFlexTableModel(createMultiplicationTableModel(30, 50));
                final long timeB = System.currentTimeMillis();
                String msg = "Model created in " + String.valueOf(timeB - timeA) + " ms";
                System.out.println(msg);
            }
        });
        controlsColumn.addButton("Set Multiplication Model (50*250)", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                flexiGrid.setFlexTableModel(createMultiplicationTableModel(50, 250));
            }
        });

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

    /**
     * Creates a complex multiplication model.
     */
    private FlexTableModel createMultiplicationTableModel(final int columnCount, final int rowCount) {
        return new FlexTableModel() {
            /**
             * {@inheritDoc}
             */
            public int getRowsPerPageCount() {
                return FlexTableModel.SHOW_ALL_ROWS_ON_ONE_PAGE;
            }

            /**
             * {@inheritDoc}
             */
            public int getRowCount() {
                return rowCount;
            }

            /**
             * {@inheritDoc}
             */
            public int getColumnCount() {
                return columnCount;
            }

            /**
             * {@inheritDoc}
             */
            public FlexColumnModel getColumnModel(final int columnIndex) {
                return new FlexColumnModel() {

                    /**
                     * {@inheritDoc}
                     */
                    public int getId() {
                        return columnIndex;
                    }

                    /**
                     * {@inheritDoc}
                     */
                    public String getTitle() {
                        return String.valueOf(columnIndex + 1);
                    }

                    /**
                     * {@inheritDoc}
                     */
                    public String getTooltip() {
                        return null;
                    }

                    /**
                     * {@inheritDoc}
                     */
                    public int getWidth() {
                        return 25;
                    }

                    /**
                     * {@inheritDoc}
                     */
                    public boolean isSortable() {
                        return false;
                    }

                    /**
                     * {@inheritDoc}
                     */
                    public String getAlign() {
                        return "left";
                    }

                    /**
                     * {@inheritDoc}
                     */
                    public boolean isHiddenByDefault() {
                        return false;
                    }
                };
            }

            /**
             * {@inheritDoc}
             */
            public String getValueAt(int rowIndex, int columnIndex) {
                return String.valueOf((rowIndex + 1) * (columnIndex + 1));
            }
        };
    }

    /**
     * Creates a name and email sample Table Model.
     *
     * @param includeDataRows if <code>false</code> there will be no data rows, otherwise yes.
     */
    private FlexTableModel createEmailSampleTableModel(final boolean includeDataRows) {

        return new FlexTableModel() {
            /**
             * {@inheritDoc}
             */
            public int getRowsPerPageCount() {
                return FlexTableModel.SHOW_ALL_ROWS_ON_ONE_PAGE;
            }

            /**
             * {@inheritDoc}
             */
            public int getRowCount() {
                return 8;
            }

            /**
             * {@inheritDoc}
             */
            public int getColumnCount() {
                return 4;
            }

            /**
             * {@inheritDoc}
             */
            public FlexColumnModel getColumnModel(final int columnIndex) {
                final String[] titles = {"First name", "Name", "Email", "Amount"};
                final String[] tooltips = {"The first name of this person.", null, "The email address of this person.", null};

                return new FlexColumnModel() {

                    /**
                     * {@inheritDoc}
                     */
                    public int getId() {
                        return columnIndex;
                    }

                    /**
                     * {@inheritDoc}
                     */
                    public String getTitle() {
                        return titles[columnIndex];
                    }

                    /**
                     * {@inheritDoc}
                     */
                    public String getTooltip() {
                        return tooltips[columnIndex];
                    }

                    /**
                     * {@inheritDoc}
                     */
                    public int getWidth() {
                        return 200;
                    }

                    /**
                     * {@inheritDoc}
                     */
                    public boolean isSortable() {
                        return false;
                    }

                    /**
                     * {@inheritDoc}
                     */
                    public String getAlign() {
                        return "left";
                    }

                    /**
                     * {@inheritDoc}
                     */
                    public boolean isHiddenByDefault() {
                        return false;
                    }
                };
            }

            /**
             * {@inheritDoc}
             */
            public String getValueAt(int rowIndex, int columnIndex) {
                if (!includeDataRows) {
                    // if no data should be displayed we just return NULL
                    return null;
                }
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
    private FlexTableModel createNumbersTableModel(final String digitDelimiter, final String decimalDelimiter) {

        // create FlexTableModel
        return new FlexTableModel() {
            /**
             * {@inheritDoc}
             */
            public int getRowsPerPageCount() {
                return 4;
            }

            /**
             * {@inheritDoc}
             */
            public int getRowCount() {
                return 8;
            }

            /**
             * {@inheritDoc}
             */
            public int getColumnCount() {
                return 3;
            }

            /**
             * {@inheritDoc}
             */
            public FlexColumnModel getColumnModel(final int columnIndex) {
                final String[] titles = {"ID", "Description", "Amount"};

                return new FlexColumnModel() {

                    /**
                     * {@inheritDoc}
                     */
                    public int getId() {
                        return columnIndex;
                    }

                    /**
                     * {@inheritDoc}
                     */
                    public String getTitle() {
                        return titles[columnIndex];
                    }

                    /**
                     * {@inheritDoc}
                     */
                    public String getTooltip() {
                        return null;
                    }

                    /**
                     * {@inheritDoc}
                     */
                    public int getWidth() {
                        return 150;
                    }

                    /**
                     * {@inheritDoc}
                     */
                    public boolean isSortable() {
                        return false;
                    }

                    /**
                     * {@inheritDoc}
                     */
                    public String getAlign() {
                        return "left";
                    }

                    /**
                     * {@inheritDoc}
                     */
                    public boolean isHiddenByDefault() {
                        return false;
                    }
                };
            }

            /**
             * {@inheritDoc}
             */
            public String getValueAt(int rowIndex, int columnIndex) {
                switch (rowIndex) {
                    case 0:
                        return new String[]{"ISD", "International security domain", "250" + digitDelimiter + "000" + decimalDelimiter + "123", "1.5 %"}[columnIndex];
                    case 1:
                        return new String[]{"QBA", "Quality based Archivments", "580" + digitDelimiter + "000" + decimalDelimiter + "32"}[columnIndex];
                    case 2:
                        return new String[]{"UDO", "Universal data objects", "1" + digitDelimiter + "980" + digitDelimiter + "000", "2.4 %"}[columnIndex];
                    case 3:
                        return new String[]{"ZBI", "Zen business international", "9" + digitDelimiter + "870" + digitDelimiter + "000" + decimalDelimiter + "3345", "0.2 %"}[columnIndex];
                    case 4:
                        return new String[]{"NOI", "No ordered index", "4" + digitDelimiter + "565" + digitDelimiter + "000", "7.9 %"}[columnIndex];
                    case 5:
                        return new String[]{"DGD", "Damn good doodle", "127" + digitDelimiter + "500", "8.2 %"}[columnIndex];
                    case 6:
                        return new String[]{"LOA", "The limited organizations", "12" + digitDelimiter + "000", "5.5 %"}[columnIndex];
                    case 7:
                        return new String[]{"XZU", "Xenomorph zulu", "8" + digitDelimiter + "800", "25.3 %"}[columnIndex];
                    default:
                        return "an error occurred";
                }

            }

        };

    }

    private static class SimpleTableSortingChangeListener implements TableSortingChangeListener {
        private static final long serialVersionUID = 7006241129061387471L;
        private final FlexiGrid flexiGrid;

        public SimpleTableSortingChangeListener(FlexiGrid flexiGrid) {
            this.flexiGrid = flexiGrid;
        }

        public void sortingChange(TableSortingChangeEvent event) {
            if (!flexiGrid.getClientSorting()) {
                System.out.println("Sorting server side: " + event.getSortingModel());
                // do some sorting here
            } else {
                System.out.println("Sorting client side: " + event.getSortingModel());
            }
        }

    }

    /**
     * Just some simple FlexTableModel
     */
    private class TestTableModel implements FlexTableModel {

        /**
         * {@inheritDoc}
         */
        public int getRowsPerPageCount() {
            return 5;
        }

        /**
         * {@inheritDoc}
         */
        public int getRowCount() {
            return 20;
        }

        /**
         * {@inheritDoc}
         */
        public int getColumnCount() {
            return 3;
        }

        /**
         * {@inheritDoc}
         */
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

        /**
         * {@inheritDoc}
         */
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

    /**
     * Just some simple ColumnModel
     */
    private class TestColumModel implements FlexColumnModel {

        final String title;
        final int id;

        /**
         * C'tor
         *
         * @param title the title of the column
         * @param id    the id of the column
         */
        private TestColumModel(String title, int id) {
            this.title = title;
            this.id = id;
        }

        /**
         * {@inheritDoc}
         */
        public int getId() {
            return id;
        }

        /**
         * {@inheritDoc}
         */
        public String getTitle() {
            return title;
        }

        /**
         * {@inheritDoc}
         */
        public String getTooltip() {
            return null;
        }

        /**
         * {@inheritDoc}
         */
        public int getWidth() {
            return 200;
        }

        /**
         * {@inheritDoc}
         */
        public boolean isSortable() {
            return true;
        }

        /**
         * {@inheritDoc}
         */
        public String getAlign() {
            return "left";
        }

        /**
         * {@inheritDoc}
         */
        public boolean isHiddenByDefault() {
            return false;
        }
    }
}
