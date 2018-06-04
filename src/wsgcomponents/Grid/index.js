import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Button, Icon, Tooltip, Dropdown, Popconfirm } from 'antd';

import ExpandItem from './ExpandItem';
import QueryForm from '../Form/index';
import Modal from '../Form/Modal';

export default class Grid extends Component {

	static defaultProps = {
		autorefersh: false,
		showQueryBtn: false,
		filterItems: [],
		filterInline: false,
		actions: [],
		toolBtns: [],
		filter: {},
		disableToolbar: false,
		page: true,
		insertModal: true,
		editModal: true,
		insertFields: [],
		editFields: [],
		deleteTitle: '删除',
		deleteConfirm: '请确认删除吗？',
		insertModalTitle: '添加',
		editModalTitle: '编辑',
		pagination: false,
	};

	static propTypes = {
		columns: PropTypes.array.isRequired,
		data: PropTypes.object.isRequired,
		refersh: PropTypes.func.isRequired,
		onRowSelectChange: PropTypes.func,
		expandedRowRender: PropTypes.func,
		onRowClick: PropTypes.func,
		filterItems: PropTypes.array,
		filterInline: PropTypes.bool,
		filter: PropTypes.object,
		edit: PropTypes.func,
		editModal: PropTypes.bool,
		batchDel: PropTypes.func,
		del: PropTypes.func,
		insert: PropTypes.func,
		insertModal: PropTypes.bool,
		exportCsv: PropTypes.func,
		actions: PropTypes.array,
		toolBtns: PropTypes.array,
		autorefersh: PropTypes.bool,
		showQueryBtn: PropTypes.bool,
		disableToolbar: PropTypes.bool,
		page: PropTypes.bool,
		fields: PropTypes.array,
		deleteTitle: PropTypes.string,
		deleteConfirm: PropTypes.string,
		insertModalTitle: PropTypes.string,
		editModalTitle: PropTypes.string,
		onAddStart: PropTypes.func,
		onAddEnd: PropTypes.func,
		onEditStart: PropTypes.func,
		onEditEnd: PropTypes.func,
		addProp: PropTypes.object,
		addFormProp: PropTypes.object,
		editProp: PropTypes.object,
		editFormProp: PropTypes.object,
		extra: PropTypes.element,
		pagination: PropTypes.bool,
	};

	constructor(props) {
		super(props);
		const { actions, edit, del, columns, onRowSelectChange,
      editModal, deleteTitle, deleteConfirm } = this.props;
		this.actions = [];
		if (del) {
			this.actions.unshift({ icon: 'delete', handler: del, name: deleteTitle, confirm: deleteConfirm });
		}
		if (edit) {
			if (editModal) {
				const handler = (record) => {
					this.editHandler = (values) => {
						this.edit({ id: record.id, ...values });
					};
					this.showEditModal(record);
				};
				this.actions.unshift({ icon: 'edit', handler, name: '编辑' });
			} else {
				this.actions.unshift({ icon: 'edit', handler: edit, name: '编辑' });
			}
		}
		if (actions) {
			this.actions = actions.concat(this.actions);
		}

		this.columns = [].concat(columns);
		if (this.actions.length > 0) {
			const len = 40 * this.actions.length;
			this.columns.push({
				title: '操作',
				dataIndex: '_operation',
				width: len < 60 ? 60 : len,
				render: (text, record) => {
					return this.actions.filter((action) => {
						if (action.check) {
							return action.check(record);
						}
						return true;
					}).map((action) => {
						return (
							<Tooltip
                key={`${action.icon}-${record.id}`}
                placement="bottom"
                title={action.name}
                arrowPointAtCenter
							>
								{
                  action.confirm ? (
	<Popconfirm
                      placement="topLeft" title={action.confirm} onConfirm={() => {
	action.handler(record);
}}
                      okText="确定" cancelText="取消"
	>
		<Button
                        shape="circle"
                        style={{ marginLeft: 2 }}
                        icon={action.icon}
		/>
	</Popconfirm>
                    ) : (
	<Button
                        shape="circle"
                        style={{ marginLeft: 2 }}
                        icon={action.icon}
                        onClick={() => {
	action.handler(record);
}}
	/>
                    )
                }
							</Tooltip>
						);
					});
				},
			});
		}

		const { toolBtns, insert, exportCsv, insertModal } = this.props;
		this.toolBtns = [];
		if (exportCsv) {
			this.toolBtns.unshift({ icon: 'export', text: '导出', handler: exportCsv });
		}
		if (insert) {
			if (insertModal) {
				this.toolBtns.unshift({ icon: 'plus', text: '添加', handler: this.showAddModal, type: 'primary' });
			} else {
				this.toolBtns.unshift({ icon: 'plus', text: '添加', handler: insert, type: 'primary' });
			}
		}
		if (toolBtns) {
			this.toolBtns = this.toolBtns.concat(toolBtns);
		}

		this.filterInline = props.filterInline || props.filterItems.length <= 3;

		const filterItemFiler = props.filterItems.filter((item) => {
			return item.value;
		}).reduce((previousValue, currentValue) => {
			const reduce = previousValue;
			reduce[currentValue.name] = currentValue.value;
			return reduce;
		}, {});

		this.filter = { ...filterItemFiler, ...props.data.filter };
		const { expandedRowRender, getExpandRowData } = this.props;
		if (expandedRowRender) {
			if (getExpandRowData) {
				this.expandedRowRender = (rec) => {
					const expandRowData = getExpandRowData(rec);
					if (typeof expandRowData === 'function') {
						return (
							<ExpandItem
                id={rec.id}
                expandRowData={expandRowData}
                expandedRowRender={expandedRowRender}
							/>
						);
					} else if (expandRowData && typeof expandRowData.then === 'function') {
						return (
							<ExpandItem
                id={rec.id}
                expandRowData={expandRowData}
                expandedRowRender={expandedRowRender}
							/>
						);
					} else {
						return expandedRowRender(rec.id, expandRowData);
					}
				};
			} else {
				this.expandedRowRender = (rec) => {
					return expandedRowRender(rec);
				};
			}
		}
		this.state = {
			select: [],
			expandedRowKeys: [],
			addModalVisible: false,
			editModalVisible: false,
			editRecord: null,
		};
		if (onRowSelectChange) {
			this.rowSelection = {
				selectedRowKeys: this.state.select,
				onChange: (selectedRowKeys) => {
					this.setState({ select: selectedRowKeys });
					this.rowSelection.selectedRowKeys = selectedRowKeys;
					onRowSelectChange(selectedRowKeys);
				},
			};
		}

		this.QueryForm = QueryForm({ onFieldsChange: this.onFieldsChange });
	}

