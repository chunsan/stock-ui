import React from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Grid } from 'wsgcomponents';

class PurchaseList extends React.Component {
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
			title: '买入数量',
			dataIndex: 'amount',
		}, {
			title: '买入价格',
			dataIndex: 'price',
		}, {
        title: '手续费',
        dataIndex: 'tax',
    }, {
      title: '当前价格',
      dataIndex: 'currentPrice',
    }, {
			title: '买入方式',
			dataIndex: 'method',
      render: (method) => {
        if (method === 'PRINCIPAL') {
          return <span>追加买入</span>;
        } else if (method === 'BONUS') {
          return <span>分红买入</span>;
        } else if (method === 'SELLOUT') {
          return <span>卖出资金买入</span>;
        }
      },
		}, {
      title: '买入日期',
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
      text: '买入方式',
      name: 'method',
      type: 'select',
      style: {
        width: 120,
      },
      options:[{value:'PRINCIPAL',text:'追加买入'},
        {value:'BONUS',text:'分红买入'},
        {value:'SELLOUT',text:'卖出资金买入'}],
    }, {
        text: '买入时间',
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
      text: '买入价格',
      name: 'price',
      type: 'pricenum',
      validate: [{
        rules: [
          { required: true, message: '请输入买入价格' },
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
      text: '买入方式',
      name: 'method',
      type: 'select',
      options:[{value:'PRINCIPAL',text:'追加买入'},
				{value:'BONUS',text:'分红买入'},
        {value:'SELLOUT',text:'卖出资金买入'}],
    }, {
      text: '买入日期',
      name: 'ctime',
      type: 'date',
      validate: [{
        rules: [
          { required: true, message: '请输入买入日期' },
        ],
        trigger: ['onBlur', 'onChange'],
      }],
		}];
	};
	add = (values, callback) => {
		const { dispatch } = this.props;
		dispatch({ type: 'purchase/add', payload: { values }, callback });
	};
	refersh = (filter, pageNo, pageSize) => {
		const { dispatch } = this.props;
		dispatch({ type: 'purchase/fetch', payload: { filter, pageNo, pageSize } });
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
		data: state.purchase,
		loading: loading.effects['purchase/fetch'],
		addLoading: loading.effects['purchase/add'],
	};
}

export default connect(mapStateToProps)(PurchaseList);
