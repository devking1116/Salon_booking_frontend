import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Table, Popconfirm } from 'antd'
import BookingView from './BookingView'
import Loading from './Loading'
import EditableCell from '../common/EditableCell'
import { fetchUser } from '../actions/UserActions'
import * as _ from 'lodash'

class Bookings extends Component {

  constructor (props) {
    super(props)

    this.state = {
      data: []
    }

  }

  renderCreatedAt (text, row, index) {
    let created_at = new Date(text).toLocaleString('en-US')
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
          value={created_at}
          onChange={value => this.handleChange(key, index, value)}
        />
      )
    } else {
      return created_at
    }
  }

  renderBookedAt (text, row, index) {
    //console.log('renderBookedAt', text, row, index)
    let booked_at = new Date(row.booking.booking).toLocaleString('en-US')
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
          value={booked_at}
          onChange={value => this.handleChange(key, index, value)}
        />
      )
    } else {
      return booked_at
    }
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

  columns () {
    return [
      {
        title: 'Users Name',
        dataIndex: 'userName',
        key: 'userName',
        render: this.renderUserName.bind(this),
        sorter: (a, b) => a - b
      },
      {
        title: 'Time of User Request',
        dataIndex: 'dateCreate',
        key: 'dateCreate',
        render: this.renderCreatedAt.bind(this),
        sorter: (a, b) => a - b
      },
      {
        title: 'Scheduled Appointment Time',
        dataIndex: 'bookedAt',
        key: 'bookedAt',
        render: this.renderBookedAt.bind(this),
        sorter: (a, b) => a - b
      },
      { 
        title: 'operation', 
        dataIndex: 'operation', 
        render: this.renderOperation.bind(this) 
      }
    ]
  }

  handleChange(key, index, value) {
    const { data } = this.state;
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

  render () {
    const dataSource = _.values(this.props.bookings)
    return (
      <Table columns={this.columns()}
        expandedRowRender={record => <BookingView bId={record.id} />}
        dataSource={dataSource}
        className={'table'}
        pagination={{ pageSize: 12, total: dataSource.length }}
        rowKey={record => record.id}
      />
    )
  }
}

const styles = {
  editableRowOperations: {
    marginRight: 8
  }
}

Bookings.propTypes = {
  dispatch: PropTypes.func.isRequired,
  bookings: PropTypes.object.isRequired,
  users: PropTypes.object.isRequired
}

const mapStateToProps = (state) => (
  {
    dispatch: state.dispatch,
    bookings: state.bookings,
    users: state.users,
    requests: state.requests
  })

export default connect(
  mapStateToProps
)(Bookings)
