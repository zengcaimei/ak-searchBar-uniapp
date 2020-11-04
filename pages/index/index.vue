<template>
	<view class="content">
		<view class="searchBar">
			<mSearch @search="search($event)" @searchScan="searchScan()"></mSearch>
		</view>
		<view class="shop">
			<shop-list :shop-list="shopList"></shop-list>
		</view>
		<text class="loading-text">
			{{loadingType === 0 ? contentText.contentdown : (loadingType === 1 ? contentText.contentrefresh : contentText.contentnomore)}}
		</text>
	</view>
</template>

<script>
	import mSearch from '@/components/ak-searchbar/ak-searchbar.vue';
	import uniIcons from '@/components/uni-icons/uni-icons.vue';
	import list from '../../components/shop-list/shop-list.vue'
	// #ifdef  H5
	import wx from 'weixin-js-sdk';
	// #endif
	import {
		getProductInfoBybarCode,
		getProductInfoByName
	} from '@/api/home'
	var _self, currPage = 1,
		pageSize = 20,
		timer = null;
	export default {
		components: {
			mSearch,
			uniIcons,
			list
		},
		data() {
			return {
				loadingType: 2,
				contentText: {
					contentdown: "上拉显示更多",
					contentrefresh: "正在加载...",
					contentnomore: "没有更多数据了"
				},
				shopList: [],
				value: ''
			};
		},
		onLoad() {
			_self = this;
		},
		//加载更多
		onReachBottom() {
			//触底的时候请求数据，即为上拉加载更多
			//为了更加清楚的看到效果，添加了定时器
			if (timer != null) {
				clearTimeout(timer);
			}
			timer = setTimeout(function() {
				_self.getMoreList();
			}, 1000);
		},
		methods: {
			search(e) {
				var self = this
				self.value = e
				currPage = 1;
				this.loadingType = 0;
				uni.showNavigationBarLoading();
				const params = {
					name: e,
					page: 1,
					size: pageSize
				}
				uni.showLoading({
					title: '搜索中'
				})
				getProductInfoByName(params).then(res => {
					console.log(res)
					uni.hideLoading()
					uni.hideNavigationBarLoading();
					uni.stopPullDownRefresh(); //得到数据后停止下拉刷新
					if (!res.data) {
						uni.showToast({
							title: res.message,
							icon: 'none'
						})
						_self.loadingType = 2;
						self.shopList = []
						return
					}
					if (res.data.size < pageSize) { //没有数据
						_self.loadingType = 2;
					}
					currPage++; //得到数据之后currPage+1
					self.shopList = res.data.data
					
				})
			},
			// 加载更多
			async getMoreList() {
				if (_self.loadingType !== 0) { //loadingType!=0;直接返回
					return false;
				}
				_self.loadingType = 1;
				uni.showNavigationBarLoading(); //显示加载动画
				//准备参数
				const parmas = {
					name: this.value,
					page: currPage,
					size: pageSize
				}
				getProductInfoByName(parmas)
					.then(res => {
						if (res.code === 200) {
							if (res.data == null) { //没有数据
								_self.loadingType = 2;
								uni.hideNavigationBarLoading(); //关闭加载动画
								return;
							}
							currPage++; //每触底一次 currPage +1
							_self.shopList = _self.shopList.concat(res.data.data); //将数据拼接在一起
							_self.loadingType = 0; //将loadingType归0重置
							uni.hideNavigationBarLoading(); //关闭加载动画		
						} else {
							uni.showToast({
								title: res.message || res.data.message,
								icon: 'none'
							})
						}
					})
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
	};
</script>
<style lang="scss" scoped>
	.searchBar {
		width: 100%;
		position: fixed;
		top: 0;
		z-index: 99;
	}
	.shop {
		margin-top: 94rpx;
	}
</style>
