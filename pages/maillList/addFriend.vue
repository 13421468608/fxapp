<template>
	<view class="friend">
		<view class="search">
			<i class='icon-search'></i>
			<input v-model="searchVal" placeholder="请输入ID或者手机号"></input>
			<button 
				class="confirm-btn"
				:disabled="btnLoading"
				:loading="btnLoading"
				v-if="searchVal.length"
				@tap='searchChange'>
				搜索
			</button>
		</view>
		<view class="friend-list">
			<view
				class="friend-item ellipsis"
				v-for="item in friendList"
				:key="item.id">
				<view class="friend-item-l">
					<view :class="['icon']" :style="{'background-color': item.bgColor}">
						<image :src="item.src" mode=""></image>
					</view>
					<i v-if="!item.undisturb && item.msgNumber" class='msg-bag'>{{item.msgNumber}}</i>
				</view>
				<view class="friend-item-m">
					<view class="name ellipsis">
						<text>{{item.name}}</text>
						<text class="time">{{item.msg}}</text>
					</view>
				</view>
				<view class="friend-item-r">
					<i class='icon-arr-r'></i>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
import rfLoadMore from '@/components/rf-load-more/rf-load-more';
import moment from '@/common/moment';

import { apiUserFind } from '@/api/maillList.js';
export default {
	components: { rfLoadMore },
	data() {
		return {
			friendList: [],
			searchVal: '',
			btnLoading: false,
		};
	},
	filters: {
		time(val) {
			return moment(val * 1000).format('YYYY-MM-DD HH:mm:ss');
		},
	},
	onShow() {
		this.initData();
	},
	computed: {
		bottom () {
			let bottom = 0;
			/*  #ifdef H5  */
			bottom = 90;
			/*  #endif */
			return bottom;
		}
	},
	methods: {
		// 数据初始化
		initData() {
			this.hasLogin = this.$mStore.getters.hasLogin;
			this.friendList = [
				{name:'我的二维码',bgColor:'#FFA800', msg:'扫一扫添加我为好友，还可以保存至相册',src:require('@/static/image/profile/icon-qrcode.png')},
				{name:'扫一扫', bgColor:'#00A0E9', msg:'扫描二维码添加朋友',src:require('@/static/image/maillList/icon_code.png')}
			]
		},
		// 搜索用户
		async searchChange() {
			this.btnLoading = true;
			await this.$http
				.get(`${apiUserFind}`, { search: String(this.searchVal)})
				.then(() => {
					this.btnLoading = false;
					// 存在用户跳转到详情页面
					this.navToLogin(`/pages/maillList/newFriend/newFriendDetails?source=search&key=${this.searchVal}`)
				}).catch(() => {
					this.btnLoading = false;
				});
		},
		// 通用跳转
		navToLogin(route) {
			this.$mRouter.push({ route });
		}
	}
};
</script>
<style lang="scss">
page {
	background-color: $page-color-base;
}
.icon-arr-r{
	display: inline-block;
	height: 22upx;
	width: 13upx;
	background: url('@/static/image/profile/icon-arr-r.png') no-repeat;
	background-size: 100%;
}
.friend {
	.search{
		height: 70upx;
		display: flex;
		align-items: center;
		padding: 0 30upx;
		box-sizing: border-box;
		margin-top: 20upx;
		background-color: #fff;
		.icon-search{
			height: 30upx;
			width: 30upx;
			background: url('@/static/image/maillList/icon_search.png') no-repeat;
			background-size: 100%;
			flex-shrink: 0;
		}
		input{
			flex: 1;
			font-size: 28upx;
			font-family: Source Han Sans CN;
			font-weight: 400;
			color: #000;
			padding: 0 8upx;
			box-sizing: border-box;
			&::placeholder{
				color: #B4B4B4;
			}
		}
		button{
			flex-shrink: 0;
			width: 120upx;
			padding: 0 10upx;
			height: 48upx;
			line-height: 48upx;
			background: #FFA800;
			font-size: 24upx;
			font-family: Source Han Sans CN;
			font-weight: 400;
			color: #000000;
			border-radius: 4upx;
			margin-top: 0;
			color:#fff;
		}
	}
	.friend-list{
		width: 100%;
		padding-top: 20upx;
		.friend-item{
			width: 100%;
			height: auto;
			box-sizing: border-box;
			display: flex;
			align-items: center;
			padding: 0 30upx;
			height: 110upx;
			position: relative;
			overflow: hidden;
			background-color: #fff;
			margin-bottom: 20upx;
			.friend-item-l{
				display: inherit;
				position: relative;
				flex-shrink: 0;
				.icon{
					width: 78upx;
					height: 78upx;
					background: #FFA800;
					border-radius: 4px;
					display: flex;
					align-items: center;
					justify-content: center;
					image{
						height: 48upx;
						width: 48upx;
					}
				}
				.msg-bag{
					font-style: inherit;
					height: 36upx;
					width: 36upx;
					line-height: 36upx;
					font-size: 24upx;
					font-family: Source Han Sans CN;
					font-weight: 500;
					color: #FFFFFF;
					background-color: #DF0022;
					text-align: center;
					border-radius: 50%;
					position: absolute;
					top: -14upx;
					right: -14upx;
					
					
				}
			}
			.friend-item-m{
				flex: 1;
				padding-left: 24upx;
				box-sizing: border-box;
				overflow: hidden;
				&::before{
					position: absolute;
					left: 150upx;
					bottom: 0;
					z-index: 1;
					content: '';
					width: 100%;
					height: 1px;
					background-color: #eee;
					-webkit-transform: scaleY(0.5);
					transform: scaleY(0.5);
				}
				.name{
					font-size: 30upx;
					font-family: Source Han Sans CN;
					font-weight: 400;
					color: #171716;
					display: flex;
					justify-content: space-between;
					flex-direction: column;
					.time{
						font-size: 24upx;
						font-family: Source Han Sans CN;
						font-weight: 400;
						color: #B4B4B4;
					}
				}
				.msg{
					display: block;
					width: 100%;
					margin-top: 4upx;
					display: flex;
					align-items: center;
					justify-content: space-between;
					overflow: hidden;
					.text{
						font-size: 24upx;
						font-family: Source Han Sans CN;
						font-weight: 400;
						color: #B4B4B4;
					}
					.icon-undisturb{
						flex-shrink: 0;
						margin-left: 40upx;
						height: 24upx;
						width: 24upx;
						// background: url('~/static/top.png') no-repeat;
						background-size: 100%;
					}
					
				}
			}
			.friend-item-r{
				flex-shrink: 0;
			}
			
		}
	}
	
	
	
	.friend-empty {
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100vh;
		padding-bottom: 100upx;
		display: flex;
		justify-content: center;
		flex-direction: column;
		align-items: center;
		background: #fff;
		.iconfont {
			font-size: $font-lg + 100upx;
		}

		.empty-tips {
			display: flex;
			font-size: $font-sm + 2upx;
			color: $font-color-disabled;

			.navigator {
				margin-left: 16upx;
			}
		}
	}
}


.btn{
	width: 118upx;
	height: 48upx;
	line-height: 48upx !important;
	background: #FFA800;
	font-size: 24upx;
	font-family: Source Han Sans CN;
	font-weight: 400;
	color: #000000;
	border-radius: 4upx;	
	text-align: center;
	line-height: 8upx;
	color: #010101;
	&::after{
		border: none;
	}
	&:disabled{
		background-color: #E0E0E0;
		color: #808080;
	}
}
</style>
