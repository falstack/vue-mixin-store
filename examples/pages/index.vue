<style lang="scss">
#index {
  img {
    display: block;
    height: auto;
    width: 100%;
  }
}
</style>

<template>
  <div id="index">
    <button @click="changeRank">
      切换 rank
    </button>
    <v-switcher
      :headers="headers"
      :swipe="true"
      @change="handleSwitch"
    >
      <FlowLoader
        slot="0"
        ref="loader0"
        func="getListByPage"
        type="page"
        :query="{ count: 10, rank }"
        :auto="0"
        :callback="testPatch"
        :callback-once="false"
      >
        <template #default="{ flow }">
          <ul class="demo-list">
            <li
              v-for="(item, index) in flow"
              :key="item.id"
            >
              <div :style="{ backgroundColor: item.style.color }">
                count：{{ index + 1 }}，id：{{ item.id }}，like：{{ item.like }}，name：{{ item.data.name }}
              </div>
            </li>
          </ul>
        </template>
      </FlowLoader>
      <FlowLoader
        slot="1"
        ref="loader1"
        func="getListBySeenIds"
        type="seenIds"
        :query="{
          count: 10,
          changing: 'data.number_id',
          rank
        }"
        :auto="0"
      >
        <ul
          slot-scope="{ flow }"
          class="demo-list"
        >
          <li
            v-for="(item, index) in flow"
            :key="item.id"
          >
            <div :style="{ backgroundColor: item.style.color }">
              count：{{ index + 1 }}，id：{{ item.data.number_id }}
            </div>
          </li>
        </ul>
      </FlowLoader>
      <FlowLoader
        slot="2"
        ref="loader2"
        func="getListBySinceId"
        type="sinceId"
        :query="{
          count: 10,
          changing: 'data.number_id',
          rank
        }"
        :auto="0"
      >
        <template #default="{ flow, count }">
          <ul class="demo-list">
            <virtual-list
              v-if="count"
              ref="vlist"
              :size="110"
              :remain="10"
              :item="item"
              :itemcount="count"
              :pagemode="true"
              :itemprops="getItemprops"
            />
          </ul>
        </template>
      </FlowLoader>
    </v-switcher>
  </div>
</template>

<script>
import virtualList from 'vue-virtual-scroll-list'
import item from '../components/Item'

export default {
  name: 'Index',
  components: {
    virtualList
  },
  props: {},
  data() {
    return {
      item,
      activeIndex: 0,
      rank: 0
    }
  },
  computed: {
    headers() {
      return ['tab-0', 'tab-1', 'tab-2']
    }
  },
  methods: {
    changeRank() {
      this.rank = this.rank === 1 ? 0 : 1
      this.initData()
    },
    handleSwitch(index) {
      this.activeIndex = index
      this.initData()
    },
    initData() {
      if (this.activeIndex === 0) {
        this.$refs.loader0.initData()
      } else if (this.activeIndex === 1) {
        this.$refs.loader1.initData()
      } else {
        this.$refs.loader2.initData()
      }
    },
    getItemprops(index) {
      return {
        props: {
          item: this.$refs.loader2.source.result[index],
          index
        }
      }
    },
    testPatch({ data }) {
      console.log('testPatch')
      const patch = data.result.map(_ => {
        return Object.assign({
          id: _.id,
          like: true
        })
      }).slice(0, 3)
      this.$refs.loader0.patch(patch)
    }
  }
}
</script>
