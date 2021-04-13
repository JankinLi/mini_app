// pages/image_view/image_view.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    image_file_id:'',
    has_image: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('onShow in image_view.js')
    const fileID = wx.getStorageSync('fileID') || ''
    if (fileID){
      // if(this.data.has_image){
      //   console.log('onShow image_file_id', this.data.image_file_id)  
      //   return
      // }
      console.log('onShow in image_view.js. fileID', fileID)
      this.setData({
        image_file_id: fileID,
        has_image: true
      })
    }
    else{
      if(this.data.has_image){
        this.setData({
          image_file_id:'',
          has_image:false
        })
      }
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})