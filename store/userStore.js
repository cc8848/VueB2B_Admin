export const state = () => ({
  editUser: {}
})

export const mutations = {
  editDetail (state, data) {
    state.editUser = data
  }
}