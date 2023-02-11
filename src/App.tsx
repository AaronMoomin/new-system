import React from 'react';
import IndexRouter from "./router/IndexRouter";
import {Provider} from 'react-redux'
import './index.css';
import { PersistGate } from 'redux-persist/integration/react'
import {store,persistor} from "./redux/store";

export default function App(props: any) {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <IndexRouter/>
            </PersistGate>
        </Provider>
    );
}

