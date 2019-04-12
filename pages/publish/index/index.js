var COMMONFN = require('../../../utils/util.js');
var app = getApp();
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		height: app.globalData.height * 2 + 25,
		StatusBar: app.globalData.StatusBar,
		CustomBar: app.globalData.CustomBar,
		navbarData: {
			title: "发布作品",
			showCapsule: true,
			back: true,
			home: true
		},
	},
	onLoad: function (options) {
		COMMONFN.checkIsLogin();
	},
	onShareAppMessage: function (res) {
		return {
			title: '爱店(爱小程序商店)欢迎您提交小程序/小游戏',
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
})