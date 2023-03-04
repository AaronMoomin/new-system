/**
 * @Author: Aaron
 * @Date: 2022/7/18
 */
import React, { useEffect, useState } from 'react'
import axios from 'axios'

import { Button, Modal, Popover, Switch, Table, Tag } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons'

const { confirm } = Modal

interface IDataType {
    id: string
    title: string
    key: string
    address: string
    grade: number
    pagepermission: number
    children: IDataType[]
}

export default function RightList() {
    const [dataSource, setDataSource] = useState([])
    useEffect(() => {
        axios.get('/api/rights/lists').then(res => {
            let list = res.data.data
            list.forEach((item: any) => {
                if (item.children.length === 0) {
                    item.children = ''
                }
            })
            setDataSource(list)
        })
    }, [])
    const columns: ColumnsType<IDataType> = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            render: (id: string) => <b>{id}</b>
        },
        {
            title: '权限名称',
            dataIndex: 'title'
        },
        {
            title: '权限路径',
            dataIndex: 'key',
            render: (key: string) => <Tag color="orange">{key}</Tag>
        },
        {
            title: '操作',
            render: item => (
                <div>
                    <Button type="primary" danger shape="circle" icon={<DeleteOutlined />} onClick={() => confirmMethod(item)} />
                    <Popover
                        content={
                            <div style={{ textAlign: 'center' }}>
                                <Switch checked={item.pagepermission} onChange={() => changeMethod(item)}></Switch>
                            </div>
                        }
                        title="页面配置项"
                        trigger={item.pagepermission === undefined ? '' : 'hover'}
                    >
                        <Button type="primary" shape="circle" icon={<EditOutlined />} disabled={item.pagepermission === undefined} />
                    </Popover>
                </div>
            )
        }
    ]
    const changeMethod = (item: IDataType) => {
        item.pagepermission = item.pagepermission === 1 ? 0 : 1
        setDataSource([...dataSource])
        if (item.grade === 1) {
            axios({
                method: 'post',
                url: `/api/rights/updatePermission`,
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                data: {
                    id: item.id,
                    pagepermission: item.pagepermission ? 1 : 0
                }
            })
        } else {
            axios({
                method: 'post',
                url: `/api/children/updatePermission`,
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                data: {
                    id: item.id,
                    pagepermission: item.pagepermission ? 1 : 0
                }
            })
        }
    }
    const confirmMethod: any = (item: any) => {
        confirm({
            title: '确定删除吗?',
            icon: <ExclamationCircleOutlined />,
            onOk: function () {
                deleteMethod(item)
            },
            onCancel() {}
        })
    }
    const deleteMethod: any = (item: any) => {
        if (item.grade === 1) {
            setDataSource(dataSource.filter((data: any) => data.id !== item.id))
            axios.delete(`/api/rights/delete/${item.id}`)
        } else {
            let list: Array<IDataType> = dataSource.filter((data: any) => data.id === item.rightId)
            // 二层数据修改会影响 DataSource
            list[0].children = list[0].children.filter((data: any) => data.id !== item.id)
            setDataSource([...dataSource])
            axios.delete(`/api/children/delete/${item.id}`)
        }
    }
    return (
        <div>
            <Table
                dataSource={dataSource}
                columns={columns}
                pagination={{
                    pageSize: 5
                }}
            />
        </div>
    )
}
