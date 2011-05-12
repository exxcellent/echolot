/**
 * Component implementation for KeystrokeListener.
 */
exxcellent.KeystrokeListener = Core.extend(Echo.Component, {

    $load: function() {
        Echo.ComponentFactory.registerType("exxcellent.KeystrokeListener", this);
    },

    /** Properties defined for this component. */
	$static : {
		DEBUG: "debug",
		TARGET_RENDERID: "targetRenderId",
        KEY_CODE: "keyCode",
        ACTION_COMMAND: "actionCommand",
        KEYSTROKE_ACTION: "action"
    },

    componentType: "exxcellent.KeystrokeListener",
    focusable: false,


    doAction: function(actionCommand) {
        this.fireEvent({
        	type: "action",
        	source: this,
            data: this.render("actionCommand")
        });
    }


});

/**
 * Component rendering peer: KeystrokeListener.
 */
exxcellent.KeystrokeListenerSync = Core.extend(Echo.Render.ComponentSync, {

    $load: function() {
        Echo.Render.registerPeer("exxcellent.KeystrokeListener", this);
    },

    _debug: null, // use debug messages in console or not
    _span: null, // the empty component
    _all_shortcuts: null, // All the shortcuts are stored in this array

    /**
     * Describes how a component is initially built.
     */
    renderAdd: function(update, parentElement) {
        // Empty div - could be ommittet. Yet only for debugging purposes.
        this._span = document.createElement("span");
        this._span.id = this.component.renderId;
        this.component.addListener("parent", Core.method(this, this._parentChanged));

        // parentChange event -> Trigger key listener attaching 
        parentElement.appendChild(this._span);
        this._renderRequired = true;
    },

    _parentChanged : function(e) {
        if (this._debug && window.console && window.console.log) {
            console.log("KeystrokeListener : Parent changed from " + e.oldValue + " to " + e.newValue);
        }
        if (e.newValue == null) {
            this.remove_all_shortcuts();
        }
    },

    /** @see Echo.Render.ComponentSync#renderDisplay */
    renderDisplay: function() {
        if (this._renderRequired) {
            this._renderRequired = false;
            this._debug = this.component.render(exxcellent.KeystrokeListener.DEBUG);
            var keyCode = this.component.render(exxcellent.KeystrokeListener.KEY_CODE);
            var listenerTarget = this.component.render(exxcellent.KeystrokeListener.TARGET_RENDERID);
            var actionCommand = this.component.render(exxcellent.KeystrokeListener.ACTION_COMMAND);

            if (this._debug && window.console && window.console.log) {
                console.log("renderDisplay() called for: " + keyCode);
            }

            this.add_shortcut(keyCode, actionCommand, { target: listenerTarget});
        }
    },

    /**
     * Describes how the component is destroyed.
     */
    renderDispose: function(update) {
        if (this._debug && window.console && window.console.log) {
            console.log("renderDispose() called");
        }
        this.remove_all_shortcuts();
        this._span = null;
        this._all_shortcuts = null;
    },

    /**
     * Describes how a component is updated, e.g. destroyed and build again.
     */
    renderUpdate: function(update) {
        // destroy the container and add it again
        /*var element = this._div;
         var containerElement = element.parentNode;
         Echo.Render.renderComponentDispose(update, update.parent);
         containerElement.removeChild(element);
         this.renderAdd(update, containerElement);*/
        this._renderRequired = true;
        if (this._debug && window.console && window.console.log) {
            console.log("renderUpdate() called, but nothing to do.");
        }

        return false;
    },


    add_shortcut: function(shortcut_combination, actionCommand, opt) {
        //Provide a set of default options
        var default_options = {
            'type':'keydown',
            'propagate':false,
            'disable_in_input':false,
            'target':document,
            'keycode':false
        };
        if (!opt){ opt = default_options;}
        else {
            for (var dfo in default_options) {
                if (typeof opt[dfo] == 'undefined'){ opt[dfo] = default_options[dfo];}
            }
        }

        var ele;
        if (opt.target == "null" || opt.target == null) {
            ele = document;
        } else if (typeof opt.target == 'string') {
            ele = document.getElementById(opt.target);
        }
        if (!ele) {
            ele = opt.target;
        }
        shortcut_combination = shortcut_combination.toLowerCase();

        //The function to be called at keypress
        var onKeyEventFunction = function(e) {
            var keyEvent = e || window.event;
            var code;

            /*if(opt['disable_in_input']) { //Don't enable shortcut keys in Input, Textarea fields
             var element;
             if(keyEvent.target) element=keyEvent.target;
             else if(keyEvent.srcElement) element=keyEvent.srcElement;
             if(element.nodeType==3) element=element.parentNode;

             if(element.tagName == 'INPUT' || element.tagName == 'TEXTAREA') return;
             }*/

            //Find Which key is pressed
            if (keyEvent.keyCode){ code = keyEvent.keyCode;}
            else if (keyEvent.which){ code = keyEvent.which;}

            if (this._debug && window.console && window.console.log) {
                console.log('Key Event: ' + e + ' triggered keycode: ' + code);
            }
            var character = String.fromCharCode(code).toLowerCase();

            if (code === 188){ character = ",";} //If the user presses , when the type is onkeydown
            if (code === 190){ character = ".";} //If the user presses , when the type is onkeydown

            var keys = shortcut_combination.split("+");
            //Key Pressed - counts the number of valid keypresses - if it is same as the number of keys, the shortcut function is invoked
            var kp = 0;

            //Work around for stupid Shift key bug created by using lowercase - as a result the shift+num combination was broken
            var shift_nums = {
                "`":"~",
                "1":"!",
                "2":"@",
                "3":"#",
                "4":"$",
                "5":"%",
                "6":"^",
                "7":"&",
                "8":"*",
                "9":"(",
                "0":")",
                "-":"_",
                "=":"+",
                ";":":",
                "'":"\"",
                ",":"<",
                ".":">",
                "/":"?",
                "\\":"|"
            };
            //Special Keys - and their codes
            var special_keys = {
                'esc':27,
                'escape':27,
                'tab':9,
                'space':32,
                'return':13,
                'enter':13,
                'backspace':8,

                'scrolllock':145,
                'scroll_lock':145,
                'scroll':145,
                'capslock':20,
                'caps_lock':20,
                'caps':20,
                'numlock':144,
                'num_lock':144,
                'num':144,

                'pause':19,
                'break':19,

                'insert':45,
                'home':36,
                'delete':46,
                'end':35,

                'pageup':33,
                'page_up':33,
                'pu':33,

                'pagedown':34,
                'page_down':34,
                'pd':34,

                'left':37,
                'up':38,
                'right':39,
                'down':40,

                'f1':112,
                'f2':113,
                'f3':114,
                'f4':115,
                'f5':116,
                'f6':117,
                'f7':118,
                'f8':119,
                'f9':120,
                'f10':121,
                'f11':122,
                'f12':123
            };

            var modifiers = {
                shift: { wanted:false, pressed:false},
                ctrl : { wanted:false, pressed:false},
                alt  : { wanted:false, pressed:false},
                meta : { wanted:false, pressed:false}    //Meta is Mac specific
            };

            if (keyEvent.ctrlKey) {   modifiers.ctrl.pressed = true;}
            if (keyEvent.shiftKey){   modifiers.shift.pressed = true;}
            if (keyEvent.altKey)  {   modifiers.alt.pressed = true;}
            if (keyEvent.metaKey) {   modifiers.meta.pressed = true;}

            var k;
            for (var i = 0; k = keys[i], i < keys.length; i++) {
                //Modifiers
                if (k === 'ctrl' || k === 'control') {
                    kp++;
                    modifiers.ctrl.wanted = true;

                } else if (k === 'shift') {
                    kp++;
                    modifiers.shift.wanted = true;

                } else if (k === 'alt') {
                    kp++;
                    modifiers.alt.wanted = true;
                } else if (k === 'meta') {
                    kp++;
                    modifiers.meta.wanted = true;
                } else if (k.length > 1) { //If it is a special key
                    if (special_keys[k] === code){ kp++;}

                } else if (opt.keycode) {
                    if (opt.keycode === code){ kp++;}

                } else { //The special keys did not match
                    if (character === k){ kp++;}
                    else {
                        if (shift_nums[character] && keyEvent.shiftKey) { //Stupid Shift key bug created by using lowercase
                            character = shift_nums[character];
                            if (character === k){ kp++;}
                        }
                    }
                }
            }

            if (kp === keys.length &&
                    modifiers.ctrl.pressed === modifiers.ctrl.wanted &&
                    modifiers.shift.pressed === modifiers.shift.wanted &&
                    modifiers.alt.pressed === modifiers.alt.wanted &&
                    modifiers.meta.pressed === modifiers.meta.wanted) {

                this.component.doAction(actionCommand);

                if (!opt.propagate) { //Stop the event
                    //keyEvent.cancelBubble is supported by IE - this will kill the bubbling process.
                    keyEvent.cancelBubble = true;
                    keyEvent.returnValue = false;

                    //keyEvent.stopPropagation works in Firefox.
                    if (keyEvent.stopPropagation) {
                        keyEvent.stopPropagation();
                        keyEvent.preventDefault();
                    }
                    return false;
                }
            } else {
                // Kein Treffer: Event weiter von Echo dispatchen lassen.
                return true;
            }
        };
        // Save 'this' context
        onKeyEventFunction = Core.method(this, onKeyEventFunction);

        if (!this._all_shortcuts) {
            this._all_shortcuts = {};
        }
        this._all_shortcuts[shortcut_combination] = {
            'callback':onKeyEventFunction,
            'target':ele,
            'event': opt.type
        };
        //Attach the function with the event
        Core.Web.Event.add(ele, opt.type, onKeyEventFunction, false);
        if (this._debug && window.console && window.console.log) {
            console.log('Registering event: ' + opt.type + '('
                    + shortcut_combination + '->' + actionCommand + ')'
                    + ' for element:' + ele + '(type: ' + typeof ele + ')');
        }
        /*if(ele.addEventListener) ele.addEventListener(opt['type'], func, false);
         else if(ele.attachEvent) ele.attachEvent('on'+opt['type'], func);
         else ele['on'+opt['type']] = func;*/
    },

    //Remove the shortcut - just specify the shortcut and I will remove the binding
    remove_shortcut:function(shortcut_combination) {
        if (this._debug && window.console && window.console.log) {
            console.log("remove_shortcut: " + shortcut_combination);
        }
        shortcut_combination = shortcut_combination.toLowerCase();
        var binding = this._all_shortcuts[shortcut_combination];
        delete(this._all_shortcuts[shortcut_combination]);
        if (!binding){ return;}
        var type = binding.event;
        var ele = binding.target;
        var callback = binding.callback;

        /*if(ele.detachEvent) ele.detachEvent('on'+type, callback);
         else if(ele.removeEventListener) ele.removeEventListener(type, callback, false);
         else ele['on'+type] = false;*/
        Core.Web.Event.remove(ele, type, callback);
    },

    /** Remove all shortcuts . */
    remove_all_shortcuts : function(shortcut_combination) {
        var keyShortcut;
        for (keyShortcut in this._all_shortcuts) {
            if (typeof this._all_shortcuts[keyShortcut] !== 'function') {
                this.remove_shortcut(keyShortcut);
            }
        }
    }


});