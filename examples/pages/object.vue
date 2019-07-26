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
      <ul
        slot-scope="{ flow }"
        class="demo-list"
      >
        <li
          v-for="(item, key) in flow"
          :key="key"
        >
          <p>{{ key }}</p>
          <div
            v-for="(one, index) in flow[key]"
            :key="index"
          >
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
      this.$refs.loader.patch([{ a: 1, val: 'changed' }], 'result.pgc', 'a')
      this.$refs.loader.append({ a: 6, val: 'gg' }, 'result.pgc', 'a')
      this.$refs.loader.append([{ a: 6, val: 'kami' }], 'result.bangumi', 'a')
    }
  }
}
</script>
