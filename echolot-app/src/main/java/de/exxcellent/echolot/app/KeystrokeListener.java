/*
 * This file (KeystrokeListener.java) is part of the Echolot Project (hereinafter "Echolot").
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
import nextapp.echo.app.event.ActionEvent;
import nextapp.echo.app.event.ActionListener;

/**
 * An invisible echo component which can bind itself to a specific key combination (in the scope of a given component or
 * globally) to trigger actions. You may add {@link ActionListener} to this component to be informed if the user hits
 * the defined key combination.
 * 
 * @author Benjamin Schmid <B.Schmid@exxcellent.de>
 */
public class KeystrokeListener extends Component {
    /** the renderId of the component this listener is binded to. */
    public static final String PROPERTY_TARGET_RENDERID = "targetRenderId";
    /** the actionCommand contains the name of the triggered action. */
    public static final String PROPERTY_ACTION_COMMAND = "actionCommand";
    /** the keyCode is the key combination this component will listen to. */
    public static final String PROPERTY_KEYCODE = "keyCode";
    /** the action of this component itself. */
    public static final String KEYSTROKE_ACTION = "action";
    /** the listener changes property. triggered if the actionListener list is modified. */
    public static final String ACTION_LISTENERS_CHANGED_PROPERTY = "actionListeners";
    /** if <code>true</code> the debug mode is enabled and logs are written to the console. */
    public static final String PROPERTY_DEBUG = "debug";
    
    /**
     * Default empty constructor.
     */
    public KeystrokeListener() {
    }

    /**
     * Constructor to create the {@link KeystrokeListener} component with a defined key combination and a renderId this
     * action will be binded to.
     * 
     * @param keyCode the key combination the component will listener to, e.g. 'crtl+h'
     * @param actionCommand the name of the action triggered.
     * @param targetRenderId the renderId of the component this component will be applied to and listen.
     */
    public KeystrokeListener(final String keyCode, final String actionCommand, final String targetRenderId) {
        setKeyCode(keyCode);
        setActionCommand(actionCommand);
        setTargetRenderId(targetRenderId);
    }

    /**
     * The key combination the component will listener to, e.g. 'crtl+h'.
     * 
     * @param keyCode The key combination
     */
    public void setKeyCode(String keyCode) {
        if (keyCode == null) {
            throw new IllegalArgumentException("Illegal value '"+ keyCode + "' for attribute keyCode'");
        }
        set(PROPERTY_KEYCODE, keyCode);
    }

    /**
     * The key combination the component will listener to, e.g. 'crtl+h'.
     * 
     * @return the key combination
     */
    public String getKeyCode() {
        return (String) get(PROPERTY_KEYCODE);
    }

    /**
     * If <code>true</code> the debug mode is enabled and log messages are written to the console.
     * 
     * @param debug <code>true</code> the debug mode is enabled.
     */
    public void setDebug(boolean debug) {
        set(PROPERTY_DEBUG, debug);
    }

    /**
     * Return <code>true</code> if the debug mode is enabled and log messages are written to the console.
     * 
     * @return <code>true</code> if the debug mode is enabled.
     */
    public boolean getDebug() {
        return (Boolean) get(PROPERTY_DEBUG);
    }

    /**
     * The actionCommand is the value delivered to the client if the action is triggered.
     * 
     * @param actionCommand the value delivered to the client
     */
    public void setActionCommand(String actionCommand) {
        if (actionCommand == null) {
            throw new IllegalArgumentException("Illegal value '"+ actionCommand + "' for attribute actionCommand'");
        }
        String oldValue = getActionCommand();
        set(PROPERTY_ACTION_COMMAND, actionCommand);
        firePropertyChange(ACTION_LISTENERS_CHANGED_PROPERTY, oldValue, actionCommand);
    }

    /**
     * The actionCommand is the value delivered to the client if the action is triggered.
     * 
     * @return the actionCommand value
     */
    public String getActionCommand() {
        return (String) get(PROPERTY_ACTION_COMMAND);
    }

    /**
     * The renderId of the component this component will be applied to and listen.
     * 
     * @param targetRenderId the renderId of the component this component will be applied to and listen.
     */
    public void setTargetRenderId(String targetRenderId) {
        if (targetRenderId != null && !targetRenderId.startsWith("C.")) {
            /*
             * ECHO3 always adds an C to the renderId in servermode and
             * CL in client mode. This fix overcomes the problem not assigning 
             * the correct renderId. 
             */
            targetRenderId = "C."+targetRenderId;
        }
        set(PROPERTY_TARGET_RENDERID, targetRenderId);
    }
    
    /**
     * The renderId of the component this component will be applied to and listen.
     * 
     * @return the renderId of the component
     */
    public String getTargetRenderId() {
        return (String) get(PROPERTY_TARGET_RENDERID);
    }

    /**
     * @inheritDoc
     */
    @Override
    public void processInput(final String inputName, final Object inputValue) {
        super.processInput(inputName, inputValue);
        if (KEYSTROKE_ACTION.equals(inputName)) {
            fireAction((String) inputValue);
        }
    }
    
    /**
     * Adds the actionListener to this component, that is informed if the user triggers the keyCode.
     * 
     * @param l the listener to be added
     */
    public void addActionListener(ActionListener l) {
        getEventListenerList().addListener(ActionListener.class, l);
    }
    /**
     * Removes the actionListener from this component.
     * 
     * @param l the listener to be removed
     */
    public void removeActionListener(ActionListener l) {
        getEventListenerList().removeListener(ActionListener.class, l);
    }

    /**
     * Method to test if the component has {@link ActionListener}.
     * 
     * @return <code>true</code> if the component has {@link ActionListener}.
     */
    public boolean hasActionListeners() {
        return hasEventListenerList() && getEventListenerList().getListenerCount(ActionListener.class) > 0;
    }

    /**
     * The method to actually fire the keyCode binded action. All {@link ActionListener} will be informed.
     * 
     * @param actionCommand used in the {@link ActionEvent}.
     */
    private void fireAction(String actionCommand) {
        EventListener[] actionListeners
                = getEventListenerList().getListeners(ActionListener.class);
        ActionEvent e = new ActionEvent(this, actionCommand);
        for (int i = 0; i < actionListeners.length; ++i) {
            ((ActionListener) actionListeners[i]).actionPerformed(e);
        }
    }
    
}
