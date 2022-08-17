let request = require('request')
let MyPromise = require('./MyPromise')

let promise1 = new MyPromise((resolve) => {
    request("https://www.baidu.com", (err, resp) => {
        if (!err && resp.statusCode === 200) {
            resolve('request1 success')
        }
    })
})
let p = promise1.then((v) => {
    console.log("1", v)
    return 1
}).then((v) => {
    console.log("2", v)
}).then()

setTimeout(() => {
    console.log(p)
}, 1000)

let promise2 = new MyPromise((_, reject) => {
    request("https://www.baidu.com", (err, resp) => {
        if (!err && resp.statusCode === 200) {
            reject('request2 failed')
        }
    })
})

promise2.then((v) => {
    console.log("3", v)
}, (reason) => {
    console.log("4", reason)
})