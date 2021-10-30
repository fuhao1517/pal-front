import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
Vue.use(Vuex)
const config = {
  plugins: [createPersistedState()],
  state: {
    rememberPsw: '',
    username: '',
    token: '',
    activePath: '',
    userData: {}
  },
  getters: {
    rememberPsw: state => state.rememberPsw,
    username: state => state.username,
    token: state => state.token,
    activePath: state => state.activePath,
    userData: state => state.userData
  },
  mutations: {
    updateRememberPsw (state, payload) {
      state.rememberPsw = payload
    },
    updateUsername (state, payload) {
      state.username = payload
    },
    updateToken (state, payload) {
      state.token = payload
    },
    updateActivePath (state, payload) {
      state.activePath = payload
    },
    updateUserData (state, payload) {
      state.userData = payload
    },
    isLogin (state, payload) {
      state.isLogin = payload
    }
  },
  actions: {
    clearLoginInfo (context) {
      context.commit('updateUsername', '')
      context.commit('updateToken', '')
      context.commit('updateUserData', {})
    }
  }
}
const store = new Vuex.Store(config)
export default store
