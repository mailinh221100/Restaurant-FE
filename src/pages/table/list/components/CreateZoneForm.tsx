import { Form, Input, Modal } from 'antd';

const CreateZoneForm = ({ open, onCreate, onCancel, loading }: any) => {
  const [form] = Form.useForm();

  return (
    <Modal
      open={open}
      title="Add a zone"
      okText="Save"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            onCreate(values);
          })
          .catch((info) => {
            console.log('Validate Failed:', info);
          });
      }}
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical" name="form_in_modal">
        <Form.Item
          name="zoneName"
          label="Zone Name"
          rules={[{ required: true, message: 'Please input your zone name!' }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateZoneForm;
