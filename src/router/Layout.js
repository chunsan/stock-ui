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
    this.Purchase = dynamic({
      app,
      models: () => [
        import('../model/purchase'),
      ],
      component: () => import('./purchase'),
    });
    this.Bonus = dynamic({
      app,
      models: () => [
        import('../model/bonus'),
      ],
      component: () => import('./bonus'),
    });
    this.Sellout = dynamic({
      app,
      models: () => [
        import('../model/sellout'),
      ],
      component: () => import('./sellout'),
    });
    this.Summary = dynamic({
      app,
      models: () => [
        import('../model/summary'),
      ],
      component: () => import('./summary'),
    });
		this.Info = dynamic({
			app,
			models: () => [
				import('../model/info'),
			],
			component: () => import('./info'),
		});
		this.Trade = dynamic({
			app,
			models: () => [
				import('../model/trade'),
			],
			component: () => import('./trade'),
		});
		this.Error = dynamic({
			app,
			component: () => import('./error'),
		});
    this.Index = dynamic({
      app,
      component: () => import('./index'),
    });
	}
	renderLayout= () => {
		return (
			<Switch>
				<Route exact path="/" component={this.Index} />
				<Route exact path="/users" component={this.User} />
				<Route exact path="/purchase" component={this.Purchase} />
				<Route exact path="/bonus" component={this.Bonus} />
				<Route exact path="/sellout" component={this.Sellout} />
				<Route exact path="/summary" component={this.Summary} />
				<Route exact path="/info" component={this.Info} />
				<Route exact path="/trade" component={this.Trade} />
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
						<div className={styles.logoImg}>股票记录</div>
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
