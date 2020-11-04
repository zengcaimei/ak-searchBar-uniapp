<script>
	// import VConsole from 'common/vconsole.min.js' //import vconsole
	// let vConsole = new VConsole() // 初始化
	export default {
		globalData: {
			apiurl: 'http://dpom_api.ak1ak1.com',
			// testApiUrl:'http://192.168.2.66:8071'
			testApiUrl:'http://192.168.2.253:907'
		},
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	/* 数据加载字体 */
	.loading-text {
		display: block;
		text-align: center;
		font-size: 28upx;
		font-weight: 300;
		color: rgba(130, 130, 130, 1);
	}
</style>
