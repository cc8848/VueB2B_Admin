import axios from 'axios'

export const state = () => ({
    token: ''
})

export const actions = {
    async login({ commit, state, getters }, user) {
        const { data } = await axios.post(`/api/console_login`, user)
        if(data.success) {
            commit('setToken', data.data.token)
        }
        return data
    },
}

export const mutations = {
    setToken (state, data) {
        state.token = data
    }
}