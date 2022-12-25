import { useModel } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, message, Modal } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import DetailMenuItem from '@/pages/manage-menu-item/components/DetailMenuItem';
import CreateMenuItemForm from '@/pages/manage-menu-item/components/CreateMenuItemForm';

const Reservation = () => {
  const actionRef = useRef<ActionType>();
  const {
    loading,
    listMenuItems,
    getListMenuItems,
    loadingCreate,
    createMenuItem,
    createModalVisible,
    setCreateModalVisible,
    updateStatusItem,
  } = useModel('menu', (returnValue: any) => ({
    loading: returnValue.loading,
    listMenuItems: returnValue.listMenuItems,
    getListMenuItems: returnValue.getListMenuItems,
    loadingCreate: returnValue.loadingCreate,
    createMenuItem: returnValue.createMenuItem,
    createModalVisible: returnValue.createModalVisible,
    setCreateModalVisible: returnValue.setCreateModalVisible,
    updateStatusItem: returnValue.updateStatusItem,
  }));

  const { getListCategories, listCategories } = useModel('category', (returnValue) => ({
    getListCategories: returnValue.getListCategories,
    listCategories: returnValue.listCategories,
  }));

  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});

  useEffect(() => {
    (async () => {
      await getListMenuItems('');
      await getListCategories();
    })();
  }, []);

  const content = (
    <>
      <p>Create, update menu items...</p>
    </>
  );

  const submitCreateForm = async (values: any) => {
    const { upload, ...data } = values;
    if (!upload || !upload.file) {
      message.error('Please choose image!');
    }
    await createMenuItem(data, upload.file);
  };

  const activeItem = (id: string) => {
    Modal.confirm({
      title: 'Active item',
      icon: <ExclamationCircleOutlined />,
      content: 'Do you want to set active this item?',
      okText: 'Save',
      cancelText: 'Cancel',
      onOk() {
        (async () => {
          await updateStatusItem(id, 'Active');
        })();
      },
    });
  };

  const deactivateItem = (id: string) => {
    Modal.confirm({
      title: 'Deactivate item',
      icon: <ExclamationCircleOutlined />,
      content: 'Do you want to set inactive this item?',
      okText: 'Save',
      cancelText: 'Cancel',
      onOk() {
        (async () => {
          await updateStatusItem(id, 'Inactive');
        })();
      },
    });
  };

  const showDetail = (values: any) => {
    setSelectedItem(values);
    setDetailModalVisible(true);
  };

  const columns: ProColumns<any>[] = [
    {
      title: 'Image',
      dataIndex: 'imageUrl',
      valueType: 'image',
      search: false,
    },
    {
      title: 'Item Name',
      dataIndex: 'itemName',
      valueType: 'text',
    },
    {
      title: 'Item Price',
      dataIndex: 'itemPrice',
      search: false,
      renderText: (val: any) => `${val} đ`,
    },
    {
      title: 'Create At',
      dataIndex: 'createdAt',
      search: false,
      valueType: 'dateTime',
    },
    {
      title: 'Unit',
      dataIndex: 'unit',
      search: false,
      valueType: 'text',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      hideInForm: true,
      search: false,
      valueEnum: {
        Inactive: {
          text: 'Inactive',
          status: 'Default',
        },
        Active: {
          text: 'Active',
          status: 'Success',
        },
      },
    },
    {
      title: 'Action',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record: any) => [
        <Button type="link" onClick={() => showDetail(record)}>
          Detail
        </Button>,
        <Button
          type="link"
          onClick={() => activeItem(record._id)}
          disabled={record.status === 'Active'}
        >
          Active
        </Button>,
        <Button
          type="link"
          danger
          onClick={() => deactivateItem(record._id)}
          disabled={record.status === 'Inactive'}
        >
          Inactive
        </Button>,
      ],
    },
  ];

  const handleSubmitSearch = async (values: any) => {
    const query = values.itemName || '';
    await getListMenuItems(query);
  };

  return (
    <PageContainer content={content}>
      <ProTable<any, any>
        headerTitle="Menu Items"
        actionRef={actionRef}
        rowKey="key"
        loading={loading}
        toolBarRender={() => [
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateModalVisible(true)}
          >
            Add a new item
          </Button>,
        ]}
        dataSource={listMenuItems || []}
        columns={columns}
        onSubmit={handleSubmitSearch}
      />
      <DetailMenuItem
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        menuItem={selectedItem}
      />

      <CreateMenuItemForm
        open={createModalVisible}
        onCreate={(values: any) => submitCreateForm(values)}
        onCancel={() => setCreateModalVisible(false)}
        loading={loadingCreate}
        listCategories={listCategories}
      />
    </PageContainer>
  );
};

export default Reservation;
