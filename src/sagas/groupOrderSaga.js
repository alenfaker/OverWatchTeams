import { put, fork, take, call } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { Toast } from 'antd-mobile'
import { replace } from 'react-router-redux'
import {
  GET_HOME_GROUP_ORDER_LIST_REQUEST,
  GET_ACCOUNT_GROUP_ORDER_LIST_REQUEST,
  POST_GROUP_ORDER_REQUEST,
  PUT_GROUP_ORDER_REQUEST,
  DELETE_GROUP_ORDER_REQUEST
} from '../constants/actionTypes'
import * as action from '../actions'
import { groupOrderService, userService } from '../services/leanclound'

function* postGroupOrderWorker(payload) {
  try {
    yield put(action.fetchRequest({ text: '提交中' }))
    const userinfo = yield call(userService.getUserInfoToJson)
    const response = yield call(groupOrderService.cerateGroupOrder, payload, userinfo)
    yield put(action.fetchSuccess())
    yield put(action.postGroupOrderSuccess(response))
    Toast.success('提交成功', 1)
    yield delay(1000)
    yield put(replace('/account/grouporders'))
  } catch (error) {
    yield put(action.postGroupOrderFailed(error))
    yield put(action.fetchFailed())
    Toast.success('提交失败', 1)
  }
}

function* putGroupOrderWorker(payload) {
  try {
    yield put(action.fetchRequest({ text: '提交中' }))
    const response = yield call(groupOrderService.updateGroupOrder, payload)
    yield put(action.fetchSuccess())
    yield put(action.putGroupOrderSuccess(response))
    Toast.success('提交成功', 1)
    yield delay(1000)
    yield put(replace('/account/grouporders'))
  } catch (error) {
    yield put(action.putGroupOrderFailed(error))
    yield put(action.fetchFailed())
    Toast.success('提交失败', 1)
  }
}

function* deleteGroupOrderWorker(payload) {
  try {
    yield put(action.fetchRequest({ text: '提交中' }))
    const response = yield call(groupOrderService.removeGroupOrder, payload)
    yield put(action.deleteGroupOrderSuccess(response))
    yield put(action.fetchSuccess())
    Toast.success('删除成功', 1)
  } catch (error) {
    yield put(action.deleteGroupOrderFailed(error))
    yield put(action.fetchFailed())
    Toast.success('删除失败', 1)
  }
}

function* getAccountGroupOrderListWorker(payload) {
  try {
    const response = yield call(
      groupOrderService.getAccountGroupOrderList,
      payload
    )
    yield put(action.getAccountGroupOrderListSuccess(response))
  } catch (error) {
    yield put(action.getAccountGroupOrderListFailed(error))
  }
}

function* getHomeGroupOrderListWorker(payload) {
  try {
    const response = yield call(groupOrderService.getHomeGroupOrderList, payload)
    yield put(action.getHomeGroupOrderListSuccess(response))
  } catch (error) {
    yield put(action.getHomeGroupOrderListFailed(error))
  }
}

function* watchPostGroupOrder() {
  while (true) {
    const { payload } = yield take(POST_GROUP_ORDER_REQUEST)
    yield fork(postGroupOrderWorker, payload)
  }
}

function* watchGetAccountGroupOrderList() {
  while (true) {
    const { payload } = yield take(GET_ACCOUNT_GROUP_ORDER_LIST_REQUEST)
    yield fork(getAccountGroupOrderListWorker, payload)
  }
}

function* watchGetHomeGroupOrderList() {
  while (true) {
    const { payload } = yield take(GET_HOME_GROUP_ORDER_LIST_REQUEST)
    yield fork(getHomeGroupOrderListWorker, payload)
  }
}

function* watchPutGroupOrder() {
  while (true) {
    const { payload } = yield take(PUT_GROUP_ORDER_REQUEST)
    yield fork(putGroupOrderWorker, payload)
  }
}

function* watchDeleteGroupOrder() {
  while (true) {
    const { payload } = yield take(DELETE_GROUP_ORDER_REQUEST)
    yield fork(deleteGroupOrderWorker, payload)
  }
}

export {
  watchGetHomeGroupOrderList,
  watchPostGroupOrder,
  watchGetAccountGroupOrderList,
  watchPutGroupOrder,
  watchDeleteGroupOrder
}
