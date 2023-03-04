<template>
  <view class="rf-product-detail">
		<!--header-->
		<view class="detail" v-if="product.name">
			<!--顶部商品轮播图-->
			<view class="carousel">
				<swiper indicator-dots circular="true" duration="400" controls touchable>
					<swiper-item
						class="swiper-item"
						v-for="(item, index) in product.project_images"
						:key="index"
					>
						<view class="image-wrapper">
							<image :data='$imgBase + item.path' class="loaded" mode="aspectFill"></image>
						</view>
						<uni-tag class="content" circle size="small" :text="`${index + 1}  / ${product.project_images.length}`"></uni-tag>
					</swiper-item>
				</swiper>
			</view>
			<!--商品信息-->
			<view class="introduce-section">
				<view class="introduce-first-line">
					<view class="price-box">
						<text class="unit" :class="'text-' + themeColor.name">{{ moneySymbol }}</text>
						<text class="price" :class="'text-' + themeColor.name">{{ product.price / 100}}</text>
					</view>
				</view>
				<view class="data" v-if="product">
					<text class="item">销量 {{ product.sales }}</text>
					<text class="item">库存 {{product.in_stock}}</text>
					<text class="item">浏览量: {{product.views}}</text>
				</view>
			</view>
			<view class="detail-desc">
				<view class="d-header">
					<text>商品详情</text>
				</view>
				<view>
					<view v-if="type === 'goods'">
						<img class="detail-image" :src="$imgBase + product.images_detail" mode=""></img>
					</view>
					<view class="voucher" v-else>
						<text>温馨提示</text>
						<text>平台代金券仅用于平台商品购买与消费！</text>
					</view>
				</view>
				
			</view>
			<!-- 底部操作菜单 -->
			<view class="page-bottom">
				<button
					class="primary-btn"
					@tap="buy('buy')"
				>
					立即购买
				</button>
			</view>
			
			
			
			<!--购买类型-->
			<view class="popup" :class="specClass">
				<!-- 遮罩层 -->
				<view class="mask" @tap="specClass='none'"></view>
				<!--内容层-->
				<view class="layer">
					<view class="popup-cnt">
						<view class="popup-info border-x-b">
							<image class="popup-info-img" :src="$imgBase + product.project_images[0].path"></image>
							<view class="popup-info-r">
								<view class="name">{{product.name}}</view>
								<view class="flex">
									<view class="unit">¥</view>
									<view class="price">{{product.price / 100}}</view>
								</view>
								<view class="kc">库存：{{product.in_stock}}</view>
							</view>
						</view>
						<view class="popup-text">
							<view>
								<view class="title">购买规格</view>
								<view>
									<view class="tag">默认规格</view>
								</view>
							</view>
						</view>
						<view class="popup-btn">
							<button :loading="product.in_stock>0 && btnLoading" :disabled="product.in_stock>0 && btnLoading" @tap="handleProjectPay">确认</button>
						</view>
					</view>
				</view>
				</view>
			</view>
	</view>
