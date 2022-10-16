<template>
  <div :class="bem()">
    <div v-if="showHeader" :class="bem('header')">
      <h2 :class="bem('title')">
        <slot name="title">
          {{ title }}
        </slot>
      </h2>
      <svg v-if="closeable" :class="bem('close-icon')" @click="onClose">
        <use xlink:href="#icon_guanbi"></use>
      </svg>
    </div>
    <Tabs
      v-model="activeTab"
      animated
      swipeable
      shrink
      ref="tabs"
      :color="activeColor"
      :class="bem('tabs')"
    >
      <Tab
        v-for="(item, tabIndex) in tabs"
        :key="item.value"
        :title="titleObj(item).title"
        :titleClass="titleObj(item).titleClass"
      >
        <ul :class="bem('options')">
          <li
            v-for="(option, oIndex) in item.options"
            :key="oIndex"
            :class="
              bem('option', {
                selected: isSelected(item.selectedOption, option),
              })
            "
            :style="{
              color: isSelected(item.selectedOption, option)
                ? activeColor
                : null,
            }"
            @click="onSelect(option, tabIndex)"
          >
            <span>
              {{ option[textKey] }}
            </span>
            <svg
              v-if="isSelected(item.selectedOption, option)"
              :class="bem('selected-icon')"
              :style="{
                fill: isSelected(item.selectedOption, option)
                  ? activeColor
                  : null,
              }"
            >
              <use xlink:href="#icon_duigou"></use>
            </svg>
          </li>
        </ul>
      </Tab>
    </Tabs>
  </div>
</template>
<script>
import Tabs from "expand/components/Tabs/Tabs";
import Tab from "expand/components/Tabs/Tab";
import { createBEM } from "./utils";

export default {
  components: {
    Tabs,
    Tab,
  },
  props: {
    title: String,
    value: [Number, String],
    fieldNames: Object,
    activeColor: String,
    placeholder: String, // 未选中时的提示文案
    options: {
      type: Array,
      default: () => [],
    },
    closeable: {
      type: Boolean,
      default: true,
    },
    showHeader: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      tabs: [],
      activeTab: 0,
    };
  },
  watch: {
    options: {
      deep: true,
      handler: "updateTabs",
    },

    value(value) {
      if (value !== undefined) {
        const values = this.tabs.map(
          (tab) => tab.selectedOption?.[this.valueKey]
        );
        if (values.includes(value)) {
          return;
        }
      }
      this.updateTabs();
    },
  },
  computed: {
    textKey() {
      return this.fieldNames?.text || "text";
    },
    valueKey() {
      return this.fieldNames?.value || "value";
    },
    childrenKey() {
      return this.fieldNames?.children || "children";
    },
  },

  created() {
    this.updateTabs();
  },
  methods: {
    onSelect(option, tabIndex) {
      this.tabs[tabIndex].selectedOption = option;
      // 如果点击了前面tab的东西，需要清除后面所有的tab
      if (this.tabs.length > tabIndex + 1) {
        this.tabs = this.tabs.slice(0, tabIndex + 1);
      }

      if (option[this.childrenKey]) {
        const nextTab = {
          options: option[this.childrenKey],
          selectedOption: null,
        };

        if (this.tabs[tabIndex + 1]) {
          this.$set(this.tabs, tabIndex + 1, nextTab);
        } else {
          this.tabs.push(nextTab);
        }

        this.$nextTick(() => {
          this.activeTab += 1;
        });
      }

      const selectedOptions = this.tabs
        .map((tab) => tab.selectedOption)
        .filter((item) => !!item);

      const eventParams = {
        value: option[this.valueKey],
        tabIndex,
        selectedOptions,
      };
      // 重置标题
      this.$refs.tabs.resetNav();
      this.$emit("input", option[this.valueKey]);
      this.$emit("change", eventParams);

      if (!option[this.childrenKey]) {
        this.$emit("finish", eventParams);
      }
    },
    onClose() {
      this.$emit("close");
    },
    isSelected(selectedOption, option) {
      return (
        selectedOption &&
        option[this.valueKey] === selectedOption[this.valueKey]
      );
    },
    titleObj(item) {
      const { selectedOption } = item;
      const title = selectedOption
        ? selectedOption[this.textKey]
        : this.placeholder || "请选择";
      return {
        title,
        titleClass: this.bem("tab", {
          unselected: !selectedOption,
        }),
      };
    },
    getSelectedOptionsByValue(options, value) {
      for (let i = 0; i < options.length; i += 1) {
        const option = options[i];

        if (option[this.valueKey] === value) {
          return [option];
        }

        if (option[this.childrenKey]) {
          const selectedOptions = this.getSelectedOptionsByValue(
            option[this.childrenKey],
            value
          );
          if (selectedOptions) {
            return [option, ...selectedOptions];
          }
        }
      }
      return "";
    },
    updateTabs() {
      if (this.value !== undefined) {
        const selectedOptions = this.getSelectedOptionsByValue(
          this.options,
          this.value
        );

        if (selectedOptions) {
          let optionsCursor = this.options;

          this.tabs = selectedOptions.map((option) => {
            const tab = {
              options: optionsCursor,
              selectedOption: option,
            };

            const next = optionsCursor.filter(
              (item) => item[this.valueKey] === option[this.valueKey]
            );
            if (next.length) {
              optionsCursor = next[0][this.childrenKey];
            }

            return tab;
          });

          if (optionsCursor) {
            this.tabs.push({
              options: optionsCursor,
              selectedOption: null,
            });
          }

          this.$nextTick(() => {
            this.activeTab = this.tabs.length - 1;
          });

          return;
        }
      }

      this.tabs = [
        {
          options: this.options,
          selectedOption: null,
        },
      ];
    },
    bem(el, mod) {
      return createBEM("b-cascader")(el, mod);
    },
  },
};
</script>
<style scoped lang="less">
@import "./index.less";
a {
  color: #000000;
}
</style>
