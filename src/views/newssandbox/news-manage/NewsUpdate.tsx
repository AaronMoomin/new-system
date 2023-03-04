/**
 * @Author: Aaron
 * @Date: 2022/7/21
 */
import React, { useEffect, useRef, useState } from 'react'
import { Button, Form, Input, message, notification, PageHeader, Select, Steps } from 'antd'
import style from './news.module.sass'
import axios from 'axios'
import MyEditor from '../../../components/news-manage/MyEditor'
import { useNavigate, useParams } from 'react-router-dom'

const { Step } = Steps
const { Option } = Select

interface ICategory {
    id: number
    title: string
    value: string
}

export default function NewsUpdate() {
    const navigation = useNavigate()
    const params = useParams()
    const [current, setCurrent] = useState(0)
    const [categoryList, setCategoryList] = useState([])
    const [formInfo, setFormInfo] = useState({})
    const [content, setContent] = useState('')
    const updateForm: any = useRef(null)
    useEffect(() => {
        axios.get(`/api/categories/lists`).then((res: any) => {
            setCategoryList(res.data.data)
        })
    }, [])
    useEffect(() => {
        axios.get(`/api/news/lists/preview/${params.id}`).then(res => {
            let { title, categoryId, content } = res.data.data
            updateForm.current.setFieldsValue({
                title,
                categoryId
            })
            setFormInfo({
                title,
                categoryId
            })
            setContent(content)
        })
    }, [])
    const toNext = () => {
        if (current === 0) {
            updateForm.current
                .validateFields()
                .then((res: any) => {
                    setFormInfo(res)
                    setCurrent(current + 1)
                })
                .catch((err: any) => console.log(err))
        } else {
            if (content === '' || content.trim() === '<p></p>') {
                message.error('新闻内容不能为空!')
            } else {
                setCurrent(current + 1)
            }
        }
    }
    const toPrevious = () => {
        setCurrent(current - 1)
    }

    const handleSave = (auditState: number) => {
        axios
            .post(`/api/news/update/${params.id}`, {
                ...formInfo,
                content: content,
                auditState: auditState
            })
            .then(res => {
                navigation(auditState === 0 ? '/news-manage/draft' : '/audit-manage/list')
                notification.info({
                    message: `通知`,
                    description: `您可以到${auditState === 0 ? '草稿箱' : '审核列表'}中查看您的新闻`,
                    placement: 'bottomRight'
                })
            })
    }
    return (
        <div>
            <PageHeader onBack={() => navigation(-1)} className="site-page-header" title="更新新闻" />
            <Steps current={current}>
                <Step title="基本信息" description="新闻标题,新闻分类" />
                <Step title="新闻内容" description="新闻主体内容" />
                <Step title="新闻提交" description="保存草稿或提交审核" />
            </Steps>

            <div style={{ marginTop: '50px' }}>
                <div className={current === 0 ? '' : style.hidden}>
                    <Form ref={updateForm} name="basic" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                        <Form.Item label="新闻标题" name="title" rules={[{ required: true, message: '请输入新闻标题!' }]}>
                            <Input />
                        </Form.Item>

                        <Form.Item label="新闻类别" name="categoryId" rules={[{ required: true, message: '请选择新闻类别!' }]}>
                            <Select>
                                {categoryList.map((category: ICategory) => (
                                    <Option key={category.id} value={category.id}>
                                        {category.title}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Form>
                </div>
                <div className={current === 1 ? '' : style.hidden}>
                    <MyEditor
                        content={content}
                        getContent={(value: any) => {
                            setContent(value)
                        }}
                    ></MyEditor>
                </div>
                <div className={current === 2 ? '' : style.hidden}></div>
            </div>

            <div style={{ marginTop: '50px' }}>
                {current == 2 && (
                    <span>
                        <Button type="primary" onClick={() => handleSave(0)}>
                            保存草稿
                        </Button>
                        <Button danger onClick={() => handleSave(1)}>
                            提交审核
                        </Button>
                    </span>
                )}
                {current < 2 && (
                    <Button type="primary" onClick={() => toNext()}>
                        下一步
                    </Button>
                )}
                {current > 0 && <Button onClick={() => toPrevious()}>上一步</Button>}
            </div>
        </div>
    )
}
