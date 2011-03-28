/*
 * This file (PlainHtmlTest.java) is part of the Echolot Project (hereinafter "Echolot").
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

package de.exxcellent.echolot.testapp.testscreen;

import de.exxcellent.echolot.app.PlainHtml;
import de.exxcellent.echolot.testapp.ButtonColumn;
import nextapp.echo.app.Extent;
import nextapp.echo.app.Label;
import nextapp.echo.app.SplitPane;
import nextapp.echo.app.event.ActionEvent;
import nextapp.echo.app.event.ActionListener;

/**
 * Simple Test-Class for the PlainHtml-Component
 * @author Ralf Enderle
 * @version 1.0
 */
public class PlainHtmlTest extends SplitPane {

    private static final String HTML__SOME_TEXT = "Just some simple text with one <b>bold</b> item";
    private static final String HTML__TABLE = "" +
            "<table border=\"1\">  " +
            "<tr><th>Stadt</th> <th>Land</th> <th>Fluss</th> </tr>  " +
            "<tr> <td>Paris</td> <td>Frankreich</td> <td>Seine</td> </tr>" +
            "<tr> <td>Frankfurt</td> <td>Deutschland</td> <td>Main</td> </tr>" +
            "</table>  ";
    private static final String HTML__YOUTUBE = "" +
            "<iframe class=\"youtube-player\" type=\"text/html\" width=\"640\" height=\"385\" " +
            "src=\"http://www.youtube.com/embed/9_xl9boG8Qg\" frameborder=\"0\"> </iframe>";

    public PlainHtmlTest() {
        super(SplitPane.ORIENTATION_HORIZONTAL, new Extent(250, Extent.PX));
        setStyleName("DefaultResizable");

        ButtonColumn controlsColumn = new ButtonColumn();
        controlsColumn.setStyleName("TestControlsColumn");
        add(controlsColumn);

        final PlainHtml plainHtml = new PlainHtml("Hi there :-)");
        //plainHtml.setHtmlText("Test");

        add(plainHtml);

        controlsColumn.add(new Label("Tooltip shows the html that will be displayed!"));
        controlsColumn.addButton("Just some text", HTML__SOME_TEXT, new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                plainHtml.setHtmlText(HTML__SOME_TEXT);
            }
        });

        controlsColumn.addButton("Let's show a table", HTML__TABLE, new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                plainHtml.setHtmlText(HTML__TABLE);
            }
        });

        controlsColumn.addButton("Let's show an embedded Youtube iFrame", HTML__YOUTUBE, new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                plainHtml.setHtmlText(HTML__YOUTUBE);
            }
        });
    }

}
