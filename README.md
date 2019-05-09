# 简介

## 安装

```sh
yarn add vue-mixin-store
or
npm i vue-mixin-store
```

## 文档：
[https://falstack.github.io/vue-mixin-store/](https://falstack.github.io/vue-mixin-store/)

## 什么是 vue-mixin-store？

### 一般情况下，我们的网页包含以下三种元素：
1. 表单`CURD`
    - 登录、注册、修改信息
2. 列表
    - 图片轮播
    - 信息流
    - 评论列表
    - 推荐列表
3. UI原件
    - 头像裁剪组件
    - 数据展示组件
    
::: tip
对于不同的产品，UI原件和表单都是难以统一的，只能抽象出最基本的组件，而对于列表却不是这样
:::

### 我们对列表进行拆分，可以分为以下两层：
1. 数据层
    - 数据获取的 API
    - 数据获取的参数
2. 渲染层
    - 列表的头、尾
    - 列表中每个组件
::: tip
对于不同的产品，渲染层的差异比较大，而数据层的模式却是相同的
:::

### 我们对数据层进行深入分析：

#### 列表的数据加载都有以下模式：
1. 首次加载
2. 请求更多（向【上/前】或向【下/后】）
3. 刷新列表

#### 每个列表都应该存在以下状态：
1. loading（加载中）
2. error（出错了）
3. nothing（没有内容）
4. noMore（没有更多）
5. fetched（是否已发送过请求）

::: tip
每次都要去手动维护这些状态是很麻烦的，不维护体验不好，维护也可能维护错导致 bug
:::

#### 接口的请求方式有以下[场景](https://www.jianshu.com/p/1601239f64b5)：
1. 静态列表
    - 滚动翻页，使用 page + count 分页
    - 跳转翻页，使用 page + count 分页
2. 动态有序列表
    - 有起点，使用 lastId 分页
    - 无起点，使用 sinceId + isUp 分页
3. 动态无序列表
    - 使用 seenIds 分页
    
### vue-mixin-store 就是对列表的数据层做的一层封装，它包括两部分：
1. FlowLoader
    - 一个列表加载的 Vue 组件，封装了数据源、列表状态和加载方法，以及一些其他数据变更方法
2. FlowStore
    - 一个封装好的 vuex 模块，维护了列表的数据和状态
