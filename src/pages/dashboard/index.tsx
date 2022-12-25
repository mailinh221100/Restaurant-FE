import { PageContainer } from '@ant-design/pro-layout';
import { Card, Col, Row, Statistic } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import {
  ClusterOutlined,
  CalendarOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import Donut from '@/pages/dashboard/components/Donut';

const Dashboard = () => {
  const { loading, details, getDetails } = useModel('dashboard', (returnValue) => ({
    loading: returnValue.loading,
    details: returnValue.details,
    getDetails: returnValue.getDetails,
  }));

  const orderStatusData =
    details && details.orderStatus && details.orderStatus.length > 0
      ? details.orderStatus.map((item: any) => ({
          item: item?._id?.status,
          count: item.count,
        }))
      : [];

  const reservationStatusData =
    details && details.reservationStatus && details.reservationStatus.length > 0
      ? details.reservationStatus.map((item: any) => ({
          item: item?._id?.status,
          count: item.count,
        }))
      : [];

  useEffect(() => {
    (async () => {
      await getDetails();
    })();
  }, []);

  return (
    <PageContainer>
      <Row gutter={24} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Category"
              value={details.category}
              prefix={<ClusterOutlined />}
              suffix="categories"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Menu Item"
              value={details.menuItem}
              prefix={<AppstoreOutlined />}
              suffix="items"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Order"
              value={details.order}
              prefix={<UnorderedListOutlined />}
              suffix="orders"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Reservation"
              value={details.reservation}
              prefix={<CalendarOutlined />}
              suffix="reservations"
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={12}>
          <Card bordered={false} loading={loading} title="Order by status">
            <Donut data={orderStatusData} />
          </Card>
        </Col>
        <Col span={12}>
          <Card bordered={false} loading={loading} title="Reservation by status">
            <Donut data={reservationStatusData} />
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default Dashboard;
