<template>
	<view class="main profile">
		<!-- 个人信息 -->
		<view class="user">
			<view class="user-info" @tap="navTo('/pages/user/userinfo/userinfo')">
				<view>
					<image :src="userInfo.avatar || headImg" mode=""></image>
				</view>
				<view>
					<view class="nice-name">
						{{ userInfo.nick_name || userInfo.real_name ||'登录/注册'}}
					</view>
					<view v-if="userInfo.uid"> ID:{{userInfo.uid ||''}}</view>
				</view>
			</view>
			<view class="user-code">
				<image @tap.stop="navTo('/pages/user/qrcode/qrcode')" :src="require('@/static/image/profile/icon-qrcode.png')" mode=""></image>
			</view>
		</view>	
		<!-- 我的订单 -->
		<view class="order">
			<list-cell
				@eventClick="navTo('/pages/order/order')"
				title="我的订单"
				tips='全部'
			></list-cell>
			<view class="order-section">
				<view
					class="order-item"
					v-for="item in orderList"
					:key="item.status"
					@tap="navTo('/pages/order/order?state='+(item.status))"
					hover-class="common-hover"
					:hover-stay-time="50"
				>
					<i class="order-icons" :class="[item.class]" />
					<text>{{ item.name }}</text>
					<rf-badge
						v-if="item.total > 0"
						type="error"
						size="small"
						class="badge"
						:text="item.total"
					></rf-badge>
				</view>
			</view>
		</view>	
		<!-- 我的账户及设置 -->
		<view class="other">
			<view class="account">
				<block v-if="!hasLogin">
					
				</block>
				<view>
					<view class="account-txt" v-if="!hasLogin" style="line-height: 80upx;">登录后查看</view>
					<view class="account-txt" v-if="hasLogin">
						我的账户
					</view>
					<view class="account-price" v-if="hasLogin">
						账户余额：{{userInfo.balance}}
					</view>
				</view>
				<view>
					<view class="account-btn" @click="navTo('/pages/user/account/account_new')">
						查看详情
					</view>
				</view>
			</view>
			<!-- 设置 -->
			<view class="setting">
				<list-cell
					v-for="item in settingList"
					:key="item.name"
					:icon='item.icon'
					@eventClick="navTo(item.url)"
					:title="item.name"
					:tips='item.tips'
				>
				<template v-slot:icon='item'>
					<i :class="['setting-icon',item.icon]"></i>
				</template>
				</list-cell>
			</view>
		</view>	
		<!--页面加载动画-->
		<rfLoading isFullScreen :active="loading"></rfLoading>
	</view>
</template>

