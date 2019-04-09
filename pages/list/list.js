var app = getApp();
Page({
  data: {
		height: app.globalData.height * 2 + 25,
		StatusBar: app.globalData.StatusBar,
		CustomBar: app.globalData.CustomBar,
    contentArray: [],
		contentArrayFlag:false,
		sizePage:1,
    page: 1,
    expertListi: [],
    expertList: [],
    expertListId: [],
    winHeight: '',
    classname: '',
    classid: '',
		userid:0,
		username:"",
		state:null
  },
	
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...'
    })
    console.log('__options__', options);
		if(options.status == 2){
			this.setData({
				status:2,
				classid: options.classid,
				classname: decodeURIComponent(options.classname),
				userid: wx.getStorageSync('storageLoginedUserId'),
				navbarData: {
					title: decodeURIComponent(options.classname) + '小程序',
					showCapsule: true,
					home: true,
					back: true
				}
			});
		}else{
			this.setData({
				status:3,
				classid: options.classid,
				classname: decodeURIComponent(options.classname),
				userid: wx.getStorageSync('storageLoginedUserId'),
				navbarData: {
					title: decodeURIComponent(options.classname) + '小游戏',
					showCapsule: true,
					home: true,
					back: true
				}
			});
		}
		this.getListData(options.classid, this.data.page)
    this.winHeight();
    
  },
  winHeight: function () {
    var that = this
    //  高度自适应
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth
        var calc = clientHeight * rpxR
        that.setData({
          winHeight: calc
        })
      }
    })
  },
  getListData: function (classid, page) {
    let that = this
    console.log('__page__', this.data.page)
    console.log('https://www.yishuzi.com.cn/shop_xiaochengxu_api/?getJson=column&classid=' + classid + '&page=' + page)
    wx.request({
      url: 'https://www.yishuzi.com.cn/shop_xiaochengxu_api/?getJson=column&classid=' + classid + '&page=' + page,
      method: 'GET',
      dataType: 'json',
      success: (json) => {
				console.log('---======------', json.data.result)
				if (JSON.stringify(json.data.result) === '[]'){
					that.setData({
						contentArrayFlag:true
					})
				}else{
					that.setData({
						contentArray: json.data.result,
						contentArrayFlag: false
					})
				}
        wx.hideLoading()
      }
    })
  },
	onShareAppMessage: function (res) {
		return {
			title: '爱店的' + this.data.classname + '栏目列表,@你来看看有喜欢的么',
			success: (res) => {
				wx.showToast({
					content: '分享成功'
				});
			},
			fail: (res) => {
				wx.showToast({
					content: '分享失败,原因是' + res
				});
			}
		}
	},
  scrolltolowerLoadData: function (e) {
    wx.showLoading({
      title: '加载中...'
    })
    console.log('scrolltolowerLoadData', e)
    let that = this
    this.setData({
      page: that.data.page + 1
    });
		
		wx.request({
			url: 'https://www.yishuzi.com.cn/shop_xiaochengxu_api/?getJson=column&classid=' + this.data.classid + '&page=' + that.data.page,
			method: 'GET',
			dataType: 'json',
			success: (json) => {
				let _arr = this.data.contentArray
				_arr = _arr.concat(json.data.result)
				console.log('__arr__', _arr)
				that.setData({
					contentArray: _arr
				})
				wx.hideLoading()
			}
		})
  }
})
