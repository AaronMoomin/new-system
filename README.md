# 全球新闻管理系统
实现用户权限管理，实现登录，新闻编写、审核、发布等功能
    
### 技术点
前端：
* reacthooks
* antd
* typescript
* echarts  
* redux
* react-redux  

后端：
* 使用json-server模仿接口

###启动
    npm star
###后端接口启动
    json-server --watch --port 8000 ./db/db.json

###路由
- 后台主页面："/home" 
- 游客新闻列表："/news"  
- 游客新闻详情："/detail/:id"