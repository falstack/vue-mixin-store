import ItemFactory from './item-factory'

export const getListByPage = ({ page, count }) => {
  return new Promise(resolve => {
    const total = 87
    const hasFetch = (page - 1) * count
    const getLength = total - hasFetch >= count ? count : total - hasFetch
    const noMore = getLength + hasFetch >= total
    setTimeout(() => {
      const result = ItemFactory.get(getLength)
      resolve({
        result,
        noMore,
        pageInfo: {
          page,
          numPages: Math.ceil(total / count),
          numResults: total
        }
      })
    }, 500)
  })
}

export const getListWithError = ({ page, count }) => {
  return new Promise((resolve, reject) => {
    const total = 87
    const hasFetch = (page - 1) * count
    const getLength = total - hasFetch >= count ? count : total - hasFetch
    const noMore = getLength + hasFetch >= total
    setTimeout(() => {
      if (Date.now() % 2) {
        const result = ItemFactory.get(getLength)
        resolve({
          result,
          noMore,
          pageInfo: {
            page,
            numPages: Math.ceil(total / count),
            numResults: total
          }
        })
      } else {
        reject({
          code: 500,
          message: 'error'
        })
      }
    }, 1500)
  })
}
