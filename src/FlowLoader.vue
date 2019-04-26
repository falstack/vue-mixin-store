<template>
  <div class="flow-render" v-if="source">
    <!--  flow header  -->
    <slot :source="source" name="header" />
    <!--  flow list  -->
    <slot :flow="source.result" />
    <!--  flow state  -->
    <div class="flow-render-state" ref="state">
      <!--   error   -->
      <div v-if="source.error" @click="loadMore">
        <slot v-if="useFirstError && source.nothing" name="first-error">
          <div class="flow-render-state-error">
            <span>出错了，点击重试</span>
          </div>
        </slot>
        <slot v-else name="error">
          <div class="flow-render-state-error">
            <span>出错了，点击重试</span>
          </div>
        </slot>
      </div>
      <!--   loading   -->
      <div v-else-if="source.loading">
        <slot v-if="useFirstLoading && source.nothing" name="first-loading">
          <div class="flow-render-state-loading">加载中…</div>
        </slot>
        <slot v-else name="loading">
          <div class="flow-render-state-loading">加载中…</div>
        </slot>
      </div>
      <!--   nothing   -->
      <div v-else-if="source.nothing">
        <slot name="nothing">
          <div class="flow-render-state-nothing">
            <span>这里什么都没有</span>
          </div>
        </slot>
      </div>
      <!--   no-more   -->
      <div v-else-if="source.noMore">
        <slot name="no-more">
          <div v-if="displayNoMore" class="flow-render-state-no-more">
            <span>没有更多了</span>
          </div>
        </slot>
      </div>
      <!--   normal   -->
      <template v-else>
        <div v-if="auto" class="flow-render-state-shim"></div>
        <button v-else @click="loadMore" style="width:100%">
          <slot name="load-btn">点击加载更多</slot>
        </button>
      </template>
    </div>
    <!--  flow footer  -->
    <slot :source="source" name="footer" />
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
  name: 'FlowLoader',
  props: {
    func: {
      required: true,
      type: String
    },
    type: {
      required: true,
      type: String
    },
    query: {
      type: Object,
      default: () => {}
    },
    changing: {
      type: String,
      default: 'id'
    },
    auto: {
      type: Boolean,
      default: true
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
      return this.$store.getters['flow/getFlow'](
        this.func,
        this.type,
        this.query
      )
    }
  },
  mounted() {
    setTimeout(() => {
      if (this.auto) {
        this.initFlowLoader()
      }
    }, 20)
  },
  methods: {
    loadMore() {
      this.$store.dispatch('flow/loadMore', {
        func: this.func,
        type: this.type,
        query: this.query,
        changing: this.changing
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
      if (this.source.error) {
        return
      }
      if (checkInView(this.$refs.state)) {
        this.loadMore()
      }
      on(this.getTarget(), 'scroll', this.onScreenScroll)
    },
    onScreenScroll: throttle(200, function() {
      if (this.source.error) {
        return
      }
      if (this.source.noMore || !this.auto) {
        off(this.getTarget(), 'scroll', this.onScreenScroll)
        return
      }
      if (checkInView(this.$refs.state)) {
        this.loadMore()
      }
    })
  }
}
</script>
