import ItemFactory from './item-factory'

export const getListByPage = ({ page, count }) => {
  console.log('page', page)
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

let SINCE_HAS_FETCHED = 0
export const getListBySinceId = ({ since_id, is_up, count }) => {
  console.log('since_id', since_id)
  console.log('is_up', is_up)
  console.log('count', count)
  return new Promise(resolve => {
    const total = 87
    const hasFetch = SINCE_HAS_FETCHED
    const getLength = total - hasFetch >= count ? count : total - hasFetch
    const noMore = getLength + hasFetch >= total
    setTimeout(() => {
      SINCE_HAS_FETCHED += count
      const result = ItemFactory.get(getLength)
      resolve({
        result,
        noMore,
        pageInfo: {
          numPages: Math.ceil(total / count),
          numResults: total
        }
      })
    }, 500)
  })
}

export const getListByJump = ({ page, count }) => {
  console.log('page', page)
  return new Promise(resolve => {
    const total = 87
    const hasFetch = (page - 1) * count
    const getLength = total - hasFetch >= count ? count : total - hasFetch
    setTimeout(() => {
      const result = ItemFactory.get(getLength)
      resolve({
        result,
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

export const getListByFirstLoading = ({ page, count }) => {
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
    }, hasFetch ? 500 : 3000)
  })
}

let ERROR_COUNT = 0
export const getListByFirstError = ({ page, count }) => {
  return new Promise((resolve, reject) => {
    const total = 87
    const hasFetch = (page - 1) * count
    const getLength = total - hasFetch >= count ? count : total - hasFetch
    const noMore = getLength + hasFetch >= total
    setTimeout(() => {
      if (ERROR_COUNT < 3) {
        ERROR_COUNT++
        return reject({
          code: 500,
          message: 'error'
        })
      }
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

let LAST_FETCHED_COUNT = 0
export const getListByLastId = ({ last_id, count }) => {
  console.log('last_id', last_id)
  if (!last_id) {
    LAST_FETCHED_COUNT = 0
  }
  return new Promise(resolve => {
    const beginId = 0
    const total = 87
    const hasFetch = LAST_FETCHED_COUNT - beginId
    const getLength = total - hasFetch >= count ? count : total - hasFetch
    const noMore = getLength + hasFetch >= total
    setTimeout(() => {
      const result = ItemFactory.get(getLength)
      LAST_FETCHED_COUNT += getLength
      resolve({
        result,
        noMore,
        total
      })
    }, 500)
  })
}

export const getListBySeenIds = ({ seen_ids, count }) => {
  console.log('seen_ids', seen_ids)
  return new Promise(resolve => {
    const total = 87
    const hasFetch = seen_ids.split(',').length
    const getLength = total - hasFetch >= count ? count : total - hasFetch
    const noMore = getLength + hasFetch >= total
    setTimeout(() => {
      const result = ItemFactory.get(getLength)
      LAST_FETCHED_COUNT += getLength
      resolve({
        result,
        noMore,
        total
      })
    }, 500)
  })
}

export const getListByNothing = ({ page, count }) => {
  return new Promise(resolve => {
    const total = 0
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
