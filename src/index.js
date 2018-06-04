import dva from 'dva';
import createLoading from 'dva-loading';
import { createBrowserHistory as createHistory } from 'history';

import models from './model';

const app = dva({
	history: createHistory(),
	onError: (error) => {
		if (error.message === '401') {
			const from = location.pathname;
			if (from === '/login') {
				return;
			}
			if (from !== '/') {
				window.location = `/login?from=${from}`;
			} else {
				window.location = '/login';
			}
		}
	},
});

for (const model of models) {
	app.model(model);
}

app.use(createLoading({ effects: true }));
app.router(require('./router/router'));

app.start('#root');
window.app = app;
