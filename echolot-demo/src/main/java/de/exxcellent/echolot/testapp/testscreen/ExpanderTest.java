/*
 * This file (ExpanderTest.java) is part of the Echolot Project (hereinafter "Echolot").
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

import de.exxcellent.echolot.app.Expander;
import de.exxcellent.echolot.testapp.ButtonColumn;
import de.exxcellent.echolot.testapp.StyleUtil;
import de.exxcellent.echolot.testapp.Styles;
import nextapp.echo.app.*;
import nextapp.echo.app.event.ActionEvent;
import nextapp.echo.app.event.ActionListener;
import nextapp.echo.app.layout.CellLayoutData;

/**
 * @author Oliver Pehnke <o.pehnke@exxcellent.de>
 */
public class ExpanderTest extends SplitPane {

    /**
     * default constructor.
     */
    public ExpanderTest() {
        super(SplitPane.ORIENTATION_HORIZONTAL, new Extent(250, Extent.PX));
        setStyleName("DefaultResizable");

        final ButtonColumn controlsColumn = new ButtonColumn();
        controlsColumn.setStyleName("TestControlsColumn");
        add(controlsColumn);

        final Grid content = new Grid(2);
        content.setInsets(new Insets(5));
        content.setBorder(new Border(1, Color.BLACK, Border.STYLE_SOLID));
        content.setWidth(new Extent(100, Extent.PERCENT));
        content.setColumnWidth(0, new Extent(100, Extent.PX));
        content.setColumnWidth(2, new Extent(90, Extent.PERCENT));

        content.add(new Label("Expanded Content"));
        content.add(new TextField());
        content.add(new Label(StyleUtil.QUASI_LATIN_TEXT_1));
        
        final Component hidden = new Label("Hidden Content");

        final Component title = new Row();
        title.add(new Label(Styles.ICON_24_MAGNIFIER));
        title.add(new Label("This is a custom title..."));
        final CellLayoutData tld = new CellLayoutData(){};
        tld.setInsets(new Insets(20,10,0,0));
        title.setLayoutData(tld);

        final CellLayoutData fld = new CellLayoutData(){};
        fld.setInsets(new Insets(5,20,5,5));
        hidden.setLayoutData(fld);
        content.setLayoutData(fld);

        // the expander instance
        final Expander exp = new Expander();
        exp.setTitlePosition("left");
        exp.setHeaderHeight(new Extent(32));
        exp.setHeaderInsets(new Insets(10, 10));
        exp.setTitleInsets(new Insets(0));
        exp.setShowText("Show");
        exp.setHideText("Hide");
        exp.setSpeed(200);
        exp.setTitleInsets(new Insets(5));
        exp.setTitleForeground(new Color(120,120,120));
        exp.setTitleFont(new Font(Font.ARIAL, Font.PLAIN, new Extent(16)));
        exp.setIconTextFont(new Font(Font.ARIAL, Font.PLAIN, new Extent(10)));

        exp.setHeaderBorder(new Border(1, new Color(200,200,200), Border.STYLE_DOTTED));                
        exp.setInsets(new Insets(20));
        exp.setShow(false);

        exp.setContent(content);
        exp.setHiddenContent(hidden);
        // set a Label as title content
        exp.setTitle(title);

        // just some ActionListener that's triggered, when content is toggled
        exp.addContentToggledListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                System.out.println("Content toggled");
            }
        });



        final Grid exp1 = new Grid(2);
        exp1.setInsets(new Insets(5));
        final Expander expHidden = new Expander();
        expHidden.setContent(new Label("Expanded Content"));
        expHidden.setHeaderHide(true);
        expHidden.setShow(false);
        Button button = new Button("Click me!");
        button.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                expHidden.setShow(true);
            }
        });
        exp1.add(button);
        exp1.add(expHidden);

        final Component pane = new Column();
        pane.add(exp);
        pane.add(exp1);
        add(pane);

        controlsColumn.addButton("Set Random Header Background", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                exp.setHeaderBackground(StyleUtil.randomBrightColor());
            }
        });
        controlsColumn.addButton("Set Random Header Border", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                exp.setHeaderBorder(StyleUtil.randomBorder());
            }
        });
        controlsColumn.addButton("Set Random Title Font", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                exp.setTitleFont(StyleUtil.randomFont());
            }
        });
        controlsColumn.addButton("Toggle show", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                exp.setShow( !exp.isShow());
            }
        });
    }
}