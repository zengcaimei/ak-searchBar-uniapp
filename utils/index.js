import Vue from 'vue'
import AkRequest from '@/utils/AkRequest'
import globalConfig from '@/config/'
const akRequest = new AkRequest()
import store from '@/store'
// 请求拦截器
akRequest.interceptors.request((request) => {
	let token=uni.getStorageSync('token')?uni.getStorageSync('token'):''
	// request.header.Authorization = 'Bearer '+token
	// request.header['token'] = token
	return request
})
// 响应拦截器
akRequest.interceptors.response((response) => {
	console.log(response)
	if (response.statusCode === 200 && response.data.code === 401 || response.data.code === 511) {
		uni.clearStorageSync();
		uni.hideLoading()
		if(response.data.code === 401){
			uni.showToast({
				title: '请先登录！',
				icon: 'none'
			})
		}else{
			uni.showToast({
				title: '登录过期，请重新登录',
				icon: 'none'
			})
		}
		setTimeout(() => {
			uni.reLaunch({
			    url: '/pages/login/wxLogin'
			});
		}, 1000)
	}else if(response.statusCode === 200){
		return response.data
	}else {
		let mesg="服务器异常，请稍后再试";
		if(response.data&&response.data.msg){
			mesg=response.data.msg;
		}
		let data={
			message: mesg,
			code: 500
		}
		return data;
	}
})

// 设置默认配置
akRequest.setConfig((config) => {
	let token=uni.getStorageSync('token')?uni.getStorageSync('token'):''
	config.baseURL = globalConfig.baseUrl
	// config.header.Authorization = 'Bearer '+token
	// config.header['token'] = token
	return config
})
export default akRequest