import React from 'react';
import PropTypes from 'prop-types';

import {
  Card,
  Form,
  Input,
  Select,
  Button,
  InputNumber,
  Switch,
  TreeSelect,
  DatePicker,
  Row,
  Col,
  Spin,
  TimePicker,
  Checkbox,
  Radio,
  message,
} from 'antd';
import Moment from 'moment';

import DateRange from './DateRange';
import DateRangePicker from './DateRangePicker';
import UploadField from './UploadField';
import MultipleTreeSelect from './MultipleTreeSelect';
import TriStateMultipleTreeSelect from './TriStateMultipleTreeSelect';
import LocSelect from './LocSelect';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;

const isEmptyObject = (e) => {
	for (const t in e) {
		if (t) {
			return false;
		}
	}
	return true;
};
class MyForm extends React.Component {

	static defaultProps = {
		columns: 1,
		card: true,
		inline: false,
		okBtn: true,
		canelBtn: true,
		okText: '确定111',
		canelText: '取消222',
	}

	static propTypes = {
		fields: PropTypes.array.isRequired,
		onSubmit: PropTypes.func,
		onCancel: PropTypes.func,
		card: PropTypes.bool,
		inline: PropTypes.bool,
		columns: PropTypes.number,
		okBtn: PropTypes.bool,
		canelBtn: PropTypes.bool,
		extra: PropTypes.element,
		title: PropTypes.string,
	}
	onUploadSuccess = (result) => {
		const { onUploadSuccess } = this.props;
		if (result.success) {
			if (onUploadSuccess) {
				onUploadSuccess(result);
			}
		} else {
			message.error(result.message);
		}
	}
	onUploadError = (error) => {
		const { onUploadError } = this.props;
		if (onUploadError) {
			onUploadError(error);
		} else {
			message.error(`操作失败${error.message}`);
		}
	}
	getResult = (fields) => {
		const { columns } = this.props;
		const hasRowArray = fields
      .filter(field => field.row !== undefined)
      .map((field, index) => {
	return Object.assign(field, {
		row: field.row,
		col: field.col ? field.col : (index % columns) + 1,
		flex: field.flex ? field.flex : 1,
		custom: true,
	});
})
      .sort((field1, field2) => {
	return field1.row - field2.row;
});

		const addRowArray = fields
      .filter(field => field.row === undefined)
      .map((field, index) => {
	return Object.assign(field, {
		row: Math.floor(index / columns),
		col: (index % columns) + 1,
		flex: 1,
	});
});

		const fieldArrays = [...hasRowArray, ...addRowArray]
      .sort((field1, field2) => {
	if (field1.row !== field2.row) {
		return field1.row - field2.row;
	}
	if (field1.custom && field2.custom) {
		return 0;
	}
	if (field1.custom) {
		return 1;
	}
	return -1;
})
      .map((field) => {
	if (field.custom) {
		return Object.assign(field, {
			row: `${field.row}-c`,
			col: field.col,
			flex: field.flex,
		});
	}
	return field;
});
		const result = [];
		let latestRow;
		fieldArrays.forEach((field) => {
			if (latestRow !== field.row) {
				latestRow = field.row;
				result.push([]);
			}
			result[result.length - 1].push(field);
		});
		return { result };
	};
	getFieldsArray = () => {
		const { fields } = this.props;
		const dy = !!fields.find(field => field.check);
		if (!dy) {
			return this.getResult(fields);
		}
		const { form } = this.props;
		const values = form.getFieldsValue();
		if (isEmptyObject(values)) {
			fields.forEach((field) => {
				values[field.name] = field.value;
			});
		}
		const newFields = fields
      .filter((field) => {
	return !field.check || field.check(values);
});
		return this.getResult(newFields);
	};
	getValues = () => {
		const fieldValues = this.props.form.getFieldsValue();
		const resultValues = {};
		for (const name in fieldValues) {
			if (fieldValues[name] !== undefined) {
				resultValues[name] = fieldValues[name];
			}
		}
		return resultValues;
	}
	preUpload = (resolve) => {
		this.startUploadFile = resolve;
	};
	validateFields = (field) => {
		this.props.form.validateFields(field);
	};
	handleSubmit = (e) => {
		e.preventDefault();
		const { onSubmit } = this.props;
		this.props.form.validateFields({ force: true, first: true }, (err, values) => {
			if (err) {
				return;
			}
			if (this.startUploadFile) {
				this.startUploadFile(values);
			} else if (onSubmit) {
				onSubmit(values);
			}
		});
	};