<script>
	import listCell from '@/components/rf-list-cell';
	import rfBadge from '@/components/rf-badge/rf-badge';
	
	import { footPrintList, memberInfo, notifyUnRreadCount,
		userInfoApi
	 } from '@/api/userInfo';
	export default {
		components: {
			listCell,
			rfBadge
		},
		async onShow() {
			// 初始化数据
			await this.initData();
		},
		// #ifndef MP
		onNavigationBarButtonTap(e) {
			this.navTo('/pages/set/set');
		},
		// #endif
		data() {
			return {
				loading: true,
				headImg: this.$mAssetsPath.headImg,
				userInfo: {},     // 个人信息
					
				hasLogin: false,  // 是否登录
				orderList: [	  // 订单相关
					{class: 'dfk', name: '待付款',total:0,state: 1},
					{class: 'dfh', name: '待发货',total:0,state: 2},
					{class: 'dsh', name: '待收货',total:0,state: 3},
					{class: 'qx', name: '取消',total:0,state: 5},
					{class: 'qr', name: '完成',total:0,state: 4},
				],
				settingList:[	  // 操作相关
					{icon: 'fkwt', name: '问题反馈', url:'/pages/set/feedback/list'},
					{icon: 'smrz', name: '实名认证', url:'/pages/user/authentication/authentication',tips:'未认证'},
					{icon: 'dzgl', name: '地址管理', url:'/pages/user/address/address'},
					{icon: 'yssz', name: '隐私设置', url:'/pages/user/privacy/privacy'},
					{icon: 'jcgx', name: '检测更新'},
				]
			}
		},
		methods:{
			// 数据初始化
			async initData() {
				this.hasLogin = this.$mStore.getters.hasLogin;
				console.log('this.hasLogin',this.hasLogin)
				if(this.hasLogin){
					await this.getMemberInfo();
				}else {
					this.loading = false;
					// this.resetSectionData();
				}
			},
			// 获取用户信息
			async getMemberInfo() {
				await this.$http
					.get(userInfoApi)
					.then(async r => {
						this.loading = false;
						this.userInfo = r.data;
						// 设置订单信息
						let arr = []
						r.data.order_info.forEach(res => {
							switch (res.status){
								case 1:
									arr.push({class: 'dfk', name: '待付款',status: res.status,total:res.total})
									break;
								case 2:
									arr.push({class: 'dfh', name: '待发货',status: res.status,total:res.total})
									break;
								case 3:
									arr.push({class: 'dsh', name: '待收货',status: res.status,total:res.total})
									break;
								case 4:
									arr.push({class: 'qr', name: '售后',status: res.status,total:res.total})
									break;
								case 5:
									arr.push({class: 'qx', name: '取消',status: res.status,total:res.total})
									break;
								default:
									break;
							}
						})
						this.orderList = arr
						
						// 设置 设置
						this.settingList = [	  // 操作相关
							{icon: 'fkwt', name: '问题反馈', url:'/pages/set/feedback/list'},
							{icon: 'smrz', name: '实名认证', url:'/pages/user/authentication/authentication',tips: r.data.real_name ?  '':'未认证'},
							{icon: 'dzgl', name: '地址管理', url:'/pages/user/address/address'},
							{icon: 'yssz', name: '隐私设置', url:'/pages/user/privacy/privacy'},
							{icon: 'jcgx', name: '检测更新'},
						]
						
						this.$mStore.commit('setUserInfo', r.data);
						// await this.initNotifyNum();
						// // 获取足迹列表
						// await this.getFootPrintList();
						// await this.setSectionData(r.data);
					})
					.catch(() => {
						this.hasLogin = false;
						this.userInfo = {};
						// this.resetSectionData();
						this.loading = false;
					});
			},
			navTo(route) {
				if(!this.hasLogin){
					this.$mRouter.push({route: `/pages/public/login?type=login`});
					return
				}
				// if (route === '/pages/index/notice/notice') {
				// 	this.$mRouter.push({ route });
				// } else if (!this.hasLogin) {
				// 	uni.removeStorageSync('backToPage');
				// 	this.$mRouter.push({ route: '/pages/public/logintype' });
				// } else {
				// 	this.$mRouter.push({ route });
				// }
				
				if (!route) {
					this.detectVersion()
				}else{
					this.$mRouter.push({ route });
				}
			},
			detectVersion(){
				this.$mHelper.toast('请选择规格');
			}
		}
		
	}
</script>

