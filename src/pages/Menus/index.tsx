import ProTable from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import React, { useState, useRef } from 'react';
import { getMenus, createMenu, updateMenu, deleteMenu } from '@/services/menus';
import { Button, Modal, Form, Input, Checkbox, InputNumber, message, Space } from 'antd';
import { DeleteOutlined, EditOutlined, FileAddOutlined } from '@ant-design/icons';
import { useIntl, useModel } from 'umi';

const handleSaveMenu: (role: API.Menu) => Promise<boolean> = async (menu) => {
  const hide = message.loading(`正在${menu.mid ? '修改' : '创建'}菜单....`);

  const resp = menu.mid ? await updateMenu(menu) : await createMenu(menu);

  hide();
  if (resp && resp.success) {
    message.success('菜单添加成功!');
    return true;
  }

  message.error('菜单添加失败!');
  return false;
};

const handleDeleteMenu: (id: string) => Promise<boolean> = async (id) => {
  const hide = message.loading('正在删除菜单....');

  const resp = await deleteMenu(id);

  hide();
  if (resp && resp.success) {
    message.success('菜单删除成功!');
    return true;
  }

  message.error('菜单删除失败!');
  return false;
};

const RoleList: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const tableRef = useRef<ActionType>();
  const intl = useIntl();
  const { initialState, setInitialState } = useModel('@@initialState');

  const columns: ProColumns<API.Menu>[] = [
    {
      title: intl.formatMessage({
        id: 'menus.column.id',
        defaultMessage: 'ID',
      }),
      dataIndex: 'mid', // data.id or data["id"]
      hideInTable: true,
    },
    {
      title: intl.formatMessage({
        id: 'menus.column.identifier',
        defaultMessage: 'identifier',
      }),
      dataIndex: 'identifier',
    },
    {
      title: intl.formatMessage({
        id: 'menus.column.name',
        defaultMessage: 'Name',
      }),
      dataIndex: 'name',
    },
    {
      title: intl.formatMessage({
        id: 'menus.column.icon',
        defaultMessage: 'icon',
      }),
      dataIndex: 'icon',
    },
    {
      title: intl.formatMessage({
        id: 'menus.column.path',
        defaultMessage: 'path',
      }),
      dataIndex: 'path',
    },

    {
      title: intl.formatMessage({
        id: 'menus.column.order',
        defaultMessage: 'Order',
      }),
      dataIndex: 'idx',
    },
    {
      title: intl.formatMessage({
        id: 'menus.column.hide',
        defaultMessage: 'hide',
      }),
      dataIndex: 'hide',
      // renderText: (text: any, record: API.Role, index: number) => {
      //   return record.enabled ? "已启用": "未启用"
      // }
      valueEnum: {
        true: {
          text: intl.formatMessage({
            id: 'menus.column.hide.true',
            defaultMessage: 'enabled',
          }),
          status: 'Warning',
        },
        false: {
          text: intl.formatMessage({
            id: 'menus.column.hide.false',
            defaultMessage: 'disable',
          }),
          status: 'Success',
        },
      },
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (dom: any, entity: API.Menu) => {
        return (
          <>
            <Space>
              <Button
                id={`menus-add-${entity.mid}`}
                icon={<FileAddOutlined />}
                onClick={() => {
                  // 增加子菜单.
                  setModalVisible(true);
                  form.setFieldsValue({
                    parent: entity.mid,
                  });
                }}
              />
              <Button
                id={`menus-update-${entity.mid}`}
                icon={<EditOutlined />}
                onClick={() => {
                  setModalVisible(true);
                  form.setFieldsValue(entity);
                }}
              />
              <Button
                id={`menus-delete-${entity.mid}`}
                icon={<DeleteOutlined />}
                onClick={async () => {
                  const result = await handleDeleteMenu(entity.mid);
                  if (result) {
                    const menus = await initialState?.fetchMenus?.();

                    setModalVisible(false);
                    if (menus) {
                      setInitialState({
                        ...initialState,
                        menus,
                      });
                      window.location.reload();
                    }

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
      <ProTable<API.Menu>
        rowKey="id"
        actionRef={tableRef}
        columns={columns}
        request={async () => {
          // TODO 怎么去请求网络.
          const result = await getMenus();
          return result;
        }}
        toolbar={{
          actions: [
            <Button
              type="primary"
              id="menu-create"
              onClick={() => {
                setModalVisible(true);
              }}
            >
              {intl.formatMessage({
                id: 'menus.btn.create',
                defaultMessage: 'create',
              })}
            </Button>,
          ],
        }}
      />

      <Modal
        title={"Create Menu"}
        onCancel={() => {
          setModalVisible(false);
        }}
        onOk={() => {
          form.validateFields().then(async (values) => {
            const result = await handleSaveMenu(values);
            if (result) {
              const menus = await initialState?.fetchMenus?.();

              setModalVisible(false);
              if (menus) {
                setInitialState({
                  ...initialState,
                  menus,
                });
                window.location.reload();
              }

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
              id: 'menus.column.id',
              defaultMessage: 'ID',
            })}
            name="mid"
            hidden
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={intl.formatMessage({
              id: 'menus.column.parent',
              defaultMessage: 'Parent',
            })}
            name="parent"
            hidden
          >
            <Input />
          </Form.Item>

          <Form.Item
            label={intl.formatMessage({
              id: 'menus.column.identifier',
              defaultMessage: 'identifier',
            })}
            name="identifier"
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={intl.formatMessage({
              id: 'menus.column.name',
              defaultMessage: 'Name',
            })}
            name="name"
            required={true}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label={intl.formatMessage({
              id: 'menus.column.icon',
              defaultMessage: 'icon',
            })}
            name="icon"
            required={true}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={intl.formatMessage({
              id: 'menus.column.path',
              defaultMessage: 'path',
            })}
            name="path"
            required={true}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label={intl.formatMessage({
              id: 'menus.column.order',
              defaultMessage: 'Order',
            })}
            name="idx"
            required={true}
          >
            <InputNumber />
          </Form.Item>

          <Form.Item
            label={intl.formatMessage({
              id: 'menus.column.hide',
              defaultMessage: 'Hide',
            })}
            name="hide"
            valuePropName="checked"
            required={true}
          >
            <Checkbox />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default RoleList;
