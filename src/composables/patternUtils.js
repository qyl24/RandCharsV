// import { reactive, toRaw } from 'vue'
// import { cloneDeep } from 'lodash-es'

// // 保留响应性的深拷贝方法
// export function reactiveDeepCopy(source, target) {
//   const rawCopy = cloneDeep(toRaw(source))
//   Object.keys(rawCopy).forEach(key => {
//     target[key] = rawCopy[key]
//   })
//   return target
// }

// // 默认模式配置
// export const defaultPattern = reactive({
//   chars: "水里有很多小鱼".split(''),
//   shape: 'diamond',
//   fontFamily: '微软雅黑',
//   lineStyle: 'solid',
//   scale: 0.5,
//   positions: [],
//   colors: [],
//   fontSizes: []
// })

// // 工作区模式
// export const workspacePattern = reactive({})
// reactiveDeepCopy(defaultPattern, workspacePattern)

// // 格式化日期为YYYY/MM/DD
// function formatDate(date = new Date()) {
//   const year = date.getFullYear()
//   const month = String(date.getMonth() + 1).padStart(2, '0')
//   const day = String(date.getDate()).padStart(2, '0')
//   return `${year}/${month}/${day}`
// }

// // 历史模式列表，按日期存储
// export const patterns = reactive({})

// // 获取所有日期列表
// export function getDateList() {
//   return Object.keys(patterns)
// }

// // 复制默认模式到工作区
// export function copyDefaultToWorkspace() {
//   reactiveDeepCopy(defaultPattern, workspacePattern)
// }

// // 保存工作区模式到历史
// export function saveToPatterns(date = formatDate()) {
//   if (!patterns[date]) {
//     patterns[date] = reactive([])
//   }
  
//   // 检查是否已有相同内容
//   const exists = patterns[date].some(pattern => 
//     JSON.stringify(pattern.chars) === JSON.stringify(workspacePattern.chars) &&
//     pattern.shape === workspacePattern.shape
//   )
  
//   if (!exists) {
//     const newPattern = reactive({})
//     patterns[date].push(reactiveDeepCopy(workspacePattern, newPattern))
//     return true
//   }
//   return false
// }

// // 获取当前关联的日期
// export function getCurrentDate() {
//   for (const date in patterns) {
//     if (patterns[date].some(pattern => 
//       JSON.stringify(pattern.chars) === JSON.stringify(workspacePattern.chars)
//     )) {
//       return date
//     }
//   }
//   return null
// }

// // 加载指定日期的模式
// export function loadPattern(date, index = 0) {
//   if (patterns[date] && index >= 0 && index < patterns[date].length) {
//     reactiveDeepCopy(patterns[date][index], workspacePattern)
//     return true
//   }
//   return false
// }
