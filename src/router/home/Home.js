import React from 'react';
import { connect } from 'dva';

class Home extends React.Component {
	render() {
		return <div>首页</div>;
	}
}

export default connect()(Home);
