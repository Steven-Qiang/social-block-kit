import { createApp } from 'vue';
import App from './App.vue';
import './styles/wrapper.css';

const app = document.createElement('div');
app.classList.add('social-block-kit-wrapper');
document.body.append(app);
createApp(App).mount(app);
