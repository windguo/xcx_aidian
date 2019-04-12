var COMMONFN = require('../../../utils/util.js');
var uploadPicture = require('../../../utils/c.js');
var app = getApp();
Page({
	data: {
		height: app.globalData.height * 2 + 25,
		StatusBar: app.globalData.StatusBar,
		CustomBar: app.globalData.CustomBar,
		navbarData: {
			title: "发布小程序",
			showCapsule: true,
			back: true,
			home: true
		},
		username: '',
		avatarUrl: '',
		usernames: '',
		rnd: '',
		index: 0,
		objectArray: [],
		_classid: '',
		contents: '',
		sessionkey: '',
		iconTempFilePaths: [],
		iconUrl:'',
		qrodeUrl:'',
		public_weixinUrl:'',
		picsItems: [],
		// 上传的案例图片集合
		uploadImages: [],
		// 设置上传案例图片的最大数目
		maxImages: 1,
		// 案例图片数目是否达到了最大数目
		isMaxImagesNum: false
	},
	onLoad: function (options) {
		console.log('-----options----',options);
		let that = this;
		COMMONFN.checkIsLogin();
		this.setData({
			state:options.state || 0,
			index: (options.index) ? options.index : getApp().globalData.globalXiaochengxuClassIndex,
			avatarUrl: wx.getStorageSync('storageLoginedavAtarUrl'),
			sessionkey: wx.getStorageSync('storageSessionkey'),
			rnd: wx.getStorageSync('storageRnd'),
			usernames: wx.getStorageSync('storageLoginedUsernames'),
			iconUrl: getApp().globalData.reGlobalIconUrl,
			qrodeUrl: getApp().globalData.reGlobalQrodeUrl,
			public_weixinUrl: getApp().globalData.reGlobalPublicWeixinUrl,
			globalTitle : getApp().globalData.globalTitle,
			globalWeixin: getApp().globalData.globalWeixin,
			globalAuthor: getApp().globalData.globalAuthor,
			globalIntro: getApp().globalData.globalIntro,
			picsItems: getApp().globalData.publish_img_urls
		});
		// 获取栏目
		wx.request({
			url: 'https://www.yishuzi.com.cn/shop_xiaochengxu_api/?getJson=class&classid=3&publish=1',
			header: { 'content-type': 'application/x-www-form-urlencoded' },
			method: 'GET',
			dataType: 'json',
			success: (json) => {
				console.log('class-json', json.data.result);
				this.setData({
					objectArray: json.data.result
				});
			}
		});
		if(this.data.state == 'icon'){
			wx.showLoading({
				title: '图标上传中...',
				mask: true
			});
			wx.uploadFile({
				url: 'https://www.yishuzi.com.cn/shop_xiaochengxu_api/?getJson=saveIcon', //仅为示例，非真实的接口地址
				filePath: getApp().globalData.globalIconUrl,
				name: 'file',
				success: function (res) {
					console.log('icon--url:', res);
					getApp().globalData.reGlobalIconUrl = res.data;
					that.setData({
						iconUrl: getApp().globalData.reGlobalIconUrl
					})
					wx.hideLoading();
				}
			})
		} else if (this.data.state == 'qrode'){
			wx.showLoading({
				title: '小程序码上传中...',
				mask: true
			});
			wx.uploadFile({
				url: 'https://www.yishuzi.com.cn/shop_xiaochengxu_api/?getJson=saveQrode', //仅为示例，非真实的接口地址
				filePath: getApp().globalData.globalQrodeUrl,
				name: 'file',
				success: function (res) {
					console.log('qrode--url:', res);
					getApp().globalData.reGlobalQrodeUrl = res.data;
					that.setData({
						qrodeUrl: getApp().globalData.reGlobalQrodeUrl
					})
					wx.hideLoading();
				}
			})
		} else if (this.data.state == 'public_weixin'){
			wx.showLoading({
				title: '公众号上传中...',
				mask: true
			});
			wx.uploadFile({
				url: 'https://www.yishuzi.com.cn/shop_xiaochengxu_api/?getJson=savePublicWeixin', //仅为示例，非真实的接口地址
				filePath: getApp().globalData.globalPublicWeixinUrl,
				name: 'file',
				success: function (res) {
					console.log('public_weixin--url:', res);
					getApp().globalData.reGlobalPublicWeixinUrl = res.data;
					that.setData({
						public_weixinUrl: getApp().globalData.reGlobalPublicWeixinUrl
					})
					wx.hideLoading();
				}
			})
		}
	},
	titleBindblur:function(e){
		console.log('titleBindblur--e--',e.detail.value);
		getApp().globalData.globalTitle = e.detail.value;
	},
	weixinBindblur: function (e) {
		console.log('weixinBindblur--e--', e.detail.value);
		getApp().globalData.globalWeixin = e.detail.value;
	},
	authorBindblur: function (e) {
		console.log('authorBindblur--e--', e.detail.value);
		getApp().globalData.globalAuthor = e.detail.value;
	},
	introBindblur: function (e) {
		console.log('introBindblur--e--', e.detail.value);
		getApp().globalData.globalIntro = e.detail.value;
	},
	upIconfile: function () {
		let that = this;
		wx.chooseImage({
			success: function (res) {
				var imgsrc = res.tempFilePaths;
				wx.redirectTo({
					url: '../cropper/cropper?state=icon&src=' + imgsrc
				});
			}
		})
	},
	upQcodefile: function () {
		let that = this;
		wx.chooseImage({
			success: function (res) {
				var imgsrc = res.tempFilePaths;
				wx.redirectTo({
					url: '../cropper/cropper?state=qrode&src=' + imgsrc
				});
			}
		})
	},
	upPublicWeixinfile: function () {
		let that = this;
		wx.chooseImage({
			success: function (res) {
				var imgsrc = res.tempFilePaths;
				wx.redirectTo({
					url: '../cropper/cropper?state=public_weixin&src=' + imgsrc
				});
			}
		})
	},
	uploadimg: function (e) {//这里触发图片上传的方法
		wx.showLoading({
			title: '拼命上传中'
		});
		let that = this;
		console.log('..this.data.picsItems..this.data.picsItems--', this.data.picsItems);
		var pics = this.data.picsItems;
		console.log({
			sessionkey: wx.getStorageSync('storageSessionkey'),
			username: wx.getStorageSync('storageLoginedUsernames'),
			rnd: wx.getStorageSync('storageRnd'),
			classid: e.detail.value.classid,
			title: e.detail.value.title,
			intro: e.detail.value.intro,
			weixin: e.detail.value.weixin,
			author: e.detail.value.author
		});
		uploadPicture.uploadimg({
			// 传图同时携带的参数
			url: 'https://www.yishuzi.com.cn/shop_xiaochengxu_api/?getJson=saveMorePic',
			path: pics,
			name: 'file',
			date: Date.now(),
			toDB: {
				sessionkey: wx.getStorageSync('storageSessionkey'),
				username: wx.getStorageSync('storageLoginedUsernames'),
				rnd: wx.getStorageSync('storageRnd'),
				classid: e.detail.value.classid,
				title: e.detail.value.title,
				intro: e.detail.value.intro,
				weixin: e.detail.value.weixin,
				author: e.detail.value.author
			}
		});
	},
	bindPickerChange: function (e) {
		console.log('bindPickerChangebindPickerChangebindPickerChange--', e.detail.value);
		this.setData({
			_classid: this.data.objectArray[e.detail.value].classid,
			index: e.detail.value
		});
		getApp().globalData.globalXiaochengxuClassIndex = e.detail.value;
	},
	formSubmit: function (e) {
		let that = this;
		console.log('form发生了submit事件，携带数据为：', e.detail.value);
		if (e.detail.value.title == '') {
			wx.showModal({
				content: '请输入小程序名称',
				showCancel: false,
				confirmColor: '#ff5a00'
			})
			setTimeout(function () {
				wx.hideToast()
			}, 2000);
			return false;
		}else{
			wx.showLoading({
				title: '发布中'
			});
			that.uploadimg(e);
		}
	},
	//多图
	// 选择图片
	chooseImageTap: function () {
		console.log('this.data.图片数量', (this.data.picsItems).length);
		if ((this.data.picsItems).length >= 9) {
			wx.showModal({
				content: '最多只允许选择9张',
				showCancel: false,
				confirmColor: '#ff5a00'
			})
			return false;
		}
		let _this = this;
		wx.chooseImage({
			// 相关属性设置
			count: 1,
			sizeType: ['original'],
			sourceType: ['album'],
			success: function (res) {
				console.log('ssss---ssss---', res);
				var imgsrc = res.tempFilePaths;
				wx.redirectTo({
					url: '../morecropper/cropper?state=more&src=' + imgsrc
				});
				// (getApp().globalData.publish_img_urls).push(res.tempFilePaths[0]);
				// _this.setData({
				// 	picsItems: getApp().globalData.publish_img_urls
				// });
				// console.log('---=picsItem_thisspicsItems==--', _this.data.picsItems);
			}
		})
	},
	// 预览所选图片
	selImagePre: function (e) {
		console.log('eeee', e);
		let _this = this;
		wx.previewImage({
			urls: this.data.picsItems,
			current: e.currentTarget.dataset.src
		})
	},
	delItem: function (e) {
		console.log('eeeeee', e);
		console.log('picsItems--', this.data.picsItems);
		let _p = this.data.picsItems;
		var index = _p.indexOf(e.currentTarget.dataset.item);
		if (index > -1) {
			_p.splice(index, 1);
		};
		this.setData({
			picsItems: _p
		})
		console.log('picsItems--2---', this.data.picsItems);
		console.log('this.data.图片数量-del--', (this.data.picsItems).length);
	}
})