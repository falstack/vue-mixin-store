<style lang="scss">
</style>

<template>
  <div id="comment">
    <div>
      <button @click="unshiftParent(1)">unshift 1</button>
      <button @click="pushParent(1)">push 1</button>
      <button @click="pushParent(2)">concat 2</button>
      <button @click="unshiftParent(2)">merge 2</button>
      <button @click="totalPlus">total++</button>
    </div>
    <FlowLoader
      func="getListByPage"
      type="page"
      :query="query"
      :auto="1"
      ref="loader"
    >
      <div slot="header" slot-scope="{ source }">total：{{ source.total }}</div>
      <ul slot-scope="{ flow }">
        <li v-for="(item, index) in flow" :key="item.id">
          <div :style="{ backgroundColor: item.style.color }">
            <br><br>
            主评论：{{ index + 1 }}，id：{{ item.id }}
            <br><br>
            <button @click="modifyDeepValue(item)">{{ item.data.follow ? '已关注' : '关注' }}</button>
            <button @click="modifyLightValue(item)">{{ item.like ? '已喜欢' : '喜欢' }}</button>
            <button @click="deleteParent(item)">删除</button>
            <button @click="insertBefore(item)">前面插入</button>
            <button @click="insertAfter(item)">后面插入</button>
          </div>
          <FlowLoader
            func="getListByJump"
            type="jump"
            :query="{ count: 10, id: item.id, page: 1 }"
          >
            <ul class="children-list" slot-scope="{ flow }">
              <li v-for="(children, subIndex) in flow" :key="children.id">
                <div :style="{ backgroundColor: children.style.color }">
                  子评论：{{ subIndex + 1 }}，id：{{ children.id }}
                </div>
              </li>
            </ul>
            <div slot="load">
              <button @click="loadChildren(1, item.id)">page-1</button>
              <button @click="loadChildren(2, item.id)">page-2</button>
              <button @click="loadChildren(9, item.id)">page-9</button>
            </div>
          </FlowLoader>
        </li>
      </ul>
    </FlowLoader>
  </div>
</template>

<script>
import ItemFactory from '../item-factory'

export default {
  data() {
    return {
      query: {
        count: 10
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      console.log(this.$refs.loader.getResource('result'))
    })
  },
  methods: {
    totalPlus() {
      this.$refs.loader.modify({
        key: 'total',
        value: this.$refs.loader.source.total + 1
      })
    },
    modifyDeepValue(item) {
      this.$refs.loader.update({
        id: item.id,
        key: 'data.follow',
        value: !item.data.follow
      })
    },
    modifyLightValue(item) {
      this.$refs.loader.update({
        id: item.id,
        key: 'like',
        value: !item.like
      })
    },
    unshiftParent(count) {
      this.$refs.loader.prepend(ItemFactory.get(count))
    },
    pushParent(count) {
      this.$refs.loader.append(ItemFactory.get(count))
    },
    deleteParent(item) {
      this.$refs.loader.delete(item.id)
    },
    insertBefore(item) {
      this.$refs.loader.insertBefore({
        id: item.id,
        value: ItemFactory.get(1)
      })
    },
    insertAfter(item) {
      this.$refs.loader.insertAfter({
        id: item.id,
        value: ItemFactory.get(1)
      })
    },
    loadChildren(page, id) {
      this.query.page = page
      this.$store.dispatch('flow/loadMore', {
        func: 'getListByJump',
        type: 'jump',
        query: {
          count: 10,
          page,
          id
        }
      })
    }
  }
}
</script>
