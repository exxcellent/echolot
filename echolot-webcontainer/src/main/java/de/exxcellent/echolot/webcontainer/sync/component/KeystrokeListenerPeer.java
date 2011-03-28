/*
 * This file (KeystrokeListenerPeer.java) is part of the Echolot Project (hereinafter "Echolot").
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
import de.exxcellent.echolot.app.KeystrokeListener;
import nextapp.echo.app.Component;
import nextapp.echo.app.util.Context;
import nextapp.echo.webcontainer.AbstractComponentSynchronizePeer;
import nextapp.echo.webcontainer.ServerMessage;
import nextapp.echo.webcontainer.Service;
import nextapp.echo.webcontainer.WebContainerServlet;
import nextapp.echo.webcontainer.service.JavaScriptService;

/**
 * Rendering peer for the <code>KeystrokeListener</code> component.
 *
 * @author Benjamin Schmid <B.Schmid@exxcellent.de>
 */
public class KeystrokeListenerPeer extends AbstractComponentSynchronizePeer {

    // Create a JavaScriptService containing the SpinButton JavaScript code.
    private static final Service JS_SYNC_SERVICE = JavaScriptService.forResource("exxcellent.KeystrokeListenerSync",
            "js/Sync.KeystrokeListener.js");

    static {
        // Register JavaScriptService with the global service registry.
        WebContainerServlet.getServiceRegistry().add(JS_SYNC_SERVICE);
    }

    public KeystrokeListenerPeer() {
        super();
        addEvent(new KeystrokeListenerEventPeer());
    }

    public String getClientComponentType(boolean shortType) {
        // Return client-side component type name .
        return "exxcellent.KeystrokeListener";
    }

    @Override
    public Class getComponentClass() {
        return KeystrokeListener.class;
    }

    @Override
    public void init(Context context, Component component) {
        super.init(context, component);
        // Obtain outgoing 'ServerMessage' for initial render.
        ServerMessage serverMessage = (ServerMessage) context.get(ServerMessage.class);
        // Add KeyStroke JavaScript libraries to client.
        serverMessage.addLibrary(SharedService.ECHOCOMPONENTS_SERVICE.getId());
        serverMessage.addLibrary(JS_SYNC_SERVICE.getId());
    }

    /** Event peer for Keystroke listener class. */
    private static class KeystrokeListenerEventPeer extends EventPeer {

        public KeystrokeListenerEventPeer() {
            super(KeystrokeListener.KEYSTROKE_ACTION, KeystrokeListener.ACTION_LISTENERS_CHANGED_PROPERTY, String.class);
        }

        @Override
        public boolean hasListeners(Context context, Component c) {
            return ((KeystrokeListener) c).hasActionListeners();
        }
    }
}
