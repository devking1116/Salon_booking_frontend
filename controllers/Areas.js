import { ref } from '../constants/firebase'
import firebase from 'firebase'
import { receiveAreas, updateArea, removeArea } from '../actions/Areas'
import * as _ from 'lodash'

export function addArea (data) {
  return function * (dispatch, getState) {
    data.timestamp = firebase.database.ServerValue.TIMESTAMP
    ref.child('areas').child(data.id).set(data)
  }
}

export function deleteArea (id) {
  return function * (dispatch, getState) {
    yield ref.child('areas').child(id).set(null)
  }
}

export function * fetchAreas (dispatch) {
  try {
    const areasSN = yield ref.child('areas').once('value')
    const areas = areasSN.val()
    if (areas) {
      dispatch(receiveAreas(areas))
    }

    ref.child('areas')
       .orderByChild('timestamp')
       .startAt(_.now())
       .on('child_added', function (snapshot, prevChildKey) {
         dispatch(updateArea(snapshot.key, snapshot.val()))
       })

    ref.child('areas').on('child_changed', function (snapshot, prevChildKey) {
      dispatch(updateArea(snapshot.key, snapshot.val()))
    })

    ref.child('areas').on('child_removed', function (snapshot) {
      dispatch(removeArea(snapshot.key))
    })

  } catch (e) {
    console.error(e.stack)
  }
}
