# Tab 级联选择

### 基础用法

级联选择组件可以搭配 BPopup 组件使用，示例如下：

```html
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
```

```js
export default {
  data() {
    return {
      show: false,
      fieldValue: '',
      cascaderValue: '',
      // 选项列表，children 代表子选项，支持多级嵌套
      options: [
        {
          text: '浙江省',
          value: '330000',
          children: [{ text: '杭州市', value: '330100' }],
        },
        {
          text: '江苏省',
          value: '320000',
          children: [{ text: '南京市', value: '320100' }],
        },
      ],
    };
  },
  methods: {
    // 全部选项选择完毕后，会触发 finish 事件
    onFinish({ selectedOptions }) {
      this.show = false;
      this.fieldValue = selectedOptions.map((option) => option.text).join('/');
    },
  },
};

```

### 异步加载选项

可以监听 change 事件并动态设置 options，实现异步加载选项。

```html
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
```

```js
export default {
  data() {
    return {
        show2: false,
        fieldValue2: '',
        cascaderValue2: '',
        // 选项列表，children 代表子选项，支持多级嵌套
        options2: [
        {
            text: '浙江省',
            value: '330000',
            children: [],
        },
        ],
    };
  },
  methods: {
    onChange({ value }) {
        if (value === this.options2[0].value) {
            setTimeout(() => {
                this.options2[0].children = [
                    { text: '杭州市', value: '330100' },
                    { text: '宁波市', value: '330200' },
                ];
            }, 500);
        }
    },
    onFinish2({ selectedOptions }) {
        this.show2 = false;
        this.fieldValue2 = selectedOptions.map((option) => option.text).join('/');
    },
    openCascader2() {
        this.show2 = true
    },
    closeCascader2() {
        this.show2 = false
    },
  }
};
```

### 自定义字段名

通过 field-names 属性可以自定义 options 里的字段名称。

```html
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
```
```js
export default {
  data() {
    return {
        fieldNames: {
            text: 'name',
            value: 'code',
            children: 'items',
        },
        show3: false,
        fieldValue3: '',
        cascaderValue3: '',
        // 选项列表，children 代表子选项，支持多级嵌套
        options3: [
            {
                name: '浙江省',
                code: '330000',
                items: [{ name: '杭州市', code: '330100' }],
            },
            {
                name: '江苏省',
                code: '320000',
                items: [{ name: '南京市', code: '320100' }],
            },
        ],
    };
  },
  methods: {
    openCascader3() {
        this.show3 = true
    },
    closeCascader3() {
        this.show3 = false
    },
    onFinish3({ selectedOptions }) {
        this.show3 = false;
        this.fieldValue3 = selectedOptions.map((option) => option.name).join('/');
    },
  }
};
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 顶部标题 | _string_ | - |
| value | 选中项的值 | _string \| number_ | - |
| options | 可选项数据源 | _Option[]_ | `[]` |
| placeholder | 未选中时的提示文案 | _string_ | `请选择` |
| active-color | 选中状态的高亮颜色 | _string_ | `#12ADA9;` |
| closeable | 是否显示关闭图标 | _boolean_ | `true` |
| show-header | 是否展示标题栏 | _boolean_ | `true` |
| field-names | 自定义 `options` 结构中的字段 | _object_ | `{ text: 'text', value: 'value', children: 'children' }` |

### Events

| 事件   | 说明                   | 回调参数                               |
| ------ | ---------------------- | -------------------------------------- |
| change | 选中项变化时触发       | `{ value, selectedOptions, tabIndex }` |
| finish | 全部选项选择完成后触发 | `{ value, selectedOptions, tabIndex }` |
| close  | 点击关闭图标时触发     | -                                      |

### Slots

| 名称              | 说明           | 参数                                    |
| ----------------- | -------------- | --------------------------------------- |
| title             | 自定义顶部标题 | -                                       |
| option            | 自定义选项文字 | _{ option: Option, selected: boolean }_ |

