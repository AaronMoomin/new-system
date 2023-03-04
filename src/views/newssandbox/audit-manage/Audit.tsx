/**
 * @Author: Aaron
 * @Date: 2022/7/21
 */
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Button, notification, Table } from 'antd'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { ColumnsType } from 'antd/es/table'
import { Link } from 'react-router-dom'

interface ICategory {
    title: string
    value: string
}
interface IDataType {
    id: string
    title: string
    auditState: number
    author: string
    category: ICategory
    content: string
    publishState: number
    region: string
    star: number
    view: number
}
export default function Audit() {
    const [dataSource, setDataSource] = useState<any>([])
    const { roleId, region, username } = JSON.parse(localStorage.getItem('token') as string)

    useEffect(() => {
        const roleObj: any = {
            '1': 'superadmin',
            '2': 'admin',
            '3': 'editor'
        }
        axios.get(`/api/news/lists/underReview`).then(res => {
            let list = res.data.data
            setDataSource(roleObj[roleId] === 'superadmin' ? list : [...list.filter((item: any) => item.author === username), ...list.filter((item: any) => item.region === region && roleObj[item.roleId] === 'editor')])
        })
    }, [])
    const columns: ColumnsType<IDataType> = [
        {
            title: '新闻标题',
            dataIndex: 'title',
            render: (title: string, item: IDataType) => <Link to={`/news-manage/preview/${item.id}`}>{title}</Link>
        },
        {
            title: '作者',
            dataIndex: 'author'
        },
        {
            title: '新闻分类',
            dataIndex: 'category',
            render: category => {
                return <span>{category.title}</span>
            }
        },
        {
            title: '操作',
            render: item => {
                return (
                    <div>
                        <Button type="primary" shape="circle" icon={<CheckOutlined />} onClick={() => handleAudit(item, 2, 1)} />
                        <Button type="primary" danger shape="circle" icon={<CloseOutlined />} onClick={() => handleAudit(item, 3, 0)} />
                    </div>
                )
            }
        }
    ]
    const handleAudit = (item: IDataType, auditState: number, publishState: number) => {
        setDataSource(dataSource.filter((data: IDataType) => data.id !== item.id))
        axios({
            method: 'post',
            url: `/api/news/updateState`,
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            data: {
                id: item.id,
                auditState,
                publishState
            }
        }).then(res => {
            notification.info({
                message: `通知`,
                description: `您可以到[审核管理/审核列表]中查看您的新闻`,
                placement: 'bottomRight'
            })
        })
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
