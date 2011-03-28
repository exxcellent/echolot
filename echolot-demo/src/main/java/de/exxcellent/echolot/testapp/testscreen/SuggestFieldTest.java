/*
 * This file (SuggestFieldTest.java) is part of the Echolot Project (hereinafter "Echolot").
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

import de.exxcellent.echolot.app.SuggestField;
import de.exxcellent.echolot.event.ServerFilterTriggerEvent;
import de.exxcellent.echolot.event.SuggestItemSelectEvent;
import de.exxcellent.echolot.listener.ServerFilterListener;
import de.exxcellent.echolot.listener.SuggestItemSelectListener;
import de.exxcellent.echolot.model.SuggestItem;
import de.exxcellent.echolot.model.SuggestModel;
import de.exxcellent.echolot.testapp.ButtonColumn;
import de.exxcellent.echolot.testapp.ComponentsTestApp;
import de.exxcellent.echolot.testapp.StyleUtil;
import de.exxcellent.echolot.testapp.Styles;
import nextapp.echo.app.*;
import nextapp.echo.app.event.ActionEvent;
import nextapp.echo.app.event.ActionListener;

/**
 * TestClass for the suggestField
 *
 * @author Ralf Enderle
 */
public class SuggestFieldTest extends SplitPane {
    private SuggestField suggestField;
    private SuggestModel suggestModel;

    private String _input;
    ComponentsTestApp app;
    private TaskQueueHandle taskQueueHandle;
    //private ServerFilterTask enqueTask;

    private ApplicationInstance active;

