var app = getApp()
Page({
  onShareAppMessage: function (res) {
		return {
			title: '爱店(爱小程序商店)汇集大量微信小程序,欢迎光临',
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
		nodata:true,
		page: 1,
		height: app.globalData.height * 2 + 25,
		StatusBar: app.globalData.StatusBar,
		CustomBar: app.globalData.CustomBar,
    titleTop: app.globalData.StatusBar,
    index: null,
		hidden: true,
    winHeight: '', // 窗口高度
    currentTab: 4, // 预设当前项的值
    scrollLeft: 0, // tab标题的滚动条位置
    expertListi: [],
    expertList: [],
    expertListId: [],
    _windowWidth: wx.getSystemInfoSync().windowWidth,
    contentArray: []
  },
	gifHidden: function () {
		this.setData({
			hidden: true
		})
	},
  searchPage: function () {
    wx.navigateTo({
      url: '../search/search'
    })
  },
	getListData: function (classid, page) {
		wx.showLoading({
			title: '加载中...'
		})
		let that = this
		console.log('__page__', this.data.page)
		console.log('https://www.yishuzi.com.cn/shop_xiaochengxu_api/?getJson=column&classid=' + classid + '&page=' + page)
		wx.request({
			url: 'https://www.yishuzi.com.cn/shop_xiaochengxu_api/?getJson=column&classid=' + classid + '&page=' + page,
			method: 'GET',
			dataType: 'json',
			success: (json) => {
				console.log('---======------', json.data.result)
				if(json.data.status == 1){
					that.setData({
						nodata: false,
						contentArray: json.data.result
					})
				}else{
					that.setData({
						nodata: true
					})
				}
				wx.hideLoading()
			}
		})
  },
  // 滚动切换标签样式
  swiperChange: function (e) {
    console.log('swiperChange==e', e)
    this.setData({
      currentTab: e.detail.current
    })
    this.getListData(this.data.expertListId[e.detail.current],1)
    this.checkCor()
  },
  // 点击标题切换当前页时改变样式
  swichNav: function (e) {
    console.log('eee--click', e)
    var cur = e.target.dataset.current
    if (this.data.currentTaB == cur) { return false; }else {
      this.setData({
        currentTab: cur
      })
    }
    this.getListData(this.data.expertListId[cur],1)
  },
  // 判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function () {
    wx.showLoading({title:'加载中...'}),
    this.setData({
      scrollLeft: 90 * this.data.currentTab-160
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
		this.getClass();
    this.getListData(this.data.currentTab,1);
    var that = this
    //  高度自适应
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth
        var calc = clientHeight * rpxR - 98
        that.setData({
          winHeight: calc
        })
      }
    })
  },
	getClass:function(){
		let that = this;
		let _classid = []
		let _expertListi = []
		wx.request({
			url: 'https://www.yishuzi.com.cn/shop_xiaochengxu_api/?getJson=class&classid=3',
			method: 'GET',
			dataType: 'json',
			success: (json) => {
				console.log('json000class===--', json.data.result)
				for (var i = 0; i < (json.data.result).length; i++) {
					_expertListi.push(i)
					_classid.push(json.data.result[i].classid)
				}
				that.setData({
					expertList: json.data.result,
					expertListi: _expertListi,
					expertListId: _classid
				})
			}
		})
	},
	reloadFn: function () {
		this.getClass();
		this.getListData(this.data.currentTab, 1);
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

		if (this.data.state == 2) {
			wx.request({
				url: 'https://www.yishuzi.com.cn/shop_xiaochengxu_api/?getJson=article&userid=' + this.data.userid + '&page=' + this.data.page,
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
		} else if (this.data.state == 3) {
			console.log('https://www.yishuzi.com.cn/shop_xiaochengxu_api/?getJson=column&size=' + this.data.sizePage + '&page=' + this.data.page);
			wx.request({
				url: 'https://www.yishuzi.com.cn/shop_xiaochengxu_api/?getJson=column&size=' + this.data.sizePage + '&page=' + this.data.page,
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
		} else {
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
	}
})
