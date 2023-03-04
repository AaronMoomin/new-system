/**
 * @Author: Aaron
 * @Date: 2022/7/18
 */
import React, { useContext, useEffect, useRef, useState } from 'react'
import axios from 'axios'

import { Button, Form, FormInstance, Input, InputRef, Modal, Table } from 'antd'
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons'

const { confirm } = Modal

interface Item {
    key: string
    name: string
    age: string
    address: string
}

interface EditableRowProps {
    index: number
}
interface EditableCellProps {
    title: React.ReactNode
    editable: boolean
    children: React.ReactNode
    dataIndex: keyof Item
    record: Item
    handleSave: (record: Item) => void
}
interface EditableCellProps {
    title: React.ReactNode
    editable: boolean
    children: React.ReactNode
    dataIndex: keyof Item
    record: Item
    handleSave: (record: Item) => void
}

export default function Category() {
    const [dataSource, setDataSource] = useState([]) as any
    useEffect(() => {
        axios.get('/api/categories/lists').then(res => {
            let list = res.data.data
            setDataSource(list)
        })
    }, [])
    const columns: any = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: (id: string) => <b>{id}</b>
        },
        {
            title: '栏目名称',
            dataIndex: 'title',
            onCell: (record: any) => ({
                record,
                editable: true,
                dataIndex: 'title',
                title: '栏目名称',
                handleSave
            })
        },
        {
            title: '操作',
            render: (item: any) => (
                <div>
                    <Button type="primary" danger shape="circle" icon={<DeleteOutlined />} onClick={() => confirmMethod(item)} />
                </div>
            )
        }
    ]
    const handleSave = (record: any) => {
        // @ts-ignore
        setDataSource(
            dataSource.map((item: any) => {
                if (item.id === record.id) {
                    return {
                        id: item.id,
                        title: record.title,
                        value: record.title
                    }
                }
                return item
            })
        )
        axios({
            method: 'post',
            url: `/api/categories/update`,
            data: {
                id: record.id,
                title: record.title,
                value: record.title
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
        let list: any = dataSource.filter((data: any) => data.id === item.rightId)
        // 二层数据修改会影响 DataSource
        list[0].children = list[0].children.filter((data: any) => data.id !== item.id)
        setDataSource([...dataSource])
        axios.delete(`/categories/${item.id}`)
    }

    const EditableContext = React.createContext<FormInstance<any> | null>(null)

    const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
        const [form] = Form.useForm()
        return (
            <Form form={form} component={false}>
                <EditableContext.Provider value={form}>
                    <tr {...props} />
                </EditableContext.Provider>
            </Form>
        )
    }

    const EditableCell: React.FC<EditableCellProps> = ({ title, editable, children, dataIndex, record, handleSave, ...restProps }) => {
        const [editing, setEditing] = useState(false)
        const inputRef = useRef<InputRef>(null)
        const form = useContext(EditableContext)!

        useEffect(() => {
            if (editing) {
                inputRef.current!.focus()
            }
        }, [editing])

        const toggleEdit = () => {
            setEditing(!editing)
            form.setFieldsValue({ [dataIndex]: record[dataIndex] })
        }

        const save = async () => {
            try {
                const values = await form.validateFields()

                toggleEdit()
                handleSave({ ...record, ...values })
            } catch (errInfo) {
                console.log('Save failed:', errInfo)
            }
        }

        let childNode = children

        if (editable) {
            childNode = editing ? (
                <Form.Item
                    style={{ margin: 0 }}
                    name={dataIndex}
                    rules={[
                        {
                            required: true,
                            message: `${title} is required.`
                        }
                    ]}
                >
                    <Input ref={inputRef} onPressEnter={save} onBlur={save} />
                </Form.Item>
            ) : (
                <div className="editable-cell-value-wrap" style={{ paddingRight: 24 }} onClick={toggleEdit}>
                    {children}
                </div>
            )
        }

        return <td {...restProps}>{childNode}</td>
    }

    return (
        <div>
            <Table
                dataSource={dataSource}
                columns={columns}
                pagination={{
                    pageSize: 5
                }}
                rowKey={(item: any) => item.id}
                components={{
                    body: {
                        row: EditableRow,
                        cell: EditableCell
                    }
                }}
            />
        </div>
    )
}