    public SuggestFieldTest() {
        super(SplitPane.ORIENTATION_HORIZONTAL, new Extent(250, Extent.PX));
        setStyleName("DefaultResizable");

        ButtonColumn controlsColumn = new ButtonColumn();
        controlsColumn.setStyleName("TestControlsColumn");
        add(controlsColumn);
        Row r = new Row();

        suggestField = new SuggestField();

        setDefaultSuggestField();
        setSuggestModel_FooBar();


        // -- Models ---
        controlsColumn.add(new Label("Models"));
        controlsColumn.addButton("Model: FooBar (default)", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                setSuggestModel_FooBar();
            }
        });
        controlsColumn.addButton("Model: Cities", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                setSuggestModel_Cities();
            }
        });

        // -- Config ---
        controlsColumn.add(new Label("Config"));
        controlsColumn.addButton("Add ServerFilter (Filter will take your Input an add it with a random Number to the Model)", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                addServerFilter();
            }
        });

        controlsColumn.addButton("Add SelectionListener (you will see selection in system.out)", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                addSelectionListener();
            }
        });

        controlsColumn.addButton("Toggle: Show description", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                toggleShowDescription();
            }
        });

                controlsColumn.addButton("Toggle: Grow left", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                toggleGrowLeft();
            }
        });

        // -- Styling ---
        controlsColumn.add(new Label("Styling"));
        controlsColumn.addButton("Toggle Magnifier", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                toggleMagnifier();
            }
        });

        controlsColumn.addButton("Random SuggestFont", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                setRandomSuggestFont();
            }
        });
        controlsColumn.addButton("Random SuggestForeground", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                setRandomSuggestForeground();
            }
        });

        controlsColumn.addButton("Random DescriptionFont", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                setRandomDescriptionFont();
            }
        });
        controlsColumn.addButton("Random DescriptiontForeground", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                setRandomDescriptionForeground();
            }
        });

        controlsColumn.addButton("Random SuggestAreaColor", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                setRandomSuggestAreaColor();
            }
        });
        controlsColumn.addButton("Random SuggestAreaHover", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                setRandomSuggestAreaHover();
            }
        });

        r.add(suggestField);
        r.add(new CheckBox("blub"));
        Button b = new Button("Click me...");
        b.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                System.out.println("Hey, you clicked the button...!");
                System.out.println(getTextFieldContent());
            }
        });
        r.add(b);

        final TextField tf = new TextField();
        r.add(tf);

        Button b2 = new Button("Click me...");
        b2.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                System.out.println("Hey, you clicked the button2...!");
                System.out.println(tf.getText());
            }
        });
        r.add(b2);

        add(r);
    }

    private String getTextFieldContent() {
        return suggestField.getText();
    }


    private void addSelectionListener() {
        suggestField.addSuggestItemSelectListener(new SuggestItemSelectListener() {
            public void suggestItemSelected(SuggestItemSelectEvent suggestItemSelectEvent) {
                System.out.println("SuggestItemSelectEvent occurred: You selected " + suggestItemSelectEvent.getSuggestItem().getLabel());
            }
        });

        suggestField.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                System.out.println("Event occured: " + e);
            }
        });
    }

    private void addServerFilter() {
        suggestField.setDoServerFilter(true);
        suggestField.addServerFilterListener(new ServerFilterListener() {
            public void serverFilter(ServerFilterTriggerEvent serverFilterTriggerEvent) {
                System.out.println("Trigger Serverfilter with! Input value: '" + serverFilterTriggerEvent.getInputData() + "'");
                addSomeContent_long(serverFilterTriggerEvent.getInputData());
            }
        });
    }

    private void toggleShowDescription() {
        suggestField.setShowDescription(!suggestField.isShowDescription().booleanValue());
    }

        private void toggleGrowLeft() {
        suggestField.setGrowLeft(!suggestField.isGrowLeft());
    }

    private void setDefaultSuggestField() {
        suggestField.setDelay(100);
        suggestField.setDoServerFilter(false);
        suggestField.setMagnifierImg(new FillImage(Styles.ICON_24_MAGNIFIER));
        suggestField.setLoadingImg(new FillImage(Styles.ICON_24_LOAD));
        suggestField.setShowDescription(true);
    }


    private void setSuggestModel_FooBar() {
        SuggestItem suggestItem_1 = new SuggestItem("Foo 1");
        SuggestItem suggestItem_2 = new SuggestItem("Foo 2");
        SuggestItem suggestItem_3 = new SuggestItem("Foo 3");
        SuggestItem suggestItem_4 = new SuggestItem("Foo 4");
        SuggestItem suggestItem_5 = new SuggestItem("Bar 1");
        SuggestItem suggestItem_6 = new SuggestItem("Bar 2");
        SuggestItem suggestItem_7 = new SuggestItem("Bar 3");
        suggestItem_1.setDescription("Description");
        suggestItem_2.setDescription("Description");
        suggestItem_3.setDescription("Description");
        suggestItem_4.setDescription("Description");
        suggestItem_5.setDescription("Description");
        suggestItem_6.setDescription("Description");
        suggestItem_7.setDescription("Description");
        suggestModel = new SuggestModel(new SuggestItem[]{
                suggestItem_1,
                suggestItem_2,
                suggestItem_3,
                suggestItem_4,
                suggestItem_5,
                suggestItem_6,
                suggestItem_7

        });
        suggestField.setSuggestModel(suggestModel);
    }

    private void setSuggestModel_Cities() {
        SuggestItem suggestItem_1 = new SuggestItem("New York");
        SuggestItem suggestItem_2 = new SuggestItem("Los Angeles");
        SuggestItem suggestItem_3 = new SuggestItem("Berlin");
        SuggestItem suggestItem_4 = new SuggestItem("Munich");
        SuggestItem suggestItem_5 = new SuggestItem("Paris");
        SuggestItem suggestItem_6 = new SuggestItem("Amsterdam");
        SuggestItem suggestItem_7 = new SuggestItem("Rom");
        SuggestItem suggestItem_8 = new SuggestItem("Washington");
        SuggestItem suggestItem_9 = new SuggestItem("London");
        SuggestItem suggestItem_10 = new SuggestItem("Dublin");
        SuggestItem suggestItem_11 = new SuggestItem("Bukarest");
        SuggestItem suggestItem_12 = new SuggestItem("Peking");
        suggestItem_1.setDescription("Description");
        suggestItem_3.setDescription("Description");
        suggestItem_1.setDescription("Description");
        suggestItem_7.setDescription("Description");
        suggestItem_8.setDescription("Description");
        suggestItem_9.setDescription("Description");
        suggestItem_11.setDescription("Description");
        suggestModel = new SuggestModel(new SuggestItem[]{
                suggestItem_1,
                suggestItem_2,
                suggestItem_3,
                suggestItem_4,
                suggestItem_5,
                suggestItem_6,
                suggestItem_7,
                suggestItem_8,
                suggestItem_9,
                suggestItem_10,
                suggestItem_11,
                suggestItem_12

        });
        suggestField.setSuggestModel(suggestModel);
    }

    private void toggleMagnifier() {
        if (suggestField.getMagnifierImg() != null) {
            suggestField.setMagnifierImg(null);
        } else {
            suggestField.setMagnifierImg(new FillImage(Styles.ICON_24_MAGNIFIER));
        }
    }

    private void setRandomDescriptionForeground() {
        suggestField.setDescriptionForeground(StyleUtil.randomColor());
    }

    private void setRandomDescriptionFont() {
        suggestField.setDescriptionFont(StyleUtil.randomFont());
    }

    private void setRandomSuggestForeground() {
        suggestField.setSuggestForeground(StyleUtil.randomColor());
    }

    private void setRandomSuggestAreaColor() {
        suggestField.setSuggestAreaColor(StyleUtil.randomColor());
    }

    private void setRandomSuggestAreaHover() {
        suggestField.setSuggestAreaHover(StyleUtil.randomColor());
    }

    private void setRandomSuggestFont() {
        suggestField.setSuggestFont(StyleUtil.randomFont());
    }

    // callback-hook for the listener

    private void addSomeContent_long(String input) {
        System.out.println("Callback triggered for input " + input);
        _input = input;

        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            throw new IllegalStateException(e);
        }

        SuggestItem newItem = new SuggestItem(input + Math.round(Math.random() * 1000));
        SuggestItem[] oldItems = suggestModel.getSuggestItems();
        SuggestItem[] newItems = new SuggestItem[oldItems.length + 1];
        System.arraycopy(oldItems, 0, newItems, 0, oldItems.length);
        newItems[newItems.length - 1] = newItem;

        suggestModel = new SuggestModel(newItems);
        suggestField.setSuggestModel(suggestModel);
    }

