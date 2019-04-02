<style lang="scss">
#app {
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
    <img alt="Vue logo" src="./assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" />
    <FlowList func="getList" type="page">
      <ul class="demo-list" slot-scope="{ flow }">
        <li v-for="item in flow" :key="item.id">
          <div :style="{ backgroundColor: item.style.color }">
            {{ item.index + 1 }}
          </div>
        </li>
      </ul>
    </FlowList>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'app',
  components: {
    HelloWorld
  },
  mounted() {
    this.$store.dispatch('flow/initData', {
      func: 'getList',
      type: 'page'
    })
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
