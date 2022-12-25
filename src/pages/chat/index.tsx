import { useModel } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Col, Input, Menu, Row, Empty } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { MessageList } from 'react-chat-elements';
import 'react-chat-elements/dist/main.css';
import { UserOutlined } from '@ant-design/icons';
import { useAccess } from 'umi';
import { MenuInfo } from 'rc-menu/lib/interface';
import socketUtil from '../../socket.util';
import './index.less';
import moment from 'moment';

const Chat = () => {
  const { initialState } = useModel('@@initialState');
  const access = useAccess();
  const ref = useRef();
  const {
    loading,
    getListGroups,
    setListGroups,
    listGroups,
    getAllChats,
    listChats,
    getGroupOfCurrentUser,
    selectedGroup,
    setSelectedGroup,
    createChat,
    setListChats,
    addChat,
  } = useModel('chat', (returnValue) => ({
    loading: returnValue.loading,
    getListGroups: returnValue.getListGroups,
    setListGroups: returnValue.setListGroups,
    listGroups: returnValue.listGroups,
    getAllChats: returnValue.getAllChats,
    listChats: returnValue.listChats,
    getGroupOfCurrentUser: returnValue.getGroupOfCurrentUser,
    selectedGroup: returnValue.selectedGroup,
    setSelectedGroup: returnValue.setSelectedGroup,
    createChat: returnValue.createChat,
    setListChats: returnValue.setListChats,
    addChat: returnValue.addChat,
  }));

  const [inputMessage, setInputMessage] = useState('');

  // @ts-ignore
  const { currentUser } = initialState;

  const menus = listGroups.map((item: any) => ({
    label: item?.owner?.fullName,
    key: item?._id,
    icon: <UserOutlined />,
  }));

  const convertMessage = (listChatsParam: any) => {
    return listChatsParam.map((item: any) => ({
      avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
      position: currentUser?._id === item?.sender?._id ? 'right' : 'left',
      type: 'text',
      title: item?.sender?.fullName,
      text: item?.message,
      date: moment(item.createdAt).toDate(),
    }));
  };

  useEffect(() => {
    (async () => {
      if (access.isAdmin) {
        await getListGroups();
      } else {
        await getGroupOfCurrentUser();
      }
    })();
    return () => {
      setListGroups([]);
      setListChats([]);
      setSelectedGroup(null);
    };
  }, []);

  useEffect(() => {
    if (!selectedGroup) {
      return;
    }
    console.log('===============sub' + selectedGroup);
    socketUtil.get().on(`group-${selectedGroup}`, async (message: any) => {
      await addChat(message);
    });

    return () => {
      console.log('===============off' + selectedGroup);
      socketUtil.get().off(`group-${selectedGroup}`);
    };
  }, [addChat, selectedGroup]);

  const content = (
    <>
      <p>Chat system that support contact between customer and admin restaurant...</p>
    </>
  );

  const handleChangeGroup = async (item: MenuInfo) => {
    setSelectedGroup(item.key);
    await getAllChats(item.key);
  };

  const handleSendMessage = async () => {
    const msg = {
      group: selectedGroup,
      message: inputMessage,
    };
    setInputMessage('');
    await createChat(msg);
  };

  return (
    <PageContainer content={content}>
      <Row justify="center" gutter={24}>
        {access.isAdmin && (
          <Col span={8}>
            <Card loading={loading}>
              <Menu onClick={(item) => handleChangeGroup(item)} mode="inline" items={menus} />
            </Card>
          </Col>
        )}

        <Col span={16}>
          <Card bordered={false} loading={false}>
            {selectedGroup ? (
              <>
                <MessageList
                  referance={ref}
                  className="my-chat"
                  lockable={true}
                  toBottomHeight={'100%'}
                  dataSource={convertMessage([...listChats])}
                />
                <Col>
                  <Input.Group compact>
                    <Input
                      style={{ width: 'calc(100% - 80px)' }}
                      placeholder="input message"
                      value={inputMessage}
                      onChange={(value) => setInputMessage(value?.target?.value)}
                      onPressEnter={handleSendMessage}
                    />
                    <Button type="primary" onClick={handleSendMessage}>
                      Submit
                    </Button>
                  </Input.Group>
                </Col>
              </>
            ) : (
              <Empty />
            )}
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default Chat;
