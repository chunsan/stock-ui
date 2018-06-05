import React from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Grid } from 'wsgcomponents';

class PurchaseList extends React.Component {
	constructor(props) {
		super(props);
		this.columns = [{
			title: '股票代码',
			dataIndex: 'code',
		}, {
      title: '股票名称',
      dataIndex: 'name',
    }, {
      title: '交易所名称',
      dataIndex: 'type',
    }, {
			title: '买入数量',
			dataIndex: 'amount',
		}, {
			title: '买入价格',
			dataIndex: 'price',
		}, {
      title: '当前价格',
      dataIndex: 'currentPrice',
    }, {
			title: '买入方式',
			dataIndex: 'method',
		}, {
      title: '买入日期',
      dataIndex: 'ctime',
      render: (v = '') => {
        return moment(v).format("YYYY-MM-DD");
      },
    },];
		this.filterItems = [{
			text: '用户名',
			name: 'name',
			type: 'input',
		}, {
        text: '签到时间',
        name: 'time',
        type: 'daterange',
      },];
	}
	getAddFields = () => {
		return [{
			text: '用户名',
			name: 'loginName',
			type: 'input',
			validate: [{
				rules: [
                    { required: true, message: '请输入用户名' },
				],
				trigger: ['onBlur', 'onChange'],
			}],
		}, {
			text: '昵称',
			name: 'name',
			type: 'input',
			validate: [{
				rules: [
                    { required: true, message: '请输入昵称' },
				],
				trigger: ['onBlur', 'onChange'],
			}],
		}, {
			text: '电话号码',
			name: 'phone',
			type: 'input',
			validate: [{
				rules: [
					{
						required: true,
						message: '请输入电话号码',
						validator: (rule, value, callback) => {
							const tel = /^1(3|4|5|7|8)\d{9}$/;
							if (tel.test(value)) {
								callback();
							} else {
								callback('电话号码错误');
							}
						},
					},
				],
				trigger: ['onBlur'],
			}],
		}, {
			text: 'Email',
			name: 'email',
			type: 'input',
			validate: [{
				rules: [
					{
						required: true,
						message: '邮箱格式错误',
						validator: (rule, value, callback) => {
							const re = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
							if (re.test(value)) {
								callback();
							} else {
								callback('邮箱格式错误');
							}
						},
					},
				],
				trigger: ['onBlur'],
			}],
		}];
	};
	getEditFields = () => {
		return [{
			text: '昵称',
			name: 'name',
			type: 'input',
			validate: [{
				rules: [
                    { required: true, message: '请输入昵称' },
				],
				trigger: ['onBlur', 'onChange'],
			}],
		}, {
			text: '电话号码',
			name: 'phone',
			type: 'input',
			validate: [{
				rules: [
					{
						required: true,
						message: '请输入正确的电话号码',
						validator: (rule, value, callback) => {
							const tel = /^1(3|4|5|7|8)\d{9}$/;
							if (tel.test(value)) {
								callback();
							} else {
								callback('电话号码不正确');
							}
						},
					},
				],
				trigger: ['onBlur'],
			}],
		}, {
			text: 'Email',
			name: 'email',
			type: 'input',
			validate: [{
				rules: [
					{
						required: true,
						message: '邮箱格式错误',
						validator: (rule, value, callback) => {
							const re = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
							if (re.test(value)) {
								callback();
							} else {
								callback('邮箱格式错误');
							}
						},
					},
				],
				trigger: ['onBlur'],
			}],
		}];
	};
	add = (values, callback) => {
		const { dispatch } = this.props;
		dispatch({ type: 'purchase/add', payload: { values }, callback });
	};
	edit = (values, callback) => {
		const { dispatch } = this.props;
		dispatch({ type: 'purchase/edit', payload: { values }, callback });
	};
	del = (record) => {
		const { dispatch } = this.props;
		dispatch({ type: 'purchase/del', payload: { id: record.id, sn: record.sn, type: record.type } });
	};
	refersh = (filter, pageNo, pageSize) => {
		const { dispatch } = this.props;
		dispatch({ type: 'purchase/fetch', payload: { filter, pageNo, pageSize } });
	};
	render = () => {
		const { loading, addLoading, delLoading, editLoading, data } = this.props;
		return (
			<div>
				<Grid
          columns={this.columns}
          loading={loading}
          editModal
          insert={this.add}
          del={this.del}
          edit={this.edit}
          addLoading={addLoading}
          delLoading={delLoading}
          editLoading={editLoading}
          filterItems={this.filterItems}
          insertFields={this.getAddFields()}
          editFields={this.getEditFields()}
          data={data}
          refersh={this.refersh}
				/>
			</div>
		);
	}
}

function mapStateToProps(state) {
	const { loading } = state;
	return {
		data: state.purchase,
		loading: loading.effects['purchase/fetch'],
		addLoading: loading.effects['purchase/add'],
		editLoading: loading.effects['purchase/edit'],
		delLoading: loading.effects['purchase/del'],
	};
}

export default connect(mapStateToProps)(PurchaseList);
