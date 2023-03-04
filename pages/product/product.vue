<template>
	<view class="product">
		<rf-product-detail @product="getprojectDetail" :type='productType' :userInfo="userInfo"  :product="projectDetail"></rf-product-detail>
		<!--回到顶部-->
		<rf-back-top :scrollTop="scrollTop"></rf-back-top>
		<!-- 404页面 -->
		<view v-if="!projectDetail.name && !loading">
			<rf-no-data :custom="true">
				<view class="no-data-title">
					{{ errorInfo || '暂无数据' }}
				</view>
				<view
					@tap="getprojectDetail(projectDetail.id)"
					slot="refresh"
					class="spec-color"
					>重新加载</view
				>
			</rf-no-data>
		</view>
		<!--页面加载动画-->
		<rfLoading isFullScreen :active="loading"></rfLoading></view>
</template>
<script>
import { projectDetail,voucherDetail } from '@/api/product';
import rfProductDetail from '@/components/rf-product-detail';
import rfBackTop from '@/components/rf-back-top';
import rfNoData from '@/components/rf-no-data';
export default {
	components: {
		rfProductDetail,
		rfBackTop,
		rfNoData
	},
	data() {
		return {
			projectDetail: {},
			productType: null,
			loading: true,
			errorInfo: '',
			userInfo: {},
			scrollTop: 0,
			currentUrl: '',
			navDetailShow: false,
			appName: this.$mSettingConfig.appName
		};
	},
	// #ifndef MP
	onNavigationBarButtonTap(e) {
		const index = e.index;
		if (index === 0) {
			this.navDetailShow = true;
		}
	},
	// #endif
	onPageScroll(e) {
		this.scrollTop = e.scrollTop;
	},
	onLoad(options) {
		this.productId = options.id;
		this.productType = options.type; // goods商品 voucher代金券
		this.userInfo = uni.getStorageSync('userInfo') || {};
		this.initData();
	},
	methods: {
		// 隐藏顶部导航
		hideNavDetail() {
			this.navDetailShow = false;
		},
		// 数据初始化
		initData() {
			this.hasLogin = this.$mStore.getters.hasLogin;
			if(this.productType === 'voucher'){
				this.getVoucherDetail()
			}else if(this.productType === 'goods'){
				this.getprojectDetail();
			}
			
		},
		// 获取产品详情
		async getprojectDetail() {
			let r = await this.$http.get(`${projectDetail}${this.productId}`)
			this.loading = false;
			this.projectDetail = r.data;
			uni.setNavigationBarTitle({ title: r.data.name })
		},
		
		// 获取代金券详情
		async getVoucherDetail() {
			let r = await this.$http.get(`${voucherDetail}`)
			this.loading = false;
			this.projectDetail = r.data;
			uni.setNavigationBarTitle({ title: r.data.name })
		}
	}
};
</script>
<style scoped lang="scss">
page {
	background: $page-color-base;
}
</style>
