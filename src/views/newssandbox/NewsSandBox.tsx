/**
 * @Author: Aaron
 * @Date: 2022/7/18
 */
// @ts-nocheck
import React, {useEffect} from 'react';
import TopHeader from '../../components/newsandbox/TopHeader'
import SideMenu from '../../components/newsandbox/SideMenu'
import {Outlet, useLocation} from 'react-router-dom';
import Nprogress from 'nprogress';
import 'nprogress/nprogress.css';

import './NewSandBox.css'

import {Layout, Spin} from 'antd';
import {connect} from "react-redux";
const { Content } = Layout;

function NewsSandBox(props:any) {
    Nprogress.start();
    const location = useLocation()
    useEffect(() => {
        Nprogress.done()
    }, [location,props.isLoading]);

    return (
        <Layout>
            <SideMenu/>

            <Layout className="site-layout">
                <TopHeader/>
                <Content
                    className="site-layout-background"
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        overflow:'auto'
                    }}
                >
                    <Spin size="large" className='loading' spinning={props.isLoading}>
                        <Outlet/>
                    </Spin>
                </Content>
            </Layout>
        </Layout>
    );
}
const mapStateToProps = (state:ant)=>{
    return {
        isLoading:state.loadingReducer.isLoading
    }
}
export default connect(mapStateToProps,{})(NewsSandBox)