var app = getApp();

//多张图片上传
function uploadimg(data) {
	console.log('dddd', data);
	let _this = this;
	var that = this,
	i = data.i ? data.i : 0,
	success = data.success ? data.success : 0,
	fail = data.fail ? data.fail : 0;
	console.log('vdata.path[i]data.path[i]', data.path[i]);
	wx.uploadFile({
		url: data.url,
		filePath: data.path[i],
		name: data.name,
		success: (resp) => {
			console.log('resp---===---',resp);
			app.globalData.xqimgList += resp.data + '::::::::::';
			success++;
		},
		fail: (res) => {
			fail++;
			console.log('fail:' + i + "fail:" + fail);
		},
		complete: () => {
			i++;
			if (i == data.path.length) { // 图片传完时停止调用          
				console.log('穿完啦');
				console.log('data.todb', data.toDB);
				console.log('app.globalData.xqimgListapp.globalData.xqimgList', app.globalData.xqimgList);
				app.globalData.xqimgList = app.globalData.xqimgList.substring(0, app.globalData.xqimgList.length - 10);
				console.log({
					sessionkey: data.toDB.sessionkey,
					title: data.toDB.title,
					intro: data.toDB.intro,
					weixin: data.toDB.weixin,
					author: data.toDB.author,
					icon_temp: getApp().globalData.reGlobalIconUrl,
					temp_icon: getApp().globalData.reGlobalIconUrl,
					temp_qrode: getApp().globalData.reGlobalQrodeUrl,
					temp_publish_weixin: getApp().globalData.reGlobalPublicWeixinUrl,
					preimgs: app.globalData.xqimgList,
					ecmsfrom: 'xiaochengxu',
					username: data.toDB.username,
					enews: 'MAddInfo',
					rnd: data.toDB.rnd,
					mid: '7',
					classid: data.toDB.classid,
					addnews: '提交'
				});
				wx.request({
					url: 'https://www.yishuzi.com.cn/shop_xiaochengxu_api/publish.php',
					data: {
						sessionkey: data.toDB.sessionkey,
						title: data.toDB.title,
						intro: data.toDB.intro,
						weixin: data.toDB.weixin,
						author: data.toDB.author,
						temp_icon: getApp().globalData.reGlobalIconUrl,
						temp_qrode: getApp().globalData.reGlobalQrodeUrl,
						temp_publish_weixin: getApp().globalData.reGlobalPublicWeixinUrl,
						preimgs: app.globalData.xqimgList,
						ecmsfrom: 'xiaochengxu',
						username: data.toDB.username,
						enews: 'MAddInfo',
						rnd: data.toDB.rnd,
						mid: '7',
						classid: data.toDB.classid,
						addnews: '提交'
					},
					header: { 'content-type': 'application/x-www-form-urlencoded' },
					method: 'POST',
					dataType: 'json',
					success: (json) => {
						console.log('入库完毕');
						app.globalData.xqimgList = '';
						console.log('---===-----json====', json);
						wx.hideLoading();
						if (json.data.status == 1) {
							wx.showModal({
								content: json.data.message + ',点击【确定】进入我发布的头像(审核后即可展示)，点击【取消】返回首页',
								confirmColor: '#ff5a00',
								success: function (res) {
									console.log('res----',res);
									if (res.cancel) {
										wx.switchTab({
											url: '../../index/index'
										});
									} else {
										getApp().globalData.globalTitle = '';
										getApp().globalData.globalWeixin = '';
										getApp().globalData.globalAuthor = '';
										getApp().globalData.globalIntro = '';
										getApp().globalData.globalIconUrl = '';
										getApp().globalData.globalQrodeUrl = '';
										getApp().globalData.globalPublicWeixinUrl = '';
										getApp().globalData.publish_img_urls = [];
										getApp().globalData.reGlobalIconUrl = '';
										getApp().globalData.reGlobalQrodeUrl = '';
										getApp().globalData.reGlobalPublicWeixinUrl = '';
										wx.redirectTo({
											url: '../../publish/xiaochengxu/index'
										});
									}

								}
							})
						}else{
							wx.showModal({
								title: '错误信息提示',
								content: json.data.message
							})
						}
					}
				})
			} else { // 图片还没有传完继续调用函数
				data.i = i;
				data.success = success;
				data.fail = fail;
				that.uploadimg(data);
			}
		}
	});
}

module.exports = {
	uploadimg: uploadimg,
}