<template>
	<view class="group-management-main">
		<view class="group-main mb20">
			<view class="avatar flex center column">
				<image src="@/static/image/chat/icon-group-management.png" mode=""></image>
				群管理员
			</view>
			<view class="desc">
				群管理员拥有以下权限：</br> 1、修改群名称 </br>2、发表群公告 </br>3、设置进群方式，并可以确认进群申请 </br>4、移除群成员
			</view>
		</view>
		<!-- 群内人员 -->
		<view class="group-friends mb20">
			<view class="group-list">
				<view
					v-for="item in membersInfo"
					:key="item.ID"
					class="group-item"
					@tap="navTo('/pages/chat/chatUserInfo?id='+item.user_id+'&form=chatInfo')">
					<image :src="$imgBase + item.avatar" mode=""></image>
					<view class="ellipsis">{{item.nick_name}}</view>
				</view>
				
				<view class="group-item">
					<i class='icon icon-chat-add' @tap="navTo('/pages/chat/groupManagement/list?type=add&chatId='+chatId)"></i>
					<view></view>
				</view>
				<view class="group-item">
					<i class='icon icon-chat-reduce' @tap="navTo('/pages/chat/groupManagement/list?type=del&chatId='+chatId)"></i>
					<view></view>
				</view>
			</view>
			<!-- <view>查看更多</view> -->
		</view>
		
		<!--页面加载动画-->
		<rfLoading isFullScreen :active="loading"></rfLoading>
	</view>
</template>

<script>
	import { apiGroupChatAllMembers } from '@/api/maillList.js';
	export default {
		data() {
			return {
				loading: true,
				chatId: null,
				membersInfo: [],
				
			}
		},
		onLoad(option){
			this.chatId = option.chatId
			this.type = option.type
		},
		onShow() {
			this.init()
		},
		methods: {
			async init(){
				try{
					let r = await this.$http.get(apiGroupChatAllMembers,{
						id: this.chatId,
						ban_receiving_vouchers: false,
						administrator: true
					})
					this.membersInfo = r.data
					this.loading = false
				}catch(e){
					this.$mHelper.toast(e);
					this.loading = false
				}
			},
			navTo(route) {
				this.$mRouter.push({ route });
			},
		}
	}
</script>

<style lang="scss" scoped>
page{
	background-color: #f2f2f2;
}
i.icon{
	display: inline-block;
	background-size: 100%;
	background-repeat: no-repeat;
	&.icon-chat-add{
		width: 98upx;
		height: 98upx;
		background-image: url('@/static/image/chat/icon-chat-add.png');
	}
	&.icon-chat-reduce{
		width: 98upx;
		height: 98upx;
		background-image: url('@/static/image/chat/icon-chat-reduce.png');
	}
}
.mb20{
	margin-bottom: 20upx;
}
.grey{
	font-size: 30upx;
	font-family: Source Han Sans CN;
	font-weight: 400;
	color: #7F7F7F;	
}
.group-management-main{
	height: auto;
	.group-main{
		height: auto;
		background: #fff;
		.avatar{
			padding: 60upx 0 30upx 0;
			font-size: 30upx;
			font-family: Source Han Sans CN;
			font-weight: 500;
			color: #0C0B0A;
			line-height: 70upx;
			image{
				height: 120upx;
				width: 120upx;
			}
		}
		.desc{
			padding-left: 30upx;
			font-size: 28upx;
			font-family: Source Han Sans CN;
			font-weight: 400;
			color: #7F7F7F;
			line-height: 40upx;
			padding-bottom: 34upx;
		}
	}
}
.group-friends{
	padding: 30upx 0;
	background: #fff;
	margin-bottom: 20upx;
	margin-top: 1PX;
	overflow-x: hidden;
	.group-list{
		width: calc(100% + 20upx);
		margin-left: 30upx;
		display: flex;
		flex-wrap: wrap;
	}
	
	.group-item{
		width: 98upx;
		height: auto;
		margin-right: 50upx;
		margin-bottom: 20upx;
		image{
			width: 98upx;
			height: 98upx;
		}
		view{
			height: 30upx;
			font-size: 24upx;
			font-family: Source Han Sans CN;
			font-weight: 400;
			color: #808080;
			text-align: center;
		}
	}
}
</style>