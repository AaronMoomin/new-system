/**
 * @Author: Aaron
 * @Date: 2022/7/18
 */
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import icon from '../icon/icon'

import './index.sass'

import { Layout, Menu } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import { connect } from 'react-redux'

const { Sider } = Layout

interface menuItem {
    children: Array<string>
    grade: number
    id: number
    key: string
    pagepermission: number
    title: string
    label: string
}

function SideMenu(props: any) {
    const navigation = useNavigate()
    const location = useLocation()
    const [menu, setMenu] = useState([])

    const {
        role: { rights }
    } = JSON.parse(localStorage.getItem('token') as string)

    const setMenuList = (menuList: any, list: any = []) => {
        menuList.map((item: any) => {
            if (item.pagepermission !== 1) return
            if (item.children.length > 0) {
                item.children.map((child: any) => {
                    if (child.rightId) {
                        child.rightid = child.rightId
                        delete child.rightId
                    }
                    if (child.pagepermission === 1) {
                        child.label = child.title
                        // @ts-ignore
                        child.icon = icon[child.key]
                    } else {
                        return
                    }
                })
            } else {
                delete item.children
            }
            item.label = item.title
            // @ts-ignore
            item.icon = icon[item.key]
            list = [...list, item]
        })

        return list
    }
    const selectMenu = (list: any): any => {
        let menu: any[] = []
        list.map((item: any, index: any) => {
            if (item.pagepermission && rights.includes(item.key)) {
                menu.push(item)
            }
        })
        menu.map((m: any) => {
            if (m.children) {
                const newChildren = m.children.filter((child: any) => child.pagepermission && rights.includes(child.key))
                m.children = newChildren
            }
        })
        return menu
    }
    useEffect(() => {
        axios.get('/api/rights/lists').then(res => {
            // 设置label
            let list = setMenuList(res.data.data)
            // 筛选出pagepermission对象
            let menu = selectMenu(list)
            setMenu(menu)
        })
    }, [])
    const selectKey = [location.pathname]
    const openKey = ['/' + location.pathname.split('/')[1]]
    return (
        <Sider trigger={null} collapsible collapsed={props.collapsed}>
            <div style={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
                <div className="logo">全球新闻管理系统</div>
                <div style={{ flex: '1', overflow: 'auto' }}>
                    <Menu
                        theme="dark"
                        mode="inline"
                        selectedKeys={selectKey}
                        defaultOpenKeys={openKey}
                        items={menu}
                        onClick={item => {
                            navigation(item.key)
                        }}
                    />
                </div>
            </div>
        </Sider>
    )
}
const mapStateToProps = (state: any) => {
    return {
        collapsed: state.collapsedReducer.collapsed
    }
}
export default connect(mapStateToProps, {})(SideMenu)
