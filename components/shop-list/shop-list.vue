<template>
	<view>
		<view class="shopList" @click="listClick(i,index)" v-for="(i,index) in shopList" :key="index">
			<view class="headImg">
				<image :src="i.photodUrl || defaultIcon" mode="aspectFill"></image>
			</view>
			<view class="info">
				<view class="name">{{i.productName}}</view>
				<view class="about">
					商品编码: {{i.productCode}}
				</view>
				<view class="about">
					69码: {{i.barCode}}
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		name: 'shop-list',
		props: {
			shopList: {
				type: Array,
				value: []
			},
			showDel: { //是否展示删除按钮
				type: Boolean,
				value: false
			},
			showCheck:{ //是否展示选择按钮
				type: Boolean,
				value: false
			},
			selectedDoc:{
				type:String,
				value:null
			}
		},
		data () {
			return {
				defaultIcon: require('../../static/logo.png')
			}
		},
		methods: {
			// 查看商品详情
			listClick(i,index) { 
				const self=this;
				uni.navigateTo({
					url:''
				})
				self.$emit('change', i);
			},
			// 
			del(i,index){
				const self=this;
				// console.log(i)
				self.$emit('del', i);
			},
			//
			checkDoc(i,index){
				const self=this;
				// console.log(i)
				self.$emit('checkDoc', i);
			}
		}
	}
</script>

<style lang="less" scoped>
	.shopList {
		display: flex;
		padding: 34rpx 28rpx;
		border-top: 1rpx solid rgba(133, 150, 176, 0.32);
		background: rgba(240, 242, 244, 1);
		.headImg {
			width: 154rpx;
			height: 154rpx;
			border-radius: 50%;
			overflow: hidden;
			image {
				width: 100%;
				height: 100%;
			}
		}
		.info {
			width: 444rpx;
			margin-left: 28rpx;
			.name {
				color: rgba(22, 22, 22, 1);
				font-size: 25rpx;
				font-weight: bold;
			}
			.tag {
				background: rgb(40, 172, 255);
				border-radius: 3rpx;
				color: #FFFFFF;
				margin-right: 17rpx;
				padding: 4rpx 16rpx;
				border-radius: 8rpx;
			}
			.address {
				color: rgba(137, 137, 137, 1);
				font-size: 21rpx;
			}
			.about {
				color: rgba(137, 137, 137, 1);
				font-size: 21rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				/*! autoprefixer: off */
				-webkit-box-orient: vertical;
			}
		}
	}
</style>
