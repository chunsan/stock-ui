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

  render() {
    return (
      <div style={{ background: '#ECECEC', padding: '30px' }}>
        <Row gutter={16}>
          <Col span={4}>
          </Col>
          <Col span={16}>
            <Card title="个人资产" style={{fontSize:20}}>
              <p>投入汇总:{this.state.principal}￥</p>
              <p>当前市值:{this.state.total}￥</p>
              <p>分红汇总:{this.state.bonusTotal}￥</p>
              <p>分红余额:{this.state.bonusLeft}￥</p>
              <p>卖出余额:{this.state.sellLeft}￥</p>
              <p>持仓情况:</p>
              {this.infos()}
            </Card>
          </Col>
          <Col span={4}>
          </Col>
        </Row>
      </div>
    );
  }
}
