// latest.js
var COMMONFN = require('../../utils/util.js');
var app = getApp()
Page({
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log('res.target===', res.target)
      return {
				title: this.data.detailData.title,
        path: '/pages/detail/detail?id=' + this.data.id,
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
    } else {
      return {
				title: this.data.detailData.title,
        path: '/pages/detail/detail?id=' + this.data.id,
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
    }
  },
  data: {
		navbarData: {
			title: "爱店详情页",
			showCapsule: true,
			home: true,
			back: true
		},
		page:1,
		height: app.globalData.height * 2 + 25,
		StatusBar: app.globalData.StatusBar,
		CustomBar: app.globalData.CustomBar,
		//图片地址
		imgList: [],
		//是否采用衔接滑动  
		circular: true,
		//是否显示画板指示点  
		indicatorDots: true,
		//选中点的颜色  
		indicatorcolor: "#000",
		//是否竖直  
		vertical: false,
		//是否自动切换  
		autoplay: true,
		//自动切换的间隔
		interval: 2500,
		//滑动动画时长毫秒  
		duration: 1000,
		//所有图片的高度  
		imgheights: [],
		//图片宽度 
		imgwidth: 300,
		//默认  
		current: 0,
    index: null,
    winHeight: '', // 窗口高度
    currentTab: 0, // 预设当前项的值
    scrollLeft: 0, // tab标题的滚动条位置
    detailData: [],
    expertList: [],
    expertListId: [],
    _windowWidth: wx.getSystemInfoSync().windowWidth,
    contentArray: [],
    title: '',
    username: '',
		onclick:0,
		smalltext: '',
		newstime:'',
    avatarUrl: '',
    id: '',
    juzi_xiaochengxu_qrodeImg: '',
    width: '',
    classid: '',
    height: '',
    height: '',
    shareTempFilePath: '',
    tempFilePath: '',
    _id: '',
    smalltext: '',
		commitListArray:[]
  },
  onLoad: function (options) {
		COMMONFN.checkIsLogin();
    wx.showLoading({title:'加载中...'})
    console.log('---==--options--', options)
    this.setData({
      avatarUrl: wx.getStorageSync('storageLoginedavAtarUrl'),
			sessionkey: wx.getStorageSync('storageSessionkey'),
			rnd: wx.getStorageSync('storageRnd'),
      classid: options.classid,
      id: options.id.replace(/[^0-9]/ig, '')
    });
		console.log(getApp().globalData.apiUrl + '/?getJson=content&id=' + this.data.id);
    wx.request({
      url: getApp().globalData.apiUrl + '/?getJson=content&id=' + this.data.id,
      method: 'GET',
      dataType: 'json',
      success: (json) => {
        console.log('detail---', json.data)
        var that = this;
				console.log('detailData..', json.data.result.preimgs);
        this.setData({
          detailData:json.data.result,
          commitData: {
            id: this.data.id,
            classid:this.data.classid
          }
        })
        wx.hideLoading()
      }
    })
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
    console.log('this.data.classid--', this.data.classid)
    this.getListData(this.data.classid,1);
		this.check_fava_article();
		this._getList();
  },
	imageLoad: function (e) {//获取图片真实宽度  
		var imgwidth = e.detail.width,
			imgheight = e.detail.height,
			//宽高比  
			ratio = imgwidth / imgheight;
		console.log(imgwidth, imgheight)
		//计算的高度值  
		var viewHeight = 750 / ratio;
		var imgheight = viewHeight;
		var imgheights = this.data.imgheights;
		//把每一张图片的对应的高度记录到数组里  
		imgheights[e.target.dataset.id] = imgheight;
		this.setData({
			imgheights: imgheights
		})
	},
	bindchange: function (e) {
		// console.log(e.detail.current)
		this.setData({ current: e.detail.current })
	},
	preCode:function(){
		wx.previewImage({
			urls: ['' + this.data.detailData.qrode + '']
		})
	},
	publishCommit(e) {
		console.log('eeee', e)
		if (e.detail.value.smalltext == '') {
			wx.showModal({
				content: '请输入内容',
				showCancel: false,
				confirmColor: '#ff5a00'
			})
			setTimeout(function () {
				wx.hideToast()
			}, 2000)
			return false
		} else {
			wx.showLoading({
				title: '发布中'
			})
			console.log({
				sessionkey: wx.getStorageSync('storageSessionkey'),
				saytext: e.detail.value.saytext.trim(),
				ecmsfrom: 'xiaochengxu',
				username: wx.getStorageSync('storageLoginedUsernames'),
				enews: 'AddPl',
				userid: wx.getStorageSync('storageLoginedUserId'),
				mgroupid: wx.getStorageSync('storageLoginedGroupId'),
				rnd: wx.getStorageSync('storageRnd'),
				formid: e.detail.formId,
				id: e.detail.value.id,
				classid: e.detail.value.classid
			});
			wx.request({
				url: 'https://www.yishuzi.com.cn/shop_xiaochengxu_api/commit.php',
				data: {
					sessionkey: wx.getStorageSync('storageSessionkey'),
					saytext: e.detail.value.saytext.trim(),
					ecmsfrom: 'xiaochengxu',
					username: wx.getStorageSync('storageLoginedUsernames'),
					enews: 'AddPl',
					userid: wx.getStorageSync('storageLoginedUserId'),
					mgroupid: wx.getStorageSync('storageLoginedGroupId'),
					rnd: wx.getStorageSync('storageRnd'),
					formid: e.detail.formId,
					id: e.detail.value.id,
					classid: e.detail.value.classid
				},
				header: { 'content-type': 'application/x-www-form-urlencoded' },
				method: 'POST',
				dataType: 'json',
				success: (json) => {
					console.log('---===-----json====', json.data);
					wx.hideLoading()
					if (json.data.status == 1) {
						wx.showModal({
							title: json.data.message,
							content: '感谢您的评论,审核通过后会收到微信消息',
							showCancel: false,
							confirmText: '我知道了',
							confirmColor: '#ff5a00',
							success: function (res) {
								if (!res.cancel) {
									wx.redirectTo({
										url: '/pages/detail/detail?id=' + e.detail.value.id + '&classid=' + e.detail.value.classid
									});
								}
							}
						})
					} else {
						wx.showModal({
							title: '提示',
							content: json.data.message
						})
					}
				}
			})
		}
	},
	_getList: function () {
		let that = this;
		console.log('https://www.yishuzi.com.cn/shop_xiaochengxu_api/?getJson=getCommitList&id=' + this.data.id + '&page=' + this.data.page);
		wx.request({
			url: 'https://www.yishuzi.com.cn/shop_xiaochengxu_api/?getJson=getCommitList&id=' + this.data.id + '&page=' + this.data.page,
			method: 'GET',
			dataType: 'json',
			success: (json) => {
				console.log('---=====eeee=------', json.data.result)
				that.setData({
					commitListArray:json.data.result
				})
				wx.hideLoading()
			}
		})
	},
	// 检测是否已经收藏
	check_fava_article: function () {
		let that = this;
		wx.request({
			url: 'https://www.yishuzi.com.cn/shop_xiaochengxu_api/?getJson=check_fava_article&id=' + this.data.id + '&classid=' + this.data.classid + '&userid=' + this.data.userid,
			method: 'GET',
			dataType: 'json',
			success: (json) => {
				console.log('---======check_fava_article------', json.data);
				if (json.data.status == 1) {
					console.log('收藏过了');
					console.log('json.data.result.favaid--', json.data.result.favaid);
					that.setData({
						favaFlag: true,
						favaid: json.data.result.favaid
					})
				} else {
					that.setData({
						favaFlag: false
					})
				}
			}
		})
	},
	diggtopFn: function (e) {
		wx.showLoading({
			title: '点赞中...',
			mask: true
		})
		let _this = this;
		console.log('eeee-', e);
		console.log('https://www.yishuzi.com.cn/shop_xiaochengxu_api_root/e/public/digg/index.php?afrom=xiaochengxu&dotop=1&doajax=1&ajaxarea=diggnum&id=' + this.data.id + '&classid=' + this.data.classid);
		wx.request({
			url: 'https://www.yishuzi.com.cn/shop_xiaochengxu_api_root/e/public/digg/index.php?afrom=xiaochengxu&dotop=1&doajax=1&ajaxarea=diggnum&id=' + this.data.id + '&classid=' + this.data.classid,
			method: 'GET',
			dataType: 'json',
			success: (json) => {
				console.log('---======diggtopFn------', json.data);
				_this.setData({
					diggFlag: true
				})
				wx.showModal({
					content: json.data.message,
					mask: true
				})
				wx.hideLoading()
			}
		})
	},
	// 加入收藏
	favaFn: function (e) {
		wx.showLoading({
			title: '收藏中...',
			mask: true
		})
		let _this = this;
		wx.request({
			url: 'https://www.yishuzi.com.cn/shop_xiaochengxu_api/fava.php',
			data: {
				sessionkey: this.data.sessionkey,
				ecmsfrom: 'xiaochengxu',
				username: this.data.username,
				enews: 'AddFava',
				rnd: this.data.rnd,
				classid: this.data.classid,
				id: this.data.id,
				Submit: '收藏'
			},
			header: { 'content-type': 'application/x-www-form-urlencoded' },
			method: 'POST',
			dataType: 'json',
			success: (json) => {
				console.log('---======favaFn------', json.data);
				_this.setData({
					favaFlag: true,
					favaid: json.data.result.favaid
				})
				wx.showModal({
					title: json.data.message,
					content: '请到【我的】-【我的收藏】查看收藏的网名',
					mask: true
				})
				console.log('this.data.favaid---', this.data.favaid);
				wx.hideLoading()
			}
		})
	},
	// 移除收藏
	favaDisFn: function (e) {
		wx.showLoading({
			title: '移除收藏中...',
			mask: true
		})
		let _this = this;
		wx.request({
			url: 'https://www.yishuzi.com.cn/shop_xiaochengxu_api/fava.php',
			data: {
				sessionkey: this.data.sessionkey,
				ecmsfrom: 'xiaochengxu',
				username: this.data.username,
				enews: 'DelFava',
				rnd: this.data.rnd,
				classid: this.data.classid,
				id: this.data.id,
				favaid: this.data.favaid,
				Submit: '收藏'
			},
			header: { 'content-type': 'application/x-www-form-urlencoded' },
			method: 'POST',
			dataType: 'json',
			success: (json) => {
				console.log('---======favaDisFn------', json.data);
				_this.setData({
					favaFlag: false
				})
				wx.showModal({
					content: json.data.message,
					mask: true
				})
				wx.hideLoading()
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
				that.setData({
					contentArray: json.data.result
				})
				wx.hideLoading()
			}
		})
	},
  randOne: function () {
    let that = this
    wx.request({
      url: getApp().globalData.apiUrl + '/?getJson=column&pageSize=1&classid=' + that.data.classid,
      method: 'GET',
      dataType: 'json',
      success: (json) => {
        wx.redirectTo({
          url: '../detail/detail?classid=' + that.data.classid + '&id=' + json.data.result[0].id
        })
      }
    })
  },
  copyTBL: function (e) {
    console.log('wwweeee', e)
    var self = this
    wx.setClipboardData({
      data: e.currentTarget.dataset.text.trim(),
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功'
            })
          }
        })
      }
    })
  },
  scrolltolowerLoadData: function (e) {
    console.log('scrolltolowerLoadData', e)
    this.getListData(this.data.classid, true)
  },
  previewImages: function (e) {
    console.log('eee', e)
    var current = e
    wx.previewImage({
      current: current,
      urls: ['' + current + '']
    })
  }
})
