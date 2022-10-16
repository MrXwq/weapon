<template>
  <div class="demo-tab">
    <div class="demo-container">
      <h3>基础用法</h3>
      <Tabs v-model="active">
        <Tab :title="t('tab') + index" v-for="index in tabs" :key="index">
          {{ t("content") }} {{ index }}
        </Tab>
      </Tabs>
    </div>

    <div class="demo-container">
      <h3>通过名称匹配</h3>
      <Tabs v-model="activeName">
        <Tab name="a" :title="t('tab') + 1"> {{ t("content") }} 1 </Tab>
        <Tab name="b" :title="t('tab') + 2"> {{ t("content") }} 2 </Tab>
        <Tab name="c" :title="t('tab') + 3"> {{ t("content") }} 3 </Tab>
      </Tabs>
    </div>

    <div class="demo-container">
      <h3>标签栏滚动</h3>
      <Tabs>
        <Tab v-for="index in 8" :title="t('tab') + index" :key="index">
          {{ t("content") }} {{ index }}
        </Tab>
      </Tabs>
    </div>

    <div class="demo-container">
      <h3>禁用标签</h3>
      <Tabs @disabled="onClickDisabled">
        <Tab
          v-for="index in 3"
          :title="t('tab') + index"
          :disabled="index === 2"
          :key="index"
        >
          {{ t("content") }} {{ index }}
        </Tab>
      </Tabs>
    </div>

    <div class="demo-container">
      <h3>点击事件</h3>
      <Tabs @click="onClick">
        <Tab v-for="index in 2" :title="t('tab') + index" :key="index">
          {{ t("content") }} {{ index }}
        </Tab>
      </Tabs>
    </div>

    <div class="demo-container">
      <h3>收缩导航</h3>
      <Tabs shrink>
        <Tab v-for="index in tabs" :title="t('tab') + index" :key="index">
          {{ t("content") }} {{ index }}
        </Tab>
      </Tabs>
    </div>

    <div class="demo-container">
      <h3>自定义标题</h3>
      <Tabs>
        <Tab v-for="index in 3" :key="index">
          <div
            slot="title"
            style="display: flex; align-items: center; justify-content: center"
          >
            <svg style="width: 0.2rem; height: 0.2rem">
              <use xlink:href="#icon_huo"></use>
            </svg>
            自定义标题{{ index }}
          </div>
          {{ t("content") }} {{ index }}
        </Tab>
      </Tabs>
    </div>

    <div class="demo-container">
      <h3>切换动画</h3>
      <Tabs animated>
        <Tab v-for="index in tabs" :key="index" :title="t('tab') + index">
          {{ t("content") }} {{ index }}
        </Tab>
      </Tabs>
    </div>

    <div class="demo-container">
      <h3>粘性布局</h3>
      <Tabs :active="active" sticky>
        <Tab :title="t('tab') + index" v-for="index in tabs" :key="index">
          {{ t("content") }} {{ index }}
        </Tab>
      </Tabs>
    </div>

    <div class="demo-container">
      <h3>滚动导航</h3>
      <Tabs scrollspy sticky>
        <Tab :title="t('tab') + index" v-for="index in 8" :key="index">
          {{ t("content") }} {{ index }}
        </Tab>
      </Tabs>
    </div>

    <div class="demo-container">
      <h3>吸顶吸底+滚动导航</h3>
      <Tabs :active="active2" scrollspy sticky sticky-type="top-bottom">
        <Tab :title="t('tab') + index" v-for="index in tabs" :key="index">
          {{ t("content") }} {{ index }}
        </Tab>
      </Tabs>
    </div>

    <div class="demo-container">
      <h3>异步切换</h3>
      <Tabs v-model="active1" :before-change="beforeChange">
        <Tab :title="t('tab') + index" v-for="index in 4" :key="index">
          {{ t("content") }} {{ index }}
        </Tab>
      </Tabs>
    </div>
    <div v-if="loading">loading...</div>
  </div>
</template>

<script>
import Tabs from "./Tabs";
import Tab from "./Tab";

export default {
  components: {
    Tabs,
    Tab,
  },
  data() {
    return {
      active: 2,
      active1: 2,
      active2: 2,
      activeName: "b",
      tabs: [1, 2, 3, 4],
      loading: false,
    };
  },

  methods: {
    t(item) {
      const textMap = {
        tab: "标题",
        content: "内容",
      };
      return textMap[item];
    },
    onClickDisabled(index, title) {
      console.log("index, title: ", index, title);
    },

    onClick(index, title) {
      console.log("index, title: ", index, title);
    },

    beforeChange(name) {
      // 返回 false 表示阻止此次切换
      if (name === 1) {
        return false;
      }

      if (name === 0) {
        // 返回 Promise 来执行异步逻辑
        return new Promise((resolve) => {
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
            resolve(true);
          }, 2000);
        });
      }
      // 返回 Promise 来执行异步逻辑
      return new Promise((resolve) => {
        // 在 resolve 函数中返回 true 或 false
        resolve(name !== 3);
      });
    },
  },
};
</script>

<style lang="less" scoped>
.demo-tab {
  background: #f5f5f5;
  padding-bottom: 80vh;

  .tab__pane {
    padding: 24px 20px;
    background-color: #ffffff;
  }
}
</style>
