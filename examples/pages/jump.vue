<style lang="scss">
</style>

<template>
  <div id="jump">
    <FlowLoader
      func="getListByJump"
      type="jump"
      :query="query"
    >
      <ul class="demo-list" slot-scope="{ flow }">
        <li v-for="(item, index) in flow" :key="item.id">
          <div :style="{ backgroundColor: item.style.color }">
            count：{{ index + 1 }}，id：{{ item.id }}
          </div>
        </li>
      </ul>
      <div slot="load">
        <button @click="load(1)">page-1</button>
        <button @click="load(2)">page-2</button>
        <button @click="load(9)">page-9</button>
      </div>
    </FlowLoader>
  </div>
</template>

<script>
export default {
  data() {
    return {
      query: {
        count: 10,
        page: 1
      }
    }
  },
  methods: {
    load(page) {
      this.query.page = page
      this.$store.dispatch('flow/loadMore', {
        func: 'getListByJump',
        type: 'jump',
        query: this.query
      })
    }
  }
}
</script>
