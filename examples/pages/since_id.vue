<style lang="scss">
</style>

<template>
  <div id="since_id">
    <div><button @click="fetchUp">向上获取</button></div>
    <FlowLoader
      func="getListBySinceId"
      type="sinceId"
      :query="query"
    >
      <ul class="demo-list" slot-scope="{ flow }">
        <li v-for="(item, index) in flow" :key="item.id">
          <div :style="{ backgroundColor: item.style.color }">
            count：{{ index + 1 }}，id：{{ item.data.number_id }}
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
        count: 10,
        isUp: false,
        changing: 'data.number_id'
      }
    }
  },
  mounted() {
    this.$store.dispatch('flow/initData', {
      func: 'getListBySinceId',
      type: 'sinceId',
      query: this.query
    })
  },
  methods: {
    fetchUp() {
      this.$store.dispatch('flow/loadMore', {
        func: 'getListBySinceId',
        type: 'sinceId',
        query: Object.assign(this.query, {
          isUp: true
        })
      })
    }
  }
}
</script>
