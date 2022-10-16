<template>
  <div class="tabs__content" :class="{ 'tabs__content--animated': animated }">
    <div v-if="animated" class="tabs__track" :style="style">
      <slot />
    </div>
    <slot v-else />
  </div>
</template>
<script>
export default {
  props: {
    animated: Boolean,
    duration: [Number, String],
    currentIndex: Number,
  },
  computed: {
    style() {
      if (this.animated) {
        return {
          transform: `translate3d(${-1 * this.currentIndex * 100}%, 0, 0)`,
          transitionDuration: `${this.duration}s`,
        };
      }
      return "";
    },
  },
};
</script>
