import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import actions from 'state/positions/actions'
import { getFullTime, getTimeOffset } from 'state/base/selectors'
import {
  getDataReceived,
  getEntries,
  getExistingPairs,
  getNextPage,
  getOffset,
  getPageLoading,
  getPageOffset,
  getTargetPairs,
} from 'state/positions/selectors'

import Positions from './Positions'

const mapStateToProps = (state = {}) => ({
  entries: getEntries(state),
  existingPairs: getExistingPairs(state),
  getFullTime: getFullTime(state),
  loading: !getDataReceived(state),
  nextPage: getNextPage(state),
  offset: getOffset(state),
  pageOffset: getPageOffset(state),
  pageLoading: getPageLoading(state),
  targetPairs: getTargetPairs(state),
  timeOffset: getTimeOffset(state),
})

const mapDispatchToProps = dispatch => ({
  fetchPositions: pair => dispatch(actions.fetchPositions(pair)),
  fetchNext: queryLimit => dispatch(actions.fetchNextPositions(queryLimit)),
  fetchPrev: queryLimit => dispatch(actions.fetchPrevPositions(queryLimit)),
  jumpPage: (page, queryLimit) => dispatch(actions.jumpPage(page, queryLimit)),
  refresh: () => dispatch(actions.refresh()),
  addTargetPair: pair => dispatch(actions.addTargetPair(pair)),
  removeTargetPair: pair => dispatch(actions.removeTargetPair(pair)),
})

const PositionsContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(Positions))

export default PositionsContainer
