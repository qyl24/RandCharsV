import { defineStore } from 'pinia'

export const useConfigStore = defineStore('config', {
  state: () => ({
    fontList: [
      // 中文系统字体
      { value: '微软雅黑', name: '微软雅黑' },
      { value: 'SimSun', name: '宋体 (SimSun)' },
      { value: 'SimHei', name: '黑体 (SimHei)' },
      { value: 'KaiTi', name: '楷体 (KaiTi)' },
      { value: 'FangSong', name: '仿宋 (FangSong)' },
      { value: 'LiSu', name: '隶书 (LiSu)' },
      { value: 'YouYuan', name: '幼圆 (YouYuan)' },

      // 华文字体系列
      { value: 'STXihei', name: '华文细黑 (STXihei)' },
      { value: 'STKaiti', name: '华文楷体 (STKaiti)' },
      { value: 'STZhongsong', name: '华文中宋 (STZhongsong)' },
      { value: 'STHupo', name: '华文琥珀 (STHupo)' },

      // macOS/iOS系统字体
      { value: 'PingFang SC', name: '苹方简体 (PingFang SC)' },
      { value: 'Hiragino Sans GB', name: '冬青黑体 (Hiragino Sans GB)' },

      // 开源中文字体
      { value: 'Source Han Sans', name: '思源黑体 (Source Han Sans)' },
      { value: 'Source Han Serif', name: '思源宋体 (Source Han Serif)' },
      { value: 'Alibaba PuHuiTi', name: '阿里巴巴普惠体' },

      // 西文无衬线体
      { value: 'Arial', name: 'Arial' },
      { value: 'Helvetica', name: 'Helvetica' },
      { value: 'Verdana', name: 'Verdana' },
      { value: 'Tahoma', name: 'Tahoma' },
      { value: 'Trebuchet MS', name: 'Trebuchet MS' },
      { value: 'Calibri', name: 'Calibri' },
      { value: 'Roboto', name: 'Roboto' },
      { value: 'Open Sans', name: 'Open Sans' },

      // 西文衬线体
      { value: 'Times New Roman', name: 'Times New Roman' },
      { value: 'Georgia', name: 'Georgia' },
      { value: 'Garamond', name: 'Garamond' },
      { value: 'Palatino Linotype', name: 'Palatino' },

      // 等宽字体
      { value: 'Courier New', name: 'Courier New' },
      { value: 'Consolas', name: 'Consolas' },
      { value: 'Monaco', name: 'Monaco' },
      { value: 'Lucida Console', name: 'Lucida Console' },

      // 特殊风格字体
      { value: 'Impact', name: 'Impact (粗体)' },
      { value: 'Comic Sans MS', name: 'Comic Sans (手写)' },
      { value: 'Bradley Hand', name: 'Bradley Hand (手写)' },
      { value: 'Papyrus', name: 'Papyrus (装饰)' },

      // 现代字体
      { value: 'Segoe UI', name: 'Segoe UI (微软系统)' },
      { value: 'Lato', name: 'Lato' },
      { value: 'Montserrat', name: 'Montserrat' }
    ],
    scaleOptions: [
      { value: 0.50, label: '50% (默认)' },
      { value: 0.70, label: '70%' },
      { value: 0.65, label: '65%' },
      { value: 0.60, label: '60%' },
      { value: 0.55, label: '55%' },
      { value: 0.45, label: '45%' },
      { value: 0.40, label: '40%' },
      { value: 0.35, label: '35%' },
      { value: 0.30, label: '30%' }
    ],
    shapeOptions: [
      { value: 'diamond', label: '菱形' },
      { value: 'triangle', label: '三角形' },
      { value: 'ellipse', label: '椭圆形' },
      { value: 'rectangle', label: '矩形' }
    ],
    lineStyleOptions: [
      { value: 'solid', label: '实线' },
      { value: 'dashed1', label: '虚线1' },
      { value: 'dashed2', label: '虚线2' }
    ]
  }),
  getters: {
  }
})

