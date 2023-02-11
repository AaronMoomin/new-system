/**
 * @Author: Aaron
 * @Date: 2022/7/18
 */
import React, {useEffect, useRef, useState} from 'react';
import {Avatar, Card, Col, Drawer, List, Row} from 'antd';
import {EditOutlined, EllipsisOutlined, PieChartOutlined, UserOutlined} from '@ant-design/icons';
import axios from "axios";
import * as echarts from 'echarts';
// @ts-ignore
import _ from 'lodash';
import {Link} from 'react-router-dom';

const {Meta} = Card;

export default function Home() {
    const [viewList, setViewList] = useState([]);
    const [starList, setStarList] = useState([]);
    const [allList, setAllList] = useState([]);
    const [visible, setVisible] = useState(false);
    const [pieChart, setPieChart] = useState(null);
    const barRef = useRef(null);
    const pieRef = useRef(null);
    const {username, region, role: {roleName}} = JSON.parse(localStorage.getItem('token') as string)[0]
    useEffect(() => {
        axios.get(`/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6`)
            .then(res => {
                console.log(res.data,'-/news');
                setViewList(res.data);
            })
    }, []);
    useEffect(() => {
        axios.get(`/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6`)
            .then(res => {
                setStarList(res.data);
            })
    }, []);
    useEffect(() => {
        axios.get(`/news?publishState=2&_expand=category`).then(res => {
            console.log(res.data,'/news?publishState=2&_expand=category');
            renderBar(_.groupBy(res.data,(item:any)=>item.category.title))
            setAllList(res.data)
        })

        return ()=>{
            window.onresize = null
        }
    }, []);
    const renderBar = (obj:any)=>{
        let chartDom = barRef.current
        // @ts-ignore
        let myChart = echarts.init(chartDom);
        let option;
        option = {
            title: {text: '新闻分类图示'},
            legend: {
                data:['数量']
            },
            xAxis: {
                type: 'category',
                axisLabel:{
                    rotate:'45',
                    interval:0
                },
                data: Object.keys(obj)
            },
            yAxis: {
                type: 'value',
                minInterval:1
            },
            series: [
                {
                    name:'数量',
                    data: Object.values(obj).map((item:any)=>item.length),
                    type: 'bar'
                }
            ]
        };

        option && myChart.setOption(option);

        window.onresize = ()=>{myChart.resize()}

    }
    const renderPie = ()=>{
        const currentList = allList.filter((item: any) => item.author === username);
        let groupObj = _.groupBy(currentList,(item:any)=>item.category.title)
        const list = [];
        for (let i in groupObj) {
            list.push({
                name:i,
                value:groupObj[i].length
            })
        }
        const chartDom = pieRef.current;
        // @ts-ignore
        let myChart;
        if (!pieChart){
            // @ts-ignore
            myChart = echarts.init(chartDom);

            // @ts-ignore
            setPieChart(myChart)
        }else{
            myChart = pieChart
        }
        let option;
        option = {
            tooltip: {
                trigger: 'item'
            },
            legend: {
                top: '5%',
                left: 'center'
            },
            series: [
                {
                    name: '新闻类别',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 10,
                        borderColor: '#fff',
                        borderWidth: 2
                    },
                    label: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: '40',
                            fontWeight: 'bold'
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: list
                }
            ]
        };

        option && myChart.setOption(option);

        window.onresize = ()=>{ // @ts-ignore
            myChart.resize()}

    }

    return (
        <div className="site-card-wrapper">
            <Row gutter={16}>
                <Col span={8}>
                    <Card title="用户最常浏览" bordered={true}>
                        <List
                            size="small"
                            dataSource={viewList}
                            renderItem={(item: any) => <List.Item>
                                <Link to={`/news-manage/preview/${item.id}`}>{item.title}</Link>
                            </List.Item>}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="用户点赞最多" bordered={true}>
                        <List
                            size="small"
                            dataSource={starList}
                            renderItem={(item: any) => <List.Item>
                                <Link to={`/news-manage/preview/${item.id}`}>{item.title}</Link>
                            </List.Item>}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card
                        cover={
                            <img
                                alt="example"
                                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                            />
                        }
                        actions={[
                            <PieChartOutlined key="setting" onClick={ () => {
                                setVisible(true)
                                renderPie()
                            }}/>,
                            <EditOutlined key="edit"/>,
                            <EllipsisOutlined key="ellipsis"/>,
                        ]}
                    >
                        <Meta
                            avatar={<Avatar style={{backgroundColor: '#87d068'}} icon={<UserOutlined/>}/>}
                            title={username}
                            description={<div>
                                <b>{region ? region : '全球'}</b>
                                <span style={{marginLeft: '25px'}}>{roleName}</span>
                            </div>}
                        />
                    </Card>
                </Col>

                <Drawer title="个人新闻分类" placement="right"
                        width="500px"
                        onClose={()=>{
                            setVisible(false)
                        }}
                        visible={visible}>
                    <div ref={pieRef}
                         style={{width: '100%', height: '600px'}}>

                    </div>
                </Drawer>
                <div ref={barRef} style={{marginTop: '20px', width: '100%', height: '300px'}}>

                </div>
            </Row>

        </div>
    );
}