	reset = () => {
		const { fields, onCancel } = this.props;
		if (this.startUploadFile) {
			this.startUploadFile = null;
		}
		if (onCancel) {
			return onCancel();
		}

		const { setFieldsValue } = this.props.form;
		if (!this.initValue) {
			const initValue = {};
			fields.forEach((field) => {
				initValue[field.name] = field.value;
			});

			this.initValue = initValue;
		}

		setFieldsValue(this.initValue);
	};
	renderItem = (item) => {
		const { getFieldDecorator } = this.props.form;
		const { data, value, text, validate = [], ...other } = item;
		const initialValue = item.value;
		if (item.component) {
			return getFieldDecorator(item.name, { initialValue, validate })(item.component);
		}
		if (item.type === 'input') {
			return getFieldDecorator(item.name, { initialValue, validate })(
				<Input
          placeholder={
          item.placeholder ? item.placeholder : `请输入${item.text}`
        }
          onPressEnter={this.handleSubmit} {...other}
				/>,
      );
		} else if (item.type === 'number') {
			return getFieldDecorator(item.name, { initialValue, validate })(
				<InputNumber placeholder={`请输入${item.text}`} {...other} step={100} min={100} style={{ width: 150 }}/>,
      );
		} else if (item.type === 'pricenum') {
      return getFieldDecorator(item.name, { initialValue, validate })(
				<InputNumber placeholder={`请输入${item.text}`} {...other} step={0.01} min={1} style={{ width: 150 }}/>,
      );
    } else if (item.type === 'hide') {
			return getFieldDecorator(item.name, { initialValue, validate })(
				<Input type="hidden" />,
      );
		} else if (item.type === 'textarea') {
			return getFieldDecorator(item.name, { initialValue, validate })(
				<Input type="textarea" rows={item.row} placeholder={`请输入${item.text}`} {...other} />,
      );
		} else if (item.type === 'password') {
			return getFieldDecorator(item.name, { initialValue, validate })(
				<Input
          type="password" autoComplete="off" placeholder={`请输入${item.text}`}
          onPressEnter={this.handleSubmit} {...other}
				/>,
      );
		} else if (item.type === 'selectinput') {
			const prefixSelector = getFieldDecorator(item.selectname, {
				initialValue: item.selectvalue,
			})(
        { ...item.selects },
      );
			return getFieldDecorator(item.name, { initialValue, validate })(
				<Input placeholder={item.text} addonBefore={prefixSelector} />,
      );
		} else if (item.type === 'switch') {
			return getFieldDecorator(item.name, { valuePropName: 'checked', initialValue })(
				<Switch {...other} />,
      );
		} else if (item.type === 'select') {
			const options = item.options || [];
			const groups = item.groups || [];
			return getFieldDecorator(item.name, { initialValue, validate })(
				<Select placeholder={`请选择${item.text}`} {...other}>
					{
            options.map((option) => {
	return (
		<Select.Option key={option.value} value={option.value}>
			{option.text}
		</Select.Option>
	);
}).concat(groups.map((group) => {
	return (
		<Select.OptGroup label={group.name}>
			{
                    group.options.map((option, index) => {
	return (
		<Select.Option key={index} value={option.value}>
			{option.text}
		</Select.Option>
	);
})
                  }
		</Select.OptGroup>
	);
}))
          }
				</Select>,
      );
		} else if (item.type === 'treeselect') {
			const tProps = {
				treeData: data,
				multiple: true,
				treeCheckable: true,
				showCheckedStrategy: TreeSelect.SHOW_PARENT,
				searchPlaceholder: text,
				...other,
			};
			return getFieldDecorator(item.name, { initialValue })(<TreeSelect {...tProps} />);
		} else if (item.type === 'multipletreeselect') {
			const tProps = {
				treeData: data,
				multiple: true,
				treeCheckable: true,
				searchPlaceholder: text,
				...other,
			};
			return getFieldDecorator(item.name, { initialValue })(<MultipleTreeSelect {...tProps} />);
		} else if (item.type === 'tristatemultipletreeSelect') {
			const tProps = {
				treeData: data,
				multiple: true,
				treeCheckable: true,
				searchPlaceholder: text,
				...other,
			};
			return getFieldDecorator(item.name, { initialValue })(
				<TriStateMultipleTreeSelect {...tProps} />,
      );
		} else if (item.type === 'date') {
			return getFieldDecorator(item.name, {
				initialValue: typeof initialValue === 'number'
          ? new Moment(new Date(initialValue)) : initialValue,
				validate,
			})(
				<DatePicker style={{ width: '100%' }} placeholder={item.text} {...other} />,
      );
		} else if (item.type === 'timepicker') {
			return getFieldDecorator(item.name, {
				initialValue: typeof initialValue === 'number'
          ? new Moment(new Date(initialValue)) : initialValue,
			})(
				<TimePicker placeholder={item.text} {...other} />,
      );
		} else if (item.type === 'datetime') {
			return getFieldDecorator(item.name, {
				initialValue: typeof initialValue === 'number'
          ? new Moment(new Date(initialValue)) : initialValue,
				validate,
			})(
				<DatePicker placeholder={item.text} showTime format="YYYY-MM-DD HH:mm:ss" {...other} />,
      );
		} else if (item.type === 'daterange') {
			return getFieldDecorator(item.name, { validate, initialValue: value })(
				<DateRange placeholder={text} {...other} />,
      );
		} else if (item.type === 'daterangepicker') {
			const options = item.options || [];
			return getFieldDecorator(item.name, { initialValue, validate })(
				<DateRangePicker {...other} options={options} />,
      );
		} else if (item.type === 'upload') {
			return getFieldDecorator(`_${item.name}`, { validate })(
				<UploadField
          item={{ beforeUpload: this.preUpload, ...item }}
          data={this.getValues}
          onSuccess={this.onUploadSuccess}
          onUpError={this.onUploadError}
          onFieldChange={() => {
	this.validateFields([`_${item.name}`]);
}}
          {...other}
				/>,
      );
		} else if (item.type === 'locselect') {
			return getFieldDecorator(item.name, { initialValue, validate })(
				<LocSelect
          {...other}
				/>,
      );
		} else if (item.type === 'checkbox') {
			const options = item.options || [];
			return getFieldDecorator(item.name, { initialValue, validate })(
				<Checkbox.Group options={options} />,
      );
		} else if (item.type === 'radio') {
			const options = item.options || [];
			return getFieldDecorator(item.name, { initialValue, validate })(
				<Radio.Group options={options} {...other} />,
      );
		} else if (item.type === 'rangepicker') {
			const options = item.options || [];
			return getFieldDecorator(item.name, { initialValue, validate })(
				<RangePicker {...other} options={options} />,
      );
		}
	};
	renderInline = () => {
		const { fields, okBtn, canelBtn, okText, canelText, extra } = this.props;

		return (
			<Form layout="inline" onSubmit={this.handleSubmit}>
				{
          fields.map((item) => {
	return (
		<FormItem
                key={item.name}
                label={item.text}
		>
			{ this.renderItem(item) }
		</FormItem>
	);
})
        }
				<FormItem wrapperCol={{ span: 4, offset: 2 }}>
					{canelBtn ? <Button onClick={this.reset}>{canelText}</Button> : null}
					{okBtn ? <Button type="primary" onClick={this.handleSubmit}>{okText}</Button> : null}
				</FormItem>

				{extra}
			</Form>
		);
	};

