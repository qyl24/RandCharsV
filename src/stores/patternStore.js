/**
 * 图形模式状态管理
 * 负责管理图形模式的状态、历史记录和日期相关逻辑
 * 包括工作区模式、临时保存和历史记录管理
 */
import { defineStore } from 'pinia'
import { reactive, watch } from 'vue'
import { cloneDeep } from 'lodash-es'

export const usePatternStore = defineStore('pattern', () => {
  // 从localStorage加载数据
  const loadFromStorage = () => {
    console.log('Loading patterns from storage $$$')

    const saved = localStorage.getItem('patternStore')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (parsed.workspacePattern) {
          reactiveDeepCopy(parsed.workspacePattern, workspacePattern)
        }
        if (parsed.historyPattern) {
          historyPattern.clear()
          Object.entries(parsed.historyPattern).forEach(([date, patterns]) => {
            historyPattern.set(date, patterns.map(p => reactive({ ...p })))
          })
        }
        if (parsed.selectedDate) {
          selectedDate.value = parsed.selectedDate
        }
      } catch (e) {
        console.error('Failed to parse saved patterns', e)
      }
    }
  }

  // 保存数据到localStorage
  const saveToStorage = () => {
    console.log('Saving patterns to storage $$$')

    const toSave = {
      workspacePattern: { ...workspacePattern },
      historyPattern: Object.fromEntries(historyPattern),
      selectedDate: selectedDate.value
    }
    localStorage.setItem('patternStore', JSON.stringify(toSave))
  }
  // ====================== 常量定义部分 ======================
  /**
   * 工作区模式的特殊索引值
   * 用于标识当前操作的是工作区而非历史记录
   */
  const WORKSPACE_IDX = -24

  // ====================== 状态定义部分 ======================
  /**
   * 默认图形模式配置
   * 包含字符、形状、字体等默认值
   */
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

  /**
   * 工作区当前图形模式
   * 用户正在编辑的图形模式
   */
  const workspacePattern = reactive({ ...defaultPattern })

  /**
   * 临时保存的图形模式
   * 用于在浏览历史记录时保存工作区状态
   */
  const tempSavePattern = reactive({ ...defaultPattern })

  /**
   * 历史记录存储
   * 按日期组织的图形模式历史记录
   */
  const historyPattern = reactive(new Map())

  /**
   * 当前选中的日期
   */
  const selectedDate = reactive({ value: '' })

  /**
   * 当前选中的历史记录索引
   * WORKSPACE_IDX表示当前在工作区
   */
  const currIndex = reactive({ value: WORKSPACE_IDX })

  /**
   * 当前日期的总页数(历史记录数量)
   */
  const totalPage = reactive({ value: 0 })

  // ====================== 初始化部分 ======================
  // 测试用日期偏移状态
  const dayOffset = reactive({ value: 0 })
  const enableDayChangeFlag = reactive({ value: false })
  //-----------------------WARNING-----------------------
  // 以下代码仅用于测试的日期偏移功能，请勿在生产环境中使用
  enableDayChangeFlag.value = true
  //-----------------------------------------------------
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

  // 初始化时启动定时器
  startDateTimer()

  // ====================== 格式化时间功能部分 ======================
  /**
   * 格式化日期并应用日期偏移
   * @param {Date} date - 要格式化的日期
   * @returns {string} 格式化后的日期字符串(YYYY/MM/DD)
   */
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

  // 初始化
  const today = formatDate
  loadFromStorage() // 从存储加载数据
  if (historyPattern.size === 0) {
    historyPattern.set(today(), [])
    selectedDate.value = today()
  }
  updateTotalPage()

  // ====================== 状态修改部分 ======================
  /**
   * 切换当前日期
   * @param {string} date - 要切换到的日期(YYYY/MM/DD)
   */
  function switchDate(date, ctwoh = true) {
    if (!historyPattern.has(date)) {
      historyPattern.set(date, [])
    }
    selectedDate.value = date

    // 调整currIndex
    const list = historyPattern.get(date) || []
    if (currIndex.value >= list.length) {
      currIndex.value = list.length - 1
    }
    if (currIndex.value === -1) {
      currIndex.value = 0
    }

    updateTotalPage()
    if (ctwoh) {
      copyToWorkspaceOnHistory()
    }
  }

  /**
   * 切换到上一页历史记录
   * 如果当前在工作区，则保存工作区状态到临时存储
   */
  function lastPage() {
    if (currIndex.value === WORKSPACE_IDX) {
      reactiveDeepCopy(workspacePattern, tempSavePattern)
      const list = historyPattern.get(selectedDate.value) || []
      currIndex.value = list.length - 1
      if (currIndex.value < 0) {
        currIndex.value = WORKSPACE_IDX
      }
      copyToWorkspaceOnHistory()
    } else if (currIndex.value > 0) {
      currIndex.value--
      copyToWorkspaceOnHistory()
    }
  }

  /**
   * 切换到下一页历史记录
   * 如果当前在最后一页，则恢复临时存储的工作区状态
   */
  function nextPage() {
    if (currIndex.value === WORKSPACE_IDX) return

    const list = historyPattern.get(selectedDate.value) || []
    if (currIndex.value < list.length - 1) {
      currIndex.value++
      copyToWorkspaceOnHistory()
    } else if (currIndex.value >= list.length - 1) {
      reactiveDeepCopy(tempSavePattern, workspacePattern)
      currIndex.value = WORKSPACE_IDX
    }
  }

  /**
   * 保存当前工作区模式到历史记录
   * @returns {boolean} 是否保存成功
   */
  function savePattern() {
    const currentDate = formatDate()
    let targetDate = selectedDate.value

    // 如果当前日期与选择日期不同，尝试切换
    if (currentDate !== targetDate) {
      if (!historyPattern.has(currentDate)) {
        if (!newDate(currentDate)) {
          return false
        }
      }
      switchDate(currentDate, false)
      targetDate = currentDate
    }

    const list = historyPattern.get(targetDate) || []
    const exists = list.some(p => JSON.stringify(p) === JSON.stringify(workspacePattern))

    if (!exists) {
      const newPattern = reactive({})
      reactiveDeepCopy(workspacePattern, newPattern)
      list.push(newPattern)
      updateTotalPage()
      saveToStorage() // 保存到localStorage
      return true
    }
    return false
  }

  /**
   * 重置工作区模式为默认值
   */
  function newPattern() {
    reactiveDeepCopy(defaultPattern, workspacePattern)
    currIndex.value = WORKSPACE_IDX
  }

  // ====================== 内部工具部分 ======================
  /**
   * 响应式深拷贝
   * 将source对象的属性深度拷贝到target对象
   * @param {Object} source - 源对象
   * @param {Object} target - 目标对象
   * @returns {Object} 拷贝后的目标对象
   */
  function reactiveDeepCopy(source, target) {
    const rawCopy = cloneDeep(source)
    Object.keys(rawCopy).forEach(key => {
      target[key] = rawCopy[key]
    })
    return target
  }

  /**
   * 更新当前日期的总页数
   */
  function updateTotalPage() {
    const list = historyPattern.get(selectedDate.value) || []
    totalPage.value = list.length
  }

  /**
   * 根据索引获取图形模式
   * @param {number} index - 模式索引
   * @returns {Object} 对应的图形模式
   */
  function getPatternByIndex(index) {
    if (index === WORKSPACE_IDX) return workspacePattern
    const list = historyPattern.get(selectedDate.value) || []
    return list[index] || defaultPattern
  }

  /**
   * 创建新日期的历史记录
   * @param {string} dateStr - 日期字符串(YYYY/MM/DD)
   * @returns {boolean} 是否创建成功
   */
  function newDate(dateStr = formatDate()) {
    if (!historyPattern.has(dateStr)) {
      historyPattern.set(dateStr, [])
      return true
    }
    return false
  }

  /**
   * 将历史记录中的模式复制到工作区
   */
  function copyToWorkspaceOnHistory() {
    if (currIndex.value !== WORKSPACE_IDX) {
      console.log('Copying pattern from history to workspace')
      const pattern = getPatternByIndex(currIndex.value)
      reactiveDeepCopy(pattern, workspacePattern)
    }
  }

  /**
   * 获取所有日期列表
   * @returns {Array} 日期字符串数组
   */
  function getDateList() {
    return Array.from(historyPattern.keys())
  }

  // 监听重要状态变化自动保存
  watch(
    [() => workspacePattern, () => selectedDate.value],
    () => {
      console.log('Workspace pattern or selected date changed, saving to storage... $$$')

      saveToStorage()
    },
    { deep: true }
  )

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
