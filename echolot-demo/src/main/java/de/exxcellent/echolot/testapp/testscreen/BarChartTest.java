/*
 * This file (BarChartTest.java) is part of the Echolot Project (hereinafter "Echolot").
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

import de.exxcellent.echolot.app.BarChart;
import de.exxcellent.echolot.event.BarSelectEvent;
import de.exxcellent.echolot.listener.BarSelectListener;
import de.exxcellent.echolot.model.Bar;
import de.exxcellent.echolot.model.BarChartModel;
import de.exxcellent.echolot.model.BarType;
import de.exxcellent.echolot.model.ChartOrientation;
import de.exxcellent.echolot.testapp.ButtonColumn;
import de.exxcellent.echolot.testapp.StyleUtil;
import nextapp.echo.app.Color;
import nextapp.echo.app.Extent;
import nextapp.echo.app.Label;
import nextapp.echo.app.SplitPane;
import nextapp.echo.app.event.ActionEvent;
import nextapp.echo.app.event.ActionListener;

/**
 * Testclass for the barChart
 *
 * @author Ralf Enderle <r.enderle@exxcellent.de>
 */
public class BarChartTest extends SplitPane {

    private BarChart barChart;

    /**
     * Constructor
     */
    public BarChartTest() {
        super(SplitPane.ORIENTATION_HORIZONTAL, new Extent(250, Extent.PX));
        setStyleName("DefaultResizable");

        ButtonColumn controlsColumn = new ButtonColumn();
        controlsColumn.setStyleName("TestControlsColumn");
        add(controlsColumn);

        barChart = new BarChart();
        setBarChart_1();
        setBarChartModel_1();

        // Listener
        barChart.addBarSelectListener(new BarSelectListener() {
            public void barSelection(BarSelectEvent barSelectEvent) {
                System.out.println("You clicked Bar with Label: " + barSelectEvent.getBar().getLabel() + " \n Value: " + barSelectEvent.getBar().getValue() + " Identifier was: " + barSelectEvent.getBar().getIdentifier());
            }
        });

        add(barChart);

        // -- Models ---
        controlsColumn.add(new Label("Different BarChartModel"));

        controlsColumn.addButton("BarChart == 'null'", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                setBarChartModelToNull();
            }
        });
        controlsColumn.addButton("Default BarChart", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                setBarChart_1();
                setBarChartModel_1();

            }
        });

        controlsColumn.addButton("extended BarChart", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                setBarChart_1();
                setBarChartModel_2();

            }
        });

        // -- Allignemnt ---
        controlsColumn.add(new Label("Allignemnt"));
        controlsColumn.addButton("vertical", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                setAlignemnt(ChartOrientation.VERTICAL);
            }
        });
        controlsColumn.addButton("horizontal", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                setAlignemnt(ChartOrientation.HORIZONTAL);
            }
        });

        // -- Layout ---
        controlsColumn.add(new Label("Layout"));
        controlsColumn.addButton("width +50", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                updateWidth(+50);
            }
        });
        controlsColumn.addButton("width -50", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                updateWidth(-50);
            }
        });
        controlsColumn.addButton("height +50", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                updateHeight(+50);
            }
        });
        controlsColumn.addButton("height -50", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                updateHeight(-50);
            }
        });
        controlsColumn.addButton("xGap +10", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                updateXGap(+10);
            }
        });
        controlsColumn.addButton("xGap -10", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                updateXGap(-10);
            }
        });
        controlsColumn.addButton("yGap +10", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                updateYGap(+10);
            }
        });
        controlsColumn.addButton("yGap -10", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                updateYGap(-10);
            }
        });

        // -- Styling---
        controlsColumn.add(new Label("Styling"));
        controlsColumn.addButton("Toggle - showTooltip", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                toggleShowTooltip();
            }
        });

        controlsColumn.addButton("Toggle - showPopup", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                toggleShowPop();
            }
        });
        controlsColumn.addButton("Toggle - autoAdjustPopup", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                toggleAutoAdjustPopUp();
            }
        });
        controlsColumn.addButton("Toggle - isStacked", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                toggleIsStacked();
            }
        });
        controlsColumn.addButton("Random background-color", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                setRandomBackgroundColor();
            }
        });

        // -- Bar Head-Styling---
        controlsColumn.add(new Label("Bar Head-Styling"));
        controlsColumn.addButton("round )", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                setBarType(BarType.ROUND);
            }
        });

        controlsColumn.addButton("sharp >", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                setBarType(BarType.SHARP);
            }
        });
        controlsColumn.addButton("soft ]", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                setBarType(BarType.SOFT);
            }
        });
        controlsColumn.addButton("square |", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                setBarType(BarType.SQUARE);
            }
        });

        // Popup-Styling
        controlsColumn.add(new Label("Popup-Styling"));
        controlsColumn.addButton("Random border-color", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                setRandomPopupBorderColor();
            }
        });

        controlsColumn.addButton("Random background-color", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                setRandomPopupBackgroundColor();
            }
        });

        controlsColumn.addButton("Random foreground-color", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                setRandomPopupForegroundColor();
            }
        });

        controlsColumn.addButton("Random font", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                setRandomPopupFont();
            }
        });
    }

    private void setBarChart_1() {
        barChart.setWidth(300);
        barChart.setHeight(300);
        barChart.setXgap(1);
        barChart.setYgap(1);

        barChart.setShowPopup(false);
        barChart.setShowTooltip(false);
        barChart.setAutoAdjustPopup(false);
        barChart.setStacked(false);
    }

    private void setBarChartModelToNull() {
        barChart.setBarChartModel(null);
    }

    private void setBarChartModel_1() {
        Bar bar_1 = new Bar(20, "Test", Color.BLUE);
        Bar bar_2 = new Bar(30, "Test", Color.DARKGRAY);
        Bar bar_3 = new Bar(40, "Test", Color.LIGHTGRAY);

        Bar bar_4 = new Bar(20, "Test", Color.BLUE);
        Bar bar_5 = new Bar(50, "Test", Color.LIGHTGRAY);
        Bar bar_6 = new Bar(10, "Test");

        Bar[][] barArray = {
                new Bar[]{
                        bar_1,
                        bar_2,
                        bar_3
                },
                new Bar[]{
                        bar_4,
                        bar_5,
                        bar_6
                }

        };

        barChart.setBarChartModel(new BarChartModel(barArray));
    }

    private void setBarChartModel_2() {
        Bar bar_1 = new Bar(20, "Test 1", Color.LIGHTGRAY);
        Bar bar_2 = new Bar(30, "Test 2", Color.DARKGRAY);
        Bar bar_3 = new Bar(40, "Test 3", Color.CYAN);
        Bar bar_4 = new Bar(20, "Test 4", Color.RED);
        Bar bar_5 = new Bar(50, "Foo", Color.CYAN);
        Bar bar_6 = new Bar(10, "Bar", Color.DARKGRAY);
        Bar bar_7 = new Bar(45, "Test", Color.MAGENTA);
        Bar bar_8 = new Bar(78, "Test Blub", Color.LIGHTGRAY);
        Bar bar_9 = new Bar(12, "Foo", Color.CYAN);
        Bar bar_10 = new Bar(40, "FooBar", Color.BLUE);
        Bar bar_11 = new Bar(10, "Bla", Color.BLACK);

        Bar[][] barArray = {
                new Bar[]{
                        bar_1,
                        bar_2,
                        bar_3,
                        bar_4
                },
                new Bar[]{
                        bar_5,
                        bar_6,
                        bar_7,
                        bar_8
                },
                new Bar[]{
                        bar_9,
                        bar_10,
                        bar_11
                }

        };

        barChart.setBarChartModel(new BarChartModel(barArray));
    }

    private void setAlignemnt(ChartOrientation orientation) {
        barChart.setBarAlignment(orientation);
    }

    private void updateXGap(int update) {
        barChart.setXgap(barChart.getXgap() + update);
    }

    private void updateYGap(int update) {
        barChart.setYgap(barChart.getYgap() + update);
    }

    private void updateWidth(int update) {
        barChart.setWidth(barChart.getWidth() + update);
    }

    private void updateHeight(int update) {
        barChart.setHeight(barChart.getHeight() + update);
    }

    private void toggleShowPop() {
        barChart.setShowPopup(!barChart.isShowPopup());
    }

    private void toggleShowTooltip() {
        barChart.setShowTooltip(!barChart.isShowTooltip());
    }

    private void toggleAutoAdjustPopUp() {
        barChart.setAutoAdjustPopup(!barChart.isAutoAdjustPopup());
    }

    private void toggleIsStacked() {
        barChart.setStacked(!barChart.isStacked());
    }

    private void setBarType(BarType barType) {
        barChart.setHeadType(barType);
    }

    private void setRandomPopupBorderColor() {
        barChart.setPopupBorderColor(StyleUtil.randomBrightColor());
    }

    private void setRandomPopupBackgroundColor() {
        barChart.setPopupBackground(StyleUtil.randomBrightColor());
    }

    private void setRandomPopupForegroundColor() {
        barChart.setPopupForeground(StyleUtil.randomBrightColor());
    }

    private void setRandomPopupFont() {
        barChart.setPopupFont(StyleUtil.randomFont());
    }

    private void setRandomBackgroundColor() {
        barChart.setBackground(StyleUtil.randomBrightColor());
    }
}
