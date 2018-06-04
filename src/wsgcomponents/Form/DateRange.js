import React from 'react';
import { DatePicker } from 'antd';

export default class DateRange extends React.Component {
	constructor(props) {
		super(props);

		const value = this.props.value || {};
		this.state = {
			start: value.start,
			end: value.end,
		};
	}
	componentWillReceiveProps(nextProps) {
		if ('value' in nextProps) {
			this.setState(nextProps.value || { start: null, end: null });
		}
	}

	handleStartChange= (date) => {
		if (date) {
			date
				.hour(8)
				.minute(0)
				.second(0)
				.millisecond(0);
		}
		this.triggerChange({ start: date });
	};

	handleEndChange= (date) => {
		if (date) {
			date
				.hour(23)
				.minute(59)
				.second(59)
				.millisecond(0);
		}
		this.triggerChange({ end: date });
	};

	triggerChange = (changedValue) => {
		const onChange = this.props.onChange;
		if (onChange) {
			onChange({ ...this.state, ...changedValue });
		}
	};

	render() {
		const { start, end } = this.state;
		return (
			<span>
				<DatePicker style={{ width: 100 }} defaultValue={start} onChange={this.handleStartChange} />
        -
        <DatePicker style={{ width: 100 }} defaultValue={end} onChange={this.handleEndChange} />
			</span>
		);
	}
}
