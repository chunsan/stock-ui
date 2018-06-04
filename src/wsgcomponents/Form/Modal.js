import React from 'react';
import { Modal, Form } from 'antd';
import { RawForm } from './index';
import { RawFieldSet } from './FieldSet';


class MyModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = { reset: false };
	}
  /*
  componentWillReceiveProps(nextProps) {
    if (this.props.visible && !nextProps.visible) {
      this.props.form.resetFields();
    }
  }
  */
	afterClose = () => {
		this.setState({ reset: true });
	};
	handleOk = () => {
		const { form, onSubmit, formprops } = this.props;
		if (formprops && formprops.loading) {
			return;
		}
		form.validateFields({ force: true }, (errors) => {
			if (errors) {
				return;
			}
			const data = {
				...form.getFieldsValue(),
			};
			for (const field in data) {
				if (data[field] && typeof data[field].value === 'function') {
					return data[field].value();
				}
			}
			onSubmit(data);
		});
	};
	renderForm = (form, fields) => {
		const { formprops, onUploadSuccess, onUploadError } = this.props;
		const test = fields.find(item => item.legend !== undefined);
		if (test) {
			return (
				<RawFieldSet
          form={form}
          fieldset={fields}
          canelBtn={false}
          onUploadSuccess={onUploadSuccess}
          onUploadError={onUploadError}
          okBtn={false}
          card={false}
          {...formprops}
				/>
			);
		} else {
			return (
				<RawForm
          form={form}
          fields={fields}
          onUploadSuccess={onUploadSuccess}
          onUploadError={onUploadError}
          canelBtn={false}
          okBtn={false}
          card={false}
          {...formprops}
				/>
			);
		}
	};
	render = () => {
		const { reset } = this.state;
		if (reset) {
			this.state.reset = false;
			return null;
		}
		const { form, fields, ...other } = this.props;
		return (
			<Modal
        onOk={this.handleOk}
        afterClose={this.afterClose}
        {...other}
			>
				{this.renderForm(form, fields)}
			</Modal>
		);
	};
}
export default Form.create()(MyModal);
