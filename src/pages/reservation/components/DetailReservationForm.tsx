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
    title: 'Zone',
    dataIndex: 'zone',
    renderText: (val: any) => val.zoneName,
  },
  {
    title: 'Table Name',
    dataIndex: 'tableName',
    valueType: 'text',
  },
  {
    title: 'Chair Count',
    dataIndex: 'chairCount',
    valueEnum: {
      Small: {
        text: 'Small (2 seats)',
        status: 'Default',
      },
      Medium: {
        text: 'Medium (4 seats)',
        status: 'Success',
      },
      Big: {
        text: 'Big (10 seats)',
        status: 'Error',
      },
    },
  },
  {
    title: 'Table Type',
    dataIndex: 'tableType',
    valueType: 'text',
  },
];

export const showDetailInfo = (reservation: any) => {
  Modal.info({
    width: 800,
    title: 'Reservation detail',
    content: (
      <>
        <Descriptions>
          <Descriptions.Item label="Customer Name">
            {reservation?.customer?.fullName}
          </Descriptions.Item>
          <Descriptions.Item label="Customer Email">
            {reservation?.customer?.email}
          </Descriptions.Item>
          <Descriptions.Item label="Telephone">{reservation?.phoneNumber}</Descriptions.Item>
          <Descriptions.Item label="Date">
            {moment(reservation?.date).format('DD/MM/YYYY')}
          </Descriptions.Item>
          <Descriptions.Item label="Number of guests">{reservation?.guestCount}</Descriptions.Item>
          <Descriptions.Item label="Status">
            {renderStatusText(reservation?.status)}
          </Descriptions.Item>
          <Descriptions.Item label="Note">{reservation?.note}</Descriptions.Item>
        </Descriptions>
        <ProTable<any, any>
          headerTitle="Reservation"
          rowKey="key"
          search={false}
          pagination={false}
          dataSource={reservation.diningTables || []}
          columns={columns}
        />
      </>
    ),
    onOk() {},
  });
};
