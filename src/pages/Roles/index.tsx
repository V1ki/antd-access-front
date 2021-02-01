import ProTable, { ActionType } from '@ant-design/pro-table';
import type { ProColumns } from '@ant-design/pro-table';
import React, { useState, useRef } from 'react';
import { getRoles, createRole, updateRole, deleteRole } from '@/services/roles';
import { Button, Modal, Form, Input, Checkbox, InputNumber, message, Space } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useIntl } from 'umi';



const handleSaveRole: (role: API.Role) => Promise<boolean> = async (role) => {
  const hide = message.loading(`正在${role.id ? '修改' : '创建'}角色....`);

  const resp = role.id ? await updateRole(role) : await createRole(role)

  hide();
  if (resp && resp.success) {
    message.success("角色添加成功!");
    return true;
  }


  message.error("角色添加失败!");
  return false;

}

const handleDeleteRole: (id: string) => Promise<boolean> = async (id) => {
  const hide = message.loading("正在删除角色....");

  const resp = await deleteRole(id);

  hide();
  if (resp && resp.success) {
    message.success("角色删除成功!");
    return true;
  }


  message.error("角色删除失败!");
  return false;

}


const RoleList: React.FC = () => {

  const [modalVisible, setModalVisible] = useState(false);
  const [editRole, setEditRole] = useState<API.Role | null>(null) ;
  const [form] = Form.useForm();
  const tableRef = useRef<ActionType>();
  const intl = useIntl();

  const columns: ProColumns<API.Role>[] = [
    {
      title: intl.formatMessage({
        id: 'roles.column.id',
        defaultMessage: "ID"
      }),
      dataIndex: "id", // data.id or data["id"]
    },
    {
      title: intl.formatMessage({
        id: 'roles.column.name',
        defaultMessage: "Name"
      }),
      dataIndex: "name",
    },
    {
      title: intl.formatMessage({
        id: 'roles.column.identifier',
        defaultMessage: "Identifier"
      }),
      dataIndex: "identifier",
    },
    {
      title: intl.formatMessage({
        id: 'roles.column.order',
        defaultMessage: "Order"
      }),
      dataIndex: "order",
    },
    {
      title: intl.formatMessage({
        id: 'roles.column.enabled',
        defaultMessage: "Enabled"
      }),
      dataIndex: "enabled",
      // renderText: (text: any, record: API.Role, index: number) => {
      //   return record.enabled ? "已启用": "未启用"
      // }
      valueEnum: {
        "true": {
          text: intl.formatMessage({
            id: 'roles.column.enabled.true',
            defaultMessage: "enabled"
          }),
          status: "Success"
        },
        "false": {
          text: intl.formatMessage({
            id: 'roles.column.enabled.false',
            defaultMessage: "disable"
          }),
          status: "Warning"
        }
      }
    },
    {
      title: "Action",
      dataIndex: 'action',
      render: (dom: any, entity: API.Role, index: number) => {
        return (<>
          <Space>
            <Button
              id={`roles-update-${entity.identifier}`}
              icon={<EditOutlined />}
              onClick={() => {
                setEditRole(entity);
                setModalVisible(true);
                form.setFieldsValue(entity);
              }} />
            <Button
              id={`roles-delete-${entity.identifier}`}
              icon={<DeleteOutlined />}
              onClick={async () => {

                const result = await handleDeleteRole(entity.id);
                if (result) {
                  if (tableRef.current) {
                    tableRef.current.reload();
                  }
                }
              }} />
          </Space>
        </>)
      }
    }
  ];

  return <>
    <ProTable<API.Role>
      rowKey="id"
      actionRef={tableRef}
      columns={columns}
      request={async (params) => {
        // TODO 怎么去请求网络.
        const result = await getRoles();
        return result;
      }}
      toolbar={{
        actions: [
          (
            <Button type="primary" id="role-create" onClick={() => {
              setModalVisible(true);
            }}>{intl.formatMessage({
              id: 'roles.btn.create',
              defaultMessage: "create"
            })}</Button>
          )
        ]
      }}
    />

    <Modal
      onCancel={() => {
        setModalVisible(false);
        setEditRole(null);
      } }
      onOk={() => {
        form.validateFields()
          .then(async values => {

            const result = await handleSaveRole(values);
            if (result) {
              setModalVisible(false);
              setEditRole(null);
              if (tableRef.current) {
                tableRef.current.reload();
              }
            }
          })

      }}
      visible={modalVisible}>

      <Form form={form}>

        <Form.Item label={intl.formatMessage({
          id: "roles.column.id",
          defaultMessage: "ID"
        })} name="id" hidden>
          <Input />
        </Form.Item>
        <Form.Item label={intl.formatMessage({
          id: "roles.column.name",
          defaultMessage: "Name"
        })} name="name" required={true}>
          <Input />
        </Form.Item>

        <Form.Item label={intl.formatMessage({
          id: "roles.column.identifier",
          defaultMessage: "Identifier"
        })} name="identifier"

          required={true}>
          <Input disabled={!!editRole?.id} />
        </Form.Item>

        <Form.Item label={intl.formatMessage({
          id: "roles.column.order",
          defaultMessage: "Order"
        })} name="order" required={true}>
          <InputNumber />
        </Form.Item>

        <Form.Item
          label={intl.formatMessage({
            id: "roles.column.enabled",
            defaultMessage: "Enabled"
          })}
          name="enabled"
          valuePropName="checked"
          required={true} >
          <Checkbox />
        </Form.Item>

      </Form>

    </Modal>
  </>
}

export default RoleList;
