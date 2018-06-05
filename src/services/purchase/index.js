import moment from 'moment';
import { request } from '../../utils/index';

export async function fetch(filter, pageNo, pageSize) {
  const { start, end } = filter.time || {};
  let defaultStart = null;
  let defaultEnd = null;
  if (start) {
    defaultStart = moment(start)
      .hour(0)
      .minute(0)
      .second(0)
      .millisecond(0)
      .format('YYYY-MM-DD HH:mm:ss');
  }
  if (end) {
    defaultEnd = moment(end)
      .hour(0)
      .minute(0)
      .second(0)
      .millisecond(0)
      .format('YYYY-MM-DD HH:mm:ss');
  }
	return request({
		url: '/purchase/list',
		data: {
			...filter,
			pageNo,
			pageSize,
      start: defaultStart,
      end: defaultEnd,
		},
	});
}

export async function add(params) {
	return request({
		url: '/purchase/add',
		data: params,
	});
}

export async function edit(params) {
	return request({
		url: '/purchase/edit',
		data: params,
	});
}

export async function del(id) {
	return request({
		url: '/purchase/del',
		data: { id },
	});
}
