<style lang="scss">
</style>

<template>
  <div id="page">
    <FlowLoader
      func="getListByPage"
      type="page"
      :query="query"
      :display-no-more="false"
      :use-first-loading="true"
      :use-first-error="true"
    >
      <ul class="demo-list" slot-scope="{ flow }">
        <li v-for="item in flow" :key="item.id">
          <div :style="{ backgroundColor: item.style.color }">
            {{ item.index + 1 }}
          </div>
        </li>
      </ul>
      <div slot="first-loading">第一次加载</div>
      <div slot="first-error">第一次错误</div>
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
  mounted() {
    this.$store.dispatch('flow/initData', {
      func: 'getListByPage',
      type: 'page',
      query: this.query
    })
  }
}
</script>
