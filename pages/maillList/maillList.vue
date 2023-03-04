<template>
	<view class="maill">
		<view class="rf-search-box">
			<i class='icon-search'></i>
			<text>搜索</text>
		</view>
		<view class="maill-nav">
			<view class="maill-nav-item" v-for="item in maillNavList" :key="item.color">
				<view class="nav-image" :style="{'background': item.color}" @tap="navToLogin(item.path)">
					<image :src="item.src" mode=""></image>
				</view>
				<view class="nav-text">
					{{item.name}}
				</view>
			</view>
		</view>
		<view class="maill-list" v-for="item in maillList" :key="item.key">
			<view class="maill-item" :id="item.key">
				<view class="maill-item-letter">{{item.key}}</view>
				<view class="people-list">
					<view
						class="people-item"
						v-for="childItem in item.list"
						:key="childItem.id"
						@tap="navToLogin('/pages/chat/chatUserInfo?id='+childItem.ID)">
						<image :src="$imgBase + childItem.avatar" mode=""></image>
						<view class="people-name">{{childItem.nick_name}}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="index-bar">
			<view v-for="item in letterList" :key='item'>{{item}}</view>
		</view>
		<!--消息为空-->
		<rf-empty
			:bottom="bottom"
			info="您还没有联系人"
			v-if="maillList.length === 0 && hasLogin"
		></rf-empty>
		<view v-if="!hasLogin" class="maill-empty">
			<text class="iconfont iconxiaoxi-" :class="'text-'+themeColor.name"></text>
			<view class="empty-tips">
				暂未登录
				<view class="navigator" :class="'text-'+themeColor.name" @tap="navToLogin('/pages/public/logintype')"
					>登录/注册 ></view
				>
			</view>
		</view>
	</view>
</template>
<script>
import rfLoadMore from '@/components/rf-load-more/rf-load-more';
import moment from '@/common/moment';

import { apiFriendwAll } from '@/api/maillList.js';
export default {
  components: { rfLoadMore },
	data() {
		return {
			maillNavList: [
				{name: '添加朋友',src:require('@/static/image/maillList/icon_add_friend.png'),color:'#FFA800',path:'/pages/maillList/addFriend'},
				{name: '新的朋友',src:require('@/static/image/maillList/icon_new_friend.png'),color:'#45B45A',path:'/pages/maillList/newFriend/newFriendList'},
				// {name: '群认证',src:require('@/static/image/maillList/icon_ver_friends.png'),color:'#2F7EED',path:'/pages/maillList/groupChatAuth'},
				{name: '群聊',src:require('@/static/image/maillList/icon_add_friends.png'),color:'#F13E00',path:'/pages/maillList/groupChat'}
			],
			maillList: [],
			letterList:[],
			loadingType: 'more',
			page: 1,
			hasLogin: false,
			
			// 控制滑动效果
			theIndex: null,
			oldIndex: null
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
	// 下拉刷新
	onPullDownRefresh() {
		this.getFriendwAll('refresh');
	},
	// 加载更多
	onReachBottom() {
		if (this.loadingType === 'nomore') return;
		this.page++;
		this.getFriendwAll();
	},
	methods: {
		// 数据初始化
		initData() {
			this.hasLogin = this.$mStore.getters.hasLogin;
			this.page = 1;
			this.letterList = (this.maillList.reduce((t,v) => [...t,v.key],[]))
			this.getFriendwAll()
		},
		// 获取所有数据
		async getFriendwAll(){
			try{
				let r = await this.$http.get(apiFriendwAll)
				let obj = r.data.friends || {},
					arr = []
				this.letterList = Object.keys(obj)
				console.log(Object.keys(obj));	
				this.maillList = this.letterList.reduce((t,v) => [...t, { 'key': v,'list': obj[v]} ] , [])
				
			}catch(e){
				this.btnDisabled = false
			}
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
.maill {
	.maill-nav{
		width: 92%;
		margin: 20upx auto;
		display: flex;
		justify-content: space-between;
		.maill-nav-item{
			width: 110upx;
			height: auto;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			.nav-image{
				width: 100upx;
				height: 100upx;
				border-radius: 32upx;
				display: flex;
				align-items: center;
				justify-content: center;
				image{
					height: 64upx;
					width: 64upx;
				}
			}
			.nav-text{
				padding-top: 10upx;
				font-size: 26upx;
				font-family: Source Han Sans CN;
				font-weight: 400;
				color: #000000;
			}
		}
	}
	.maill-list{
		width: 92%;
		margin: 20upx auto;
		.maill-item{
			width: 100%;
			height: auto;
			.maill-item-letter{
				font-size: 28upx;
				font-family: Source Han Sans CN;
				font-weight: 400;
				color: #808080;
				padding: 10upx 0;
			}
			.people-list{
				background-color: #fff;
				width: 100vw;
				margin-left: -4vw;
				.people-item{
					display: flex;
					align-items: center;
					padding: 16upx 40upx 16upx 30upx;
					box-sizing: border-box;
					position: relative;
					overflow: hidden;
					&::before{
						position: absolute;
						left: 30upx;
						bottom: 0;
						z-index: 1;
						content: '';
						width: 100%;
						height: 1px;
						background-color: #eee;
						-webkit-transform: scaleY(0.5);
						transform: scaleY(0.5);
					}
					image{
						width: 78upx;
						height: 78upx;
						background: #FFA800;
						border-radius: 4px;
					}
					.people-name{
						padding-left: 25upx;
						font-size: 30upx;
						font-family: Source Han Sans CN;
						font-weight: 400;
						color: #000000;
					}
				}
			}
			
		}
	}
	.index-bar{
		position: fixed;
		right: 0upx;
		top: 50%;
		transform: translateY(-50%);
		view{
			padding: 0 12upx;
			font-size: 24upx;
			font-family: Source Han Sans CN;
			font-weight: 500;
			color: #000000;
		}
	}
	.maill-empty {
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
.rf-search-box{
	width: 92%;
	height: 70upx;
	background-color: #fff;
	border-radius: 4upx;
	margin: 20upx auto;
	display: flex;
	align-items: center;
	justify-content: center;
	
	.icon-search{
		height: 30upx;
		width: 31upx;
		background: url('@/static/image/maillList/icon_search.png') no-repeat;
		background-size: 100%
	}
	text{
		font-size: 28upx;
		font-family: Source Han Sans CN;
		font-weight: 400;
		color: #B4B4B4;
		line-height: 36px;
		margin-left: 12upx;
	}
}
</style>