</template>
<script>
	import moment from '@/common/moment';
	import rfRate from '@/components/rf-rate/rf-rate';
	import uniTag from '@/components/uni-tag/uni-tag';
	import rfNav from '@/components/rf-nav';
	import { cartItemCount, cartItemCreate,projectPay } from '@/api/product';
	import {  pickupPointIndex, transmitCreate } from '@/api/basic';
	
	import rfItemPopup from '@/components/rf-item-popup';
	import rfAttrContent from '@/components/rf-attr-content';
	import { couponReceive, addressList } from '@/api/userInfo';
	import { mapMutations } from 'vuex';
		export default {
			name: 'rfProductDetail',
			props: {
				product: {
					type: Object,
					default() {
						return {
						};
					}
				},
				userInfo: {
					type: Object,
					default() {
						return {};
					}
				},
				url: {
					type: String,
					default: ''
				},
				type: {
					type: String,
					default: 'goods'
				}
			},
			components: {
				rfNav,
				rfRate,
				uniTag,
				rfItemPopup,
				rfAttrContent
			},
			data() {
				return {
					appServiceQr: this.$mSettingConfig.appServiceQr,
					addressClass: 'none',
					canvasShow: true,
					logo: this.$mSettingConfig.appLogo,
					vipPrice: this.$mAssetsPath.vipPrice,
					posterShow: false,
					currentStock: null,
					currentSkuPrice: null,
					currentSkuName: null,
					currentCartCount: 1,
					evaluateList: [],
					hasLogin: this.$mStore.getters.hasLogin,
					cartNum: uni.getStorageSync('cartNum'),
					addressTypeList: this.$mConstDataConfig.addressTypeList,
					tabCurrentIndex: 0,
					loading: true,
					errorInfo: '',
					headImg: this.$mAssetsPath.headImg,
					isPointExchange: false,
					shareBg: this.$mAssetsPath.shareBg,
					appServiceType: this.$mSettingConfig.appServiceType,
					productPosterQrType: this.$mSettingConfig.productPosterQrType,
					appName: this.$mSettingConfig.appName,
					shareFrom: '',
					poster: {},
					promoCode: '',
					addressList: [],
					moneySymbol: this.moneySymbol,
					state: 1,
					singleSkuText: this.singleSkuText,
					thirdPartyQrCodeImg: '',
					
					specClass: 'none', // 商品参数弹窗
					btnLoading: false,
				};
			},
			filters: {
				time(val) {
					return moment(val * 1000).format('YYYY-MM-DD HH:mm');
				}
			},
			methods: {
				hideService(){
					this.specClass = 'none'
				},
				// 返回上一页
				navBack() {
					this.$mRouter.back();
				},
				// 通用跳转
				navTo(route) {
					if (!this.hasLogin) {
						this.$mHelper.backToLogin();
					} else {
						if (this.appServiceType === '0') {
							this.$mHelper.toast('暂不提供客服功能');
						} else {
							this.$mRouter.push({ route });
						}
					}
				},
				// 获取收货地址列表
				async getAddressList(api) {
					await this.$http.get(api, {}).then(r => {
							this.addressList = r.data;
						});
				},
				buy(type, isPointExchange) {
					if(this.type === 'voucher'){
						this.$mRouter.push({ route: `/pages/product/confirmProduct` });
					}else{
						if (!this.product.ID) return;
						if (!this.hasLogin) {
							this.$mHelper.backToLogin();
							return;
						}
						this.specClass = 'show';
					}
				},
				// 商品付款
				async handleProjectPay() {
					this.btnLoading = true;
					console.log('12312312---',this.product);
					await this.$http
						.post(`${projectPay}`, {
							address_id: 1,
							project_id: this.product.ID,
							total: 1,
						})
						.then(() => {
							this.$mHelper.toast('恭喜您, 资料修改成功!');
							setTimeout(() => {
								this.$mRouter.back();
							}, 1 * 1000);
						})
						.catch(() => {
							this.btnLoading = false;
						});
				}
			}
		}
