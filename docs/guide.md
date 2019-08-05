# 快速上手

## 安装

```sh
yarn add vue-mixin-store
or
npm i vue-mixin-store
```

## 引入

#### 引入 store 模块
```javascript
// store.js
import Vue from 'vue'
import Vuex from 'vuex'
import MixinStore from 'vue-mixin-store'
import * as api from '~/api'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    flow: MixinStore.FlowStore(api) // <-- 这里的 key 必须叫 flow
  }
})
```
#### 引入数据加载组件
```javascript
// components.js
import Vue from 'vue'
import MixinStore from 'vue-mixin-store'

Vue.component(MixinStore.FlowLoader.name, MixinStore.FlowLoader)
```

## API 层
::: tip
在引入 store 的时候要传入 API 层，因为这一层总是 custom 的。API 层应该这样定义：
:::

```javascript
// api.js
export const getListByPage = ({ page, count }) => {
  return new Promise((resolve, reject) => {
    // 这层 promise 可以使用 axios 或 fetch 等
  })
}

export const getListBySinceId = ({ since_id, is_up, count }) => {
  return new Promise((resolve, reject) => {
    // 这层 promise 可以使用 axios 或 fetch 等
  })
}

export const getListByLastId = ({ last_id, count }) => {
  return new Promise((resolve, reject) => {
    // 这层 promise 可以使用 axios 或 fetch 等
  })
}

export const getListBySeenIds = ({ seen_ids, count }) => {
  return new Promise((resolve, reject) => {
    // 这层 promise 可以使用 axios 或 fetch 等
  })
}
```

## 简单用例
```vue
<FlowLoader
  func="getListByPage"
  type="page"
  :query="{ count: 10 }"
>
  <ul slot-scope="{ flow }">
    <li v-for="(item, index) in flow" :key="item.id">
      count：{{ index + 1 }}，id：{{ item.id }}
    </li>
  </ul>
</FlowLoader>
```

1. FlowLoader 组件即为 vue-mixin-store 提供的数据加载组件
2. 参数`func`和`type`是必填的，分别代表：`请求的API函数名`和`分页方式`
3. `query`是自定义参数，它会被透传到 API 层
4. `slot-scope="{ flow }"` 即为获取到的数据列表，你可以在其内部通过`v-for`渲染列表组件

::: tip
也就是说，只要使用 vue-mixin-store，每当要新添加一个列表

你只需要：
1. 在 API 层添加一个接口函数
2. 调用 FlowLoader，代理接口请求
3. 为每个列表的 item 写一个组件就可以了

你不需要：
1. 重复的定义 store
2. 维护 loading、error...这些状态
:::

## 完全用例
```vue
<FlowLoader
  func="requestFuncName"
  type="page"
  :query="{}"
  :auto="-1"
  :display-no-more="false"
  :use-first-error="false"
  :use-first-loading="false"
  :retry-on-error="true"
  :preload="50"
  :callback="callbackFn"
  :cache-timeout="0"
>
  <template #header="{ source }">
    <header> ... </header>
  </template>
  <template #default="{ flow, total, count, extra }">
    <ul>
      <ItemComponent v-for="item in flow" :item="item" />
    </ul>
  </template>
  <template #footer="{ source }">
    <footer> ... </footer>  
  </template>
  <template #loading>
     <LoadingComponent/>
  </template>
  <template #nothing>
    <NothingComponent/>
  </template>
  <template #error="{ error }">
    <ErrorComponent/>
  </template>
  <template #first-error="{ error }">
     <FirstErrorComponent/> 
  </template>
  <template #first-loading>
     <FirstLoadingComponent/> 
  </template>
</FlowLoader>
```
