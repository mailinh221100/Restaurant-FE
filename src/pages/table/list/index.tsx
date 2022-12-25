import { useModel } from 'umi';
import { PageContainer, GridContent } from '@ant-design/pro-layout';
import { Button, Card, Row, Col, Typography, Space, List } from 'antd';
import { useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import CreateZoneForm from '@/pages/table/list/components/CreateZoneForm';
import { history } from 'umi';
const { Title, Text } = Typography;

const Table = () => {
  const {
    loading,
    listZones,
    getListZones,
    createModalVisible,
    setCreateModalVisible,
    createZone,
    loadingCreate,
    deleteZone,
  } = useModel('table', (returnValue) => ({
    loading: returnValue.loading,
    listZones: returnValue.listZones,
    getListZones: returnValue.getListZones,
    createModalVisible: returnValue.createModalVisible,
    setCreateModalVisible: returnValue.setCreateModalVisible,
    createZone: returnValue.createZone,
    loadingCreate: returnValue.loadingCreate,
    deleteZone: returnValue.deleteZone,
  }));

  const numberZones = listZones.length;
  const numberTables = listZones.reduce(
    (acc: number, curr: any) => acc + curr.diningTables.length,
    0,
  );

  useEffect(() => {
    (async () => {
      await getListZones();
    })();
  }, []);

  const content = (
    <>
      <p>Set up your zones, dining table...</p>
      <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateModalVisible(true)}>
        Add a zone
      </Button>
    </>
  );

  const submitCreateForm = async (values: any) => {
    await createZone(values);
  };

  const handleDelete = async (id: string) => {
    await deleteZone(id);
  };

  return (
    <PageContainer content={content}>
      <GridContent>
        <Row gutter={24}>
          <Col md={8} sm={24}>
            <Title level={5}>Zone list</Title>
            <Space direction="vertical">
              <Text>Allows setting, editing zones, tables in the restaurant</Text>
              <Text>
                Total: {numberTables} table(s) / {numberZones} zone(s)
              </Text>
            </Space>
          </Col>
          <Col md={16} sm={24}>
            <Card bordered={false} loading={loading}>
              <List
                header={<strong>All zones</strong>}
                bordered
                dataSource={listZones.map((element: any, index: number) => ({ ...element, index }))}
                renderItem={(item: any) => (
                  <List.Item
                    actions={[
                      <Button type="link" onClick={() => history.push('/table/detail/' + item._id)}>
                        Detail
                      </Button>,
                      <Button type="link" danger onClick={() => handleDelete(item._id)}>
                        Delete
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta title={item.index + 1} description={item.zoneName} />
                    <div>{item.diningTables.length} table(s)</div>
                  </List.Item>
                )}
              />
              <CreateZoneForm
                open={createModalVisible}
                onCreate={(values: any) => submitCreateForm(values)}
                onCancel={() => setCreateModalVisible(false)}
                loading={loadingCreate}
              />
            </Card>
          </Col>
        </Row>
      </GridContent>
    </PageContainer>
  );
};

export default Table;
