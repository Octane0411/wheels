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
let that = null
function MyPromise(fn) {
    this.status = PENDING //初始化状态为pending
    this.value = null
    this.reason = null
    that = this
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

const resolvePromise = (promise, x, resolve, reject) => {
    // 如果 promise 和 x 指向同一对象，以TypeError为由拒绝执行promise
    // 这是为了防止死循环
    if (promise === x) {
        return reject(new TypeError('The promise and the return value are the same'))
    }

    if (x instanceof MyPromise) {
        // 如果x为Promise，则使promise接受x的状态
        // 也就是继续执行x，如果执行的时候拿到y，还要继续解析y
        x.then((y) => {
            resolvePromise(promise, y, resolve, reject)
        }, reject)
    }
    // 如果x为对象或者函数
    else if (typeof x === 'object' || typeof x === 'function') {
        if (x === null) {
            return resolve(x)
        }
        let then;
        try {
            // 把x.then赋值给then
            then = x.then
        } catch (err) {
            // 如果取x.then的值时抛出错误e，则以e为拒因拒绝promise
            return reject(err)
        }
        // 如果then是函数
        if (typeof x === 'function') {
            let called = false
            try {
                // 将x作为函数的this调用
                // 传递两个回调函数作为参数，第一个参数叫做 resolvePromise ，第二个参数叫做 rejectPromise
                then.call(x, (y) => {
                    // 如果 resolvePromise 和 rejectPromise 均被调用，
                    // 或者被同一参数调用了多次，则优先采用首次调用并忽略剩下的调用
                    // 实现这条需要前面加一个变量called
                    if (called) return
                    called = true
                    resolvePromise(promise, y, resolve, reject)
                }, (r) => {
                    // 如果 rejectPromise 以据因 r 为参数被调用，则以据因 r 拒绝 promise
                    if (called) return
                    called = true
                    reject(r)
                })
            } catch (err) {
                // 如果调用 then 方法抛出了异常 e：
                // 如果 resolvePromise 或 rejectPromise 已经被调用，则忽略之
                if (called) return;
                // 否则以 e 为据因拒绝 promise
                reject(err);
            }
        } else {
            // 如果then不是函数，以x为参数执行promise
            resolve(x)
        }
    } else {
        // 如果x不是对象或函数，以x为参数执行promise
        resolve(x)
    }
}

MyPromise.prototype.then = function (onFulFilled, onRejected) {
    /*---------------------预处理---------------------*/
    /*
    * 先检查onFulfilled和onRejected是不是函数，如果不是函数就忽略他们，
    * 对于onFulfilled来说“忽略”就是将value原封不动的返回，
    * 对于onRejected来说就是返回reason，onRejected因为是错误分支，返回reason应该throw一个Error
    * */
    // 如果onFulfilled不是函数，给一个默认函数，返回value
    let realOnFulFilled = typeof onFulFilled === 'function' ?
        onFulFilled
        : (value) => value
    // 如果onRejected不是函数，给一个默认函数，返回reason的Error
    let realOnRejected = typeof onRejected === 'function' ?
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

    // 如果 realOnFulFilled 或者 realOnRejected 抛出一个异常 e ，则 promise2 必须拒绝执行，并返回拒因 e。
    // 如果 onFulFilled 不是函数且 promise1 成功执行， promise2 必须成功执行并返回相同的值
    // 如果 onRejected 不是函数且 promise1 拒绝执行， promise2 必须拒绝执行并返回相同的拒因。
    // 如果 onFulfilled 或者 onRejected 返回一个值 x ，则运行下面的 Promise 解决过程：[[Resolve]](promise2, x)
    if (that.status === FULFILLED) {
        let promise2 = new MyPromise((resolve, reject) => {
            setTimeout(() => {
                try {
                    if (typeof onFulFilled !== 'function') {
                        resolve(that.value)
                    } else {
                        // 有返回值x，则promise2需要resolve(x)
                        let x = realOnFulFilled(that.value)
                        resolvePromise(promise2, x, resolve, reject)
                    }
                } catch (err) {
                    reject(err)
                }
            }, 0)

        })
        return promise2
    }
    if (that.status === REJECTED) {
        let promise2 = new MyPromise((resolve, reject) => {
            setTimeout(() => {
                try {
                    if (typeof onRejected !== 'function') {
                        reject(that.reason)
                    } else {
                        // 如果promise1的onRejected执行成功了，promise2应该resolve
                        let x = realOnRejected(that.reason)
                        resolvePromise(promise2, x, resolve, reject)
                    }
                } catch (err) {
                    reject(err)
                }
            }, 0)
        })
        return promise2
    }
    // 如果还是PENDING状态，将回调保存下来，有结果时再执行
    if (that.status === PENDING) {
        let promise2 = new MyPromise((resolve, reject) => {
            that.onFulFilledCallbacks.push(() => {
                setTimeout(() => {
                    try {
                        if (typeof onFulFilled !== 'function') {
                            resolve(that.value)
                        } else {
                            let x = realOnFulFilled(that.value)
                            resolvePromise(promise2, x, resolve, reject)
                        }
                    } catch (err) {
                        reject(err)
                    }
                }, 0)
            })

            this.onRejectedCallbacks.push(() => {
                setTimeout(() => {
                    try {
                        if (typeof onRejected !== 'function') {
                            reject(that.value)
                        } else {
                            let x = realOnRejected(that.value)
                            resolvePromise(promise2, x, resolve, reject)
                        }
                    } catch (err) {
                        reject(err)
                    }
                }, 0)
            })
        })
        return promise2
    }
}

module.exports = MyPromise