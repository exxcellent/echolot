/*
 * This file (PlainHtml.java) is part of the Echolot Project (hereinafter "Echolot").
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

package de.exxcellent.echolot.app;

import nextapp.echo.app.Component;

/**
 * Component to render plain-xHtml in Echo3
 * Just pass your own xHtml to this component - it will be rendered to the next topLevel parent in client.
 *
 * !! Be careful !! Don't make this component usable for End-Users! This will give them a huge backdoor to your application.
 *
 * @author Ralf Enderle
 * @version 1.0
 */
public class PlainHtml extends Component {

    public static final String PROPERTY_HTML_TEXT = "htmlText";

    /**
     * Empty-Constructor
     * use 'setHtmlText(String html)' to set the xHtml you want to be rendered by this component
     */
    public PlainHtml() {
        super();
    }

    /**
     * Constructor with a xHtml to render
     * @param html
     */
    public PlainHtml(String html) {
        super();
        setHtmlText(html);
    }

    /**
     * Set a valid xHtml as String - the client will try to render it as it is
     * @param html
     */
    public void setHtmlText(String html) {
        set(PROPERTY_HTML_TEXT, html);
    }

    /**
     * Returns the xHtml that is current set
     * @return
     */
    public String getHtmlText() {
        return (String) get(PROPERTY_HTML_TEXT);
    }
}
