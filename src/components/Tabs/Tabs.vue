<template>
  <div ref="tabs" class="tabs tabs--line" :class="{ dark }">
    <Sticky
      v-if="sticky"
      :stickyType="stickyType"
      :container="$el"
      :offsetTop="offsetTop"
      :offsetBottom="offsetBottom"
      @scroll="onStickyScroll"
      @change="onStickyChange"
    >
      <div ref="wrap" class="tabs__wrap">
        <div
          ref="nav"
          class="tabs__nav tabs__nav--line"
          :class="{
            'tabs__nav--shrink': shrink,
            'tabs__nav--complete': scrollable,
          }"
          :style="navStyle"
        >
          <slot name="nav-left"></slot>
          <div
            ref="titles"
            v-for="(item, index) in navList"
            :key="index"
            :class="[
              'tab',
              {
                'tab--active': isActive(index),
                'tab--shrink': shrink,
                'tab--grow': scrollable && !shrink,
                'tab--disabled': item.disabled,
                dark,
              },
            ]"
            :style="titleStyle(index)"
            @click="onClick(index)"
          >
            <div class="tab__text-wrapper">
              <span
                class="tab__text"
                :class="{ 'tab__text--ellipsis': !scrollable }"
              >
                <component v-if="item.titleSlot" :is="item.title" />
                <template v-else>
                  {{ item.title }}
                </template>
              </span>
              <span v-if="item.dot" class="tab__dot"></span>
            </div>
          </div>
          <div v-if="$slots.line" class="tabs__slots__line" :style="lineStyle">
            <slot name="line"></slot>
          </div>
          <div class="tabs__line" :style="lineStyle"></div>
          <slot name="nav-right"></slot>
        </div>
      </div>
      <slot name="nav-bottom"></slot>
    </Sticky>
    <template v-else>
      <div class="tabs__wrap" ref="wrap">
        <div
          ref="nav"
          class="tabs__nav tabs__nav--line"
          :class="{
            'tabs__nav--shrink': shrink,
            'tabs__nav--complete': scrollable,
          }"
        >
          <slot name="nav-left"></slot>
          <div
            ref="titles"
            v-for="(item, index) in navList"
            :key="index"
            :class="[
              'tab',
              {
                'tab--active': isActive(index),
                'tab--shrink': shrink,
                'tab--grow': scrollable && !shrink,
                'tab--disabled': item.disabled,
                dark,
              },
            ]"
            :style="titleStyle(index)"
            @click="onClick(index)"
          >
            <div class="tab__text-wrapper">
              <span
                class="tab__text"
                :class="{ 'tab__text--ellipsis': !scrollable }"
              >
                <component v-if="item.titleSlot" :is="item.title" />
                <template v-else>
                  {{ item.title }}
                </template>
              </span>
              <span v-if="item.dot" class="tab__dot"></span>
            </div>
          </div>
          <div v-if="$slots.line" class="tabs__slots__line" :style="lineStyle">
            <slot name="line"></slot>
          </div>

          <div class="tabs__line" :style="lineStyle"></div>
          <slot name="nav-right"></slot>
        </div>
      </div>
      <slot name="nav-bottom"></slot>
    </template>
    <Content>
      <slot></slot>
    </Content>
  </div>
</template>
<script>
import { ParentMixin } from "./relation";
import Content from "./Content";
import { scrollTopTo, scrollLeftTo } from "./utils";
import Sticky from "../Sticky";
import { getElementTop, setRootScrollTop, getScroller } from "../utils/scroll";
import { unitToPx, addUnit } from "../utils/unit";
import { BindEventMixin } from "../utils/bind-event";
import { callInterceptor } from "../utils/interceptor";
import { isDef } from "../utils";

