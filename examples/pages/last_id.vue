<style lang="scss">
</style>

<template>
  <div id="last_id">
    <FlowLoader
      func="getListByLastId"
      type="lastId"
      :query="query"
    >
      <ul class="demo-list" slot-scope="{ flow }">
        <li v-for="(item, index) in flow" :key="item.id">
          <div :style="{ backgroundColor: item.style.color }">
            count：{{ index + 1 }}，id：{{ item.data.uuid }}
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
        changing: 'data.uuid'
      }
    }
  },
  mounted() {
    this.$store.dispatch('flow/initData', {
      func: 'getListByLastId',
      type: 'lastId',
      query: this.query
    })
  }
}
</script>
