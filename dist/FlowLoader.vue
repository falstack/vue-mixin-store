<template>
  <div class="flow-loader">
    <template v-if="source">
      <!--  flow header  -->
      <slot :source="source" name="header" />
      <!--  flow list  -->
      <slot
        :flow="source.result"
        :total="source.total"
        :count="source.result.length"
      />
      <!--  flow footer  -->
      <slot :source="source" name="footer" />
    </template>
    <!--  flow state  -->
    <div ref="state" class="flow-loader-state">
      <template v-if="source">
        <!--   error   -->
        <div v-if="source.error" @click="_retryData">
          <slot
            v-if="useFirstError && !source.result.length"
            name="first-error"
            :error="source.error"
          >
            <div class="flow-loader-state-first-error">
              <span>出错了，点击重试</span>
            </div>
          </slot>
          <slot v-else name="error" :error="source.error">
            <div class="flow-loader-state-error">
              <span>出错了，点击重试</span>
            </div>
          </slot>
        </div>
        <!--   loading   -->
        <div v-else-if="source.loading">
          <slot
            v-if="useFirstLoading && !source.result.length"
            name="first-loading"
          >
            <div class="flow-loader-state-first-loading">加载中…</div>
          </slot>
          <slot v-else name="loading">
            <div class="flow-loader-state-loading">加载中…</div>
          </slot>
        </div>
        <!--   nothing   -->
        <div v-else-if="source.nothing">
          <slot name="nothing">
            <div class="flow-loader-state-nothing">
              <span>这里什么都没有</span>
            </div>
          </slot>
        </div>
        <!--   no-more   -->
        <div v-else-if="source.noMore">
          <slot name="no-more">
            <div v-if="displayNoMore" class="flow-loader-state-no-more">
              <span>没有更多了</span>
            </div>
          </slot>
        </div>
        <!--   normal   -->
        <template v-else>
          <div
            v-if="isAuto && !isPagination"
            class="flow-loader-state-shim"
          ></div>
          <div v-else-if="isPagination" class="flow-loader-state-load">
            <slot name="load">jump</slot>
          </div>
          <div v-else class="flow-loader-state-load" @click="loadMore">
            <slot name="load">点击加载更多</slot>
          </div>
        </template>
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

