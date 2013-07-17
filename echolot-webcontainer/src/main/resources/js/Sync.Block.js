/**
 * Column alike component: a layout container which renders its content in a single
 * vertical column of cells. May contain zero or more child components. Does not
 * support pane components as children.
 *
 * @sp {#Border} border the border displayed around the entire column
 * @sp {#Extent} cellSpacing the extent margin between cells of the column
 * @sp {#Insets} insets the inset margin between the column border and its cells
 *
 * @ldp {#Alignment} alignment the alignment of the child component within its
 *      cell
 * @ldp {#Color} background the background of the child component's cell
 * @ldp {#FillImage} backrgoundImage the background image of the child
 *      component's cell
 * @ldp {#Extent} height the height of the child component's cell
 * @ldp {#Insets} insets the insets margin of the child component's cell (this
 *      inset is added to any inset set on the container component)
 */
exxcellent.Block = Core.extend(Echo.Component, {

    $load: function () {
        Echo.ComponentFactory.registerType("exxcellent.Block", this);
    },

    /** @see Echo.Component#componentType */
    componentType: "exxcellent.Block"
});

/**
 * Component rendering peer: Block (Column)
 */
exxcellent.BlockSync = Core.extend(Echo.Sync.ArrayContainer, {

    $load: function () {
        Echo.Render.registerPeer("exxcellent.Block", this);
    },

    /** @see Echo.Render.ComponentSync#cellElementNodeName */
    cellElementNodeName: "div",

    /** @see Echo.Sync.ArrayContainer#prevFocusKey */
    prevFocusKey: 38,

    /** @see Echo.Sync.ArrayContainer#prevFocusFlag */
    prevFocusFlag: Echo.Render.ComponentSync.FOCUS_PERMIT_ARROW_UP,

    /** @see Echo.Sync.ArrayContainer#nextFocusKey */
    nextFocusKey: 40,

    /** @see Echo.Sync.ArrayContainer#nextFocusFlag */
    nextFocusFlag: Echo.Render.ComponentSync.FOCUS_PERMIT_ARROW_DOWN,

    /** @see Echo.Render.ComponentSync#renderAdd */
    renderAdd: function (update, parentElement) {
        this.element = this.containerElement = document.createElement("div");
        this.element.id = this.component.renderId;
        this.element.style.outlineStyle = "none";
        this.element.tabIndex = "-1";

        Echo.Sync.renderComponentDefaults(this.component, this.element);
        Echo.Sync.Border.render(this.component.render("border"), this.element);
        Echo.Sync.Insets.render(this.component.render("insets"), this.element, "padding");

        this.cellSpacing = Echo.Sync.Extent.toPixels(this.component.render("cellSpacing"), false);
        if (this.cellSpacing) {
            this.spacingPrototype = document.createElement("div");
            this.spacingPrototype.style.height = this.cellSpacing + "px";
            this.spacingPrototype.style.fontSize = "1px";
            this.spacingPrototype.style.lineHeight = "0";
        }

        this.renderAddChildren(update);

        parentElement.appendChild(this.element);
    },

    /** @see Echo.Sync.ArrayContainer#renderChildLayoutData */
    renderChildLayoutData: function (child, cellElement) {
        var layoutData = child.render("layoutData");
        if (layoutData) {
            Echo.Sync.Color.render(layoutData.background, cellElement, "backgroundColor");
            Echo.Sync.FillImage.render(layoutData.backgroundImage, cellElement);
            Echo.Sync.Insets.render(layoutData.insets, cellElement, "padding");
            Echo.Sync.Alignment.render(layoutData.alignment, cellElement, true, this.component);

            if (layoutData.marginLeft) {
                cellElement.style.marginLeft = layoutData.marginLeft;
            }
            if (layoutData.marginRight) {
                cellElement.style.marginRight = layoutData.marginRight;
            }
            if (layoutData.marginTop) {
                cellElement.style.marginTop = layoutData.marginTop;
            }
            if (layoutData.marginBottom) {
                cellElement.style.marginBottom = layoutData.marginBottom;
            }
            if (layoutData.width) {
                cellElement.style.width = Echo.Sync.Extent.toPixels(layoutData.width, false) + "px";
            }
            if (layoutData.height) {
                cellElement.style.height = Echo.Sync.Extent.toPixels(layoutData.height, false) + "px";
            }
            if (layoutData.floating) {
                // all major browsers use float? no cssFloat, since float became a reserved word in js.
                cellElement.style.cssFloat = layoutData.floating;
                // IE wants its own float var name
                cellElement.style.styleFloat = layoutData.floating;
            }
        }
    }
});