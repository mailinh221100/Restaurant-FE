import { useModel } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Modal } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { useAccess } from 'umi';
import DetailOrderForm from '@/pages/order-history/components/DetailOrderForm';
import moment from 'moment';

const OrderHistory = () => {
  const access = useAccess();
  const actionRef = useRef<ActionType>();
  const {
    loading,
    getListOrders,
    listOrders,
    getListOrderDetails,
    loadingOrderDetail,
    listOrderDetails,
    updateStatusOrder,
  } = useModel('menu', (returnValue) => ({
    loading: returnValue.loading,
    getListOrders: returnValue.getListOrders,
    listOrders: returnValue.listOrders,
    getListOrderDetails: returnValue.getListOrderDetails,
    loadingOrderDetail: returnValue.loadingOrderDetail,
    listOrderDetails: returnValue.listOrderDetails,
    updateStatusOrder: returnValue.updateStatusOrder,
  }));

  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState({});

  useEffect(() => {
    (async () => {
      await getListOrders({});
    })();
  }, []);

  const content = (
    <>
      <p>Your order history...</p>
    </>
  );

  const acceptOrder = (id: string) => {
    Modal.confirm({
      title: 'Accept this order',
      icon: <CheckCircleOutlined />,
      content: 'Do you want to accept this order?',
      okText: 'Accept',
      cancelText: 'Cancel',
      onOk() {
        (async () => {
          console.log(id);
          await updateStatusOrder(id, 'accept');
        })();
      },
    });
  };

  const completeOrder = (id: string) => {
    Modal.confirm({
      title: 'Complete this order',
      icon: <CheckCircleOutlined />,
      content: 'Do you want to complete this order?',
      okText: 'Complete',
      cancelText: 'Cancel',
      onOk() {
        (async () => {
          console.log(id);
          await updateStatusOrder(id, 'complete');
        })();
      },
    });
  };

  const rejectOrder = (id: string) => {
    Modal.confirm({
      title: 'Reject this order',
      icon: <ExclamationCircleOutlined />,
      content: 'Do you want to reject this order?',
      okText: 'Reject',
      cancelText: 'Cancel',
      onOk() {
        (async () => {
          console.log(id);
          await updateStatusOrder(id, 'reject');
        })();
      },
    });
  };

  const cancelOrder = (id: string) => {
    Modal.confirm({
      title: 'Cancel this order',
      icon: <ExclamationCircleOutlined />,
      content: 'Do you want to cancel this order?',
      okText: 'Cancel order',
      cancelText: 'Cancel',
      onOk() {
        (async () => {
          console.log(id);
          await updateStatusOrder(id, 'cancel');
        })();
      },
    });
  };

  const showDetailInfo = async (order: any) => {
    setSelectedOrder(order);
    setDetailModalVisible(true);
    await getListOrderDetails(order._id);
  };

  const columns: ProColumns<any>[] = [
    {
      title: 'Customer',
      dataIndex: 'user',
      search: false,
      renderText: (val: any) => val.fullName,
    },
    {
      title: 'Customer Phone',
      dataIndex: 'phoneNumber',
      search: false,
      valueType: 'text',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      search: false,
      valueType: 'text',
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalAmount',
      search: false,
      renderText: (val: any) => `${val} đ`,
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      valueType: 'date',
      render: (_, record: any) => moment(record.createdAt).utc(true).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      hideInForm: true,
      valueEnum: {
        Pending: {
          text: 'Pending',
          status: 'Default',
        },
        Accepted: {
          text: 'Accepted',
          status: 'Success',
        },
        Completed: {
          text: 'Completed',
          status: 'Success',
        },
        Rejected: {
          text: 'Rejected',
          status: 'Error',
        },
        Cancelled: {
          text: 'Cancelled',
          status: 'Error',
        },
      },
    },
    {
      title: 'Action',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record: any) =>
        access.isAdmin
          ? [
              <Button type="link" onClick={() => showDetailInfo(record)}>
                Detail
              </Button>,
              <Button
                type="link"
                onClick={() => acceptOrder(record._id)}
                disabled={record.status !== 'Pending'}
              >
                Accept
              </Button>,
              <Button
                type="link"
                onClick={() => completeOrder(record._id)}
                disabled={record.status !== 'Accepted'}
              >
                Complete
              </Button>,
              <Button
                type="link"
                danger
                onClick={() => rejectOrder(record._id)}
                disabled={!(record.status === 'Pending' || record.status === 'Accepted')}
              >
                Reject
              </Button>,
            ]
          : [
              <Button type="link" onClick={() => showDetailInfo(record)}>
                Detail
              </Button>,
              <Button
                type="link"
                danger
                onClick={() => cancelOrder(record._id)}
                disabled={record.status !== 'Pending'}
              >
                Cancel
              </Button>,
            ],
    },
  ];

  const handleSubmitSearch = async (values: any) => {
    const query: any = {};
    if (values.status) {
      query.status = values.status;
    }
    if (values.createdAt) {
      query.startDate = moment(values.createdAt, 'YYYY-MM-DD')
        .startOf('day')
        .utc(false)
        .toISOString();
      query.endDate = moment(values.createdAt, 'YYYY-MM-DD').endOf('day').utc(false).toISOString();
    }
    await getListOrders(query);
  };

  return (
    <PageContainer content={content}>
      <ProTable<any, any>
        headerTitle="Order History"
        actionRef={actionRef}
        rowKey="key"
        loading={loading}
        dataSource={listOrders || []}
        columns={columns}
        onSubmit={handleSubmitSearch}
      />
      <DetailOrderForm
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        loading={loadingOrderDetail}
        order={selectedOrder}
        listOrderDetails={listOrderDetails}
      />
    </PageContainer>
  );
};

export default OrderHistory;
