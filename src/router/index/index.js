import React from 'react';
import { Card, Col, Row } from 'antd';
import { request } from '../../utils/index';

export default class Index extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      principal:0,
      bonusTotal:0,
      bonusLeft:0,
      sellLeft:0,
      total:0,
      handle:[],
      rank:[]
    };
  }

  componentWillMount() {
    request({
      url: '/user/query',
      data: { sn: 1},
    }).then((body) => {
      if (body.success) {
        this.setState({
          principal:body.result.principal?body.result.principal:0,
          bonusTotal:body.result.bonusTotal?body.result.bonusTotal:0,
          bonusLeft:body.result.bonusLeft?body.result.bonusLeft:0,
          sellLeft:body.result.sellLeft?body.result.sellLeft:0,
          total:body.result.total?body.result.total:0,
          handle:body.result.handle,
          rank:body.result.rank,
        });
      } else {

      }
    })
  }

  infos= () =>  {
    return this.state.handle.map((info) => {
      return (<p>{info}</p>);
    });
  }

  getOtionTem= () =>  {
    let x = [];
    let y = [];
    this.state.rank.map((info) => {
      x.push(info.name);
      y.push(info.percent);
    });
    const option = {
      title: {
        text: '市值增长比排行'
      },
      tooltip: {},
      legend: {
        data:['百分比']
      },
      xAxis: {
        data: x
      },
      yAxis: {
        name: '%',
      },
      series: [{
        name: '市值增长',
        type: 'bar',
        data: y
      }]
    }
    return option;
  }

  render() {
    return (
      <div style={{ background: '#ECECEC', padding: '30px' }}>
        <Row gutter={24}>
          <Col span={24}>
            <Card title="个人资产" style={{fontSize:20}}>
              <p>本金汇总:{this.state.principal}￥</p>
              <p>资产汇总:{this.state.total + this.state.bonusLeft + this.state.sellLeft}￥</p>
              <p>分红汇总:{this.state.bonusTotal}￥</p>
              <p>市值资金池:{this.state.total}￥</p>
              <p>分红资金池:{this.state.bonusLeft}￥</p>
              <p>套利资金池:{this.state.sellLeft}￥</p>
              <p>持仓情况:</p>
              {this.infos()}
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}
