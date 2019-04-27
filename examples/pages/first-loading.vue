<style lang="scss">
</style>

<template>
  <div id="first-loading">
    <FlowLoader
      func="getListByFirstLoading"
      type="page"
      :query="query"
      :use-first-loading="true"
    >
      <ul class="demo-list" slot-scope="{ flow }">
        <li v-for="(item, index) in flow" :key="item.id">
          <div :style="{ backgroundColor: item.style.color }">
            count：{{ index + 1 }}，id：{{ item.id }}
          </div>
        </li>
      </ul>
      <div slot="first-loading">第一次加载，可以设置独特的 loading…</div>
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
  }
}
</script>