const checkInView = (dom, preload) => {
  if (!dom) {
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
      type: String,
      validator: val =>
        ~['page', 'jump', 'seenIds', 'lastId', 'sinceId'].indexOf(val)
    },
    query: {
      type: Object,
      default: () => {}
    },
    auto: {
      type: Number,
      default: -1,
      validator: val => val >= -1
    },
    callback: {
      type: Function,
      default: undefined,
      validator: val => val === undefined || typeof val === 'function'
    },
    displayNoMore: {
      type: Boolean,
      default: false
    },
    useFirstError: {
      type: Boolean,
      default: false
    },
    useFirstLoading: {
      type: Boolean,
      default: false
    },
    retryOnError: {
      type: Boolean,
      default: true
    },
    preload: {
      type: Number,
      default: 50,
      validator: val => val >= 0
    },
    cacheTimeout: {
      type: Number,
      default: 0,
      validator: val => val >= 0
    },
    sort: {
      type: String,
      default: 'desc',
      validator: val => ~['desc', 'asc'].indexOf(val)
    }
  },
  computed: {
    source() {
      return this.$store.getters['flow/getFlow'](this.params)
    },
    params() {
      return {
        func: this.func,
        type: this.type,
        query: this.query,
        callback: this.callback,
        cacheTimeout: typeof window === 'undefined' ? 0 : this.cacheTimeout
      }
    },
    isAuto() {
      if (!this.source) {
        return this.auto === -1
      }
      return this.auto === -1 || this.auto > this.source.page
    },
    isPagination() {
      return this.type === 'jump'
    }
  },
  mounted() {
    this.$nextTick(() => {
      this._initFlowLoader()
    })
  },
  methods: {
    modify({ key, value }) {
      this.$store.commit(
        'flow/UPDATE_DATA',
        Object.assign({}, this.params, {
          method: 'modify',
          value,
          key
        })
      )
    },
    delete(id) {
      this.$store.commit(
        'flow/UPDATE_DATA',
        Object.assign({}, this.params, {
          method: 'delete',
          id
        })
      )
    },
    update({ id, key, value }) {
      this.$store.commit(
        'flow/UPDATE_DATA',
        Object.assign({}, this.params, {
          id,
          key,
          value
        })
      )
    },
    prepend(data) {
      this.$store.commit(
        'flow/UPDATE_DATA',
        Object.assign({}, this.params, {
          method:
            Object.prototype.toString.call(data) === '[object Array]'
              ? 'merge'
              : 'unshift',
          value: data
        })
      )
    },
    append(data) {
      this.$store.commit(
        'flow/UPDATE_DATA',
        Object.assign({}, this.params, {
          method:
            Object.prototype.toString.call(data) === '[object Array]'
              ? 'concat'
              : 'push',
          value: data
        })
      )
    },
    patch(objectArray) {
      this.$store.commit(
        'flow/UPDATE_DATA',
        Object.assign({}, this.params, {
          method: 'patch',
          value: objectArray
        })
      )
    },
    insertBefore({ id, value }) {
      this.$store.commit(
        'flow/UPDATE_DATA',
        Object.assign({}, this.params, {
          method: 'insert-before',
          id,
          value
        })
      )
    },
    insertAfter({ id, value }) {
      this.$store.commit(
        'flow/UPDATE_DATA',
        Object.assign({}, this.params, {
          method: 'insert-after',
          id,
          value
        })
      )
    },
    getResource(key = 'extra') {
      return this.source[key]
    },
    async refresh() {
      const { query } = this.params
      query.__refresh__ = true
      await this.$store.dispatch(
        'flow/initData',
        Object.assign({}, this.params, {
          query
        })
      )
      this._initFlowLoader()
    },
    async jump(page) {
      const { query } = this.params
      query.page = page
      await this.$store.dispatch(
        'flow/loadMore',
        Object.assign({}, this.params, {
          query
        })
      )
    },
    async loadBefore({ force } = { force: false }) {
      const { query } = this.params
      query.is_up = 1
      await this.$store.dispatch(
        'flow/loadMore',
        Object.assign({}, this.params, {
          query,
          force
        })
      )
    },
    initData(obj = {}) {
      this.$nextTick(async () => {
        const query = Object.assign(
          {
            is_up: this.sort === 'desc' ? 0 : 1
          },
          this.params.query,
          obj
        )
        await this.$store.dispatch(
          'flow/initData',
          Object.assign({}, this.params, {
            query
          })
        )
      })
    },
    async loadMore({ force } = { force: false }) {
      const { query } = this.params
      query.is_up = 0
      await this.$store.dispatch(
        'flow/loadMore',
        Object.assign({}, this.params, {
          query,
          force
        })
      )
    },
    retry() {
      if (this.source.fetched) {
        this.loadMore()
      } else {
        this.initData({
          __refresh__: true
        })
      }
    },
    clear() {
      if (this.source) {
        this.$store.commit('flow/INIT_STATE', this.params)
      }
    },
    _getTarget() {
      let el = this.$el
      if (!el) {
        return null
      }
      while (
        el &&
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
    _initState() {
      if (this.source) {
        return
      }
      this.$store.commit('flow/INIT_STATE', this.params)
    },
    _initFlowLoader() {
      if (this.auto === 0) {
        this._initState()
      } else {
        checkInView(this.$refs.state, this.preload)
          ? this.initData()
          : this._initState()
        on(this._getTarget(), 'scroll', this._onScreenScroll)
      }
    },
    _retryData() {
      if (this.retryOnError) {
        if (this.source.fetched) {
          this.loadMore()
        } else {
          this.initData({
            __refresh__: true
          })
        }
      }
    },
    _onScreenScroll: throttle(200, function() {
      if (this.source.loading || this.source.nothing || this.source.error) {
        return
      }
      if (
        !this.isAuto ||
        this.source.noMore ||
        (this.isPagination && this.source.fetched)
      ) {
        off(this._getTarget(), 'scroll', this._onScreenScroll)
        return
      }
      if (this.isAuto && checkInView(this.$refs.state, this.preload)) {
        if (this.source.fetched) {
          this.loadMore()
        } else {
          this.initData()
        }
      }
    })
  }
}
</script>
