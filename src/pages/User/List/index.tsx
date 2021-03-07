import ProTable from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import React, { useState, useRef } from 'react';
import { getUsers, createUser, updateUser, deleteUser } from '@/services/user';
import { Button, Modal, Form, Input, message, Space } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useIntl } from 'umi';

const handleSaveUser: (user: API.User) => Promise<boolean> = async (user) => {
  const hide = message.loading(`正在${user.id ? '修改' : '创建'}用户....`);

  const resp = user.id ? await updateUser(user) : await createUser(user);

  hide();
  if (resp && resp.success) {
    message.success('用户添加成功!');
    return true;
  }

  message.error('用户添加失败!');
  return false;
};

const handleDeleteUser: (id: string) => Promise<boolean> = async (id) => {
  const hide = message.loading('正在删除用户....');

  const resp = await deleteUser(id);

  hide();
  if (resp && resp.success) {
    message.success('用户删除成功!');
    return true;
  }

  message.error('用户删除失败!');
  return false;
};

const UserList: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<API.User | null>(null);
  const [form] = Form.useForm();
  const tableRef = useRef<ActionType>();
  const intl = useIntl();

  const columns: ProColumns<API.User>[] = [
    {
      title: intl.formatMessage({
        id: 'user.column.id',
        defaultMessage: 'ID',
      }),
      dataIndex: 'id', // data.id or data["id"]
    },
    {
      title: intl.formatMessage({
        id: 'user.column.account',
        defaultMessage: 'Account',
      }),
      dataIndex: 'account',
    },
    {
      title: intl.formatMessage({
        id: 'user.column.name',
        defaultMessage: 'Name',
      }),
      dataIndex: 'name',
    },
    {
      title: intl.formatMessage({
        id: 'user.column.passwd',
        defaultMessage: 'passwd',
      }),
      dataIndex: 'passwd',
    },
    {
      title: intl.formatMessage({
        id: 'user.column.avatar',
        defaultMessage: 'avatar',
      }),
      dataIndex: 'avatar',
      render: (entity) => {
        return (
          <>
            <img src={entity.avatar} width={40} />
          </>
        );
      },
    },

    {
      title: intl.formatMessage({
        id: 'user.column.mobile',
        defaultMessage: 'mobile',
      }),
      dataIndex: 'mobile',
    },
    {
      title: intl.formatMessage({
        id: 'user.column.email',
        defaultMessage: 'email',
      }),
      dataIndex: 'email',
    },

    {
      title: 'Action',
      dataIndex: 'action',
      render: (dom: any, entity: API.User) => {
        return (
          <>
            <Space>
              <Button
                id={`user-update-${entity.id}`}
                icon={<EditOutlined />}
                onClick={() => {
                  setModalVisible(true);
                  setSelectedUser(entity);
                  form.setFieldsValue(entity);
                }}
              />
              <Button
                id={`user-delete-${entity.id}`}
                icon={<DeleteOutlined />}
                onClick={async () => {
                  const result = await handleDeleteUser(entity.id);
                  if (result) {
                    setModalVisible(false);

                    if (tableRef.current) {
                      tableRef.current.reload();
                    }
                  }
                }}
              />
            </Space>
          </>
        );
      },
    },
  ];

  return (
    <>
      <ProTable<API.User>
        rowKey="id"
        actionRef={tableRef}
        columns={columns}
        request={async () => {
          // TODO 怎么去请求网络.
          const result = await getUsers();
          return result;
        }}
        toolbar={{
          actions: [
            <Button
              type="primary"
              id="user-create"
              onClick={() => {
                setModalVisible(true);
              }}
            >
              {intl.formatMessage({
                id: 'user.btn.create',
                defaultMessage: 'create',
              })}
            </Button>,
          ],
        }}
      />

      <Modal
        onCancel={() => {
          setModalVisible(false);
        }}
        onOk={() => {
          form.validateFields().then(async (values) => {
            const result = await handleSaveUser(values);
            if (result) {
              setModalVisible(false);

              if (tableRef.current) {
                tableRef.current.reload();
              }
            }
          });
        }}
        visible={modalVisible}
      >
        <Form form={form}>
          <Form.Item
            label={intl.formatMessage({
              id: 'user.column.id',
              defaultMessage: 'ID',
            })}
            name="id"
            hidden
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={intl.formatMessage({
              id: 'user.column.account',
              defaultMessage: 'Account',
            })}
            name="account"
          >
            <Input disabled={selectedUser !== null} />
          </Form.Item>
          <Form.Item
            label={intl.formatMessage({
              id: 'user.column.name',
              defaultMessage: 'Name',
            })}
            name="name"
            required={true}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label={intl.formatMessage({
              id: 'user.column.passwd',
              defaultMessage: 'passwd',
            })}
            name="passwd"
            required={true}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={intl.formatMessage({
              id: 'user.column.avatar',
              defaultMessage: 'avatar',
            })}
            name="avatar"
            required={true}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label={intl.formatMessage({
              id: 'user.column.mobile',
              defaultMessage: 'mobile',
            })}
            name="mobile"
            required={true}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={intl.formatMessage({
              id: 'user.column.email',
              defaultMessage: 'email',
            })}
            name="email"
            required={true}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UserList;
