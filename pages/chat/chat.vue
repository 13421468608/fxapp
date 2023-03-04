<template>
	<view class="chat main">
		<view class="header">
			<view class="header-cnt">
				<view class="tabbar flex">
					<view>
						<i class='icon icon-back'></i>
					</view>	
					<view>
						<text>这是群聊名称（123）</text>
						<!-- <i class='icon'></i> -->
					</view>
					<view>
						<i v-if="option.type == '2'" class='icon icon-more' @tap="goChatInfo"></i>
					</view>	
				</view>
			</view>
		</view>
		<!-- 通知栏 -->
		
		
		<view v-if="option.type == '2'" class="notice">
			<view class="notice-cnt" @tap="noticeChange">
				<i class='icon icon-notice'></i>
				<text class="ellipsis">嘻嘻嘻嘻嘻嘻嘻测试测试测试测试测试......</text>
				<i class='icon icon-rightarr'></i>
			</view>
		</view>
		<!-- 聊天区域 -->
		<view class="chat-msg" @tap.stop="isFocus = false">
			
			<msg-list id="chatMsg" ref="chatMsg" :msgArr="mgsArr"></msg-list>
		</view>
		<!-- 输入区域 -->
		<view class="chat-fct">
			<!-- 输入 -->
			<view class="chat-inp flex middle between border-x-b">
				<view class="shrink mr20">
					<i class='icon icon-voice'></i>
				</view>
				<view class="mr20 chat-inp_m">
					<!-- <input type="text" placeholder="请输入消息"/> -->
					<view class="inp-cnt">
						<textarea class="content" v-model="msgInput" maxlength="-1" auto-height />
					</view>	
				</view>
				<view class="shrink flex">
					<!-- <i class='icon icon-expression mr20'></i> -->
					<i class='icon icon-many mr20'></i>
					<button :disabled="!msgInput" class="send-btn">发送</button>
				</view>
			</view>
			<!-- 功能区 -->
			<view class="chat-ability" v-if="isFocus">
				<view class="ability-list">
					<view
						v-for="item in chatAbility"
						:key="item.cls"
						class="ability-item flex center">
						<view class="icon-container flex center">
							<i :class="['icon','icon-'+item.cls]"></i>
						</view>
						<text>{{item.name}}</text>
					</view>
				</view>
			</view>
		</view>
		
		
		<!--页面加载动画-->
		<rfLoading isFullScreen :active="loading"></rfLoading>
	</view>
</template>

