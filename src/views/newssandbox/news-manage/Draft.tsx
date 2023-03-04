/**
 * @Author: Aaron
 * @Date: 2022/7/18
 */
import React, { useEffect, useState } from 'react'
import axios from 'axios'

import { Button, Modal, notification, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined, VerticalAlignTopOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'

const { confirm } = Modal

interface IDataType {
    id: string
    title: string
    key: string
    address: string
    grade: number
    pagepermisson: number
    children: IDataType[]
    category: number
}

export default function Draft() {
    const navigation = useNavigate()
    const [dataSource, setDataSource] = useState([])
    const { username } = JSON.parse(localStorage.getItem('token') as string)
    useEffect(() => {
        axios.get(`/api/news/lists/${username}`).then(res => {
            setDataSource(res.data.data)
        })
    }, [username])
    const columns: ColumnsType<IDataType> = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            render: (id: string) => <b>{id}</b>
        },
        {
            title: '新闻标题',
            dataIndex: 'title',
            render: (title: string, item: any) => {
                return <Link to={`/news-manage/preview/${item.id}`}>{title}</Link>
            }
        },
        {
            title: '作者',
            dataIndex: 'author'
        },
        {
            title: '新闻分类',
            dataIndex: 'category',
            render: category => {
                return category.title
            }
        },
        {
            title: '操作',
            render: item => (
                <div>
                    <Button type="primary" danger shape="circle" icon={<DeleteOutlined />} onClick={() => confirmMethod(item)} />
                    <Button
                        shape="circle"
                        icon={<EditOutlined />}
                        onClick={() => {
                            navigation(`/news-manage/update/${item.id}`)
                        }}
                    />
                    <Button type="primary" shape="circle" icon={<VerticalAlignTopOutlined />} onClick={() => handleCheck(item.id)} />
                </div>
            )
        }
    ]
    const handleCheck = (id: number) => {
        axios({
            method: 'post',
            url: `/api/news/updateAuditState`,
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            data: {
                id,
                auditState: 1
            }
        }).then(res => {
            navigation('/audit-manage/list')
            notification.info({
                message: `通知`,
                description: `您可以到审核列表中查看您的新闻`,
                placement: 'bottomRight'
            })
        })
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
        setDataSource(dataSource.filter((data: any) => data.id !== item.id))
        axios.delete(`/api/news/delete/${item.id}`)
    }
    return (
        <div>
            <Table
                rowKey={(item: any) => item.id}
                dataSource={dataSource}
                columns={columns}
                pagination={{
                    pageSize: 5
                }}
            />
        </div>
    )
}
