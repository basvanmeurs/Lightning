import FlexUtils from "./layout/FlexUtils.js";
import FlexContainer, { AlignItemsMode } from "./FlexContainer";
import FlexNode from "./FlexNode";

export default class FlexItem {
    public static readonly SHRINK_AUTO = -1;

    _ctr?: FlexContainer;

    _grow: number = 0;
    _shrink: number = FlexItem.SHRINK_AUTO;
    _alignSelf?: AlignItemsMode;

    _minWidth: number = 0;
    _minHeight: number = 0;

    _maxWidth: number = 0;
    _maxHeight: number = 0;

    _marginLeft: number = 0;
    _marginTop: number = 0;
    _marginRight: number = 0;
    _marginBottom: number = 0;

    constructor(public readonly node: FlexNode) {}

    get grow() {
        return this._grow;
    }

    set grow(v: number) {
        if (this._grow === v) return;

        this._grow = v;

        this._changed();
    }

    set shrink(v: number) {
        if (this._shrink === v) return;

        this._shrink = v;

        this._changed();
    }

    get shrink() {
        if (this._shrink === FlexItem.SHRINK_AUTO) {
            return this._getDefaultShrink();
        }
        return this._shrink;
    }

    _getDefaultShrink() {
        if (this.node.isFlexEnabled()) {
            return 1;
        } else {
            // All non-flex containers are absolutely positioned items with fixed dimensions, and by default not shrinkable.
            return 0;
        }
    }

    get alignSelf(): AlignItemsMode | undefined {
        return this._alignSelf;
    }

    set alignSelf(v: AlignItemsMode | undefined) {
        if (this._alignSelf === v) return;

        if (v === undefined) {
            this._alignSelf = undefined;
        } else {
            this._alignSelf = v;
        }

        this._changed();
    }

    get minWidth() {
        return this._minWidth;
    }

    set minWidth(v) {
        this._minWidth = Math.max(0, v);
        this.node.forceLayout(true, false);
    }

    get minHeight() {
        return this._minHeight;
    }

    set minHeight(v) {
        this._minHeight = Math.max(0, v);
        this.node.forceLayout(false, true);
    }

    get maxWidth() {
        return this._maxWidth;
    }

    set maxWidth(v) {
        this._maxWidth = Math.max(0, v);
        this.node.forceLayout(true, false);
    }

    get maxHeight() {
        return this._maxHeight;
    }

    set maxHeight(v) {
        this._maxHeight = Math.max(0, v);
        this.node.forceLayout(false, true);
    }

    /**
     * @note margins behave slightly different than in HTML with regard to shrinking.
     * In HTML, (outer) margins can be removed when shrinking. In this engine, they will not shrink at all.
     */
    set margin(v) {
        this.marginLeft = v;
        this.marginTop = v;
        this.marginRight = v;
        this.marginBottom = v;
    }

    get margin() {
        return this.marginLeft;
    }

    set marginLeft(v) {
        this._marginLeft = v;
        this._changed();
    }

    get marginLeft() {
        return this._marginLeft;
    }

    set marginTop(v) {
        this._marginTop = v;
        this._changed();
    }

    get marginTop() {
        return this._marginTop;
    }

    set marginRight(v) {
        this._marginRight = v;
        this._changed();
    }

    get marginRight() {
        return this._marginRight;
    }

    set marginBottom(v) {
        this._marginBottom = v;
        this._changed();
    }

    get marginBottom() {
        return this._marginBottom;
    }

    private _changed() {
        if (this.ctr) this.ctr.changedContents();
    }

    set ctr(v: FlexContainer | undefined) {
        this._ctr = v;
    }

    get ctr(): FlexContainer | undefined {
        return this._ctr;
    }

    _resetLayoutSize() {
        this._resetHorizontalAxisLayoutSize();
        this._resetVerticalAxisLayoutSize();
    }

    _resetCrossAxisLayoutSize() {
        if (this.ctr!.horizontal) {
            this._resetVerticalAxisLayoutSize();
        } else {
            this._resetHorizontalAxisLayoutSize();
        }
    }

