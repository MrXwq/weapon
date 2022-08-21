# Tab 标题页

### 基础用法

通过 `v-model` 绑定当前激活标题对应的索引值，默认情况下启用第一个标题。

```html
<Tabs v-model="active">
  <Tab title="标题 1">内容 1</Tab>
  <Tab title="标题 2">内容 2</Tab>
  <Tab title="标题 3">内容 3</Tab>
  <Tab title="标题 4">内容 4</Tab>
</Tabs>
```

```js
export default {
  data() {
    return {
      active: 2,
    };
  },
};
```

### 通过名称匹配

在标题指定 `name` 属性的情况下，`v-model` 的值为当前标题的 `name`（此时无法通过索引值来匹配标题）。

```html
<Tabs v-model="activeName">
  <Tab title="标题 1" name="a">内容 1</Tab>
  <Tab title="标题 2" name="b">内容 2</Tab>
  <Tab title="标题 3" name="c">内容 3</Tab>
</Tabs>
```

```js
export default {
  data() {
    return {
      activeName: "a",
    };
  },
};
```

### 标题栏滚动

标题数量超过 5 个时，标题栏可以在水平方向上滚动，切换时会自动将当前标题居中。

```html
<Tabs>
  <Tab v-for="index in 8" :title="'标题 ' + index"> 内容 {{ index }} </Tab>
</Tabs>
```

### 禁用标题

设置 `disabled` 属性即可禁用标题，如果需要监听禁用标题的点击事件，可以在 `Tabs` 上监听`disabled` 事件。

```html
<Tabs @disabled="onClickDisabled">
  <Tab title="标题 1">内容 1</Tab>
  <Tab title="标题 2" disabled>内容 2</Tab>
  <Tab title="标题 3">内容 3</Tab>
</Tabs>
```

```js
export default {
  methods: {
    onClickDisabled(name, title) {
      console.log("name, title: ", name, title);
    },
  },
};
```

### 点击事件

可以在 `Tabs` 上绑定 `click` 事件，事件传参为标题对应的标识符和标题。

```html
<Tabs @click="onClick">
  <Tab title="标题 1">内容 1</Tab>
  <Tab title="标题 2">内容 2</Tab>
</Tabs>
```

```js
export default {
  methods: {
    onClick(name, title) {
      console.log("name, title: ", name, title);
    },
  },
};
```

### 收缩导航

通过 `shrink` 属性可以开启收缩布局，开启后，所有的标签会向左侧收缩对齐。

```html
<Tabs shrink>
  <Tab title="标题 1">内容 1</Tab>
  <Tab title="标题 2">内容 2</Tab>
  <Tab title="标题 3">内容 3</Tab>
  <Tab title="标题 4">内容 4</Tab>
</Tabs>
```

###

通过 title 插槽可以自定义标签内容。

```html
<Tabs>
  <Tab>
    <div
      slot="title"
      style="
            display: flex;
            align-items: center;
            justify-content: center;
        "
    >
      <svg style="width: 0.2rem; height: 0.2rem">
        <use xlink:href="#icon_huo"></use>
      </svg>
      自定义标题1
    </div>
    内容 1
  </Tab>
  <Tab>
    <div
      slot="title"
      style="
            display: flex;
            align-items: center;
            justify-content: center;
        "
    >
      <svg style="width: 0.2rem; height: 0.2rem">
        <use xlink:href="#icon_huo"></use>
      </svg>
      自定义标题2
    </div>
    内容 2
  </Tab>
  <Tab>
    <div
      slot="title"
      style="
            display: flex;
            align-items: center;
            justify-content: center;
        "
    >
      <svg style="width: 0.2rem; height: 0.2rem">
        <use xlink:href="#icon_huo"></use>
      </svg>
      自定义标题3
    </div>
    内容 3
  </Tab>
  <Tab>
    <div
      slot="title"
      style="
            display: flex;
            align-items: center;
            justify-content: center;
        "
    >
      <svg style="width: 0.2rem; height: 0.2rem">
        <use xlink:href="#icon_huo"></use>
      </svg>
      自定义标题4
    </div>
    内容 4
  </Tab>
</Tabs>
```

### 粘性布局

通过 `sticky` 属性可以开启粘性布局，粘性布局下，标题页滚动到顶部时会自动吸顶。

```html
<Tabs v-model="active" sticky>
  <Tab v-for="index in 4" :title="'标题 ' + index"> 内容 {{ index }} </Tab>
</Tabs>
```

### 滚动导航

通过 `scrollspy` 属性可以开启滚动导航模式，该模式下，内容将会平铺展示。

```html
<Tabs v-model="active" scrollspy sticky>
  <Tab v-for="index in 8" :title="'标题 ' + index"> 内容 {{ index }} </Tab>
</Tabs>
```

### 吸顶吸底 + 滚动导航

该模式下，在底部吸底，在顶部吸顶

```html
<Tabs v-model="active" scrollspy sticky sticky-type="top-bottom">
  <Tab v-for="index in 4" :title="'标题 ' + index"> 内容 {{ index }} </Tab>
</Tabs>
```

