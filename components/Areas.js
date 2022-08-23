import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { GoogleMap, Marker, InfoWindow, withGoogleMap, Rectangle } from 'react-google-maps'
import { Table, Button, Form, Input } from 'antd'
import generate from 'firebase-auto-ids'
import * as _ from 'lodash'
import { addArea, deleteArea } from '../controllers/Areas'

const mapCenter = {
  lat: 34.0522342,
  lng: -118.2436849
}

const CustomGoogleMap = withGoogleMap(props => (
  <GoogleMap
    ref={props.onMapLoad}
    defaultZoom={12}
    defaultCenter={props.mapCenter}
    onBoundsChanged={props.onBoundsChanged}
  >
    {_.values(props.markers).map((salon, index) => {
      // console.log('render marker', salon.id, 'showInfo', salon.showInfo, 'distance', salon.distance, 'range', this.props.req.range)
      return (
        <Marker
          position={{lat: parseFloat(salon.lat), lng: parseFloat(salon.lng)}}
          key={salon.id}
          // onClick={(marker) => props.handleMarkerClick(salon)}
          icon={'https://maps.gstatic.com/mapfiles/ms2/micons/green.png'}
        />
      )
    })}
    {props.areas}
  </GoogleMap>
))

class Areas extends Component {

  constructor (props) {
    super(props)
    this.state = {
      center: mapCenter,
      areas: [],
      selectedArea: null
    }
    console.log('constructor: this.state', this.state)
    this.isDrag = false
    this.areaRefs = {}
  }

  componentWillMount () {
    this.updateAreas(this.props)
  }

  componentWillReceiveProps (nextProps) {
    this.updateAreas(nextProps)
  }

  handleBoundsChanged () {
    this.setState({
      bounds: this.map.getBounds(),
      center: this.map.getCenter()
    })
  }

  onMapLoad (map) {
    this.map = map
  }

  onAreaClick (id) {
    console.log('onAreaClick', id)
    this.setState({
      selectedArea: id
    },
    () => this.updateAreas(this.props))
  }

  updateAreas (props) {
    const areas = this.makeAreas(props)
    this.setState({areas})
  }

  updateArea (id) {
    const ref = this.areaRefs[id]
    if (ref) {
      console.log('updateArea', ref)
      console.log('bounds', ref.getBounds())
      const bounds = ref.getBounds()
      const data = _.clone(bounds.toJSON())
      data.id = id
      this.props.dispatch(addArea(data))
    }
  }

  handleBoundsChanged (id) {
    if (!this.isDrag) this.updateArea(id)
  }

  onDragStart (id) {
    console.log('onDragStart')
    this.isDrag = true
    this.onAreaClick(id)
  }

  onDragEnd () {
    console.log('onDragEnd')
    this.isDrag = false
    this.updateArea(this.state.selectedArea)
  }

  onRectangleRef (r) {
    console.log('ref', r)
    if (r) {
      this.areaRefs[r.props.id] = r
    }
  }

  makeAreas (props) {
    console.log('makeAreas, selectedArea', this.state.selectedArea)
    return (
      _.map(_.values(props.areas), (area, id) => {
        const bounds = _.clone(area)
        _.unset(bounds, 'id')
        _.unset(bounds, 'timestamp')
        return (
          <Rectangle
            key={area.id}
            id={area.id}
            ref={this.onRectangleRef.bind(this)}
            bounds={bounds}
            onClick={() => this.onAreaClick(area.id)}
            onRightClick={() => console.log('on rectangle right click')}
            onDragStart={() => this.onDragStart(area.id)}
            onDragEnd={this.onDragEnd.bind(this)}
            onBoundsChanged={() => this.handleBoundsChanged(area.id)}
            onMouseUp={() => console.log('onMouseUp')}
            editable
            draggable
            options={{fillColor: (this.state && this.state.selectedArea === area.id) ? 'green' : 'gray'}}
          />
        )
      })
    )
  }

  addRectangle () {
    const bounds = this.map.getBounds()
    console.log('bounds', bounds)
    const jbounds = bounds.toJSON()
    const dlng = jbounds.east - jbounds.west
    const dlat = jbounds.north - jbounds.south
    console.log('bounds', bounds.toJSON())
    const area = {
      id: generate(_.now()),
      east: dlng * 0.6 + jbounds.west,
      west: dlng * 0.4 + jbounds.west,
      north: dlat * 0.6 + jbounds.south,
      south: dlat * 0.4 + jbounds.south
    }
    console.log('new Area', area)
    this.props.dispatch(addArea(area))
  }

  removeRectangle () {
    if (this.state.selectedArea) {
      this.props.dispatch(deleteArea(this.state.selectedArea))
    }
  }

  renderMap () {
    // console.log('this.state.rectangles', this.state.rectangles)


    if (this.props.googleMapsApiLoaded) {
      return (
        <CustomGoogleMap
          containerElement={<div style={styles.container} />}
          mapElement={<div style={styles.mapElement} />}
          mapCenter={this.state.center}
          markers={this.props.salons}
          onBoundsChanged={this.handleBoundsChanged.bind(this)}
          onMapLoad={this.onMapLoad.bind(this)}
          bounds={this.state.bounds}
          areas={this.state.areas}
        />
      )
    }
  }

  render () {
    return (
      <div style={styles.container}>
        <div style={styles.controls}>
          <Button
            icon={'plus'}
            type={'primary'}
            onClick={this.addRectangle.bind(this)}
          >
            Add new area
          </Button>
          <Button
            icon={'minus'}
            type={'primary'}
            onClick={this.removeRectangle.bind(this)}
          >
            Delete selected area
          </Button>
        </div>
        {this.renderMap()}
      </div>
    )
  }
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%'
  },
  mapElement: {
    marginTop: 10,
    width: '90%',
    height: 760
  },
  controls: {
    width: '90%',
    display: 'flex',
    justifyContent: 'space-between'
  }
}

Areas.propTypes = {
  salons: PropTypes.object.isRequired,
  googleMapsApiLoaded: PropTypes.bool.isRequired,
  areas: PropTypes.object.isRequired
}

const mapStateToProps = (state) => (
  {
    salons: state.salons,
    googleMapsApiLoaded: state.loaders.googleMapsApiLoaded,
    areas: state.areas
  })

export default connect(
  mapStateToProps
)(Areas)
