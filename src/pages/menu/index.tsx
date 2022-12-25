// @ts-ignore
import { useModel } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { Avatar, Button, Card, Col, Form, Input, List, message, Row, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { ShoppingCartOutlined } from '@ant-design/icons';
import styles from '@/pages/menu/style.less';
import AddToCartForm from '@/pages/menu/components/AddToCartForm';
const { Paragraph } = Typography;
const { TextArea } = Input;
const { Search } = Input;

const Menu = () => {
  const [form] = Form.useForm();
  const { loading, listMenuItems, getListMenuItems, createOrder, loadingCreate } = useModel(
    'menu',
    (returnValue: any) => ({
      loading: returnValue.loading,
      listMenuItems: returnValue.listMenuItems,
      getListMenuItems: returnValue.getListMenuItems,
      createOrder: returnValue.createOrder,
      loadingCreate: returnValue.loadingCreate,
    }),
  );

  const [addCartModalVisible, setAddCartModalVisible] = useState(false);
  const [listSelected, setListSelected] = useState<any[]>([]);
  const [selectedMenuItem, setSelectedMenuItem] = useState<any>({});

  useEffect(() => {
    (async () => {
      await getListMenuItems('');
    })();
  }, []);

  const handleSearch = async (value: string) => {
    await getListMenuItems(value);
  };

  const content = (
    <>
      <p>Choose food and drink...</p>
      <Row>
        <Col span={6}>
          <Search placeholder="input search text" onSearch={handleSearch} enterButton />
        </Col>
      </Row>
    </>
  );

  const showAddToCart = (item: any) => {
    setSelectedMenuItem(item);
    setAddCartModalVisible(true);
  };

  const handleAddToCart = (values: any) => {
    const existedItem = listSelected.find((x) => x._id === selectedMenuItem._id);
    if (existedItem) {
      const updateList = listSelected.map((item) => {
        if (item._id === selectedMenuItem._id) {
          return {
            ...item,
            quantity: item.quantity + values.quantity,
          };
        }
        return item;
      });
      setListSelected(updateList);
    } else {
      setListSelected([...listSelected, { ...selectedMenuItem, quantity: values.quantity }]);
    }
    setAddCartModalVisible(false);
  };

  const removeItemFromCart = (id: string) => {
    const updateList = listSelected.filter((item) => item._id !== id);
    setListSelected(updateList);
  };

  const handleOrderNow = async (values: any) => {
    if (listSelected.length === 0) {
      message.error('Please choose item!');
      return;
    }
    const orderDetails = listSelected.map((menuItem) => ({
      item: menuItem._id,
      quantity: menuItem.quantity,
    }));

    const data = {
      ...values,
      orderDetails,
    };
    await createOrder(data);
  };

  const total = listSelected.reduce(
    (acc: number, curr: any) => acc + curr.quantity * curr.itemPrice,
    0,
  );

  return (
    <PageContainer content={content}>
      <Row>
        <Col span={16}>
          <List<any>
            rowKey="id"
            loading={loading}
            grid={{
              gutter: 16,
              xs: 1,
              sm: 2,
              md: 3,
              lg: 3,
              xl: 3,
              xxl: 3,
            }}
            dataSource={listMenuItems}
            renderItem={(item) => (
              <List.Item>
                <Card
                  onClick={() => showAddToCart(item)}
                  className={styles.card}
                  hoverable
                  cover={
                    <img
                      alt={item.itemName}
                      src={item.imageUrl}
                      style={{ height: 180, objectFit: 'cover' }}
                    />
                  }
                >
                  <Card.Meta
                    title={<a>{item.itemName}</a>}
                    description={
                      <Paragraph className={styles.item} ellipsis={{ rows: 2 }}>
                        {item.itemDescription}
                      </Paragraph>
                    }
                  />
                  <div className={styles.cardItemContent}>
                    <strong>{`${item.itemPrice} đ`}</strong>
                  </div>
                </Card>
              </List.Item>
            )}
          />
        </Col>

        <Col span={8} style={{ paddingLeft: 16 }}>
          <Card bordered={false}>
            <List
              header={<strong>Selected items</strong>}
              bordered
              dataSource={listSelected}
              renderItem={(item: any) => (
                <List.Item
                  actions={[
                    <Button type="link" danger onClick={() => removeItemFromCart(item._id)}>
                      Delete
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar src={item.imageUrl} />}
                    title={item.itemName}
                    description={`${item.quantity} items x ${item.itemPrice}`}
                  />
                </List.Item>
              )}
            />
            <Form
              form={form}
              name="basic"
              onFinish={(values: any) => handleOrderNow(values)}
              autoComplete="off"
              layout="vertical"
            >
              <Form.Item
                label="Phone Number"
                name="phoneNumber"
                rules={[
                  { required: true, message: 'Please input phone number!' },
                  { pattern: /^0\d{9}$/, message: 'Please input correct phone number!' },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Address"
                name="address"
                rules={[{ required: true, message: 'Please input your address!' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item label="Note" name="note">
                <TextArea rows={2} />
              </Form.Item>
              <strong>Total: {total} đ</strong>
              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<ShoppingCartOutlined />}
                  loading={loadingCreate}
                >
                  Order now
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
      <AddToCartForm
        open={addCartModalVisible}
        onCreate={(values: any) => handleAddToCart(values)}
        onCancel={() => setAddCartModalVisible(false)}
        menuItem={selectedMenuItem}
      />
    </PageContainer>
  );
};

export default Menu;
