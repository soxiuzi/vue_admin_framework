const loading = {
  state: {
    layoutStatus: false, // 加载状态
    loadText: "数据加载中...",
    firstStatus: false, // 一级目录
    secondStatus: false, // 二级目录
  },

  mutations: {
    // 状态改变
    UPDATE_LAYOUT_STATUE: (state, loadInfo) => {
      state.layoutStatus = loadInfo.status,
      state.loadText = loadInfo.loadText
    },
    // 一级目录工具按钮状态改变
    UPDATE_FIRST_STATUS: (state, status) => {
      state.firstStatus = status
    },
    // 一级目录工具按钮状态改变
    UPDATE_SECOND_STATUS: (state, status) => {
      state.secondStatus = status
    }
  },

  actions: {
    ChangeLayoutStatus({ commit }, loadInfo) {
      commit('UPDATE_LAYOUT_STATUE', loadInfo)
    },
    ChangeFirstStatus({ commit }, status) {
      commit('UPDATE_FIRST_STATUS', status)
    },
    ChangeSecondStatus({ commit }, status) {
      commit('UPDATE_SECOND_STATUS', status)
    }
  },
}

export default loading