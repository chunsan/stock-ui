import fetch from 'dva/fetch';
import config from './config';

const isEmptyObject = (e) => {
	for (const t in e) {
		if (t) {
			return false;
		}
	}
	return true;
};

/**
 * 数组内查询
 * @param   {array}      array
 * @param   {String}    id
 * @param   {String}    keyAlias
 * @return  {Array}
 */
const queryArray = (array, key, keyAlias = 'key') => {
	if (!(array instanceof Array)) {
		return null;
	}
	const item = array.filter(_ => _[keyAlias] === key);
	if (item.length) {
		return item[0];
	}
	return null;
};

/**
 * 数组格式转树状结构
 * @param   {array}     array
 * @param   {String}    id
 * @param   {String}    pid
 * @param   {String}    children
 * @return  {Array}
 */
const arrayToTree = (array, id = 'id', pid = 'pid', children = 'children') => {
	const data = [...array];
	const result = [];
	const hash = {};
	data.forEach((item, index) => {
		hash[data[index][id]] = data[index];
	});

	data.forEach((item) => {
		const hashVP = hash[item[pid]];
		if (hashVP) {
			if (!hashVP[children]) {
				hashVP[children] = [];
			}
			hashVP[children].push(item);
		} else {
			result.push(item);
		}
	});
	return result;
};

const fetchhttp = (options) => {
	const {
		method = 'post',
		url,
		data,
	} = options;
	switch (method.toLowerCase()) {
		case 'get':
			return fetch(`/apk${url}`, {
				method: 'GET',
				headers: { 'Api-Req': true },
			});
		case 'post': {
			const formData = new FormData();
			for (const name in data) {
				if ({}.hasOwnProperty.call(data, name)) {
					let param = data[name];
					if (param || param === 0 || param === false) {
						if (typeof param === 'object') {
							if (!isEmptyObject(param)) {
								param = JSON.stringify(data[name]);
								formData.append(name, param);
							}
						} else {
							formData.append(name, param);
						}
					}
				}
			}
			return fetch(`/apk${url}`, {
				method: 'POST',
				credentials: 'include',
				body: formData,
				headers: { 'Api-Req': true },
			});
		}
		default:
			return fetch(options);
	}
};

const request = (options) => {
	return fetchhttp(options).then((res) => {
		if (res.ok) {
			return res.json();
		}
		throw Error(res.status);
	});
};

const getParams = (query) => {
	if (!query) {
		return { };
	}
	const result = {};
	(/^[?#]/.test(query) ? query.slice(1) : query)
        .split('&')
        .forEach((param) => {
	const [key, value] = param.split('=');
	result[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
});
	return result;
};

const getParameterByName = (name) => {
	return getParams(window.location.search)[name];
};
const dateTimeFormat = (time, format = 'yyyy-MM-dd HH:mm:ss') => {
	if (!time) {
		return;
	}
	const data = new Date(time);
	const o = {
		'M+': data.getMonth() + 1,
		'd+': data.getDate(),
		'h+': data.getHours(),
		'H+': data.getHours(),
		'm+': data.getMinutes(),
		's+': data.getSeconds(),
		'q+': Math.floor((data.getMonth() + 3) / 3),
		S: data.getMilliseconds(),
	};
	let result;
	if (/(y+)/.test(format)) {
		result = format.replace(RegExp.$1, `${data.getFullYear()}`.substr(4 - RegExp.$1.length));
	}
	for (const k in o) {
		if (new RegExp(`(${k})`).test(format)) {
			result = result.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : (`00${o[k]}`).substr(`${o[k]}`.length));
		}
	}
	return result;
};
module.exports = {
	config,
	queryArray,
	arrayToTree,
	request,
	getParameterByName,
	dateTimeFormat,
};
