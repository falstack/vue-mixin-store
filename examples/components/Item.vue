<style lang="scss">
</style>

<template>
  <li>
    <div :style="{ backgroundColor: item.style.color }">
      count：{{ index + 1 }}，id：{{ item.data.number_id }}
    </div>
  </li>
</template>

<script>
export default {
  name: 'Item',
  props: {
    item: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    }
  }
}
</script>
