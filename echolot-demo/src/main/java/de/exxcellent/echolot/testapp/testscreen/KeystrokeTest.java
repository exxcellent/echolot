/*
 * This file (KeystrokeTest.java) is part of the Echolot Project (hereinafter "Echolot").
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

import de.exxcellent.echolot.app.KeystrokeListener;
import de.exxcellent.echolot.testapp.ButtonColumn;
import de.exxcellent.echolot.testapp.StyleUtil;
import nextapp.echo.app.ApplicationInstance;
import nextapp.echo.app.Component;
import nextapp.echo.app.Extent;
import nextapp.echo.app.Grid;
import nextapp.echo.app.Label;
import nextapp.echo.app.SplitPane;
import nextapp.echo.app.TextField;
import nextapp.echo.app.event.ActionEvent;
import nextapp.echo.app.event.ActionListener;

/** @author Benjamin Schmid <B.Schmid@exxcellent.de> */
public class KeystrokeTest extends SplitPane {

    private final Component layout;
    private final ButtonColumn controlsColumn;
    private final Label resultLabel = new Label("<No key pressed yet>");

    public KeystrokeTest() {
        super(SplitPane.ORIENTATION_HORIZONTAL, new Extent(250, Extent.PX));
        setStyleName("DefaultResizable");

        controlsColumn = new ButtonColumn();
        controlsColumn.setStyleName("TestControlsColumn");
        add(controlsColumn);

        final Label instructLabel = new Label(
                "Shortcuts:\nCtrl-H and H will trigger a label to show you triggered an event. \nH will only work inside the first textfield.");
        final TextField tf1 = new TextField();
        instructLabel.setFormatWhitespace(true);

        layout = new Grid(1);
        layout.add(instructLabel);
        layout.add(new Label(StyleUtil.QUASI_LATIN_TEXT_1));
        layout.add(tf1);
        layout.add(new TextField());
        layout.add(new TextField());
        layout.add(resultLabel);
        add(layout);

        // Me must assign a render id now, because its generated too late.
        tf1.setRenderId("TF"+ApplicationInstance.getActive().generateId());
        final KeystrokeListener hListener = new KeystrokeListener("h", "h command", tf1.getRenderId());
        final KeystrokeListener ctrl_hListener = new KeystrokeListener("ctrl+h", "ctr+h command", null);
        hListener.addActionListener(new KeystrokeActionHandler());
        ctrl_hListener.addActionListener(new KeystrokeActionHandler());

        layout.add(hListener);
        layout.add(ctrl_hListener);

        addTestControls();
    }

    private void addTestControls() {
        controlsColumn.addButton("Set Random Background Color", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                layout.setBackground(StyleUtil.randomBrightColor());
            }
        });
    }

    private class KeystrokeActionHandler implements ActionListener {
        public void actionPerformed(final ActionEvent e) {
            String msg = "You hit a key shortcut! Type:" + e.getActionCommand()+ ", Time: "+System.currentTimeMillis();
            resultLabel.setText(msg);
            resultLabel.setBackground(StyleUtil.randomBrightColor());
        }
    }
}