/**
 * @Author: Aaron
 * @Date: 2022/7/21
 */
import React, {useEffect, useState} from 'react';
import axios from "axios";
import {Button, notification, Table, Tag} from "antd";
import {ColumnsType} from "antd/es/table";
import {Link, useNavigate} from "react-router-dom";

interface ICategory {
    title: string;
    value: string;
}

interface IDataType {
    id: string;
    title: string;
    auditState: number
    author: string
    category: ICategory
    content: string
    publishState: number
    region: string
    star: number
    view: number
}

export default function AuditList() {
    const navigation = useNavigate()
    const [dataSource, setDataSource] = useState([]);
    const {username} = JSON.parse(localStorage.getItem('token') as string)[0]
    useEffect(() => {
        axios(`/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`)
            .then(res => {
                setDataSource(res.data)
            })
    }, []);
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
            render: (category) => {
                return <span>{category.title}</span>
            }
        },
        {
            title: '审核状态',
            dataIndex: 'auditState',
            render: (auditState) => {
                const auditList = ['未审核', '审核中', '已通过', '未通过']
                const colorList = ['', 'orange', 'green', 'red']
                return <Tag color={colorList[auditState]}>{auditList[auditState]}</Tag>
            }
        },
        {
            title: '操作',
            render: (item) => <div>
                {item.auditState === 1 && <Button onClick={() => handleRevert(item)}>撤销</Button>}
                {item.auditState === 2 && <Button onClick={() => handlePublish(item)} type="primary">发布</Button>}
                {item.auditState === 3 && <Button onClick={() => handleUpdate(item)} danger>修改</Button>}
            </div>
        },
    ]
    const handlePublish = (item: IDataType) => {
        axios.patch(`/news/${item.id}`, {
            publishState: 2,
            publishTime: Date.now()
        }).then(res => {
            navigation('/publish-manage/published')
            notification.info({
                message: `通知`,
                description: `您可以到[发布管理/已经发布]中查看您的新闻`,
                placement: 'bottomRight'
            });
        })
    }
    const handleUpdate = (item: IDataType) => {
        navigation(`/news-manage/update/${item.id}`)
    }
    const handleRevert = (item: IDataType) => {
        setDataSource(dataSource.filter((data: IDataType) => data.id !== item.id))
        axios.patch(`/news/${item.id}`, {
            auditState: 0
        }).then(res => {
            notification.info({
                message: `通知`,
                description: `您可以到草稿箱中更新您的新闻`,
                placement: 'bottomRight'
            });
        })
    }
    return (
        <div>
            <Table rowKey={(item: any) => item.id} dataSource={dataSource} columns={columns} pagination={{
                pageSize: 5
            }}/>
        </div>
    );
}
