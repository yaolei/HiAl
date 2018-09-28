//index.js
const app = getApp()

Page({
  data: {
    newTest: 'New Test',
    queryResult: [],
    imgPath:[]
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

  getTemImgs: function(fileIds) {
      // wx.showLoading({
      //     title: '上传中',
      // });

    // wx.cloud.downloadFile({
    //   fileID: fileId, // 文件 ID
    //   success: res => {
    //     debugger
    //     // this.setData({
    //     //   filePath
    //     // })
    //   },
    //   fail: console.error,
    //   complete: () => {
    //     wx.hideLoading()
    //   }
    // })

    wx.cloud.getTempFileURL({
      fileList: fileIds,
      success: res => {
        // res.fileList[0].tempFileURL

        // fileList 是一个有如下结构的对象数组
        // [{
        //    fileID: 'cloud://xxx.png', // 文件 ID
        //    tempFileURL: '', // 临时文件网络链接
        //    maxAge: 120 * 60 * 1000, // 有效期
        // }]
        // console.log(res.fileList)
        this.setData({
          imgPath:res.fileList
        })
        console.log('图片临时地址', res)
      },
      fail: console.error
    })


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
    const self = this;
    // 查询当前用户所有的 counters
    db.collection('TestCounters').where({
      _openid: this.data.openid
    }).get({
      success: res => {
        this.setData({
          queryResult: res.data
          // queryResult: JSON.stringify(res.data, null, 2)
        })
        let imgFileIds = []; //图片fileId集合
        for (let i = 0; i< res.data.length; i++) {
          imgFileIds.push(res.data[i].fileID);
        }
        //获取图片临时地址
        self.getTemImgs(imgFileIds);
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
