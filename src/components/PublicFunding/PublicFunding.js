import React, { Fragment, PureComponent } from 'react'
import { withTranslation } from 'react-i18next'
import {
  Card,
  Elevation,
} from '@blueprintjs/core'

import Pagination from 'ui/Pagination'
import SyncSymbolPrefButton from 'ui/SyncSymbolPrefButton'
import SyncNotSetYet from 'ui/SyncNotSetYet'
import TimeRange from 'ui/TimeRange'
import DataTable from 'ui/DataTable'
import ExportButton from 'ui/ExportButton'
import Loading from 'ui/Loading'
import NoData from 'ui/NoData'
import SymbolSelector from 'ui/SymbolSelector'
import RefreshButton from 'ui/RefreshButton'
import queryConstants from 'state/query/constants'
import { getQueryLimit, getPageSize, getPath } from 'state/query/utils'
import {
  checkFetch,
  getCurrentEntries,
  getNoAuthTokenUrlString,
} from 'state/utils'
import { platform } from 'var/config'

import getColumns from './PublicFunding.columns'
import { propTypes, defaultProps } from './PublicFunding.props'

const TYPE = queryConstants.MENU_PUBLIC_FUNDING
const LIMIT = getQueryLimit(TYPE)
const PAGE_SIZE = getPageSize(TYPE)
const WILD_CARD = ['']

class PublicFunding extends PureComponent {
  componentDidMount() {
    const { loading, fetchPublicfunding, match } = this.props
    if (loading) {
      const pair = (match.params && match.params.symbol) || ''
      fetchPublicfunding(pair)
    }
  }

  componentDidUpdate(prevProps) {
    checkFetch(prevProps, this.props, TYPE)
  }

  handleClick = (symbol) => {
    const { history, targetSymbol, setTargetSymbol } = this.props
    if (symbol !== targetSymbol) {
      // show select symbol in url
      history.push(`${getPath(TYPE)}/${symbol.toUpperCase()}${getNoAuthTokenUrlString(history.location.search)}`)
      setTargetSymbol(symbol)
    }
  }

  render() {
    const {
      coins,
      currencies,
      fetchNext,
      fetchPrev,
      getFullTime,
      hasSyncPref,
      offset,
      pageOffset,
      pageLoading,
      entries,
      handleClickExport,
      jumpPage,
      loading,
      refresh,
      t,
      targetSymbol,
      nextPage,
      timeOffset,
    } = this.props
    if (platform.showSyncMode && !hasSyncPref) {
      return (
        <SyncNotSetYet acceptSymbol />
      )
    }

    const filteredData = getCurrentEntries(entries, offset, LIMIT, pageOffset, PAGE_SIZE)
    const currentSymbol = targetSymbol || 'USD'
    const numRows = filteredData.length
    const tableColums = getColumns({
      filteredData,
      getFullTime,
      t,
      targetSymbol,
      timeOffset,
    })

    const renderPagination = (
      <Pagination
        type={TYPE}
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

    const renderPairSelector = (
      <Fragment>
        {' '}
        <SymbolSelector
          coins={coins}
          currencies={currencies}
          currentCoin={currentSymbol}
          existingCoins={[]}
          onSymbolSelect={this.handleClick}
          wildCard={WILD_CARD}
        />
      </Fragment>
    )

    let showContent
    if (loading) {
      showContent = (
        <Loading title='publicfunding.title' />
      )
    } else if (numRows === 0) {
      showContent = (
        <Fragment>
          <h4>
            {t('publicfunding.title')}
            {' '}
            <TimeRange />
            {renderPairSelector}
            <SyncSymbolPrefButton />
          </h4>
          <NoData />
        </Fragment>
      )
    } else {
      showContent = (
        <Fragment>
          <h4>
            {t('publicfunding.title')}
            {' '}
            <TimeRange />
            {renderPairSelector}
            {' '}
            <ExportButton handleClickExport={handleClickExport} />
            {' '}
            <RefreshButton handleClickRefresh={refresh} />
            <SyncSymbolPrefButton />
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

PublicFunding.propTypes = propTypes
PublicFunding.defaultProps = defaultProps

export default withTranslation('translations')(PublicFunding)
