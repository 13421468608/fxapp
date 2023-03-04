<template>
	<view class="rf-index">
		<view class="welcome-txt">欢迎来到商城</view>
		<!-- 轮播图1 -->
		<view class="swiper">
			<view class="swiper-box">
				<image src="@/static/image/index/banner.png" mode=""></image>
			</view>
		</view>
		<!-- 活动入口 -->
		<view class="activity" @tap="toVoucherDetail">
			<image src="@/static/image/index/banner2.png" mode=""></image>
		</view>
		<!-- 超值精选 -->
		<view class="selected-product">
			<view class="selected-product-title">
				<i></i>
				<text>超值精选</text>
				<i></i>
			</view>
			<view class="selected-product-list">
				<view class="selected-product-item" @tap="navToDetailPage(item.ID)" v-for="item in projectList" :key="item.ID">
					<image class="item-image" :src="item.image" mode=""></image>
					<view class="item-title">{{item.name}}</view>
					<view class="item-price"><text class="unit">¥</text>{{item.price }}</view>
				</view>
			</view>
		</view>
		<view class="more">
			{{ loadingType ==='more' ? '加载中...' : '没有更多了' }}
		</view>
		<!--页面加载动画-->
		<rfLoading isFullScreen :active="loading"></rfLoading>
		<rf-back-top :scrollTop="scrollTop"></rf-back-top>
		<!-- <rf-back-home></rf-back-home> -->
	</view>
