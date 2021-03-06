const getters = {
  userName: state => state.user.userName,
  token: state => state.user.token,
  userId: state => state.user.userId,
  avatar: state => state.user.avatar,
  roles: state => state.user.roles,
  layoutStatus: state => state.loading.layoutStatus,
  loadText: state => state.loading.loadText,
  firstStatus: state => state.loading.firstStatus,
  permission_routes: state => state.permission.routes
}

export default getters
