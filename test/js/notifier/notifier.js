/**
 * Notifier jquery plugin.
 * Inspired by noticeMsg 1.0 (http://hiromitz.jimdo.com/)
 *
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * Depends:
 *   jquery.js, Version >1.3.2
 *
 * Copyright (c) 2010 Echolot (echolot.assembla.com)
 *
 * KNOWN ISSUES:
 * - jquery 1.3.2: the message div might not fade out (but directly disappear)
 */
(function($){
    $.addNotifier = function(e, msgopt) {
        var POS_CENTER = 'center';
        var POS_TOPRIGHT = 'topright';
        var POS_BOTTOMRIGHT = 'bottomright';
        var POS_BOTTOMLEFT = 'bottomleft';
        var POS_TOPLEFT = 'topleft';
        var POS_BOTTOMCENTER = 'bottomcenter';
        var POS_TOPCENTER = 'topcenter';

        var NTF_CONTAINER = 'ntf-container';
        var NTF_CLOSE = "ntfClose";

        var msg = {};
        var defaults = {
            title: "", // title: 'Warning'
            text: "",  // text: 'Just a warning'
            icon: false, // icon: 'alert.png'
            position: POS_CENTER, // the class of the notifier position (center|topright|bottomright)
            width: 300, // the width of the message box
            height: false, // the height of the message box
            duration: 4000, // time the message will be shown before it disappears
            sticky: false, // if 'true' the message will disappear only on click
            humanized: false, // if 'true' the message will disappear on mouse move            
            hoverInterrupt: true, // if 'true' the message will not fade if the user hovers the message (with the mouse)
            fade: 'slow', // the speed of the disappear animation
            background: '#333333', // the background color of the message box
            border: 'white solid 2px', //the border surrounding the message box
            padding: '5px', // the insets surrounding the message box
            hFont: {
                color: 'white',
                sizePx: 14,
                face: 'Helvetica,Arial,sans-serif',
                weight: 'bold'
            },
            pFont: { // the font used for the text
                color: 'white',
                sizePx: 10,
                face: 'Helvetica,Arial,sans-serif',
                weight: 'normal'
            },
            opacity: '0.8', // how translucent the box is (0.0 not visible to 1.0 solid)
            borderRadius: '7px', // the radius of the rounded courners,
            overlayed: false, // if true, the message will have a blocking dark overlay avoiding any interaction
            msgId: "id not set", // identifies the message (used in callbacks)
            btnShow: false, // shows a button on the notifier
            btnText: 'Details', // the text on the button
            onBtnClick: false // the function called if the user clicks the button            
        };
        // merge defaults and options without modifying the defaults
        var m = $.extend(true, msg, defaults, msgopt);

        var ntfCross = 'cursor: pointer;float: right;font-size: 12px; font-weight: bold; margin-top: -4px; padding: 2px; text-decoration: none; text-shadow: 0 1px 1px #FFFFFF;';
        var ntfClose = 'color: ' + m.hFont.color + ';';
        var tmplIconMsg = '<a id="'+NTF_CLOSE+'" href="#" style="' + ntfCross + ntfClose + '">x</a><div style="float:left;margin:0 10px 0 0"><img src="#{icon}" alt="An icon." style="float: left;"></div><h1 style="margin: 0;padding: 0;">#{title}</h1><p>#{text}</p>';
        var tmplTextMsg = '<a id="'+NTF_CLOSE+'" href="#" style="' + ntfCross + ntfClose + '">x</a><h1 style="text-align: center;margin: 0;padding: 0;">#{title}</h1><p style="text-align: left;">#{text}</p>';

        var n = {
            oDiv: null, // the overlay div
            container: null, // the body or whatever
            mDiv: null, // the message div
            gDiv: null, // the global div for stacking messages
            btnDiv: null, // a custom button

            /* Creates and shows a message on the container component. */
            showMsg: function(tpl, params) {
                // replace template values
                var msgHtml = tpl.replace(/#(?:\{|%7B)(.*?)(?:\}|%7D)/g, function($1, $2){
                    return ($2 in params) ? params[$2] : '';
                });

                n.mDiv = document.createElement('div'); // create message
                $(n.mDiv).html(msgHtml).hide();

                if (m.overlayed) { // create overlay
                    n.oDiv = document.createElement("div");                    
                    document.body.appendChild(n.oDiv);
                }
                if (m.btnShow) { // a button under the message
                    n.btnDiv = document.createElement("input");
                    n.btnDiv.type = "button";
                    n.btnDiv.value = m.btnText;                    
                    n.mDiv.appendChild(n.btnDiv);

                    if (m.onBtnClick) {
                        $(n.btnDiv).bind('click', function() {
                            m.onBtnClick.call(this, m.msgId);
                        });
                    }                    
                }

                n.styleMsg();

                n.gDiv.appendChild(n.mDiv);

                $(n.mDiv).fadeIn(m.fade).bind('click', function() {doRemove();});
                if (m.humanized) {
                   $(document).bind('mousemove', function() {doRemove();});
                }

                if (!m.sticky) {
                   var timingId = setTimeout(doRemove, m.duration);
                   if (m.hoverInterrupt) {
                        $(n.mDiv).bind('mouseover', function() {doStopFading(timingId);});
                   }
                }
            },
            /* Styles the message applying all style properties. */
            styleMsg: function() {
                var mDiv = $(n.mDiv);
                var gDiv = $(n.gDiv);
                if (m.overlayed) {
                    gDiv.css({'z-index' :32767});
                    $(n.oDiv).css({
                        'position': 'absolute', 'bottom': 0, 'right': 0,                        
                        'top': 0, 'left': 0, 'display': 'block',
                        'z-index': 32766, 'opacity': '0.5', 'background': '#000000'
                    });
                }

                if (m.position === POS_CENTER || m.position === POS_TOPCENTER || m.position === POS_BOTTOMCENTER) {
                    gDiv.css({
                            'margin-left': -(m.width / 2), 'position': 'absolute', 'left': '50%'});
                    if (m.position === POS_CENTER) {
                        gDiv.css({'top': '50%'});
                        if (m.height) {
                            gDiv.css('margin-top', -(m.height / 2));
                        } else {
                            // okay this can be optimized: the algorithm to calculate the height
                            // calculate content height = ((text.length*font.size)/width)*font.size
                            var cHeight = Math.round(((m.text.length*m.pFont.sizePx)/m.width)*m.pFont.sizePx);
                            gDiv.css('margin-top', -(cHeight / 2));
                        }
                    } else if (m.position === POS_TOPCENTER) {
                        gDiv.css({'top': '7px'});
                    } else if (m.position === POS_BOTTOMCENTER) {
                        gDiv.css({'bottom': '7px'});
                    }
                } else if (m.position === POS_TOPRIGHT) {
                    gDiv.css({
                        'position': 'absolute', 'float': 'right', 'top': '7px', 'right': '7px'});
                } else if (m.position === POS_TOPLEFT) {
                    gDiv.css({
                        'position': 'absolute', 'float': 'left', 'top': '7px', 'left': '7px'});
                } else if (m.position === POS_BOTTOMRIGHT) {
                    gDiv.css({
                        'position': 'absolute', 'float': 'right', 'bottom': '20px', 'right': '7px'});
                } else if (m.position === POS_BOTTOMLEFT) {
                    gDiv.css({
                        'position': 'absolute', 'float': 'left', 'bottom': '20px', 'left': '7px'});
                }
                mDiv.css({
                        'overflow': 'auto',
                        'background': m.background, 'border': m.border,
                        'padding': m.padding,
                        'opacity': m.opacity,'-moz-opacity': m.opacity,'filter': 'alpha(opacity=' + m.opacity * 100 + ')',
                        'border-radius': m.borderRadius,'-o-border-radius': m.borderRadius, '-moz-border-radius': m.borderRadius,'-webkit-border-radius': m.borderRadius,
                        '-moz-box-shadow': '0 0 6px #000','-webkit-box-shadow': '0 0 6px #000','box-shadow': '0 0 6px #000',
                        'width': m.width});
                if (m.height) {
                    mDiv.css('height', m.height);
                }
                if (!m.sticky) {
                    $("#"+NTF_CLOSE, n.mDiv).hide();
                }
                $('p', n.mDiv).css({'color': m.pFont.color, 'font-size': m.pFont.sizePx + "px",
                    'font-family': m.pFont.face, 'font-weight': m.pFont.weight});
                $('h1', n.mDiv).css({'color': m.hFont.color, 'font-size': m.hFont.sizePx + "px",
                    'font-family': m.hFont.face, 'font-weight': m.hFont.weight});
            },

            /* Removes the message and destroys the message and event listener.*/
            remove: function() {
                $(n.mDiv).fadeOut(m.fade, function() {
                    $(n.mDiv).unbind('click').remove();
                    // remove the global div (gDiv) if no children are left
                    if (!n.gDiv.hasChildNodes()) {
                        $(n.gDiv).remove();
                    }                                        
                });

            }
        }; // --- EOF Notifier declaration (n)

        function doRemove() {
            if ($(n.mDiv).is(":visible")) {
                n.remove();
            }
            if (m.humanized) {
                $(document).unbind('mouseover');
            }
            if ($(n.oDiv).is(":visible")) {
                $(n.oDiv).remove();
            }
        }
        function doStopFading(timingId) {
            clearTimeout(timingId);
            $("#"+NTF_CLOSE, n.mDiv).show();
        }
        // init divs
        n.container = e == window || e == document ? document.body : e;

        // find an old 'gDiv' to use (for stacking)
        n.gDiv = $('div.' + NTF_CONTAINER + m.position, n.container).get(0);
        if (!n.gDiv) {
            n.gDiv = document.createElement('div');
            $(n.gDiv).addClass(NTF_CONTAINER + m.position);
            $(n.container).append(n.gDiv);
        }

        // show message by choosing the correct template
        if (m.icon) {
            n.showMsg(tmplIconMsg, m);
        } else {
            n.showMsg(tmplTextMsg, m);
        }
    };

    $.fn.notifier = function(msg) {
       return this.each( function() {
           $.addNotifier(this, msg);
       });
    };
})(jQuery);
