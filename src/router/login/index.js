import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Button, Row, Form, Input } from 'antd';

import { config } from 'utils';
import styles from './index.less';

const FormItem = Form.Item;

const Login = ({
  loading,
  dispatch,
  form: {
    getFieldDecorator,
    validateFieldsAndScroll,
  },
}) => {
	const handleOk = () => {
		validateFieldsAndScroll((errors, values) => {
			if (errors) {
				return;
			}
			dispatch({ type: 'app/login', payload: values });
		});
	};

	return (
		<div className={styles.login}>
			<div className={styles.showForm}>
				<div className={styles.newLogo}>
					<img alt={'logo'} src={config.logo} />
					<h1>{config.name}</h1>
				</div>
				<div className={styles.valueBtns}>
					<form>
						<div className={styles.inputSize}>
							<FormItem hasFeedback>
								{getFieldDecorator('name', {
									rules: [
										{
											required: true, message: '请输入用户名',
										},
									],
								})(<Input size="large" onPressEnter={handleOk} placeholder="用户名" />)}
							</FormItem>
						</div>

						<div className={styles.inputSize}>
							<FormItem hasFeedback>
								{getFieldDecorator('password', {
									rules: [
										{
											required: true, message: '请输入密码',
										},
									],
								})(<Input size="large" type="password" onPressEnter={handleOk} placeholder="密码" />)}
							</FormItem>
						</div>

						<Row style={{ float: 'left' }}>
							<Button type="primary" size="large" onClick={handleOk} loading={loading.effects['app/login']} >登录</Button>
						</Row>
					</form>
				</div>
			</div>
		</div>
	);
};

Login.propTypes = {
	form: PropTypes.object,
	dispatch: PropTypes.func,
};

export default connect(({ loading }) => ({ loading }))(Form.create()(Login));
