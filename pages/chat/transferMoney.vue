<template>
	<view class="transfer-money">
		<view class="info flex center column">
			<i :class="['icon price-status',typeObj[type].iconCls]"></i>
			<text class="desc">{{typeObj[type].text}}</text>
			<view class="price-cnt flex">
				<text class="unit">¥</text>
				<text class="price">200.00</text>
			</view>
			<view class="account flex center" v-if="type == '2'">
				<text>我的账户</text>
				<i class='icon icon-arr'></i>
			</view>
		</view>
		<view class="time">
			<view class="flex middle between border-x-t">
				<text class='time_l'>转账时间</text>
				<text class='time_r'>2023年01月18日 20:15:20</text>
			</view>
			<view class="flex middle between border-x-b">
				<text>收账时间</text>
				<text>2023年01月18日 20:15:20</text>
			</view>
		</view>
		<view class="btn">
			<button>收账</button>
			<view class="mt60">
				<text>1天内未确认，将退还给对方。</text>
				<text class="yellow">退还</text>
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				type: '1' , //1 我已收账 2 待我收账 3 对方已收账
				typeObj:{
					'1': {
						iconCls: 'icon-yes',
						text: '你已收款，资金已存入账户'
					},
					'2': {
						iconCls: 'icon-no',
						text: '待你收款'
					},
					'3': {
						iconCls: 'icon-yes',
						text: '皮皮大人已收款'
					},
				},
				voucherCurType: 0,
			}
		},
		onLaunch(option) {
			this.type = optio.type
		},
		onShow() {
		},
		methods: {
			// 专属红包 选择人
			selExclusive(){
				this.navTo('/pages/chat/selectFriend?type=exclusive')
			},
			
			openPop(){
				console.log(this.$refs);
				this.$refs.popup.open('top')
			},
			
			
			typeChange(val){
				this.voucherCurType = val
			},
			navTo(route) {
				this.$mRouter.push({ route });
			},
			sendVoucher(){
				
			}
		}
	}
</script>

<style lang="scss" scoped>
page{
	background-color: #fff;
}x
.mb20{
	margin-bottom: 20upx;
}
.mt20{
	margin-top: 20upx;
}
.mt60{
	margin-top: 60upx;
}
.mr20{
	margin-right: 20upx;
}
.pl20{
	padding-left: 20upx;
}
.mr20{
	margin-right: 20upx;
}
.yellow{
	color: #FFA800 !important;
}
i.icon{
	display: inline-block;
	background-size: 100%;
	background-repeat: no-repeat;
	&.icon-yes{
		width: 102upx;
		height: 102upx;
		background-image: url('@/static/image/onechat/icon-ysk.png');
	}
	&.icon-no{
		height: 102upx;
		width: 102upx;
		background-image: url('@/static/image/onechat/icon-dsz.png');
	}
	&.icon-arr{
		height: 12upx;
		width: 21upx;
		background-image: url('@/static/image/chat/icon-voucher-arr.png');
	}
}
.transfer-money{
	padding: 0 30upx;
	box-sizing: border-box;
	.info{
		.price-status{
			margin: 100upx 0 60upx 0;
		}
		.desc{
			font-size: 28upx;
			font-family: Source Han Sans CN;
			font-weight: 400;
			color: #040404;
			margin-bottom: 50upx;
		}
		.price-cnt{
			justify-content: center;
			align-items: flex-end;
			.unit{
				font-size: 48upx;
				line-height: 48upx;
				font-family: Source Han Sans CN;
				font-weight: 500;
				color: #040404;
			}
			.price{
				font-size: 72upx;
				line-height: 72upx;
				font-family: Source Han Sans CN;
				font-weight: 500;
				color: #040404;
			}
		}
	}
	.time{
		margin-top: 100upx;
		.flex{
			padding: 30upx 0 20upx 0;
			&:last-child{
				padding: 0 0 30upx 0;
			}
		}
	}
	.btn{
		display: flex;
		flex-direction:column;
		margin-top: 200upx;
		button{
			width: 400upx;
			height: 90upx;
			line-height: 90upx;
			background: #FFA800;
			border-radius: 4upx;
			font-size: 30upx;
			font-family: Source Han Sans CN;
			font-weight: 400;
			color: #010101;
		}
		view{
			text-align: center;
			text{
				font-size: 28upx;
				font-family: Source Han Sans CN;
				font-weight: 400;
				color: #818181;
			}
		}
	}
}
</style>