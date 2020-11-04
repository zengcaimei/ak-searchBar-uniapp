# ak-searchbar-uniapp
# 项目目录说明

````
ak-searchbar-uniapp
├── common					// 公共的js与css
│   ├── css        			
│   ├── js          		         
├── components				// 公共组件
├── pages                   // 页面组件
├── static				  // 静态文件 图片资源等      		
├── unpackage
├── App.vue                                 
├── main.js 
├── packges.json 
````
## 功能介绍：
1、支持输入框输入搜索，H5扫码，小程序扫码
## 使用说明：
1、引入组件 
2、注册组件
3、在页面引用组件
## 特别提醒：使用H5扫码时要安装'weixin-js-sdk'
```javascript
import mSearch from '@/components/ak-searchbar/ak-searchbar.vue';
// #ifdef  H5
import wx from 'weixin-js-sdk';
// #endif
export default {
		components: {
			mSearch
		},
		data() {
			return {
				value:''
			}
		}
		// 方法
		methods: {
			search(e){
				var self = this
				self.value = e
			},
			searchScan() {
				console.log('唤起扫码')
				uni.showLoading({
					title: '识别中'
				})
				var self = this;
				// 允许从相机和相册扫码
				// #ifdef  MP-WEIXIN
				uni.scanCode({
					success: function(res) {
						uni.hideLoading()
						console.log(res)
						const params = {
							code: res.result
						}
						getProductInfoBybarCode(params).then(result=>{
							console.log(result)
							_self.loadingType = 2;
							if (!result.data) {
								uni.showToast({
									title: result.message,
									icon: 'none'
								})
								self.shopList = []
								return
							}
							self.shopList = result.data.data
						})
					},
					fail: function(fail) {
						console.log(fail)
						uni.showToast({
							title: '识别失败',
							icon: 'none'
						})
					}
				});
				// #endif
				// #ifdef  H5
				var ua = navigator.userAgent.toLowerCase();
				var isWeixin = ua.indexOf('micromessenger') != -1;
				console.log(isWeixin)
				if (isWeixin) {	
					uni.request({
						url: getApp().globalData.testApiUrl + '/hlwyy/api/order/wxpay/getSign', //仅为示例，并非真实接口地址。
						method: 'GET',
						data: {
							url: location.href.split('#')[0]
						},
						success: (res) => {
							console.log(res)
							if (res.data.code == 0) {
								wx.config({
									debug: false,
									appId: res.data.appId,
									nonceStr: res.data.nonceStr,
									signature: res.data.signature,
									timestamp: res.data.timestamp,
									jsApiList: [
										'checkJsApi',
										'scanQRCode'
									]
								});
								wx.ready(res => {
									wx.checkJsApi({
										jsApiList: ['scanQRCode'],
										success: function(res) {
											console.log(res)
										}
									});
									wx.scanQRCode({
										needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
										scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
										success: function(res) {
											var str = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
											console.log("扫描结果：" + str);
										}
									});
								})
							} else {
								console.log('请求出错')
							}
						}
			
					})
				} else {
					uni.showToast({
						title: '请在微信中打开该网站，否则无法正常使用',
						icon: 'none'
					})
				}
				// #endif
		}
	}
```
 ```html
 <mSearch @search="search($event)" @searchScan="searchScan()"></mSearch>
 ```
## 方法
| 方法名			| 参数			|  说明												|
| --------		| -----:		| :----:											|
| search		| val			|  输入框调用										|
| searchScan	| val			|  扫码调用											|




