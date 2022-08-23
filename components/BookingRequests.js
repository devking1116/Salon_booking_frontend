import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Table, Input, Popconfirm } from 'antd'
import * as _ from 'lodash'
import RequestView from './RequestView'
import localeTable from '../common/LocaleEn'
import Loading from './Loading'
import { fetchUser } from '../actions/UserActions'
import EditableCell from '../common/EditableCell'

class BookingRequests extends Component {

  constructor (props) {
    super(props)

    this.state = {
      data: []
    }
  }

  renderTimeLeft (text, row, index) {
    const timeLeft = new Date()
    let dt = new Date(text) - _.now()
    const isExpired = dt < 0
    dt = Math.abs(dt)
    timeLeft.setTime(dt)
    const days = parseInt(dt / 1000 / 60 / 60 / 24, 10)
    let strDate
    if (days > 0) {
      strDate = days + ' days, ' + timeLeft.toISOString().substr(11, 8)
    } else {
      strDate = timeLeft.toISOString().substr(11, 8)
    }
    const style = isExpired ? {color: 'red'} : {color: 'black'}
    return (
      <div style={style} >{strDate}</div>
    )
  }

  renderUserName (text, row, index) {
    // console.log('renderUserName users', this.props.users)
    // console.log('renderUserName row', row)
    const uid = row.userId
    // console.log('renderUserName uid', uid)
    const { data } = this.state
    let editable = false
    data.forEach((item) => {
      if(item.key == index)
        editable = item.editable  
    })
    if (_.has(this.props.users, uid)) {
      const user = this.props.users[uid]
      if(editable) {
        return (
          <EditableCell
            editable={editable}
            value={user.name}
            onChange={value => this.handleChange(key, index, value)}
          />
        )
      } else {
        return (user.name)
      }
    } else {
      const { dispatch } = this.props
      dispatch(fetchUser(uid))
      return (
        <Loading/>
      )
    }
  }

  renderBlowoutsCount (text, row, index) {
    const uid = row.userId
    let cnt = 0
    if (_.has(this.props.users, uid)) {
      const user = this.props.users[uid]
      if (_.has(user, 'curPacks')) {
        for (let p in user.curPacks) {
          cnt += parseInt(user.curPacks[p].curCount, 10)
        }
      }
    }

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
          value={cnt}
          onChange={value => this.handleChange(key, index, value)}
        />
      )
    } else {
      return cnt
    }
  }

  renderCreatedAt (text, row, index) {
    return new Date(text).toLocaleString('en-US')
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

  handleChange(key, index, value) {
    const { data } = this.state
  }

  edit(index) {
    console.log(index)
    const { data } = this.state
    data.push({key: index, editable : "true"})
    this.setState({ data })
  }

  editDone(index, type) {
    const { data } = this.state
  }

  columns () {
    return [
      { title: 'Client', dataIndex: 'userName', key: 'userName', render: this.renderUserName.bind(this) },
      { title: 'Created at', dataIndex: 'dateCreate', key: 'dateCreate', render: this.renderCreatedAt },
      { title: 'Time left', dataIndex: 'dateStart', key: 'dateStart', render: this.renderTimeLeft },
      { title: 'Available blowouts', dataIndex: 'available', key: 'available', render: this.renderBlowoutsCount.bind(this) },
      { title: 'operation', dataIndex: 'operation', render: this.renderOperation.bind(this) }
    ]
  }

  render () {
    const dataSource = _.values(this.props.requests)
    return (
      <Table columns={this.columns()}
        expandedRowRender={record => <RequestView req={record}/>}
        dataSource={dataSource}
        className='table'
        locale={localeTable}
        pagination={{ pageSize: 12, total: dataSource.length }}
        rowKey={record => record.id}/>
    )
  }
}

const styles = {
  editableRowOperations: {
    marginRight: 8
  }
}

BookingRequests.propTypes = {
  dispatch: PropTypes.func.isRequired,
  requests: PropTypes.object.isRequired,
  users: PropTypes.object.isRequired
}

const mapStateToProps = (state) => (
  {
    dispatch: state.dispatch,
    requests: state.requests,
    users: state.users
  })

export default connect(
  mapStateToProps
)(BookingRequests)