<script>
	import { apiChatRecord,apiChatRead } from '@/api/chat.js';
	import msgList from './cpns/msgList.vue'
	export default {
		components: { msgList },
		data() {
			return {
				// type 1个人 2群聊  target_id聊天目标id chat_ud聊天唯一id
				option:{},
				loading: false,
				chatReq: {
					page: 1,
					page_size: 40,
					sort:"desc",     // 升序:asc 降序:desc
					order_by:"created_at",
					filter:[
						{
						  "column": "chat_id",
						  "operator": "=",
						  "value": "4df3768530714e77abe157b7f6ae4803"
						}
					]
				},
				// 输入值
				// msgInput: null,
				//聊天信息arr
				mgsArr: [],
				// 数据=
				chatAbility: [
					{name:'相册',cls:'album'},
					{name:'拍摄',cls:'camera'},
					{name:'录制视频',cls:'video'},
					{name:'个人名片',cls:'business-card'},
					{name:'代金券',cls:'cash'},
					{name:'转账',cls:'transfer-money'},
				],
				isFocus: true, // 是否在输入/选择功能
				
				msgInput: null, //输入内容
				// chat
				info: {},
			}
		},
		onLoad(option){
			this.option = option
			this.chatReq.filter = [
				{
				  "column": "chat_id",
				  "operator": "=",
				  "value": option.chat_id
				}
			]
		},
		onShow() {
			this.getChatRecord()
		},
		watch:{
			msgInput(val){
				console.log(val.target.text);
			}
		},
		methods: {
			msgScrollTo(){
				this.$nextTick(() => {  // 一定要用nextTick
					// this.$refs.chatMsg.scrollTop = this.$refs.chatMsg.scrollHeight;
				  // this.$refs.chatMsg.scrollTop = this.$refs.chatMsg.scrollHeight
				  	let dom = document.getElementById('chatMsg')
					setTimeout(() => {
						dom.scrollTop = dom.scrollHeight;// 滚动高度
					}, 0);
					
					console.log(dom.scrollTop,dom.scrollHeight);
				  	// dom.scrollTop = dom.scrollHeight;
				})
			},
			// 获取聊天记录
			async getChatRecord(type){
				try{
					let r = await this.$http.post(apiChatRecord,this.chatReq)
					this.mgsArr = r.data.items
					// uni.setNavigationBarTitle({ title: `${this.chatInfo.name}(${this.chatInfo.total})`})
					this.msgScrollTo()
					this.updChatRead()
				}catch(e){
					this.$mHelper.toast(e);
				}
				this.loading = false
			},
			// 更新未读消息数量
			updChatRead(){
				try{
					this.$http.get(apiChatRead,{chat_id: this.option.chat_id})
				}catch(e){
					this.$mHelper.toast(e);
				}
			},
			// 去详情页
			goChatInfo(type){
				let { chat_ud,target_id } = this.option
				if(type){
					this.$mRouter.push({ route: `/pages/chat/chatInfo?id=${item.target_id}` }); // 群聊
				}else{
					this.$mRouter.push({ route: `/pages/chat/chatUserInfo?id=${item.target_id}` }); // 单人
				}
			},
			noticeChange(){
				
			},
			navTo(route) {
				this.$mRouter.push({ route });
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
	&.icon-notice{
		width: 38upx;
		height: 32upx;
		background-image: url('@/static/image/chat/icon-notice.png');
	}
	&.icon-rightarr{
		height: 22upx;
		width: 13upx;
		background-image: url('@/static/image/chat/icon-rightarr.png');
	}
	&.icon-voice{
		width: 52upx;
		height: 52upx;
		background-image: url('@/static/image/chat/icon-voice.png');
	}
	&.icon-expression{
		width: 52upx;
		height: 52upx;
		background-image: url('@/static/image/chat/icon-expression.png');
	}
	&.icon-many{
		width: 52upx;
		height: 52upx;
		background-image: url('@/static/image/chat/icon-many.png');
	}
	&.icon-more{
		width: 36upx;
		height: 8upx;
		background-image: url('@/static/image/chat/icon-more.png');
	}
	&.icon-album{
		width: 60upx;
		height: 60upx;
		background-image: url('@/static/image/chat/icon-album.png');
	}
	&.icon-camera{
		width: 60upx;
		height: 60upx;
		background-image: url('@/static/image/chat/icon-camera.png');
	}
	&.icon-video{
		width: 60upx;
		height: 60upx;
		background-image: url('@/static/image/chat/icon-video.png');
	}
	&.icon-business-card{
		width: 60upx;
		height: 60upx;
		background-image: url('@/static/image/chat/icon-business-card.png');
	}
	&.icon-cash{
		width: 60upx;
		height: 60upx;
		background-image: url('@/static/image/chat/icon-cash.png');
	}
	&.icon-transfer-money{
		width: 60upx;
		height: 60upx;
		background-image: url('@/static/image/chat/icon-transfer-money.png');
	}
}
.header{
	height: auto;
	min-height: 88upx;
	width: 100%;
	background-color: #fff;
	.header-cnt{
		position: fixed;
		width: 100%;
		height: 88upx;
	}
	.tabbar{
		height: 88upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 40upx;
	}
}
.chat{
	height: 100vh;
	display: flex;
	flex-direction: column;
	overflow-y: hidden;
	.notice{
		height: 118upx;
		width: 100%;
		background-color: #fff;
		display:flex;
		align-items: center;
		justify-content: space-between;
		padding-bottom: 15upx;
		&-cnt{
			width: 690upx;
			height: 88upx;
			background: #F4F4F4;
			border-radius: 8upx;
			padding: 0 21upx;
			display:flex;
			align-items: center;
			justify-content: space-between;
			margin: 0 auto;
			text{
				flex: 1;
				padding: 0 22upx;
				box-sizing: border-box;
			}
		}
	}
	
	.chat-msg{
		width: 100%;
		overflow-y: auto;
	}
	.chat-fct{
		width: 100%;
		background-color: #fff;
		.chat-inp{
			width:100%;
			min-height: 110upx;
			padding: 19upx 30upx;
			.mr20{
				margin-right: 20upx;
			}
			.chat-inp_m{
				flex: 1;
				max-width: 210px;
				.inp-cnt{
					background: #F2F2F2;
					border-radius: 4px;
					min-height: 72upx;
					padding: 20upx;
					max-height: 180rpx;
					textarea{
						width: 380px;
					}
				}
				.inp{
					line-height: 32upx;
					font-size: 28upx;
					font-family: Source Han Sans CN;
					font-weight: 400;
					color: #808080;
					width: 100%;
					padding: 0 20upx;
					outline: none;
					
				}
			}
			.send-btn{
				height: 52upx;
				background-color: #FFA800;
				color: #fff;
				font-size: 26upx;
				line-height: 52upx;
				border-radius: 4upx;
				&::after{
					border: none;
				}
			}
		}
		.chat-ability{
			height: auto;
			width: 100%;
			padding: 30upx 0;
			.ability-list{
				display: flex;
				flex-wrap: wrap;
				margin-left: 46upx;
			}
			.ability-item{
				border-radius: 16upx;
				flex-direction: column;
				margin-right: 57upx;
				margin-bottom: 20upx;
				.icon-container{
					width: 120upx;
					height: 120upx;
					border-radius: 16upx;
					background: #F2F2F2;
				}
				text{
					font-size: 24upx;
					font-family: Source Han Sans CN;
					font-weight: 400;
					color: #7E7E7E;
					margin-top: 19upx;
				}
			}
			
		}
	}

}
</style>