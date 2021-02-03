import { request } from '../../utils/index';

export async function fetch(filter, pageNo, pageSize) {
	return request({
		url: '/summary/info',
		data: {
			...filter,
			pageNo,
			pageSize,
		},
	});
}
