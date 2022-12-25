import { Button, Col, Form, Input, InputNumber, Modal, Row, Select, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const CreateMenuItemForm = ({ open, onCreate, onCancel, loading, listCategories }: any) => {
  const [form] = Form.useForm();

  return (
    <Modal
      open={open}
      title="Add a menu item"
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
      <Form form={form} layout="vertical" name="form_in_modal" initialValues={{ itemPrice: 1000 }}>
        <Row gutter={12}>
          <Col span={24}>
            <Form.Item
              name="itemName"
              label="Item Name"
              rules={[{ required: true, message: 'Please input your item name!' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="itemPrice"
              label="Item Price"
              rules={[{ required: true, message: 'Please input your item price!' }]}
            >
              <InputNumber min={1000} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="unit" label="Unit">
              <Select placeholder="Select unit">
                <Select.Option value="Unknown">Unknown</Select.Option>
                <Select.Option value="Cup">Cup</Select.Option>
                <Select.Option value="Plate">Plate</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: 'Please input your item status!' }]}
            >
              <Select placeholder="Select status">
                <Select.Option value="Active">Active</Select.Option>
                <Select.Option value="Inactive">Inactive</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="category"
              label="Category"
              rules={[{ required: true, message: 'Please input your item category!' }]}
            >
              <Select placeholder="Select category">
                {listCategories.map((item: any) => (
                  <Select.Option value={item._id}>{item.categoryName}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Form.Item
            name="upload"
            label="Upload Image"
            rules={[{ required: true, message: 'Please upload image!' }]}
          >
            <Upload name="logo" listType="picture" beforeUpload={() => false} accept="image/*">
              <Button icon={<UploadOutlined />}>Click to upload</Button>
            </Upload>
          </Form.Item>
          <Col span={24}>
            <Form.Item
              name="itemDescription"
              label="Item Description"
              rules={[{ required: true, message: 'Please input your item description!' }]}
            >
              <Input.TextArea rows={2} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default CreateMenuItemForm;
