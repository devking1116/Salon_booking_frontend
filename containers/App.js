import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Affix, Menu, Icon } from 'antd'
import 'antd/dist/antd.css'
import Loading from '../components/Loading'
import { init } from '../actions/InitActions'
import { MODE_INIT } from '../constants/index'
import logo from '../assets/prete-logo.png'
import { googleMapsApiLoaded } from '../actions/LoadersActions'

import BookingRequests from '../components/BookingRequests'
import Salons from '../components/Salons'
import SalonsForApprove from '../components/SalonsForApprove'
import Payouts from '../components/Payouts'
import AddSalon from '../components/AddSalon'
import Bookings from '../components/Bookings'
import Users from '../components/Users'
import Packs from '../components/Packs'
import StripeCheckout from '../components/StripeCheckout'
import TestEmail from '../components/TestEmail'
import TestSms from '../components/TestSms'
import Canceled from '../components/Canceled'
// import ZipCodes from '../components/ZipCodes'
import Areas from '../components/Areas'
import Script from 'react-load-script'


const SubMenu = Menu.SubMenu
const MenuItemGroup = Menu.ItemGroup

const REQUESTS = 'REQUESTS FOR APPOINTMENTS'
const CANCELED = 'CANCELED APPOINTMENTS'
const BOOKINGS = 'SCHEDULED APPOINTMENTS'
const SALONS = 'SALONS'
const ADD_SALON = 'ADD A SALON'
const SALONS_FOR_APPROVE = 'SALONS FOR APPROVE'
const CLIENTS = 'PRETE USERS'
const PACKS = 'PLANS / PACK OPTIONS'
const TESTS = 'SYSTEM TESTS'
const AREAS = 'SERVICE AREAS'
const PAYOUTS = 'PAYOUTS'


class App extends Component {

  constructor (props) {
    super(props)
    this.state = {
      current: PAYOUTS
    }
  }

  componentDidMount () {
    const { dispatch } = this.props
    dispatch(init())
  }

  renderLoading () {
    return (
      <Loading />
    )
  }

  renderMenuTitle () {
    return (
      <div style={styles.navigationHeader}>
        <Icon type={'bars'} /> NAVIGATION
      </div>
    )
  }

  renderMain () {
    console.log(this.props.mode)
    if (this.props.mode === MODE_INIT) {
      return this.renderLoading()
    } else {

    }
  }

  renderContent () {
    switch (this.state.current) {
      case REQUESTS:
        return <BookingRequests />
      case CANCELED:
        return <Canceled />
      case BOOKINGS:
        return <Bookings />
      case SALONS:
        return <Salons />
      case ADD_SALON:
        return <AddSalon />
      case SALONS_FOR_APPROVE:
        return <SalonsForApprove />  
      case CLIENTS:
        return <Users />
      case PACKS:
        return <Packs />
      case AREAS:
        return <Areas />
      case PAYOUTS:
        return <Payouts />
      // case TESTS:
      //   return <Tests />
      default:
        return (
          <div> Not implemented </div>
        )
    }
  }

  handleClick (e) {
    this.setState({
      current: e.key
    })
  }

  renderHeader () {
    return (
      <div style={styles.logoContainer}>
        <img src={logo} style={{width: 185}} />
        <div style={styles.logoText}>Admin panel</div>
      </div>
    )
  }

  renderCurrentMenuName () {
    return (
      <div style={styles.currentMenuNameContainer}>
        <div style={styles.currentMenuName}>
          {this.state.current}
        </div>
      </div>
    )
  }

  handleScriptCreate () {
    // console.log('handleScriptCreate')
  }

  handleScriptLoad () {
    // console.log('handleScriptLoad')
    window.geocoder = new window.google.maps.Geocoder()
    this.props.dispatch(googleMapsApiLoaded())
  }

  handleScriptError (e) {
    console.warn('handleScriptError', e)
  }

