<template>
  <div class="demo-cascader">
    <h3>基础用法</h3>
    <div class="btn" @click="openCascader">
      {{ fieldValue || "请选择" }}
    </div>
    <BPopup v-model="show" round position="bottom" @close="closeCascader">
      <BCascader
        v-model="cascaderValue"
        title="请选择所在地区"
        :options="options"
        active-color="red"
        @close="closeCascader"
        @finish="onFinish"
      />
    </BPopup>
    <h3>异步加载选项</h3>
    <div class="btn" @click="openCascader2">
      {{ fieldValue2 || "请选择" }}
    </div>
    <BPopup v-model="show2" round position="bottom" @close="closeCascader2">
      <BCascader
        v-model="cascaderValue2"
        title="请选择所在地区"
        :options="options2"
        @change="onChange"
        @close="closeCascader2"
        @finish="onFinish2"
      />
    </BPopup>

    <h3>自定义字段名</h3>
    <div class="btn" @click="openCascader3">
      {{ fieldValue3 || "请选择" }}
    </div>
    <BPopup v-model="show3" round position="bottom" @close="closeCascader3">
      <BCascader
        v-model="cascaderValue3"
        title="请选择所在地区"
        :field-names="fieldNames"
        :options="options3"
        @close="closeCascader3"
        @finish="onFinish3"
      />
    </BPopup>
  </div>
</template>
<script>
import BCascader from "./index.vue";
import BPopup from "../Popup/index.vue";

export default {
  components: {
    BCascader,
    BPopup,
  },
  data() {
    return {
      show: false,
      fieldValue: "",
      cascaderValue: "",
      options: [
        {
          text: "浙江省",
          value: "330000",
          children: [{ text: "杭州市", value: "330100" }],
        },
        {
          text: "江苏省",
          value: "320000",
          children: [{ text: "南京市", value: "320100" }],
        },
      ],

      show2: false,
      fieldValue2: "",
      cascaderValue2: "",
      // 选项列表，children 代表子选项，支持多级嵌套
      options2: [
        {
          text: "浙江省",
          value: "330000",
          children: [],
        },
      ],

      fieldNames: {
        text: "name",
        value: "code",
        children: "items",
      },
      show3: false,
      fieldValue3: "",
      cascaderValue3: "",
      // 选项列表，children 代表子选项，支持多级嵌套
      options3: [
        {
          name: "浙江省",
          code: "330000",
          items: [{ name: "杭州市", code: "330100" }],
        },
        {
          name: "江苏省",
          code: "320000",
          items: [{ name: "南京市", code: "320100" }],
        },
      ],
    };
  },
  methods: {
    onFinish({ selectedOptions }) {
      this.show = false;
      this.fieldValue = selectedOptions.map((option) => option.text).join("/");
    },
    openCascader() {
      this.show = true;
    },
    closeCascader() {
      this.show = false;
    },

    onChange({ value }) {
      if (value === this.options2[0].value) {
        setTimeout(() => {
          this.options2[0].children = [
            { text: "杭州市", value: "330100" },
            { text: "宁波市", value: "330200" },
          ];
        }, 500);
      }
    },
    onFinish2({ selectedOptions }) {
      this.show2 = false;
      this.fieldValue2 = selectedOptions.map((option) => option.text).join("/");
    },
    openCascader2() {
      this.show2 = true;
    },
    closeCascader2() {
      this.show2 = false;
    },

    openCascader3() {
      this.show3 = true;
    },
    closeCascader3() {
      this.show3 = false;
    },
    onFinish3({ selectedOptions }) {
      this.show3 = false;
      this.fieldValue3 = selectedOptions.map((option) => option.name).join("/");
    },
  },
};
</script>
<style lang="less" scoped>
.demo-cascader {
  padding: 0 0.2rem;
  h3 {
    margin-top: 0.3rem;
  }
  .btn {
    margin-bottom: 0.1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 0.3rem;
    font-size: 0.16rem;
    font-weight: 700;
    line-height: 0.17rem;
    border-radius: 0.14rem;
    color: #12ada9;
    background: rgba(55, 194, 188, 0.1);
  }
}
</style>
