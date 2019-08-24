import {
  filterArrOneObj
} from '_utils/utils.js'

/**
 * 根据后端数据构建自定义树形结构
 * @param {Array} treeData
 */
export function getTreeStructure (treeData) {
  let resultTreeData = []
  for (let i = 0; i < treeData.length; i++) {
    if (treeData[i].children) {
      for (let j = 0; j < treeData[i].children.length; j++) {
        if (treeData[i].children[j].children) {
          let academyTree = treeData[i]
          let facultyTree = treeData[i].children[j]
          resultTreeData.push({
            title: treeData[i].professionalName || treeData[i].curriculumName,
            slots: {
              icon: 'dir'
            },
            key: JSON.stringify({
              type: 'firstDir',
              value: academyTree.professionalCode,
              length: academyTree.children ? academyTree.children.length + 1 : 1,
              id: academyTree.id,
              sort: academyTree.sort
            }),
            children: []
          })
          resultTreeData.forEach(tree => {
            let parentId = JSON.parse(tree.key).id
            if (facultyTree.parentId === parentId) {
              tree.children.push({
                title: facultyTree.professionalName || facultyTree.curriculumName,
                slots: {
                  icon: 'dir'
                },
                key: JSON.stringify({
                  type: 'secondDir',
                  value: facultyTree.professionalCode,
                  length: facultyTree.children ? facultyTree.children.length + 1 : 1,
                  id: facultyTree.id,
                  sort: facultyTree.sort
                }),
                children: []
              })
            }
          })
          for (let k = 0; k < treeData[i].children[j].children.length; k++) {
            let majorTree = treeData[i].children[j].children[k]
            resultTreeData.forEach(oneTree => {
              oneTree.children.forEach(twoTree => {
                let parentId = JSON.parse(twoTree.key).id
                if (majorTree.parentId === parentId) {
                  twoTree.children.push({
                    title: majorTree.professionalName || majorTree.curriculumName,
                    slots: {
                      icon: 'major'
                    },
                    key: JSON.stringify({
                      type: 'thirdDir',
                      value: majorTree.professionalCode,
                      length: majorTree.children ? majorTree.children.length + 1 : 1,
                      id: majorTree.id,
                      sort: majorTree.sort
                    }),
                    children: []
                  })
                }
              })
            })
          }
        } else {
          let academyTree = treeData[i]
          let facultyTree = treeData[i].children[j]
          resultTreeData.push({
            title: treeData[i].professionalName || treeData[i].curriculumName,
            slots: {
              icon: 'dir'
            },
            key: JSON.stringify({
              type: 'firstDir',
              value: academyTree.professionalCode,
              length: academyTree.children ? academyTree.children.length + 1 : 1,
              id: academyTree.id,
              sort: academyTree.sort
            }),
            children: []
          })
          resultTreeData.forEach(tree => {
            let parentId = JSON.parse(tree.key).id
            if (parentId !== treeData[i].id) {
              resultTreeData.push({
                title: treeData[i].professionalName || treeData[i].curriculumName,
                slots: {
                  icon: 'dir'
                },
                key: JSON.stringify({
                  type: 'firstDir',
                  value: academyTree.professionalCode,
                  length: academyTree.children ? academyTree.children.length + 1 : 1,
                  id: academyTree.id,
                  sort: academyTree.sort
                }),
                children: []
              })
            }
          })
          resultTreeData = filterArrOneObj(resultTreeData, 'title')
          resultTreeData.forEach(tree => {
            let parentId = JSON.parse(tree.key).id
            if (facultyTree.parentId == parentId) {
              tree.children.push({
                title: facultyTree.professionalName || facultyTree.curriculumName,
                slots: {
                  icon: 'dir'
                },
                key: JSON.stringify({
                  type: 'secondDir',
                  value: facultyTree.professionalCode,
                  length: facultyTree.children ? facultyTree.children.length + 1 : 1,
                  id: facultyTree.id,
                  sort: facultyTree.sort
                }),
                children: []
              })
            }
          })
        }
      }
    } else {
      let academyTree = treeData[i]
      resultTreeData.push({
        title: treeData[i].professionalName || treeData[i].curriculumName,
        slots: {
          icon: 'dir'
        },
        key: JSON.stringify({
          type: 'firstDir',
          value: academyTree.professionalCode,
          length: academyTree.children ? academyTree.children.length + 1 : 1,
          id: academyTree.id,
          sort: academyTree.sort
        }),
        children: []
      })
    }
  }
  return resultTreeData
}
