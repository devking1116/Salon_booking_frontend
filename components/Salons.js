import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Table } from 'antd'
import * as _ from 'lodash'
import AddSalon from './AddSalon'
import { compareString } from '../common/utils'

class Salons extends Component {

  constructor (props) {
    super(props)
    console.log("salonsdata", props.salons);
    const filters = this.makeFilters(props.salons)
    this.state = {
      areaFilters: filters.areaFilters,
      zipFilters: filters.zipFilters,
      serviceFilters: filters.serviceFilters
    }
  }

  makeFilters (salons) {
    console.log('makeFilters', salons)
    const areaFilters = []
    const zipFilters = []
    const serviceFilters = [] //TODO add serviceFilters and make this functional
    const aFilters = []
    const zFilters = []
    for (const salonId in salons) {
      const salon = salons[salonId]
      if (_.indexOf(aFilters, salon.area) < 0) {
        aFilters.push(salon.area)
        areaFilters.push({text: salon.area, value: salon.area})
      }
      if (_.indexOf(zFilters, salon.zip) < 0) {
        zFilters.push(salon.zip)
        zipFilters.push({text: salon.zip, value: salon.zip})
      }
    }
    return {
      areaFilters: _.sortBy(areaFilters, ({text, value}) => value),
      zipFilters: _.sortBy(zipFilters, ({text, value}) => value),
      serviceFilters: _.sortBy(serviceFilters, ({text, value}) => value)
    }
  }

  componentWillReceiveProps (nextProps) {
    const filters = this.makeFilters(nextProps.salons)
    this.setState({...filters})

  }

  stringSort (a, b) {
    const aname = a.name.toUpperCase()
    const bname = b.name.toUpperCase()
    console.log(aname, bname)
    return (aname < bname) ? -1 : (aname > bname) ? 1 : 0
  }

  columns (areaFilters, zipFilters, serviceFilters) {
    return [
      { title: 'Name', dataIndex: 'name', key: 'name', sorter: (a, b) => compareString(a.name, b.name) },
      { title: 'Address', dataIndex: 'address', key: 'address' },
      { title: 'Phone', dataIndex: 'phone', key: 'phone' },
      { title: 'Site url', dataIndex: 'webSite', key: 'webSite', render (url) { return <a href={url} target={'blank'}>{url}</a> } },
      { title: 'Email', dataIndex: 'email', key: 'email' },
      {
        title: 'Area',
        dataIndex: 'area',
        key: 'area',
        filters: areaFilters,
        filterMultiple: true,
        onFilter: (value, record) => record.area === value
      },
      {
        title: 'Zip code',
        dataIndex: 'zip',
        key: 'zip',
        filters: zipFilters,
        filterMultiple: true,
        onFilter: (value, record) => record.zip === value
      },
      { // this is a placeholder so this column is added to the UI of the table.  TODO make this functional
        title: 'Service Types',
        dataIndex: 'services',
        key: 'services',
        filters: serviceFilters,
        filterMultiple: true,
        onFilter: (value, record) => record.serviceType === value
      }
    ]
  }

  render () {
    const dataSource = _.values(this.props.salons)
    return (
      <Table columns={this.columns(this.state.areaFilters, this.state.zipFilters)}
        expandedRowRender={record => <AddSalon salon={record} />}
        dataSource={dataSource}
        className={'table'}
        pagination={{ pageSize: 12, total: dataSource.length }}
        rowKey={record => record.id}
      />
    )
  }
}

Salons.propTypes = {
  dispatch: PropTypes.func.isRequired,
  salons: PropTypes.object.isRequired
}

const mapStateToProps = (state) => (
  {
    salons: state.salons
  })

export default connect(
  mapStateToProps
)(Salons)
