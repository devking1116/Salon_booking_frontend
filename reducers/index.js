import { combineReducers } from 'redux'
import mode from './Mode'
import requests from './BookingRequestReducer'
import users from './UsersReducer'
import salons from './SalonsReducer'
import unapprsalons from './UnapprSalonsReducer'
import bookings from './BookingsReducer'
import packs from './PacksReducer'
import waitList from './WaitList'
import loaders from './Loaders'
import areas from './Areas'

const rootReducer = combineReducers({
  mode,
  requests,
  users,
  salons,
  unapprsalons,
  bookings,
  packs,
  waitList,
  loaders,
  areas
})

export default rootReducer
