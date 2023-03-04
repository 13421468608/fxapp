<template>
	<view class="friend">
		<view class="friend-list">
			<view
				class="friend-item ellipsis"
				v-for="item in friendList"
				:key="item.id">
				<view class="friend-item-l">
					<image src="~/static/tab-my.png" mode=""></image>
					<i v-if="!item.undisturb && item.msgNumber" class='msg-bag'>{{item.msgNumber}}</i>
				</view>
				<view class="friend-item-m">
					<view class="name ellipsis">
						<text>{{item.name}}</text>
						<text class="time">22:35</text>
					</view>
				</view>
				<view class="friend-item-r">
					<button class="btn" :disabled="item.isAdd" @tap="navToLogin('/pages/maillList/newFriend/newFriendDetails')">{{item.isAdd ? '已添加':'通过'}}</button>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
import rfLoadMore from '@/components/rf-load-more/rf-load-more';
import moment from '@/common/moment';
import mConstDataConfig from '@/config/constData.config';
import { mapMutations } from 'vuex';
export default {
	components: { rfLoadMore },
	data() {
		return {
			friendList: [],
		};
	},
	filters: {
		time(val) {
			return moment(val * 1000).format('YYYY-MM-DD HH:mm:ss');
		},
		friendTypeFilter(val) {
			return mConstDataConfig.friendTypeList[val].content;
		}
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
		...mapMutations(['setfriendNum']),
		// 数据初始化
		initData() {
			this.hasLogin = this.$mStore.getters.hasLogin;
			this.friendList = [
				{name:'满血方法', isAdd: true, msg:'是我的存在吗擦拭每次看马上马上；达拉斯看到；拉萨；了没撒的；阿里斯顿；离开了；看',msgNumber: 0,src:''},
				{name:'满血方法',msg:'saxasxc1',msgNumber: 1,src:''}
			]
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
.friend {
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
			.friend-item-l{
				display: inherit;
				position: relative;
				flex-shrink: 0;
				image{
					width: 78upx;
					height: 78upx;
					background: #FFA800;
					border-radius: 4px;
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
