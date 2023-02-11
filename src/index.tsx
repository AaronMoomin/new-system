import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import './utils/http'
import reportWebVitals from './reportWebVitals';
import {message} from "antd";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
message.config({
    duration: 2,
    maxCount: 3,
});
root.render(
    <App />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
