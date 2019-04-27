<style lang="scss">
</style>

<template>
  <div id="comment">
    <FlowLoader
      func="getListByPage"
      type="page"
      :query="query"
    >
      <ul class="demo-list" slot-scope="{ flow }">
        <li v-for="(item, index) in flow" :key="item.id">
          <div :style="{ backgroundColor: item.style.color }">
            count：{{ index + 1 }}，id：{{ item.id }}
            <button @click="modifyDeepValue(item)">{{ item.data.follow ? '已关注' : '关注' }}</button>
            <button @click="modifyLightValue(item)">{{ item.like ? '已喜欢' : '喜欢' }}</button>
          </div>
        </li>
      </ul>
    </FlowLoader>
  </div>
</template>

<script>
export default {
  data() {
    return {
      query: {
        count: 10
      }
    }
  },
  methods: {
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
    }
  }
}
</script>
