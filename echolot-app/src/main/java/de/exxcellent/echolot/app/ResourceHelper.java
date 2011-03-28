/*
 * This file (ResourceHelper.java) is part of the Echolot Project (hereinafter "Echolot").
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

/**
 * 
 */
package de.exxcellent.echolot.app;

import java.io.IOException;
import java.io.InputStreamReader;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * @author rakesh (from echopoint library)
 */
public class ResourceHelper {
	/** The LOG to use to log the download progress. */
    protected static final Logger LOG = Logger.getAnonymousLogger();
    
	/**
     * Converts the content of the given resource as {@link String} value.
     * 
     * @param resource the resource to be read and converted into a {@link String}
     * @return the content as string
     */
    public static String getFileAsString(String resource) {
        InputStreamReader in = null;
        StringBuffer sb = new StringBuffer();

        try {
            in = new InputStreamReader(Thread.currentThread().getContextClassLoader().getResourceAsStream(resource));
            if (in == null) {
                throw new IllegalArgumentException("Specified resource does not exist: " + resource + ".");
            }
            int character;
            while ((character = in.read()) != -1) {
                sb.append((char) character);
            }
        }
        catch (Exception e) {
            LOG.log(Level.SEVERE, "Could not load resource <"+resource+">", e);
        }
        finally {
            if (in != null) { try { in.close(); } catch (IOException ex) { } }
        }
        return sb.toString();
    } 
}
