import ProTable from '@ant-design/pro-table';
import type {ProColumns}  from '@ant-design/pro-table';
import * as React from 'react' ;
import { getRoles } from '@/services/roles';

const RoleList: React.FC = () => {

    const columns: ProColumns[] = [
        {
            title: "ID" ,
            dataIndex: "id",
        },
        {
            title: "Name",
            dataIndex: "name",
        }
    ] ;

    return <>
        <ProTable 
            columns={columns}
            request={ async (params)=> {
                // TODO 怎么去请求网络.
                const result = await getRoles();
                return result ;
            }}
            />
    </>
}

export default RoleList ;