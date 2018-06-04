import React from 'react';
import { connect } from 'dva';
import { Grid } from 'wsgcomponents';
import ImportModal from './components/importModal';

class UserList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			importModalVisible: false,
		};
		this.columns = [{
			title: '用户名',
			dataIndex: 'loginName',
		}, {
			title: '昵称',
			dataIndex: 'name',
		}, {
			title: '电话号码',
			dataIndex: 'phone',
		}, {
			title: 'Email',
			dataIndex: 'email',
		}];
		this.filterItems = [{
			text: '用户名',
			name: 'name',
			type: 'input',
		}, {
			text: '电话号码',
			name: 'phone',
			type: 'input',
		}];
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
		dispatch({ type: 'user/add', payload: { values }, callback });
	};
	edit = (values, callback) => {
		const { dispatch } = this.props;
		dispatch({ type: 'user/edit', payload: { values }, callback });
	};
	del = (record) => {
		const { dispatch } = this.props;
		dispatch({ type: 'user/del', payload: { id: record.id, sn: record.sn, type: record.type } });
	};
	refersh = (filter, pageNo, pageSize) => {
		const { dispatch } = this.props;
		dispatch({ type: 'user/fetch', payload: { filter, pageNo, pageSize } });
	};
	showImport = () => {
		this.setState({ importModalVisible: true });
	};
	importSuccess = () => {
		this.hideImport();
		const { dispatch } = this.props;
		dispatch({ type: 'user/refersh' });
	};
	hideImport = () => {
		this.setState({ importModalVisible: false });
	};
	render = () => {
		const { loading, addLoading, delLoading, editLoading, data } = this.props;
		const { importModalVisible } = this.state;
		return (
			<div>
				<Grid
                    /* toolBtns={[{ icon: 'upload', text: '导入', handler: this.showImport }]}*/
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
				<ImportModal
          visible={importModalVisible}
          onClose={this.hideImport}
          onSuccess={this.importSuccess}
				/>
			</div>
		);
	}
}


function mapStateToProps(state) {
	const { loading } = state;
	return {
		data: state.user,
		loading: loading.effects['user/fetch'],
		addLoading: loading.effects['user/add'],
		editLoading: loading.effects['user/edit'],
		delLoading: loading.effects['user/del'],
	};
}

export default connect(mapStateToProps)(UserList);
