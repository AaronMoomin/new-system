/**
 * @Author: Aaron
 * @Date: 2022/7/22
 */
import React from 'react';
import {Table} from "antd";
import {NavLink} from "react-router-dom";

export default function NewsTableShow(props:any) {
    const columns:any = [
        {
            title: '新闻标题',
            dataIndex: 'title',
            render: (title: string,item:any) => <NavLink to={`/news-manage/preview/${item.id}`}>{title}</NavLink>
        },
        {
            title: '作者',
            dataIndex: 'author'
        },
        {
            title: '新闻分类',
            dataIndex: 'category',
            render: (category: any) => <span>{category.title}</span>
        },
        {
            title: '操作',
            render: (item:any) => props.button(item.id)
        },
    ]
    return (
        <div>
            <Table rowKey={(item:any) => item.id} dataSource={props.dataSource} columns={columns} pagination={{
                pageSize: 5
            }}/>
        </div>
    );
}
