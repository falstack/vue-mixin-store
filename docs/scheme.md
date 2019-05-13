# 返回值

#### 在了解返回值约束之前，我们先看一下`FlowStore`的内部实现

每个列表的默认属性如下：

```javascript
const defaultListObj = {
  result: [],       // 列表数据
  page: 0,          // 页码
  noMore: false,    // 是否还有更多
  nothing: false,   // 列表是否为空
  loading: false,   // 列表是否正在加载
  error: null,      // 列表是否加载出错，默认为 null，错误时为 Error 对象
  fetched: false,   // 列表是否初始化过
  total: 0,         // 整个列表的总条数
  extra: null       // 接口返回的额外数据
}
```

::: warning 因为我们无法支持任意的接口返回模式，因此我们要约束 API 层的返回值
```javascript
const response = {
  result: [],       // 数据的列表，必须
  no_more: false,   // 是否还有更多，必须
  total: 0,         // 列表的总数
  extra: {}         // 额外数据
}
```
:::

因此，如果你需要获取除了列表数据以外的其他数据，请在 API 层把它转化到 extra 中，如：
```javascript
// api.js
export const getListByPage = ({ page, count }) => {
  return new Promise((resolve, reject) => {
    axios.get('...', { params: { page, count } })
      .then(data => {
        resolve({
          result: data.list,
          no_more: data.noMoreKey,
          total: data.total_count,
          extra: {
            key: data.otherValue
          }
        })
      })
      .catch(reject)
  })
}
```
