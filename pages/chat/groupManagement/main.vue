<template>
	<view class="chat-info">
		<view class="rf-row-wrapper">
			<view class="cells mb20">
				<view class="row default-row invitation">
					<view class="tit">
						<text >群聊邀请确认</text>
						<view class="desc">启用后，群成员需群主或者群管理员确认才能邀请朋友进群。</view>
					</view>
					<switch
						:checked="chatInfo.invitation_confirmation"
						color="#f3ac3c"
						@change="swichChange($event,'invitation_confirmation')"
					/>
				</view>
			</view>
			<view class="cells">
				<view class="row default-row">
					<text class="tit">全局禁言</text>
					<switch
						:checked="chatInfo.silence"
						color="#f3ac3c"
						@change="swichChange($event,'silence')"
					/>
				</view>
			</view>
			<view class="cells mb20">
				<view class="row default-row">
					<text class="tit">允许群内添加好友</text>
					<switch
						:checked="chatInfo.add_friend"
						color="#f3ac3c"
						@change="swichChange($event,'add_friend')"
					/>
				</view>
			</view>
			<view class="cells">
				<view class="row b-b arr" @tap="cellChange('voucher')">
					<text class="tit">禁止领取代金券</text>
				</view>
			</view>
			<block v-if="identity == 1">
				<view class="cells">
					<view class="row b-b arr" @tap="cellChange('people')">
						<text class="tit">群管理员</text>
					</view>
				</view>
				<view class="cells mb20">
					<view class="row b-b arr flex between" @tap="cellChange('tranfer')">
						<text class="tit">群主管理权转让</text>
					</view>
				</view>
				<view class="cells">
					<view class="row default-row dissolve" @tap="chatBtn('dissolve')">
						<text class="tit red">解散该群</text>
					</view>
				</view>
			</block>
			
			
			
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
	import { apiGroupChatManagementSite,apiGroupChatDissolve } from '@/api/maillList.js';
	export default {
		data() {
			return {
				loading: true,
				identity: null, // 1群主 2管理员 3成员
				

				
				siteTimer: null,
				chatId: null,
				chatInfo: {
					// add_friend: false,  			// 添加好友
					// invitation_confirmation: false, // 邀请确认
					// silence: false, 				// 禁言
				},
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
			this.identity = option.identity
		},
		onShow() {
			this.init()
		},
		methods: {
			async init(){
				try{
					let r = await this.$http.get(apiGroupChatManagementSite + this.chatId)
					this.chatInfo = r.data	
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
				// dissolve tranfer voucher
				console.log(this.chatInfo);
				switch (type){
					case 'tranfer':
						// 群主管理权转让
						this.navTo('/pages/chat/groupManagement/list?type=transfer&chatId='+this.chatId)
						break;
					case 'voucher':
						// 禁止领取代金券
						this.navTo('/pages/chat/groupManagement/list?type=no&chatId='+this.chatId)
						break;
					case 'people':
						// 群管理
						this.navTo('/pages/chat/groupManagement/people?chatId='+this.chatId)
						break;
					default:
						break;
				}
			},
			
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
			// swich点击
			swichChange(e,type){
				console.log(e.detail);
				if(this.personalSiteTimer) clearTimeout(this.personalSiteTimer)
				this.personalSiteTimer = setTimeout(res => {
					this.chatInfo[type] = e.detail.value
					this.groupChatInfoSite(type)
				},500)
			},
			// 群聊管理设置
			async groupChatInfoSite(type){
				try{
					let r = await this.$http.post(`${apiGroupChatManagementSite}update/${this.chatId}`,{
						invitation_confirmation: this.chatInfo.invitation_confirmation,
						silence: this.chatInfo.silence,
						add_friend: this.chatInfo.add_friend,
					})
					switch (type){
						case 'invitation_confirmation':
							this.$mHelper.toast(`已${this.chatInfo.invitation_confirmation ? '开启' : '取消'}群聊邀请确认`);
							break;
						case 'silence':
							this.$mHelper.toast(`已${this.chatInfo.silence ? '开启' : '取消'}全局禁言`);
							break;
						case 'add_friend':
							this.$mHelper.toast(`已${this.chatInfo.add_friend ? '允许' : '不允许'}群内添加好友`);
							break;
						default:
							break;
					}
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
	.invitation{
		height: 140upx;
		.tit{
			position: relative;
			padding-bottom: 20upx;
			.desc{
				width: 120%;
				font-size: 22upx;
				font-family: Source Han Sans CN;
				font-weight: 300;
				color: #999999;
				position: absolute;
				left: 0;
				transform: scale(.9);
				transform-origin:left top;
			}
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
.tit{
	flex: 1;
}
.dissolve{
	justify-content: center;
	.tit{
		color: #DF0022;
		text-align: center;
	}
}
</style>