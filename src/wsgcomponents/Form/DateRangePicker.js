import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DatePicker, TimePicker } from 'antd';
import moment from 'moment';

export default class DateRangePicker extends Component {

	static defaultProps = {
		showTime: false, // 是否显示时分秒
		allowClear: true, // 是否允许清除
		showType: 'day', // day or month
	};

	static propTypes = {
		showTime: PropTypes.bool,
		allowClear: PropTypes.bool,
		showType: PropTypes.string,
	};

	constructor(props) {
		super(props);
		const { value } = this.props;
		this.state = {
			start: value && value.length > 0 ? value[0] : null,
			end: value && value.length > 1 ? value[1] : null,
		};
	}

	onChange = (field, value) => {
		const { onChange } = this.props;
		const { start, end } = this.state;
		this.setState({
			[field]: value,
		});

		if (onChange) {
			if (field === 'start') {
				onChange([value, end]);
			} else {
				onChange([start, value]);
			}
		}
	};

	onStartChange = (value) => {
		this.onChange('start', value);
	};

	onEndChange = (value) => {
		this.onChange('end', value);
	};

	disabledStart = (start) => {
		const { end } = this.state;
		if (!start || !end) {
			return false;
		}
		return start.valueOf() > end.valueOf();
	};

	disabledEnd = (end) => {
		const { start } = this.state;
		if (!end || !start) {
			return false;
		}
		return end.valueOf() < start.valueOf();
	};
	showTimeOptions = (isShowTime, type) => {
		return (isShowTime ? {
			hideDisabledOptions: false,
			defaultValue: moment(type === 'start' ? '00:00:00' : '23:59:59', 'HH:mm:ss'),
		} : isShowTime);
	}

	render = () => {
		const { start, end } = this.state;
		const { showTime, allowClear, showType, size } = this.props;
		if (showType === 'day') {
			return (
				<div>
					<DatePicker
            disabledDate={this.disabledStart}
            showTime={this.showTimeOptions(showTime, 'start')}
            format={showTime ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD'}
            value={start}
            placeholder={'开始时间'}
            onChange={this.onStartChange}
            allowClear={allowClear}
            size={size || 'default'}
					/>
          ~
          <DatePicker
            disabledDate={this.disabledEnd}
            showTime={this.showTimeOptions(showTime, 'end')}
            format={showTime ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD'}
            value={end}
            placeholder={'结束时间'}
            onChange={this.onEndChange}
            allowClear={allowClear}
            size={size || 'default'}
          />
				</div>
			);
		} else if (showType === 'month') {
			return (
				<div>
					<DatePicker.MonthPicker
            disabledDate={this.disabledStart}
            value={start}
            placeholder={'开始时间'}
            onChange={this.onStartChange}
            allowClear={allowClear}

            size={size || 'default'}
					/>
          ~
          <DatePicker.MonthPicker
            disabledDate={this.disabledEnd}
            value={end}
            placeholder={'结束时间'}
            onChange={this.onEndChange}
            allowClear={allowClear}
            size={size || 'default'}
          />
				</div>
			);
		} else if (showType === 'time') {
			return (
				<div>
					<TimePicker
            value={start}
            placeholder={'开始时间'}
            onChange={this.onStartChange}
            allowClear={allowClear}

            size={size || 'default'}
					/>
          ~
          <TimePicker
            value={end}
            placeholder={'结束时间'}
            onChange={this.onEndChange}
            allowClear={allowClear}
            size={size || 'default'}
          />
				</div>
			);
		}
	}
}
