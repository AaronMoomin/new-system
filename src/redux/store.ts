/**
 * @Author: Aaron
 * @Date: 2022/7/22
 */
import {createStore,combineReducers} from "redux";
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import {collapsedReducer} from "./reducers/collapsedReducer";
import {loadingReducer} from "./reducers/loadingReducer";
const persistConfig = {
    key: 'root',
    storage,
    blacklist:['loadingReducer']
}
const reducer = combineReducers({
    collapsedReducer,
    loadingReducer,
})
const persistedReducer = persistReducer(persistConfig, reducer)

const store = createStore(persistedReducer)
const persistor = persistStore(store)

export { store, persistor }