</script>
<style lang="scss">
.detail-image{
	display: block;
	width: 100%;
}
.detail-desc{
	// padding-bottom: 90upx;
}
.rf-product-detail {
	.back-btn {
		position: fixed;
		left: 40upx;
		z-index: 9999;
		padding-top: var(--status-bar-height);
		top: 40upx;
		font-size: 40upx;
		color: $font-color-dark;
	}
	.carousel {
		height: 450upx;
		position: relative;
		swiper {
			height: 100%;
		}
		.image-wrapper {
			width: 100%;
			height: 100%;
		}
		.swiper-item {
			display: flex;
			justify-content: center;
			align-content: center;
			height: 750upx;
			overflow: hidden;
			border-bottom: 1upx solid rgba(0, 0, 0, 0.01);
			image {
				width: 100%;
				height: 100%;
			}
			.content {
				position: absolute;
				right: $spacing-base;
				bottom: $spacing-base;
			}
		}
	}
	.detail {
		padding-bottom: 60upx;
	}
	.service {
		padding: $spacing-base $spacing-lg 0;
		.row {
			font-size: $font-lg;
			margin-bottom: $spacing-sm;
		}
	}
	.selected-text {
		margin-right: 4upx;
	}
	.sub-list {
		margin: 40upx 0 80upx;
		.row {
			width: 100%;
			margin-bottom: $spacing-lg;
		}
	}
	.share-bg {
		image {
			position: fixed;
			z-index: 100;
			width: 70vw;
			height: 45vw;
			right: $spacing-base;
			top: $spacing-base;
		}
	}
	.layer {
		position: fixed;
		z-index: 99;
		bottom: 0;
		width: 100%;
		border-radius: 10upx 10upx 0 0;
		background-color: #fff;
		.rf-list {
			max-height: 60vh;
			padding-bottom: 0;
			margin-bottom: $spacing-sm;
		}
	}
	.c-list {
		font-size: 24upx;
		color: #000000;
		padding: 0 30upx 20upx 30upx;
		background-color: #fff;
		.popup-list{
			width: 100%;
			border-radius: 4upx;
			overflow: hidden;
		}
		/deep/ .rf-item-popup{
			width: 100%;
			background: #F2F2F2;
			.c-row {
				display: flex;
				align-items: center;
				padding: 15upx 20upx;
				position: relative;
				.left{
					font-size: 24upx;
					color: #000000;
				}
				.mid{
					text{
						font-size: 24upx;
						color: #000000;
					}
				}
			}
		}
		
		.tit {
			width: 140upx;
		}
		.con {
			flex: 1;
			color: $font-color-dark;
			.selected-text {
				margin-right: 10upx;
			}
		}
		.bz-list {
			height: 40upx;
			font-size: $font-sm + 2upx;
			color: $font-color-dark;
			text {
				display: inline-block;
				margin-right: 30upx;
			}
		}
		.con-list {
			flex: 1;
			display: flex;
			flex-direction: column;
			color: $font-color-dark;
			line-height: 40upx;
			.buy-now {
				color: $uni-color-primary;
			}
		}
		.red {
			color: $uni-color-primary;
		}
	}
	.voucher{
		padding: 30upx;
		box-sizing: border-box;
		text{
			display: block;
			font-size: 26upx;
			font-family: Source Han Sans CN;
			font-weight: 500;
			color: #000000;
			line-height: 40upx;
			&:last-child{
				font-size: 24upx;
				font-weight: 400;
			}
		}
	}
}
.popup-cnt{
	height: auto;
	.title{
		font-size: 30upx;
		font-family: Source Han Sans CN;
		font-weight: 400;
		color: #000000;
	}
	.popup-info{
		height: 184upx;
		width: 100%;
		padding: 0 30upx;
		display: flex;
		&-img{
			height: 180upx;
			width: 180upx;
			border-radius: 8upx;
			margin-top: -26upx;
			background-color: red;
		}
		&-r{
			padding-left: 20upx;
			display: flex;
			flex-direction: column;
			justify-content: center;
			.flex{
				align-items: flex-end;
				padding: 10upx 0 12upx 0;
				.unit{
					font-size: 24upx;
					line-height: 24upx;
					font-family: Source Han Sans CN;
					font-weight: bold;
					color: #FFA800;
				}
				.price{
					font-size: 40upx;
					line-height: 40upx;
					font-family: Source Han Sans CN;
					font-weight: bold;
					color: #FFA800;
				}
			}
			.kc{
				font-size: 24upx;
				font-family: Source Han Sans CN;
				font-weight: 400;
				color: #808080;
			}
		}
		
	}
	.popup-text{
		padding: 20upx 30upx 40upx 30upx;
		.title{
			margin-bottom: 20upx;
		}
		.tag{
			display: inline-block;
			width: auto;
			padding: 0 28upx;
			height: 58upx;
			font-size: 28upx;
			line-height: 58upx;
			font-family: Source Han Sans CN;
			font-weight: 400;
			color: #FFA800;
			background: #FFF8E6;
			border: 1px solid #FFA800;
			border-radius: 4upx;
		}
	}
	.popup-btn{
		button{
			width: 100%;
			background-color: #FFA800;
			color: #010101;
			border-radius: 0;
			height: 90upx;
			line-height: 90upx;
			&:disabled{
				background-color: #f7f7f7 !important;
				color: rgba(0,0,0,.3) !important;
			}
			&::after{
				border: none;
			}
			
		}
	}
}
</style>
