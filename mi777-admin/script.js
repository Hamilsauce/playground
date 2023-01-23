import { createApp, computed, ref } from 'vue'
import { router } from './router/index.js';

const app = createApp({
  setup() {
const cnt = ref(0)
    setInterval(() => {
      cnt.value++
      console.log('do it', {cnt: cnt.value} );
      
    }, 1000);
    
    return {
      cnt
    }

  },
  data() {
    return {
      count: 0
    }
  }
})

app.use(router);

app.mount('#app');

console.log('app mount');

console.log('router', router)