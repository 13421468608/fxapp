<template>
	<view class="transfer-moneying">
		<view class="info flex center column ">
			<image src="../../static/kj.png" mode=""></image>
			<text>欧克克（**萌）</text>	
		</view>	
		
		<view class="inp">
			<view>转账金额</view>	
			<view class="price border-x-b">
				<text>¥</text>
				<input type="number" placeholder="请输入转账金额">
			</view>	
			<view class="yellow">添加转账说明</view>	
		</view>
		<view class="btns">
			<button>转账</button>
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
.transfer-moneying{
	.info{
		border-bottom: 20upx solid #f2f2f2;
		image{
			height: 78upx;
			width: 78upx;
		}
		text{
			font-size: 36upx;
			font-family: Source Han Sans CN;
			font-weight: 400;
			color: #010101;
			margin: 30upx 0 50upx 0;
		}
	}
	.inp{
		padding: 0 30upx;
		font-size: 28upx;
		font-family: Source Han Sans CN;
		font-weight: 400;
		color: #000000;
		padding: 20upx;
		.price{
			display: flex;
			align-items: center;
			padding: 4upx 0;
			margin: 20upx 0 20upx 0;
			text{
				font-size: 48upx;
				font-weight: 400;
				color: #000000;
			}
			input{
				font-size: 42upx;
				height: 86upx;
				line-height: 86upx;
				font-family: Source Han Sans CN;
				font-weight: 500;
				color: #000000;
				padding-left: 20upx;
			}
		}
	}
	.btns{
		width: 92%;
		margin: 0 auto;
		margin-top: 200upx;
		button{
			width: 100%;
			height: 90upx;
			line-height: 90upx;
			background: #FFA800;
			border-radius: 4upx;
			font-size: 30upx;
			font-family: Source Han Sans CN;
			font-weight: 400;
			color: #010101;
			&::after{
				border: none;
			}
		}
	}
}
</style>