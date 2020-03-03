<style lang="scss">
</style>

<template>
  <div id="page">
    <FlowLoader
      func="getListByPage"
      type="page"
      :query="query"
      :callback="handlePageLoaded"
      :auto="3"
    >
      <ul
        slot-scope="{ flow }"
        class="demo-list"
      >
        <li
          v-for="(item, index) in flow"
          :key="item.id"
        >
          <div :style="{ backgroundColor: item.style.color }">
            count：{{ index + 1 }}，id：{{ item.id }}
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
    handlePageLoaded(res) {
      console.log('callback', res)
    }
  }
}
</script>
