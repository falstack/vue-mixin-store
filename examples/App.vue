<style lang="scss">
body {
  margin: 0;
}

#app {
  text-align: center;
  $height: 40px;
  $font-size: 14px;
  .flow-list {
    &-state {
      &-error,
      &-no-more,
      &-loading,
      &-shim {
        text-align: center;
        height: $height;
        line-height: $height;

        span {
          font-size: $font-size;
        }
      }
    }
  }

  .demo-list {
    list-style-type: none;
    margin: 0;
    padding: 0;
    padding-top: 10px;

    li {
      padding: 0 10px 10px;

      div {
        height: 100px;
        line-height: 100px;
        text-align: center;
        border-radius: 5px;
      }
    }
  }
}
</style>

<template>
  <div id="app">
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
  name: 'app',
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
