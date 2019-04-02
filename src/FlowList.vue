<template>
  <div class="flow-list" v-if="source">
    <!--  flow header  -->
    <slot :source="source" name="header" />
    <!--  flow list  -->
    <slot :flow="source.list" />
    <!--  flow state  -->
    <div class="flow-list-state" ref="state">
      <!--   error   -->
      <div v-if="source.error" @click="loadMore">
        <slot v-if="useFirstError && source.nothing" name="first-error">
          <div class="flow-list-state-error">
            <span>出错了，点击重试</span>
          </div>
        </slot>
        <slot v-else name="error">
          <div class="flow-list-state-error">
            <span>出错了，点击重试</span>
          </div>
        </slot>
      </div>
      <!--   nothing   -->
      <div v-else-if="source.nothing">
        <slot name="nothing">
          <div class="flow-list-state-nothing">
            <span>这里什么都没有</span>
          </div>
        </slot>
      </div>
      <!--   no-more   -->
      <div v-else-if="source.noMore">
        <slot name="no-more">
          <div v-if="displayNoMore" class="flow-list-state-no-more">
            <span>没有更多了</span>
          </div>
        </slot>
      </div>
      <!--   loading   -->
      <div v-else-if="source.loading">
        <slot v-if="useFirstLoading && source.nothing" name="first-loading">
          <div class="flow-list-state-loading">加载中…</div>
        </slot>
        <slot else name="loading">
          <div class="flow-list-state-loading">加载中…</div>
        </slot>
      </div>
      <!--   normal   -->
      <template v-else>
        <div v-if="auto" class="flow-list-state-shim"></div>
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
    setTimeout(() => {
      if (this.auto) {
        this.initFlowLoader()
      }
    }, 20)
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
      if (checkInView(this.$refs.state)) {
        this.loadMore()
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
      if (checkInView(this.$refs.state)) {
        this.loadMore()
      }
    })
  }
}
</script>
