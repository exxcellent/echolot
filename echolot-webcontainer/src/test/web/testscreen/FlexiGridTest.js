/*
 * This file (FlexiGridTest.js) is part of the Echolot Project (hereinafter "Echolot").
 * Copyright (C) 2008-2011 eXXcellent Solutions GmbH.
 *
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 */

/**
 * A test class for the FlexiGrid.js
 *
 * @author Oliver Pehnke
 * @version $Id: FlexiGridTest.js
 */
exxcellent.test.FlexiGridTest = Core.extend(
        {
            _flexiGrid: null,
            _mainContent: null,
            _windowCount: null,

            $construct: function(testArea, mainContent) {
                this._mainContent = mainContent;

                var self = this;
                var controlColumn = new Echo.Column({
                            styleName: "TestControl",
                            children:[
                                new Echo.Label({
                                            text: "Flexigrid", styleName: "Title"
                                        }),
                                new Echo.Label({
                                            text: "Tablemodels", styleName: "Default"
                                        }),
                                this._createButton("Empty", this._setEmptyModel),
                                this._createButton("Multiplication 30*50", this._setMultiplicationModel),
                                this._createButton("Reverse 30*50", this._setReverseMultiplicationModel),
                                this._createButton("Email", this._setEmailModel),
                                new Echo.Label({
                                            text: "Misc", styleName: "Default"
                                        }),
                                this._createButton("MessagePageStatistics='Test'",
                                        function(event) {
                                            self._setMessagePageStatistics(event, "Test");
                                        }
                                ),
                                this._createButton("Open Window",
                                        function() {
                                            testArea.add(new exxcellent.test.FlexiGridTestDialog(
                                                    self._createFlexiGrid('C.flex' + self._windowCount++)));
                                        }
                                )
                            ]
                        });
                this._flexiGrid = this._createFlexiGrid('C.flexi');
                var splitPane = new Echo.SplitPane({
                            styleName: "TestControl",
                            children: [
                                controlColumn,
                                new Echo.Column({
                                            styleName: "TestArea",
                                            children: [this._flexiGrid]
                                        })
                            ]
                        });

                testArea.add(splitPane);

                // set the initial focus on the flexigrid (lazy focus after processing)
                testApp.setFocusedComponent(this._flexiGrid);
            },

            _createFlexiGrid: function(id) {
                var model = this._createEmailModel(30, 50);
                var fg = new exxcellent.FlexiGrid({
                            renderId: id,
                            styleName: "Default",
                            minColumnWidth: 20,
                            minColumnHeight: 100,
                            columnWidthUnit: 'px',
                            title: "Test Flexigrid",
                            pageStatisticsMessage: 'Displaying {total} items',
                            showTableToggle: true,
                            tableModel: model.tableModel,
                            activePage: model.tableModel.pages[0],
                            columnModel: model.columnModel,
                            showPager : true,
                            showPageStatistics: true,
                            resizable : false,
                            striped : true,
                            noWrap: true,
                            showResultsPerPage : false,
                            resultsPerPageOption: new exxcellent.model.ResultsPerPageOption(4, [4]),
                            singleSelect: true,
                            debug: true,
                            clientSorting: false,

                            background: "#005555",
                            backgroundColor: "#ff0044",

                            sortingModel: this._createEmptySortingModel(),
                            events: {
                                tableRowSelect: Core.method(this, this._dummyAction),
                                tableColumnToggle: Core.method(this, this._dummyAction),
                                tableSortingChange: Core.method(this, this._dummyAction),
                                tableColumnArrange: Core.method(this, this._dummyAction),
                                tableColumnResize: Core.method(this, this._dummyAction),
                                tableResize: Core.method(this, this._dummyAction)
                            }
                        });
                fg.set(exxcellent.FlexiGrid.CLIENT_SORTING, false);
                return fg;
            },

            _createEmptySortingModel: function() {
                return new exxcellent.model.SortingModel(new Array());
            },

            _createOneColumnSortingModel: function(columnId, sortOrder) {
                var sortModel = new exxcellent.model.SortingModel(new Array(
                        new exxcellent.model.SortingColumn(columnId, sortOrder)
                ));
                if (window.console) {
                    console.log('Sorting model: ' + sortModel.toString());
                }
                return sortModel;
            },

            _dummyAction: function(event) {
                if (event && window.console) {
                    console.log("Action triggered event: " + event.type + " data: " + event.data);
                }
                this._mainContent.showMsg("Action triggered!", event.type + " data: " + event.data);
                return false;
            },

            _createButton: function(label, action) {
                return new Echo.Button({
                            text: label,
                            styleName: "Default",
                            events: {
                                action: Core.method(this, action)
                            }
                        })
            },

            _setEmptyModel : function(event) {
                if (event && window.console) {
                    console.log("Update model triggered event: " + event.type + " data: " + event.data);
                }
                var sortingModel = this._createEmptySortingModel();
                var model = this._createEmptyTableModel();
                //this._flexiGrid.set(exxcellent.FlexiGrid.SORTINGMODEL, sortingModel);
                this._flexiGrid.set(exxcellent.FlexiGrid.TABLEMODEL, model.tableModel);
                //this._flexiGrid.set(exxcellent.FlexiGrid.COLUMNMODEL, model.columnModel);
                testApp.setFocusedComponent(this._flexiGrid);
            },

            _setMultiplicationModel : function(event) {
                if (event && window.console) {
                    console.log("Update model triggered event: " + event.type + " data: " + event.data);
                }
                var sortingModel = this._createOneColumnSortingModel(1, 'desc');
                var model = this._createMultiplicationTableModel(30, 50);
                this._flexiGrid.set(exxcellent.FlexiGrid.SORTINGMODEL, sortingModel);
                this._flexiGrid.set(exxcellent.FlexiGrid.TABLEMODEL, model.tableModel);
                this._flexiGrid.set(exxcellent.FlexiGrid.COLUMNMODEL, model.columnModel);
                testApp.setFocusedComponent(this._flexiGrid);
            },

            _setReverseMultiplicationModel : function(event) {
                if (event && window.console) {
                    console.log("Update model triggered event: " + event.type + " data: " + event.data);
                }
                //var sortingModel = this._createOneColumnSortingModel(1, 'desc');
                var model = this.createReverseMultiplicationTableModel(30, 50);
                //this._flexiGrid.set(exxcellent.FlexiGrid.SORTINGMODEL, sortingModel);
                this._flexiGrid.set(exxcellent.FlexiGrid.TABLEMODEL, model.tableModel);
                //this._flexiGrid.set(exxcellent.FlexiGrid.COLUMNMODEL, model.columnModel);
                testApp.setFocusedComponent(this._flexiGrid);
            },

            _setEmailModel : function(event) {
                if (event && window.console) {
                    console.log("Update model triggered event: " + event.type + " data: " + event.data);
                }
                var sortingModel = this._createEmptySortingModel();
                var model = this._createEmailModel();
                this._flexiGrid.set(exxcellent.FlexiGrid.SORTINGMODEL, sortingModel);
                this._flexiGrid.set(exxcellent.FlexiGrid.TABLEMODEL, model.tableModel);
                this._flexiGrid.set(exxcellent.FlexiGrid.COLUMNMODEL, model.columnModel);
                testApp.setFocusedComponent(this._flexiGrid);
            },

            /**
             * Creates a table model with email addresses etc.
             */
            _createEmailModel: function() {
                var columns = [
                    new exxcellent.model.Column(5, "First name", 100, true, "left", "The first name of the user"),
                    new exxcellent.model.Column(10, "Name", 100, true, "center", "The name of the user"),
                    new exxcellent.model.Column(15, "Email", 200, true, "right", "The email address of the user"),
                    new exxcellent.model.Column(20, "Amount", 100, true, "right", "The critical amount of the user")
                ];
                var rows = [
                    new exxcellent.model.Row(5, ["Bob", "Doe", "bob.doe@email.com", "10.000"]),
                    new exxcellent.model.Row(10, ["Bob", "Minelli", "lisa.minelli@email.com", "200.000.000,5578"]),
                    new exxcellent.model.Row(15, ["Bob", "<b>McDonald</b>Hello", "ronald.mcdonald@email.com", "10.050,345"]),
                    new exxcellent.model.Row(20, ["Clark", "Kent", "clark.kent@email.com", "5.000,3"]),
                    new exxcellent.model.Row(25, ["Chuck", "Norris", "chuck.norris@email.com", "20,5567"]),
                    new exxcellent.model.Row(30, ["Paul", "Evans", "paul@email.com", "120"]),
                    new exxcellent.model.Row(35, ["Steven", "Norton", "steven@email.com", "200"]),
                    new exxcellent.model.Row(40, ["Martin", "Adams", "martin@email.com", "325"])
                ];
                var pages = [
                    new exxcellent.model.Page(1, rows.length, rows)
                ];
                return {
                    tableModel:new exxcellent.model.TableModel(pages),
                    columnModel: new exxcellent.model.ColumnModel(columns)
                };
            },

            /**
             * Creates a complex multiplication model.
             */
            _createMultiplicationTableModel: function(columnCount, rowCount) {
                var columns = [];
                var rows = [];
                var i,j;
                for (i = 0; i < columnCount; i++) {
                    columns[i] = new exxcellent.model.Column(i + 1, i + 1, 25, true, "left", null);
                }
                for (i = 0; i < rowCount; i++) {
                    var cellValue = new Array();
                    for (j = 0; j < columns.length; j++) {
                        cellValue[j] = ((j + 1) * (i + 1));
                    }
                    rows[i] = new exxcellent.model.Row(i, cellValue);
                }
                var pages = [
                    new exxcellent.model.Page(1, rowCount, rows)];

                return {
                    tableModel: new exxcellent.model.TableModel(pages),
                    columnModel: new exxcellent.model.ColumnModel(columns)
                };
            },

            /**
             * Creates a complex multiplication model.
             */
            createReverseMultiplicationTableModel: function(columnCount, rowCount) {
                var columns = [];
                var rows = [];
                var i,j;
                for (i = 0; i < columnCount; i++) {
                    columns[i] = new exxcellent.model.Column(i + 1, columnCount - i, 25, true, "left", null);
                }
                for (i = 0; i < rowCount; i++) {
                    var cellValue = new Array();
                    for (j = 0; j < columns.length; j++) {
                        cellValue[j] = ((columnCount - j) * (columnCount - i));
                    }
                    rows[i] = new exxcellent.model.Row(i, cellValue);
                }
                var pages = [
                    new exxcellent.model.Page(1, rowCount, rows)];

                return {
                    tableModel: new exxcellent.model.TableModel(pages),
                    columnModel: new exxcellent.model.ColumnModel(columns)
                };
            },

            _createEmptyTableModel : function() {
                // this model reflects the issue https://www.exxcellent.de/jira/browse/PENG-323
                var columns = [
                    new exxcellent.model.Column(5, "First name", 100, true, "left", "The first name of the user"),
                    new exxcellent.model.Column(10, "Name", 100, true, "center", "The name of the user"),
                    new exxcellent.model.Column(15, "Email", 200, true, "right", "The email address of the user"),
                    new exxcellent.model.Column(20, "Amount", 100, true, "right", "The critical amount of the user")
                ];
                var rows = [];
                var pages = [
                    new exxcellent.model.Page(1, rows.length, rows)];

                return {
                    tableModel: new exxcellent.model.TableModel(pages)//,
                    //columnModel: new exxcellent.model.ColumnModel(columns)
                };
            },

            _setMessagePageStatistics : function(event, text) {
                if (event && window.console) {
                    console.log("event: " + event.type + " data: " + event.data);
                }

                this._flexiGrid.set(exxcellent.FlexiGrid.PAGE_STATISTICS_MSG, text);
                testApp.setFocusedComponent(this._flexiGrid);
            }
        });

exxcellent.test.FlexiGridTestDialog = Core.extend(Echo.WindowPane, {

            $construct: function(content) {
                Echo.WindowPane.call(this, {
                            styleName: "Default",
                            width: "600px",
                            height: "350px",
                            title: "The grid in a window",
                            iconInsets: "6px 10px",
                            icon: "image/icon/Icon16About.png",
                            modal: false,
                            closable: true,
                            events: {
                                close: function(e) {
                                    e.source.parent.remove(e.source);
                                }
                            },
                            children: [
                                new Echo.ContentPane({
                                            backgroundImage: {
                                                url: "image/fill/tree-bg.png",
                                                y: -135
                                            },
                                            children: [
                                                new Echo.Grid({
                                                            size: 1,
                                                            insets: "5px",
                                                            cellSpacing: 10,
                                                            children: [
                                                                new Echo.Label({
                                                                            text: "Just some window content."
                                                                        }),
                                                                content,
                                                                new Echo.Label({
                                                                            text: "More window content."
                                                                        })
                                                            ]
                                                        })
                                            ]
                                        })
                            ]
                        });
            }
        });