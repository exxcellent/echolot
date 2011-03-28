/*
 * This file (SharedService.java) is part of the Echolot Project (hereinafter "Echolot").
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

package de.exxcellent.echolot;

import nextapp.echo.webcontainer.Service;
import nextapp.echo.webcontainer.WebContainerServlet;
import nextapp.echo.webcontainer.service.JavaScriptService;

/** Register the EchoComponents libraries. */
public final class SharedService {

    /** The service for the root EchoComponents name space and components. */
    public static final Service ECHOCOMPONENTS_SERVICE;
    public static final Service JQUERY_SERVICE;

    /** Add the {@link #ECHOCOMPONENTS_SERVICE} to the service registry. */
    static {
        JQUERY_SERVICE = JavaScriptService.forResource("jq", "js/jquery/jquery-1.3.2.js");
        ECHOCOMPONENTS_SERVICE = JavaScriptService.forResource("echocomponents.Boot", "js/ComponentsCommon.js");

        // Register services in the web container servlet.
        WebContainerServlet.getServiceRegistry().add(ECHOCOMPONENTS_SERVICE);
        WebContainerServlet.getServiceRegistry().add(JQUERY_SERVICE);

        WebContainerServlet.getResourceRegistry().addPackage("echocomponents", "resource/");
    }

    private SharedService() {
    }
}
