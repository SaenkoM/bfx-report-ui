import PropTypes from 'prop-types'

const BALANCE_ENTRIES_PROPS = PropTypes.shape({
  mts: PropTypes.number.isRequired,
})

export const propTypes = {
  entries: PropTypes.arrayOf(BALANCE_ENTRIES_PROPS).isRequired,
  loading: PropTypes.bool.isRequired,
  refresh: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  params: PropTypes.object.isRequired,
  fetchBalance: PropTypes.func.isRequired,
  timezone: PropTypes.string,
}

export const defaultProps = {
  entries: [],
  loading: true,
  refresh: () => {},
  params: {},
  fetchBalance: () => {},
  timezone: '',
}
