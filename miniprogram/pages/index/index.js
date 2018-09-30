//index.js
const app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    helloTest: '显示图片',
    HeadPath: [],
    addressInfo: '沈阳市和平区大东路28号',
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  onLoad: function() {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }
    // 

    const headImg = ['cloud://hiagenv-9dce7d.6869-hiagenv-9dce7d/headImg/headImg.jpg'];
    wx.cloud.getTempFileURL({
      fileList: headImg,
      success: res => {
        this.setData({
          HeadPath: res.fileList
        })
        console.log('图片临时地址', res)
      },
      fail: console.error
    })



    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo,
                nickName: res.userInfo.nickName
              })
            }
          })
        } else {
          //不强制让用户授权，否则不会微信拒掉
          // wx.showModal({
          //   title: '授权提示',
          //   content: '小程序需要您的微信授权才能使用哦~ 错过授权页面的处理方法：删除小程序->重新搜索进入->点击授权按钮'
          // })
        }
      }
    })
  },
  canILogin() {
    if (!wx.canIUse('button.open-type.getUserInfo')) { // 对应的功能就是通过按钮获取用户资料
          wx.showModal({
            title: '授权提示',
            content: '小程序需要您的微信授权才能使用哦~ 错过授权页面的处理方法：删除小程序->重新搜索进入->点击授权按钮'
          })
    }
  },
  onGetUserInfo: function(e) {

    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    } else {
                wx.showModal({
            title: '授权提示',
            content: '小程序需要您的微信授权才能使用哦~ 错过授权页面的处理方法：删除小程序->重新搜索进入->点击授权按钮'
          })
    }
  },

  testFun: function(e){
    return e.detail.userInfo;
  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.navigateTo({
          url: '../userConsole/userConsole',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },

  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]
        
        // 上传图片
        const cloudPath = 'headImg' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)
            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath
            wx.cloud.callFunction({
              name: 'add',
              data: {
                fileID: app.globalData.fileID,
                cloudPath: app.globalData.cloudPath,
                filePath: app.globalData.imagePath
              }
            }).then(

            );
            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },

})
