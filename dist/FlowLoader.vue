<template>
  <div
    :style="loaderStyle"
    class="flow-loader"
  >
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
      :style="stateStyle"
      class="flow-loader-state"
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
    <div
      ref="state"
      :style="detectStyle"
      class="flow-loader-detect"
    />
  </div>
</template>

<script>
import { on, off, checkInView, generateRequestParams, isArray, generateFieldName, getScrollParentDom, getObserver } from './utils'

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
    useRect: {
      type: Boolean,
      default: false
    },
    debug: {
      type: Boolean,
      default: false
    },
    duration: {
      type: String,
      default: 'v'
    }
  },
  data() {
    return {
      firstBind: true,
      throttle: false
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
        cacheTimeout: this.$isServer ? 0 : this.cacheTimeout
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
    },
    observer() {
      if (this.$isServer || this.useRect) {
        return null
      }
      return getObserver
    },
    stateStyle() {
      return {
        textAlign: 'center'
      }
    },
    loaderStyle() {
      return {
        position: 'relative'
      }
    },
    detectStyle() {
      const isVer = this.duration === 'v'
      return {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: isVer ? '100%' : `${this.preload}px`,
        height: isVer ? `${this.preload}px` : '100%',
        zIndex: '-1',
        background: 'transparent'
      }
    }
  },
  watch: {
    query: {
      handler: function () {
        if (this.source) {
          return
        }
        this.$nextTick(() => {
          this._debug('query change')
          setTimeout(() => {
            this._initFlowLoader()
          }, 0)
        })
      },
      deep: true
    }
  },
  mounted() {
    this.$nextTick(() => {
      this._fireSSRCallback()
      this._initFlowLoader()
    })
    this._debug('mounted')
  },
  beforeDestroy() {
    this._debug('beforeDestroy')
    if (this.observer) {
      this.observer.unobserve(this.$refs.state)
      this.observer.disconnect()
    } else {
      off(getScrollParentDom(this.$el), 'scroll', this._onScreenScroll)
    }
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
      return this.$store.dispatch(
        'flow/loadMore',
        {
          ...this.params,
          ...{ query }
        }
      )
    },
    refresh(reload = false) {
      return new Promise((resolve, reject) => {
        this.$nextTick(async () => {
          const query = { ...this.params.query }
          query.__refresh__ = true
          query.__reload__ = reload
          try {
            await this.$store.dispatch(
              'flow/initData',
              {
                ...this.params,
                ...{ query }
              }
            )
            this._initFlowLoader()
            resolve()
          } catch (e) {
            reject()
          }
        })
      })
    },
    initData(obj = {}) {
      return new Promise((resolve, reject) => {
        this.$nextTick(async () => {
          const query = { ...this.params.query, ...obj }
          try {
            await this.$store.dispatch(
              'flow/initData',
              {
                ...this.params,
                ...{ query }
              }
            )
            // 如果列表的数据没有撑满页面，就继续请求更多
            if (
              this.isAuth &&
              this.$refs.state &&
              checkInView(this.$refs.state)
            ) {
              this.loadMore()
            }
            resolve()
          } catch (e) {
            reject()
          }
        })
      })
    },
    loadBefore(obj = {}, force = false) {
      if (this.isPagination) {
        return
      }
      const query = { ...this.params.query, ...obj }
      query.is_up = 1
      return this.$store.dispatch(
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
      return this.$store.dispatch(
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
        return this.loadMore()
      } else {
        return this.initData({
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
    forceCallback() {
      this._fireSSRCallback(true)
    },
    _initState() {
      if (this.source) {
        return
      }
      this.$store.commit('flow/INIT_STATE', generateFieldName(this.func, this.type, this.query))
    },
    _initFlowLoader() {
      this._debug('_initFlowLoader')
      this._initState()
      if (this.auto === 0) {
        this._debug('_initFlowLoader return 0')
        return
      }
      const stateDom = this.$refs.state
      this._debug(stateDom)
      if (stateDom && checkInView(stateDom)) {
        this.initData()
      }
      if (this.observer) {
        this._debug('_initFlowLoader listen 0')
        stateDom.__flow_handler__ = this._fetchDataFunc.bind(this)
        this.observer.observe(stateDom)
      } else {
        this._debug('_initFlowLoader listen 1')
        on(getScrollParentDom(this.$el), 'scroll', this._onScreenScroll)
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
    _fireSSRCallback(force = false) {
      if (!force && (!this.firstBind || !checkInView(this.$el, this.preload))) {
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
    _fetchDataFunc() {
      if (!this.source) {
        this._initState()
        this._debug('_fetchDataFunc return 0')
        return
      }
      if (this.source.loading || this.source.error) {
        this._debug('_fetchDataFunc return 1')
        return
      }
      if (
        !this.isAuto ||
        this.source.noMore ||
        this.source.nothing ||
        (this.isPagination && this.source.fetched)
      ) {
        this._debug('off handler', !this.isAuto, this.source.noMore, this.source.nothing, (this.isPagination && this.source.fetched))
        if (this.observer) {
          const stateDom = this.$refs.state
          delete stateDom.__flow_handler__
          this.observer.unobserve(stateDom)
        } else {
          off(getScrollParentDom(this.$el), 'scroll', this._onScreenScroll)
        }
        this._debug('_fetchDataFunc return 2')
        return
      }
      const fetcher = () => {
        if (this.source.fetched) {
          this.loadMore()
        } else {
          this.initData()
        }
      }
      if (this.observer) {
        fetcher()
      } else {
        if (!this.$refs.state) {
          this._debug('_fetchDataFunc return 3')
          return
        }
        if (this.isAuto && checkInView(this.$refs.state)) {
          fetcher()
        }
      }
    },
    _onScreenScroll(event, force = false) {
      this._debug('scroll')
      if (!force) {
        if (this.throttle) {
          return
        }
        this.throttle = true
        setTimeout(() => {
          this.throttle = false
          this._onScreenScroll(null, true)
        }, 200)
        return
      }
      this._fetchDataFunc()
    },
    _debug(message) {
      if (!this.debug) {
        return
      }
      const field = `[${generateFieldName(this.func, this.type, this.query)}]`
      console.log(field, 'life cycle', message) // eslint-disable-line
      console.log(field, 'check in view', checkInView(this.$refs.state)) // eslint-disable-line
    }
  }
}
</script>
