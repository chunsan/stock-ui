import React from 'react';
import { connect } from 'dva';
import { Switch, withRouter, Route } from 'dva/router';
import { Card } from 'antd';
import pathToRegexp from 'path-to-regexp';
import dynamic from 'dva/dynamic';
import Menu from './Menu';
import MenuName from '../menu';
import UserInfo from './UserInfo.js';
import styles from './router.less';

class Layout extends React.Component {

	constructor(props) {
		super(props);
		const app = props.app;
		this.Login = dynamic({
			app,
			component: () => import('./login'),
		});
		this.User = dynamic({
			app,
			models: () => [
				import('../model/user'),
			],
			component: () => import('./user'),
		});
		this.Error = dynamic({
			app,
			component: () => import('./error'),
		});
	}
	renderLayout= () => {
		return (
			<Switch>
				<Route exact path="/users" component={this.User} />
				<Route path="*" component={this.Error} />
			</Switch>
		);
	}
	renderCardName = () => {
		let current = {};
		for (const index in MenuName) {
			if (MenuName[index].route && pathToRegexp(MenuName[index].route).exec(location.pathname)) {
				current = MenuName[index];
				break;
			}
		}
		return current.name;
	};

	renderApp = () => {
		const { user } = this.props;
		if (!user || !user.loginName) {
			return null;
		}
		return (
			<div>
				<div style={{ float: 'left', height: '100vh', width: '15%', textAlign: 'center' }}>
					<div className={styles.headLogo}>
						<div className={styles.logoImg}>智能灌溉</div>
					</div>
					<div style={{ height: 'calc(100vh - 60px)', borderRight: '1px solid #dedede', background: '#3e3e3e' }}><Menu /></div>
				</div>
				<div style={{ float: 'left', height: '100vh', width: '85%', overflow: 'auto', background: '#f0f0f0' }}>
					<div className={styles.bgradient}>
						<UserInfo />
					</div>
					<div style={{ height: 'calc(100vh - 60px)', borderRadius: 5, background: '#fff', border: '1px solid #e9e9e9' }}>
						<Card
							title={this.renderCardName()}
							style={{ marginTop: 5, marginLeft: 2 }}
							bordered={false}
							noHovering
							// extra={renderCrumb()}
							bodyStyle={{ padding: 0 }}
						>
							{ this.renderLayout() }
						</Card>
					</div>
				</div>
			</div>
		);
	}
	render() {
		return (
			<Switch>
				<Route exact path="/login" component={this.Login} />
				<Route render={this.renderApp} />
			</Switch>
		);
	}
}
function mapStateToProps(state) {
	return {
		user: state.app.user.result,
	};
}

export default withRouter(connect(mapStateToProps)(Layout));
