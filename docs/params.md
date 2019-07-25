# 参数

## FlowLoader 的 props
| 参数 | 类型 | 必填？ | 默认值 | 验证 | 作用 |
| --- | --- | --- | --- | --- | --- |
| func | String | true | - | - | 请求的 API 函数名 |
| type | String | true | - | page, jump, seenIds, lastId, sinceId | API的翻页方式 |
| query | Object | false | {} | - | 透传给 API 层的参数 |
| auto | Number | false | -1 | >= -1 | 自动加载的次数，-1 代表无限加载 |
| displayNoMore | Boolean | false | false | - | 当列表刷不出更多的时候，是否展示文字提示 |
| useFirstError | Boolean | false | false | - | 是否在首次加载失败时使用特殊的 slot |
| useFirstLoading | Boolean | false | false | - | 是否在首次加载loading时使用特殊的 slot |
| retryOnError | Boolean | false | true | - | 当展示 error 的时候是否点击后重试 |
| preload | Number | false | 50 | >= 0 | 自动加载下一页的预加载高度（px） |
| callback | Function | false | undefined | Function | 接口请求成功后可以调用一个 callback 函数 |
| cacheTimeout | Number | false | 0 | >= 0 | 将数据缓存到 localStorage 里超时的秒数 |

### query 中的一些关键字
| 参数 | 作用 |
| --- | --- |
| page | 在首次加载的时候可以传入 page，之后 store 会自动维护 |
| changing | 列表中每个 item 的 unique_id 的 key，默认是 id，可自定义其它 key，若 unique_id 在 object 的深层，使用`.`来分割 |
| is_up | 这个 key 由 FlowLoader 自动维护，默认为 false，只用在调用 `loadBefore` 时被设为 true，并透传给 API 层 |
| \_\_refresh\_\_ | 当调用 `refresh` 方法的时候会自动传这个 key 来刷新 state，所以你不要使用这个 key |

## FlowLoader 的方法

::: tip
以下方法使用 this.$refs.loader.xxx 调用
:::

#### initData()
- 当auto设为0时，手动获取第一页的数据

#### loadMore()
- 当auto设为0时，手动获取下一页的数据

#### loadBefore()
- 当`type`=`sinceId`的时候，用来加载前面的数据

#### refresh()
- 刷新列表，该列表的原有数据会被清空

#### retry()
- 接口请求报错的时候，当 error-on-retry 设为 false 的时候手动调用来 retry

#### clear()
- 手动将数据清空，但不发请求

#### jump(page)
- 参数：page
- 跳转到第几页，只应该在`type` =`jump` 的时候被调用

#### update({ id, key, value })
- 参数：id（这里是键值，键名由 query 里的 changing 指定）
- 参数：key（支持使用`.`分割符来修改对象深层的值）
- 参数：value（设定的值）
- 改变`field`中某个`result`的某个值

#### modify({ key, value })
- 参数：key（改变的值的 key）
- 参数：value（新值）
- 改变该`field`的某个数据

#### delete(id, key, changing)
- 参数[必选]：id（这里是键值，键名由 query 里的 changing 指定）
- 参数[可选]：key（为兼容 objectArray 返回格式，字符串，支持`.`语法）
- 参数[可选]：changing（优先级比 query 里的 changing 高，不支持`.`语法）
- 删除列表中的某个元素

#### prepend(data, key, changing)
- 参数[必选]：data（支持单个或多个值）
- 参数[可选]：key（为兼容 objectArray 返回格式，字符串，支持`.`语法）
- 参数[可选]：changing（优先级比 query 里的 changing 高，不支持`.`语法）
- 在列表的前面插入数据

#### append(data, key, changing)
- 参数[必选]：data（支持单个或多个值）
- 参数[可选]：key（为兼容 objectArray 返回格式，字符串，支持`.`语法）
- 参数[可选]：changing（优先级比 query 里的 changing 高，不支持`.`语法）
- 在列表的后面插入数据

#### insertBefore({ id, value, key, changing })
- 参数[必选]：id（列表中某个 item 的 id）
- 参数[必选]：value（要插入的数据）
- 参数[可选]：key（为兼容 objectArray 返回格式，字符串，支持`.`语法）
- 参数[可选]：changing（优先级比 query 里的 changing 高，不支持`.`语法）
- 在列表的某个元素之前插入数据

#### insertAfter({ id, value, key, changing })
- 参数[必选]：id（列表中某个 item 的 id）
- 参数[必选]：value（要插入的数据）
- 参数[可选]：key（为兼容 objectArray 返回格式，字符串，支持`.`语法）
- 参数[可选]：changing（优先级比 query 里的 changing 高，不支持`.`语法）
- 在列表的某个元素之后插入数据

#### patch(array, key, changing)
- 参数[必选]：value objectArray 或 array
- 参数[可选]：key（为兼容 objectArray 返回格式，字符串，支持`.`语法）
- 参数[可选]：changing（优先级比 query 里的 changing 高，不支持`.`语法）
- 给原有的数据打补丁

#### getResource(key = 'extra')
- 参数：key（要获取数据的key），`store`不存在时返回`undefined`
- 获取列表里的某个数据

## FlowStore 透传的参数
| 类型 | 参数 | 默认值 | 翻页值 |
| --- | --- | --- | --- |
| page | page | 1 | 自动维护，+1 |
| sinceId | since_id, is_up | is_up = 1, since_id = 999999999； is_up = 0, since_id = 0 | 根据翻页方向自动维护 |
| jump | page | 1 | 手动传值 |
| lastId | last_id | 0 | 当前列表最后一个元素的 id 值 |
| seenIds | seen_ids | '' | 当前列表所有元素的 id 值的数组然后 join(',') |

> 当然也包括 query 里面提供的参数
