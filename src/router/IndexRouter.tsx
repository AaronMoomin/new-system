/**
 * @Author: Aaron
 * @Date: 2022/7/18
 */
import React, { useEffect, useState } from 'react'
import Redirect from './Redirect'
import axios from 'axios'
import { HashRouter, Route, Routes } from 'react-router-dom'
import Login from '../views/login/Login'
import NewsSandBox from '../views/newssandbox/NewsSandBox'
import AuthComponent from './AuthComponent'
import NotFound from '../views/404/NotFound'
import Home from '../views/newssandbox/home/Home'
import UserList from '../views/newssandbox/user-manage/UserList'
import RoleList from '../views/newssandbox/right-manage/RoleList'
import RightList from '../views/newssandbox/right-manage/RightList'
import NoPermission from '../views/newssandbox/nopermission/NoPermission'
import NewsAdd from '../views/newssandbox/news-manage/NewsAdd'
import Draft from '../views/newssandbox/news-manage/Draft'
import Category from '../views/newssandbox/news-manage/Category'
import Audit from '../views/newssandbox/audit-manage/Audit'
import AuditList from '../views/newssandbox/audit-manage/AuditList'
import Unpublished from '../views/newssandbox/publish-manage/Unpublished'
import Published from '../views/newssandbox/publish-manage/Published'
import Sunset from '../views/newssandbox/publish-manage/Sunset'
import NewsPreview from '../views/newssandbox/news-manage/NewsPreview'
import NewsUpdate from '../views/newssandbox/news-manage/NewsUpdate'
import News from '../views/news/News'
import Detail from '../views/news/Detail'

const localRouteMap: any = {
    '/home': <Home />,
    '/user-manage/list': <UserList />,
    '/right-manage/role/list': <RoleList />,
    '/right-manage/right/list': <RightList />,
    '/news-manage/add': <NewsAdd />,
    '/news-manage/draft': <Draft />,
    '/news-manage/preview/:id': <NewsPreview />,
    '/news-manage/update/:id': <NewsUpdate />,
    '/news-manage/category': <Category />,
    '/audit-manage/audit': <Audit />,
    '/audit-manage/list': <AuditList />,
    '/publish-manage/unpublished': <Unpublished />,
    '/publish-manage/published': <Published />,
    '/publish-manage/sunset': <Sunset />
}

export default function IndexRouter(props: any) {
    const [backRouteList, setBackRouteList] = useState<any>([])
    useEffect(() => {
        Promise.all([axios.get('/api/rights/lists'), axios.get('/api/children/lists')]).then(res => {
            setBackRouteList([...res[0].data.data, ...res[1].data.data])
        })
    }, [])
    const checkRoute: any = (item: any) => {
        //判断本地路由是否存在url路径 和 路由是否显示
        return localRouteMap[item.key] && (item.pagepermission || item.routepermission)
    }
    const checkPermission: any = (item: any) => {
        if (JSON.parse(localStorage.getItem('token') as string)) {
            const {
                role: { rights }
            } = JSON.parse(localStorage.getItem('token') as string)

            // 判断登录用户是否有路由权限
            return rights.includes(item.key)
        }
    }

    return (
        <HashRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/news" element={<News />} />
                <Route path="/detail/:id" element={<Detail />} />
                <Route
                    path="/"
                    element={
                        <AuthComponent>
                            <NewsSandBox />
                        </AuthComponent>
                    }
                >
                    <Route index element={<Redirect to="/home" />} />
                    {backRouteList.map((item: any) => {
                        if (checkRoute(item) && checkPermission(item)) {
                            return <Route path={item.key} key={item.key} element={localRouteMap[item.key]} />
                        } else {
                            return null
                        }
                    })}
                    {backRouteList.length > 0 && <Route path="*" element={<NoPermission />} />}
                </Route>
                <Route path="*" element={<NotFound />} />
            </Routes>
        </HashRouter>
    )
}
