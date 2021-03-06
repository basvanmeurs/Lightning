export default class HtmlTreeBuilder {
    constructor(item) {
        this._item = item;
        this._colorIndex = 0;
    }

    getHtmlTree() {
        this._colorIndex = 0;
        return this._transformItemToHtmlRecursive(this._item);
    }

    _transformItemToHtmlRecursive(item) {
        const div = document.createElement("div");

        this._applyItemHtml(item, div);

        if (item.hasFlexLayout()) {
            const layout = item.layout;
            if (layout.isFlexItemEnabled()) {
                this._applyFlexItemHtml(layout.flexItem, div);
            }

            if (layout.isFlexEnabled()) {
                this._applyFlexContainerHtml(layout.flex, div);
            }
        }

        if (!item.isDisplayed()) {
            div.style.display = "none";
        }

        return div;
    }

    _applyItemHtml(item, div) {
        div.style.display = "block";
        div.style.position = "relative";

        div.style.backgroundColor = this._getColor();

        if (item.hasFlexLayout()) {
            if (item.getSourceW() || (item.layout.isFlexEnabled() && !item.layout.flexParent)) {
                // If root-level, then width must be explicitly set to 0px (which is not true for height).
                div.style.width = item.getSourceW() + "px";
            }

            if (item.getSourceH()) {
                div.style.height = item.getSourceH() + "px";
            }
        } else {
            // Absolute positioning.
            div.style.width = item.w + "px";
            div.style.height = item.h + "px";
            div.style.position = "absolute";
        }
        div.style.left = item.x + "px";
        div.style.top = item.y + "px";

        while (div.firstChild) {
            div.removeChild(div.firstChild);
        }

        const children = item.children;
        children.forEach(childItem => {
            div.appendChild(this._transformItemToHtmlRecursive(childItem));
        });
    }

    _getColor() {
        return HtmlTreeBuilder._colors[this._colorIndex++ % HtmlTreeBuilder._colors.length];
    }

    _applyFlexContainerHtml(flex, div) {
        div.style.display = "flex";
        div.style.position = "relative";
        div.style.flexDirection = flex.direction;
        div.style.flexWrap = flex.wrap ? "wrap" : "nowrap";
        div.style.alignItems = flex.alignItems;
        div.style.alignContent = flex.alignContent;
        div.style.justifyContent = flex.justifyContent;

        div.style.paddingLeft = flex.paddingLeft + "px";
        div.style.paddingTop = flex.paddingTop + "px";
        div.style.paddingRight = flex.paddingRight + "px";
        div.style.paddingBottom = flex.paddingBottom + "px";
    }

    _applyFlexItemHtml(flexItem, div) {
        div.style.flexGrow = flexItem.grow;
        div.style.flexShrink = flexItem.shrink;
        div.style.alignSelf = flexItem.alignSelf;

        if (flexItem.minWidth && flexItem.node.flexParent) {
            div.style.minWidth = flexItem.minWidth;
        }

        if (flexItem.minHeight && flexItem.node.flexParent) {
            div.style.minHeight = flexItem.minHeight;
        }
    }
}

HtmlTreeBuilder._colors = [
    "#e6194b",
    "#3cb44b",
    "#ffe119",
    "#4363d8",
    "#f58231",
    "#911eb4",
    "#46f0f0",
    "#f032e6",
    "#bcf60c",
    "#fabebe",
    "#008080",
    "#e6beff",
    "#9a6324",
    "#fffac8",
    "#800000",
    "#aaffc3",
    "#808000",
    "#ffd8b1",
    "#000075",
    "#808080",
    "#ffffff",
    "#000000"
];
