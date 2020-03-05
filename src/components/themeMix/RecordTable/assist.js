function deepCopy(data) {
  const t = Object.prototype.toString.call(data).slice(8, -1)
  let o
  if (t === 'Array') {
    o = []
  } else if (t === 'Object') {
    o = {}
  } else {
    return data
  }

  if (t === 'Array') {
    for (let i = 0; i < data.length; i++) {
      o.push(deepCopy(data[i]))
    }
  } else if (t === 'Object') {
    for (let i in data) {
      o[i] = deepCopy(data[i])
    }
  }

  return o
}

export {
  deepCopy
}

const getRandomStr = function (len = 32) {
  const $chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
  const maxPos = $chars.length
  let str = ''
  for (let i = 0; i < len; i++) {
    str += $chars.charAt(Math.floor(Math.random() * maxPos))
  }
  return str
}

export {
  getRandomStr
}


const getAllColumns = cols => {
  const columns = deepCopy(cols)
  const result = []
  columns.forEach(column => {
    if (column.children) {
      result.push(getAllColumns(column.children))
    } else {
      result.push(column)
    }
  })
  return result
}
export {
  getAllColumns
}
