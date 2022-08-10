/*
Promise/A+规范： https://github.com/promises-aplus/promises-spec

promise：是一个拥有 then 方法的对象或函数，其行为符合本规范
thenable：是一个定义了 then 方法的对象或函数。这个主要是用来兼容一些老的Promise实现，只要一个Promise实现是thenable，也就是拥有then方法的，就可以跟Promises/A+兼容。
value：指resolve出来的值，可以是任何合法的JS值(包括 undefined , thenable 和 promise等)
exception：异常，在Promise里面用throw抛出来的值
reason：拒绝原因，是reject里面传的参数，表示reject的原因
* */

const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'
/*
* Promise类
* */
function MyPromise(fn) {
    this.status = PENDING //初始化状态为pending
    this.value = null
    this.reason = null

    // 为了支持then的链式调用，需要用一个数组存所有注册的回调，在有结果时调用
    this.onFulFilledCallbacks = []
    this.onRejectedCallbacks = []

    const resolve = (value) => {
        if (this.status === PENDING) {
            this.status = FULFILLED
            this.value = value
            this.onFulFilledCallbacks.forEach((callback) => {
                callback(this.value)})
        }
    }
    const reject = (reason) => {
        if (this.status === PENDING) {
            this.status = REJECTED
            this.reason = reason
            this.onRejectedCallbacks.forEach((callback) => {
                callback(this.reason)
            })
        }
    }

    try {
        fn(resolve, reject)
    } catch (e) {
        reject(e)
    }
}

/*
* 先检查onFulfilled和onRejected是不是函数，如果不是函数就忽略他们，
* 对于onFulfilled来说“忽略”就是将value原封不动的返回，
* 对于onRejected来说就是返回reason，onRejected因为是错误分支，返回reason应该throw一个Error
* */
MyPromise.prototype.then = function (onFulfilled, onRejected) {
    /*---------------------预处理---------------------*/
    // 如果onFulfilled不是函数，给一个默认函数，返回value
    onFulfilled = typeof onFulfilled === 'function' ?
        onFulfilled
        : (value) => value
    // 如果onRejected不是函数，给一个默认函数，返回reason的Error
    onRejected = typeof onRejected === 'function' ?
        onRejected
        : (reason) => {
            if (reason instanceof Error) {
                throw reason
            } else {
                throw new Error(reason)
            }
        }
    /*---------------------预处理---------------------*/

    // 根据规范then的返回值必须是一个promise
    // 如果 onFulfilled 或者 onRejected 抛出一个异常 e ，则 promise2 必须拒绝执行，并返回拒因 e。
    if (this.status === FULFILLED) {
        let promise2 = new MyPromise((resolve, reject) => {
            try {
                onFulfilled(this.value)
            } catch (err) {
                reject(err)
            }
        })
        onFulfilled(this.value)
    }
    if (this.status === REJECTED) {
        onRejected(this.reason)
    }
    // 如果还是PENDING状态，将回调保存下来
    if (this.status === PENDING) {
        this.onFulFilledCallbacks.push(onFulfilled)
        this.onRejectedCallbacks.push(onRejected)
    }

}

module.exports = MyPromise