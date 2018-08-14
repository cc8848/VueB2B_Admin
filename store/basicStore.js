import axios from 'axios'
import config from '../commen/config'

let console_domain

// ----------------------  区分开发和线上环境  ---------------------
if(process.env.NODE_ENV === 'production') {
    console_domain = config['production'].domain.console
} else {
    console_domain = config['development'].domain.console
}

export const getters = () => {
    console_domain
}

export const state = () => ({
    countryList: []
})

export const actions = {
    async getCountryList({ commit, state, getters }) {
        const { data } = await axios.get(`http://test.console.akulaku.com/api/common/country/list.json?type=1`)
        if(data.success) {
            commit('setCountryList', data.data)
        }
        return data
    },
}

export const mutations = {
    setCountryList (state, data) {
        state.countryList = data
    }
}