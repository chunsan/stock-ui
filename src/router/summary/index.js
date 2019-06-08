import React from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Grid } from 'wsgcomponents';

class SummaryList extends React.Component {
	constructor(props) {
		super(props);

    this.state = {
    	options:[],
    };
		this.columns = [{
			title: '年份',
			dataIndex: 'year',
		}, {
      title: '投入本金',
      dataIndex: 'buyPrincipal',
    }, {
      title: '累计本金',
      dataIndex: 'principal',
    }, {
      title: '分红',
      dataIndex: 'bonusTotal',
    }, {
      title: '累计分红',
      dataIndex: 'bonus',
    }, {
      title: '分红回报率',
      dataIndex: 'bonusp',
    }, {
      title: '累计分红回报率',
      dataIndex: 'bonusPercent',
    }, {
      title: '市值',
      dataIndex: 'market',
    }, {
      title: '资产',
      dataIndex: 'asset',
    }, {
      title: '资产增量',
      dataIndex: 'profit',
    }, {
      title: '资产增长率',
      dataIndex: 'profitPercent',
    }, {
      title: '资产/本金',
      dataIndex: 'profitTotal',
    }, {
      title: '当年卖出',
      dataIndex: 'sellTotal',
    }, {
      title: '当年买入',
      dataIndex: 'buyTotal',
    }, {
      title: '分红买入',
      dataIndex: 'buyBonus',
    }, {
      title: '卖出资金买入',
      dataIndex: 'buySell',
    }];
		this.filterItems = [{
			text: '股票代码	',
			name: 'code',
			type: 'input',
		}, {
        text: '分红时间',
        name: 'time',
        type: 'daterange',
      },];
	}


	refersh = (filter, pageNo, pageSize) => {
		const { dispatch } = this.props;
		dispatch({ type: 'summary/fetch', payload: { filter, pageNo, pageSize } });
	};
	render = () => {
		const { loading, data } = this.props;
		return (
			<div>
				<Grid
          columns={this.columns}
          loading={loading}
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
		data: state.summary,
		loading: loading.effects['summary/fetch'],
	};
}

export default connect(mapStateToProps)(SummaryList);
