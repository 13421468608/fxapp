<template>
	<view class="chat-info">
		<!-- 群内人员 -->
		<view class="group-friends mb20">
			<view class="group-list">
				<view
					v-for="item in groupFriends"
					:key="item.ID"
					class="group-item"
					@tap="navTo('/pages/chat/chatUserInfo?id='+item.user_id+'&form=chatInfo&chatId='+chatId)">
					<image :src="$imgBase + item.avatar" mode=""></image>
					<view class="ellipsis">{{item.nick_name}}</view>
				</view>
				
				<view class="group-item" @tap="navTo('/pages/chat/groupManagement/people?type=add&chatId='+chatId)">
					<i class='icon icon-chat-add'></i>
					<view></view>
				</view>
				<view class="group-item"  @tap="navTo('/pages/chat/groupManagement/people?type=del&chatId='+chatId)">
					<i class='icon icon-chat-reduce'></i>
					<view></view>
				</view>
			</view>
			<!-- <view>查看更多</view> -->
		</view>
		
		<view class="rf-row-wrapper">
			<view class="cells">
				<view class="row b-b arr" @tap="cellChange('avatar')">
					<text class="tit">群头像</text>
				</view>
			</view>
			<view class="cells">
				<view class="row b-b arr flex between" @tap="cellChange('name')">
					<text class="tit">群聊名称</text>
					<text :class="[chatInfo.name ? '' : 'grey']">{{chatInfo.name ? chatInfo.name : '未设置'}}</text>
				</view>
			</view>
			<view class="cells">
				<view class="row b-b arr flex between" @tap="cellChange('announcement')">
					<text class="tit">群公告</text>
					<text :class="[chatInfo.announcement ? '' : 'grey','ellipsis']">{{chatInfo.announcement ? chatInfo.announcement : '未设置'}}</text>
				</view>
			</view>
			<view class="cells mb20" v-if="chatInfo.member_info && chatInfo.member_info.identity === 1">
				<view class="row b-b arr" @tap="cellChange('management')">
					<text class="tit">群管理</text>
				</view>
			</view>
			<view class="cells">
				<view class="row default-row">
					<text class="tit">消息免打扰</text>
					<switch
						:checked="chatInfo.disturb"
						color="#f3ac3c"
						@change="swichChange($event,'disturb')"
					/>
				</view>
			</view>
			<view class="cells mb20">
				<view class="row default-row">
					<text class="tit">置顶聊天</text>
					<switch
						:checked="chatInfo.top"
						color="#f3ac3c"
						@change="swichChange($event,'top')"
					/>
				</view>
			</view>
			<view class="cells">
				<view class="row b-b default-row" @tap="chatBtn('empty')">
					<text class="tit">清空聊天记录</text>
				</view>
			</view>
			<view class="cells mb20">
				<view class="row default-row" @tap="chatBtn('exit')">
					<text class="tit">退出群聊</text>
				</view>
			</view>
		</view>
		
		<!-- modal -->
		<view class="cu-modal" :class="{ show: modal.status }">
			<view class="cu-dialog">
				<view class="cu-bar justify-end solid-bottom">
					<view class="content">设置{{modal.title}}</view>
					<view class="action" @tap="modal.status = false">
						<text class="cuIcon-close text"></text>
					</view>
				</view>
				<view class="cnt-modal grid col-5 padding">
					<input
						v-if="modal.type==='name'"
						type="text"
						maxlength="20"
						:placeholder="'请输入'+modal.title"
						v-model="modal.inp"
					/>
					<textarea
						v-if="modal.type==='announcement'"
						:placeholder="'请输入'+modal.title"
						maxlength="200"
						v-model='modal.txtArea'>
					</textarea>
				</view>
				<view class="btns-modal border-x-t">
					<button @tap="modal.status = false">取消</button>
					<button lo :disabled="modal.disabled" @tap="modalConfirm">确认</button>
				</view>
			</view>
		</view>
		
		<!--页面加载动画-->
		<rfLoading isFullScreen :active="loading"></rfLoading>
	</view>
</template>

