import React from 'react';
import { connect } from 'dva';
import { Grid } from 'wsgcomponents';

class SummaryList extends React.Component {
	constructor(props) {
		super(props);
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
        title: '套利',
        dataIndex: 'tradeTotal',
    }, {
        title: '累计套利',
        dataIndex: 'totalTrade',
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
      title: '当年增量',
      dataIndex: 'profit',
    }, {
        title: '当年增长率',
        dataIndex: 'profitPercent',
    }, {
        title: '累计增量',
        dataIndex: 'totalProfit',
    }, {
      title: '累计增长率',
      dataIndex: 'profitTotal',
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
