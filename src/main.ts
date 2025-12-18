import { createApp } from 'vue'
import App from './App.vue'

const app = document.createElement('div')
document.body.append(app)
createApp(App).mount(app)

// eslint-disable-next-line no-console
console.log('%c自动拉黑工具已加载', 'color: #667eea; font-size: 14px; font-weight: bold')
