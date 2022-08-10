let request = require('request')
let MyPromise = require('./MyPromise')

let promise1 = new MyPromise((resolve) => {
    request("https://www.baidu.com", (err, resp) => {
        if (!err && resp.statusCode === 200) {
            resolve('request1 success')
        }
    })
})
promise1.then((v) => {
    console.log(v)
})

let promise2 = new MyPromise((_, reject) => {
    request("https://www.baidu.com", (err, resp) => {
        if (!err && resp.statusCode === 200) {
            reject('request2 failed')
        }
    })
})

promise2.then((v) => {
    console.log(v
    )}, (reason) => {
    console.log(reason)
})