<style lang="scss" scoped>
.profile{
	background-color: #f2f2f2;
	height: auto;
	padding-bottom: calc(var(--window-bottom));
	box-sizing: border-box;
	// padding-bottom: ;
	.user{
		height: 366upx;
		width: 100%;
		// background: linear-gradient(240deg, #FFD76A, #FFA800);
		background: url('@/static/image/profile/account-bg1.png') no-repeat;
		background-size: 100% auto;
		display: flex;
		padding: 138upx 26upx 0 30upx;
		&-info{
			height: 140upx;
			flex: 1;
			display: flex;
			image{
				width: 120upx;
				height: 120upx;
				background: #FFFFFF;
				border-radius: 50%;
				margin-right: 24upx;
			}
			view{
				font-size: 24upx;
				font-family: Source Han Sans CN;
				font-weight: 400;
				color: #FFFFFF;
				&.nice-name{
					font-size: 36upx;
					font-weight: 500;
					color: #FFFFFF;
					line-height: 70upx;
				}
			}
		}
		&-code{
			height: 49upx;
			padding-top: 49upx;
			flex-shrink: 0;
			image{
				height: 49upx;
				width: 49upx;
			}
		}
	}
	.order{
		width: 92%;
		margin: 0 auto;
		background: #FFFFFF;
		border-radius: 16upx;
		margin-top: -50upx;
		/deep/ .mix-list-cell{
			padding: 20upx 20upx;
			line-height: 40upx;
			&:after{
				left: 18upx;
				width: calc(100% - 36upx)
			}
		}
		.order-section {
			@extend %section;
			width: 100%;
			padding: 40upx 0;
			.order-item {
				@extend %flex-center;
				width: auto;
				height: auto;
				border-radius: 10upx;
				font-size: $font-sm;
				color: $font-color-dark;
				position: relative;
				.order-icons{
					height: 64upx;
					width: 64upx;
					background-repeat: no-repeat;
					background: 100%;
					background-size: 100%;
					&.dsh{
						background-image: url('@/static/image/profile/icon-order-dsh.png');
					}
					&.dfh{
						background-image: url('@/static/image/profile/icon-order-dfh.png');
					}
					&.dfk{
						background-image: url('@/static/image/profile/icon-order-dfk.png');
					}
					&.qx{
						background-image: url('@/static/image/profile/icon-order-qx.png');
					}
					&.qr{
						background-image: url('@/static/image/profile/icon-order-qr.png');
					}
					// &.sh{
					// 	background-image: url('@/static/image/profile/icon-order-sh.png');
					// }
				}
			}
			.badge {
				position: absolute;
				top: -10upx;
				right: -10upx;
			}
		
			.iconfont {
				font-size: 48upx;
			}
		
			.icon-shouhoutuikuan {
				font-size: 44upx;
			}
		}
	}
	.other{
		width: 92%;
		margin: 30upx auto;
		.account{
			width: 100%;
			height: 170upx;
			background: url('@/static/image/profile/account-bg.png') no-repeat;
			background-size: 100%;
			border-radius: 16px;
			display: flex;
			justify-content: space-between;
			padding: 30upx 40upx;
			box-sizing: border-box;
			.no-login{
				text-align: center;
			}
			&-txt{
				font-size: 30upx;
				font-family: Source Han Sans CN;
				font-weight: 500;
				color: #754E19;
			}
			&-price{
				margin-top:6upx;
				font-size: 22upx;
				font-family: Source Han Sans CN;
				font-weight: 500;
				color: #CE994F;
			}
			&-btn{
				width: 160upx;
				height: 60upx;
				background: linear-gradient(-30deg, #F7DEB9, #F8BE6E);
				border-radius: 30upx;
				line-height: 60upx;
				text-align: center;font-size: 24upx;
				font-family: Source Han Sans CN;
				font-weight: 400;
				color: #754E19;
				margin-top: 8upx;
			}
		}
	}
	.setting{
		margin-top: -46upx;
		background: #fff;
		border-radius: 16upx;
		.setting-icon{
			display: inline-block;
			height: 44upx;
			width: 44upx;
			margin-right: 14upx;
			background-repeat: no-repeat;
			background-size: 100%;
			&.fkwt{
				background-image: url('@/static/image/profile/icon-kf.png');
			}
			&.smrz{
				background-image: url('@/static/image/profile/icon-nameauth.png');
			}
			&.dzgl{
				background-image: url('@/static/image/profile/icon-address.png');
			}
			&.yssz{
				background-image: url('@/static/image/profile/icon-privacy.png');
			}
			&.jcgx{
				background-image: url('@/static/image/profile/icon-gx.png');
			}
		}
	}
}
%flex-center {
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	align-items: center;
}
%section {
	justify-content: space-around;
	display: flex;
	align-content: center;
	background: #fff;
	border-radius: 10upx;
}
</style>