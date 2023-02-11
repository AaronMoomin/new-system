/**
 * @Author: Aaron
 * @Date: 2022/7/19
 */
import React, {forwardRef, useEffect, useState} from 'react';
import {Form, Input, Select} from "antd";
import {EyeInvisibleOutlined, EyeTwoTone} from '@ant-design/icons';

const {Option} = Select;

const UserForm = forwardRef((props: any, ref: any) => {
    const [isDisabled, setIsDisabled] = useState(false);
    const {roleId, region} = JSON.parse((localStorage.getItem('token')) as string)[0]

    useEffect(() => {

        setIsDisabled(props.isUpdateDisabled)
    }, [props.isUpdateDisabled]);
    const roleObj: any = {
        "1": "superadmin",
        "2": "admin",
        "3": "editor"
    }
    const checkRegionDisabled = (item: any) => {
        if (props.isUpdate) { //更新
            if (roleObj[roleId] === 'superadmin') {
                return false
            } else {
                return true
            }
        } else { //新建
            if (roleObj[roleId] === 'superadmin') {
                return false
            } else {
                return item.value !== region //只有自己所在区域可选
            }
        }
    }
    const checkRoleDisabled = (item: any) => {
        if (props.isUpdate) { //更新
            if (roleObj[roleId] === 'superadmin') {
                return false
            } else {
                return true
            }
        } else { //新建
            if (roleObj[roleId] === 'superadmin') {
                return false
            } else {
                return roleObj[item.id] !== 'editor'
            }
        }
    }
    return (
        <Form
            ref={ref}
            layout="vertical"
        >
            <Form.Item
                name="username"
                label="用户名"
                rules={[{required: true, message: '请输入用户名!'}]}
            >
                <Input/>
            </Form.Item>
            <Form.Item
                name="password"
                label="密码"
                rules={[{required: true, message: '请输入密码!'}]}
            >
                <Input.Password
                    iconRender={visible => (visible ? <EyeTwoTone/> : <EyeInvisibleOutlined/>)}
                />
            </Form.Item>
            <Form.Item
                name="region"
                label="区域"
                rules={isDisabled ? [] : [{required: true, message: '请选择区域!'}]}
            >
                <Select disabled={isDisabled}>
                    {
                        props.regionList.map((region: any) =>
                            <Option disabled={checkRegionDisabled(region)} key={region.id}
                                    value={region.value}>{region.title}</Option>
                        )
                    }
                </Select>
            </Form.Item>
            <Form.Item
                name="roleId"
                label="角色"
                rules={[{required: true, message: '请选角色!'}]}
            >
                <Select onChange={(value) => {
                    if (value === 1) {
                        setIsDisabled(true)
                        ref.current.setFieldsValue({
                            region: ''
                        })
                    } else {
                        setIsDisabled(false)
                    }
                }}>
                    {
                        props.roleList.map((role: any) =>
                            <Option disabled={checkRoleDisabled(role)} key={role.id} value={role.id}>{role.roleName}</Option>
                        )
                    }
                </Select>
            </Form.Item>
        </Form>
    );
})
export default UserForm