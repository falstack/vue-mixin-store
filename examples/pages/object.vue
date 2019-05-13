<style lang="scss">
</style>

<template>
  <div id="page">
    <FlowLoader
      func="getObjectByPage"
      type="page"
      :query="query"
      :auto="3"
      :object-array="true"
    >
      <ul class="demo-list" slot-scope="{ flow }">
        <li v-for="(item, index) in flow" :key="item.id">
          <div>
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
        count: 10,
        query: {
          a: 1,
          b: 2,
          c: 3
        }
      }
    }
  }
}
</script>
