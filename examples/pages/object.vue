<style lang="scss">
</style>

<template>
  <div id="page">
    <FlowLoader
      ref="loader"
      func="getObjectByPage"
      type="page"
      :query="query"
      :auto="3"
      :callback="testPatch"
    >
      <ul class="demo-list" slot-scope="{ flow }">
        <li v-for="(item, key) in flow" :key="key">
          <p>{{ key }}</p>
          <div v-for="one in flow[key]">
            {{ one }}
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
  },
  methods: {
    testPatch() {
      this.$refs.loader.patch([{ a: 1, val: 'changed' }], 'pgc', 'a')
    }
  }
}
</script>
