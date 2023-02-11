/**
 * @Author: Aaron
 * @Date: 2022/7/18
 */
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";

export default function Redirect({ to }:any) {
    let navigate = useNavigate();
    useEffect(() => {
        navigate(to);
    });
    return null;
}