/*
 * This file (NotifierPeer.java) is part of the Echolot Project (hereinafter "Echolot").
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

import de.exxcellent.echolot.SharedService;
import de.exxcellent.echolot.app.Notifier;
import nextapp.echo.app.Component;
import nextapp.echo.app.util.Context;
import nextapp.echo.webcontainer.AbstractComponentSynchronizePeer;
import nextapp.echo.webcontainer.ServerMessage;
import nextapp.echo.webcontainer.Service;
import nextapp.echo.webcontainer.WebContainerServlet;
import nextapp.echo.webcontainer.service.JavaScriptService;

/**
 * A specialized {@link nextapp.echo.webcontainer.AbstractComponentSynchronizePeer} initializing the libraries for the
 * {@link de.exxcellent.echolot.app.Notifier} component and responsible for transport of the properties to
 * the javascript based echo3 client component exxcellent.Notifier.
 *
 * @author Oliver Pehnke <o.pehnke@exxcellent.de>
 */
public class NotifierPeer extends AbstractComponentSynchronizePeer {

    // Create Services containing the Notifier and Notifier JavaScript code.
    private static final Service NOTIFIER_SERVICE;
    private static final Service NOTIFIER_SYNC_SERVICE;

    static {
        NOTIFIER_SERVICE = JavaScriptService.forResource("exxcellent.NotifierService",
                "js/notifier/notifier.js");
        NOTIFIER_SYNC_SERVICE = JavaScriptService.forResource("exxcellent.Notifier.Sync",
                "js/Sync.Notifier.js");

        /* Register JavaScriptService with the global service registry.*/
        WebContainerServlet.getServiceRegistry().add(NOTIFIER_SERVICE);
        WebContainerServlet.getServiceRegistry().add(NOTIFIER_SYNC_SERVICE);
    }

    /**
     * Default constructor for a {@link de.exxcellent.echolot.webcontainer.sync.component.NotifierPeer}.
     * Registers an event peer for client events.
     */
    public NotifierPeer() {
        addEvent(new EventPeer(Notifier.INPUT_ACTION,
                               Notifier.ACTION_LISTENERS_CHANGED_PROPERTY) {
            public boolean hasListeners(Context context, Component c) {
                return ((Notifier) c).hasActionListeners();
            }
        });
    }

    public String getClientComponentType(boolean shortType) {
        // Return client-side component type name.
        return "exxcellent.Notifier";
    }

    /**
     * @inheritDoc
     */
    @Override
    public Class getComponentClass() {
        // Return server-side Java class.
        return Notifier.class;
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

        // Add Notifier JavaScript library to client.
        serverMessage.addLibrary(NOTIFIER_SERVICE.getId());
        serverMessage.addLibrary(NOTIFIER_SYNC_SERVICE.getId());
    }
}