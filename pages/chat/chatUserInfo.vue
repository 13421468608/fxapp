<template>
	<view class="chat-info">
		<!-- 群内人员 -->
		<view class="info-card mb20">
			<image class="shirk" :src="$imgBase + friendInfo.avatar" mode=""></image>
			<view class="info-card-txt">
				<view class="black">
					{{friendInfo.nick_name || 'xxxx'}}
					<i :class="['icon', 'icon-sex'+friendInfo.sex]"></i>
				</view>
				<!-- <view class="grey">昵称：{{friendInfo.nice_name || 'xxxx'}}</view> -->
				<view class="grey"  v-if='friendInfo.is_friend'>ID：{{friendInfo.ID || 'xxxx'}}</view>
			</view>
			<!-- <view>查看更多</view> -->
		</view>
		
		<view class="rf-row-wrapper">
			<view class="cells">
				<view :class="['row','b-b','flex','between']">
					<text class="tit">个性签名</text>
					<text :class="[friendInfo.signature == '这个人很懒，什么都没有留下' ? 'grey' : '']">{{friendInfo.signature}}</text>
				</view>
			</view>
			<view class="cells">
				<view :class="['row','b-b','flex','between']">
					<text class="tit">来源</text>
					<text class="grey">来自{{form === 'chatInfo' ? '群聊' : sourceArr[friendInfo.source]+"搜索" || '其它搜索'}}</text>
				</view>
			</view>
			
			<block v-if='friendInfo.is_friend'>
				<view class="cells mt20">
					<view class="row b-b flex center" @tap="goChat">
						<i class="icon icon-chat"></i>
						<text class="yellow">发消息</text>
					</view>
				</view>
				<view class="cells">
					<view class="row flex center"  @tap="delBtn">
						<text class="red">删除</text>
					</view>
				</view>
			</block>	
			<block v-else>
				<view class="cells mt20">
					<view class="row flex center"  @tap="navTo('/pages/maillList/newFriend/newFriendDetails?form=chat&type=add&key='+friendId+'&chatId='+chatId)">
						<text class="yellow">添加到通讯录</text>
					</view>
				</view>
			</block>
		</view>
		
		
		<!-- 选择颜色模态框 -->
		<view class="cu-modal" :class="{ show: modalStatus }">
			<view class="cu-dialog">
				<view class="cu-bar justify-end solid-bottom">
					<view class="content">{{modalTitle}}</view>
					<view class="action" @tap="modalStatus = false">
						<text class="cuIcon-close text"></text>
					</view>
				</view>
				<view class="cnt-modal grid col-5 padding">
					<text>将联系人“{{friendInfo.nick_name}}”删除，将同时删除与该联系人的聊天记录</text>
				</view>
				<view class="btns-modal border-x-t">
					<button @tap="modalStatus = false">取消</button>
					<button
						:loading='modalConfirmDis'
						:disabled="modalConfirmDis"
						class="red"
						@tap="modalBtn"
					>确认</button>
				</view>
			</view>
		</view>
		<!--页面加载动画-->
		<rfLoading isFullScreen :active="loading"></rfLoading>
	</view>
</template>

<script>
	import { apiUserFriend,apiFriendDel } from '@/api/maillList.js';
	export default {
		onLoad(option){
			this.userInfo = uni.getStorageSync('userInfo')
			this.friendId = option.id
			this.form = option.form
			this.chatId = option.chatId
			console.log(this.userInfo);
		},
		onShow() {
			this.getFriend()
		},
		data() {
			return {
				loading: false,
				userInfo: '',
				sourceArr: ['','手机号','ID'],
				friendId: null,			// 好友id
				form: null,  			//来源
				chatId: null,  			//来源群聊 群聊id
				friendInfo: {},			// 好友信息
				groupFriends: [
					{name:'阿苏妲己卡拉斯京看到', src:'',id:'1'},
					{name:'重新阿苏', src:'',id:'2'},
					{name:'擦拭', src:'',id:'3'},
				],
				
				modalStatus: false,
				modalTitle: null,
				modalType: null,
				modalConfirmDis: false,
				
			}
		},
		methods: {
			navTo(route) {
				this.$mRouter.push({ route });
			},
			modalBtn(){
				this.delFriend()
			},
			delBtn(){
				this.modalStatus = true
				this.modalTitle = '删除联系人'
				this.modalType = 'del'
			},
			// 获取好友信息
			async getFriend(){
				try{
					let r = await this.$http.get(apiUserFriend + this.friendId)
					this.friendInfo = r.data
					if(this.userInfo.phone)
					this.loading = false
				}catch(e){
					this.$mHelper.toast(e);
					this.loading = false
				}
			},
			// 删除好友
			async delFriend(){
				this.modalConfirmDis = true
					console.log(apiFriendDel + this.friendId);
				try{
					let r = await this.$http.get(apiFriendDel + this.friendId)
					this.friendInfo = r.data
					this.modalConfirmDis = false
					this.$mRouter.back()
				}catch(e){
					this.$mHelper.toast(e);
					this.modalConfirmDis = false
				}
			},
			// 发消息
			goChat(){
				this.$mRouter.reLaunch({route:'/pages/chat/chat?chatType=one&id='+this.friendId})
			}
		}
	}
</script>

<style lang="scss" scoped>
page{
	background-color: #f2f2f2;
}
.mb20{
	margin-bottom: 20upx;
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
	&.icon-sex1{
		margin-left: 10upx;
		width: 19upx;
		height: 23upx;
		background-image: url('@/static/image/chat/icon-sex1.png');
	}
	&.icon-sex2{
		margin-left: 10upx;
		width: 19upx;
		height: 23upx;
		background-image: url('@/static/image/chat/icon-sex2.png');
	}
}
.cu-modal {
	.cnt-modal{
		padding: 40upx;
		input{
			height: 88upx;
			background-color: #E8E8E8;
			border-radius: 8upx;
			width: 100%;
		}
	}
	.btns-modal{
		display: flex;
		button{
			height: 100upx;
			line-height: 100upx;
			border: none;
			width: 100%;
			border-radius: 0;
			&::after{
				border: none !important;
			}
			&:nth-child(2){
				position: relative;
				&::after{
					position: absolute;
					left: 0;
					top: 0;
					z-index: 1;
					content: '';
					width: 1px;
					height: 100%;
					background-color: #E8E8E8;
					-webkit-transform: scaleX(0.5);
					transform: scaleX(0.5);
				}
			}
		}
	}
}

.grey{
	color: #7F7F7F;
}
.red{
	color: #DF0022;
}
.yellow{
	color: #FFA800
}
.mt20{
	margin-top: 20upx;
}
.chat-info{
	height: auto;
	
}
.info-card{
	height: 240upx;
	width: 100%;
	padding: 0 30upx;
	display: flex;
	align-items: center;
	background-color: #fff;
	image{
		height: 124upx;
		width: 124upx;
		border-radius: 8upx;
		margin-right: 30upx;
	}
	.info-card-txt{
		.black{
			font-size: 36upx;
			font-family: Source Han Sans CN;
			font-weight: 500;
			color: #000000;
			margin-bottom: 6upx;
		}
		.grey{
			font-size: 28upx;
			line-height: 38upx;
			font-family: Source Han Sans CN;
			font-weight: 400;
			color: #808080;
		}
	}
}
.group-friends{
	padding: 30upx 0;
	background: #fff;
	margin-bottom: 20upx;
	margin-top: 1PX;
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