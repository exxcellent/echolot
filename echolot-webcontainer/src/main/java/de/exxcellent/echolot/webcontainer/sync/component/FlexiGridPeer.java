/*
 * This file (FlexiGridPeer.java) is part of the Echolot Project (hereinafter "Echolot").
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

package de.exxcellent.echolot.webcontainer.sync.component;

import com.thoughtworks.xstream.XStream;
import com.thoughtworks.xstream.io.json.JettisonMappedXmlDriver;
import com.thoughtworks.xstream.io.json.JsonHierarchicalStreamDriver;
import de.exxcellent.echolot.SharedService;
import de.exxcellent.echolot.app.FlexiGrid;
import de.exxcellent.echolot.model.*;
import nextapp.echo.app.Component;
import nextapp.echo.app.util.Context;
import nextapp.echo.webcontainer.AbstractComponentSynchronizePeer;
import nextapp.echo.webcontainer.ContentType;
import nextapp.echo.webcontainer.ServerMessage;
import nextapp.echo.webcontainer.Service;
import nextapp.echo.webcontainer.WebContainerServlet;
import nextapp.echo.webcontainer.service.JavaScriptService;

/**
 * A specialized {@link AbstractComponentSynchronizePeer} initializing the libraries for the {@link de.exxcellent.echolot.app.FlexiGrid} component
 * and responsible for transport of the properties to the javascript based echo3 client.
 *
 * @author Oliver Pehnke <o.pehnke@exxcellent.de>
 */
public class FlexiGridPeer extends AbstractComponentSynchronizePeer {

    // Create a JavaScriptServices containing the FlexiGrid and FlexiGrid JavaScript code.
    private static final Service FLEXIGRID_SERVICE;
    private static final Service FLEXIGRID_SYNC_SERVICE;

    private static final String FLEXIGRID_STYLESHEET;

    /**
     * The serializer used to serialize model instances.
     */
    protected static final XStream xstreamOut;
    protected static final XStream xstreamIn;

    static {
        FLEXIGRID_SERVICE = JavaScriptService.forResource("exxcellent.FlexiGridService",
                "js/flexigrid/flexigrid.js");
        FLEXIGRID_SYNC_SERVICE = JavaScriptService.forResource("exxcellent.FlexiGrid.Sync",
                "js/Sync.FlexiGrid.js");

        FLEXIGRID_STYLESHEET = "js/flexigrid/css/flexigrid/";

        /* Register JavaScriptService with the global service registry.*/
        WebContainerServlet.getServiceRegistry().add(FLEXIGRID_SERVICE);
        WebContainerServlet.getServiceRegistry().add(FLEXIGRID_SYNC_SERVICE);

        WebContainerServlet.getResourceRegistry().addPackage("FlexiGridStylesheet", FLEXIGRID_STYLESHEET);
        WebContainerServlet.getResourceRegistry().add("FlexiGridStylesheet", "flexigrid.css", ContentType.TEXT_CSS);

        /* JSON Stream Driver */
        xstreamOut = new XStream(new JsonHierarchicalStreamDriver());
        xstreamOut.alias("tableModel", TableModel.class);
        xstreamOut.alias("columnModel", ColumnModel.class);
        xstreamOut.alias("column", Column.class);
        xstreamOut.aliasField("name", Column.class, "id");

        xstreamOut.alias("row", Row.class);
        xstreamOut.alias("page", Page.class);
        xstreamOut.alias("activePage", Page.class);
        xstreamOut.alias("resultsPerPageOption", ResultsPerPageOption.class);
        xstreamOut.alias("sortingModel", SortingModel.class);
        xstreamOut.alias("sortingColumn", SortingColumn.class);

        xstreamOut.processAnnotations(TableModel.class);
        xstreamOut.processAnnotations(ColumnModel.class);
        xstreamOut.processAnnotations(Column.class);
        xstreamOut.processAnnotations(Row.class);
        xstreamOut.processAnnotations(Page.class);
        xstreamOut.processAnnotations(ResultsPerPageOption.class);
        xstreamOut.processAnnotations(SortingModel.class);
        xstreamOut.processAnnotations(SortingColumn.class);


        xstreamIn = new XStream(new JettisonMappedXmlDriver());
        xstreamIn.alias("rowSelection", RowSelection.class);
        xstreamIn.alias("columnVisibility", ColumnVisibility.class);
        xstreamIn.alias("sortingModel", SortingModel.class);
        xstreamIn.alias("sortingColumn", SortingColumn.class);

        xstreamIn.processAnnotations(RowSelection.class);
        xstreamIn.processAnnotations(ColumnVisibility.class);
        xstreamIn.processAnnotations(SortingModel.class);
        xstreamIn.processAnnotations(SortingColumn.class);
        xstreamIn.setMode(XStream.NO_REFERENCES);

    }

