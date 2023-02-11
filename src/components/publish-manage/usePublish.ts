/**
 * @Author: Aaron
 * @Date: 2022/7/22
 */
import {useEffect, useState} from 'react';
import axios from "axios";
import {notification} from "antd";

function usePublish(type:number) {
    const [dataSource, setDataSource] = useState([]);
    const {username} = JSON.parse(localStorage.getItem('token') as string)[0]
    useEffect(() => {
        axios.get(`/news?author=${username}&publishState=${type}&_expand=category`).then(res => {
            console.log(res.data,'---res.data');
            setDataSource(res.data)
        })
    }, [])
    const handlePublish = (id:any)=>{
        setDataSource(dataSource.filter((item:any)=>item.id!==id))
        axios.patch(`/news/${id}`, {
            publishState: 2,
            publishTime: Date.now()
        }).then(res => {
            notification.info({
                message: `通知`,
                description: `您可以到[发布管理/已经发布]中查看您的新闻`,
                placement: 'bottomRight'
            });
        })
    }
    const handleDelete = (id:any)=>{
        setDataSource(dataSource.filter((item:any)=>item.id!==id))
        axios.delete(`/news/${id}`).then(res => {
            notification.info({
                message: `通知`,
                description: `您已经删除了已下线的新闻`,
                placement: 'bottomRight'
            });
        })
    }
    const handleSunset = (id:any)=>{
        setDataSource(dataSource.filter((item:any)=>item.id!==id))
        axios.patch(`/news/${id}`, {
            publishState: 3,
        }).then(res => {
            notification.info({
                message: `通知`,
                description: `您可以到[发布管理/已下线]中查看您的新闻`,
                placement: 'bottomRight'
            });
        })
    }
    return {
        dataSource,
        handlePublish,
        handleDelete,
        handleSunset
    };
}

export default usePublish
