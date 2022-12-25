import { Descriptions, Modal, Typography } from 'antd';
const { Text } = Typography;
import moment from 'moment';
import { ProColumns, ProTable } from '@ant-design/pro-table';

const renderStatusText = (status: string) => {
  if (status == 'Accepted' || status == 'Completed') {
    return <Text type="success">{status}</Text>;
  } else if (status == 'Rejected' || status == 'Cancelled') {
    return <Text type="danger">{status}</Text>;
  }
  return <Text>{status}</Text>;
};

const columns: ProColumns<any>[] = [
  {
    title: 'Item Name',
    dataIndex: 'item',
    renderText: (val: any) => val.itemName,
  },
  {
    title: 'Item Price',
    dataIndex: 'item',
    renderText: (val: any) => `${val.itemPrice} đ`,
  },
  {
    title: 'Quantity',
    dataIndex: 'quantity',
    valueType: 'text',
  },
  {
    title: 'Sum',
    dataIndex: 'quantity',
    render: (_, record: any) => `${record?.item?.itemPrice * record?.quantity} đ`,
  },
];

const DetailOrderForm = ({ open, onCancel, loading, order, listOrderDetails }: any) => {
  return (
    <Modal
      open={open}
      width={800}
      title="Order Detail"
      cancelText="Close"
      onCancel={onCancel}
      okButtonProps={{ style: { display: 'none' } }}
      confirmLoading={loading}
    >
      <Descriptions>
        <Descriptions.Item label="Customer Name">{order?.user?.fullName}</Descriptions.Item>
        <Descriptions.Item label="Customer Email">{order?.user?.email}</Descriptions.Item>
        <Descriptions.Item label="Telephone">{order?.phoneNumber}</Descriptions.Item>
        <Descriptions.Item label="Date">
          {moment(order?.createdAt).utc(true).format('YYYY-MM-DD HH:mm')}
        </Descriptions.Item>
        <Descriptions.Item label="Address">{order?.address}</Descriptions.Item>
        <Descriptions.Item label="Total Amount">{`${order?.totalAmount} đ`}</Descriptions.Item>
        <Descriptions.Item label="Status">{renderStatusText(order?.status)}</Descriptions.Item>
        <Descriptions.Item label="Note">{order?.note}</Descriptions.Item>
      </Descriptions>
      <ProTable<any, any>
        headerTitle="Items"
        rowKey="key"
        search={false}
        pagination={false}
        dataSource={listOrderDetails}
        columns={columns}
      />
    </Modal>
  );
};

export default DetailOrderForm;