	componentDidMount = () => {
    // this.search();
	}

	onFieldsChange = (searchProps, fields) => {
		for (const name in fields) {
			if ({}.hasOwnProperty.call(fields, name)) {
				this.filter[name] = fields[name].value;
			}
		}
		const { autorefersh } = this.props;
		if (autorefersh) {
			this.search();
		}
	};

	onPageChange = (pageNo) => {
		const { data, refersh } = this.props;
		refersh(data.filter, pageNo, data.pageSize);
	};
	onExpand = (expanded, record) => {
		const { expandedRowRender } = this.props;
		if (expandedRowRender) {
			const { expandedRowKeys } = this.state;
			if (expandedRowKeys.length === 0) {
				this.setState({
					expandedRowKeys: [record.id],
				});
			} else if (this.state.expandedRowKeys[0] === record.id) {
				this.setState({
					expandedRowKeys: [],
				});
			} else {
				this.setState({
					expandedRowKeys: [record.id],
				});
			}
		}
	}
	onUploadSuccess = () => {
		this.hideAddModal();
		this.hideEditModal();
		this.query();
	}
	showAddModal = () => {
		const { onAddStart } = this.props;
		if (onAddStart) {
			onAddStart();
		}
		this.setState({ addModalVisible: true });
	}
	showEditModal = (record) => {
		const { onEditStart } = this.props;
		if (onEditStart) {
			onEditStart(record);
		}
		this.setState({ editModalVisible: true, editRecord: record });
	}
	hideAddModal = () => {
		const { onAddEnd } = this.props;
		if (onAddEnd) {
			onAddEnd();
		}
		this.setState({ addModalVisible: false });
	}
	hideEditModal = () => {
		const { onEditEnd } = this.props;
		if (onEditEnd) {
			onEditEnd();
		}
		this.setState({ editModalVisible: false, editRecord: null });
	}
	rowClick = (rec, index, event) => {
		const { onRowClick } = this.props;
		if (onRowClick) {
			onRowClick(rec, index, event);
		}
		this.onExpand({}, rec);
	}
	reset = () => {
		this.searchForm.resetFields();
		const fieldValues = this.searchForm.getFieldsValue();
		for (const name in fieldValues) {
			if ({}.hasOwnProperty.call(fieldValues, name)) {
				this.filter[name] = fieldValues[name].value;
			}
		}
	};
	insert = (values) => {
		const { insert } = this.props;
		insert(values, { onSuccess: this.hideAddModal });
	};
	edit = (values) => {
		const { edit } = this.props;
		edit(values, { onSuccess: this.hideEditModal });
	};
	query = () => {
		this.search();
	};
	search = (filter) => {
		const { data, refersh } = this.props;
		refersh({ ...this.filter, ...filter }, 1, data.pageSize);
	};
	renderAddModal = () => {
		const { addModalVisible } = this.state;
		const { insertFields, insertModalTitle, addLoading, addFormProp, addProp } = this.props;
		return (
			<Modal
        visible={addModalVisible}
        title={insertModalTitle}
        fields={insertFields}
        onSubmit={this.insert}
        onUploadSuccess={this.onUploadSuccess}
        onCancel={this.hideAddModal}
        confirmLoading={addLoading}
        {...addProp}
        formprops={{ ...addFormProp }}
			/>
		);
	};
	renderEditModal = () => {
		const { editModalVisible, editRecord } = this.state;
		const { editFields, editModalTitle, editLoading, editProp, editFormProp } = this.props;
		const newfields = [];
		for (const field of editFields) {
			if (!field.check || field.check(editRecord || {}, field.name)) {
				newfields.push({ ...field, value: editRecord ? editRecord[field.name] : null });
			}
		}
		return (
			<Modal
        visible={editModalVisible}
        title={editModalTitle}
        fields={newfields}
        onSubmit={this.editHandler}
        onUploadSuccess={this.onUploadSuccess}
        onCancel={this.hideEditModal}
        confirmLoading={editLoading}
        {...editProp}
        formprops={{ ...editFormProp }}
			/>
		);
	};
	renderQueryButton = () => {
		const { showQueryBtn } = this.props;
		if (!showQueryBtn) {
			return null;
		}

		const queryBtn = <Button key="query" type="primary" icon="search" onClick={this.query}>查询</Button>;
		let cleanBtn;
		if (!this.filterInline) {
			cleanBtn = <Button key="reset" onClick={this.reset}>重置</Button>;
		}
		return [queryBtn, cleanBtn];
	}

