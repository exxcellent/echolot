/*
 * This file (PieChartTest.java) is part of the Echolot Project (hereinafter "Echolot").
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

import de.exxcellent.echolot.app.PieChart;
import de.exxcellent.echolot.event.PieSectorSelectEvent;
import de.exxcellent.echolot.listener.PieSectorSelectListener;
import de.exxcellent.echolot.model.AnimationType;
import de.exxcellent.echolot.model.Location;
import de.exxcellent.echolot.model.PieModel;
import de.exxcellent.echolot.model.PieSector;
import de.exxcellent.echolot.testapp.ButtonColumn;
import de.exxcellent.echolot.testapp.StyleUtil;
import nextapp.echo.app.*;
import nextapp.echo.app.event.ActionEvent;
import nextapp.echo.app.event.ActionListener;

import javax.swing.*;

/**
 * This class represents a visual Test-Area for the PieChart and all it's properties
 *
 * @author Ralf Enderle
 */
public class PieChartTest extends SplitPane {

    final PieChart pieChart;

    /**
     * Visual Test for the Pie-Chart
     */
    public PieChartTest() {
        super(SplitPane.ORIENTATION_HORIZONTAL, new Extent(250, Extent.PX));
        setStyleName("DefaultResizable");

        ButtonColumn controlsColumn = new ButtonColumn();
        controlsColumn.setStyleName("TestControlsColumn");
        add(controlsColumn);

        pieChart = new PieChart();
        pieChart.setWidth(300);
        pieChart.setHeight(200);
        pieChart.setShowLegend(true);
        Font font = new Font(Font.SERIF, Font.ITALIC, new Extent(10));
        pieChart.setFont(font);
        pieChart.setForeground(Color.ORANGE);
        pieChart.setShowLegend(true);
        pieChart.setShowPopUp(true);
        pieChart.setDoAnimation(true);
        pieChart.setSectorAbbrevShow(false);
        pieChart.setDoClientSorting(false);

        pieChart.setFallbackSectorColor0(Color.DARKGRAY);
        pieChart.setFallbackSectorColor1(Color.ORANGE);
        pieChart.setFallbackSectorColor2(Color.MAGENTA);

        pieChart.setPieModel(getPieModelDefault());

        pieChart.addPieSectorSelectListener(new PieSectorSelectListener() {
            public void sectorSelection(PieSectorSelectEvent e) {
                System.out.println("You selected: SectorName:'" + e.getPieSector().getName() + "' SectorValue:'" + e.getPieSector().getValue() +
                        "' Defined UserObject:'" + e.getPieSector().getUserObject() + "'");
            }
        });

        add(pieChart);

        // -- sectors ---
        controlsColumn.add(new Label("Different number of sectors"));
        controlsColumn.addButton("Default PieModel", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                pieChart.setPieModel(getPieModelDefault());
            }
        });

        controlsColumn.addButton("PieModel with more sectors", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                pieChart.setPieModel(getPieModel_MoreSectors());
            }
        });

        controlsColumn.addButton("set PieModel to 'null'", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                pieChart.setPieModel(null);
            }
        });

        // --- color ---
        controlsColumn.add(new Label("sector color"));
        controlsColumn.addButton("Random Background-Color ", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                pieChart.setBackground(StyleUtil.randomColor());
            }
        });

        // --- width/height ---
        controlsColumn.add(new Label("Width/Height"));
        controlsColumn.addButton("Width: 200 ", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                pieChart.setWidth(200);
            }
        });
        controlsColumn.addButton("Width: 300", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                pieChart.setWidth(300);
            }
        });

        controlsColumn.addButton("Width: 400", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                pieChart.setWidth(400);
            }
        });
        controlsColumn.addButton("Height: 200", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                pieChart.setHeight(200);
            }
        });
        controlsColumn.addButton("Height: 300", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                pieChart.setHeight(300);
            }
        });
        controlsColumn.addButton("Height: 400", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                pieChart.setHeight(400);
            }
        });

        // Popup-Styling
        controlsColumn.add(new Label("Popup-Styling"));
        controlsColumn.addButton("Random border-color", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                setRandomBorderColor();
            }
        });

        controlsColumn.addButton("Random background-color", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                setRandomBackgroundColor();
            }
        });

        controlsColumn.addButton("Random foreground-color", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                setRandomForegroundColor();
            }
        });

        controlsColumn.addButton("Random font", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                setRandomFont();
            }
        });

        // --- Legend ---
        controlsColumn.add(new Label("Legend-Position"));
        controlsColumn.addButton("Legend: EAST", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                pieChart.setLegendPosition(Location.EAST);
            }
        });
        controlsColumn.addButton("Legend: SOUTH", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                pieChart.setLegendPosition(Location.SOUTH);
            }
        });
        controlsColumn.addButton("Legend: NORTH - Not yet supported!", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                pieChart.setLegendPosition(Location.NORTH);
            }
        });
        controlsColumn.addButton("Legend: WEST - Not yet supported!", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                pieChart.setLegendPosition(Location.WEST);
            }
        });

        controlsColumn.addButton("Random legend-Color", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                pieChart.setForeground(StyleUtil.randomColor());
            }
        });
        controlsColumn.addButton("Random legend-Font", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                pieChart.setFont(StyleUtil.randomFont());
            }
        });
        controlsColumn.addButton("LegendGap:default '1.2'", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                pieChart.setLegendGapFactor(1.2);
            }
        });
        controlsColumn.addButton("LegendGap: '0.8'", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                pieChart.setLegendGapFactor(0.8);
            }
        });
        controlsColumn.addButton("LegendGap:default '2'", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                pieChart.setLegendGapFactor(2);
            }
        });
        // -- Abbreviation ---
        controlsColumn.add(new Label("Abbreviation"));
        controlsColumn.addButton("Toggle Abbreviation ON/OFF", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                pieChart.setSectorAbbrevShow(!pieChart.isSectorAbbrevShow());
            }
        });
        // -- animation ---
        controlsColumn.add(new Label("Animation"));
        controlsColumn.addButton("Toggle animation ON/OFF", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                pieChart.setDoAnimation(!pieChart.isDoAnimation());
            }
        });
        controlsColumn.addButton("AnimationType: ELASTIC", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                pieChart.setAnimationType(AnimationType.ELASTIC);
            }
        });
        controlsColumn.addButton("AnimationType: BOUNCE", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                pieChart.setAnimationType(AnimationType.BOUNCE);
            }
        });
        controlsColumn.addButton("AnimationType: BACK_OUT", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                pieChart.setAnimationType(AnimationType.BACK_OUT);
            }
        });

        // -- sorting --
        controlsColumn.add(new Label("Client sorting"));
        controlsColumn.addButton("Toggle clientSorting", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                pieChart.setDoClientSorting(!pieChart.isDoClientSorting());
            }
        });


    }

    private PieModel getPieModelDefault() {
        PieSector sector_1 = new PieSector("Foo", 50, "value: 50", Color.GREEN, "My UserObject for Foo");
        PieSector sector_2 = new PieSector("Bar", 80, "Hi there \n The value is 80", Color.RED, "My UserObject for Bar");
        return new PieModel(new PieSector[]{sector_1, sector_2});
    }

    private PieModel getPieModel_MoreSectors() {
        PieSector sector_1 = new PieSector("Test", 70, "Test", "T", null, Color.LIGHTGRAY, null);
        PieSector sector_2 = new PieSector("Blubber", 20, "Blubber", "Bl", null, null);
        PieSector sector_3 = new PieSector("Bar", 150, "Bar", "Ba", null, null);
        PieSector sector_4 = new PieSector("Foo", 0, "Bar", "Ba", null, Color.WHITE, null);
        return new PieModel(new PieSector[]{sector_1, sector_2, sector_3, sector_4});
    }

    private void setRandomBorderColor() {
        pieChart.setPopupBorderColor(StyleUtil.randomBrightColor());
    }

    private void setRandomBackgroundColor() {
        pieChart.setPopupBackground(StyleUtil.randomBrightColor());
    }

    private void setRandomForegroundColor() {
        pieChart.setPopupForeground(StyleUtil.randomBrightColor());
    }

    private void setRandomFont() {
        pieChart.setPopupFont(StyleUtil.randomFont());
    }

}
