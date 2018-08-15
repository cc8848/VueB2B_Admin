import axios from 'axios'
axios.defaults.withCredentials = true

export const state = () => ({
  isLogin: false,
  userInfo: {},
  token: '',
  locales: ['in','en','zh'], //多语言
  locale: 'zh', // 当前语言
  pagesCache: { // 列表页缓存页面数据，需求：详情页退回来回到之前翻到的页面
    orderListPage: 1,
    codListPage: 1,
    refundListPage: 1
  },
  pushDetailInfo: {},//推送详情页信息
})

export const actions = {
  // ----------------------  每次服务端渲染之前都会执行此函数  ---------------------
  async nuxtServerInit({ dispatch, commit }, { req, res }) {
    if (req.headers.cookie) {
      let cookie = req.headers.cookie
      cookie = cookie.split(';')
      let cookieObj = {}, cookieArr = [], key = '', value = ''
      for (let i = 0; i < cookie.length; i++) {
        cookieArr = cookie[i].split('=')
        key = cookieArr[0]
        value = cookieArr[1]
        cookieObj[key] = value
      }
      commit('setToken', cookieObj.token)
    }
  },

  async login({ commit, state, getters }, user) {
    const { data } = await axios.post(`/api/console_login`, user)
    if(data.success) {
        commit('setToken', data.data.token)
        commit('setUserInfo', data.data)
    }
    return data
  },
  async logout({commit,state}) {
    // const {data} = await axios.post(`/api/json/wrynn/user/logout`,{token:state.token,uid:state.uid})
    commit('setToken', '')
    commit('setUserInfo',{})
  },
}

export const mutations = {
  setToken (state, data) {
    state.token = data
    state.isLogin = true
  },
  logout(state,router) {
    state.isLogin = false,
    state.token = ''
    router && router.push('/login')
  },
  setUserInfo(state,data) {
    state.userInfo = data
  },
  SET_LANG(state, locale) {
    if (state.locales.indexOf(locale) !== -1) {
      state.locale = locale
      state.locales = ['in','en','zh']
    }
  },
  setPage(state,{type,page}) {
    state.pagesCache[type] = page
  },
  resetCachePage(state,data) {
    Object.keys(state.pagesCache).forEach(key => {
      state.pagesCache[key] = data
    })
  },
  setPushDetail(state,data) {
    state.pushDetailInfo = data
  }
}

export const getters = {

}

