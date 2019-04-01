<style lang="scss">
$height: 40px;
$font-size: 14px;
@mixin keyframes($name) {
  @keyframes #{$name} {
    @content;
  }

  @-webkit-keyframes #{$name} {
    @content;
  }

  @-moz-keyframes #{$name} {
    @content;
  }
}

.flow-list {
  &-state {
    .state-error,
    .state-no-more,
    .state-loading,
    .state-shim {
      text-align: center;
      height: $height;
      line-height: $height;

      span {
        font-size: $font-size;
      }
    }

    .state-loading {
      i {
        display: inline-block;
        margin-right: 8px;
        width: 20px;
        height: 20px;
        border-radius: 20px;
        border: 2px solid #757575;
        border-bottom-color: transparent;
        vertical-align: middle;
        animation: rolling 0.8s infinite linear;
      }

      span {
        vertical-align: middle;
      }
    }

    @include keyframes(rolling) {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  }
}
</style>

<template>
  <div class="flow-list" v-if="source">
    <!--  flow header  -->
    <slot :source="source" name="header" />
    <!--  flow list  -->
    <slot :flow="source.list" />
    <!--  flow state  -->
    <div class="flow-list-state">
      <!--   error   -->
      <div v-if="source.error" @click="loadMore">
        <slot v-if="useFirstError && source.nothing" name="first-error">
          <div class="state-error">
            <span>出错了，点击重试</span>
          </div>
        </slot>
        <slot v-else name="error">
          <div class="state-error">
            <span>出错了，点击重试</span>
          </div>
        </slot>
      </div>
      <!--   nothing   -->
      <div v-else-if="source.nothing">
        <slot name="nothing">
          <div class="state-nothing">
            <span>这里什么都没有</span>
          </div>
        </slot>
      </div>
      <!--   no-more   -->
      <div v-else-if="source.noMore">
        <slot name="no-more">
          <div v-if="displayNoMore" class="state-no-more">
            <span>没有更多了</span>
          </div>
        </slot>
      </div>
      <!--   loading   -->
      <div v-else-if="source.loading">
        <slot v-if="useFirstLoading && source.nothing" name="first-loading">
          <div class="state-loading">
            <i></i>
            <span>加载中…</span>
          </div>
        </slot>
        <slot else name="loading">
          <div class="state-loading">
            <i></i>
            <span>加载中…</span>
          </div>
        </slot>
      </div>
      <!--   normal   -->
      <template v-else>
        <div v-if="auto" class="state-shim"></div>
        <button v-else @click="loadMore" style="width:100%">
          <slot name="load-btn">点击加载更多</slot>
        </button>
      </template>
    </div>
  </div>
</template>

<script>
import { throttle } from 'throttle-debounce'
const on = (elem, type, listener, useCapture = false) => {
  elem.addEventListener(type, listener, useCapture)
}
const off = (elem, type, listener, useCapture = false) => {
  elem.removeEventListener(type, listener, useCapture)
}
const checkInView = (dom, preload = 50) => {
  if (typeof window === 'undefined') {
    return false
  }
  const rect = dom.getBoundingClientRect()
  return (
    rect.top < window.innerHeight + preload &&
    rect.bottom + preload > 0 &&
    (rect.left < window.innerWidth + preload && rect.right + preload > 0)
  )
}

export default {
  name: 'FlowList',
  props: {
    func: {
      required: true,
      type: String
    },
    type: {
      required: true,
      type: String
    },
    id: {
      type: [Number, String],
      default: ''
    },
    sort: {
      type: String,
      default: ''
    },
    auto: {
      type: Boolean,
      default: true
    },
    count: {
      type: [String, Number],
      default: 12
    },
    changing: {
      type: String,
      default: 'id'
    },
    displayNoMore: {
      type: Boolean,
      default: true
    },
    useFirstError: {
      type: Boolean,
      default: false
    },
    useFirstLoading: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    source() {
      return this.$store.getters['flow/getFlow'](this.func, this.sort, this.id)
    }
  },
  mounted() {
    if (this.auto) {
      this.initFlowLoader()
    }
  },
  methods: {
    loadMore() {
      this.$store.dispatch('flow/loadMore', {
        type: this.type,
        sort: this.sort,
        func: this.func,
        id: this.id,
        count: this.count,
        changing: this.changing,
        _extra: this.extra
      })
    },
    getTarget() {
      let el = this.$el
      while (
        el.tagName !== 'HTML' &&
        el.tagName !== 'BOYD' &&
        el.nodeType === 1
      ) {
        const overflowY = window.getComputedStyle(el).overflowY
        if (overflowY === 'scroll' || overflowY === 'auto') {
          return el
        }
        el = el.parentNode
      }
      return document
    },
    initFlowLoader() {
      if (this.error) {
        return
      }
      if (checkInView(this.$el)) {
        this.fetch()
      }
      on(this.getTarget(), 'scroll', this.onScreenScroll)
    },
    onScreenScroll: throttle(200, function() {
      if (this.error) {
        return
      }
      if (this.noMore || !this.auto) {
        off(this.getTarget(), 'scroll', this.onScreenScroll)
        return
      }
      if (checkInView(this.$el)) {
        this.fetch()
      }
    })
  }
}
</script>
