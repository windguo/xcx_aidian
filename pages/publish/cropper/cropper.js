Page({
	data: {
		src: '',
		width: 300,//宽度
		height: 300,//高度,
		state:''
	},
	onLoad: function (options) {
		console.log('====options===', options);
		this.cropper = this.selectComponent("#image-cropper");
		this.setData({
			src: options.src,
			state:options.state || ''
		});
		wx.showLoading({
			title: '加载中'
		})
	},
	cropperload(e) {
		console.log("cropper初始化完成");
	},
	loadimage(e) {
		console.log("图片加载完成", e.detail);
		wx.hideLoading();
		//重置图片角度、缩放、位置
		this.cropper.imgReset();
	},
	clickcut(e) {
		console.log('e.detaile.detail--===--',e);
		if (this.data.state == 'icon'){
			getApp().globalData.globalIconUrl = e.detail.url;
		}else if(this.data.state == 'qrode'){
			getApp().globalData.globalQrodeUrl = e.detail.url;
		}else if(this.data.state == 'public_weixin'){
			getApp().globalData.globalPublicWeixinUrl = e.detail.url;
		} else if (this.data.state == 'more'){
			getApp().globalData.publish_img_urls.push(e.detail.url);
		};
		// console.log(`../xiaochengxu/index?state=` + this.data.state);return false;
		wx.redirectTo({
			url: `../xiaochengxu/index?state=` + this.data.state
		});
		console.log('---===--', getApp().globalData.publish_img_urls);
		//点击裁剪框阅览图片
		// wx.previewImage({
		// 	current: e.detail.url, // 当前显示图片的http链接
		// 	urls: [e.detail.url] // 需要预览的图片http链接列表
		// })
	},
})