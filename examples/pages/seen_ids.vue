<style lang="scss">
</style>

<template>
  <div id="seen_ids">
    <FlowLoader
      func="getListBySeenIds"
      type="seenIds"
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
        changing: 'data.number_id'
      }
    }
  }
}
</script>
