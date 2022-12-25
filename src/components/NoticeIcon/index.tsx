import React, { useEffect, useState } from 'react';
import { Badge, List, Avatar } from 'antd';
import { useModel } from 'umi';
import styles from './index.less';
import HeaderDropdown from '@/components/HeaderDropdown';
import { BellOutlined } from '@ant-design/icons';

const NoticeIconView: React.FC = () => {
  const { getListNotifications, listNotifications, loading } = useModel(
    'notification',
    (returnValue) => ({
      getListNotifications: returnValue.getListNotifications,
      listNotifications: returnValue.listNotifications,
      loading: returnValue.loading,
    }),
  );

  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      await getListNotifications();
    })();
  }, []);

  const notificationBox = () => {
    return (
      <List
        header={<strong>Notification</strong>}
        bordered
        dataSource={listNotifications}
        loading={loading}
        renderItem={(item: any) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src="/noti.svg" />}
              title={item.type}
              description={item.message}
            />
          </List.Item>
        )}
      />
    );
  };

  const handleShowNotification = async (value: boolean) => {
    setVisible(value);
    if (value) {
      await getListNotifications();
    }
  };

  return (
    <HeaderDropdown
      placement="bottomRight"
      overlay={notificationBox}
      overlayClassName={styles.popover}
      trigger={['click']}
      visible={visible}
      onVisibleChange={handleShowNotification}
    >
      <span>
        <Badge dot style={{ boxShadow: 'none' }} className={styles.badge}>
          <BellOutlined className={styles.icon} />
        </Badge>
      </span>
    </HeaderDropdown>
  );
};

export default NoticeIconView;
