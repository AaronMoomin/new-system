/**
 * @Author: Aaron
 * @Date: 2022/7/18
 */
import React, { useState } from 'react'

import { Avatar, Dropdown, Layout, Menu } from 'antd'
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { MenuProps } from 'antd/es'
import { connect } from 'react-redux'

const { Header } = Layout

function TopHeader(props: any) {
    const navigation = useNavigate()
    const {
        role: { roleName },
        username
    } = JSON.parse(localStorage.getItem('token') as string)
    const changeCollapsed = () => {
        props.changeCollapsed()
    }
    const onMenuClick: MenuProps['onClick'] = ({ key }) => {
        if (key === '2') {
            localStorage.removeItem('token')
            navigation('/login')
        }
    }
    const menu = (
        <Menu
            onClick={onMenuClick}
            items={[
                {
                    key: '1',
                    label: <span>{roleName}</span>
                },
                {
                    key: '2',
                    label: <span>退出</span>,
                    danger: true
                }
            ]}
        />
    )

    return (
        <Header className="site-layout-background" style={{ padding: '0 16px' }}>
            {props.collapsed ? <MenuUnfoldOutlined onClick={changeCollapsed} /> : <MenuFoldOutlined onClick={changeCollapsed} />}

            <div style={{ float: 'right' }}>
                <span style={{ marginRight: '8px' }}>
                    欢迎 <span style={{ color: '#0c8cff' }}>{username}</span> 回来
                </span>
                <Dropdown overlay={menu} arrow={{ pointAtCenter: true }}>
                    <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
                </Dropdown>
            </div>
        </Header>
    )
}
const mapStateToProps = (state: any) => {
    return {
        collapsed: state.collapsedReducer.collapsed
    }
}
const mapDispatchToProps = {
    changeCollapsed() {
        return {
            type: 'change-collapsed'
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(TopHeader)
