import { useModel } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Typography } from 'antd';
import { useEffect, useRef } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { useParams } from 'umi';
import CreateTableForm from '@/pages/table/detail/components/CreateTableForm';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-table';
const { Title } = Typography;

const Table = () => {
  const actionRef = useRef<ActionType>();
  const {
    loading,
    zone,
    getZoneById,
    loadingCreate,
    createModalVisible,
    setCreateModalVisible,
    createTable,
    deleteTable,
  } = useModel('table', (returnValue) => ({
    loading: returnValue.loading,
    zone: returnValue.zone,
    getZoneById: returnValue.getZoneById,
    loadingCreate: returnValue.loadingCreate,
    createModalVisible: returnValue.createModalVisible,
    setCreateModalVisible: returnValue.setCreateModalVisible,
    createTable: returnValue.createTable,
    deleteTable: returnValue.deleteTable,
  }));

  const params: any = useParams();
  const zoneId = params.zoneId;

  useEffect(() => {
    (async () => {
      await getZoneById(zoneId);
    })();
  }, []);

  const content = (
    <>
      <Title level={5}>{zone.zoneName}</Title>
      <p>Set up your dining tables in this zone...</p>
    </>
  );

  const submitCreateForm = async (values: any) => {
    await createTable({
      ...values,
      zone: zoneId,
    });
  };

  const handleDelete = async (id: string, zoneIdParams: string) => {
    await deleteTable(id, zoneIdParams);
  };

  const columns: ProColumns<any>[] = [
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
    {
      title: 'Action',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record: any) => [
        <Button type="link" danger onClick={() => handleDelete(record._id, zoneId)}>
          Delete
        </Button>,
      ],
    },
  ];
  return (
    <PageContainer content={content}>
      <ProTable<any, any>
        headerTitle="Dining Tables"
        actionRef={actionRef}
        rowKey="key"
        loading={loading}
        search={false}
        toolBarRender={() => [
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateModalVisible(true)}
          >
            Add a dining table
          </Button>,
        ]}
        dataSource={zone.diningTables || []}
        columns={columns}
      />
      <CreateTableForm
        open={createModalVisible}
        onCreate={(values: any) => submitCreateForm(values)}
        onCancel={() => setCreateModalVisible(false)}
        loading={loadingCreate}
      />
    </PageContainer>
  );
};

export default Table;
