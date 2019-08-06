// https://docs.bitfinex.com/v2/reference#orders-history
import {
  formatInternalSymbol, formatSymbolToPair, mapSymbol, mapPair,
} from 'state/symbols/utils'
import queryTypes from 'state/query/constants'
import authTypes from 'state/auth/constants'
import {
  fetchFail,
  getPageOffset,
  setTimeRange,
} from 'state/reducers.helper'

import types from './constants'

const initialState = {
  entries: [],
}

const TYPE = queryTypes.MENU_ORDERS_ID

export function ordersIdReducer(state = initialState, action) {
  const { type: actionType, payload } = action
  switch (actionType) {
    case types.UPDATE_ORDERS: {
      if (!payload) {
        return {
          ...state,
          dataReceived: true,
        }
      }
      const { data, limit, pageSize } = payload
      const { res, nextPage } = data
      const { existingPairs } = state
      const updatePairs = [...existingPairs]
      let smallestMts
      const entries = res.map((entry) => {
        const {
          amount,
          amountExecuted,
          amountOrig,
          cid,
          flags,
          gid,
          id,
          mtsCreate,
          mtsUpdate,
          notify,
          placedId,
          price,
          priceAvg,
          priceAuxLimit,
          priceTrailing,
          status,
          symbol,
          type,
          typePrev,
        } = entry
        const internalPair = mapPair(formatInternalSymbol(symbol))
        // save new pair to updatePairs list
        if (updatePairs.indexOf(internalPair) === -1) {
          updatePairs.push(internalPair)
        }
        // log smallest mts
        if (nextPage === false && (!smallestMts || smallestMts > mtsUpdate)) {
          smallestMts = mtsUpdate
        }
        return {
          id,
          gid,
          cid,
          pair: formatSymbolToPair(symbol).split('/').map(mapSymbol).join('/'),
          mtsCreate,
          mtsUpdate,
          amount,
          amountExecuted,
          amountOrig,
          type,
          typePrev,
          flags,
          status,
          price,
          priceAvg,
          priceTrailing,
          priceAuxLimit,
          notify,
          placedId,
        }
      })
      const [offset, pageOffset] = getPageOffset(state, entries, limit, pageSize)
      return {
        ...state,
        currentEntriesSize: entries.length,
        dataReceived: true,
        entries: [...state.entries, ...entries],
        existingPairs: updatePairs.sort(),
        smallestMts: nextPage !== false ? nextPage : smallestMts - 1,
        offset,
        pageOffset,
        pageLoading: false,
        nextPage,
      }
    }
    case types.FETCH_FAIL:
      return fetchFail(state)
    case queryTypes.SET_TIME_RANGE:
      return setTimeRange(TYPE, state, initialState)
    case authTypes.LOGOUT:
      return initialState
    default: {
      return state
    }
  }
}

export default ordersIdReducer
