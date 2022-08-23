'use strict'
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Table, Button, Popconfirm } from 'antd'
import * as _ from 'lodash'
import UsersPacks from './UsersPacks'
import EditableCell from '../common/EditableCell'

class Users extends Component {

  constructor (props) {
    super(props)
    const filters = this.makeFilters(props)
    this.state = {
      data: [],
      waitListFilters: filters.waitListFilters
    }
  }

  componentWillReceiveProps (nextProps) {
    const filters = this.makeFilters(nextProps)
    this.setState({...filters})
  }

  makeFilters (props) {
    const waitListFilters = []
    const wlFilters = []
    for (const id in props.waitList) {
      const w = props.waitList[id]
      if (_.indexOf(wlFilters, w.subAdminArea) < 0) {
        wlFilters.push(w.subAdminArea)
        waitListFilters.push({text: w.subAdminArea, value: w.subAdminArea})
      }
    }
    return {
      waitListFilters: _.sortBy(waitListFilters, ({text, value}) => value)
    }
  }

  renderBlowoutsCount (text, row, index) {
    let cnt = 0
    if (_.has(row, 'curPacks')) {
      for (let p in row.curPacks) {
        cnt += parseInt(row.curPacks[p].curCount, 10)
      }
    }
    return cnt
  }

  renderWaitListed (text, row, index) {
    if (this.props.waitList[row.id]) {
      const wl = this.props.waitList[row.id]
      return (
        <div>{wl.subAdminArea}</div>
      )
    }
  }

  renderOperation (text, row, index) {
    const uid = row.userId
    const { data } = this.state
    let editable = false
    data.forEach((item) => {
      if(item.key == index)
        editable = item.editable  
    })
    if(editable) {
      return (
        <div style= {styles.editableRowOperations}>
          <span>
            <a onClick={() => this.editDone(index, 'save')}>Save</a>
            <Popconfirm title="Sure to cancel?" onConfirm={() => this.editDone(index, 'cancel')}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        </div>
      )
    } else {
      return (
        <div style= {styles.editableRowOperations}>
          <span>
            <a onClick={() => this.edit(index)}>Edit</a>
          </span>
        </div>
      )
    }
  }

  renderColumns (text, row, index) {
    const { data } = this.state
    let editable = false
    data.forEach((item) => {
      if(item.key == index)
        editable = item.editable  
    })
    if(editable) {
      return (
        <EditableCell
          editable={editable}
          value={text}
          onChange={value => this.handleChange(key, index, value)}
        />
      )
    } else {
      return text
    }
  }

  columns () {
    const { waitListFilters } = this.state
    return [
      { title: 'Name', dataIndex: 'name', key: 'name', render: this.renderColumns.bind(this) },
      { title: 'Phone', dataIndex: 'phone', key: 'phone', render: this.renderColumns.bind(this) },
      { title: 'Email', dataIndex: 'email', key: 'email', render: this.renderColumns.bind(this) },
      { title: 'Available blowouts', dataIndex: 'available', key: 'available', render: this.renderBlowoutsCount.bind(this) },
      {
        title: 'Waitlisted',
        key: 'waitlisted',
        render: this.renderWaitListed.bind(this),
        filters: waitListFilters,
        filterMultiple: true,
        onFilter: (value, record) => {
          if (this.props.waitList[record.id]) {
            const wl = this.props.waitList[record.id]
            return wl.subAdminArea === value
          } else {
            return false
          }
        }
      },
      { 
        title: 'operation', 
        dataIndex: 'operation', 
        render: this.renderOperation.bind(this) 
      }
    ]
  }

  handleChange(key, index, value) {
    const { data } = this.state.data;
  }

  edit(index) {
    console.log(index)
    const { data } = this.state
    data.push({key: index, editable : "true"})
    this.setState({ data })
  }

  editDone(index, type) {
    const { data } = this.state.data
  }

  render () {
    const dataSource = _.values(this.props.users)
    return (
      <Table columns={this.columns()}
        expandedRowRender={record => <UsersPacks user={record} />}
        dataSource={dataSource}
        className={'table'}
        pagination={{ pageSize: 12, total: dataSource.length }}
        rowKey={record => record.id} />
    )
  }
}

const styles = {
  editableRowOperations: {
    marginRight: 8
  }
}

Users.propTypes = {
  dispatch: PropTypes.func.isRequired,
  users: PropTypes.object.isRequired,
  waitList: PropTypes.object.isRequired
}

const mapStateToProps = (state) => (
  {
    users: state.users,
    waitList: state.waitList
  })

export default connect(
  mapStateToProps
)(Users)
