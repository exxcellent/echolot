/**
 * PlainHtml Version 1.0
 * Used to display different Plain html on a div.
 * You could put a static html-Document on this component or even a video within an iframe
 *
 * @author Ralf Enderle <r.enderle@exxcellent.de>
 * @version 1.0
 */
exxcellent.PlainHtml = Core.extend(Echo.Component, {
    $load: function() {
        Echo.ComponentFactory.registerType('exxcellent.PlainHtml', this);
    },

    $static: {
        HTML_TEXT: 'htmlText'
    },
    componentType: 'exxcellent.PlainHtml'
});

/**
 * Sync.PlainHtml
 *
 * PlainHtmlSync Version 1.0
 * Component rendering peer: PlainHtml
 * This sync renders plain xHTML
 *
 * @author Ralf Enderle <r.enderle@exxcellent.de>
 * @version 1.0
 */
exxcellent.PlainHtmlSync = Core.extend(Echo.Render.ComponentSync, {
    $load: function() {
        Echo.Render.registerPeer("exxcellent.PlainHtml", this);
    },

    _parentElement: null,

    /**
     * Add the containerDiv of the pie to the DOM
     * @param update
     * @param parentElement
     */
    renderAdd: function(update, parentElement) {
        if (!this._parentElement) {
            this._parentElement = parentElement;
        }
    },

    /** @see Echo.Render.ComponentSync#renderDisplay */
    renderDisplay: function() {
        var value = this.component.render(exxcellent.PlainHtml.HTML_TEXT);
        // only if there is something to set - we don't want to display 'undefined' on screen :-)
        if (value) {
            this._parentElement.innerHTML = value;
        }
    },

    /**
     * Called when the component is destroyed!
     * We clean all allocated data
     * @param update
     */
    renderDispose: function(update) {
        if (this._parentElement) {
            this._parentElement.innerHTML = "";
        }
        this._parentElement = null;
    },

    /**
     * Called when an update happens.
     *
     * @param update
     */
    renderUpdate: function(update) {
        // we just force a renderAdd
        this.renderAdd();
        return true;
    }
});
