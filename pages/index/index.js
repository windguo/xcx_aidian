var Api = require('../../utils/api.js')

var app = getApp()
Page({
  onShareAppMessage: function (res) {
		return {
			title: '爱小程序商店欢迎您...',
			imageUrl:'/images/indexPic.jpg',
			path: '/pages/index/index',
			success: (res) => {
				wx.showToast({
					content: '分享成功'
				})
			},
			fail: (res) => {
				wx.showToast({
					content: '分享失败,原因是' + res
				})
			}
		}
  },
	data: {
		navbarData: {
			title: "爱店",
			showCapsule: false
		},
		textData: {
			title: '我是首页的tips',
			icon: 'warn_light'
		},
		nodata:true,
		page: 1,
		height: app.globalData.height * 2 + 25,
		StatusBar: app.globalData.StatusBar,
		CustomBar: app.globalData.CustomBar,
    titleTop: app.globalData.StatusBar,
    index: null,
		hidden: true,
    winHeight: '', // 窗口高度
    currentTab: 0, // 预设当前项的值
    scrollLeft: 0, // tab标题的滚动条位置
    expertListi: [],
    expertList: [],
    expertListId: [],
    _windowWidth: wx.getSystemInfoSync().windowWidth,
    contentArray: [],
		eliteArray:[],
		xiaochengxuClassArray:[],
		xiaoyouxiClassArray:[]
  },
	gifHidden: function () {
		this.setData({
			hidden: true
		})
	},
	getEliteData:function(){
		let that = this;
		wx.request({
			url: 'https://www.yishuzi.com.cn/shop_xiaochengxu_api/?getJson=column&isgood=1',
			method: 'GET',
			dataType: 'json',
			success: (json) => {
				console.log('---====eeee==------', json.data.result)
				if (json.data.status == 1) {
					that.setData({
						eliteArray: json.data.result
					})
				}
				wx.hideLoading()
			}
		})
	},
  searchPage: function () {
    wx.navigateTo({
      url: '../search/search'
    })
  },
	getXiaochengxuClass:function(){
		// https://www.yishuzi.com.cn/shop_xiaochengxu_api/?getJson=class&classid=3
		let that = this;
		wx.request({
			url: 'https://www.yishuzi.com.cn/shop_xiaochengxu_api/?getJson=class&classid=3',
			method: 'GET',
			dataType: 'json',
			success: (json) => {
				console.log('---====eeee==------', json.data.result)
				if (json.data.status == 1) {
					that.setData({
						xiaochengxuClassArray: json.data.result
					})
				}
				wx.hideLoading()
			}
		})
	},
	getXiaoyouxiClass: function () {
		// https://www.yishuzi.com.cn/shop_xiaochengxu_api/?getJson=class&classid=8
		let that = this;
		wx.request({
			url: 'https://www.yishuzi.com.cn/shop_xiaochengxu_api/?getJson=class&classid=8',
			method: 'GET',
			dataType: 'json',
			success: (json) => {
				console.log('---====eeee==------', json.data.result)
				if (json.data.status == 1) {
					that.setData({
						xiaoyouxiClassArray: json.data.result
					})
				}
				wx.hideLoading()
			}
		})
	},
  onLoad: function (options) {
    wx.showLoading({title:'加载中...'})

    // 扫码进入的判断开始
    const _scene = options.scene
    console.log('_scene_scene', _scene)
    if (Boolean(_scene) == true) {
      if (_scene.indexOf('start_') == 0) {
        let __scene = _scene.substring(6)
        console.log('__scene', __scene)
        wx.switchTab({
          url: '../' + __scene + '/' + __scene
        })
      }
    }
    // 扫码进入的判断结束
		// 获取推荐小程序
		this.getEliteData();
		// 获取小程序分类
		this.getXiaochengxuClass();
		// 获取小youxi分类
		this.getXiaoyouxiClass();
  }
})
