<style lang="scss">
</style>

<template>
  <div id="since_id">
    <div>
      <button @click="fetchUp">向上获取</button>
      <button @click="refresh">刷新页面</button>
    </div>
    <FlowLoader
      func="getListBySinceId"
      type="sinceId"
      :query="query"
      ref="loader"
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
        changing: 'data.number_id'
      }
    }
  },
  methods: {
    fetchUp() {
      this.$refs.loader.loadBefore()
    },
    refresh() {
      this.$refs.loader.refresh()
    }
  }
}
</script>
