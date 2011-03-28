/*
 * This file (LineChartPeer.java) is part of the Echolot Project (hereinafter "Echolot").
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
import com.thoughtworks.xstream.io.json.JsonHierarchicalStreamDriver;
import de.exxcellent.echolot.SharedService;
import de.exxcellent.echolot.app.LineChart;
import de.exxcellent.echolot.model.AxisModel;
import de.exxcellent.echolot.model.LineChartModel;
import de.exxcellent.echolot.model.LineChartPoint;
import nextapp.echo.app.Component;
import nextapp.echo.app.util.Context;
import nextapp.echo.webcontainer.AbstractComponentSynchronizePeer;
import nextapp.echo.webcontainer.ServerMessage;
import nextapp.echo.webcontainer.Service;
import nextapp.echo.webcontainer.WebContainerServlet;
import nextapp.echo.webcontainer.service.JavaScriptService;

/**
 * Peer-Class for a LineChart
 *
 * @author Ralf Enderle
 * @version 1.0
 */
public class LineChartPeer extends AbstractComponentSynchronizePeer {

    // RAPHAEL-Service
    public static final Service RAPHAEL_SERVICE;
    public static final Service RAPHAEL_POPUP_SERVICE;
    public static final Service RAPHAEL_EXX_SERVICE;
    public static final Service RAPHAEL_EXX_LINECHART_SERVICE;

    // LineChart Srevice
    private static final Service LINECHART_SYNC_SERVICE;

    /**
     * The serializer used to serialize model instances.
     */
    protected static final XStream xstream;

    static {
        // Raphael
        RAPHAEL_SERVICE = JavaScriptService.forResource("raphael", "js/raphael/raphael.js");
        RAPHAEL_POPUP_SERVICE = JavaScriptService.forResource("raphael.popup", "js/raphael/popup.raphael.js");
        RAPHAEL_EXX_SERVICE = JavaScriptService.forResource("raphael.exx", "js/raphael/exx.raphael.js");
        RAPHAEL_EXX_LINECHART_SERVICE = JavaScriptService.forResource("raphael.exx.linechart", "js/raphael/exx.linechart.js");

        // LineChart
        LINECHART_SYNC_SERVICE = JavaScriptService.forResource("exxcellent.LineChart.Sync",
                "js/Sync.LineChart.js");

        /* Register JavaScriptService with the global service registry.*/
        WebContainerServlet.getServiceRegistry().add(RAPHAEL_SERVICE);
        WebContainerServlet.getServiceRegistry().add(RAPHAEL_POPUP_SERVICE);
        WebContainerServlet.getServiceRegistry().add(RAPHAEL_EXX_SERVICE);
        WebContainerServlet.getServiceRegistry().add(RAPHAEL_EXX_LINECHART_SERVICE);

        WebContainerServlet.getServiceRegistry().add(LINECHART_SYNC_SERVICE);

        /* JSON Stream Driver */
        xstream = new XStream(new JsonHierarchicalStreamDriver());
        xstream.processAnnotations(LineChartModel.class);
        xstream.processAnnotations(LineChartPoint.class);
        xstream.processAnnotations(AxisModel.class);
    }

    /**
     * Constructor
     */
    public LineChartPeer() {
        super();
        addEvent(new EventPeer(LineChart.INPUT_POINT_SELECTION,
                LineChart.POINTSELECT_LISTENERS_CHANGED_PROPERTY, String.class) {
            public boolean hasListeners(Context context, Component c) {
                return ((LineChart) c).hasPointSelectListeners();
            }
        });
    }

    /**
     * Returns the clientComponentType
     * @param shortType
     * @return - the shortName
     */
    public String getClientComponentType(boolean shortType) {
        // Return client-side component type name.
        return "exxcellent.LineChart";
    }

    /**
     * @inheritDoc
     */
    @Override
    public Class getComponentClass() {
        // Return server-side Java class.
        return LineChart.class;
    }

    /**
     * @inheritDoc
     */
    @Override
    public void init(Context context, Component component) {
        super.init(context, component);
        // Obtain outgoing 'ServerMessage' for initial render.
        final ServerMessage serverMessage = (ServerMessage) context.get(ServerMessage.class);
        serverMessage.addLibrary(SharedService.ECHOCOMPONENTS_SERVICE.getId());

        // RAPHAEL
        serverMessage.addLibrary(RAPHAEL_SERVICE.getId());
        serverMessage.addLibrary(RAPHAEL_POPUP_SERVICE.getId());

        // RAPHAEL - eXX-Library
        serverMessage.addLibrary(RAPHAEL_EXX_SERVICE.getId());
        serverMessage.addLibrary(RAPHAEL_EXX_LINECHART_SERVICE.getId());

        // Add LineChart JavaScript library to client.
        serverMessage.addLibrary(LINECHART_SYNC_SERVICE.getId());
    }

    /**
     * Over-ridden to handle request of tag instances are that are serialised
     * as a JSON stucture.
     *
     * @see nextapp.echo.webcontainer.ComponentSynchronizePeer#getOutputProperty(Context, Component, String, int)
     */
    @Override
    public Object getOutputProperty(final Context context,
                                    final Component component, final String propertyName,
                                    final int propertyIndex) {

        if (LineChart.PROPERTY_LINE_CHART_MODEL.equals(propertyName)) {
            return xstream.toXML(((LineChart) component).getLineChartModel());
        }  else if (LineChart.PROPERTY_AXIS_MODEL.equals(propertyName)) {
            return xstream.toXML(((LineChart) component).getAxisModel());
        }
        return super.getOutputProperty(context, component, propertyName, propertyIndex);
    }

}
