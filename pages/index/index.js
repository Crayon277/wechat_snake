//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: 'wo kan ni bianbubian',
    userInfo: {},
    arr:[[1,1,1,1],[2,2,2,2],[3,3,3,3]]
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
  },
  toGame:function(){
    wx.navigateTo({
      url: '../snake/snake'
    })
  },
  addnewfield:function(){
    this.outersetData();
    this.setData({
      "newfield.text":"here is after outersetData"
    });
  },
  outersetData:function(){
    this.setData({
      "newfield.text":"can this message display???"
    })
  }
})
