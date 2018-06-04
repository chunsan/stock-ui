import React from 'react';
import PropTypes from 'prop-types';
import { message } from 'antd';
import { Form } from 'wsgcomponents';

export default class ImportModal extends React.Component {
	static propTypes = {
		onClose: PropTypes.func.isRequired,
		visible: PropTypes.bool.isRequired,
	};
	constructor(props) {
		super(props);
		this.fields = [{
			text: '选择文件',
			name: 'file',
			type: 'upload',
			url: '/user/import',
			onSuccess: (rsp) => {
				const { onSuccess } = this.props;
				if (rsp.success) {
					message.info('导入成功');
					onSuccess();
				} else {
					message.error(rsp.message);
				}
			},
			onError: (error) => {
				message.error(`导入失败${error.message}`);
			},
		}];
	}
	download = () => {
		window.location = '/用户导入模板.xls';
	};
	upload = () => {
		message.warn('请选择用户文件进行导入');
	};
	render = () => {
		const { visible, onClose, loading } = this.props;
		return (
			<Form.Modal
        title="用户导入"
        visible={visible}
        fields={this.fields}
        confirmLoading={loading}
        onCancel={onClose}
        onSubmit={this.upload}
        formprops={{
	okText: '下载导入模板',
	okBtn: true,
	inline: true,
	onSubmit: this.download,
}}
			/>
		);
	};
}
