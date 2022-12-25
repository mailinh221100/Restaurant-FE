import { useModel } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Modal } from 'antd';
import { useEffect, useRef } from 'react';
import { CheckCircleOutlined, ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { useAccess } from 'umi';
import CreateReservationForm from '@/pages/reservation/components/CreateReservationForm';
import { showDetailInfo } from '@/pages/reservation/components/DetailReservationForm';
import moment from 'moment';

const Reservation = () => {
  const access = useAccess();
  const actionRef = useRef<ActionType>();
  const {
    loading,
    listReservations,
    getListReservations,
    loadingCreate,
    setCreateModalVisible,
    createModalVisible,
    createReservation,
    updateStatusReservation,
  } = useModel('reservation', (returnValue) => ({
    loading: returnValue.loading,
    listReservations: returnValue.listReservations,
    getListReservations: returnValue.getListReservations,
    loadingCreate: returnValue.loadingCreate,
    setCreateModalVisible: returnValue.setCreateModalVisible,
    createModalVisible: returnValue.createModalVisible,
    createReservation: returnValue.createReservation,
    updateStatusReservation: returnValue.updateStatusReservation,
  }));

  useEffect(() => {
    (async () => {
      await getListReservations({});
    })();
  }, []);

  const content = (
    <>
      <p>Reserve your table...</p>
    </>
  );

  const submitCreateForm = async (values: any) => {
    const date = moment(values.date);
    values.date = date.startOf('day').utc(true).toISOString();
    await createReservation(values);
  };

  const acceptReservation = (id: string) => {
    Modal.confirm({
      title: 'Accept this reservation',
      icon: <CheckCircleOutlined />,
      content: 'Do you want to accept this reservation?',
      okText: 'Accept',
      cancelText: 'Cancel',
      onOk() {
        (async () => {
          await updateStatusReservation(id, 'accept');
        })();
      },
    });
  };

  const completeReservation = (id: string) => {
    Modal.confirm({
      title: 'Complete this reservation',
      icon: <CheckCircleOutlined />,
      content: 'Do you want to complete this reservation?',
      okText: 'Complete',
      cancelText: 'Cancel',
      onOk() {
        (async () => {
          await updateStatusReservation(id, 'complete');
        })();
      },
    });
  };

  const rejectReservation = (id: string) => {
    Modal.confirm({
      title: 'Reject this reservation',
      icon: <ExclamationCircleOutlined />,
      content: 'Do you want to reject this reservation?',
      okText: 'Reject',
      cancelText: 'Cancel',
      onOk() {
        (async () => {
          await updateStatusReservation(id, 'reject');
        })();
      },
    });
  };

  const cancelReservation = (id: string) => {
    Modal.confirm({
      title: 'Cancel this reservation',
      icon: <ExclamationCircleOutlined />,
      content: 'Do you want to cancel this reservation?',
      okText: 'Cancel reservation',
      cancelText: 'Cancel',
      onOk() {
        (async () => {
          await updateStatusReservation(id, 'cancel');
        })();
      },
    });
  };

  const columns: ProColumns<any>[] = [
    {
      title: 'Customer',
      dataIndex: 'customer',
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
      title: 'Date',
      dataIndex: 'date',
      valueType: 'date',
    },
    {
      title: 'Number of guests',
      dataIndex: 'guestCount',
      search: false,
      renderText: (val: string) => `${val} guest(s)`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
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
                onClick={() => acceptReservation(record._id)}
                disabled={record.status !== 'Pending'}
              >
                Accept
              </Button>,
              <Button
                type="link"
                onClick={() => completeReservation(record._id)}
                disabled={record.status !== 'Accepted'}
              >
                Complete
              </Button>,
              <Button
                type="link"
                danger
                onClick={() => rejectReservation(record._id)}
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
                onClick={() => cancelReservation(record._id)}
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
    if (values.date) {
      const queryDate = moment(values.date, 'YYYY-MM-DD');
      query.startDate = queryDate.startOf('day').utc(true).toISOString();
      query.endDate = queryDate.endOf('day').utc(true).toISOString();
    }
    await getListReservations(query);
  };

  return (
    <PageContainer content={content}>
      <ProTable<any, any>
        headerTitle="Reservation"
        actionRef={actionRef}
        rowKey="key"
        loading={loading}
        toolBarRender={() =>
          access.isUser
            ? [
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setCreateModalVisible(true)}
                >
                  Reserve your dining table
                </Button>,
              ]
            : []
        }
        dataSource={listReservations || []}
        columns={columns}
        onSubmit={handleSubmitSearch}
      />
      <CreateReservationForm
        open={createModalVisible}
        onCreate={(values: any) => submitCreateForm(values)}
        onCancel={() => setCreateModalVisible(false)}
        loading={loadingCreate}
      />
    </PageContainer>
  );
};

export default Reservation;