export default {
  name: "b-tabs",
  mixins: [
    ParentMixin("tabs"),
    BindEventMixin(function (bind) {
      if (!this.scroller) {
        this.scroller = getScroller(this.$el);
      }
      if (this.scrollspy) {
        bind(this.scroller, "scroll", this.onScroll, true);
      }
    }),
  ],
  components: {
    Content,
    Sticky,
  },
  model: {
    prop: "active",
  },

  props: {
    active: {
      type: [Number, String],
      default: 0,
    },
    type: {
      type: String,
      default: "line",
    },
    color: String,
    background: String,
    duration: {
      type: [Number, String],
      default: 0.3,
    },
    lineWidth: [Number, String],
    lineHeight: [Number, String],
    ellipsis: {
      type: Boolean,
      default: true,
    },
    sticky: Boolean,
    stickyType: String,
    swipeThreshold: {
      type: [Number, String],
      default: 5,
    },
    beforeChange: Function,
    titleActiveColor: String, // 激活字体颜色
    titleInactiveColor: String, // 默认字体颜色
    offsetTop: {
      type: [Number, String],
      default: 0,
    },
    offsetBottom: {
      type: [Number, String],
      default: 0,
    },
    scrollspy: Boolean,
    shrink: Boolean,
    lazyRender: {
      type: Boolean,
      default: true,
    },
    dark: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      navList: [],
      currentIndex: 0,
      lineStyle: {
        backgroundColor: this.color,
      },
      lockScroll: false,
    };
  },
  computed: {
    offsetTopPx() {
      return unitToPx(this.offsetTop);
    },
    currentName() {
      const activeTab = this.children[this.currentIndex];
      return activeTab && activeTab.computedName;
    },
    scrollOffset() {
      if (this.sticky) {
        return this.offsetTopPx + this.tabHeight;
      }
      return 0;
    },
    scrollable() {
      return (
        this.children.length > this.swipeThreshold ||
        !this.ellipsis ||
        this.shrink
      );
    },
    navStyle() {
      return {
        borderColor: this.color,
        background: this.background,
      };
    },
  },
  watch: {
    active(name) {
      if (name !== this.currentName) {
        this.setCurrentIndexByName(name);
      }
    },
    currentIndex() {
      this.scrollIntoView();
      this.setLine();
      this.scrollTabTop();
    },
    children() {
      this.setCurrentIndexByName(this.active);
      this.setLine();
      this.$nextTick(() => {
        this.scrollIntoView(true);
      });
    },
  },
  mounted() {
    this.navList = this.children.map((item) => {
      return {
        titleSlot: !!item.$slots.title,
        title: item.$slots.title
          ? {
              render: () => item.$slots.title[0],
            }
          : item.title,
        dot: item.dot,
        disabled: item.disabled,
      };
    });
    this.init();
    // this.setLine();
  },
  methods: {
    init() {
      this.$nextTick(() => {
        this.inited = true;
        this.tabHeight = this.$refs.wrap.getBoundingClientRect().height;
        this.scrollIntoView(true);
      });
    },

    getCurrentIndexOnScroll() {
      const { children } = this;

      // eslint-disable-next-line no-plusplus
      for (let index = 0; index < children.length; index++) {
        const { top } = children[index].$el.getBoundingClientRect();

        if (top > this.scrollOffset) {
          return index === 0 ? 0 : index - 1;
        }
      }

      return children.length - 1;
    },
    // @exposed-api
    scrollTo(name) {
      this.$nextTick(() => {
        this.setCurrentIndexByName(name);
        this.scrollToCurrentContent(true);
      });
    },
    // @exposed-api
    scrollTabTop() {
      if (this.stickyFixed && !this.scrollspy) {
        setRootScrollTop(Math.ceil(getElementTop(this.$el) - this.offsetTopPx));
      }
    },
    scrollToCurrentContent(immediate = false) {
      if (this.scrollspy) {
        const target = this.children[this.currentIndex];
        const el = target && target.$el;

        if (el) {
          let to;
          if (this.currentIndex === 0) {
            to = getElementTop(el, this.scroller) - this.scrollOffset + 1;
          } else {
            to = getElementTop(el, this.scroller) - this.scrollOffset;
          }
          // const to = getElementTop(el, this.scroller) - this.scrollOffset;
          this.lockScroll = true;
          scrollTopTo(this.scroller, to, immediate ? 0 : +this.duration, () => {
            this.lockScroll = false;
          });
        }
      }
    },
    onScroll() {
      if (this.scrollspy && !this.lockScroll) {
        const index = this.getCurrentIndexOnScroll();
        this.setCurrentIndex(index);
      }
    },
    onStickyScroll(params) {
      this.stickyFixed = params.isFixed;
      this.$emit("scroll", params);
    },
    // sticky改变触发
    onStickyChange(params) {
      this.$emit("sticky-change", params);
    },
    setCurrentIndexByName(name) {
      const matched = this.children.filter((tab) => tab.computedName === name);
      const defaultIndex = (this.children[0] || {}).index || 0;
      this.setCurrentIndex(matched.length ? matched[0].index : defaultIndex);
    },
    isActive(index) {
      return index === this.currentIndex;
    },
    titleStyle(index) {
      const style = {};
      const titleColor = this.isActive(index)
        ? this.titleActiveColor
        : this.titleInactiveColor;
      if (titleColor) {
        style.color = titleColor;
      }
      return style;
    },
    setLine() {
      const shouldAnimate = this.inited;
      this.$nextTick(() => {
        const { titles } = this.$refs;
        const title = titles[this.currentIndex];
        const { lineWidth, lineHeight } = this;
        const left = title.offsetLeft + title.offsetWidth / 2;

        const lineStyle = {
          width: addUnit(lineWidth),
          backgroundColor: this.color,
          transform: `translateX(${left}px) translateX(-50%)`,
        };

        if (shouldAnimate) {
          lineStyle.transitionDuration = `${this.duration}s`;
        }

        if (isDef(lineHeight)) {
          const height = addUnit(lineHeight);
          lineStyle.height = height;
          lineStyle.borderRadius = height;
        }

        this.lineStyle = lineStyle;
      });
    },
    getTabName(tab, index) {
      return tab.name ? tab.name : index;
    },
    // eslint-disable-next-line consistent-return
    findAvailableTab(index) {
      const diff = index < this.currentIndex ? -1 : 1;

      while (index >= 0 && index < this.children.length) {
        if (!this.children[index].disabled) {
          return index;
        }

        index += diff;
      }
    },
    setCurrentIndex(currentIndex) {
      const newIndex = this.findAvailableTab(currentIndex);
      if (!isDef(newIndex)) {
        return;
      }

      const newTab = this.children[newIndex];
      const newName = this.getTabName(newTab, newIndex);
      const shouldEmitChange = this.currentIndex !== null;

      this.currentIndex = newIndex;

      if (newName !== this.active) {
        this.$emit("input", newName);

        if (shouldEmitChange) {
          this.$emit("change", newName, newTab.title);
        }
      }
    },
    onClick(index) {
      const { title, computedName, disabled } = this.children[index];
      if (disabled) {
        this.$emit("disabled", computedName, title);
      } else {
        callInterceptor({
          interceptor: this.beforeChange,
          args: [computedName],
          done: () => {
            this.setCurrentIndex(index);
            this.scrollToCurrentContent();
          },
        });
        this.$emit("click", computedName, title);
      }
    },
    scrollIntoView(immediate) {
      const { titles } = this.$refs;

      if (!this.scrollable || !titles || !titles[this.currentIndex]) {
        return;
      }

      const { nav } = this.$refs;
      const title = titles[this.currentIndex];
      const to = title.offsetLeft - (nav.offsetWidth - title.offsetWidth) / 2;

      scrollLeftTo(nav, to, immediate ? 0 : +this.duration);
    },
  },
};
</script>
<style lang="less">
@import "./tabs.less";
</style>
