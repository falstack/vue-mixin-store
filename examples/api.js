import ItemFactory from './item-factory'

export const getList = ({ page, count }) => {
  return new Promise(resolve => {
    const total = 87
    const hasFetch = page * count
    const getLength = total - hasFetch >= count ? count : total - hasFetch
    const noMore = getLength + hasFetch >= total
    setTimeout(() => {
      const list = ItemFactory.get(getLength)
      resolve({
        list,
        total,
        noMore
      })
    }, 500)
  })
}
