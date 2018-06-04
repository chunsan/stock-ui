import React from 'react';
import PropTypes from 'prop-types';
import { Select, Spin } from 'antd';
import { request, queryArray } from 'utils';

export default class LimitSelect extends React.Component {

	static defaultProps = {
		resultSize: 50,
		multiple: false,
	}

	static propTypes = {
		resultSize: PropTypes.number,
	}

	constructor(props) {
		super(props);
		const { value } = this.props;
		this.state = {
			fetching: true,
			data: [],
			value,
			latestValue: value,
			totalSize: 0,
			noData: false,
		};

		this.lastFetchId = 0;
	}

	componentDidMount = () => {
		const { data } = this.state;
		if (data.length === 0) {
			this.fetchData();
		}
	}
	componentWillReceiveProps(nextProps) {
		if ('value' in nextProps) {
			this.setState({ value: nextProps.value, latestValue: nextProps.value });
		}
	}

	onChange = (value) => {
		const { onChange } = this.props;
		const { data } = this.state;
		this.setState({
			value,
		});
		if (!value || value.length === 0) {
			this.setState({
				latestValue: '',
			});
			if (onChange) {
				onChange(null);
			}
		} else if (queryArray(data, value, 'value')) {
			this.setState({
				latestValue: value,
			});
			if (onChange) {
				onChange(value);
			}
		}
	};
	onFocus = () => {
		const { data, value } = this.state;
		if (data.length === 0) {
			this.fetchData(value);
		}
	};
	onBlur = () => {
		const { value, latestValue } = this.state;
		if (value === latestValue) {
			return;
		}
		this.setState({
			value: latestValue,
		});
	};
	onSelect = (value) => {
		this.setState({
			value,
			latestValue: value,
		});
	};

	fetchData = (value) => {
		this.lastFetchId += 1;
		const fetchId = this.lastFetchId;
		this.setState({ fetching: true });

		const { dataUrl, textName, valueName, searchName, resultSize } = this.props;
		const filter = { pageNo: 1, pageSize: resultSize };
		filter[searchName] = value;
		request({
			url: dataUrl,
			data: filter,
		}).then((body) => {
			if (fetchId !== this.lastFetchId) {
				return;
			}
			const result = body.list || body;
			this.setState({
				data: result.map((each) => { return { text: each[textName], value: each[valueName] }; }),
				fetching: false,
				totalSize: body.totalSize,
				noData: result.length === 0,
			});
		}).catch(() => {
			this.setState({
				fetching: false,
			});
		});
	};

	renderOptions = () => {
		const { totalSize, data } = this.state;
		const { resultSize } = this.props;
		const options = data.map(({ value, text }) => {
			return (
				<Select.Option
          key={value}
          value={value}
          title={text}
          label={text}
				>
					{text}
				</Select.Option>
			);
		});
		if (totalSize > resultSize) {
			options.push(
				<Select.Option
          disabled
          key=""
          value=""
          title="请继续输入条件进行过滤"
				>
					{`有${totalSize - resultSize}条数据未显示`}
				</Select.Option>,
      );
		}
		return options;
	};

	render() {
		const { fetching, value } = this.state;
		const { formProps, disabled } = this.props;
		return (
			<Spin spinning={fetching}>
				<Select
          showSearch
          allowClear
          // mode="combobox"
          filterOption
          optionFilterProp="title"
          optionLabelProp="label"
          placeholder="请输入查询条件"
          notFoundContent={fetching ? <Spin size="small" /> : '没有数据'}
          value={value}
          onBlur={this.onBlur}
          onSelect={this.onSelect}
          onSearch={this.fetchData}
          onChange={this.onChange}
          onFocus={this.onFocus}
          style={{ width: this.props.width ? this.props.width : '100%' }}
          {...formProps}
          disabled={disabled ? 'disabled' : false}
				>
					{this.renderOptions()}
				</Select>
			</Spin>
		);
	}
}