//    private void addSomeContent(String input) {
//        //System.out.println(input);
//
//        //return;
//
////        active =  ApplicationInstance.getActive();
//        _input = input;
////
//        app = ComponentsTestApp.getApp();
//        taskQueueHandle = app.createTaskQueue();
//        Thread t = new Thread(this);
//        t.start();
//        //ServerFilterTask task = new ServerFilterTask(input);
//        //task.run();
//
//    }
//
//    private void hookStart(String input) {
//        // ApplicationInstance.setActive(active);
//        SuggestItem newItem = new SuggestItem(input + Math.round(Math.random() * 1000));
//        SuggestItem[] oldItems = suggestModel.getSuggestItems();
//        SuggestItem[] newItems = new SuggestItem[oldItems.length + 1];
//        System.arraycopy(oldItems, 0, newItems, 0, oldItems.length);
//        newItems[newItems.length - 1] = newItem;
//
//        suggestModel = new SuggestModel(newItems);
//        //suggestField.setSuggestModel(suggestModel);
//
//        enqueTask = new ServerFilterTask(suggestModel);
//        app.enqueueTask(taskQueueHandle, enqueTask);
//    }
//
//    private void hookEnd() {
//
//        //taskQueueHandle = ComponentsTestApp.getApp().createTaskQueue();
//        //enqueTask = new ServerFilterTask(suggestModel);
//        ComponentsTestApp.getApp().removeTaskQueue(taskQueueHandle);
//    }
//
//    public void run() {
//        try {
//            Thread.sleep(2000);
//        } catch (InterruptedException e) {
//            e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
//        }
//
//
//        hookStart(_input);
//
//    }
//
//
//    private class ServerFilterTask implements Runnable {
//        private final SuggestModel suggestModel;
//
//        public ServerFilterTask(SuggestModel suggestModel) {
//            this.suggestModel = suggestModel;
//        }
//
//        public void run() {
//            suggestField.setSuggestModel(suggestModel);
//            hookEnd();
//        }
//    }
}
