<template>
	<view class="send-voucher">
		<view class="cnt select" v-if="type !== 'exclusive'">
			<text class="mr20" @tap='openPop'>普通代金券</text>
			<i class='icon icon-arr'  @tap='openPop'></i>
		</view>
		<view class="cnt fx-group-list">
			<view class="fx-group-cell mt20 mb20 arr" v-if="type === 'exclusive'" @tap="selExclusive">
				<view>
					<view class="fx-group-cell_l pl20">
						发送给
					</view>
					<view class="fx-group-cell_m" >
						<img src="" alt="">
						<text></text>
					</view>
				</view>
			</view>
			<view v-else class="fx-group-cell mb20">
				<view class="fx-group-cell_l pl20">
					代金券个数
				</view>
				<view class="fx-group-cell_m">
					<input class="right" type="text" placeholder="填写代金券个数">
					<text>个</text>
				</view>
			</view>
			<view class="fx-group-cell mb20">
				<view class="fx-group-cell_l pl20">
					<i class="icon icon-collage mr20"></i>
					<text>总金额</text>
				</view>
				<view class="fx-group-cell_m">
					<input class="right" type="text" placeholder="￥0.00">
					<text>代金券</text>
				</view>
			</view>
			
			<view class="fx-group-cell">
				<view class="fx-group-cell_m">
					<input type="text" maxlength="30" placeholder="恭喜发财，大吉大利">
				</view>
			</view>
		</view>
		<view class="price">
			<text class="unit">¥</text>
			<text>0.00</text>
		</view>
		<view class="btn">
			<button class="confirm-btn" @tap="sendVoucher">发送代金券</button>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				type: 'exclusive' , //exclusive 专属红包
				voucherTypes: [
					{value:0, text: '普通代金券'},
					{value:1, text: '拼手气代金券'}
				],
				voucherCurType: 0,
			}
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
	background-color: #f2f2f2;
}
.mb20{
	margin-bottom: 20upx;
}
.mt20{
	margin-top: 20upx;
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
i.icon{
	display: inline-block;
	background-size: 100%;
	background-repeat: no-repeat;
	&.icon-more{
		width: 36upx;
		height: 8upx;
		background-image: url('@/static/image/chat/icon-more.png');
	}
	&.icon-arr{
		height: 12upx;
		width: 21upx;
		background-image: url('@/static/image/chat/icon-voucher-arr.png');
	}
	&.icon-collage{
		width: 40upx;
		height: 40upx;
		background-image: url('@/static/image/chat/icon-voucher-collage.png');
	}
}
.header{
	height: 88upx;
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
.fx-group-list{
	width: 100%;
	height: auto;
	.fx-group-cell{
		height: 110upx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-color: #fff;
		border-radius: 8upx;
		&_l{
			display: flex;
			align-items: center;
			justify-content: flex-start;
			&.content{
				padding-left: 30upx;
			}
		}
		&_m{
			display: flex;
			align-items: center;
			padding: 0 30upx;
		}
	}
}

.send-voucher{
	height: auto;
	.cnt{
		width: 92% !important;
		margin: 0 auto ;
		
	}
	.select{
		font-size: 28upx;
		font-family: Source Han Sans CN;
		font-weight: 400;
		color: #FFA800;
		margin-top: 20upx;
		margin-bottom: 20upx;
		position: relative;
		display: flex;
		align-items: center;
	}
	.right{
		text-align: right;
		padding-right: 20upx;
		&::placeholder{
			text-align: right;
		}
	}
	.fx-group-list{
		height: auto;
		width: 100%;
	}
	.price{
		display: flex;
		align-items: flex-end;
		justify-content: center;
		margin: 120upx 0 80upx 0;
		text{
			font-size: 72upx;
			line-height: 72upx;
			font-family: Source Han Sans CN;
			font-weight: bold;
			color: #000000;
			&.unit{
				font-size: 48upx;
				line-height: 48upx;
			}
		}
	}
	.btn{
		width: 92%;
		margin: 0 auto;
		button{
			width: 100%;
			background-color: #FFA800;
			color: #010101;
			height: 90upx;
			line-height: 90upx;
			border-radius: 8upx;
			&::after{
				border: none;
			}
		}
	}
}
</style>