	renderMultColumn = () => {
		const { extra, columns } = this.props;
		const { result } = this.getFieldsArray();
		return (
			<Form layout="horizontal" className="ant-advanced-search-form">
				{
          result.map((item) => {
	return (
		<Row gutter={2} key={item.map(i => `row-${i.name}-`).join('')}>
			{
                  item.map((col) => {
	const lab = columns === 1 ? 4 : 6 / col.flex;
	return (
		<Col sm={(24 / columns) * col.flex} key={`col-${col.name}`}>
			<Form.Item
                          key={col.name}
                          label={col.text}
                          labelCol={{ span: lab }}
                          wrapperCol={{ span: 24 - lab }}
			>
				{this.renderItem(col)}
			</Form.Item>
		</Col>
	);
})
                }
		</Row>
	);
})
        }
				{ this.renderBtn() }
				{extra}
			</Form>
		);
	};

	renderBtn = () => {
		const { canelBtn, okBtn, canelText, okText } = this.props;
		if (!canelBtn && !okBtn) {
			return null;
		}
		return (
			<FormItem wrapperCol={{ span: 22 }}>
				{canelBtn ? <Button onClick={this.reset}>
					{ canelText } </Button> : null}
				{okBtn ? <Button type="primary" style={{ marginLeft: 4 }} onClick={this.handleSubmit}>{okText}</Button> : null}
			</FormItem>
		);
	};
	renderForm = () => {
		const { inline, formloading } = this.props;
		if (inline) {
			return this.renderInline();
		}
		return (
			<Spin spinning={!!formloading}>
				{this.renderMultColumn()}
			</Spin>
		);
	};

	render() {
		const { card, title } = this.props;
		if (card || title) {
			return <Card title={title} noHovering>{this.renderForm()}</Card>;
		}

		return this.renderForm();
	}

}

const FormWarp = (opt = {}) => {
	return Form.create(opt)(MyForm);
};
export { FormWarp as default, MyForm as RawForm };
