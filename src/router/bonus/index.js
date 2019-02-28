import React from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Grid } from 'wsgcomponents';
import { request } from '../../utils/index';

class BonusList extends React.Component {
	constructor(props) {
		super(props);

    this.state = {
    	options:[],
    };
		this.columns = [{
			title: '股票代码',
			dataIndex: 'code',
		}, {
      title: '股票名称',
      dataIndex: 'name',
    }, {
			title: '持有数量',
			dataIndex: 'amount',
		}, {
			title: '分红价格(￥)',
			dataIndex: 'price',
		}, {
      title: '买入成本(￥)',
      dataIndex: 'totalCost',
    }, {
      title: '本金成本(￥)',
      dataIndex: 'pureCost',
    }, {
      title: '买入分红(%)',
      dataIndex: 'totalPercent',
    }, {
      title: '本金分红(%)',
      dataIndex: 'purePercent',
    }, {
      title: '分红日期',
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
        text: '分红时间',
        name: 'time',
        type: 'daterange',
      },];
	}

  componentWillMount() {
    request({
      url: '/bonus/codes',
      data: { sn: 1},
    }).then((body) => {
			this.setState({
				options:body,
			});
    })
  }

	getAddFields = () => {
		return [{
      text: '选择股票',
      name: 'code',
      type: 'select',
      options:this.state.options,
    }, {
      text: '分红资金',
      name: 'price',
      type: 'pricenum',
      validate: [{
        rules: [
          { required: true, message: '请输入分红资金' },
        ],
        trigger: ['onBlur', 'onChange'],
      }],
    }, {
      text: '分红日期',
      name: 'ctime',
      type: 'date',
      validate: [{
        rules: [
          { required: true, message: '请输入分红日期' },
        ],
        trigger: ['onBlur', 'onChange'],
      }],
		}];
	};
	add = (values, callback) => {
		const { dispatch } = this.props;
		dispatch({ type: 'bonus/add', payload: { values }, callback });
	};
	refersh = (filter, pageNo, pageSize) => {
		const { dispatch } = this.props;
		dispatch({ type: 'bonus/fetch', payload: { filter, pageNo, pageSize } });
	};
	render = () => {
		const { loading, addLoading, delLoading, data } = this.props;
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
		data: state.bonus,
		loading: loading.effects['bonus/fetch'],
		addLoading: loading.effects['bonus/add'],
	};
}

export default connect(mapStateToProps)(BonusList);
