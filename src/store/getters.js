const getters = {
    token: state => state.user.token,
    avatar: state => state.user.avatar,
    roles: state => state.user.roles,
    layoutStatus: state => state.loading.layoutStatus,
    loadText: state => state.loading.loadText
}

export default getters