<script>
	import { apiGroupChatDetail,apiGroupChatPersonalSite,apiGroupChatInfoSite,apiGroupChatExit,apiGroupChatDissolve } from '@/api/maillList.js';
	export default {
		data() {
			return {
				loading: true,
				siteTimer: null,
				chatId: null,
				chatInfo: {},
				groupFriends: [],
				modal:{
					status: false,
					title: null,
					inp: null,
					txtArea: null,
					disabled: false
				},
				personalSiteTimer: null,
			}
		},
		onLoad(option){
			this.chatId = option.chatId
		},
		onShow() {
			this.init()
		},
		methods: {
			async init(){
				try{
					let r = await this.$http.get(apiGroupChatDetail + this.chatId)
					this.chatInfo = r.data
					console.log(this.chatInfo);
					this.groupFriends = this.chatInfo.members
					uni.setNavigationBarTitle({ title: `${this.chatInfo.name}(${this.chatInfo.total})` });
					this.loading = false
				}catch(e){
					this.$mHelper.toast(e);
					this.loading = false
				}
			},
			navTo(route) {
				this.$mRouter.push({ route });
			},
			cellChange(type){
				// avatar,name,announcement,management
				console.log(this.chatInfo);
				switch (type){
					case 'avatar':
						// 头像
						break;
					case 'name':
						// 群聊名称
						this.modal.status = true
						this.modal.type = 'name'
						this.modal.title = '群聊名称'
						this.modal.inp = this.chatInfo.name
						break;
					case 'announcement':
						// 群公告
						this.modal.status = true
						this.modal.type = 'announcement'
						this.modal.title = '群公告'
						this.modal.txtArea = this.chatInfo.announcement
						break;
					case 'management':
						// 群管理
						this.navTo(`/pages/chat/groupManagement/main?chatId=${this.chatId}&identity=${this.chatInfo.member_info.identity}`)
						break;
					default:
						break;
				}
			},
			// switchTopChange(e){
			// 	this.chatInfo.top = e.detail.value;
			// 	this.siteTimer = setTimeout(()=>{
			// 		this.groupChatInfoSite()
			// 	},300)
			// },
			// switchdDsturbChange(e){
			// 	console.log(e.detail.value);
			// 	this.chatInfo.disturb = e.detail.value;
			// 	this.siteTimer = setTimeout(()=>{
			// 		this.groupChatInfoSite()
			// 	},300)
			// },
			// modal确认
			modalConfirm(type){
				let { inp,txtArea } = this.modal
				if(this.modal.type == 'name'){
					this.chatInfo.name = inp
				}else if( this.modal.type == 'announcement'){
					this.chatInfo.announcement = txtArea
				}
				this.groupChatInfoSite()
			},
			// 设置群信息
			async groupChatInfoSite(){
				try{
					let {name,avatar,announcement} = this.chatInfo
					let r = await this.$http.post(apiGroupChatInfoSite + this.chatId,{name,avatar,announcement})
					// this.chatInfo = r.data
					this.groupFriends = this.chatInfo.members
					uni.setNavigationBarTitle({ title: `${name}(${this.chatInfo.total})` });
					this.modal.status = false
				}catch(e){
					this.modal.status = false
				}
			},
			chatBtn(type){
				let cnts = {
					empty:'确定清除历史聊天记录？',
					exit:'确定退出该群聊吗？',
					dissolve:'确定解散该群聊吗？',
				}
				uni.showModal({
					content: cnts[type],
					success: res => {
						if (res.confirm) {
							switch (type){
								case 'empty':
									this.emptyBtn()
									break;
								case 'exit':
									this.exitBtn()
									break;
								case 'dissolve':
									this.dissolveBtn()
									break;
								default:
									break;
							}
						}
					}
				});
				
			},
			
			// 设置群置顶
			swichChange(e,type){
				console.log(e.detail);
				if(this.personalSiteTimer) clearTimeout(this.personalSiteTimer)
				this.personalSiteTimer = setTimeout(res => {
					this.chatInfo[type] = e.detail.value
					this.groupChatPersonalSite(type)
				},500)
			},
			// 设置群置顶 / 设置消息免打扰
			async groupChatPersonalSite(type){
				try{
					let r = await this.$http.post(apiGroupChatPersonalSite+this.chatId,{
						disturb: this.chatInfo.disturb,
						top: this.chatInfo.top
					})
					if(type === 'disturb'){
						if(this.chatInfo)
						this.$mHelper.toast(`群消息已${this.chatInfo.disturb ? '设置' : '取消'}免打扰`);
					}else{
						this.$mHelper.toast(`群消息已${this.chatInfo.top ? '' : '取消'}置顶`);
					}
				}catch(e){
					this.$mHelper.toast(e);
				}
			},
			
			// 清空聊天记录
			async emptyBtn(){ 
				try{
					let r = await this.$http.get(apiGroupChatDissolve)
					this.$mHelper.toast(`聊天记录已清空`);
				}catch(e){
					this.$mHelper.toast(e);
				}
			},
			// 退出群聊
			async exitBtn(){
				try{
					let r = await this.$http.get(apiGroupChatExit+this.chatId)
					this.$mHelper.toast(`群聊已解散`);
					setTimeout(()=>{
						this.$mRouter.back()
					},1000)
				}catch(e){
					this.$mHelper.toast(e);
				}
			},
			// 解散群聊 
			async dissolveBtn(){
				try{
					let r = await this.$http.get(apiGroupChatDissolve+this.chatId)
					this.$mHelper.toast(`群聊已解散`);
					setTimeout(()=>{
						this.$mRouter.back()
					},1000)
					this.btnLoad = false
				}catch(e){
					this.$mHelper.toast(e);
				}
			}
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
.chat-info{
	height: auto;
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