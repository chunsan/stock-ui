import React from 'react';
import { connect } from 'dva';
import { Grid } from 'wsgcomponents';

class InfoList extends React.Component {
    constructor(props) {
        super(props);
        this.columns = [{
            title: '编码',
            dataIndex: 'code',
        }, {
            title: '名称',
            dataIndex: 'name',
        }, {
            title: '持仓',
            dataIndex: 'amount',
        }, {
            title: '平均价',
            dataIndex: 'buyCost',
            render: (v, r) => {
                if (r.amount === 0) {
                    return 0;
                } else {
                    let num = (r.buyCost / r.amount);
                    return num.toFixed(2);
                }
            }
        }, {
            title: '摊薄价',
            dataIndex: 'diluteCost',
            render: (v, r) => {
                if (r.amount === 0) {
                    return 0;
                } else {
                    let num = (r.diluteCost / r.amount);
                    return num.toFixed(2);
                }
            }
        }, {
            title: '当前价',
            dataIndex: 'price',
        }, {
            title: '持仓账面盈亏',
            dataIndex: 'buyCost',
            render: (v, r) => {
                let num = (r.price * r.amount) - r.buyCost;
                return num.toFixed(2);
            }
        }, {
            title: '持仓盈亏率',
            dataIndex: 'buyCost',
            render: (v, r) => {
                if (r.buyCost === 0) {
                    return '0%';
                } else {
                    let num = ((r.price * r.amount - r.buyCost) / r.buyCost) * 100;
                    return num.toFixed(2) + '%';
                }

            }
        }, {
            title: '总账面盈亏',
            dataIndex: 'buyCost',
            render: (v, r) => {
                let num = (r.price * r.amount) - r.buyCost + r.earn + r.bonus;
                return num.toFixed(2);
            }
        }, {
            title: '总账面盈亏率',
            dataIndex: 'buyCost',
            render: (v, r) => {
                let num = (r.price * r.amount - r.buyCost + r.earn + r.bonus)/r.principal * 100;
                return num.toFixed(2) + '%';
            }
        }, {
            title: '总套利',
            dataIndex: 'earn',
            render: (v, r) => {
                if (v) {
                    return v;
                } else {
                    return 0;
                }
            }
        }, {
            title: '总分红',
            dataIndex: 'bonus',
            render: (v, r) => {
                if (v) {
                    return v;
                } else {
                    return 0;
                }
            }
        }, {
            title: '预计分红',
            dataIndex: 'preBonus',
            render: (v, r) => {
                let num = r.preBonus * r.amount / 10;
                return num.toFixed(2);
            }
        }];
        this.filterItems = [{
            text: '股票代码	',
            name: 'code',
            type: 'input',
        }];
    }


    refersh = (filter, pageNo, pageSize) => {
        const { dispatch } = this.props;
        dispatch({ type: 'info/fetch', payload: { filter, pageNo, pageSize } });
    };
    render = () => {
        const { loading, data } = this.props;
        return (
            <div>
                <Grid
                    columns={this.columns}
                    loading={loading}
                    data={data}
                    filterItems={this.filterItems}
                    refersh={this.refersh}
                />
            </div>
        );
    };
}

function mapStateToProps(state) {
    const { loading } = state;
    return {
        data: state.info,
        loading: loading.effects['info/fetch'],
    };
}

export default connect(mapStateToProps)(InfoList);
