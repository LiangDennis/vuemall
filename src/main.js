// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueLazyLoad from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'
import {currency} from './util/currency'
import Vuex from 'vuex'

Vue.config.productionTip = false

Vue.use(Vuex);
// 使用filter过滤器,currency的调用，不需要括号，因为本身是一个函数。
Vue.filter("currency",currency);
// 使用vue-lazyload
Vue.use(VueLazyLoad,{
  loading:"/static/loading-svg/loading-bars.svg"
});
// 使用vue-infiniteScroll
Vue.use(infiniteScroll);

// vuex
const store = new Vuex.Store({
  state:{
    nickName:"",
    cartCount:0
  },
  mutations:{
    uptateUserInfo (state,nickName) {
      state.nickName = nickName;
    },
    uptateCartCount (state,cartCount) {
      state.cartCount += cartCount;
    },
    initCartCount(state,cartCount) {
      state.cartCount = cartCount;
    }
  }
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
