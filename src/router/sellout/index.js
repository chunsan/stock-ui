import React from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Grid } from 'wsgcomponents';

class SelloutList extends React.Component {
	constructor(props) {
		super(props);
		this.columns = [{
			title: '股票代码',
			dataIndex: 'code',
		}, {
      title: '股票名称',
      dataIndex: 'name',
    }, {
      title: '交易所名称',
      dataIndex: 'type',
    }, {
			title: '卖出数量',
			dataIndex: 'amount',
		}, {
			title: '卖出价格',
			dataIndex: 'price',
		}, {
      title: '当前价格',
      dataIndex: 'currentPrice',
    }, {
      title: '卖出日期',
      dataIndex: 'ctime',
      render: (v = '') => {
        return moment(v).format("YYYY-MM-DD");
      },
    },];
		this.filterItems = [{
			text: '股票代码	',
			name: 'code',
			type: 'input',
		}, {
      text: '卖出方式',
      name: 'method',
      type: 'select',
      style: {
        width: 120,
      },
      options:[{value:'PRINCIPAL',text:'追加卖出'},
        {value:'BONUS',text:'分红卖出'},
        {value:'SELLOUT',text:'卖出资金卖出'}],
    }, {
        text: '卖出时间',
        name: 'time',
        type: 'daterange',
      },];
	}
	getAddFields = () => {
		return [{
			text: '股票代号',
			name: 'code',
			type: 'input',
			validate: [{
				rules: [
                    { required: true, message: '请输入股票代号' },
				],
				trigger: ['onBlur', 'onChange'],
			}],
		}, {
			text: '股票数量',
			name: 'amount',
			type: 'number',
			validate: [{
				rules: [
                    { required: true, message: '请输入股票数量' },
				],
				trigger: ['onBlur', 'onChange'],
			}],
		}, {
      text: '卖出价格',
      name: 'price',
      type: 'pricenum',
      validate: [{
        rules: [
          { required: true, message: '请输入卖出价格' },
        ],
        trigger: ['onBlur', 'onChange'],
      }],
    }, {
			text: '手续费',
			name: 'tax',
			type: 'pricenum',
			validate: [{
				rules: [
					{ required: true, message: '请输入手续费' },
				],
				trigger: ['onBlur', 'onChange'],
			}],
		}, {
      text: '卖出日期',
      name: 'ctime',
      type: 'date',
      validate: [{
        rules: [
          { required: true, message: '请输入卖出日期' },
        ],
        trigger: ['onBlur', 'onChange'],
      }],
		}];
	};
	add = (values, callback) => {
		const { dispatch } = this.props;
		dispatch({ type: 'sellout/add', payload: { values }, callback });
	};
	refersh = (filter, pageNo, pageSize) => {
		const { dispatch } = this.props;
		dispatch({ type: 'sellout/fetch', payload: { filter, pageNo, pageSize } });
	};
	render = () => {
		const { loading, addLoading, data } = this.props;
		return (
			<div>
				<Grid
          columns={this.columns}
          loading={loading}
          editModal
          insert={this.add}
          addLoading={addLoading}
          filterItems={this.filterItems}
          insertFields={this.getAddFields()}
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
		data: state.sellout,
		loading: loading.effects['sellout/fetch'],
		addLoading: loading.effects['sellout/add'],
	};
}

export default connect(mapStateToProps)(SelloutList);
