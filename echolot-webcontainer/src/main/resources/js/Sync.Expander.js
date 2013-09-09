/*
 * This file (Sync.Expander.js) is part of the Echolot Project (hereinafter "Echolot").
 * Copyright (C) 2008-2011 eXXcellent Solutions GmbH.
 *
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 */

/**
 * Expander component: A container which has either one or two children. It renders a section
 * line with an optional title at the top of its content. The content can be hidden and shown by
 * clicking the header. The first child is shown by default.
 * May contain one or two child component. Doesn't support a pane component as a child.
 */
exxcellent.Expander = Core.extend(Echo.Component, {

    $load: function () {
        Echo.ComponentFactory.registerType("exxcellent.Expander", this);
    },

    /** Properties defined for this component. */
    $static: {
        HIDE_TEXT: "hideText",
        HIDE_IMAGE: "hideImage",

        SHOW_TXT: "showText",
        SHOW_IMAGE: "showImage",

        TITLE: "title",
        SPEED: "speed",
        ROLLOVER_BORDER: "rolloverBorder",
        ROLLOVER_FOREGROUND: "rolloverForeground",
        ROLLOVER_BACKGROUND: "rolloverBackground",
        ROLLOVER_BACKGROUND_IMAGE: "rolloverBackgroundImage",

        TITLE_FOREGROUND: "titleForeground",
        TITLE_FONT: "titleFont",
        TITLE_INSETS: "titleInsets",
        TITLE_POSITION: "titlePosition",

        HEADER_BACKGROUND: "headerBackground",
        HEADER_BACKGROUND_IMAGE: "headerBackgroundImage",
        HEADER_BORDER: "headerBorder",
        HEADER_HEIGHT: "headerHeight",
        HEADER_INSETS: "headerInsets",

        BORDER: "border",
        INSETS: "insets",

        ICON_TEXT_MARGIN_TOP: "iconTextMarginTop",
        ICON_TEXT_MARGIN: "iconTextMargin",
        ICON_TEXT_FOREGROUND: "iconTextForeground",
        ICON_TEXT_FONT: "iconTextFont",

        FOCUSED_BACKGROUND: "focusedBackground",
        FOCUSED_BACKGROUND_IMAGE: "focusedBackgroundImage",
        FOCUSED_BORDER: "focusedBorder",

        CONTENT_TOGGLED: "contentToggled",
        SHOW: "show",
        HEADER_HIDE: "headerHide"
    },

    /** @see Echo.Component#componentType */
    componentType: "exxcellent.Expander",
    focusable: true,

    /**
     * Performed after the expander toggled the content.
     * @param shown true if the the visible child is shown. Otherwise false if no or the second child is shown.
     */
    doContentToggled: function (shown) {
        this.fireEvent({
            type: exxcellent.Expander.CONTENT_TOGGLED,
            source: this,
            data: shown
        });
    }
});

/**
 * Component rendering peer: Expander.
 */