    _resetHorizontalAxisLayoutSize() {
        let w = this.node.getRelAxisSize(true);
        if (this._minWidth) {
            w = Math.max(this._minWidth, w);
        }
        if (this._maxWidth) {
            w = Math.min(this._maxWidth, w);
        }
        this.node.setAxisLayoutSize(true, w);
    }

    _resetVerticalAxisLayoutSize() {
        let h = this.node.getRelAxisSize(false);
        if (this._minHeight) {
            h = Math.max(this._minHeight, h);
        }
        if (this._maxHeight) {
            h = Math.min(this._maxHeight, h);
        }
        this.node.setAxisLayoutSize(false, h);
    }

    _getCrossAxisMinSizeSetting() {
        return this._getMinSizeSetting(!this.ctr!.horizontal);
    }

    _getCrossAxisMaxSizeSetting() {
        return this._getMaxSizeSetting(!this.ctr!.horizontal);
    }

    _getMainAxisMaxSizeSetting() {
        return this._getMaxSizeSetting(this.ctr!.horizontal);
    }

    _getMinSizeSetting(horizontal: boolean) {
        if (horizontal) {
            return this._minWidth;
        } else {
            return this._minHeight;
        }
    }

    _getMaxSizeSetting(horizontal: boolean) {
        if (horizontal) {
            return this._maxWidth;
        } else {
            return this._maxHeight;
        }
    }

    _getMainAxisMinSize() {
        return FlexUtils.getAxisMinSize(this.node, this.ctr!.horizontal);
    }

    _getCrossAxisMinSize() {
        return FlexUtils.getAxisMinSize(this.node, !this.ctr!.horizontal);
    }

    _getMainAxisLayoutSize() {
        return this.node.getAxisLayoutSize(this.ctr!.horizontal);
    }

    _getMainAxisLayoutPos() {
        return this.node.getAxisLayoutPos(this.ctr!.horizontal);
    }

    _setMainAxisLayoutPos(pos: number) {
        return this.node.setAxisLayoutPos(this.ctr!.horizontal, pos);
    }

    _setCrossAxisLayoutPos(pos: number) {
        return this.node.setAxisLayoutPos(!this.ctr!.horizontal, pos);
    }

    _getCrossAxisLayoutSize() {
        return this.node.getAxisLayoutSize(!this.ctr!.horizontal);
    }

    _resizeCrossAxis(size: number) {
        return FlexUtils.resizeAxis(this.node, !this.ctr!.horizontal, size);
    }

    _resizeMainAxis(size: number) {
        return FlexUtils.resizeAxis(this.node, this.ctr!.horizontal, size);
    }

    _getMainAxisPadding() {
        return this.node.getTotalPadding(this.ctr!.horizontal);
    }

    _getCrossAxisPadding() {
        return this.node.getTotalPadding(!this.ctr!.horizontal);
    }

    _getMainAxisMargin() {
        return FlexUtils.getTotalMargin(this.node, this.ctr!.horizontal);
    }

    _getCrossAxisMargin() {
        return FlexUtils.getTotalMargin(this.node, !this.ctr!.horizontal);
    }

    _getHorizontalMarginOffset() {
        return FlexUtils.getMarginOffset(this.node, true);
    }

    _getVerticalMarginOffset() {
        return FlexUtils.getMarginOffset(this.node, false);
    }

    _getMainAxisMinSizeWithPaddingAndMargin() {
        return this._getMainAxisMinSize() + this._getMainAxisPadding() + this._getMainAxisMargin();
    }

    _getCrossAxisMinSizeWithPaddingAndMargin() {
        return this._getCrossAxisMinSize() + this._getCrossAxisPadding() + this._getCrossAxisMargin();
    }

    _getMainAxisLayoutSizeWithPaddingAndMargin() {
        return this._getMainAxisLayoutSize() + this._getMainAxisPadding() + this._getMainAxisMargin();
    }

    _getCrossAxisLayoutSizeWithPaddingAndMargin() {
        return this._getCrossAxisLayoutSize() + this._getCrossAxisPadding() + this._getCrossAxisMargin();
    }

    _hasFixedCrossAxisSize() {
        return !this.node.isZeroAxisSize(!this.ctr!.horizontal);
    }

    _hasRelCrossAxisSize() {
        return !!(this.ctr!.horizontal ? this.node.sourceFuncH : this.node.sourceFuncW);
    }
}
