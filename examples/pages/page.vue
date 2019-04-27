<style lang="scss">
</style>

<template>
  <div id="page">
    <FlowLoader
      func="getListByPage"
      type="page"
      :query="query"
      :auto="3"
    >
      <ul class="demo-list" slot-scope="{ flow }">
        <li v-for="(item, index) in flow" :key="item.id">
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
  }
}
</script>
