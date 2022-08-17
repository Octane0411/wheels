import React, {useContext, useEffect, useState} from "react";

let state = undefined
let reducer = undefined
let listeners = []

const setState = (newState) => {
    state = newState
    listeners.map(fn => fn(state))
}

const store = {
    getState(){
        return state
    },
    dispatch: (action) => {
        setState(reducer(state, action))
    },
    subscribe(fn) {
        listeners.push(fn)
        return () => {
            const index = listeners.indexOf(fn)
            listeners.splice(index, 1)
        }
    },
}

let dispatch = store.dispatch
const prevDispatch = dispatch
dispatch = (action) => {
    if (action instanceof Function) {
        action(dispatch)// action里接受的dispatch可能还会传一个函数
    } else {
        prevDispatch(action)
    }
}

const prevDispatch2 = dispatch
dispatch = (action) => {
    if (action.payload instanceof Promise) {
        action.payload.then((data) => {
            dispatch({...action, payload: data}) // payload接受的可能还是一个promise
        })
    } else {
        prevDispatch2(action)
    }
}

export const createStore = (_reducer, initState) => {
    state = initState
    reducer = _reducer
    return store
}

const changed = (oldState, newState) => {
    let changed = false
    for (const key in oldState) {
        if (oldState[key] !== newState[key]) {
            changed = true
        }
    }
    return changed
}

export const connect = (selector, dispatchSelector) => (Component) => {
    return (props) => {
        const [_, update] = useState({})
        const data = selector? selector(state): {state: state}// 如果不传selector，我们就把state传递给props
        const dispatchers = dispatchSelector? dispatchSelector(dispatch): {dispatch}
        useEffect(() => {
            const unsubscribe = store.subscribe(() => {
                const newData = selector? selector(state) : {state: state}
                if (changed(data, newData)) {
                    console.log('update')
                    update({}) // 因为空对象不等于空对象，所以我们可以这样做
                }
            })
            // 这里最好加一个取消订阅，否则selector变化的时候会出现重复订阅，虽然正常情况下他不会变
            return unsubscribe
        }, [selector]) // 我们依赖的外部属性都要加到这里面
        return <Component {...dispatchers} {...data} {...props}/>
    }
}

export const appContext = React.createContext(null)

export const Provider = ({store, children}) => {
    return (
        <appContext.Provider value={store}>
            {children}
        </appContext.Provider>
    )
}