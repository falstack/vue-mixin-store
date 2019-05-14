<style lang="scss">
</style>

<template>
  <div id="first-error">
    <FlowLoader
      func="getListByFirstError"
      type="page"
      :query="query"
      :use-first-error="true"
    >
      <ul class="demo-list" slot-scope="{ flow }">
        <li v-for="(item, index) in flow" :key="item.id">
          <div :style="{ backgroundColor: item.style.color }">
            count：{{ index + 1 }}，id：{{ item.id }}
          </div>
        </li>
      </ul>
      <div slot="first-error" slot-scope="{ error }">
        {{ error }}
        <p>第一次加载就 error，可以设置独特的 error（点击重试3次）…</p>
      </div>
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
