/**
 *
 * @param obj 指向this
 * @param addrArr 地区数组
 * @param refName 计算宽度的ref
 * @returns {*}
 */
function caclUsedAddr (obj, addrArr, refName, type, objWidth) {
  let width = 0
  if (objWidth) {
    width = objWidth
  } else {
    if (!(type == 'removeAll')) {
      width = obj.$refs[refName].clientWidth - 70
    } else {
      width = obj.$refs[refName].clientWidth - 10
    }
  }

  let item
  let usedAddr = []
  let needWidth = 0
  addrArr.forEach(it => {
    item = it.split('|')
    if (usedAddr.indexOf(item[0]) < 0) {
      needWidth = item[0].length * 15 + 42
      if (width > needWidth) {
        usedAddr.push({ name: item[0], id: item[4] })
        width = width - needWidth
      }
    }
  })
  if (!(type == 'removeAll')) {
    usedAddr.push({ name: '全部', id: '' })
  }
  return usedAddr
}

function caclUsedProject (obj, addrArr, refName) {
  let width = obj.$refs[refName].clientWidth - 20
  let item
  let usedAddr = []
  let needWidth = 0
  addrArr.forEach(it => {
    item = it.split('|')[0]
    // 第四位数据，1代表热门，0代表非热门
    if (usedAddr.indexOf(item) < 0) {
      needWidth = item.length * 15 + 40
      if (width > needWidth) {
        usedAddr.push(item)
        width = width - needWidth
      }
    }
  })
  return usedAddr
}

export {
  caclUsedAddr,
  caclUsedProject
}
