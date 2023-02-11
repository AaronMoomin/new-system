/**
 * @Author: Aaron
 * @Date: 2022/7/18
 */
import {
    HomeOutlined,
    UserOutlined,
    TeamOutlined,
    ToolOutlined,
    RobotOutlined,
    EyeOutlined,
    FileTextOutlined,
    FileAddOutlined,
    InsuranceOutlined,
    HddOutlined,
    SearchOutlined,
    TableOutlined,
    UploadOutlined,
    SoundOutlined,
    LineOutlined
} from '@ant-design/icons'

export default {
    "/home": <HomeOutlined />,
    "/user-manage": <UserOutlined />,
    "/user-manage/list": <TeamOutlined />,
    "/right-manage": <ToolOutlined />,
    "/right-manage/role/list": <RobotOutlined />,
    "/right-manage/right/list": <EyeOutlined />,
    "/news-manage": <FileTextOutlined />,
    "/news-manage/add": <FileAddOutlined />,
    "/news-manage/category": <HddOutlined />,
    "/news-manage/draft": <InsuranceOutlined />,
    "/audit-manage": <SearchOutlined />,
    "/audit-manage/audit": <SearchOutlined />,
    "/audit-manage/list": <TableOutlined />,
    "/publish-manage": <UploadOutlined />,
    "/publish-manage/unpublished": <HddOutlined />,
    "/publish-manage/published": <SoundOutlined />,
    "/publish-manage/sunset": <LineOutlined />,
}