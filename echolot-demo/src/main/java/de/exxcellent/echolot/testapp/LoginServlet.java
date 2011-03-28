/*
 * This file (LoginServlet.java) is part of the Echolot Project (hereinafter "Echolot").
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

package de.exxcellent.echolot.testapp;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.ServletException;
import java.io.IOException;

/**
 * Das Login Servlet ist eine Schnittstelle zur Applikation, die den HTTP-Authoriserungs-Header anfordert um dann auf die
 * Applikation "/app" umzuleiten. Die Schnittstelle wurde zur Erhöhung der Testbarkeit der Applikation definiert, z.Bsp.
 * automatisierte und manuelle Tests mit verschiedenen Benutzern mit unteschiedlichen Rechten.
 *
 * @author Michael Olp (eXXcellent Solutions GmbH, 2009)
 */
public class LoginServlet extends HttpServlet {

    public LoginServlet() {
    }

    /** @inheritDoc */
    @Override
    protected void service(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        try {
            //LOG.debug("Entering login servlet...");
            if (req.getSession().isNew() || req.getHeader("Authorization") == null) {
                sendAuthenticationResponse(resp);
            } else {
                //LOG.debug("Forwarding to application [/app]");
                resp.sendRedirect(req.getContextPath() + "/app");
            }
        } catch (Throwable e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * Fügt zu einer HTTP-Response einen Basic Authenticate HTTP-Header hinzu, der die Eingabe von Benutzernamen und Passwort auf
     * Client Seite erzwingt, falls diese Informationen bisher nicht bekannt sind.
     *
     * @param resp eine HTTP Response
     */
    private void sendAuthenticationResponse(HttpServletResponse resp) throws IOException {
        resp.addHeader("WWW-Authenticate", "Basic realm=\"Wife realm\"");
        resp.sendError(401, "authenticate!");
    }

}
