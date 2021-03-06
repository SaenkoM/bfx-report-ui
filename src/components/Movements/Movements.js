import React, { Fragment, PureComponent } from 'react'
import { withTranslation } from 'react-i18next'
import {
  Card,
  Elevation,
} from '@blueprintjs/core'

import Pagination from 'ui/Pagination'
import TimeRange from 'ui/TimeRange'
import DataTable from 'ui/DataTable'
import ExportButton from 'ui/ExportButton'
import Loading from 'ui/Loading'
import NoData from 'ui/NoData'
import RefreshButton from 'ui/RefreshButton'
import MultiSymbolSelector from 'ui/MultiSymbolSelector'
import queryConstants from 'state/query/constants'
import { getQueryLimit, getPageSize } from 'state/query/utils'
import {
  checkFetch,
  getCurrentEntries,
  toggleSymbol,
} from 'state/utils'

import getColumns from './Movements.columns'
import { propTypes, defaultProps } from './Movements.props'

const TYPE_WITHDRAWALS = queryConstants.MENU_WITHDRAWALS
// we treat withdrawals and deposits in the same way
const LIMIT = getQueryLimit(queryConstants.MENU_MOVEMENTS)
const PAGE_SIZE = getPageSize(queryConstants.MENU_MOVEMENTS)

class Movements extends PureComponent {
  componentDidMount() {
    const {
      loading,
      fetchMovements,
      match,
      jumpPage,
    } = this.props
    if (loading) {
      const symbol = (match.params && match.params.symbol) || ''
      fetchMovements(symbol)
    } else {
      jumpPage(0, 25)
    }
  }

  componentDidUpdate(prevProps) {
    checkFetch(prevProps, this.props, 'movements')
  }

  render() {
    const {
      entries,
      existingCoins,
      fetchNext,
      fetchPrev,
      getFullTime,
      handleClickExport,
      jumpPage,
      loading,
      nextPage,
      offset,
      pageOffset,
      pageLoading,
      refresh,
      t,
      targetSymbols,
      timeOffset,
      type,
    } = this.props
    const currentEntries = getCurrentEntries(entries, offset, LIMIT, pageOffset, PAGE_SIZE)
    const filteredData = currentEntries.filter(entry => (type === TYPE_WITHDRAWALS
      ? parseFloat(entry.amount) < 0 : parseFloat(entry.amount) > 0))
    const numRows = filteredData.length
    const tableColums = getColumns({
      filteredData,
      getFullTime,
      t,
      timeOffset,
    })

    const renderSymbolSelector = (
      <Fragment>
        {' '}
        <MultiSymbolSelector
          currentFilters={targetSymbols}
          existingCoins={existingCoins}
          toggleSymbol={symbol => toggleSymbol(type, this.props, symbol)}
        />
      </Fragment>
    )

    const renderPagination = (
      <Pagination
        type='movements'
        dataLen={entries.length}
        loading={pageLoading}
        offset={offset}
        jumpPage={jumpPage}
        prevClick={fetchPrev}
        nextClick={fetchNext}
        pageOffset={pageOffset}
        nextPage={nextPage}
      />
    )

    const titleMsgId = type === TYPE_WITHDRAWALS ? 'withdrawals.title' : 'deposits.title'
    let showContent
    if (loading) {
      showContent = (
        <Loading title={titleMsgId} />
      )
    } else if (currentEntries.length === 0) {
      showContent = (
        <Fragment>
          <h4>
            {t(titleMsgId)}
            {' '}
            <TimeRange />
            {renderSymbolSelector}
          </h4>
          <NoData />
        </Fragment>
      )
    } else {
      showContent = (
        <Fragment>
          <h4>
            {t(titleMsgId)}
            {' '}
            <TimeRange />
            {renderSymbolSelector}
            {' '}
            <ExportButton handleClickExport={handleClickExport} />
            {' '}
            <RefreshButton handleClickRefresh={refresh} />
          </h4>
          {renderPagination}
          <DataTable
            numRows={numRows}
            tableColums={tableColums}
          />
          {renderPagination}
        </Fragment>
      )
    }
    return (
      <Card elevation={Elevation.ZERO} className='col-lg-12 col-md-12 col-sm-12 col-xs-12'>
        {showContent}
      </Card>
    )
  }
}

Movements.propTypes = propTypes
Movements.defaultProps = defaultProps

export default withTranslation('translations')(Movements)