  render () {
    if (this.props.mode === MODE_INIT) {
      return this.renderLoading()
    } else {
      return (
        <div style={styles.appContainer}>
          <div style={styles.header}>
            {this.renderHeader()}
            {this.renderCurrentMenuName()}
          </div>
          <div style={styles.container}>
            <Affix>
              <Menu
                theme={'dark'}
                style={styles.menu}
                onClick={this.handleClick.bind(this)}
                selectedKeys={[this.state.current]}
                mode={'inline'}
                // defaultOpenKeys={['sub1', 'sub2', 'sub3']}
                defaultOpenKeys={['sub3']}
              >
                <MenuItemGroup>
                  <SubMenu key={'sub1'} title={<span><Icon type={'calendar'} /><span>Bookings</span></span>}>
                    <Menu.Item key={REQUESTS} style={styles.menuItem}>Requests</Menu.Item>
                    <Menu.Item key={BOOKINGS} style={styles.menuItem}>Scheduled</Menu.Item>
                    <Menu.Item key={CANCELED} style={styles.menuItem}>Canceled</Menu.Item>
                  </SubMenu>
                  <SubMenu key={'sub2'} title={<span><Icon type={'appstore'} /><span>Salons</span></span>}>
                    <Menu.Item key={SALONS} style={styles.menuItem}>All salons</Menu.Item>
                    <Menu.Item key={ADD_SALON} style={styles.menuItem}>Add new salon</Menu.Item>
                    <Menu.Item key={SALONS_FOR_APPROVE} style={styles.menuItem}>Salons for approve</Menu.Item>
                  </SubMenu>
                  <SubMenu key={'sub3'} title={<span><Icon type={'calculator'} /><span>Payments</span></span>}>
                    <Menu.Item key={PAYOUTS} style={styles.menuItem}>Payouts</Menu.Item>
                  </SubMenu>
                  <SubMenu key={'sub4'} title={<span><Icon type={'setting'} /><span>Settings</span></span>}>
                    <Menu.Item key={PACKS} style={styles.menuItem}>Packs and Plans</Menu.Item>
                    <Menu.Item key={AREAS} style={styles.menuItem}>Areas of service</Menu.Item>
                  </SubMenu>
                  <Menu.Item key={CLIENTS} style={styles.menuItem}>Prete Users</Menu.Item>

                  <Menu.Item key={TESTS} style={styles.menuItem}>System Tests</Menu.Item>
                </MenuItemGroup>
              </Menu>
            </Affix>
            <div style={styles.contentContainer}>
              {this.renderContent()}
            </div>
          </div>
          <Script
            url={'https://maps.googleapis.com/maps/api/js?v=3&libraries=places,geometry'}
            onCreate={this.handleScriptCreate.bind(this)}
            onError={this.handleScriptError.bind(this)}
            onLoad={this.handleScriptLoad.bind(this)}
          />
        </div>
      )
    }
  }
}

const styles = {
  screenStyle: {
    width: 1000,
    margin: 'auto'
  },
  header: {
    height: 70,
    backgroundColor: '#222',
    padding: '20px',
    color: 'white',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  appContainer: {
    height: '100%',
  },
  container: {
    backgroundColor: '#CCCCC',
    display: 'flex'
  },
  menu: {
    width: '18em',
    height: '100%'
  },
  menuItem: {
    fontSize: 14
  },
  navigationHeader: {
    height: 40,
    fontSize: 16,
    color: 'white',
    marginTop: 10
  },
  contentContainer: {
    flex: 1,
    margin: 20
  },
  logoText: {
    color: 'white',
    fontWeight: '200',
    fontSize: 18,
    // cursor: 'pointer',
    letterSpacing: 2,
    margin: '0 0 -5px 20px'
  },
  logoContainer: {
    flex: 0.9,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  currentMenuNameContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  currentMenuName: {
    fontSize: 26
  }
}

App.propTypes = {
  dispatch: PropTypes.func.isRequired,
  mode: PropTypes.string.isRequired
}

const mapStateToProps = (state) => (
  {
    dispatch: state.dispatch,
    mode: state.mode
  })

export default connect(
  mapStateToProps
)(App)
