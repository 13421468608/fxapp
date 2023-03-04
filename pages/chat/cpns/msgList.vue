<template>
	<scroll-view class="msg-list">
		<view 
			class="msg-item"
			v-for="item in msgArr"
			:key="item.date">
			<view class="msg-avatar left" v-if="item.sender_id == 7">
				<image class="avatar" :src="$imgBase+item.avatar" alt="">
				<view class="nick-name">{{item.nick_name}}</view>
			</view>
			<view :class="[
				'msg-container',
				item.sender_id == 7 ? 'left' : 'right',
				[4,5].includes(item.message_type) ? 'yellow' : '']">
				<view :class="['msg-cnt', cls[item.message_type]]" >
					<block v-if='item.message_type == 1'>
						{{item.message}}
					</block>
					<block v-else-if='item.message_type == 2'>
						<view class="img-container">
							<image src="../../../static/kj.png" mode=""></image>
						</view>	
					</block>
					<block v-else-if='item.message_type == 3'>
						<view class="video-container">
							<video src=""></video>
						</view>	
					</block>
					<block v-else-if='item.message_type == 4'>
						<view class="card tranfer-card flex middle border-x-b">
							<image v-if="true" src="@/static/image/chat/icon-chat-tranfer.png"></image>
							<image v-else src="@/static/image/chat/icon-chat-untranfer.png"></image>
							<view class="flex column">
								<text>¥ 200</text>
								<text class="desc-txt">{{true ? '已收款' : '请收款'}}</text>
							</view>
						</view>	
						<text class="desc-txt">转账</text>
					</block>
					<block v-else-if='item.message_type == 5'>
						<view class="card hb-card flex middle border-x-b">
							<image v-if="true" src="@/static/image/chat/icon-chat-hb.png"></image>
							<image v-else src="@/static/image/chat/icon-chat-unhb.png"></image>
							<view>
								<text>恭喜发财,大吉大利</text>
								<text class="desc-txt" v-if="false">已被领取</text>
							</view>
						</view>	
						<text class="desc-txt">代金券</text>
					</block>
					<block v-else-if='item.message_type == 6'>
						<view class="card info-card flex middle border-x-b">
							<image src="@/static/kj.png"></image>
							<text>小恐龙爱睡觉</text>
						</view>
						<text class="grey-text pt">个人名片</text>
					</block>
				
				</view>	
			</view>
			<view class="msg-avatar right" v-if="item.sender_id != 7">
				<image class="avatar" :src="$imgBase+item.avatar" alt="">
				<view class="nick-name">{{item.nick_name}}</view>
			</view>
		</view>
	</scroll-view>
</template>

<script>
export default {
	props: {
		msgArr: Array,
		isSelf: Boolean,
	},
	data() {
		// 1信息 2图片 3视频 4转账 5红包 6公共消息
		return {
			cls:{
				1:'text',
				2:'img',
				3:'video',
				4:'tranfer',
				5:'money',
				6:'announcement',
			}
		};
	},
}
</script>

<style lang="scss">
page{
	background-color: #f2f2f2;
}
.msg-list{
	min-height: 40vh;
	.msg-item{
		height: auto;
		margin-bottom: 20upx;
		display: flex;
		padding: 20upx 0;
		.msg-avatar{
			height: 78upx;
			width: 108upx;
			position: relative;
			.avatar{
				height: 78upx;
				width: 78upx;
				border-radius: 8upx;
			}
			.nick-name{
				position: absolute;
				white-space: normal;
				width: 40vw;
				top: -14upx;
				font-size: 24upx;
				font-family: Source Han Sans CN;
				font-weight: 400;
				color: #818181;
			}
			&.left{
				padding-left: 30upx;
				.nick-name{
					left: 128upx;
					text-align: left;
				}
			}
			&.right{
				padding-right: 30upx;
				.nick-name{
					right: 128upx;
					text-align: right;
				}
			}
		}
		.msg-container{
			flex: 1;
			padding-top: 23upx;
			display: flex;
			padding-left: 20upx;
			.msg-cnt{
				padding: 14upx 26upx;
				border-radius: 12upx;
				background-color: #fff;
				width: auto;
				max-width: 470upx;
				font-size: 28upx;
				font-family: Source Han Sans CN;
				font-weight: 400;
				color: #000000;
				position: relative;
			}
			&.right{
				justify-content: flex-end;
				margin-right: 20upx;
				.msg-cnt{
					position: relative;
					&.text{
						background-color: #FFA800;
						color: #000;
						&::before{
							border-bottom-color: #FFA800;
						}
					}
					&::before{
						content: '';
						position: absolute;
						bottom: 0;
						right: -14upx;
						height: 0;
						width: 0;
						border: 20upx solid transparent;
						border-bottom-color: #fff;
						transform: rotate(15deg);
					}
					
				}
			}
			&.left{
				.msg-cnt{
					position: relative;
					&::before{
						content: '';
						position: absolute;
						bottom: 0;
						left: -14upx;
						height: 0;
						width: 0;
						border: 20upx solid transparent;
						border-bottom-color: #fff;
						transform: rotate(-15deg);
					}
				}
			}
			&.yellow{
				.msg-cnt{
					background-color: #FFA800;
					&::before{
						border-bottom-color: #FFA800;
					}
					.border-x-b::after{
						border-color: #fff;
					}
				}
			}
			.announcement{
				.card{
					width: 403upx;
					margin-bottom:10upx;
					padding: 15upx 0;
					&.info-card{
						image{
							width: 78upx;
							height: 78upx;
							border-radius: 4upx;
							margin-right: 24upx;
						}
					}
					
				}
				
				.grey-text{
					font-size: 24upx;
					font-family: Source Han Sans CN;
					font-weight: 400;
					color: #7E7E7E;
				}
			}
			
			.hb-card{
				padding: 20upx 0;
				width:402upx;
				text{
					font-size: 34upx;
					font-family: Source Han Sans CN;
					font-weight: 500;
					color: #FFFFFF;
					
				}
				image{
					height: 78upx;
					width: 62upx;
					margin-right: 20upx;
				}
			}
			.tranfer-card{
				padding-bottom: 20upx;
				width:402upx;
				text{
					font-size: 28upx;
					font-family: Source Han Sans CN;
					font-weight: 500;
					color: #FFFFFF;
				}
				image{
					height: 72upx;
					width: 72upx;
					margin-right: 20upx;
				}
			}
			.video-container{
				padding-bottom: 20upx;
				video{
					max-width: 200upx;
					height: 300upx;
				}
			}
			.desc-txt{
				font-size: 24upx !important;
				font-family: Source Han Sans CN;
				font-weight: 400 !important;
				color: #FFFFFF;
			}
		}
	}
}

</style>