    /**
     * Default constructor for a {@link FlexiGridPeer}. Registers an event peer for client events.
     */
    public FlexiGridPeer() {
        addEvent(new EventPeer(FlexiGrid.INPUT_TABLE_ROW_SELECT,
                FlexiGrid.TABLE_ROWSELECT_LISTENERS_CHANGED_PROPERTY,
                String.class) {
            @Override
            public boolean hasListeners(Context context, Component c) {
                return ((FlexiGrid) c).hasTableRowSelectListeners();
            }

            @Override
            public void processEvent(Context context, Component component, Object eventData) {
                final FlexiGrid flexigrid = (FlexiGrid) component;
                final String jsonMessage = (String) eventData;

                /**
                 * <pre>
                 * Parse input JSON message:
                 * {"rowSelection": {
                 *  "rowId": 1
                 * }}
                 * </pre>
                 */
                try {
                    final RowSelection rowSelection = (RowSelection) xstreamIn.fromXML(jsonMessage);
                    flexigrid.userTableRowSelect(rowSelection);
                } catch (NumberFormatException e) {
                    throw new RuntimeException("Could not unmarshall rowSelection from JSON msg: '" + jsonMessage + "'", e);
                }
            }
        });

        // ---
        addEvent(new EventPeer(FlexiGrid.INPUT_ACTIVE_PAGE_CHANGED,
                FlexiGrid.TABLE_ROWSELECT_LISTENERS_CHANGED_PROPERTY,
                Integer.class) {
            @Override
            public boolean hasListeners(Context context, Component c) {
                return true;
            }

            @Override
            public void processEvent(Context context, Component component, Object eventData) {
                final FlexiGrid flexigrid = (FlexiGrid) component;
                final Integer data = (Integer) eventData;

                flexigrid.setActivePage(data);
            }
        });

        // ---
        addEvent(new EventPeer(FlexiGrid.INPUT_TABLE_COLUMN_TOGGLE,
                FlexiGrid.TABLE_COLUMNTOGGLE_LISTENERS_CHANGED_PROPERTY, String.class) {
            @Override
            public boolean hasListeners(Context context, Component c) {
                return ((FlexiGrid) c).hasTableColumnToggleListeners();
            }

            @Override
            public void processEvent(Context context, Component component, Object eventData) {
                final FlexiGrid flexigrid = (FlexiGrid) component;
                final String jsonMessage = (String) eventData;

                /**
                 * <pre>
                 * {"columnVisibility": {
                 *      "columnId": 0,
                 *      "visible": true
                 * }}
                 * </pre>
                 */
                try {
                    final ColumnVisibility columnToggle = (ColumnVisibility) xstreamIn.fromXML(jsonMessage);
                    flexigrid.userTableColumnToggle(columnToggle);
                } catch (NumberFormatException e) {
                    throw new RuntimeException("Could not unmarshall columnVisibility from JSON msg: '" + jsonMessage + "'", e);
                }
            }

        });
        addEvent(new EventPeer(FlexiGrid.INPUT_TABLE_SORTING_CHANGE,
                FlexiGrid.TABLE_COLUMNTOGGLE_LISTENERS_CHANGED_PROPERTY, String.class) {
            @Override
            public boolean hasListeners(Context context, Component c) {
                return ((FlexiGrid) c).hasTableSortingChangeListeners();
            }

            @Override
            public void processEvent(Context context, Component component, Object eventData) {
                final FlexiGrid flexigrid = (FlexiGrid) component;
                final String jsonMessage = (String) eventData;
                /**
                 * <pre>
                 * {"sortingModel": {
                 *      "columns": {
                 *        "sortingColumn" : [{
                 *              "columnId": 0,
                 *              "sortOrder": "asc"
                 *          },
                 *          {
                 *           "columnId": 1,
                 *           "sortOrder": "desc"
                 *          }
                 *        }]
                 *   }}
                 * </pre>
                 */
                try {
                    final SortingModel aSortingModel = (SortingModel) xstreamIn.fromXML(jsonMessage);
                    flexigrid.setSortingModel(aSortingModel);
                    flexigrid.userTableSortingChange(aSortingModel);
                    super.processEvent(context, flexigrid, aSortingModel);
                } catch (NumberFormatException e) {
                    throw new RuntimeException("Could not unmarshall sortingModel from JSON msg== '" + jsonMessage + "'", e);
                }
            }
        });
    }

