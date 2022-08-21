<template>
  <div v-show="show" class="tab__pane">
    <template v-if="shouldRender">
      <slot />
    </template>
  </div>
</template>
<script>
import { ChildrenMixin } from "./relation";

export default {
  name: "b-tab",
  mixins: [ChildrenMixin("tabs")],
  props: {
    dot: Boolean,
    name: [Number, String],
    title: String,
    disabled: Boolean,
  },
  data() {
    return {
      inited: false,
    };
  },
  computed: {
    computedName() {
      return this.name || this.index;
    },
    isActive() {
      const active = this.computedName === this.parent.currentName;

      if (active) {
        this.inited = true;
      }
      return active;
    },
    shouldRender() {
      return this.inited || this.parent.scrollspy || !this.parent.lazyRender;
    },
    show() {
      return this.parent.scrollspy || this.isActive;
    },
  },
  watch: {
    inited(val) {
      if (this.parent.lazyRender && val) {
        this.$nextTick(() => {
          this.parent.$emit("rendered", this.computedName, this.title);
        });
      }
    },
  },
};
</script>
