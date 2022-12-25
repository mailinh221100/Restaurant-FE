import { Col, Descriptions, Form, InputNumber, Modal, Row, Image } from 'antd';

const AddToCartForm = ({ open, onCreate, onCancel, menuItem }: any) => {
  const [form] = Form.useForm();

  return (
    <Modal
      open={open}
      title="Add to cart"
      okText="Add"
      cancelText="Cancel"
      onCancel={onCancel}
      width={800}
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
    >
      <Row>
        <Col span={8}>
          <Image width={200} src={menuItem.imageUrl} />
        </Col>
        <Col span={16}>
          <Descriptions title="Item Info" column={2}>
            <Descriptions.Item label="Item Name">{menuItem.itemName}</Descriptions.Item>
            <Descriptions.Item label="Category">
              {menuItem?.category?.categoryName}
            </Descriptions.Item>
            <Descriptions.Item label="Unit">{menuItem.unit}</Descriptions.Item>
            <Descriptions.Item label="Item Price">{`${menuItem.itemPrice} đ`}</Descriptions.Item>
            <Descriptions.Item label="Item Description">
              {menuItem.itemDescription}
            </Descriptions.Item>
          </Descriptions>
          <Form form={form} name="form_in_modal" initialValues={{ quantity: 1 }}>
            <Form.Item
              name="quantity"
              label="Quantity"
              rules={[{ required: true, message: 'Please input quantity!' }]}
            >
              <InputNumber min={1} />
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Modal>
  );
};

export default AddToCartForm;
