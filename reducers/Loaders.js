import * as types from '../constants/index'

const initialState = {
  googleMapsApiLoaded: false
}

export default function (state = initialState, action) {
  switch (action.type) {
    case types.GOOGLE_MAPS_API_LOADED:
      return {
        googleMapsApiLoaded: true
      }

    default:
      return state
  }
}
