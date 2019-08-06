import React, { Fragment, PureComponent } from 'react'
import { withTranslation } from 'react-i18next'
import {
  Button,
  ButtonGroup,
  Card,
  Elevation, Intent, Position, Tooltip,
} from '@blueprintjs/core'
import _get from 'lodash/get'

import TimeRange from 'ui/TimeRange'
import DataTable from 'ui/DataTable'
import ExportButton from 'ui/ExportButton'
import Loading from 'ui/Loading'
import NoData from 'ui/NoData'
import MultiPairSelector from 'ui/MultiPairSelector'
import RefreshButton from 'ui/RefreshButton'
import queryConstants from 'state/query/constants'
import { checkFetch, togglePair } from 'state/utils'

import getColumns from '../Orders/Orders.columns'
import { propTypes, defaultProps } from './Orders.props'

const { MENU_ORDERS_ID } = queryConstants

class OrdersId extends PureComponent {
  componentDidMount() {
    const { loading, fetchOrders, match } = this.props
    if (loading) {
      const id = _get(match, ['params', 'id'])
      console.log(1, match)
      if (id) {
        fetchOrders(id)
      }
    }
  }

  componentDidUpdate(prevProps) {
    checkFetch(prevProps, this.props, MENU_ORDERS_ID)
  }

  jumpToOrders = () => {
    const { history } = this.props

    history.push(`/orders${history.location.search}`)
  }

  render() {
    const {
      entries,
      handleClickExport,
      loading,
      refresh,
      getFullTime,
      t,
      timeOffset,
    } = this.props

    const numRows = entries.length
    const tableColums = getColumns({
      filteredData: entries,
      getFullTime,
      t,
      timeOffset,
    })

    const renderIdSelector = (
      <Fragment>
        <Tooltip
          content={(
            <span>
              {t('wallets.query.tooltip')}
            </span>
          )}
          position={Position.TOP}
          usePortal
        >
          <MultiPairSelector
            togglePair={pair => togglePair(MENU_ORDERS_ID, this.props, pair)}
          />
        </Tooltip>
        <Button
          onClick={this.handleQuery}
          // intent={hasNewTime ? Intent.PRIMARY : null}
          // disabled={!hasNewTime}
        >
          {t('wallets.query.title')}
        </Button>
      </Fragment>
    )

    const renderButtonGroup = (
      <ButtonGroup>
        <Button onClick={this.jumpToOrders}>{t('orders.title')}</Button>
        <Button active>{t('orders.id.title')}</Button>
      </ButtonGroup>
    )

    let showContent
    if (loading) {
      showContent = (
        <Loading title='orders.title' />
      )
    } else if (numRows === 0) {
      showContent = (
        <Fragment>
          <h4>
            {t('orders.title')}
            {' '}
            <TimeRange />
            {renderIdSelector}
          </h4>
          {renderButtonGroup}
          <br />
          <br />
          <NoData />
        </Fragment>
      )
    } else {
      showContent = (
        <Fragment>
          <h4>
            {t('orders.title')}
            {' '}
            <TimeRange />
            {renderIdSelector}
            {' '}
            <ExportButton handleClickExport={handleClickExport} />
            {' '}
            <RefreshButton handleClickRefresh={refresh} />
          </h4>
          {renderButtonGroup}
          <br />
          <br />
          <br />
          <DataTable
            numRows={numRows}
            tableColums={tableColums}
          />
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

OrdersId.propTypes = propTypes
OrdersId.defaultProps = defaultProps

export default withTranslation('translations')(OrdersId)
