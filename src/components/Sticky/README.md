# Tab 粘性布局

Sticky 组件与 CSS 中 `position: sticky` 属性实现的效果一致，当组件在屏幕范围内时，会按照正常的布局排列，当组件滚出屏幕范围时，始终会固定在屏幕顶部或底部。

### 基础用法

将内容包裹在 `Sticky` 组件内即可。
```html
<Sticky>
    <button>基础用法</button>
</Sticky>
```
通过 `offset-top` 属性可以设置组件在吸顶时与顶部的距离。
```html
<Sticky offset-top="50px">
    <div>吸顶距离</div>
</Sticky>
```
通过 `container` 属性可以指定组件的容器，页面滚动时，组件会始终保持在容器范围内，当组件即将超出容器底部时，会固定在容器的底部。
```html
<div ref="container1">
    <Sticky :container="container1">
        <div>
            指定吸顶容器
        </div>
    </Sticky>
</div>
```
```js
export default {
  data() {
    return {
      container1: '',
    };
  },
  mounted() {
        this.container1 = this.$refs.container1;
    },
};
```
通过 `sticky-type` 属性可以设置组件吸顶和吸底
```html
<Sticky offset-top="30px" sticky-type="top-bottom">
    <div>
        顶部吸顶，底部吸底
    </div>
</Sticky>
```
通过 `offset-bottom` 属性可以设置组件在吸底时与底部的距离。
```html
<Sticky
    sticky-type="bottom"
    offset-bottom="50px"
>
    <div>吸底距离</div>
</Sticky>
```
通过 `container` 属性可以指定组件的容器，页面滚动时，组件会始终保持在容器范围内，当组件即将超出容器顶部时，会固定在容器的顶部。
```html
<div ref="container2">
    <Sticky
        sticky-type="bottom"
        :container="container2"
    >
        <div>指定吸底容器</div>
    </Sticky>
</div>
```

```js
export default {
  data() {
    return {
      container2: '',
    };
  },
  mounted() {
        this.container2 = this.$refs.container2;
    },
};
```



### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| offset-top | 吸顶时与顶部的距离，支持 `px` `vw` `vh` `rem` 单位，默认 `px` | _number \| string_ | `0` |
| offset-bottom | 吸底时与底部的距离，支持 `px` `vw` `vh` `rem` 单位，默认 `px` | _number \| string_ | `0` |
| sticky-type | 吸附位置 `top`: 只会置顶；`bottom`:只会置底； `top-bottom`: 会置顶，超出页面也会置底； | _string_ | `top` |
| offset-bottom | 吸底时与底部的距离，支持 `px` `vw` `vh` `rem` 单位，默认 `px` | _number \| string_ | `0` |
| z-index | 吸顶时的 z-index | _number \| string_ | `99` |
| container | 容器对应的 HTML 节点 | _Element_ | - |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| change | 当吸顶状态改变时触发 | _{ position: 当前是处于吸顶监听状态还是监听吸底状态, isFixed: 是否处于吸顶或者吸底 }_ |
| scroll | 滚动时触发 | _{ scrollTop: number, isFixed: boolean }_ |
