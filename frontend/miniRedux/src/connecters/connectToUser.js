import {connect} from "../redux";

const userSelector = (state) => {
    return {user: state.user}
}

const userDispatcher = (dispatch) => {
    return {
        updateUser: (arg) => {
            dispatch({type: 'updateUser', payload: arg})
        }
    }
}

export const connectToUser = connect(userSelector, userDispatcher)