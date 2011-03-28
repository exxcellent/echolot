/*
 * This file (BlockTest.java) is part of the Echolot Project (hereinafter "Echolot").
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

import de.exxcellent.echolot.app.Block;
import de.exxcellent.echolot.layout.BlockLayoutData;
import de.exxcellent.echolot.testapp.ButtonColumn;
import de.exxcellent.echolot.testapp.StyleUtil;
import nextapp.echo.app.Color;
import nextapp.echo.app.Extent;
import nextapp.echo.app.Label;
import nextapp.echo.app.SplitPane;
import nextapp.echo.app.event.ActionEvent;
import nextapp.echo.app.event.ActionListener;

/** @author Oliver Pehnke <o.pehnke@exxcellent.de> */
public class BlockTest extends SplitPane {

    public BlockTest() {
        super(SplitPane.ORIENTATION_HORIZONTAL, new Extent(250, Extent.PX));
        setStyleName("DefaultResizable");

        final ButtonColumn controlsColumn = new ButtonColumn();
        controlsColumn.setStyleName("TestControlsColumn");
        add(controlsColumn);

        final Block block = new Block();
        final Extent widthExtent = new Extent(100);
        final Label labelA = new Label("Label A");
        BlockLayoutData layoutA = new BlockLayoutData();
        layoutA.setFloating("right");
        layoutA.setWidth(widthExtent);
        layoutA.setBackground(Color.RED);
        labelA.setLayoutData(layoutA);

        final Label valueB = new Label("Value B");
        BlockLayoutData layoutB = new BlockLayoutData();
        layoutB.setMarginRight(widthExtent);
        layoutB.setBackground(Color.BLUE);
        valueB.setLayoutData(layoutB);
        
        block.add(labelA);
        block.add(valueB);
        add(block);

        controlsColumn.addButton("Set Random Background Color", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                block.setBackground(StyleUtil.randomBrightColor());
            }
        });
    }
}