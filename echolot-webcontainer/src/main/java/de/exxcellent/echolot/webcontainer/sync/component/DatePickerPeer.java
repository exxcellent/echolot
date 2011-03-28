/*
 * This file (DatePickerPeer.java) is part of the Echolot Project (hereinafter "Echolot").
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
import de.exxcellent.echolot.app.DatePicker;
import de.exxcellent.echolot.model.LocaleModel;
import nextapp.echo.app.Component;
import nextapp.echo.app.update.ClientUpdateManager;
import nextapp.echo.app.util.Context;
import nextapp.echo.webcontainer.AbstractComponentSynchronizePeer;
import nextapp.echo.webcontainer.ContentType;
import nextapp.echo.webcontainer.ServerMessage;
import nextapp.echo.webcontainer.Service;
import nextapp.echo.webcontainer.WebContainerServlet;
import nextapp.echo.webcontainer.service.JavaScriptService;

/**
 * A specialized {@link AbstractComponentSynchronizePeer} initializing the libraries for the {@link DatePicker} component and
 * responsible for transport of the properties to the javascript based echo3 client.
 *
 * @author Oliver Pehnke <o.pehnke@exxcellent.de>
 */
public class DatePickerPeer extends AbstractComponentSynchronizePeer {

    // Create a JavaScriptServices containing the DatePicker and DatePicker JavaScript code.
    private static final Service DATEPICKER_SERVICE;
    private static final Service DATEPICKER_SYNC_SERVICE;

    private static final String DATEPICKER_STYLESHEET;

    /** Input property name for text change events. */
    public static final String INPUT_CHANGE = "change";


    /** The serializer used to serialize model instances. */
    protected static final XStream xstream;

    static {
        DATEPICKER_SERVICE = JavaScriptService.forResource("exxcellent.DatePickerService",
                                                           "js/datepicker/datepicker.js");
        DATEPICKER_SYNC_SERVICE = JavaScriptService.forResource("exxcellent.DatePicker.Sync",
                                                                "js/Sync.DatePicker.js");

        DATEPICKER_STYLESHEET = "js/datepicker/css/";

        /* Register JavaScriptService with the global service registry.*/
        WebContainerServlet.getServiceRegistry().add(DATEPICKER_SERVICE);
        WebContainerServlet.getServiceRegistry().add(DATEPICKER_SYNC_SERVICE);

        WebContainerServlet.getResourceRegistry().addPackage("DatePickerStylesheet", DATEPICKER_STYLESHEET);
        WebContainerServlet.getResourceRegistry().add("DatePickerStylesheet", "datepicker-template.css", ContentType.TEXT_CSS);
        /* JSON Stream Driver */
        xstream = new XStream(new JsonHierarchicalStreamDriver());
        xstream.processAnnotations(LocaleModel.class);
    }

    /** Default constructor for a {@link DatePickerPeer}. Registers an event peer for client events. */
    public DatePickerPeer() {
        addOutputProperty(DatePicker.TEXT_CHANGED_PROPERTY);
        addEvent(new EventPeer(DatePicker.INPUT_ACTION, DatePicker.ACTION_LISTENERS_CHANGED_PROPERTY) {
            @Override
            public boolean hasListeners(Context context, Component c) {
                return ((DatePicker) c).hasActionListeners();
            }
        });
    }

    public String getClientComponentType(boolean shortType) {
        // Return client-side component type name.
        return "exxcellent.DatePicker";
    }

    /** @inheritDoc */
    @Override
    public Class getComponentClass() {
        // Return server-side Java class.
        return DatePicker.class;
    }

    /** @inheritDoc */
    @Override
    public void init(Context context, Component component) {
        super.init(context, component);
        // Obtain outgoing 'ServerMessage' for initial render.
        final ServerMessage serverMessage = (ServerMessage) context.get(ServerMessage.class);
        serverMessage.addLibrary(SharedService.ECHOCOMPONENTS_SERVICE.getId());
        serverMessage.addLibrary(SharedService.JQUERY_SERVICE.getId());
        // Add DatePicker JavaScript library to client.
        serverMessage.addLibrary(DATEPICKER_SERVICE.getId());
        serverMessage.addLibrary(DATEPICKER_SYNC_SERVICE.getId());
    }

    /** @see nextapp.echo.webcontainer.AbstractComponentSynchronizePeer#getInputPropertyClass(java.lang.String) */
    @Override
    public Class getInputPropertyClass(String propertyName) {
        if (DatePicker.TEXT_CHANGED_PROPERTY.equals(propertyName)) {
            return String.class;
        }
        return null;
    }

    /** @see nextapp.echo.webcontainer.ComponentSynchronizePeer#storeInputProperty(Context, Component, String, int, Object) */
    @Override
    public void storeInputProperty(Context context, Component component, String propertyName, int propertyIndex, Object newValue) {
        if (propertyName.equals(DatePicker.TEXT_CHANGED_PROPERTY)) {
            if (newValue == null) {
                // Set input value to empty string if null such that property will not be sent back to client as an update
                // when it is changed to an empty string by the document model.
                newValue = "";
            }
            ClientUpdateManager clientUpdateManager = (ClientUpdateManager) context.get(ClientUpdateManager.class);
            if (!Boolean.FALSE.equals(component.getRenderProperty(DatePicker.PROPERTY_EDITABLE))) {
                clientUpdateManager.setComponentProperty(component, DatePicker.TEXT_CHANGED_PROPERTY, newValue);
            }
        }
    }

    /**
     * Over-ridden to handle requests for the {@link DatePicker} properties. The collection of tag instances are serialised as a
     * JSON stucture.
     *
     * @see nextapp.echo.webcontainer.ComponentSynchronizePeer#getOutputProperty(Context, Component, String, int)
     */
    @Override
    public Object getOutputProperty(final Context context,
                                    final Component component, final String propertyName,
                                    final int propertyIndex) {
        if (propertyName.equals(DatePicker.TEXT_CHANGED_PROPERTY)) {
            DatePicker datePicker = (DatePicker) component;
            return datePicker.getText();
        } else if (DatePicker.PROPERTY_LOCALE_MODEL.equals(propertyName)) {
            return xstream.toXML(((DatePicker) component).getLocaleModel());
        }
        return super.getOutputProperty(context, component, propertyName, propertyIndex);
    }
}