/**
 * @Author: Aaron
 * @Date: 2022/7/21
 */
import usePublish from "../../../components/publish-manage/usePublish";
import NewsTableShow from "../../../components/publish-manage/NewsTableShow";
import {Button} from "antd";

export default function Sunset() {

    const {dataSource,handleDelete} = usePublish(3)
    return (
        <div>
            <NewsTableShow dataSource={dataSource}
                           button={(id:any)=><Button type="primary" danger onClick={()=>handleDelete(id)}>删除</Button>}/>
        </div>
    );
}
