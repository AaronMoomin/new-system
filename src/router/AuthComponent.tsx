/**
 * @Author: Aaron
 * @Date: 2022/7/18
 */
import React from 'react';
import Redirect from "./Redirect";

export default function AuthComponent(props: any) {
    return (
        localStorage.getItem('token') ? props.children : <Redirect to='/login'/>
    );
}
