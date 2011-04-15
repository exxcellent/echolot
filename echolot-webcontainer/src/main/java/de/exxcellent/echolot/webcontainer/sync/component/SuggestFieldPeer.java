/*
 * This file (SuggestFieldPeer.java) is part of the Echolot Project (hereinafter "Echolot").
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
import de.exxcellent.echolot.app.SuggestField;
import de.exxcellent.echolot.model.SuggestItem;
import de.exxcellent.echolot.model.SuggestModel;
import nextapp.echo.app.Component;
import nextapp.echo.app.util.Context;
import nextapp.echo.webcontainer.ServerMessage;
import nextapp.echo.webcontainer.Service;
import nextapp.echo.webcontainer.WebContainerServlet;
import nextapp.echo.webcontainer.service.JavaScriptService;
import nextapp.echo.webcontainer.sync.component.TextComponentPeer;

/**
 * Peer-Class for SuggestField
 *
 * @author Ralf Enderle
 * @version 1.0
 */
public class SuggestFieldPeer extends TextComponentPeer {

    // JQUERY UI Core
    public static final Service JQUERY_UI_CORE_SERVICE;

    // JQUERY UI Libraries
    public static final Service JQUERY_UI_WIDGET_SERVICE;
    public static final Service JQUERY_UI_POSITION_SERVICE;
    public static final Service JQUERY_UI_AUTOCOMPLETE_SERVICE;

    // SuggestField
    public static final Service SUGGESTFIELD_SYNC_SERVICE;

    /**
     * The serializer used to serialize model instances.
     */
    protected static final XStream xstream;

    static {
        // JQUERY
        JQUERY_UI_CORE_SERVICE = JavaScriptService.forResource("jquery.ui.core", "js/jquery/ui/jquery.ui.core.js");
        JQUERY_UI_WIDGET_SERVICE = JavaScriptService.forResource("jquery.ui.widget", "js/jquery/ui/jquery.ui.widget.js");
        JQUERY_UI_POSITION_SERVICE = JavaScriptService.forResource("jquery.ui.position", "js/jquery/ui/jquery.ui.position.js");
        JQUERY_UI_AUTOCOMPLETE_SERVICE = JavaScriptService.forResource("jquery.ui.autocomplete", "js/suggest/jquery.ui.autocomplete.js");

        // PieChart
        SUGGESTFIELD_SYNC_SERVICE = JavaScriptService.forResource("exxcellent.SuggestField.Sync",
                "js/Sync.SuggestField.js");

        /* Register JavaScriptService with the global service registry.*/
        WebContainerServlet.getServiceRegistry().add(JQUERY_UI_CORE_SERVICE);
        WebContainerServlet.getServiceRegistry().add(JQUERY_UI_WIDGET_SERVICE);
        WebContainerServlet.getServiceRegistry().add(JQUERY_UI_POSITION_SERVICE);
        WebContainerServlet.getServiceRegistry().add(JQUERY_UI_AUTOCOMPLETE_SERVICE);

        WebContainerServlet.getServiceRegistry().add(SUGGESTFIELD_SYNC_SERVICE);

        /* JSON Stream Driver */
        xstream = new XStream(new JsonHierarchicalStreamDriver());

        xstream.alias("suggestItem", SuggestItem.class);
        xstream.alias("suggestModel", SuggestModel.class);

        xstream.processAnnotations(SuggestModel.class);
        xstream.processAnnotations(SuggestItem.class);

    }

    public SuggestFieldPeer() {
        super();
        // Event for SERVER_FILTER
        addEvent(new EventPeer(SuggestField.INPUT_TRIGGER_SERVER_FILTER,
                SuggestField.SERVER_FILTER_CHANGED_PROPERTY, String.class) {
            @Override
            public boolean hasListeners(Context context, Component c) {
                return ((SuggestField) c).hasServerFilterListener();
            }
        });

        // Event for SUGGEST_ITEM_SELECTED
        addEvent(new EventPeer(SuggestField.INPUT_SUGGEST_ITEM_SELECTED,
                SuggestField.SUGGESTITEMSELECT_LISTENER_CHANGED_PROPERTY, Integer.class) {
            @Override
            public boolean hasListeners(Context context, Component c) {
                return ((SuggestField) c).hasSuggestItemSelectListener();
            }
        });
    }

    /**
     * Returns the clientComponentType
     *
     * @param shortType
     * @return
     */
    public String getClientComponentType(boolean shortType) {
        // Return client-side component type name.
        return "exxcellent.SuggestField";
    }

    /**
     * @inheritDoc
     */
    @Override
    public Class getComponentClass() {
        // Return server-side Java class.
        return SuggestField.class;
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
        serverMessage.addLibrary(SharedService.JQUERY_SERVICE.getId());

        // JQUERY UI
        serverMessage.addLibrary(JQUERY_UI_CORE_SERVICE.getId());

        // JQUERY UI Libraries
        serverMessage.addLibrary(JQUERY_UI_WIDGET_SERVICE.getId());
        serverMessage.addLibrary(JQUERY_UI_POSITION_SERVICE.getId());
        serverMessage.addLibrary(JQUERY_UI_AUTOCOMPLETE_SERVICE.getId());

        // Add SUGGESTFIELD JavaScript library to client.
        serverMessage.addLibrary(SUGGESTFIELD_SYNC_SERVICE.getId());
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

        if (SuggestField.PROPERTY_SUGGEST_MODEL.equals(propertyName)) {
            return xstream.toXML(((SuggestField) component).getSuggestModel());
        }
        return super.getOutputProperty(context, component, propertyName, propertyIndex);
    }

}
