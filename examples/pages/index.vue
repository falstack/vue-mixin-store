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
    <button @click="changeRank">切换 rank</button>
    <v-switcher :headers="headers" :swipe="true" @change="handleSwitch">
      <FlowLoader
        slot="0"
        ref="loader0"
        func="getListByPage"
        type="page"
        :query="{ count: 10, rank }"
        :auto="0"
      >
        <ul class="demo-list" slot-scope="{ flow }">
          <li v-for="(item, index) in flow" :key="item.id">
            <div :style="{ backgroundColor: item.style.color }">
              count：{{ index + 1 }}，id：{{ item.id }}
            </div>
          </li>
        </ul>
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
        <ul class="demo-list" slot-scope="{ flow }">
          <li v-for="(item, index) in flow" :key="item.id">
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
        <ul class="demo-list" slot-scope="{ flow }">
          <li v-for="(item, index) in flow" :key="item.id">
            <div :style="{ backgroundColor: item.style.color }">
              count：{{ index + 1 }}，id：{{ item.data.number_id }}
            </div>
          </li>
        </ul>
      </FlowLoader>
    </v-switcher>
    <button @click="loadData">load data</button>
  </div>
</template>

<script>
export default {
  name: 'Index',
  components: {},
  props: {},
  data() {
    return {
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
      this.rank++
      this.initData()
    },
    handleSwitch(index) {
      this.activeIndex = index
      this.initData()
    },
    loadData() {
      if (this.activeIndex === 0) {
        this.$refs.loader0.loadMore()
      } else if (this.activeIndex === 1) {
        this.$refs.loader1.loadMore()
      } else {
        this.$refs.loader2.loadMore()
      }
    },
    initData() {
      if (this.activeIndex === 0) {
        this.$refs.loader0.initData()
      } else if (this.activeIndex === 1) {
        this.$refs.loader1.initData()
      } else {
        this.$refs.loader2.initData()
      }
    }
  }
}
</script>
