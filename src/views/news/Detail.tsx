/**
 * @Author: Aaron
 * @Date: 2022/7/22
 */
import React, { useEffect, useState } from 'react'
import { Descriptions, PageHeader } from 'antd'
import moment from 'moment'
import axios from 'axios'
import { HeartTwoTone } from '@ant-design/icons'

import { useParams } from 'react-router-dom'

interface ICategory {
    title: string
    value: string
}

interface IRole {
    roleName: string
}

interface INews {
    title: string
    content: string
    region: string
    author: string
    auditState: number
    publishState: number
    createTime: number
    star: number
    view: number
    category: ICategory
    role: IRole
}

export default function Detail() {
    const params = useParams()
    const [newsInfo, setNewsInfo] = useState<any>()
    useEffect(() => {
        axios
            .get(`/api/news/lists/preview/${params.id}`)
            .then(res => {
                console.log(res.data.data)
                setNewsInfo({
                    ...res.data.data,
                    view: res.data.data.view + 1
                })
                return res.data.data
            })
            .then(res => {
                axios({
                    method: 'post',
                    url: `/api/news/updateView/${params.id}`,
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    data: {
                        view: res.view + 1
                    }
                })
            })
    }, [params.id])
    const handleLike = () => {
        setNewsInfo({
            ...newsInfo,
            star: newsInfo.star + 1
        })
        axios({
            method: 'post',
            url: `/api/news/updateStar/${params.id}`,
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            data: {
                star: newsInfo.star + 1
            }
        })
    }
    return (
        <div>
            {newsInfo && (
                <div>
                    <PageHeader
                        onBack={() => window.history.back()}
                        title={newsInfo.title}
                        subTitle={
                            <div>
                                <span style={{ marginRight: '10px' }}>{newsInfo.category.title}</span>
                                <HeartTwoTone twoToneColor="#eb2f96" onClick={() => handleLike()} />
                            </div>
                        }
                    >
                        <Descriptions size="small" column={3}>
                            <Descriptions.Item label="创建者">{newsInfo.author}</Descriptions.Item>
                            <Descriptions.Item label="创建时间">{moment(Number(newsInfo.createTime)).format('YYYY/MM/DD HH:mm:ss')}</Descriptions.Item>
                            <Descriptions.Item label="区域">{newsInfo.region}</Descriptions.Item>
                            <Descriptions.Item label="访问数量">
                                <span style={{ color: 'green' }}>{newsInfo.view}</span>
                            </Descriptions.Item>
                            <Descriptions.Item label="点赞数量">
                                <span style={{ color: 'green' }}>{newsInfo.star}</span>
                            </Descriptions.Item>
                            <Descriptions.Item label="评论数量">
                                <span style={{ color: 'green' }}>0</span>
                            </Descriptions.Item>
                        </Descriptions>
                    </PageHeader>

                    <div
                        dangerouslySetInnerHTML={{ __html: newsInfo.content }}
                        style={{
                            margin: '0 24px',
                            padding: '5px',
                            border: '1px solid #e0e0e0'
                        }}
                    ></div>
                </div>
            )}
        </div>
    )
}
