import authTypes from 'state/auth/constants'
import timeframeConstants from 'ui/TimeframeSelector/constants'

import types from './constants'

const initialState = {
  dataReceived: false,
  entries: [],
  startDate: undefined,
  endDate: undefined,
  timeframe: timeframeConstants.DAY,
  skip: undefined,
}

export function winLossReducer(state = initialState, action) {
  const { type: actionType, payload } = action
  switch (actionType) {
    case types.UPDATE_WIN_LOSS: {
      if (!payload) {
        return {
          ...state,
          dataReceived: true,
        }
      }
      return {
        ...state,
        dataReceived: true,
        entries: payload,
      }
    }
    case types.SET_PARAMS:
      return {
        ...initialState,
        ...payload,
      }
    case types.FETCH_FAIL:
      return state
    case types.REFRESH:
      return {
        ...initialState,
        start: state.start,
        end: state.end,
        timeframe: state.timeframe,
      }
    case authTypes.LOGOUT:
      return initialState
    default: {
      return state
    }
  }
}

export default winLossReducer