### 异步切换

通过 `before-change` 属性可以在切换标题前执行特定的逻辑。

```html
<Tabs :before-change="beforeChange">
  <Tab v-for="index in 4" :title="'标题 ' + index"> 内容 {{ index }} </Tab>
</Tabs>
```

```js
export default {
  methods: {
    beforeChange(index) {
      // 返回 false 表示阻止此次切换
      if (index === 1) {
        return false;
      }

      // 返回 Promise 来执行异步逻辑
      return new Promise((resolve) => {
        // 在 resolve 函数中返回 true 或 false
        resolve(index !== 3);
      });
    },
  },
};
```

## API

### Tabs Props

| 参数                 | 说明                                                                      | 类型                           | 默认值    |
| -------------------- | ------------------------------------------------------------------------- | ------------------------------ | --------- |
| v-model              | 绑定当前选中标题的标识符                                                  | _number \| string_             | `0`       |
| type                 | 样式风格类型，可选值为 `card`                                             | _string_                       | `line`    |
| color                | 标题主题色                                                                | _string_                       | `#ee0a24` |
| background           | 标题栏背景色                                                              | _string_                       | `white`   |
| duration             | 动画时间，单位秒                                                          | _number \| string_             | `0.3`     |
| line-width           | 底部条宽度，默认单位 `px`                                                 | _number \| string_             | `40px`    |
| line-height          | 底部条高度，默认单位 `px`                                                 | _number \| string_             | `3px`     |
| ellipsis             | 是否省略过长的标题文字                                                    | _boolean_                      | `true`    |
| sticky               | 是否使用粘性定位布局                                                      | _boolean_                      | `false`   |
| lazy-render          | 是否开启延迟渲染（首次切换到标题时才触发内容渲染）                        | _boolean_                      | `true`    |
| scrollspy            | 是否开启滚动导航                                                          | _boolean_                      | `false`   |
| offset-top           | 粘性定位布局下与顶部的最小距离，支持 `px` `vw` `vh` `rem` 单位，默认 `px` | _number \| string_             | `0`       |
| swipe-threshold      | 滚动阈值，标题数量超过阈值且总宽度超过标题栏宽度时开始横向滚动            | _number \| string_             | `5`       |
| title-active-color   | 标题选中态颜色                                                            | _string_                       | -         |
| title-inactive-color | 标题默认态颜色                                                            | _string_                       | -         |
| before-change        | 切换标题前的回调函数，返回 `false` 可阻止切换，支持返回 Promise           | _(name) => boolean \| Promise_ | -         |
| sticky-type          | 吸顶或者同时吸顶吸底                                                      | string                         | `top`     |
| offset-bottom        | 粘性定位布局下底部的最小距离，支持 `px` `vw` `vh` `rem` 单位，默认 `px`   | _number \| string_             | `0`       |
| shrink               | 是否开启左侧收缩布局                                                      | boolean                        | `false`   |

### Tab Slots

| 参数 | 说明 |
| default | 内容 |
| title | 自定义标题 |
| nav-left | 自定义导航左侧 |
| nav-right | 自定义导航右侧 |
| line | 自定义 title 底部线 |
| nav-bottom | 自定义导航底部 |

### Tab Props

| 参数     | 说明                       | 类型               | 默认值       |
| -------- | -------------------------- | ------------------ | ------------ |
| title    | 标题                       | _string_           | -            |
| disabled | 是否禁用标题               | _boolean_          | `false`      |
| dot      | 是否在标题右上角显示小红点 | _boolean_          | `false`      |
| name     | 标题名称，作为匹配的标识符 | _number \| string_ | 标题的索引值 |

### Tabs Events

| 事件名        | 说明                                                 | 回调参数                                                                            |
| ------------- | ---------------------------------------------------- | ----------------------------------------------------------------------------------- |
| click         | 点击标题时触发                                       | name：标识符，title：标题                                                           |
| change        | 当前激活的标题改变时触发                             | name：标识符，title：标题                                                           |
| disabled      | 点击被禁用的标题时触发                               | name：标识符，title：标题                                                           |
| rendered      | 标题内容首次渲染时触发（仅在开启延迟渲染后触发）     | name：标识符，title：标题                                                           |
| scroll        | 滚动时触发，仅在 sticky 模式下生效                   | { scrollTop: 距离顶部位置, isFixed: 是否处于吸顶或者吸底 }                          |
| sticky-change | 当吸顶或者吸底状态改变时触发，仅在 sticky 模式下生效 | { position: 当前是处于吸顶监听状态还是监听吸底状态, isFixed: 是否处于吸顶或者吸底 } |

### Tabs 方法

通过 ref 可以获取到 Tabs 实例并调用实例方法

| 方法名       | 说明                                     | 参数         | 返回值 |
| ------------ | ---------------------------------------- | ------------ | ------ |
| scrollTo     | 滚动到指定的标题页，在滚动导航模式下可用 | name: 标识符 | -      |
| scrollTabTop | 滚动到 tab 内容顶部，在吸顶时使用        | -            | -      |
