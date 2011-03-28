/*
 * This file (NotifierTest.java) is part of the Echolot Project (hereinafter "Echolot").
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

import de.exxcellent.echolot.app.Notifier;
import de.exxcellent.echolot.model.Notification;
import de.exxcellent.echolot.testapp.ButtonColumn;
import de.exxcellent.echolot.testapp.Styles;
import nextapp.echo.app.*;
import nextapp.echo.app.event.ActionEvent;
import nextapp.echo.app.event.ActionListener;
import nextapp.echo.app.layout.GridLayoutData;

/**
 * @author Oliver Pehnke <o.pehnke@exxcellent.de>
 */
public class NotifierTest extends SplitPane {
    /**
     * default constructor.
     */
    public NotifierTest() {
        super(SplitPane.ORIENTATION_HORIZONTAL, new Extent(250, Extent.PX));
        setStyleName("DefaultResizable");

        final ButtonColumn controlsColumn = new ButtonColumn();
        controlsColumn.setStyleName("TestControlsColumn");
        add(controlsColumn);

        final GridLayoutData layoutData = new GridLayoutData();
        layoutData.setInsets(new Insets(5, 10));
        layoutData.setBackground(new Color(142, 171, 204));

        // the notifier instance
        final Notifier notifier = new Notifier();
        notifier.addActionListener(new ActionListener(){

            public void actionPerformed(ActionEvent e) {
                 notifier.showNotification(
                         Notification.createMessage(
                                 "Action triggered", "data: " + e.getSource())
                                 .position(Notification.Position.BOTTOMLEFT)
                                 .width(new Extent(300)));
                System.out.println("Action triggered: " + e);
            }
        });

        final Component pane = new ContentPane();
        final Grid grid = new Grid(2);
        grid.setInsets(new Insets(5));
        grid.setBorder(new Border(1, Color.BLACK, Border.STYLE_SOLID));
        grid.setWidth(new Extent(100, Extent.PERCENT));
        grid.setColumnWidth(0, new Extent(100, Extent.PX));
        grid.setColumnWidth(2, new Extent(90, Extent.PERCENT));

        grid.add(new TextField());
        grid.add(new Label(LOREM_IPSUM));

        pane.add(grid);
        pane.add(notifier);

        add(pane);

        controlsColumn.addButton("Save Document.", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                notifier.showNotification(Notification.createMessage(
                        "Document saved", "File: invoices-2010-08.csv")
                        .position(Notification.Position.CENTER).width(new Extent(400))
                        .font(new Font(Font.ARIAL, Font.BOLD, new Extent(14)))
                        .titleFont(new Font(Font.ARIAL, Font.BOLD, new Extent(24)))
                        .foreground(Color.DARKGRAY)
                        .titleForeground(Color.DARKGRAY)
                        .background(new Color(200,204,208))
                        .opacity("0.9")
                        .duration(1000)
                        .hoverInterrupt(false));
            }
        });
        controlsColumn.addButton("Serviceauftrag speichern.", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                notifier.showNotification(Notification.createMessage(
                        "Serviceauftrag gespeichert.", "Neuer Status: 'ERFASST'\nDatum: '20.09.2010, 14:45'.")
                        .position(Notification.Position.BOTTOMCENTER).width(new Extent(600))                        
                        .humanized(true)
                        .duration(5000));
            }
        });

        controlsColumn.addButton("Email not sent (warning).", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                notifier.showNotification(Notification.createWarning(
                        "Email not sent.", "The Email was not sent. Will try again in 5 seconds.")
                        .position(Notification.Position.TOPRIGHT).width(new Extent(250))
                        .opacity("0.9")
                        .icon(Styles.ICON_24_MAGNIFIER));
            }
        });

        controlsColumn.addButton("Oliver online.", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                notifier.showNotification(Notification.createMessage(
                        "Oliver online.", "Your buddy 'Oliver' appeared online.")
                        .icon(Styles.OLIVER).position(Notification.Position.BOTTOMRIGHT).width(new Extent(300)));
            }
        });

        controlsColumn.addButton("Show a lot of text (topright)", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                notifier.showNotification(Notification.createMessage(
                        "A lot of sticky Text", LOREM_IPSUM)
                        .sticky(true).position(Notification.Position.TOPRIGHT).width(new Extent(250)));
            }
        });

        controlsColumn.addButton("Show an Exception", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                notifier.showNotification(Notification.createError(
                        "NullpointerException", EXCEPTION)
                        .sticky(true).position(Notification.Position.CENTER)
                        .width(new Extent(700))
                        .font(new Font(Font.MONOSPACE, Font.PLAIN, new Extent(10))));
            }
        });

        controlsColumn.addButton("Show an Error with button", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                notifier.showNotification(Notification.createError(
                        "NullpointerException", "java.lang.NullPointerException" +
                                                "\n\t at org.hibernate.util.StringHelper.qualify(StringHelp er.java:264)")
                        .showButton(true).buttonText("Show Details")
                        .sticky(true).position(Notification.Position.CENTER)
                        .width(new Extent(500))
                        .font(new Font(Font.MONOSPACE, Font.PLAIN, new Extent(10))));
            }
        });
    }

    public static final String LOREM_IPSUM = "Lorem ipsum dolor sit amet, consetetur" +
            " sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et " +
            "dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et " +
            "justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata " +
            "sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet";

    public static final String EXCEPTION = "java.lang.NullPointerException" +
            "\n\t at org.hibernate.util.StringHelper.qualify(StringHelp er.java:264)" +
            "\n\t at org.hibernate.cfg.ToOneMappedBySecondPass.doSecond Pass(ToOneMappedBySecondPass.java:38)" +
            "\n\t at org.hibernate.cfg.Configuration.secondPassCompile( Configuration.java:1023)" +
            "\n\t at org.hibernate.cfg.AnnotationConfiguration.secondPa ssCompile(AnnotationConfiguration.java:218)" +
            "\n\t at org.hibernate.cfg.Configuration.buildSessionFactor y(Configuration.java:1138)" +
            "\n\t at de.hr.util.db.HibernateUtil.<clinit>(HibernateUtil .java:24)" +
            "\n\t at java.lang.Class.forName0(Native Method)" +
            "\n\t at java.lang.Class.forName(Class.java:164)" +
            "\n\t at de.hr.ui.Console.main(Console.java:17)" +
            "\n Exception in thread 'main' java.lang.ExceptionInInitializerError" +
            "\n\t at de.hr.util.db.HibernateUtil.<clinit>(HibernateUtil .java:28)" +
            "\n\t at java.lang.Class.forName0(Native Method)" +
            "\n\t at java.lang.Class.forName(Class.java:164)" +
            "\n\t at de.hr.ui.Console.main(Console.java:17)" +
            "\n Caused by: java.lang.NullPointerException" +
            "\n\t at org.hibernate.util.StringHelper.qualify(StringHelp er.java:264)" +
            "\n\t at org.hibernate.cfg.ToOneMappedBySecondPass.doSecond Pass(ToOneMappedBySecondPass.java:38)" +
            "\n\t at org.hibernate.cfg.Configuration.secondPassCompile( Configuration.java:1023)" +
            "\n\t at org.hibernate.cfg.AnnotationConfiguration.secondPa ssCompile(AnnotationConfiguration.java:218)" +
            "\n\t at org.hibernate.cfg.Configuration.buildSessionFactor y(Configuration.java:1138)" +
            "\n\t at de.hr.util.db.HibernateUtil.<clinit>(HibernateUtil .java:24)" +
            "\n\t ... 3 more";
}