/**
 * @Author: Aaron
 * @Date: 2022/7/18
 */
/**
 * @Author: Aaron
 * @Date: 2022/7/18
 */
import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'

import { Button, Modal, Switch, Table } from 'antd'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { ColumnsType } from 'antd/es/table'
import UserForm from '../../../components/user-manage/UserForm'

const { confirm } = Modal

interface IRole {
    id: number
    roleName: string
    roleType: number
    rights: string[]
}

interface IUser {
    id: number
    username: string
    password: string
    roleState: boolean
    default: boolean
    region: string
    roleId: number
    role: [IRole]
}

export default function UserList() {
    const [dataSource, setDataSource] = useState<any>([])
    const [isAddVisible, setIsAddVisible] = useState(false)
    const [isUpdateVisible, setIsUpdateVisible] = useState(false)
    const [isUpdateDisabled, setIsUpdateDisabled] = useState(false)
    const [regionList, setRegionList] = useState([])
    const [roleList, setRoleList] = useState([])
    const [current, setCurrent] = useState<any>(null)
    const addForm = useRef<any>(null)
    const updateForm = useRef<any>(null)
    const { roleId, region, username } = JSON.parse(localStorage.getItem('token') as string)

    useEffect(() => {
        const roleObj: any = {
            '1': 'superadmin',
            '2': 'admin',
            '3': 'editor'
        }
        axios.get('/api/users/lists').then(res => {
            let list = res.data.data
            console.log(list, '--list')
            setDataSource(roleObj[roleId] === 'superadmin' ? list : [...list.filter((item: any) => item.username === username), ...list.filter((item: any) => item.region === region && roleObj[item.roleId] === 'editor')])
        })

        axios.get('/api/roles/lists').then(res => {
            setRoleList(res.data.data)
        })
        axios.get('/api/regions/lists').then(res => {
            setRegionList(res.data.data)
        })
    }, [])
    const columns: ColumnsType<IUser> = [
        {
            title: '区域',
            dataIndex: 'region',
            filters: [
                ...regionList.map((item: any) => ({
                    text: item.title,
                    value: item.value
                })),
                {
                    text: '全球',
                    value: '全球'
                }
            ],
            onFilter: (value: any, item: any) => {
                if (value === '全球') {
                    return item.region === ''
                }
                return item.region === value
            },
            render: (region: string) => <b>{region === '' ? '全球' : region}</b>
        },
        {
            title: '角色名称',
            dataIndex: 'role',
            render: (role: IRole) => {
                return role.roleName
            }
        },
        {
            title: '用户名',
            dataIndex: 'username'
        },
        {
            title: '用户状态',
            dataIndex: 'roleState',
            render: (roleState: boolean, item) => <Switch checked={roleState} disabled={item.default} onChange={() => handleChange(item)} />
        },
        {
            title: '操作',
            render: (item: any) => (
                <div>
                    <Button type="primary" danger shape="circle" icon={<DeleteOutlined />} disabled={item.default} onClick={() => confirmMethod(item)} />
                    <Button type="primary" shape="circle" disabled={item.default} icon={<EditOutlined />} onClick={() => handleUpdate(item)} />
                </div>
            )
        }
    ]
    const handleUpdate = async (item: any) => {
        await setIsUpdateVisible(true)
        if (item.role.id === 1) {
            setIsUpdateDisabled(true)
        } else {
            setIsUpdateDisabled(false)
        }
        updateForm.current.setFieldsValue(item)
        setCurrent(item)
    }
    const handleChange: any = (item: IUser) => {
        item.roleState = !item.roleState
        setDataSource([...dataSource])
        axios({
            method: 'post',
            url: '/api/users/updateRoleState',
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            data: {
                id: item.id,
                roleState: item.roleState ? 1 : 0
            }
        })
    }
    const confirmMethod: any = (item: any) => {
        confirm({
            title: '确定删除吗?',
            icon: <ExclamationCircleOutlined />,
            onOk: function () {
                deleteMethod(item)
            },
            onCancel() {}
        })
    }
    const deleteMethod: any = (item: any) => {
        setDataSource(dataSource.filter((data: any) => data.id !== item.id))
        axios.delete(`/api/users/deleteUser/${item.id}`)
    }
    const addFormOk = () => {
        addForm.current
            .validateFields()
            .then((value: any) => {
                setIsAddVisible(false)
                addForm.current.resetFields()
                axios({
                    method: 'post',
                    url: '/api/users/addUser',
                    data: {
                        ...value,
                        roleState: 1,
                        _default: 0
                    }
                }).then((res: any) => {
                    console.log(res, '---add')
                    setDataSource([
                        ...dataSource,
                        {
                            ...res.data.data,
                            role: roleList.filter((item: IUser) => item.id === value.roleId)[0]
                        }
                    ])
                })
            })
            .catch((error: any) => {
                console.log(error)
            })
    }
    const updateFormOk = () => {
        updateForm.current
            .validateFields()
            .then((value: any) => {
                setIsUpdateVisible(false)
                setDataSource(
                    dataSource.map((item: IUser) => {
                        if (item.id === current.id) {
                            return {
                                ...item,
                                ...value,
                                role: roleList.filter((item: IUser) => item.id === value.roleId)[0]
                            }
                        }
                        return item
                    })
                )
                setIsUpdateDisabled(!isUpdateDisabled)
                console.log(value, current.id, '---value')
                axios.post(`/api/users/updateUser`, {
                    id: current.id,
                    ...value
                })
            })
            .catch((error: any) => {
                console.log(error)
            })
    }
    return (
        <div>
            <Button
                type="primary"
                onClick={() => {
                    setIsAddVisible(true)
                }}
            >
                添加用户
            </Button>
            <Table
                dataSource={dataSource}
                columns={columns}
                rowKey={item => item.id}
                pagination={{
                    pageSize: 5
                }}
            />

            <Modal
                visible={isAddVisible}
                title="添加用户"
                okText="确定"
                cancelText="取消"
                onCancel={() => {
                    setIsAddVisible(false)
                }}
                onOk={() => addFormOk()}
            >
                <UserForm ref={addForm} regionList={regionList} roleList={roleList} />
            </Modal>

            <Modal
                visible={isUpdateVisible}
                title="更新用户"
                okText="更新"
                cancelText="取消"
                onCancel={() => {
                    setIsUpdateVisible(false)
                    setIsUpdateDisabled(!isUpdateDisabled)
                }}
                onOk={() => updateFormOk()}
            >
                <UserForm ref={updateForm} isUpdateDisabled={isUpdateDisabled} regionList={regionList} roleList={roleList} isUpdate={true} />
            </Modal>
        </div>
    )
}
