/*
 * This file (DatePickerTest.java) is part of the Echolot Project (hereinafter "Echolot").
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

import de.exxcellent.echolot.app.DatePicker;
import de.exxcellent.echolot.model.LocaleModel;
import de.exxcellent.echolot.testapp.ButtonColumn;
import de.exxcellent.echolot.testapp.StyleUtil;
import java.text.SimpleDateFormat;
import java.util.Date;
import nextapp.echo.app.Border;
import nextapp.echo.app.Color;
import nextapp.echo.app.Extent;
import nextapp.echo.app.Grid;
import nextapp.echo.app.Insets;
import nextapp.echo.app.Label;
import nextapp.echo.app.SplitPane;
import nextapp.echo.app.TextField;
import nextapp.echo.app.event.ActionEvent;
import nextapp.echo.app.event.ActionListener;
import nextapp.echo.app.event.DocumentEvent;
import nextapp.echo.app.event.DocumentListener;
import nextapp.echo.app.layout.GridLayoutData;
import nextapp.echo.app.text.Document;
import nextapp.echo.app.text.StringDocument;

/** @author Oliver Pehnke <o.pehnke@exxcellent.de> */
public class DatePickerTest extends SplitPane {
    /** default constructor. */
    public DatePickerTest() {
        super(SplitPane.ORIENTATION_HORIZONTAL, new Extent(250, Extent.PX));
        setStyleName("DefaultResizable");

        final ButtonColumn controlsColumn = new ButtonColumn();
        controlsColumn.setStyleName("TestControlsColumn");
        add(controlsColumn);

        final Document document = new StringDocument();
        document.addDocumentListener(new DocumentListener() {

            public void documentUpdate(DocumentEvent e) {
                System.out.println("Document update: '" + document.getText() + "'");
            }
            
        });
        

        final GridLayoutData layoutData = new GridLayoutData();
        layoutData.setInsets(new Insets(5, 10));
        layoutData.setBackground(new Color(142, 171, 204));
        
        // 1st DatePicker
        final DatePicker datePickerDe = new DatePicker(document);
        datePickerDe.setLocaleModel(LocaleModel.GERMAN);
        datePickerDe.setText("10.11.2009");
        datePickerDe.setLayoutData(layoutData);
        datePickerDe.setWidth(new Extent(100, Extent.PERCENT));
        datePickerDe.setDebug(true);
        datePickerDe.setEditable(true);
        datePickerDe.setMaximumLength(10);
        datePickerDe.setRegEx("^[\\d\\.]*$");
        
        // 2nd DatePicker
        final DatePicker datePickerEn = new DatePicker(document);
        datePickerEn.setLocaleModel(LocaleModel.ENGLISH);
        datePickerEn.setText("04-28-2009");
        datePickerEn.setLayoutData(layoutData);
        datePickerEn.setWidth(new Extent(100, Extent.PERCENT));
        datePickerEn.setDebug(true);
        datePickerEn.setEditable(true);
        datePickerEn.setMaximumLength(10);
        datePickerEn.setRegEx("^[\\d\\-]*$");

        final Grid grid = new Grid(2);
        grid.setInsets(new Insets(5));
        grid.setBorder(new Border(1, Color.BLACK, Border.STYLE_SOLID));
        grid.setWidth(new Extent(100, Extent.PERCENT));
        grid.setColumnWidth(0, new Extent(100, Extent.PX));
        grid.setColumnWidth(2, new Extent(90, Extent.PERCENT));

        grid.add(datePickerDe);
        grid.add(datePickerEn);

        for (int i = 0; i < 3; i++) {
            grid.add(new TextField());
            grid.add(new Label(LOREM_IPSUM));
        }

        add(grid);

        controlsColumn.addButton("Set Random Background Color", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                datePickerDe.setBackground(StyleUtil.randomBrightColor());
            }
        });
        
        controlsColumn.addButton("Set Random Date (Picker#1)", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                final String dateFormatPattern = LocaleModel.GERMAN.getDateFormat();
                final SimpleDateFormat dateFormat = new SimpleDateFormat(dateFormatPattern);
                final Date date = randomDate();
                datePickerDe.setText((String) dateFormat.format(date));
            }
        });
        controlsColumn.addButton("Date to console", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                System.out.println(datePickerDe.getText());
            }
        });
    }

    public static Date randomDate() {
        long currentTime = new Date().getTime();
        return new Date(((long) (currentTime * Math.random())) + currentTime);
    }

    public static final String LOREM_IPSUM = "Lorem ipsum dolor sit amet, consetetur" +
            " sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et " +
            "dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et " +
            "justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata " +
            "sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet";
}