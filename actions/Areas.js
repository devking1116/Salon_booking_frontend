import * as types from '../constants/index'

export function receiveAreas (areas) {
  return {
    type: types.RECEIVE_AREAS,
    areas
  }
}

export function updateArea (id, data) {
  return {
    type: types.UPDATE_AREA,
    id,
    data
  }
}

export function removeArea (id) {
  return {
    type: types.REMOVE_AREA,
    id
  }
}
