import React from 'react';
import { routerRedux } from 'dva/router';
import Layout from './Layout.js';
import '../themes/index.less';
import './router.less';

const { ConnectedRouter } = routerRedux;

function RouterConfig({ app, history }) {
	return (
		<ConnectedRouter history={history}>
			<Layout app={app} />
		</ConnectedRouter>
	);
}

export default RouterConfig;