    public String getClientComponentType(boolean shortType) {
        // Return client-side component type name.
        return "exxcellent.FlexiGrid";
    }

    /**
     * @inheritDoc
     */
    @Override
    public Class getComponentClass() {
        // Return server-side Java class.
        return FlexiGrid.class;
    }

    /**
     * @inheritDoc
     */
    @Override
    public void init(Context context, Component component) {
        super.init(context, component);
        // Obtain outgoing 'ServerMessage' for initial render.
        ServerMessage serverMessage = (ServerMessage) context.get(ServerMessage.class);
        serverMessage.addLibrary(SharedService.ECHOCOMPONENTS_SERVICE.getId());
        serverMessage.addLibrary(SharedService.JQUERY_SERVICE.getId());
        // Add FlexiGrid JavaScript library to client.
        serverMessage.addLibrary(FLEXIGRID_SERVICE.getId());
        serverMessage.addLibrary(FLEXIGRID_SYNC_SERVICE.getId());
    }

    /**
     * Over-ridden to handle requests for the {@link de.exxcellent.echolot.app.FlexiGrid} properties. The collection of tag instances are serialised
     * as a JSON stucture.
     *
     * @see nextapp.echo.webcontainer.ComponentSynchronizePeer#getOutputProperty(Context, Component, String, int)
     */
    @Override
    public Object getOutputProperty(final Context context,
                                    final Component component, final String propertyName,
                                    final int propertyIndex) {

        if (FlexiGrid.PROPERTY_TABLEMODEL.equals(propertyName)) {
            return xstreamOut.toXML(((FlexiGrid) component).getTableModel());
        } else if (FlexiGrid.PROPERTY_ACTIVE_PAGE.equals(propertyName)) {
            return xstreamOut.toXML(((FlexiGrid) component).getActivePage());
        } else if (FlexiGrid.PROPERTY_COLUMNMODEL.equals(propertyName)) {
            return xstreamOut.toXML(((FlexiGrid) component).getColumnModel());
        } else if (FlexiGrid.PROPERTY_RESULTS_PPAGE_OPTION.equals(propertyName)) {
            return xstreamOut.toXML(((FlexiGrid) component).getResultsPerPageOption());
        } else if (FlexiGrid.PROPERTY_SORTINGMODEL.equals(propertyName)) {
            return xstreamOut.toXML(((FlexiGrid) component).getSortingModel());
        }
        return super.getOutputProperty(context, component, propertyName, propertyIndex);
    }
}