import {
  call,
  put,
  select,
  takeLatest,
} from 'redux-saga/effects'

import { makeFetchCall } from 'state/utils'
import { selectAuth } from 'state/auth/selectors'
import { updateErrorStatus } from 'state/status/actions'

import types from './constants'
import actions from './actions'

const getReqOrders = ({ auth, id }) => makeFetchCall('getOrderTrades', auth, { id: +id, symbol: 'tETHUSD' })

function* fetchOrdersId({ payload: id }) {
  try {
    const auth = yield select(selectAuth)
    const { result, error } = yield call(getReqOrders, { auth, id })

    yield put(actions.updateOrders(result))

    if (error) {
      yield put(actions.fetchFail({
        id: 'status.fail',
        topic: 'orders.title',
        detail: JSON.stringify(error),
      }))
    }
  } catch (fail) {
    yield put(actions.fetchFail({
      id: 'status.request.error',
      topic: 'orders.title',
      detail: JSON.stringify(fail),
    }))
  }
}

function* fetchOrdersIdFail({ payload }) {
  yield put(updateErrorStatus(payload))
}

export default function* ordersIdSaga() {
  yield takeLatest(types.FETCH_ORDERS, fetchOrdersId)
  yield takeLatest(types.FETCH_FAIL, fetchOrdersIdFail)
}