	renderToolbar = () => {
		const { extra } = this.props;
		return (
			<div>
				{this.renderSearch()}
				<div style={{ display: 'flex' }}>
					{
            this.toolBtns.map((tool) => {
	if (tool.btnType === 'menu') {
		return (<Dropdown overlay={tool.menu} key={tool.text}>
			<Button type={tool.type ? tool.type : 'ghost'}>
				{tool.text} <Icon type="down" />
			</Button>
		</Dropdown>);
	}
	return (<Button
                style={{ marginLeft: 2 }}
                type={tool.type ? tool.type : 'ghost'}
                key={tool.text}
                icon={tool.icon}
                onClick={tool.handler}
	>
		{tool.text}
	</Button>);
})
          }
					{extra}
					<div style={{ marginRight: 'auto' }} />
					{this.renderSmallSearch()}
					{this.renderQueryButton()}
				</div>
			</div>
		);
	};
	renderSmallSearch = () => {
		const { filterItems, formprop } = this.props;
		if (!this.filterInline || filterItems.length === 0) {
			return null;
		}

		return (
			<this.QueryForm
        ref={(form) => {
	this.searchForm = form;
}}
        fields={filterItems}
        inline
        card={false}
        canelBtn={false}
        okText="查询"
        onSubmit={this.search}
        {...formprop}
			/>
		);
	}
	renderSearch = () => {
		const { filterItems, formprop } = this.props;
		if (this.filterInline || filterItems.length === 0) {
			return null;
		}
		return (
			<this.QueryForm
        card={false}
        canelBtn={false}
        okText="查询"
        ref={(form) => {
	this.searchForm = form;
}}
        fields={filterItems}
        onSubmit={this.search}
        {...formprop}
			/>
		);
	}
	renderPage = () => {
		const { page, data, pagination } = this.props;
		if (!page) {
			return false;
		}
		const { pageNo = 1, pageSize = 10, total = 0 } = data;
		return {
			current: pageNo,
			total,
			pageSize,
			simple: !!pagination,
			onChange: this.onPageChange,
			showTotal: () => {
				const start = ((pageNo - 1) * pageSize) + 1;
				const end = pageNo * pageSize > total ? total : pageNo * pageSize;
				return `显示${start}-${end}条,共${total}条`;
			},
		};
	}
	renderTable = () => {
		const { data, loading, disableToolbar, ...other } = this.props;
		const { expandedRowKeys } = this.state;

		return (
			<Table
        rowKey="id"
        {...other}
        columns={this.columns}
        dataSource={data.list}
        loading={loading}
        bordered
        onRowClick={this.rowClick}
        onExpand={this.onExpand}
        rowSelection={this.rowSelection}
        title={!disableToolbar ? this.renderToolbar : null}
        pagination={this.renderPage()}
        expandedRowRender={this.expandedRowRender}
        expandedRowKeys={expandedRowKeys}
			/>
		);
	}
	render = () => {
		const { insertModal, editModal } = this.props;
		if (!insertModal && !editModal) {
			return this.renderTable();
		}
		return (
			<div>
				{this.renderAddModal()}
				{this.renderEditModal()}
				{this.renderTable()}
			</div>
		);
	}
}
