const loading = {
  state: {
    layoutStatus: false, // 加载状态
    loadText: "数据加载中...",
  },

  mutations: {
    UPDATE_LAYOUT_STATUE: (state, loadInfo) => {
      state.layoutStatus = loadInfo.status,
      state.loadText = loadInfo.loadText
    }
  },

  actions: {
    ChangeLayoutStatus({ commit }, loadInfo) {
      commit('UPDATE_LAYOUT_STATUE', loadInfo)
    }
  },
}

export default loading