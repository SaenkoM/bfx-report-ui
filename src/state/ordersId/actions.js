import types from './constants'

/**
 * Create an action to fetch Orders data.
 * @param {string} id param from url
 */
export function fetchOrders(id) {
  return {
    type: types.FETCH_ORDERS,
    payload: id,
  }
}

/**
 * Create an action to note fetch fail.
 * @param {number} payload fail message
 */
export function fetchFail(payload) {
  return {
    type: types.FETCH_FAIL,
    payload,
  }
}

/**
 * Create an action to refresh orders.
 */
export function refresh() {
  return {
    type: types.REFRESH,
  }
}

/**
 * Create an action to update Orders.
 * @param {Object[]} data data set
 * @param {number} limit query limit
 * @param {number} pageSize page size
 */
export function updateOrders(data, limit, pageSize) {
  return {
    type: types.UPDATE_ORDERS,
    payload: {
      data,
      limit,
      pageSize,
    },
  }
}

export default {
  fetchFail,
  fetchOrders,
  refresh,
  updateOrders,
}
