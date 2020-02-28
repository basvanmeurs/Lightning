import Layout from "./layout/FlexLayouter";
import FlexNode from "./FlexNode";
import { SpacingMode } from "./layout/SpacingCalculator";
import FlexUtils from "./layout/FlexUtils";

export type AlignItemsMode = "flex-start" | "flex-end" | "center" | "stretch";

export type JustifyContentMode =
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-between"
    | "space-around"
    | "space-evenly";

export type AlignContentMode = SpacingMode;

export default class FlexContainer {
    public horizontal: boolean = true;
    public reverse: boolean = false;

    public layout: Layout = new Layout(this);
    private _wrap: boolean = false;
    private _alignItems: AlignItemsMode = "stretch";
    private _justifyContent: JustifyContentMode = "flex-start";
    private _alignContent: AlignContentMode = "flex-start";

    private _paddingLeft: number = 0;
    private _paddingTop: number = 0;
    private _paddingRight: number = 0;
    private _paddingBottom: number = 0;

    constructor(public readonly node: FlexNode) {}

    private _changedDimensions() {
        this.node.forceLayout();
    }

    changedContents() {
        this.node.changedContents();
    }

    get direction() {
        return (this.horizontal ? "row" : "column") + (this.reverse ? "-reverse" : "");
    }

    set direction(f) {
        if (this.direction === f) return;

        this.horizontal = f === "row" || f === "row-reverse";
        this.reverse = f === "row-reverse" || f === "column-reverse";

        this.changedContents();
    }

    set wrap(v) {
        this._wrap = v;
        this.changedContents();
    }

    get wrap() {
        return this._wrap;
    }

    get alignItems() {
        return this._alignItems;
    }

    set alignItems(v: AlignItemsMode) {
        if (this._alignItems === v) return;

        this._alignItems = v;

        this.changedContents();
    }

    get alignContent() {
        return this._alignContent;
    }

    set alignContent(v: AlignContentMode) {
        if (this._alignContent === v) return;
        this._alignContent = v;

        this.changedContents();
    }

    get justifyContent() {
        return this._justifyContent;
    }

    set justifyContent(v: JustifyContentMode) {
        if (this._justifyContent === v) return;

        this._justifyContent = v;

        this.changedContents();
    }

    set padding(v) {
        this.paddingLeft = v;
        this.paddingTop = v;
        this.paddingRight = v;
        this.paddingBottom = v;
    }

    get padding() {
        return this.paddingLeft;
    }

    set paddingLeft(v) {
        this._paddingLeft = v;
        this._changedDimensions();
    }

    get paddingLeft() {
        return this._paddingLeft;
    }

    set paddingTop(v) {
        this._paddingTop = v;
        this._changedDimensions();
    }

    get paddingTop() {
        return this._paddingTop;
    }

    set paddingRight(v) {
        this._paddingRight = v;
        this._changedDimensions();
    }

    get paddingRight() {
        return this._paddingRight;
    }

    set paddingBottom(v) {
        this._paddingBottom = v;
        this._changedDimensions();
    }

    get paddingBottom() {
        return this._paddingBottom;
    }

    getHorizontalPadding() {
        return this.node.getTotalPadding(true);
    }

    getVerticalPadding() {
        return this.node.getTotalPadding(false);
    }

    getHorizontalPaddingOffset() {
        return FlexUtils.getPaddingOffset(this.node, true);
    }

    getVerticalPaddingOffset() {
        return FlexUtils.getPaddingOffset(this.node, false);
    }

}
