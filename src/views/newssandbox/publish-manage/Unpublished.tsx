/**
 * @Author: Aaron
 * @Date: 2022/7/18
 */
import NewsTableShow from "../../../components/publish-manage/NewsTableShow";
import usePublish from "../../../components/publish-manage/usePublish";
import {Button} from "antd";

export default function Unpublished() {

    const {dataSource,handlePublish} = usePublish(1)
    return (
        <div>
            <NewsTableShow dataSource={dataSource} button={(id:any)=><Button type="primary" onClick={()=>handlePublish(id)}>发布</Button>}/>
        </div>
    );
}

