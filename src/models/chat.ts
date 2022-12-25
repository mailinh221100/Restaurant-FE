import { useState, useCallback } from 'react';
import { message } from 'antd';
import {
  createChatAPI,
  getGroupOfCurrentUserAPI,
  getListChatAPI,
  getListGroupsAPI,
} from '@/pages/chat/service';

export default () => {
  const [loading, setLoading] = useState(false);
  const [listGroups, setListGroups] = useState([]);
  const [listChats, setListChats] = useState<any[]>([]);

  const [selectedGroup, setSelectedGroup] = useState<any>(null);

  const getListGroups = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getListGroupsAPI();
      setListGroups(data);
      setLoading(false);
    } catch (error) {
      message.error('Something went wrong!');
    }
  }, []);

  const getAllChats = useCallback(async (groupId: string) => {
    try {
      const data = await getListChatAPI(groupId);
      setListChats(data);
    } catch (error) {
      message.error('Something went wrong!');
    }
  }, []);

  const getGroupOfCurrentUser = useCallback(async () => {
    try {
      const group = await getGroupOfCurrentUserAPI();
      if (group) {
        setSelectedGroup(group._id);
        await getAllChats(group._id);
      }
    } catch (error) {
      message.error('Something went wrong!');
    }
  }, []);

  const createChat = useCallback(async (msg: any) => {
    try {
      await createChatAPI(msg);
    } catch (error) {
      message.error('Something went wrong!');
    }
  }, []);

  const addChat = useCallback(
    async (chat: any) => {
      try {
        setListChats([...listChats, chat]);
      } catch (error) {
        message.error('Something went wrong!');
      }
    },
    [listChats],
  );

  return {
    loading,
    getListGroups,
    listGroups,
    getAllChats,
    listChats,
    getGroupOfCurrentUser,
    selectedGroup,
    setSelectedGroup,
    setListChats,
    createChat,
    setListGroups,
    addChat,
  };
};
