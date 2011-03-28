/*
 * This file (LineChartTest.java) is part of the Echolot Project (hereinafter "Echolot").
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

import de.exxcellent.echolot.app.LineChart;
import de.exxcellent.echolot.event.PointSelectEvent;
import de.exxcellent.echolot.listener.PointSelectListener;
import de.exxcellent.echolot.model.AxisModel;
import de.exxcellent.echolot.model.Interpolation;
import de.exxcellent.echolot.model.LineChartModel;
import de.exxcellent.echolot.model.LineChartPoint;
import de.exxcellent.echolot.testapp.ButtonColumn;
import de.exxcellent.echolot.testapp.StyleUtil;
import nextapp.echo.app.Color;
import nextapp.echo.app.Extent;
import nextapp.echo.app.Label;
import nextapp.echo.app.SplitPane;
import nextapp.echo.app.event.ActionEvent;
import nextapp.echo.app.event.ActionListener;

public class LineChartTest extends SplitPane {

    private LineChart lineChart;

    /**
     * Visual Test for the Pie-Chart
     */
    public LineChartTest() {
        super(SplitPane.ORIENTATION_HORIZONTAL, new Extent(250, Extent.PX));
        setStyleName("DefaultResizable");

        ButtonColumn controlsColumn = new ButtonColumn();
        controlsColumn.setStyleName("TestControlsColumn");
        add(controlsColumn);

        // Default
        lineChart = new LineChart();
        //setLineChart_1();
        //setLineChartModel_1();      

        setLineChart_2();
        setLineChartModel_2();

        // Listener
        lineChart.addPointSelectListener(new PointSelectListener() {
            public void pointSelection(PointSelectEvent pointSelectEvent) {
                System.out.println("You clicked Point with Label: " + pointSelectEvent.getLineChartPoint().getLabel() + " \n X/Y values::  X-Value: " + pointSelectEvent.getLineChartPoint().getxValue() + " Y-Value: " + pointSelectEvent.getLineChartPoint().getyValue());
            }
        });

        add(lineChart);


        // -- Models ---
        controlsColumn.add(new Label("Different LineChartModel"));

        controlsColumn.addButton("LineChart == 'null'", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                setLineChartModelToNull();
            }
        });

        controlsColumn.addButton("Default LineChart", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                setLineChart_1();
                setLineChartModel_1();
            }
        });
        controlsColumn.addButton("LineChart with more Nodes", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                setLineChart_2();
                setLineChartModel_2();
            }
        });


        // Layout
        controlsColumn.add(new Label("Common Layout"));
        controlsColumn.addButton("width +10", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                changeWidth(+10);
            }
        });
        controlsColumn.addButton("width -10", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                changeWidth(-10);
            }
        });
        controlsColumn.addButton("height +10", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                changeHeight(+10);
            }
        });
        controlsColumn.addButton("height -10", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                changeHeight(-10);
            }
        });


        // Scaling
        controlsColumn.add(new Label("Different Scaling"));
        controlsColumn.addButton("xMax +10", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                changeXscaleMax(+10);
            }
        });
        controlsColumn.addButton("xMax -10", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                changeXscaleMax(-10);
            }
        });
        controlsColumn.addButton("yMax +10", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                changeYscaleMax(+10);
            }
        });
        controlsColumn.addButton("yMax -10", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                changeYscaleMax(-10);
            }
        });

        // Axis
        controlsColumn.add(new Label("Different Scaling"));
        controlsColumn.addButton("AxisModel Calender", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                setAxisModel();
            }
        });

        controlsColumn.addButton("AxisModel NULL", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                setAxisModelNULL();
            }
        });

        controlsColumn.addButton("Random AxisForegroundColor", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                setRandomAxisForegroundColor();
            }
        });


        // Grid
        controlsColumn.add(new Label("Grid options"));
        controlsColumn.addButton("Toggle Grid on/off", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                toogleGridOnOff();
            }
        });
        controlsColumn.addButton("# xAxis Sector +1", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                changeXaxisSectors(+1);
            }
        });
        controlsColumn.addButton("# xAxis Sector -1", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                changeXaxisSectors(-1);
            }
        });
        controlsColumn.addButton("# yAxis Sector +1", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                changeYaxisSectors(+1);
            }
        });
        controlsColumn.addButton("# yAxis Sector -1", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                changeYaxisSectors(-1);
            }
        });
        controlsColumn.addButton("Random Gridcolor", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                setRandomGridColor();
            }
        });

        // Chart-Options
        controlsColumn.add(new Label("Line options"));
        controlsColumn.addButton("Toggle Popup on/off", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                tooglePopupOnOff();
            }
        });

        controlsColumn.addButton("Toggle FillChart on/off", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                toogleFillOnOff();
            }
        });

        controlsColumn.addButton("Random Linecolor", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                setRandomLineColor();
            }
        });

        controlsColumn.addButton("Random Dotcolor", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                setRandomDotColor();
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

        // Interpolation
        controlsColumn.add(new Label("Interpolation"));
        controlsColumn.addButton("Interpolation: NONE", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                setInterpolation(Interpolation.NONE);
            }
        });
        controlsColumn.addButton("Interpolation: LINEAR", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                setInterpolation(Interpolation.LINEAR);
            }
        });
        controlsColumn.addButton("Interpolation: BEZIER", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                setInterpolation(Interpolation.BEZIER);
            }
        });

    }


    private void setLineChart_1() {
        lineChart.setWidth(300);
        lineChart.setHeight(200);
        lineChart.setDrawGrid(true);

        lineChart.setXscaleMax(100);
        lineChart.setYscaleMax(100);

        lineChart.setXaxisSectors(10);
        lineChart.setYaxisSectors(10);

        lineChart.setShowPopup(true);
        lineChart.setPopupBackground(Color.DARKGRAY);
        lineChart.setPopupBorderColor(Color.LIGHTGRAY);
        lineChart.setPopupForeground(Color.WHITE);
        lineChart.setPopupFont(StyleUtil.randomFont());

        //lineChart.setDotColor("#383");
        lineChart.setDotColor(Color.BLUE);
        lineChart.setLineColor(Color.DARKGRAY);

        lineChart.setFillChart(true);
    }

    private void setLineChart_2() {
        lineChart.setWidth(450);
        lineChart.setHeight(300);

        lineChart.setDrawGrid(true);

        lineChart.setXscaleMax(200);
        lineChart.setYscaleMax(150);

        lineChart.setXaxisSectors(20);
        lineChart.setYaxisSectors(15);

        lineChart.setShowPopup(true);

        lineChart.setDotColor(Color.BLUE);
        lineChart.setLineColor(Color.DARKGRAY);

        lineChart.setFillChart(true);
    }

    private void setLineChartModelToNull() {
        lineChart.setLineChartModel(null);
    }

    private void setLineChartModel_1() {
        LineChartPoint point_1 = new LineChartPoint(0, 20, "Tolles Label");
        LineChartPoint point_2 = new LineChartPoint(40, 80, "Tolles Label");
        LineChartPoint point_3 = new LineChartPoint(60, 30, "Tolles Label");
        LineChartPoint point_4 = new LineChartPoint(100, 50, "Tolles Label");

        LineChartPoint[] pointArray = new LineChartPoint[]{
                point_1,
                point_2,
                point_3,
                point_4
        };

        lineChart.setLineChartModel(new LineChartModel(pointArray));
    }

    private void setLineChartModel_2() {
        LineChartPoint point_1 = new LineChartPoint(0, 20, "Tolles Label 1 \n 0/20");
        LineChartPoint point_2 = new LineChartPoint(10, 60, "Tolles Label 2 \n 10/60");
        LineChartPoint point_3 = new LineChartPoint(15, 50, "Tolles Label 3 \n 15/50");
        LineChartPoint point_4 = new LineChartPoint(25, 60, "Tolles Label 4 \n 25/60");
        LineChartPoint point_5 = new LineChartPoint(40, 80, "Tolles Label 5 \n 40/80");
        LineChartPoint point_6 = new LineChartPoint(55, 20, "Tolles Label 6 \n 55/20");
        LineChartPoint point_7 = new LineChartPoint(70, 85, "Tolles Label 7 \n 70/85");
        LineChartPoint point_8 = new LineChartPoint(80, 60, "Tolles Label 8 \n 80/60");
        LineChartPoint point_9 = new LineChartPoint(100, 50, "Tolles Label 9 \n 100/50");
        LineChartPoint point_10 = new LineChartPoint(120, 70, "Tolles Label 10 \n 120/70");
        LineChartPoint point_11 = new LineChartPoint(125, 30, "Tolles Label 11 \n 125/30");
        LineChartPoint point_12 = new LineChartPoint(140, 45, "Tolles Label 12 \n 140/45");
        LineChartPoint point_13 = new LineChartPoint(150, 80, "Tolles Label 13 \n 150/80");
        LineChartPoint point_14 = new LineChartPoint(190, 50, "Tolles Label 14 \n 190/50");
        LineChartPoint point_15 = new LineChartPoint(200, 70, "Tolles Label 15 \n 200/70");

        LineChartPoint[] pointArray = new LineChartPoint[]{
                point_1,
                point_2,
                point_3,
                point_4,
                point_5,
                point_6,
                point_7,
                point_8,
                point_9,
                point_10,
                point_11,
                point_12,
                point_13,
                point_14,
                point_15
        };

        lineChart.setLineChartModel(new LineChartModel(pointArray));
    }

    private void setAxisModel() {
        String[] xAxisValues = new String[]{"Jan", "Feb", "Mrz", "Apr"};
        String[] yAxisValues = new String[]{"a", "b", "c"};

        lineChart.setAxisModel(new AxisModel(xAxisValues, yAxisValues));
    }

    private void setAxisModelNULL() {
        lineChart.setAxisModel(null);
    }

    private void changeWidth(int factor) {
        lineChart.setWidth(lineChart.getWidth() + factor);
    }

    private void changeHeight(int factor) {
        lineChart.setHeight(lineChart.getHeight() + factor);
    }

    private void changeXscaleMax(int factor) {
        lineChart.setXscaleMax(lineChart.getXscaleMax() + factor);
    }

    private void changeYscaleMax(int factor) {
        lineChart.setYscaleMax(lineChart.getYscaleMax() + factor);
    }

    // axisOptions

    private void setRandomAxisForegroundColor() {
        lineChart.setForeground(StyleUtil.randomColor());
    }

    // grid

    private void toogleGridOnOff() {
        lineChart.setDrawGrid(!lineChart.isDrawGrid());
    }

    private void changeXaxisSectors(int factor) {
        lineChart.setXaxisSectors(lineChart.getXaxisSectors() + factor);
    }

    private void changeYaxisSectors(int factor) {
        lineChart.setYaxisSectors(lineChart.getYaxisSectors() + factor);
    }

    private void setRandomGridColor() {
        lineChart.setGridColor(StyleUtil.randomColor());
    }

    // line

    private void tooglePopupOnOff() {
        lineChart.setShowPopup(!lineChart.isShowPopup());
    }

    private void toogleFillOnOff() {
        lineChart.setFillChart(!lineChart.isFillChart());
    }

    private void setRandomLineColor() {
        lineChart.setLineColor(StyleUtil.randomBrightColor());
    }

    private void setRandomDotColor() {
        lineChart.setDotColor(StyleUtil.randomColor());
    }

    private void setInterpolation(Interpolation interpolation) {
        lineChart.setInterpolation(interpolation);
    }

    private void setRandomBorderColor() {
        lineChart.setPopupBorderColor(StyleUtil.randomBrightColor());
    }

    private void setRandomBackgroundColor() {
        lineChart.setPopupBackground(StyleUtil.randomBrightColor());
    }

    private void setRandomForegroundColor() {
        lineChart.setPopupForeground(StyleUtil.randomBrightColor());
    }

    private void setRandomFont() {
        lineChart.setPopupFont(StyleUtil.randomFont());
    }

    private String getRandomColor() {
        String color = "#";
        for (int i = 0; i < 3; i++) {
            String hexColor = Integer.toHexString((int) (Math.random() * 16));
            color = color + hexColor;
        }
        return color;
    }


}
