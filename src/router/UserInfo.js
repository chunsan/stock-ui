import React from 'react';
import { connect } from 'dva';
import { Layout } from 'components';

const { Header, PwdModal } = Layout;


class UserInfo extends React.Component {
	logout = () => {
		const { dispatch } = this.props;
		dispatch({ type: 'app/logout' });
	};
	updatepwdVisible = (value) => {
		const { dispatch } = this.props;
		dispatch({ type: 'app/updatepwdVisible', payload: { visiblePwdChange: value } });
	};
	pwdChangeFunc = (value) => {
		const { dispatch } = this.props;
		dispatch({ type: 'app/updatepwd', payload: { ...value } });
	};
	render = () => {
		const { app } = this.props;
		return (
			<div>
				<Header
          user={app.user}
          logout={this.logout}
          updatepwdVisible={this.updatepwdVisible}
				/>
				<PwdModal
          user={app.user}
          visiblePwdChange={app.visiblePwdChange}
          visibleFunc={this.updatepwdVisible}
          pwdChangeFunc={this.pwdChangeFunc}
				/>
			</div>
		);
	}
}

function mapStateToProps(state) {
	const { app } = state;
	return {
		app,
	};
}

export default connect(mapStateToProps)(UserInfo);
