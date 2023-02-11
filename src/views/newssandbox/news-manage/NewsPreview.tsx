/**
 * @Author: Aaron
 * @Date: 2022/7/22
 */
import React, {useEffect, useState} from 'react';
import {Descriptions, PageHeader, Tag} from 'antd';
import moment from 'moment';
import axios from "axios";
import {useParams} from "react-router-dom";

interface ICategory{
    title:string
    value:string
}
interface IRole{
    roleName:string
}
interface INews{
    title: string
    content: string
    region: string
    author:string
    auditState:number
    publishState:number
    createTime:number
    star:number
    view:number
    category:ICategory
    role:IRole
}
export default function NewsPreview() {
    const params = useParams()
    const [newsInfo, setNewsInfo] = useState<INews>()
    const auditList = ['未审核','审核中','已通过','未通过']
    const publishList = ['未发布','待发布','已上线','已下线']
    const colorList = ['','orange','green','red']
    useEffect(() => {
        axios.get(`/news/${params.id}?_expand=category&_expand=role`).then(res=>{
            setNewsInfo(res.data)
        })
    }, []);

    return (
        <div>
            {
                newsInfo && <div>
                    <PageHeader
                        onBack={() => window.history.back()}
                        title={newsInfo.title}
                        subTitle={newsInfo.category.title}
                    >
                        <Descriptions size="small" column={3}>
                            <Descriptions.Item label="创建者">{newsInfo.author}</Descriptions.Item>
                            <Descriptions.Item label="创建时间">{moment(newsInfo.createTime).format("YYYY/MM/DD HH:mm:ss")}</Descriptions.Item>
                            <Descriptions.Item label="发布时间">
                                {newsInfo.publishState?moment(newsInfo.publishState).format("YYYY/MM/DD HH:mm:ss"):'-'}
                            </Descriptions.Item>
                            <Descriptions.Item label="区域">{newsInfo.region}</Descriptions.Item>
                            <Descriptions.Item label="审核状态">
                                <Tag color={colorList[newsInfo.auditState]}>{auditList[newsInfo.auditState]}</Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="发布状态">
                                <Tag color={colorList[newsInfo.publishState]}>{publishList[newsInfo.publishState]}</Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="访问数量">
                                <span style={{color: "green"}}>{newsInfo.view}</span>
                            </Descriptions.Item>
                            <Descriptions.Item label="点赞数量">
                                <span style={{color: "green"}}>{newsInfo.star}</span>
                            </Descriptions.Item>
                            <Descriptions.Item label="评论数量">
                                <span style={{color: "green"}}>0</span>
                            </Descriptions.Item>
                        </Descriptions>
                    </PageHeader>

                    <div dangerouslySetInnerHTML={
                        {__html:newsInfo.content}
                    } style={{
                        margin:'0 24px',
                        padding:'5px',
                        border:'1px solid #e0e0e0'
                    }}></div>
                </div>
            }
        </div>
    );
}
