<template>
	<view class="product">
		<view class="price">
			<view class="text">请选择代金券额度</view>
			<view class="price-list" v-if="priceList.length">
				<view 
					v-for="(item,index) in priceList"
					:key="index"
					:class="['price-item',priceNumber == item ? 'on' : '']"
					@click="priceChange(item)"
				>
					<text class="unit">¥</text>
					<text>{{item}}</text>
				</view>
			</view>
		</view>
		<view class="pay-list">
			<view class="pay-title border-x-b">支付方式</view>
			<view class="pay-item border-x-b" v-for="(item,index) in payList" :key="item.pay_key" @tap="setPay(index)">
				<view class="pay-item_l">
					<i :class="['pay-icon', item.name=='微信'?'wx':item.name=='支付宝'?'zfb':'bank']"></i>
					<view>{{item.name}}支付</view>
				</view>
				<view class="pay-item_r">
					<i :class="['icon-radio',pay_key==item.pay_key?'on':'']"></i>
				</view>
			</view>
		</view>
		
		<button
			class="confirm-btn"
			:class="'bg-' + themeColor.name"
			:disabled="btnLoading"
			:loading="btnLoading"
			@tap="goPay"
		>
			确认支付
		</button>
		<!--页面加载动画-->
		<rfLoading isFullScreen :active="loading"></rfLoading></view>
</template>
<script>
import { payChannel,payPay } from '@/api/product';
export default {
	// 确认订单
	data() {
		return {
			projectDetail: {},
			productType: null,
			loading: true,
			btnLoading: false,
			
			priceList:[],
			payList:[],
			payRaiodInd: 0,
			priceNumber: 0,
			pay_key: null,
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
		// 数据初始化
		initData() {
			this.hasLogin = this.$mStore.getters.hasLogin;
			this.getPayChannel()
		},
		
		// 获取支付相关数据
		async getPayChannel() {
			let r = await this.$http.get(`${payChannel}`)
			this.loading = false;
			this.payList = r.data;
			this.setPay(0)
		},
		
		// 根据支付方式 设置price  index下标
		setPay(index){
			let obj = this.payList[index]
			this.pay_key = obj.pay_key
			this.priceNumber = 0
			this.priceList = obj.support_amount.split(',')
		},
		priceChange(number){
			this.priceNumber = Number(number)
		},
		
		// 拉起支付
		async goPay(){
			if(!this.pay_key){
				this.$mHelper.toast('请选择支付方式');
				return
			}else if(!this.priceNumber){
				this.$mHelper.toast('请选择支付金额');
				return
			}
			this.btnLoading = true
			let r = await this.$http.post(`${payPay}`,{amount: this.priceNumber,pay_key: this.pay_key})
		}
	}
};
</script>
<style scoped lang="scss">
page {
	background: #f2f2f2;
}
.product{
	padding: 0 30upx;
	.price{
		.text{
			font-size: 30upx;
			font-family: Source Han Sans CN;
			font-weight: 400;
			color: #1A1A1A;
			line-height: 88upx;
		}
		.price-list{
			width: 100%;
			display: flex;
			.price-item{
				width: 216upx;
				height: 139upx;
				background: #FFFFFF;
				border: 1px solid #E0E0E0;
				border-radius: 8upx;
				font-size: 28upx;
				font-family: Source Han Sans CN;
				color: #000000;
				margin: 0 20upx 20upx 0;
				text-align: center;
				background-color: #fff;
				display: flex;
				align-items: center;
				&.on{
					background: #FFA800;
				}
				justify-content: center;
				.unit{
					font-size: 24upx;
					font-weight: 500;
				}
			}
		}
	}
	.pay-list{
		margin-top: 20upx;
		width: 100%;
		height: auto;
		background: #FFFFFF;
		border-radius: 16upx;
		.pay-title{
			font-size: 32upx;
			line-height: 94upx;
			font-family: Source Han Sans CN;
			font-weight: 500;
			color: #000000;
			padding-left: 27upx;
			box-sizing: border-box;
		}
		.pay-item{
			height: 108upx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 0 20upx;
			box-sizing: border-box;
			.pay-item_l{
				display: flex;
				align-items: center;
				.pay-icon{
					display: inline-block;
					height: 48upx;
					width: 48upx;
					background-size: 100%;
					background-repeat: no-repeat;
					margin-right: 20upx;
					&.wx{
						background-image: url('@/static/image/index/pay_wx.png');
					}
					&.zfb{
						background-image: url('@/static/image/index/pay_zfb.png');
					}
					&.bank{
						background-image: url('@/static/image/index/pay_bank.png');
					}
				}
			}
			.pay-item_r{
				
				.icon-radio{
					display: inline-block;
					width: 40upx;
					height: 40upx;
					background: #FFFFFF;
					border-radius: 20upx;
					position: relative;
					&.on{
						background: url('@/static/image/index/icon_check.png') no-repeat;
						background-size: 100%;
						&::before{
							border: none;
						}
					}
					&::before{
						position: absolute;
						left: calc(-50% - 1PX);
						top: calc(-50% - 1PX);
						z-index: 1;
						content: '';
						width: 200%;
						height: 200%;
						border-radius: 50%;
						border: 1PX solid #D9D9D9;
						-webkit-transform: scale(0.5);
						transform: scale(0.5);
					}
				}
			}
		}
	}
}
.confirm-btn {
	height: 86upx;
	line-height: 86upx;
	width: 100%;
	margin-top: 60upx;
}
</style>
