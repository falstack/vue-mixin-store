<style lang="scss">
body {
  margin: 0;

  a {
    text-decoration: none;
    color: #222;
  }
}

#app {
  padding-bottom: 30px;

  .container {
    width: 1160px;
    max-width: 100%;
    margin: 0 auto;
  }

  .header {
    .v-switcher {
      &-header {
        &-anchor {
          bottom: 0;
          height: 100%;
          background-color: #00a1d6;
          opacity: 0.1;
        }

        &-item {
          padding: 0 20px;
          box-sizing: border-box;

          &.is-active a {
            color: palevioletred;
          }
        }
      }
    }
  }
}

#main {
  width: 600px;
  margin: 0 auto;
  text-align: center;
  $height: 40px;
  $font-size: 14px;
  .flow-render {
    &-state {
      &-error,
      &-no-more,
      &-loading,
      &-shim,
      &-load {
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
    <div class="container header">
      <v-switcher
        :headers="headers"
        :routable="true"
        align="start"
      >
        <router-link
          v-for="(item, index) in headers"
          :key="index"
          :slot="`tab-${index}`"
          :to="item.route"
          v-text="item.name"
        ></router-link>
      </v-switcher>
    </div>
    <div id="main">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
      headers: [
        {
          name: '首页',
          route: '/'
        },
        {
          name: '页码翻页',
          route: '/page'
        },
        {
          name: '跳转翻页',
          route: '/jump'
        },
        {
          name: 'seenIds翻页',
          route: '/seen_ids'
        },
        {
          name: 'sinceId翻页',
          route: '/since_id'
        },
        {
          name: 'last_id翻页',
          route: '/last_id'
        },
        {
          name: '模拟异常',
          route: '/error'
        },
        {
          name: '首屏异常',
          route: '/first-error'
        },
        {
          name: '首屏加载',
          route: '/first-loading'
        },
        {
          name: '首屏为空',
          route: '/nothing'
        },
        {
          name: '动态列表',
          route: '/comment'
        }
      ]
    }
  }
}
</script>
