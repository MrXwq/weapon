<!--
 * @LineStart: -------------------------------------------
 * @Description: 粘性布局
 * @LineEnd: ----------------------------------------------
-->
<template>
  <div :style="wrapStyle">
    <div :class="contentClass" :style="contentStyle">
      <slot />
    </div>
  </div>
</template>
<script>
import { BindEventMixin } from "../utils/bind-event";
import { unitToPx } from "../utils/unit";
import { isDef } from "../utils";
import { getScrollTop, getElementTop, getScroller } from "../utils/scroll";

export default {
  mixins: [
    BindEventMixin(function (bind, isBind) {
      if (!this.scroller) {
        this.scroller = getScroller(this.$el);
      }
      if (this.observer) {
        const method = isBind ? "observe" : "unobserve";
        this.observer[method](this.$el);
      }
      bind(this.scroller, "scroll", this.onScroll, true);
      this.onScroll();
    }),
  ],
  props: {
    zIndex: [Number, String],
    offsetTop: {
      type: [Number, String],
      default: 0,
    },
    offsetBottom: {
      type: [Number, String],
      default: 0,
    },
    container: null,
    /**
     * 哪里需要定位
     * top 只需要在到顶部的时候定位
     * top-bottom 置顶和置底都有
     * bottom 置底
     * */
    stickyType: {
      type: String,
      default: "top",
    },
  },
  data: () => ({
    fixed: false,
    height: 0,
    width: 0,
    transform: 0,
    // top bottom
    fixedPosition: "top",
    scrollTop: 0,
  }),
  computed: {
    offsetTopPx() {
      return unitToPx(this.offsetTop);
    },
    offsetBottomPx() {
      return unitToPx(this.offsetBottom);
    },
    wrapStyle() {
      return {
        height: this.fixed ? `${this.height}px` : null,
      };
    },
    contentClass() {
      return ["sticky", { "sticky--fixed": this.fixed }];
    },
    contentStyle() {
      if (!this.fixed) {
        return;
      }

      const style = {};

      if (isDef(this.zIndex)) {
        style.zIndex = this.zIndex;
      }

      if (this.fixedTop) {
        style.top = this.offsetTopPx ? `${this.offsetTopPx}px` : 0;
        style.bottom = "auto";
      } else {
        style.bottom = this.offsetBottomPx ? `${this.offsetBottomPx}px` : 0;
        style.top = "auto";
      }

      if (this.transform) {
        style.transform = `translate3d(0, ${this.transform}px, 0)`;
      }
      // eslint-disable-next-line consistent-return
      return style;
    },
    // 顶部和尾部都定位
    fixedTopAndBottom() {
      return this.stickyType === "top-bottom";
    },
    // 底部定位
    fixedBottom() {
      return this.stickyType === "bottom";
    },
    // 定位在顶部
    fixedTop() {
      return this.fixedPosition === "top";
    },
  },
  watch: {
    fixed(newV) {
      this.$emit("change", {
        isFixed: newV,
        position: this.fixedPosition,
      });
    },
  },
  created() {
    this.observer = new IntersectionObserver(
      (entries) => {
        // trigger scroll when visibility changed
        if (entries[0].intersectionRatio > 0) {
          this.onScroll();
        }
      },
      { root: document.body }
    );
  },
  methods: {
    emitScrollEvent() {
      this.$emit("scroll", {
        scrollTop: this.scrollTop,
        isFixed: this.fixed,
      });
    },
    isHidden(el) {
      const style = window.getComputedStyle(el);
      const hidden = style.display === "none";

      // offsetParent returns null in the following situations:
      // 1. The element or its parent element has the display property set to none.
      // 2. The element has the position property set to fixed
      const parentHidden =
        el.offsetParent === null && style.position !== "fixed";

      return hidden || parentHidden;
    },
    setFixBottom(rootRect) {
      const scrollTop = getScrollTop(window);
      const { clientHeight } = document.documentElement;
      let isFixed = false;
      if (this.container) {
        const containerRect = this.container.getBoundingClientRect();
        // 容器底部距离页面顶部的距离
        const difference =
          clientHeight - containerRect.top - this.offsetBottomPx - this.height;

        isFixed =
          clientHeight - this.offsetBottomPx < rootRect.bottom &&
          clientHeight > containerRect.top;
        this.transform = difference < 0 ? -difference : 0;
      } else {
        isFixed = clientHeight - this.offsetBottomPx < rootRect.bottom;
      }
      this.fixed = isFixed;
      this.fixedPosition = isFixed ? "bottom" : "no";
      this.emitScrollEvent(scrollTop);
      return isFixed;
    },
    setFixTop(rootRect) {
      const scrollTop = getScrollTop(window);
      let isFixed = false;
      if (this.container) {
        const containerRect = this.container.getBoundingClientRect();
        // 容器底部距离页面顶部的距离
        const difference =
          containerRect.bottom - this.offsetTopPx - this.height;
        isFixed = this.offsetTopPx > rootRect.top && containerRect.bottom > 0;
        this.transform = difference < 0 ? difference : 0;
      } else {
        // 如果没有容器，那就只需要知道距离屏幕的距离了
        isFixed = this.offsetTopPx > rootRect.top;
      }
      this.fixedPosition = isFixed ? "top" : "no";
      this.fixed = isFixed;
      this.emitScrollEvent(scrollTop);
    },
    onScroll() {
      if (this.isHidden(this.$el)) {
        return;
      }
      const rootRect = this.$el.getBoundingClientRect();
      this.width = rootRect.width;
      this.height = rootRect.height;
      // 页面已经滚动的距离
      this.scrollTop = getScrollTop(window);
      // 容器距离页面顶部的距离
      this.topToPageTop = getElementTop(this.$el);
      if (this.fixedTopAndBottom) {
        // 置底判断
        if (this.setFixBottom(rootRect)) return;
        // 如果进入到了页面，在需要定位在顶部的判断
        this.position = "no";
        // 置顶判断
        this.setFixTop(rootRect);
        return;
      }
      if (this.fixedBottom) {
        this.setFixBottom(rootRect);
        return;
      }
      this.setFixTop(rootRect);
    },
  },
};
</script>
<style scoped lang="less">
@import "./index.less";
</style>
