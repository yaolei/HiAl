//index.js
const app = getApp()

Page({
  data: {
    newTest: 'New Test',
    queryResult: [],
    imgPath:''
  },

  onLoad: function() {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }
    wx.setNavigationBarTitle({
      title: '上传',
    })
  },

  getImgs: function() {

      // wx.showLoading({
      //     title: '上传中',
      // });

    // wx.cloud.downloadFile({
    //   fileID: 'cloud://hiagenv-9dce7d.6869-hiagenv-9dce7d/my-image.png', // 文件 ID
      
    //   success: res => {
    //     // 返回临时文件路径
    //     debugger
    //     console.log('@@@@@');
    //   },
    //   fail: console.error,
    //   complete: () => {
    //     wx.hideLoading()
    //   }
    // })
  },



  onAdd: function () {
    const db = wx.cloud.database()
    db.collection('TestCounters').add({
      data: {
        count: 2
      },
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        this.setData({
          counterId: res._id,
          count: 2
        })
        wx.showToast({
          title: '新增记录成功',
        })
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '新增记录失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
  },

  onQuery: function () {
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    db.collection('TestCounters').where({
      _openid: this.data.openid
    }).get({
      success: res => {
        this.setData({
          queryResult: res.data
          // queryResult: JSON.stringify(res.data, null, 2)
          // cloud://hiagenv-9dce7d.6869-hiagenv-9dce7d/my-image.png
        })
        console.log('[数据库] [查询记录] 成功: ', res)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },

})
