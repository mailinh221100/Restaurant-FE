import { Form, Input, Modal, Select } from 'antd';

const CreateTableForm = ({ open, onCreate, onCancel, loading }: any) => {
  const [form] = Form.useForm();

  return (
    <Modal
      open={open}
      title="Add a dining table"
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
          name="tableName"
          label="Table Name"
          rules={[{ required: true, message: 'Please input your table name!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="chairCount"
          label="Chair Count"
          rules={[{ required: true, message: 'Please choose your chair count!' }]}
        >
          <Select>
            <Select.Option value="Small">Small (2 seats)</Select.Option>
            <Select.Option value="Medium">Medium (4 seats)</Select.Option>
            <Select.Option value="Big">Big (10 seats)</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="tableType"
          label="Table Type"
          rules={[{ required: true, message: 'Please choose your table type!' }]}
        >
          <Select>
            <Select.Option value="Square">Square</Select.Option>
            <Select.Option value="Round">Round</Select.Option>
            <Select.Option value="Rectangle">Rectangle</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateTableForm;
