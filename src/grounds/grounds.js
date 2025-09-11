export function newGround(value) {
    value = value.replace(/\s*/g, "").replace(/，/gi, ",").replace(/~{2,}/g, "~").replace(/-{2,}/g, "-").replace(/,{2,}/g, ",");
    if (value.charAt(value.length - 1) == ",") {
        value = value.substring(0, value.lastIndexOf(','));
        return value
    } else {
        return value
    }
}
export function groundTest(value) {
    let containSpecial = /[!@#$%^&*()+=\[\]{}|\\;:'"./<>?]+/;
    let chinese = new RegExp("[\\u4E00-\\u9FFF]+", "g");
    let english = new RegExp("[a-zA-Z]+", "g");
    if (
        containSpecial.test(value) ||
        chinese.test(value) ||
        english.test(value)
    ) {
        return true
    } else {
        return false
    }
}

export function rightGround(value) {
    let rightGroundArr = []
    for (let i = 0; i < value.length; i++) {
        if (value[i].indexOf("~") == -1) {
            let num = Number(value[i])
            if (isNaN(num)) {
                return false
            }
            if (num == 0 || num < -5 || num > 100) {
                return false
            }
            rightGroundArr.push(num)
        } else {
            let newArr = value[i].split("~");
            if (newArr.length > 2) {
                return false
            }
            let firstNum = Number(newArr[0])
            let endNum = Number(newArr[1])
            if (isNaN(firstNum) || isNaN(endNum)) {
                return false
            }
            if (firstNum == 0 || firstNum < -5 || firstNum > 100 || endNum == 0 || endNum < -5 || endNum > 100) {
                return false
            }
            if (firstNum >= endNum) {
                return false
            }
            for (let i = firstNum; i < endNum + 1; i++) {
                if (i != 0) {
                    rightGroundArr.push(i)
                }
            }
        }
    }
    return rightGroundArr
}