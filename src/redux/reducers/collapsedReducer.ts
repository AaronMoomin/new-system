/**
 * @Author: Aaron
 * @Date: 2022/7/22
 */
export const collapsedReducer = (prevState = {
    collapsed: false
}, aciton: any) => {
    let {type} = aciton
    switch (type) {
        case 'change-collapsed':
            let newState = {...prevState}
            newState.collapsed = !newState.collapsed
            return newState
        default:
            return prevState
    }
}