</template>
<script>
	/**
	 * @des 微商城首页
	 *
	 * @author stav stavyan@qq.com
	 * @date 2020-01-08 14:14
	 * @copyright 2019
	 */
	import {
		indexList,
		productList,
		
		projectAll
	} from '@/api/product';
	import listCell from '@/components/rf-list-cell';
	import { mapMutations } from 'vuex';
	export default {
		components: {
			listCell,
		},
		data() {
			return {
				current: 0, // 轮播图index
				carouselList: {}, // 广告图
				config: {}, // 商户配置
				announceList: [], // 公告列表
				share: {},
				scrollTop: 0,
				kefuShow: true,
				newsBg: this.$mAssetsPath.newsBg,
				errorImage: this.$mAssetsPath.errorImage,
				appName: this.$mSettingConfig.appName,
				categoryList: [], // 分类列表
				categoryProductList: [], // 分类列表
				
				
				hotRecommendList: this.$mConstDataConfig.hotRecommendList,
				productLoading: true,
				isOpenIndexCate: this.$mSettingConfig.isOpenIndexCate,
				moneySymbol: this.moneySymbol,
				merchantShow: false,
				merchantData: {},
				
				loading: true,
				page: 1,
				page_size: 10,
				currentCate: 0,
				loadingType: 'more',
				projectList: []
			};
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		onShow() {
			this.getpProjectAll();
		},
		computed: {
			statusBar () {
				const e = uni.getSystemInfoSync();
				return e.statusBarHeight;
			},
			bottom () {
				let bottom = 0;
				/*  #ifdef H5  */
				bottom = 90;
				/*  #endif */
				return bottom;
			}
		},
		// 下拉刷新
		onPullDownRefresh() {
			this.getpProjectAll('refresh');
		},
		// 加载更多
		onReachBottom() {
			if (this.loadingType === 'nomore') return;
			this.page++;
			this.getpProjectAll();
		},
		methods: {
			// 获取主页数据
			async getpProjectAll(type) {
				try{
					let r = await this.$http.post(`${projectAll}`, {
							page: this.page,
							page_size: this.page_size,
						})
					if (type === 'refresh') {
						uni.stopPullDownRefresh();
						this.projectList = []
					}
					// 首页参数赋值
					this.initIndexData(r.data);
					this.loading = false;
				}catch(e){
					this.loading = false;
					this.loadingType ='nomore'
					if (type === 'refresh') {
						uni.stopPullDownRefresh();
					}
				}
			},
			// 首页参数赋值
			initIndexData(data) {
				this.projectList.push(...data.items)
				this.loadingType = data.items.length < this.page_size ? 'nomore' : 'more';
			},
			// 获取产品列表
			async getProductList(id) {
				await this.$http
					.get(`${productList}`, {
						cate_id: id,
						page: this.page
					})
					.then(async r => {
						this.loading = false;
						this.productLoading = false;
						this.loadingType = r.data.length < 10 ? 'nomore' : 'more';
						this.categoryProductList = [...this.categoryProductList, ...r.data];
					}).catch(() => {
						this.loading = false;
						this.productLoading = false;
					});
			},
			// 通用跳转
			navTo(route) {
				this.$mRouter.push({ route });
			},
			
			// 通用跳转
			navToSearch() {
				this.$mRouter.push({
					route: `/pages/index/search/search?data=${JSON.stringify(this.search)}`
				});
			},
			// 跳转至商品详情页
			navToDetailPage(id) {
				if (!id) return;
				this.$mRouter.push({ route: `/pages/product/product?id=${id}&type=goods` });
			},
			// 跳转至商品详情页 代金券
			toVoucherDetail(id) {
				if (!id) return;
				this.$mRouter.push({ route: `/pages/product/product?id=${id}&type=voucher` });
			},
		}
	};
</script>
<style lang="scss">
	page {
		background-color: $page-color-base;
	}
	.more{
		text-align: center;
		font-size: 28upx;
		color: #909399;
		padding-bottom: 120upx;
	}
	.rf-index {
		background-color: $color-white;
		/*标题*/
		.welcome-txt{
			font-size: 36upx;
			font-family: Source Han Sans CN;
			font-weight: 500;
			color: #0C0B0A;
			padding: 20upx 0 0 4%;
		}
		/*轮播图*/
		.swiper {
			width: 100%;
			margin: 20upx 0;
			display: flex;
			justify-content: center;
			.swiper-box {
				width: 92%;
				height: 320upx;
				overflow: hidden;
				border-radius: 15upx;
				//兼容ios，微信小程序
				position: relative;
				z-index: 1;
				image{
					width: 100%;
					height: 320upx;
				}
			}
		}
		/*轮播图*/
		.activity{
			height: 160upx;
			width: 690upx;
			margin: 20upx auto;
			image{
				height: 100%;
				width: 100%;
			}
		}
		/*轮播图2*/
		.swiper-item-text {
			position: absolute;
			bottom: 16upx;
			left: 30upx;
			height: 48upx;
			line-height: 48upx;
			background: rgba(0, 0, 0, 0.2);
			width: 90%;
			color: $color-white;
			border-bottom-left-radius: 12upx;
			padding-left: 20upx;
		}
		/*超值精选*/
		.selected-product{
			width: 710upx;
			margin: 20upx auto;
			&-title{
				font-size: 36upx;
				font-family: Source Han Sans CN;
				font-weight: 500;
				color: #000;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-bottom: 35upx;
				i{
					display: inline-block;
					height: 2upx;
					width: 36upx;
					margin: 0 40upx;
					background-color: #FFA800;
				}
			}
			&-list{
				width: 100%;
				display: flex;
				flex-wrap: wrap;
				justify-content: space-between;
				&:after {
					content: "";
					flex: auto;
				}
			}
			&-item{
				width: 216upx;
				height: auto;
				margin-bottom: 20upx;
				margin-right: 20upx;
				image{
					height: 216upx;
					width: 216upx;
					background-color: #4B4B4B;
				border-radius: 8upx;
				}
				.item-title{
					font-size: 24upx;
					font-family: Source Han Sans CN;
					font-weight: 400;
					color: #4B4B4B;
				}
				.item-price{
					font-size: 32upx;
					font-family: Source Han Sans CN;
					font-weight: 500;
					color: #000000;
				}
				.unit{
					font-size: 20upx;
					padding-right: 4upx;
				}
			}
		}
	}
</style>
