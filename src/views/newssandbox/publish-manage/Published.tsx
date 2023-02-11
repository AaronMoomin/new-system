/**
 * @Author: Aaron
 * @Date: 2022/7/18
 */
import NewsTableShow from "../../../components/publish-manage/NewsTableShow";
import usePublish from "../../../components/publish-manage/usePublish";
import {Button} from "antd";

export default function Published() {

    const {dataSource,handleSunset} = usePublish(2)

    return (
        <div>
            <NewsTableShow dataSource={dataSource}
                           button={(id:any)=><Button danger onClick={()=>handleSunset(id)}>下线</Button>}/>
        </div>
    );
}
