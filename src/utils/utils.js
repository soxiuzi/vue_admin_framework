/**
 * 一维数组去重
 * @param {Array} arr 去重数组
 */
export function filterArrOne(arr) {
    let result = [];
    for(let i = 0; i < arr.length; i++) {
        if(result.indexOf(arr[i]) < 0) {
            result.push(arr[i])
        }
    }
    return result
}

/**
 * 一维数组对象去重
 * @param {Array} arr 去重数组
 * @param {String} attribute 判断重复的属性
 */
export function filterArrOneObj(arr, attribute) {
    let obj = {};
    let result = arr.reduce(function(item, next) {
        if(!obj[next[attribute]]) {
            item.push(next);
            obj[next[attribute]] = true
        }
        return item
    }, [])
    return result
}

/**
 * 对象 | 数组深拷贝
 * @param {Obj | Array} obj 拷贝对象
 */

export function deepCopy(obj) {
    let result = Array.isArray(obj) ? [] : {}
    for(let key in obj) {
        if(typeof obj[key] === 'object') {
            result[key] = deepCopy(obj[key]) // 递归复制
        }else {
            result[key] = obj[key]
        }
    }
    return result
}