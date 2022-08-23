import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { DatePicker, Checkbox, Button, Icon } from 'antd'
import * as _ from 'lodash'
import moment from 'moment'
import { compareString } from '../common/utils'
const { MonthPicker, RangePicker } = DatePicker
const CheckboxGroup = Checkbox.Group

class Payouts extends Component {

  constructor (props) {
    super(props)

    this.state = {
      checkedList: this.props.defaultCheckedList,
      indeterminate: true,
      checkAll: false
    }
  }
  onChange (checkedList) {
    this.setState({
      checkedList,
      indeterminate: !!checkedList.length && (checkedList.length < this.props.plainOptions.length),
      checkAll: checkedList.length === this.props.plainOptions.length,
    })
  }

  onCheckAllChange (e) {
    this.setState({
      checkedList: e.target.checked ? this.props.plainOptions : [],
      indeterminate: false,
      checkAll: e.target.checked
    })
  }

  render () {
    const dateFormat = 'MM/DD/YYYY'
    const monthFormat = 'MM/YYYY'
    const {plainOptions, defaultCheckedList} = this.props
    return (
      <div style={styles.container}>
          <span>
            <span>Pick date range for export</span>
            <RangePicker style={styles.picker} format={dateFormat} />
          </span>
          <Button type="primary" icon="download" size={'large'}>Download .csv File</Button>
      </div>
    )
  }
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'aliceblue',
    padding: 20,
    // marginBottom: 25
  },
  picker: {
    margin: '0 2em 0 0.5em',
    fontSize: '1.5em',
    // marginTop: 20,
    // marginBottom: 20,
  }
}

Payouts.defaultProps = {
  plainOptions: [
    'Salon Name',
    'Salon Address',
    'Number of bookings during selected time frame',
    'Overall average rating of salon',
    'Average rating during this time period',
    'Pay rate (per booking)',
    'Total owed for this time frame',
    'Total paid alltime'
  ],
  defaultCheckedList: ['Apple', 'Orange']
}

Payouts.propTypes = {
}

export default Payouts
