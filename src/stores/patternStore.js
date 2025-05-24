import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { cloneDeep } from 'lodash-es'

export const usePatternStore = defineStore('pattern', () => {
  // 常量定义
  const WORKSPACE_IDX = -24

  // 默认模式配置
  const defaultPattern = reactive({
    chars: "水里有很多小鱼".split(''),
    shape: 'diamond',
    fontFamily: '微软雅黑',
    lineStyle: 'solid',
    scale: 0.5 * 1.6,
    positions: [],
    colors: [],
    fontSizes: []
  })

  // 状态定义
  const workspacePattern = reactive({ ...defaultPattern })
  const tempSavePattern = reactive({ ...defaultPattern })
  const historyPattern = reactive(new Map())
  const selectedDate = reactive({ value: '' })
  const currIndex = reactive({ value: WORKSPACE_IDX })
  const totalPage = reactive({ value: 0 })

  //------------------------WARNING------------------------
  //测试用
  // 日期偏移状态
  const dayOffset = reactive({ value: 0 })
  // 是否启用日期变化
  // 用于测试日期偏移效果
  const enableDayChangeFlag = reactive({ value: false })
  enableDayChangeFlag.value = true
  let timer = null

  // 启动定时器
  function startDateTimer() {
    if (!timer) {
      console.log('Starting date timer, will increment day offset every 5 seconds')
      timer = setInterval(() => {
        dayOffset.value++
        console.log(`Day offset incremented to: ${dayOffset.value}`)
      }, 1000 * 20)
    }
  }

  // 格式化日期为YYYY/MM/DD
  function formatDate(date = new Date()) {
    const d = new Date(date)

    if (enableDayChangeFlag.value) {
      console.log(`Applying day offset ${dayOffset.value} to date`)
      console.log('Current date:', d)
      d.setDate(d.getDate() + dayOffset.value)
      console.log('New date:', d)
    }

    const result = `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`
    console.log('Formatted date:', result)
    return result
  }

  // 初始化时启动定时器
  startDateTimer()

  // 初始化
  const today = formatDate
  historyPattern.set(today(), [])
  selectedDate.value = today()
  updateTotalPage()

  function reactiveDeepCopy(source, target) {
    const rawCopy = cloneDeep(source)
    Object.keys(rawCopy).forEach(key => {
      target[key] = rawCopy[key]
    })
    return target
  }

  // 更新总页数
  function updateTotalPage() {
    const list = historyPattern.get(selectedDate.value) || []
    totalPage.value = list.length
  }

  // 根据下标获取pattern
  function getPatternByIndex(index) {
    if (index === WORKSPACE_IDX) return workspacePattern
    const list = historyPattern.get(selectedDate.value) || []
    return list[index] || defaultPattern
  }

  // 切换日期
  function switchDate(date) {
    if (!historyPattern.has(date)) {
      historyPattern.set(date, [])
    }
    selectedDate.value = date

    // 调整currIndex
    const list = historyPattern.get(date) || []
    if (currIndex.value >= list.length) {
      currIndex.value = list.length - 1
    }

    updateTotalPage()
    copyToWorkspaceOnHistory()
  }

  // 上一页
  function lastPage() {
    if (currIndex.value === WORKSPACE_IDX) {
      reactiveDeepCopy(workspacePattern, tempSavePattern)
      const list = historyPattern.get(selectedDate.value) || []
      currIndex.value = list.length - 1
      copyToWorkspaceOnHistory()
    } else if (currIndex.value > 0) {
      currIndex.value--
      copyToWorkspaceOnHistory()
    }
  }

  // 下一页
  function nextPage() {
    if (currIndex.value === WORKSPACE_IDX) return

    const list = historyPattern.get(selectedDate.value) || []
    if (currIndex.value < list.length - 1) {
      currIndex.value++
      copyToWorkspaceOnHistory()
    } else if (currIndex.value === list.length - 1) {
      reactiveDeepCopy(tempSavePattern, workspacePattern)
      currIndex.value = WORKSPACE_IDX
    }
  }

  // 创建新日期
  function newDate(dateStr = formatDate()) {
    if (!historyPattern.has(dateStr)) {
      historyPattern.set(dateStr, [])
      return true
    }
    return false
  }

  // 保存模式
  function savePattern() {
    const currentDate = formatDate()
    let targetDate = selectedDate.value

    // 如果当前日期与选择日期不同，尝试切换
    if (currentDate !== targetDate) {
      if (!historyPattern.has(currentDate)) {
        // 日期不存在则创建
        if (!newDate(currentDate)) {
          return false
        }
      }
      // 切换日期
      switchDate(currentDate)
      targetDate = currentDate
    }

    const list = historyPattern.get(targetDate) || []
    const exists = list.some(p => JSON.stringify(p) === JSON.stringify(workspacePattern))

    if (!exists) {
      const newPattern = reactive({})
      reactiveDeepCopy(workspacePattern, newPattern)
      list.push(newPattern)
      updateTotalPage()
      return true
    }
    return false
  }

  // 新建模式
  function newPattern() {
    reactiveDeepCopy(defaultPattern, workspacePattern)
    currIndex.value = WORKSPACE_IDX
  }

  // 从历史复制到工作区
  function copyToWorkspaceOnHistory() {
    if (currIndex.value !== WORKSPACE_IDX) {
      const pattern = getPatternByIndex(currIndex.value)
      reactiveDeepCopy(pattern, workspacePattern)
    }
  }

  // 获取日期列表
  function getDateList() {
    return Array.from(historyPattern.keys())
  }

  return {
    defaultPattern,
    workspacePattern,
    historyPattern,
    selectedDate,
    currIndex,
    totalPage,
    WORKSPACE_IDX,

    tempSavePattern,

    formatDate,
    reactiveDeepCopy,
    updateTotalPage,
    getPatternByIndex,
    switchDate,
    lastPage,
    nextPage,
    savePattern,
    newPattern,
    copyToWorkspaceOnHistory,
    getDateList
  }
})
