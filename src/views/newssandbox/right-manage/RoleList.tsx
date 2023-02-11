/**
 * @Author: Aaron
 * @Date: 2022/7/18
 */
import React, {useEffect, useState} from 'react';
import axios from "axios";

import {Button, Modal, Table, Tree} from "antd";
import {AlignLeftOutlined, DeleteOutlined, ExclamationCircleOutlined} from "@ant-design/icons";

const {confirm} = Modal;

interface IDataType {
    id: number
    roleName: string
    roleType: number
    rights: string[]
}

export default function RoleList() {
    //角色数据
    const [dataSource, setDataSource] = useState<any[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    //所有权限
    const [rightList, setRightList] = useState([]);
    //当前选中路径的权限
    const [currentRights, setCurrentRights] = useState([]);
    const [currentId, setCurrentId] = useState(0);
    const columns = [{
        title: 'ID',
        dataIndex: 'id',
        render: (id: string) => <b>{id}</b>
    }, {
        title: '角色名称',
        dataIndex: 'roleName'
    }, {
        title: '操作',
        render: (item: any) => <div>
            <Button type="primary" danger shape="circle"
                    icon={<DeleteOutlined/>}
                    onClick={() => confirmMethod(item)}/>
            <Button type="primary" shape="circle" icon={<AlignLeftOutlined/>}
                    onClick={() => {
                        setIsModalVisible(true)
                        setCurrentId(item.id)
                        setCurrentRights(item.rights)
                    }}/>
        </div>
    },
    ]
    const confirmMethod: any = (item: any) => {
        confirm({
            title: '确定删除吗?',
            icon: <ExclamationCircleOutlined/>,
            onOk: function () {
                deleteMethod(item)
            },
            onCancel() {
            },
        });
    }
    const deleteMethod: any = (item: IDataType) => {
        setDataSource(dataSource.filter((data: any) => data.id !== item.id))
        axios.delete(`/roles/${item.id}`)
    }
    useEffect(() => {
        axios.get(`/roles`).then(res => {
            setDataSource(res.data)
        })

        axios.get('/rights?_embed=children').then(res => {
            console.log(res.data,'--rights');
            setRightList(res.data)
        })
    }, []);

    const handleOk = () => {
        setIsModalVisible(false)
        setDataSource(dataSource.map((data: any) => {
            if (data.id === currentId) {
                return {
                    ...data,
                    rights: currentRights
                }
            }
            return data
        }))
        console.log(currentRights,'--currentRights');
        axios.patch(`/roles/${currentId}`,{
            rights:currentRights
        })
    }
    const handleCancel = () => {
        setIsModalVisible(false)
    }

    const onCheck = (checkedKeys: any) => {
        setCurrentRights(checkedKeys?.checked)
    };

    return (
        <div>
            <Table dataSource={dataSource} columns={columns} rowKey={(item: any) => item.id}></Table>

            <Modal title="Basic Modal" visible={isModalVisible} onOk={handleOk}
                   onCancel={handleCancel}>
                <Tree
                    checkable
                    onCheck={onCheck}
                    checkStrictly
                    checkedKeys={currentRights}
                    treeData={rightList}
                />
            </Modal>
        </div>
    );
}
