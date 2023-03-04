/**
 * @Author: Aaron
 * @Date: 2022/7/23
 */
import React, { useEffect, useState } from 'react'
import { Card, Col, List, PageHeader, Row } from 'antd'
import axios from 'axios'
// @ts-ignore
import _ from 'lodash'
import { Link } from 'react-router-dom'

export default function News() {
    const [list, setList] = useState<any>([])
    useEffect(() => {
        axios.get('/api/news/lists').then(res => {
            setList(Object.entries(_.groupBy(res.data.data, (item: any) => item.category.title)))
        })
    }, [])
    return (
        <div style={{ width: '95%', margin: '0 auto' }}>
            <PageHeader className="site-page-header" title="新闻" subTitle="查看新闻" />
            <div className="site-card-wrapper">
                <Row gutter={[16, 16]}>
                    {list.map((item: any) => (
                        <Col span={8} key={item[0]}>
                            <Card title={item[0]} bordered={true} hoverable={true}>
                                <List
                                    size="small"
                                    pagination={{ pageSize: 3 }}
                                    bordered
                                    dataSource={item[1]}
                                    renderItem={(data: any) => (
                                        <List.Item>
                                            <Link to={`/detail/${data.id}`}>{data.title}</Link>
                                        </List.Item>
                                    )}
                                />
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>
        </div>
    )
}
