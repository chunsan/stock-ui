import React from 'react';
import { Form } from 'wsgcomponents';
import { message } from 'antd';

export default class InfoModal extends React.Component {
	okChange = (value) => {
		if (value.newpwd !== value.makeSure) {
			message.error('两次密码不一致');
			return null;
		}
		const { pwdChangeFunc } = this.props;
		pwdChangeFunc(value);
	};
	cancelChange = () => {
		this.props.visibleFunc(false);
	};
	render = () => {
		const { user, visiblePwdChange } = this.props;
		const fields = [{
			text: '旧密码',
			name: 'pwd',
			type: 'password',
			validate: [{
				rules: [{
					required: true,
					message: '请输入旧密码',
				}],
				trigger: ['onBlur'],
			}],
		}, {
			text: '新密码',
			name: 'newpwd',
			type: 'password',
			validate: [{
				rules: [
					{
						required: true,
						message: '请输入新密码',
					},
				],
				trigger: ['onBlur'],
			}],
		}, {
			text: '确认新密码',
			name: 'makeSure',
			type: 'password',
			validate: [{
				rules: [
					{
						required: true,
						message: '请确认新密码',
					},
				],
				trigger: ['onBlur'],
			}],
		}];
		return (
      user.result ? <Form.Modal
        title={'修改 '.concat(user.result.name).concat(' 密码')}
        visible={visiblePwdChange}
        fields={fields}
        onSubmit={this.okChange}
        onCancel={this.cancelChange}
      /> : null
		);
	}
}
