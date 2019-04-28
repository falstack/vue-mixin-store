<style lang="scss">
</style>

<template>
  <div id="comment">
    <div>
      <button @click="unshiftParent(1)">unshift 1</button>
      <button @click="pushParent(1)">push 1</button>
      <button @click="pushParent(2)">concat 2</button>
      <button @click="unshiftParent(2)">merge 2</button>
      <button @click="totalPlus">total = 100</button>
    </div>
    <FlowLoader
      func="getListByPage"
      type="page"
      :query="query"
      :auto="1"
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
  methods: {
    totalPlus() {
      this.$store.commit('flow/UPDATE_DATA', {
        func: 'getListByPage',
        type: 'page',
        query: this.query,
        method: 'extra',
        key: 'total',
        value: 100
      })
    },
    modifyDeepValue(item) {
      this.$store.commit('flow/UPDATE_DATA', {
        func: 'getListByPage',
        type: 'page',
        query: this.query,
        id: item.id,
        key: 'data.follow',
        value: !item.data.follow
      })
    },
    modifyLightValue(item) {
      this.$store.commit('flow/UPDATE_DATA', {
        func: 'getListByPage',
        type: 'page',
        query: this.query,
        id: item.id,
        key: 'like',
        value: !item.like
      })
    },
    unshiftParent(count) {
      this.$store.commit('flow/UPDATE_DATA', {
        func: 'getListByPage',
        type: 'page',
        query: this.query,
        method: count === 1 ? 'unshift' : 'merge',
        value: ItemFactory.get(count)
      })
    },
    pushParent(count) {
      this.$store.commit('flow/UPDATE_DATA', {
        func: 'getListByPage',
        type: 'page',
        query: this.query,
        method: count === 1 ? 'push' : 'concat',
        value: ItemFactory.get(count)
      })
    },
    deleteParent(item) {
      this.$store.commit('flow/UPDATE_DATA', {
        func: 'getListByPage',
        type: 'page',
        query: this.query,
        method: 'delete',
        id: item.id
      })
    },
    insertBefore(item) {
      this.$store.commit('flow/UPDATE_DATA', {
        func: 'getListByPage',
        type: 'page',
        query: this.query,
        method: 'insert-before',
        id: item.id,
        value: ItemFactory.get(1)
      })
    },
    insertAfter(item) {
      this.$store.commit('flow/UPDATE_DATA', {
        func: 'getListByPage',
        type: 'page',
        query: this.query,
        method: 'insert-after',
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
