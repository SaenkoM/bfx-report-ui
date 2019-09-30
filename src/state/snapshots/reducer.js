import authTypes from 'state/auth/constants'
import { formatSymbolToPair, mapSymbol } from 'state/symbols/utils'
import { getFrameworkPositionsEntries, getFrameworkPositionsTickersEntries } from 'state/utils'

import types from './constants'

export const initialState = {
  dataReceived: false,
  positionsTotalPlUsd: null,
  positionsEntries: [],
  positionsTickersEntries: [],
  walletsTotalBalanceUsd: null,
  walletsTickersEntries: [],
  walletsEntries: [],
  timestamp: undefined,
}

const getWalletsTickersEntries = entries => entries.map((entry) => {
  const {
    walletType,
    symbol,
    amount,
  } = entry

  return {
    walletType,
    pair: formatSymbolToPair(symbol),
    amount,
  }
})

const getWalletsEntries = entries => entries.map((entry) => {
  const {
    type,
    currency,
    balance,
    balanceUsd,
  } = entry

  return {
    type,
    currency: mapSymbol(currency),
    balance,
    balanceUsd,
  }
}).sort((a, b) => a.currency.localeCompare(b.currency))

export function snapshotsReducer(state = initialState, action) {
  const { type: actionType, payload } = action
  switch (actionType) {
    case types.UPDATE_SNAPSHOTS: {
      if (!payload) {
        return {
          ...state,
          dataReceived: true,
        }
      }

      const {
        positionsSnapshot = [], positionsTickers = [], walletsTickers = [], walletsSnapshot = [],
        positionsTotalPlUsd = null, walletsTotalBalanceUsd = null,
      } = payload

      return {
        ...state,
        dataReceived: true,
        positionsTotalPlUsd,
        positionsEntries: getFrameworkPositionsEntries(positionsSnapshot),
        positionsTickersEntries: getFrameworkPositionsTickersEntries(positionsTickers),
        walletsTotalBalanceUsd,
        walletsTickersEntries: getWalletsTickersEntries(walletsTickers),
        walletsEntries: getWalletsEntries(walletsSnapshot),
      }
    }
    case types.SET_TIMESTAMP:
      return {
        ...initialState,
        timestamp: payload,
      }
    case types.FETCH_FAIL:
      return state
    case types.REFRESH:
      return {
        ...initialState,
        timestamp: state.timestamp,
      }
    case authTypes.LOGOUT:
      return initialState
    default: {
      return state
    }
  }
}

export default snapshotsReducer
