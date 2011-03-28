/*
 * This file (SpinButton.java) is part of the Echolot Project (hereinafter "Echolot").
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

package de.exxcellent.echolot.app;

import java.util.EventListener;

import nextapp.echo.app.Component;
import nextapp.echo.app.FillImage;
import nextapp.echo.app.event.ActionEvent;
import nextapp.echo.app.event.ActionListener;

public class SpinButton extends Component{
	public static final String ACTION_LISTENERS_CHANGED_PROPERTY = "actionListeners";
	public static final String ACTION_COMMAND_CHANGED_PROPERTY = "actionCommand";
	public static final String INPUT_ACTION = "action";

	public static final String PROPERTY_BACKGROUND_IMAGE = "backgroundImage";
    public static final String VALUE_CHANGED_PROPERTY = "value";
    
    private String actionCommand;

    private int value;
    
    public SpinButton() {
        super();
    }
    
    public FillImage getBackgroundImage() {
        return (FillImage) get(PROPERTY_BACKGROUND_IMAGE);
    }
    
    public int getValue() {
        return value;
    }
    
    public void setBackgroundImage(FillImage newValue) {
        set(PROPERTY_BACKGROUND_IMAGE, newValue);
    }
    
    public void setValue(int newValue) {
        int oldValue = value;
        value = newValue;
        firePropertyChange(VALUE_CHANGED_PROPERTY, new Integer(oldValue), new Integer(newValue));
    }

    public void processInput(String inputName, Object inputValue) {
        super.processInput(inputName, inputValue);
        if (VALUE_CHANGED_PROPERTY.equals(inputName)) {
            Integer value = (Integer) inputValue;
            setValue(value == null ? 0 : value.intValue());
        } else if (INPUT_ACTION.equals(inputName)) {
            fireAction();
        }
    }

    public void addActionListener(ActionListener l) {
        getEventListenerList().addListener(ActionListener.class, l);
        firePropertyChange(ACTION_LISTENERS_CHANGED_PROPERTY, null, l);
    }

    public void removeActionListener(ActionListener l) {
        getEventListenerList().removeListener(ActionListener.class, l);
        firePropertyChange(ACTION_LISTENERS_CHANGED_PROPERTY, l, null);
    }
    
    public boolean hasActionListeners() {
        return hasEventListenerList() 
                && getEventListenerList().getListenerCount(ActionListener.class) > 0;
    }
    
    public String getActionCommand() {
        return actionCommand;
    }

    public void setActionCommand(String newValue) {
        String oldValue = actionCommand;
        actionCommand = newValue;
        firePropertyChange(ACTION_COMMAND_CHANGED_PROPERTY, oldValue, newValue);
    }

    private void fireAction() {
        EventListener[] actionListeners 
                = getEventListenerList().getListeners(ActionListener.class);
        ActionEvent e = new ActionEvent(this, getActionCommand());
        for (int i = 0; i < actionListeners.length; ++i) {
            ((ActionListener) actionListeners[i]).actionPerformed(e);
        }
    }

}