exxcellent.ExpanderSync = Core.extend(Echo.Render.ComponentSync, {

    /** Default rendering values used when component does not specify a property value. */
    $static: {
        DEFAULTS: {
            headerInsets: "0px",
            titleInsets: "0px",
            iconTextMarginRL: "5px",
            iconTextMarginTop: "10px",
            showInitially: true,
            headerHide: false
        },
        _supportedPartialProperties: [
            exxcellent.Expander.SHOW]
    },

    $load: function () {
        Echo.Render.registerPeer("exxcellent.Expander", this);
    },

    _div: null,  // Main outer DIV element containing the echo renderId.
    _mDiv: null, // The title section containg the title and arrow thing.
    _showDiv: null, // the first child div content.
    _showRenderID: null, // holds a reference to the renderID mainly to identify the components during update replacemnt
    _hideDiv: null, // the second child div content.
    _hideRenderID: null, // holds a reference to the renderID mainly to identify the components during update replacemnt
    _imgSpn: null, // the image span containing the fold/ collapse image.
    _txtDiv: null, // the text span containing the fold/ collapse text.
    _titleDiv: null, // the title div
    _shown: null, // the state of the expander. True if the first child is shown, otherwise false.


    /** @see Echo.Render.ComponentSync#renderAdd */
    renderAdd: function (update, parentElement) {
        this._div = document.createElement("div");
        this._div.id = this.component.renderId;
        this._div.tabIndex = "0";// because of "0" it will take part in the focus cycle, otherwise "-1"
        this._div.style.outlineStyle = "none";
        this._div.style.overflow = "hidden";

        Echo.Sync.renderComponentDefaults(this.component, this._div);
        Echo.Sync.Border.render(this.component.render(exxcellent.Expander.BORDER), this._div);
        Echo.Sync.Insets.render(this.component.render(exxcellent.Expander.INSETS), this._div, "padding");

        // register events
        Core.Web.Event.add(this._div, "keydown", Core.method(this, this._processKeyPress), false);
        Core.Web.Event.add(this._div, "focus", Core.method(this, this._processFocus), false);
        Core.Web.Event.add(this._div, "blur", Core.method(this, this._processBlur), false);

        if (!this.component.render(exxcellent.Expander.HEADER_HIDE)) {
            this._renderHeader(update);
        }
        this._renderChildren(update);

        parentElement.appendChild(this._div);
    },

    /**
     * Renders the interactive header and registers the events used for rollover and click events.
     * @param update used for incremental renderUpdate
     */
    _renderHeader: function (update) {
        this._mDiv = document.createElement("div");
        this._mDiv.style.cursor = "pointer";

        var headerHeight = this.component.render(exxcellent.Expander.HEADER_HEIGHT);
        Echo.Sync.Extent.render(headerHeight, this._mDiv, "height", false, false);
        Echo.Sync.Border.render(this.component.render(exxcellent.Expander.HEADER_BORDER), this._mDiv);
        Echo.Sync.Insets.render(this.component.render(exxcellent.Expander.HEADER_INSETS,
            exxcellent.ExpanderSync.DEFAULTS.headerInsets), this._mDiv, "padding");

        this._titleDiv = document.createElement("div");
        this._renderTitle(update);

        var titlePos = this.component.render(exxcellent.Expander.TITLE_POSITION);
        this._titleDiv.style.cssFloat = titlePos === "left" ? "left" : "right";
        this._titleDiv.style.styleFloat = titlePos === "left" ? "left" : "right";

        function mouseOverHeader() {
            this._rolloverHeader(true);
        }

        function mouseOutHeader() {
            this._rolloverHeader(false);
        }

        Core.Web.Event.add(this._mDiv, "click", Core.method(this, this._toggleContent), false);
        Core.Web.Event.add(this._mDiv, "mouseover", Core.method(this, mouseOverHeader), false);
        Core.Web.Event.add(this._mDiv, "mouseout", Core.method(this, mouseOutHeader), false);

        var isLeft = titlePos === "left";
        this._txtDiv = document.createElement("div");
        this._txtDiv.style.cssFloat = isLeft ? "right" : "left";
        this._txtDiv.style.styleFloat = isLeft ? "right" : "left";
        // img span spacing depending on postion (left right)
        var iconTextMarginTop = Echo.Sync.Extent.toCssValue(
            this.component.render(exxcellent.Expander.ICON_TEXT_MARGIN_TOP,
                exxcellent.ExpanderSync.DEFAULTS.iconTextMarginTop), false, false);
        var iconTextMarginRL = Echo.Sync.Extent.toCssValue(
            this.component.render(exxcellent.Expander.ICON_TEXT_MARGIN,
                exxcellent.ExpanderSync.DEFAULTS.iconTextMarginRL), true, false);
        this._txtDiv.style.margin = isLeft
            ? iconTextMarginTop + " " + iconTextMarginRL + " 0 0"
            : iconTextMarginTop + " 0 0 " + iconTextMarginRL;

        Echo.Sync.Font.render(this.component.render(exxcellent.Expander.ICON_TEXT_FONT), this._txtDiv);
        Echo.Sync.Color.render(this.component.render(exxcellent.Expander.ICON_TEXT_FOREGROUND), this._txtDiv, "color");

        var imgDiv = document.createElement("div");
        imgDiv.style.cssFloat = isLeft ? "right" : "left";
        imgDiv.style.styleFloat = isLeft ? "right" : "left"; // IE used styleFloat...
        imgDiv.style.margin = iconTextMarginTop + " 0 0 0";

        this._imgSpn = document.createElement("span");
        this._imgSpn.style.display = "block";
        this._imgSpn.style.width = "10px";
        this._imgSpn.style.height = "10px";
        this._imgSpn.style.margin = "0 0 -5px 0"; // top right bottom left

        imgDiv.appendChild(this._imgSpn);

        this._mDiv.appendChild(this._titleDiv);
        this._mDiv.appendChild(imgDiv);
        this._mDiv.appendChild(this._txtDiv);

        this._div.appendChild(this._mDiv);

        // initially the 'action' hint text is hidden
        $(this._txtDiv).hide();

        // to enable all visual effects on the header we perform a static rollover
        this._rolloverHeader(false);
    },

    /**
     * Renders the title from the 3rd component in the components array.
     * @param update
     */
    _renderTitle: function (update) {
        var titleChild = this.component.getComponent(2);

        // Either render a simple text node including font and color style
        if (!titleChild) {
            var titleTxt = this.component.render(exxcellent.Expander.TITLE);
            this._titleDiv.appendChild(document.createTextNode(titleTxt));
            Echo.Sync.Insets.render(this.component.render(exxcellent.Expander.TITLE_INSETS,
                exxcellent.ExpanderSync.DEFAULTS.titleInsets), this._titleDiv, "padding");
            Echo.Sync.Font.render(this.component.render(exxcellent.Expander.TITLE_FONT), this._titleDiv);
            Echo.Sync.Color.render(this.component.render(exxcellent.Expander.TITLE_FOREGROUND), this._titleDiv, "color");
        } else {
            // Render the 3rd child component as title

            this._renderContent(titleChild, this._titleDiv, update, this._div);
        }


    },

    /**
     * Renders the children of this Container. The container handles only one or two children.
     * The initially visible child is depending on the visible_child_idx property. The first child is
     * always the one shown by default.
     * <ul>
     *  <li>If two children exists, the first child is shown by default. A click on the header will hide the first child and show the second child.</li>
     *  <li>If only one child is provided, this child will be visible by default. A click on the header will hide the child.</li>
     * </ul>
     * @param update the update from the renderUpdate and renderAdd method.
     */
    _renderChildren: function (update) {
        this._showDiv = document.createElement("div"); // mandatory - shown child
        this._showDiv.style.overflow = "auto";
        this._showDiv.style.clear = "both";
        this._hideDiv = document.createElement("div"); // optional - hide child - may be empty

        var showInit = this.component.render(exxcellent.Expander.SHOW, exxcellent.ExpanderSync.DEFAULTS.showInitially);
        var showChild = this.component.getComponent(0);
        this._renderContent(showChild, this._showDiv, update, this._div);
        this._showRenderID = showChild.renderId;
        if (this.component.getComponentCount() > 1) {
            var hideChild = this.component.getComponent(1);
            this._renderContent(hideChild, this._hideDiv, update, this._div);
            this._hideRenderID = hideChild.renderId;
            if (!showInit) {
                $(this._showDiv).hide();
            } else {
                $(this._hideDiv).hide();
            }
        } else {
            if (!showInit) {
                $(this._showDiv).hide();
            }
        }
        this._shown = showInit;
        this._toggleHeader(showInit);
    },

    /**
     * Renders the header rollover effect. This is usually used to give the user some
     * feedback that the header is interactive, e.g. can be clicked.
     * @param rolloverState if true the rollover effect is applied otherwise its removed
     */
    _rolloverHeader: function (rolloverState) {
        var foreground = Echo.Sync.getEffectProperty(this.component,
            exxcellent.Expander.TITLE_FOREGROUND, exxcellent.Expander.ROLLOVER_FOREGROUND, rolloverState);
        var background = Echo.Sync.getEffectProperty(this.component,
            exxcellent.Expander.HEADER_BACKGROUND, exxcellent.Expander.ROLLOVER_BACKGROUND, rolloverState);
        var backgroundImage = Echo.Sync.getEffectProperty(
            this.component, exxcellent.Expander.HEADER_BACKGROUND_IMAGE,
            exxcellent.Expander.ROLLOVER_BACKGROUND_IMAGE, rolloverState);
        var border = Echo.Sync.getEffectProperty(this.component,
            exxcellent.Expander.HEADER_BORDER, exxcellent.Expander.ROLLOVER_BORDER, rolloverState);

        Echo.Sync.Color.renderClear(foreground, this._titleDiv, "color");
        Echo.Sync.Color.renderClear(foreground, this._mDiv, "color");
        Echo.Sync.Color.renderClear(background, this._mDiv, "backgroundColor");
        Echo.Sync.FillImage.renderClear(backgroundImage, this._mDiv, "backgroundImage");
        Echo.Sync.Border.renderClear(border, this._mDiv);

        $(this._txtDiv).toggle(rolloverState);
    },

    /**
     * Toggles the header showing the action hint (fold or collapse) text and image
     * according the current visible child.
     * @param hide if true the hide text and image is shown
     */
    _toggleHeader: function (hide) {
        if (this.component.render(exxcellent.Expander.HEADER_HIDE)) {
            return;
        }
        $(this._txtDiv).empty();
        if (hide) {
            this._txtDiv.appendChild(document.createTextNode(this.component.render(exxcellent.Expander.HIDE_TEXT)));
            Echo.Sync.FillImage.render(this.component.render(exxcellent.Expander.HIDE_IMAGE), this._imgSpn);
        } else {
            this._txtDiv.appendChild(document.createTextNode(this.component.render(exxcellent.Expander.SHOW_TXT)));
            Echo.Sync.FillImage.render(this.component.render(exxcellent.Expander.SHOW_IMAGE), this._imgSpn);
        }
    },

    /**
     * Toggles the content from the showDiv to the hideDiv and vice versa.
     */
    _toggleContent: function () {
        var self = this;
        var speed = this.component.render(exxcellent.Expander.SPEED);
        // determine the visible and invisible div
        var visibleDiv = this._shown ? this._showDiv : this._hideDiv;
        var invisibleDiv = this._shown ? this._hideDiv : this._showDiv;

        function showInvisible() {

            // toggle the shown index
            self._shown = !self._shown;
            // sync the component value to reflect the current state
            self.component.set(exxcellent.Expander.SHOW, self._shown);
            self._onContentToggled(self._shown);
            self._toggleHeader(self._shown);

            if (invisibleDiv.innerHTML === "") {
                $(invisibleDiv).toggle();
            } else {
                $(invisibleDiv).slideToggle(speed);
            }

        }

        if (visibleDiv.innerHTML === "") {
            // if there is only one child don't animate the showing of nothing (looks just as a delay)
            $(visibleDiv).toggle(0, showInvisible);
        } else {
            $(visibleDiv).slideToggle(speed, showInvisible);
        }
    },

    /**
     * Renders a content (child) of the Expander.
     *
     * @param {Element} child the child element that shall be rendered
     * @param {Element} div DOM DIV element used to render the content inside
     * @param {Echo.Update.ComponentUpdate} update the update
     * @param {Element} parentElement the element to which the content should be appended
     */
    _renderContent: function (child, div, update, parentElement) {

        this._renderChildLayoutData(child, div);
        Echo.Render.renderComponentAdd(update, child, div);

        parentElement.appendChild(div);
    },

    /**
     * Renderes a content replacement of some Elements
     *
     * @param update
     */
    _renderContentReplaced: function (update) {
        var removedChildList = update.getRemovedChildren();
        var addedChildList = update.getAddedChildren();
        if (removedChildList && addedChildList) {
            // we can only handle one removment one time
            var newChild = addedChildList[0];
            var removedChild = removedChildList[0];
            if (this._hideRenderID == removedChild.renderId) {
                // dispose old
                $(this._hideDiv).empty(); // clear div
                Echo.Render.renderComponentDispose(update, removedChild);
                $(this._hideDiv).empty(); // clear div
                // add new
                this._renderContent(newChild, this._hideDiv, update, this._div);
                this._hideRenderID = newChild.renderId;
            } else if (this._showRenderID == removedChild.renderId) {
                // dispose old
                $(this._showDiv).empty(); // clear div
                Echo.Render.renderComponentDispose(update, removedChild);
                $(this._showDiv).empty(); // clear div
                // add new
                this._renderContent(newChild, this._showDiv, update, this._div);
                this._showRenderID = newChild.renderId;
            }
        }
    },

    /** @see Echo.Sync.ArrayContainer#renderChildLayoutData */
    _renderChildLayoutData: function (child, cellElement) {
        var layoutData = child.render("layoutData");
        if (layoutData) {
            Echo.Sync.Color.render(layoutData.background, cellElement, "backgroundColor");
            Echo.Sync.FillImage.render(layoutData.backgroundImage, cellElement);
            Echo.Sync.Insets.render(layoutData.insets, cellElement, "padding");
            Echo.Sync.Alignment.render(layoutData.alignment, cellElement, true, this.component);
            if (layoutData.height) {
                cellElement.style.height = Echo.Sync.Extent.toPixels(layoutData.height, false) + "px";
            }
        }
    },

    /** @see Echo.Render.ComponentSync#renderDispose */
    renderDispose: function (update) {
        this._mDiv = null;
        this._showDiv = null;
        this._showRenderID = null;
        this._hideDiv = null;
        this._hideRenderID = null;
        this._imgSpn = null;
        this._txtDiv = null;
        this._showState = null;
        this._div = null;
    },

    /** @see Echo.Render.ComponentSync#renderUpdate */
    renderUpdate: function (update) {
        var fullRender = !Core.Arrays.containsAll(exxcellent.ExpanderSync._supportedPartialProperties,
            update.getUpdatedPropertyNames(), true);

        if (fullRender) {
            var element = this._div;
            var containerElement = element.parentNode;
            Echo.Render.renderComponentDispose(update, update.parent);
            containerElement.removeChild(element);
            this.renderAdd(update, containerElement);
            return true; // Child elements are supported: safe to return true.
        } else {
            // if it's not yet a full render, check if some childs have been added or removed
            if (update.hasRemovedChildren || update.hasAddedChildren) {
                this._renderContentReplaced(update);
            }
            if (update.hasUpdatedProperties()) {
                var visibleIdxUpdate = update.getUpdatedProperty(exxcellent.Expander.SHOW);
                if (visibleIdxUpdate) {
                    // toggle if the state is different
                    if (this._shown !== visibleIdxUpdate.newValue) {
                        this._toggleContent();
                    }
                }
            }
            return false; // no update on the children
        }
    },

    /** Event triggered after the expander toggled the content.*/
    _onContentToggled: function (shown) {
        this.component.doContentToggled(shown);
        return false;
    },

    /** @see Echo.Render.ComponentSync#getFocusFlags */
    getFocusFlags: function () {
        return Echo.Render.ComponentSync.FOCUS_PERMIT_ARROW_ALL;
    },

    /** @see Echo.Render.ComponentSync#renderFocus */
    renderFocus: function () {
        this._renderFocusStyle(true);
        Core.Web.DOM.focusElement(this._div);
        //this.client.application.setFocusedComponent(this.component);
    },

    _processFocus: function (e) {
        if (!this.client || !this.client.verifyInput(this.component)) {
            return true;
        }
        this.client.application.setFocusedComponent(this.component);
    },

    /** Processes a focus blur event. */
    _processBlur: function (e) {
        this._renderFocusStyle(false);
    },

    _renderFocusStyle: function (focusState) {
        // Render default focus aesthetic.
        this._rolloverHeader(focusState);

        // render focus stuff (iv available)
        var background = Echo.Sync.getEffectProperty(this.component, exxcellent.Expander.HEADER_BACKGROUND, exxcellent.Expander.FOCUSED_BACKGROUND, focusState);
        var backgroundImage = Echo.Sync.getEffectProperty(
            this.component, exxcellent.Expander.HEADER_BACKGROUND_IMAGE,
            exxcellent.Expander.FOCUSED_BACKGROUND_IMAGE, focusState);
        var border = Echo.Sync.getEffectProperty(this.component, exxcellent.Expander.HEADER_BORDER, exxcellent.Expander.FOCUSED_BORDER, focusState);

        Echo.Sync.Color.renderClear(background, this._mDiv, "backgroundColor");
        Echo.Sync.FillImage.renderClear(backgroundImage, this._mDiv, "backgroundImage");
        Echo.Sync.Border.renderClear(border, this._mDiv);
    },

    /** Processes a key press event. */
    _processKeyPress: function (e) {
        // only toggle content, when a keyPress is triggered by a BOX-DIV
        if (!this.client || !this.client.verifyInput(this.component) || e.target.nodeName != 'DIV') {
            return true;
        }
        if (e.keyCode === 13 || e.keyCode === 40 || e.keyCode === 38
            || e.keyCode === 37 || e.keyCode === 39) {
            this._toggleContent();
            return true;
        } else {
            return true;
        }
    }
});
