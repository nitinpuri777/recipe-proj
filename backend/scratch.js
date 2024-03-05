let map = (list, fn) => {
  let newList = []
  for(let item of list) {
    newList.push(fn(item))
  }
  return newList
}

let map2 = (list, fn) => {
  let mapAndPushToNewList = (newList, item) => {
    newList.push(fn(item)) 
    return newList
  }
  return reduce(list, mapAndPushToNewList, [])
}


let filter = (list, fn) => {
  let newList = []
  for(let item of list) {
    if(fn(item)) {
      newList.push(item)
    }
  }
  return newList
}

let reduce = (list, fn, initialValue) => {
  let retValue = initialValue
  for(let i =0; i< list.length; i++) {
    let item = list[i]
    retValue = fn(retValue, item, i, list)
  }
  return retValue
}


let add = (num1, num2) => {
  return num1 + num2 
}

let double = (num1) => {
  return num1*2 
}

let isGreaterThan3 = (num1) => {
  return num1 > 3
}



let list = [1,2,3,4,5]
console.log(map(list,double))
console.log(filter(list,isGreaterThan3))
console.log(reduce(list, add, 10))