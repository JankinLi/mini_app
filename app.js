// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res){
          console.log("res.code" , res.code)
          console.log("res.errMsg", res.errMsg)
          wx.cloud.init({
            env:'mini-view-1g941ej3a37d8949',
            traceUser:true
          })
          console.log('init')
          wx.cloud.callFunction({
            name:'login',
            data:{
              "code":res.code
            },
            sucess: res=>{
              console.log('receive res')
              console.log('cloud login user openid:', res.userInfo.openid)
            },
            fail: err=>{
              console.error('cloud login call fail.', err)
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null
  }
})
