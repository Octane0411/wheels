import React, {Component, useContext, useEffect, useState} from 'react'
import {connect, appContext, createStore, Provider} from "./redux.jsx";
import {connectToUser} from "./connecters/connectToUser";

const reducer = (state, {type, payload}) => {
    if (type === 'updateUser') {
        return {
            ...state,
            user: {
                ...state.user,
                ...payload
            }
        }
    } else {
        return state
    }
}
const initState = {
    user: {name: 'octane', age: 1},
    group: {name: '前端组'}
}
const store = createStore(reducer, initState)

export const App = () => {
  return (
    <Provider store={store}>
        <FirstChild/>
        <SecondChild/>
        <ThirdChild/>
    </Provider>
  )
}
const FirstChild = () => {
  console.log("FirstChild!")
  return <section>FirstChild<User/></section>
}
const SecondChild = () => {
  console.log("SecondChild!")
  return <section>SecondChild<UserModifier/></section>
}
const ThirdChild = connect((state) => {
  return {group: state.group}
})((group) => {
  console.log("ThirdChild!")
  return <section>ThirdChild <div>Group: {group.name}</div></section>
})

const User = connectToUser(({user}) => {
  return <div>User:{user.name}</div>
})

const ajax = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({data: {name: '3秒后的我'}})
        }, 3000)
    })
}

const fetchUser = (dispatch) => {
    ajax('/user').then((resp) => {
        dispatch({type: 'updateUser', payload: resp.data})
    })
}

const UserModifier = connect(null, null)(({state, dispatch}) => {
    const onClick = (e) => {
        // dispatch(fetchUser)
        dispatch({type: 'updateUser', payload: ajax('/user').then(resp => resp.data)})
    }
    return <div>
        <div>User: {state.user.name}</div>
        <button onClick={onClick}>异步获取 user</button>
    </div>
})
/*const UserModifier = connectToUser(({updateUser, user, children}) => {
  const onChange = (e) => {
     updateUser({name: e.target.value})
  }
  return <div>
    {children}
    <input value={user.name}
      onChange={onChange}/>
  </div>
})*/


