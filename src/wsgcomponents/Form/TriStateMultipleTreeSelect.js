import React from 'react';
import { TreeSelect } from 'antd';
import findChildrenExpand from './tree';

export default class TriStateMultipleTreeSelect extends React.Component {

	constructor(props) {
		super(props);
		const { defaultValue } = props;
		this.state = {
			multipleValue: !defaultValue ? [] : defaultValue,
		};
	}
	onMultipleChange = (value) => {
		const { onChange } = this.props;
		const { multipleValue } = this.state;
		let result;
		if (value.length > multipleValue.length) {
      // add
			result = this.handlerAdd(this.findChecked(multipleValue, value), value);
		} else {
      // remove
			result = this.handlerRemove(this.findDeChecked(multipleValue, value), value);
		}

		if (!result) {
			return;
		}
		this.setState({ multipleValue: result });
		if (onChange) {
			onChange(result.map(node => node.value));
		}
	};
	findChecked = (oldvalue, value) => {
		const ids = oldvalue.map(node => node.value);
		return value.find(node => !ids.includes(node.value));
	};

	findDeChecked = (oldvalue, value) => {
		const ids = value.map(node => node.value);
		return oldvalue.find(node => !ids.includes(node.value));
	};

	handlerAdd = (node, checkedlist) => {
		const { treeData } = this.props;
		const children = findChildrenExpand(node.value, treeData) || [];
		const ret = new Set(checkedlist);
		children.map((child) => {
			return {
				label: child.label,
				value: child.value,
			};
		}).every(child => ret.add(child));

		return [...ret];
	};

	handlerRemove = (node, checkedlist) => {
		const { treeData } = this.props;
		const children = findChildrenExpand(node.value, treeData) || [];
		const childrenIds = children.map(child => child.value);

		return checkedlist.filter((item) => {
			return !childrenIds.includes(item.value);
		});
	};

	render = () => {
		const { ...other } = this.props;
		return (
			<TreeSelect
        {...other}
        treeCheckStrictly
        multiple
        value={this.state.multipleValue}
        onChange={this.onMultipleChange}
			/>
		);
	}
}

