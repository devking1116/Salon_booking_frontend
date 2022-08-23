import React, { Component, PropTypes } from 'react'
import { Row, Col, Button } from 'antd'
import { GoogleMap, Marker, InfoWindow, withGoogleMap } from 'react-google-maps'
import { connect } from 'react-redux'
import * as _ from 'lodash'

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
          onClick={(marker) => props.handleMarkerClick(salon)}
          icon={salon.distance < props.req.range ? 'https://maps.gstatic.com/mapfiles/ms2/micons/green.png' : 'https://maps.gstatic.com/mapfiles/ms2/micons/orange.png'}
        >
          {(salon.showInfo) ? props.renderInfoWindow(salon) : null}
        </Marker>
      )
    })}
    {props.renderedUser}
  </GoogleMap>
))

class ChooseSalonMap extends Component {

  constructor (props) {
    super(props)
    const req = this.props.req
    const mapCenter = {
      lat: req.lat,
      lng: req.lng
    }

    this.state = {
      bounds: null,
      center: mapCenter,
      l: this.props.salons.length,
      markers: _.values(this.props.salons)
    }

    this.handleMarkerClick = this.handleMarkerClick.bind(this)

    if (this.props.googleMapsApiLoaded) {
      this.makeMarkers
    }
  }

  componentWillReceiveProps (nextProps) {
    if (!this.props.googleMapsApiLoaded && nextProps.googleMapsApiLoaded) {
      this.makeMarkers()
    }
  }

  handleBoundsChanged () {
    this.setState({
      bounds: this.map.getBounds(),
      center: this.map.getCenter()
    })
  }

  handleMarkerClick (marker) {
    this.setState({
      markers: _.map(this.state.markers, (m) => {
        const newM = _.assign({}, m)
        if (newM.id === marker.id) {
          console.log('set showInfo to true to marker', newM.id)
          newM.showInfo = true
        }
        return newM
      })
    })
    // marker.showInfo = true
  }

  makeMarkers () {
    const { req } = this.props
    const userLatLng = new window.google.maps.LatLng(req.lat, req.lng)
    const markers = _.clone(this.state.markers)
    for (let i in markers) {
      const marker = markers[i]
      const salonLatLng = new window.google.maps.LatLng(marker.lat, marker.lng)
      // distance in miles
      const d = window.google.maps.geometry.spherical.computeDistanceBetween(userLatLng, salonLatLng) / 1000 * 0.621371
      marker.distance = d.toFixed(1)
    }
    this.setState({
      markers
    })
  }

  handleMarkerClose (marker) {
    this.setState({
      markers: _.map(this.state.markers, (m) => {
        const newM = _.assign({}, m)
        if (newM.id === marker.id) {
          console.log('set showInfo to true to marker', newM.id)
          newM.showInfo = false
        }
        return newM
      })
    })
    // marker.showInfo = false
  }

  handleSelectSalon (marker) {
    this.props.onSelectSalon(marker)
  }

  renderInfoWindow (marker) {
    // console.log('render Info window', marker.id)
    return (
      <InfoWindow
        key={marker.id}
        onCloseclick={this.handleMarkerClose.bind(this, marker)}
        style={{zIndex: 2}}
        position={{lat: parseFloat(marker.lat), lng: parseFloat(marker.lng)}}
        options={{pixelOffset: new window.google.maps.Size(0, -5)}}
      >
        <section style={{zIndex: 0}}>
          <Row type={'flex'} >
            <Col >{marker.name}</Col>
          </Row>
          <Row type={'flex'} >
            <Col >{marker.phone}</Col>
          </Row>
          <Row type={'flex'} >
            <Col >{marker.contactPerson}</Col>
          </Row>
          <Row type={'flex'} >
            <Col >distance: {marker.distance} mi </Col>
          </Row>
          <Button
            type={'primary'}
            size={'small'}
            onClick={this.handleSelectSalon.bind(this, marker)}
          >
            select
          </Button>

        </section>
      </InfoWindow>
    )
  }

  onMapLoad (map) {
    this.map = map
  }

  renderUser () {
    const req = this.props.req
    const position = {
      lat: parseFloat(req.lat),
      lng: parseFloat(req.lng)
    }
    return (
      <Marker
        position={position}
        key={'user_marker'}
        icon={'https://maps.gstatic.com/mapfiles/ms2/micons/man.png'}
      />
    )
  }

  renderMap () {
    if (this.props.googleMapsApiLoaded) {
      return (
        <CustomGoogleMap
          containerElement={<div style={styles.container} />}
          mapElement={<div style={styles.mapElement} />}
          mapCenter={this.state.center}
          markers={this.state.markers}
          onBoundsChanged={this.handleBoundsChanged.bind(this)}
          onMapLoad={this.onMapLoad.bind(this)}
          bounds={this.state.bounds}
          req={this.props.req}
          handleMarkerClick={this.handleMarkerClick.bind(this)}
          renderInfoWindow={this.renderInfoWindow.bind(this)}
          renderedUser={this.renderUser()}
        />
      )
    }
  }

  render () {
    return (
      <div style={styles.conatiner}>
        {this.renderMap()}
      </div>
    )
  }
}

const styles = {
  container: {
    float: 'left',
    width: 500,
    height: 400,
    marginLeft: 10
  },
  mapElement: {
    border: '1px solid white',
    height: '100%'
  }
}

ChooseSalonMap.propTypes = {
  dispatch: PropTypes.func.isRequired,
  salons: PropTypes.object.isRequired,
  req: PropTypes.object.isRequired,
  onSelectSalon: PropTypes.func.isRequired,
  googleMapsApiLoaded: PropTypes.bool.isRequired
}

const mapStateToProps = (state) => (
  {
    dispatch: state.dispatch,
    salons: state.salons,
    googleMapsApiLoaded: state.loaders.googleMapsApiLoaded
  })

export default connect(
  mapStateToProps
)(ChooseSalonMap)
