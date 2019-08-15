<template>
  <div class="flow-loader">
    <template v-if="source">
      <!--  flow header  -->
      <slot
        :source="source"
        name="header"
      />
      <!--  flow list  -->
      <slot
        :flow="source.result"
        :total="source.total"
        :count="source.result.length"
        :extra="source.extra"
      />
      <!--  flow footer  -->
      <slot
        :source="source"
        name="footer"
      />
    </template>
    <!--  flow state  -->
    <div
      ref="state"
      class="flow-loader-state"
      :style="{ textAlign: 'center' }"
    >
      <template v-if="source">
        <!--   error   -->
        <div
          v-if="source.error"
          class="flow-loader-state-error"
          @click="_retryData"
        >
          <slot
            v-if="useFirstError && !source.result.length"
            name="first-error"
            :error="source.error"
          >
            <span>出错了，点击重试</span>
          </slot>
          <slot
            v-else
            name="error"
            :error="source.error"
          >
            <span>出错了，点击重试</span>
          </slot>
        </div>
        <!--   loading   -->
        <div
          v-else-if="source.loading"
          class="flow-loader-state-loading"
        >
          <slot
            v-if="useFirstLoading && !source.result.length"
            name="first-loading"
          >
            <span>加载中…</span>
          </slot>
          <slot
            v-else
            name="loading"
          >
            <span>加载中…</span>
          </slot>
        </div>
        <!--   nothing   -->
        <div
          v-else-if="source.nothing"
          class="flow-loader-state-nothing"
        >
          <slot name="nothing">
            <span>这里什么都没有</span>
          </slot>
        </div>
        <!--   no-more   -->
        <div
          v-else-if="source.noMore"
          class="flow-loader-state-no-more"
        >
          <slot
            v-if="displayNoMore"
            name="no-more"
          >
            <span>没有更多了</span>
          </slot>
        </div>
        <!--   normal   -->
        <template v-else-if="!isPagination">
          <div
            v-if="isAuto"
            class="flow-loader-state-shim"
          />
          <div
            v-else
            class="flow-loader-state-load"
            @click="loadMore()"
          >
            <slot name="load">
              点击加载更多
            </slot>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<script>
import { throttle } from 'throttle-debounce'
import { on, off, checkInView, generateRequestParams, isArray, generateFieldName } from './utils'

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
    }
  },
  data() {
    return {
      firstBind: true
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
      this._fireSSRCallback()
      this._initFlowLoader()
    })
  },
  methods: {
    modify({ key, value }) {
      this.$store.commit(
        'flow/UPDATE_DATA',
        {
          ...this.params,
          ...{
            method: 'modify',
            key,
            value
          }
        }
      )
    },
    update({ id, key, value, changing }) {
      this.$store.commit(
        'flow/UPDATE_DATA',
        {
          ...this.params,
          ...{
            method: 'update',
            id,
            key,
            value,
            changing
          }
        }
      )
    },
    delete(id, key, changing) {
      this.$store.commit(
        'flow/UPDATE_DATA',
        {
          ...this.params,
          ...{
            method: 'delete',
            id,
            key,
            changing
          }
        }
      )
    },
    prepend(value, key, changing) {
      this.$store.commit(
        'flow/UPDATE_DATA',
        {
          ...this.params,
          ...{
            method: isArray(value) ? 'merge' : 'unshift',
            key,
            value,
            changing
          }
        }
      )
    },
    append(value, key, changing) {
      this.$store.commit(
        'flow/UPDATE_DATA',
        {
          ...this.params,
          ...{
            method: isArray(value) ? 'concat' : 'push',
            key,
            value,
            changing
          }
        }
      )
    },
    patch(value, key, changing) {
      this.$store.commit(
        'flow/UPDATE_DATA',
        {
          ...this.params,
          ...{
            method: 'patch',
            key,
            value,
            changing
          }
        }
      )
    },
    insertBefore({ id, value, key, changing }) {
      this.$store.commit(
        'flow/UPDATE_DATA',
        {
          ...this.params,
          ...{
            method: 'insert-before',
            id,
            key,
            value,
            changing
          }
        }
      )
    },
    insertAfter({ id, value, key, changing }) {
      this.$store.commit(
        'flow/UPDATE_DATA',
        {
          ...this.params,
          ...{
            method: 'insert-after',
            id,
            key,
            value,
            changing
          }
        }
      )
    },
    getResource(key = 'extra') {
      if (!this.source) {
        return
      }
      return this.source[key]
    },
    jump(page) {
      const query = { ...this.params.query }
      query.page = page
      this.$store.dispatch(
        'flow/loadMore',
        {
          ...this.params,
          ...{ query }
        }
      )
    },
    refresh(reload = false) {
      this.$nextTick(async () => {
        const query = { ...this.params.query }
        query.__refresh__ = true
        query.__reload__ = reload
        await this.$store.dispatch(
          'flow/initData',
          {
            ...this.params,
            ...{ query }
          }
        )
        this._initFlowLoader()
      })
    },
    initData(obj = {}) {
      this.$nextTick(() => {
        const query = { ...this.params.query, ...obj }
        this.$store.dispatch(
          'flow/initData',
          {
            ...this.params,
            ...{ query }
          }
        )
      })
    },
    loadBefore(obj = {}, force = false) {
      if (this.isPagination) {
        return
      }
      const query = { ...this.params.query, ...obj }
      query.is_up = 1
      this.$store.dispatch(
        'flow/loadMore',
        {
          ...this.params,
          ...{
            query,
            force
          }
        }
      )
    },
    loadMore(obj = {}, force = false) {
      if (this.isPagination) {
        return
      }
      const query = { ...this.params.query, ...obj }
      query.is_up = 0
      this.$store.dispatch(
        'flow/loadMore',
        {
          ...this.params,
          ...{
            query,
            force
          }
        }
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
      if (!this.source) {
        return
      }
      this.$store.commit('flow/INIT_STATE', generateFieldName(this.func, this.type, this.query))
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
          if (el.tagName === 'HTML' || el.tagName === 'BODY') {
            return document
          }
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
      this.$store.commit('flow/INIT_STATE', generateFieldName(this.func, this.type, this.query))
    },
    _initFlowLoader() {
      if (this.auto === 0) {
        this._initState()
      } else {
        if (this.$refs.state && checkInView(this.$refs.state, this.preload)) {
          this.initData()
        } else {
          this._initState()
        }
        on(this._getTarget(), 'scroll', this._onScreenScroll)
      }
    },
    _retryData() {
      if (!this.retryOnError) {
        return
      }
      if (this.source.fetched) {
        this.loadMore()
      } else {
        this.initData({
          __refresh__: true
        })
      }
    },
    _fireSSRCallback() {
      if (!this.firstBind || !checkInView(this.$el, this.preload)) {
        return
      }
      this.firstBind = false
      if (this.source && this.source.fetched) {
        this.callback &&
        this.callback({
          params: generateRequestParams(
            { fetched: false },
            this.params.query,
            this.type
          ),
          data: {
            result: this.source.result,
            extra: this.source.extra,
            noMore: this.source.noMore,
            total: this.source.total
          },
          refresh: false
        })
      }
    },
    _onScreenScroll: throttle(200, function() {
      if (!this.source) {
        this._initState()
        return
      }
      if (this.source.loading || this.source.error) {
        return
      }
      if (
        !this.isAuto ||
        this.source.noMore ||
        this.source.nothing ||
        (this.isPagination && this.source.fetched)
      ) {
        off(this._getTarget(), 'scroll', this._onScreenScroll)
        return
      }
      if (!this.$refs.state) {
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
