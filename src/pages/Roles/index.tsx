import ProTable, { ActionType } from '@ant-design/pro-table';
import type { ProColumns } from '@ant-design/pro-table';
import React, { useState, useRef } from 'react';
import { getRoles, createRole, updateRole, deleteRole } from '@/services/roles';
import { Button, Modal, Form, Input, Checkbox, InputNumber, message ,Space } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';



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
  const [form] = Form.useForm();
  const tableRef = useRef<ActionType>();

  const columns: ProColumns<API.Role>[] = [
    {
      title: "ID",
      dataIndex: "id", // data.id or data["id"]
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Name",
      dataIndex: "identifier",
    },
    {
      title: "Order",
      dataIndex: "order",
    },
    {
      title: "enabled",
      dataIndex: "enabled",
      // renderText: (text: any, record: API.Role, index: number) => {
      //   return record.enabled ? "已启用": "未启用"
      // }
      valueEnum: {
        "true": {
          text: "已启用",
          status: "Success"
        },
        "false": {
          text: "未启用",
          status: "Warning"
        }
      }
    },
    {
      title: "Action",
      dataIndex: 'action',
      render: (dom: any, entity: API.Role, index: number) => {
        return (<>
         <Space> <Button icon={<EditOutlined />} onClick={() => {
            setModalVisible(true);
            form.setFieldsValue(entity);
          }} />
          <Button icon={<DeleteOutlined />} onClick={async () => {

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
            <Button type="primary" onClick={() => {
              setModalVisible(true);
            }}>新建</Button>
          )
        ]
      }}
    />

    <Modal
      onCancel={() => setModalVisible(false)}
      onOk={() => {
        form.validateFields()
          .then(async values => {

            const result = await handleSaveRole(values);
            if (result) {
              setModalVisible(false);
              if (tableRef.current) {
                tableRef.current.reload();
              }
            }
          })

      }}
      visible={modalVisible}>

      <Form form={form}>

        <Form.Item label="role.id" name="id" hidden>
          <Input />
        </Form.Item>
        <Form.Item label="role.name" name="name" required={true}>
          <Input />
        </Form.Item>

        <Form.Item label="role.identifier" name="identifier" required={true}>
          <Input />
        </Form.Item>

        <Form.Item label="role.order" name="order" required={true}>
          <InputNumber />
        </Form.Item>

        <Form.Item
          label="role.enabled"
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
