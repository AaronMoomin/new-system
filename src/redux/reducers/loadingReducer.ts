/**
 * @Author: Aaron
 * @Date: 2022/7/22
 */
export const loadingReducer = (prevState = {
    isLoading: true
}, aciton: any) => {
    let {type} = aciton
    switch (type) {
        case 'change-isLoading':
            let newState = {...prevState}
            newState.isLoading = aciton.payload
            return newState
        default:
            return prevState
    }
}