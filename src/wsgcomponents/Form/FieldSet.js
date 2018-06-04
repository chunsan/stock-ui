import React from 'react';
import PropTypes from 'prop-types';
import { Card, Form, Row, Col } from 'antd';

import { RawForm } from './index';

const isEmptyObject = (e) => {
	for (const t in e) {
		if (t) {
			return false;
		}
	}
	return true;
};

class FieldSet extends RawForm {
	static propTypes = {
		fieldset: PropTypes.array.isRequired,
	};
	getFieldsArray = () => {
		const { fieldset } = this.props;
		const dy = !!fieldset.find(field => field.check);
		if (!dy) {
			return this.getResult(fieldset);
		}
		const { form } = this.props;
		const values = form.getFieldsValue();
		if (isEmptyObject(values)) {
			fieldset.forEach((item) => {
				item.value.forEach((field) => {
					values[field.name] = field.value;
				});
			});
		}
		const newFields = fieldset
      .filter((field) => {
	return !field.check || field.check(values);
});
		return this.getResult(newFields);
	};
	getResult = (fieldArr) => {
		const { columns } = this.props;
		const resultList = [];
		fieldArr.forEach((fields) => {
			const hasRowArray = fields.value
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

			const addRowArray = fields.value
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
			const oneField = {
				legend: fields.legend,
				value: result,
			};
			resultList.push(oneField);
		});
		return { resultList };
	};
	renderMultColumn = () => {
		const { extra, columns } = this.props;
		const { resultList } = this.getFieldsArray();
		return (
			<Form layout="horizontal" className="ant-advanced-search-form">
				{
          resultList.map((item) => {
	return (
		<Card title={item.legend} noHovering style={{ marginBottom: 10 }}>
			{
                  item.value.map((list) => {
	return (
		<Row gutter={2}>
			{
                          list.map((col, i) => {
	const lab = columns === 1 ? 4 : 6 / col.flex;
	return (
		<Col sm={(24 / columns) * col.flex} key={`filterindex${i}`}>
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
		</Card>
	);
})
        }
				{ this.renderBtn() }
				{extra}
			</Form>
		);
	};
	render() {
		return this.renderMultColumn();
	}
}

const FormWarp = (opt = {}) => {
	return Form.create(opt)(FieldSet);
};
export { FormWarp as default, FieldSet as RawFieldSet };
