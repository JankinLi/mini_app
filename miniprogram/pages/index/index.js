//index.js
const app = getApp()

Page({
  data: {
    imgUrl: '',
    hasImgUrl: false,
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    hasUserInfo: false,
    logged: false,
    takeSession: false,
    requestResult: '',
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') // 如需尝试获取用户信息可改为false
  },

  onLoad: function() {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }
    if (wx.getUserProfile) {
      console.log('onLoad in index.js')
      //console.log('wx.getUserProfile return true')
      this.setData({
        canIUseGetUserProfile: true,
      })
    }
  },
  // isEmpty: function (obj){
  //   for (var name in obj) 
  //   {
  //     return false;
  //   }
  //   return true;
  // },
  onShow: function(){
    console.log('onShow in index.js')
    const fileID = wx.getStorageSync('fileID') || ''
    if (fileID){
      // if (app.globalData!=null && !this.isEmpty(app.globalData) && app.globalData.imagePath!= ''){
      //   console.log('app.globalData', app.globalData)
      //   this.setData({
      //     imgUrl: app.globalData.imagePath,
      //     hasImgUrl: true
      //   })
      //   console.log('onShow imgUrl', this.data.imgUrl)
      //   return
      // }
      if(this.data.hasImgUrl){
        console.log('onShow imgUrl', this.data.imgUrl)  
        return
      }
      console.log('onShow fileID', fileID)
      this.setData({
        imgUrl: fileID,
        hasImgUrl: true
      })
    }
    else{
      if (this.data.hasImgUrl){
        this.setData({
          imgUrl:'',
          hasImgUrl: false
        })
        console.log('clear imgUrl')
      }
    }
  },

  bindViewTap(){
    console.log('user tap avatar.' , this.data.avatarUrl, this.data.hasUserInfo)
    if (!this.data.hasUserInfo){
      wx.getUserProfile({
        lang: 'zh_CN',
        desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          console.log('call getUserProfile success.', res)
          this.setData({
            avatarUrl: res.userInfo.avatarUrl,
            userInfo: res.userInfo,
            hasUserInfo: true,
          })
        },
        fail: err=>{
          console.log('call getUserProfile fail.' , err)
        }
      })
    }
    else{
      console.log('this.data.userInfo is exists.')
    }
  },

  getUserProfile() {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        //console.log('getUserProfile success.')
        this.setData({
          avatarUrl: res.userInfo.avatarUrl,
          userInfo: res.userInfo,
          hasUserInfo: true,
        })
      }
    })
  },

  onGetUserInfo: function(e) {
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo,
        hasUserInfo: true,
      })
    }
  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('res.result', res.result)
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
    const this_ref = this
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        wx.showLoading({
          title: '上传中',
        })
        
        console.log('wx.chooseImage success, res.tempFilePaths' , res.tempFilePaths)
        const filePath = res.tempFilePaths[0]
        
        // 上传图片
        const cloudPath = `my-image${filePath.match(/\.[^.]+?$/)[0]}`
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res.fileID)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath

            wx.setStorageSync('fileID', res.fileID)

            this_ref.setData({
              imgUrl: filePath,
              hasImgUrl: true
            })

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
        console.error('user cancel.' , e)
      }
    })
  },
  removeImage: function(){
    const fileID = wx.getStorageSync('fileID') || ''
    if (fileID == ''){
      return
    }
    wx.showLoading({
      title: '删除中',
    })
    wx.cloud.deleteFile({
      fileList: [fileID],
      success: res => {
        // handle success
        wx.removeStorageSync('fileID')
        console.log("deleteFile success", res.fileList)
        app.globalData = {}
        wx.navigateTo({
          url: '../removeConsole/removeConsole'
        })
      },
      fail: err => {
        console.log('delete fail.' , err)
      },
      complete: res => {
        wx.hideLoading()
      }
    })
  }
})
