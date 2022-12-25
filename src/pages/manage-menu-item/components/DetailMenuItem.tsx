import { Col, Descriptions, Modal, Row, Image } from 'antd';

const DetailMenuItem = ({ open, onCancel, menuItem }: any) => {
  return (
    <Modal
      open={open}
      title="Detail Menu Item"
      cancelText="Close"
      okButtonProps={{ style: { display: 'none' } }}
      onCancel={onCancel}
      width={800}
      onOk={() => {}}
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
        </Col>
      </Row>
    </Modal>
  );
};

export default DetailMenuItem;
