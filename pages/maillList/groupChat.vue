<template>
	<view class="friend">
		<view class="search">
			<i class='icon-search'></i>
			<input v-model="searchTxt" placeholder="请输入ID或者手机号"></input>
		</view>
		<view class="friend-list">
			<block v-if="groupChatList.length">
				<view
					class="friend-item ellipsis"
					v-for="item in curList"
					:key="item.ID"
					@tap="navToLogin('/pages/chat/chat?chatType=many&chatId='+item.ID)">
					<view class="friend-item-l">
						<image :src="$imgBase + item.avatar" mode=""></image>
					</view>
					<view class="friend-item-m">
						<view class="name ellipsis">
							<text>{{item.name}}</text>
						</view>
					</view>
				</view>
			</block>
		</view>
		
		<rfLoading isFullScreen :active="loading"></rfLoading>
		<rf-empty
			:isRecommendShow='false'
			:info="'您还没有群聊'"
			v-if="groupChatList.length === 0 && !loading"
		></rf-empty>
	</view>
</template>
<script>
import rfLoadMore from '@/components/rf-load-more/rf-load-more';
import moment from '@/common/moment';

import { apiGroupChatMy } from '@/api/maillList.js';
export default {
	components: { rfLoadMore },
	data() {
		return {
			searchTxt: null,
			searchTimer: null,
			
			loading: true,
			groupChatList: -1,
			curList: [], // 展示的数据
			searchList: []
		};
	},
	filters: {
		time(val) {
			return moment(val * 1000).format('YYYY-MM-DD HH:mm:ss');
		},
	},
	// 下拉刷新
	onPullDownRefresh() {
		this.getGroupChat();
	},
	onShow() {
		this.initData();
	},
	watch: {
		searchTxt(val){
			if(this.searchTimer) clearTimeout(this.searchTimer)
			this.searchTimer = setTimeout(()=>{
				this.curList = this.groupChatList.filter(res => res.name.includes(val))
			},300)
		}
	},
	methods: {
		// 数据初始化
		initData() {
			this.hasLogin = this.$mStore.getters.hasLogin;
			this.getGroupChat()
		},
		// 获取所有数据
		async getGroupChat(type){
			try{
				let r = await this.$http.get(apiGroupChatMy)
				console.log(r);
				this.groupChatList = r.data
				this.curList = r.data
				this.loading = false
			}catch(e){
				this.loading = false
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
			.friend-item-l{
				display: inherit;
				position: relative;
				flex-shrink: 0;
				background: url('@/static/missing-face.png') no-repeat;
				background-size: 100%;
				
				image{
					width: 78upx;
					height: 78upx;
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
