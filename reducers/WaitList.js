import * as types from '../constants/index'
import * as _ from 'lodash'

const initialState = {}

export default function (state = initialState, action) {
  switch (action.type) {
    case types.RECEIVE_WAIT_LIST:
      return action.waitList

    case types.UPDATE_WAIT_LIST_RECORD:
      return {
        [action.id]: action.data,
        ...state
      }

    case types.REMOVE_WAIT_LIST_RECORD:
      const newState = _.assign({}, state)
      _.unset(newState, action.id)
      return newState

    default:
      return state
  }
}
