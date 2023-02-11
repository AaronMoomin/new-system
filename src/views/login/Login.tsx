/**
 * @Author: Aaron
 * @Date: 2022/7/18
 */
import React from 'react';
import MyParticles from "../../components/login/MyParticles";

import './login.sass'
import {Button, Form, Input, message} from "antd";
import {UserOutlined,LockOutlined} from "@ant-design/icons";
import axios from "axios";
import {useNavigate} from "react-router-dom";

export default function Login() {
    const navigation = useNavigate()
    const onFinish = (values:any)=>{
        console.log(values)
        axios.get(`/users?username=${values.username}&password=${values.password}&roleState=true&_expand=role`)
            .then((res: any) => {
            if (res.data.length === 0) {
                message.error('账号或密码错误!');
            }else{
                console.log(res.data,'---reas')
                localStorage.setItem('token',JSON.stringify(res.data));
                message.success('登录成功~')
                navigation('/')
            }
        })
    }
    return (
        <div style={{height: '100%',overflow:'hidden'}}>
            <MyParticles/>
            <div className="login-container">
                <div className='title'>全球新闻管理系统</div>
                <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Please input your Username!' }]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your Password!' }]}
                    >
                        <Input
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="Password"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button block type="primary" htmlType="submit">
                            登录
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}
