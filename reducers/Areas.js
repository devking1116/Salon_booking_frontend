import * as types from '../constants/index'
import * as _ from 'lodash'

const initialState = {}

export default function (state = initialState, action) {
  switch (action.type) {
    case types.RECEIVE_AREAS:
      return action.areas

    case types.UPDATE_AREA:
      return {
        ...state,
        [action.id]: action.data
      }

    case types.REMOVE_AREA:
      const newState = _.assign({}, state)
      _.unset(newState, action.id)
      return newState

    default:
      return state
  }
}
