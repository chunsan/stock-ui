import React from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Grid } from 'wsgcomponents';

class TradeList extends React.Component {
    constructor(props) {
        super(props);
        this.columns = [{
            title: '交易日期',
            dataIndex: 'ctime',
            render: (v = '') => {
                return moment(v)
                    .format('YYYY-MM-DD');
            },
        }, {
            title: '股票代码',
            dataIndex: 'code',
        }, {
            title: '股票名称',
            dataIndex: 'name',
        }, {
            title: '交易数量',
            dataIndex: 'amount',
        }, {
            title: '交易类型',
            dataIndex: 'type',
            render: (type) => {
                if (type === 'BUY_PRINCIPAL') {
                    return <span>追加买入</span>;
                } else if (type === 'BUY_BONUS') {
                    return <span>分红买入</span>;
                } else if (type === 'BUY_SELLOUT') {
                    return <span>套利买入</span>;
                } else if (type === 'SELL') {
                    return <span>卖出</span>;
                } else if (type === 'BONUS') {
                    return <span>分红</span>;
                }
            },
        }, {
            title: '交易资金',
            dataIndex: 'money',
        }, {
            title: '预计分红',
            dataIndex: 'preBonus',
        }, {
            title: '预计分红率',
            dataIndex: 'preBonus',
            render: (v, r) => {
                let num = (r.preBonus / r.principal) * 100;
                return num.toFixed(2) + '%';
            }
        }, {
            title: '累计分红',
            dataIndex: 'bonus',
        }, {
            title: '累计分红率',
            dataIndex: 'bonus',
            render: (v, r) => {
                let num = (r.bonus / r.principal) * 100;
                return num.toFixed(2) + '%';
            }
        }, {
            title: '累计套利',
            dataIndex: 'earn',
        }, {
            title: '累计套利率',
            dataIndex: 'earn',
            render: (v, r) => {
                let num = (r.earn / r.principal) * 100;
                return num.toFixed(2) + '%';
            }
        }, {
            title: '累计本金',
            dataIndex: 'principal',
        }, {
            title: '市值',
            dataIndex: 'market',
        }, {
            title: '资产',
            dataIndex: 'market',
            render: (v, r) => {
                return r.market + r.left;
            }
        }, {
            title: '累计增量',
            dataIndex: 'market',
            render: (v, r) => {
                let num = r.market + r.left - r.principal;
                return num.toFixed(2);
            }
        }, {
            title: '增长率',
            dataIndex: 'market',
            render: (v, r) => {
                let num = r.market + r.left - r.principal;
                num = (num / r.principal) * 100;
                return num.toFixed(2) + '%';
            }
        }];
        this.filterItems = [{
            text: '股票代码	',
            name: 'code',
            type: 'input',
        }, {
            text: '交易方式',
            name: 'type',
            type: 'select',
            style: {
                width: 120,
            },
            options: [{ value: 'BUY_PRINCIPAL', text: '追加买入' },
                { value: 'BUY_BONUS', text: '分红买入' },
                { value: 'BUY_SELLOUT', text: '套利买入' },
                { value: 'SELL', text: '卖出' },
                { value: 'BONUS', text: '分红' }],
        }, {
            text: '交易时间',
            name: 'time',
            type: 'daterange',
        }];
    }

    refersh = (filter, pageNo, pageSize) => {
        const { dispatch } = this.props;
        dispatch({ type: 'trade/fetch', payload: { filter, pageNo, pageSize } });
    };
    render = () => {
        const { loading, addLoading, data } = this.props;
        return (
            <div>
                <Grid
                    columns={this.columns}
                    loading={loading}
                    editModal
                    addLoading={addLoading}
                    filterItems={this.filterItems}
                    data={data}
                    refersh={this.refersh}
                />
            </div>
        );
    };
}

function mapStateToProps(state) {
    const { loading } = state;
    return {
        data: state.trade,
        loading: loading.effects['trade/fetch'],
        addLoading: loading.effects['trade/add'],
    };
}

export default connect(mapStateToProps)(TradeList);
