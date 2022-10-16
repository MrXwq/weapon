<template>
  <div class="demo__sticky">
    <h3>基本用法</h3>
    <BSticky class="demo__sticky--primary">
      <div class="demo__button">基础用法</div>
    </BSticky>
    <h3>吸顶距离</h3>
    <BSticky class="demo__sticky--distance--top" offset-top="50px">
      <div class="demo__button">吸顶距离</div>
    </BSticky>
    <h3>指定吸顶容器</h3>
    <div class="demo__sticky--container" ref="container1">
      <BSticky :container="container1">
        <div class="demo__button demo__button--success">指定吸顶容器</div>
      </BSticky>
    </div>
    <h3>顶部吸顶，底部吸底</h3>
    <div class="demo__sticky--every">
      <BSticky offset-top="30px" sticky-type="top-bottom">
        <div class="demo__button demo__button--success">顶部吸顶，底部吸底</div>
      </BSticky>
    </div>
    <h3>吸底距离</h3>
    <BSticky
      class="demo__sticky--bottom"
      sticky-type="bottom"
      offset-bottom="50px"
    >
      <div class="demo__button">吸底距离</div>
    </BSticky>

    <h3>置顶吸底容器</h3>
    <div class="demo__sticky--container" ref="container2">
      <h3>内容填充</h3>
      <h3>内容填充</h3>
      <BSticky
        class="demo__sticky--bottom"
        sticky-type="bottom"
        :container="container2"
      >
        <div class="demo__button">指定吸底容器</div>
      </BSticky>
    </div>
  </div>
</template>
<script>
import BSticky from "./index.vue";

export default {
  components: {
    BSticky,
  },
  data() {
    return {
      container1: "",
      container2: "",
    };
  },
  mounted() {
    this.container1 = this.$refs.container1;
    this.container2 = this.$refs.container2;
  },
};
</script>

<style lang="less" scoped>
@import "~style/common.less";

.demo__sticky {
  height: 300vh;
  background: #fff;

  &--distance {
    margin-left: 100px;
  }
  .demo__button {
    position: relative;
    padding: 5px 15px;
    line-height: 1.2;
    text-align: center;
    border-radius: 2px;
    cursor: pointer;
    width: fit-content;
    font-size: 14px;
    color: #fff;
    background-color: #1989fa;
    border: 1px solid #1989fa;
    &--success {
      background-color: #07c160;
      border: 1px solid #07c160;
    }
  }

  &--container {
    height: 200px;
    background-color: @light_f5f;

    .demo__button--success {
      margin-left: 200px;
    }
  }

  &--every {
    margin-top: 50vh;
  }
}
</style>
