import { message } from 'antd';
import { routerRedux } from 'dva/router';
import { getParameterByName } from 'utils';
import { logout, login, updatepwd, query } from '../services/app';

export default {
	namespace: 'app',
	state: {
		user: {},
		visiblePwdChange: false,
	},
	effects: {
		*query({ payload }, { call, put }) {
			const data = yield call(query, payload);
			if (data.success === false) {
				if (location.pathname !== '/login') {
					window.location = `${location.origin}/login?from=${location.pathname}`;
				}
			} else {
				yield put({ type: 'updateState', payload: { user: data } });
				if (location.pathname === '/login') {
					yield put(routerRedux.push('/'));
				}
			}
		},
		*login({ payload }, { call, put }) {
			const data = yield call(login, payload);
			if (data.success === false) {
				message.error(data.message);
			} else {
				yield put({ type: 'updateState', payload: { user: data } });
				const from = getParameterByName('from');
				if (from) {
					yield put(location.replace(from));
				} else {
					yield put(location.replace('/'));
				}
			}
		},
		*logout({ payload }, { call, put }) {
			const data = yield call(logout, payload);
			if (data.success) {
				yield put({ type: 'query' });
			}
		},
		*updatepwd({ payload: { pwd, newpwd } = {} }, { put, call }) {
			const result = yield call(updatepwd, pwd, newpwd);
			if (result.success === false) {
				message.error(result.message);
			} else {
				message.success('修改成功');
				yield put({ type: 'logout' });
				yield put({ type: 'updateState', payload: { visiblePwdChange: false } });
			}
		},
		*updatepwdVisible({ payload }, { put }) {
			yield put({ type: 'updateState', payload });
		},
	},
	reducers: {
		updateState(state, { payload }) {
			return {
				...state,
				...payload,
			};
		},
	},
	subscriptions: {
		setup({ dispatch }) {
			dispatch({ type: 'query' });
		},
	},
};
