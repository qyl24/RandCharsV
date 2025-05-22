import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { cloneDeep } from 'lodash-es'

export const usePatternStore = defineStore('pattern', () => {
  // 默认模式配置
  const defaultPattern = reactive({
    chars: "水里有很多小鱼".split(''),
    shape: 'diamond',
    fontFamily: '微软雅黑',
    lineStyle: 'solid',
    scale: 0.5,
    positions: [],
    colors: [],
    fontSizes: []
  })

  // 工作区模式
  const workspacePattern = reactive({...defaultPattern})

  // 历史模式列表，按日期存储
  const patterns = reactive({})

  // 格式化日期时间为YYYY/MM/DD HH:MM:SS
  function formatDateTime(date = new Date()) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`
  }

  // 保留响应性的深拷贝方法
  function reactiveDeepCopy(source, target) {
    const rawCopy = cloneDeep(source)
    Object.keys(rawCopy).forEach(key => {
      target[key] = rawCopy[key]
    })
    return target
  }

  // 获取所有日期列表
  function getDateList() {
    return Object.keys(patterns)
  }

  // 复制默认模式到工作区
  function copyDefaultToWorkspace() {
    return reactiveDeepCopy(defaultPattern, workspacePattern)
  }

  // 保存工作区模式到历史
  function saveToPatterns(datetime = formatDateTime()) {
    // 检查是否已有相同内容
    const exists = Object.values(patterns).some(pattern => 
      JSON.stringify(pattern.chars) === JSON.stringify(workspacePattern.chars) &&
      pattern.shape === workspacePattern.shape
    )
    
    if (!exists) {
      patterns[datetime] = reactiveDeepCopy(workspacePattern, reactive({}))
      return true
    }
    return false
  }

  // 获取当前关联的日期时间
  function getCurrentDateTime() {
    for (const datetime in patterns) {
      if (JSON.stringify(patterns[datetime].chars) === JSON.stringify(workspacePattern.chars)) {
        return datetime
      }
    }
    return null
  }

  // 加载指定日期时间的模式
  function loadPattern(datetime) {
    if (patterns[datetime]) {
      reactiveDeepCopy(patterns[datetime], workspacePattern)
      return true
    }
    return false
  }

  return {
    defaultPattern,
    workspacePattern,
    patterns,
    formatDate: formatDateTime,
    getDateList,
    copyDefaultToWorkspace,
    saveToPatterns,
    getCurrentDate: getCurrentDateTime,
    loadPattern
  }
})
