import { request } from 'utils';

export async function login(params) {
	return request({
		url: '/login',
		method: 'post',
		data: params,
	});
}

export async function logout(params) {
	return request({
		url: '/logout',
		method: 'post',
		data: params,
	});
}

export async function updatepwd(pwd, newpwd) {
	return request({
		url: '/updatePwd',
		method: 'post',
		data: { pwd, newpwd },
	});
}

export async function query(params) {
	return request({
		url: '/user/js',
		method: 'post',
		data: params,
	});
}
