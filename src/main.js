import Vue from 'vue'
import App from './DataTable.vue'

//Vuetify (Material Design)
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css' // Ensure you are using css-loader
//import 'material-design-icons-iconfont/dist/material-design-icons.css' // Ensure you are using css-loader

//Vuelidate (Input Validation)
import VeeValidate, {Validator} from 'vee-validate'
import pt_PT from 'vee-validate/dist/locale/pt_PT'

Vue.use(Vuetify)

Validator.localize('pt_PT', pt_PT)
Vue.use(VeeValidate)


new Vue({
  el: '#app',
  render: h => h(App)
})
