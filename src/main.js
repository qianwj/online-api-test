// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
// import Datetime from 'vue-datetime'
// // You need a specific loader for CSS files
// import 'vue-datetime/dist/vue-datetime.css'
import JsonViewer from 'vue-json-viewer'
import VueResource from 'vue-resource'
import VueClipboards from 'vue-clipboard2'

Vue.use(VueClipboards)

Vue.use(Vuetify)
// Vue.use(Datetime)
Vue.use(JsonViewer)
Vue.use(VueResource)

Vue.config.productionTip = false
Vue.http.options.emulateJSON = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
