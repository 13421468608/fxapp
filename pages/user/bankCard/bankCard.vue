<template>
	<view class="page">
		<view class="card-list">
			<view class="card-item mb20" v-for="item in cardList" :key="item.cardNumber">
				<text class="name">{{item.name}}</text>
				<text class="type">{{item.bank_name}}</text>
				<text class="number">{{item.card_number}}</text>
			</view>
		</view>
		<!-- 空 -->
		<view class="empty" v-if="cardList.length === 0 && !loading">
			<image src="@/static/image/profile/no_address.png"></image>
			<text>您还没有添加银行卡号哦~</text>
		</view>
		<view class="btns">
			<button @click='addBankCard'>+ 添加银行卡号</button>
		</view>

		<!--加载动画-->
		<rfLoading isFullScreen :active="loading"></rfLoading>
	</view>
</template>

<script>
	
	import { bankAll,bankDel } from '@/api/userInfo';
	// 银行卡列表
	export default {
		data() {
			return {
				loading:false,
				cardList: [],
				req: {
					page: 1,
					page_size: 20
				}
			}
		},
		onShow() {
			this.initData();
		},
		methods: {
			initData(){
				this.getBankAll()
			},
			async getBankAll(){
				let r = await this.$http.post(`${bankAll}`,this.req)
				this.cardList = r.data.items || []
			},
			addBankCard(){
				this.$mRouter.push({ route : '/pages/user/bankCard/addBankCard'});
			}
		}
	}
</script>

<style lang="scss" scoped>
.flex{
	display: flex;
	&.middle{
		align-items: center;
	}
	&.center{
		justify-content: center;
	}
	&.between{
		justify-content: space-between;
	}
	&.column{
		flex-direction: column;
	}
}
.empty{
	margin: 100upx auto;
	text-align: center;
	image{
		height: 332upx;
		width: 340upx;
		display: block;
		margin: 0 auto 10upx auto;
	}
	text{
		font-size: 30upx;
		font-family: Source Han Sans CN;
		font-weight: 400;
	}
}
.mb20{
	margin-bottom: 20upx;
}
.page{
	min-height: 100vh;
	background: #f2f2f2;
	box-sizing: border-box;
	padding: 20upx 30upx 20upx 30upx;
	.card-list{
		height: auto;
		width: 100%;
		.card-item{
			height: 220upx;
			width: 100%;
			background-color: #C54445;
			padding-left: 42upx;
			box-sizing: border-box;
			border-radius: 8upx;
			text{
				display: block;
				font-family: PingFang SC;
				font-weight: 500;
				color: #EDF2FA;
				
				&:nth-child(1){
					font-size: 34upx;
					padding-top: 30upx;
				}
				&:nth-child(2){
					margin: 4upx 0 30upx 0;
					font-size: 24upx;
				}
				&:nth-child(3){
					font-size: 34upx;
				}
			}
		}
	}
	.btns{
		width: 100%;
		height: auto;
		margin-top: 90upx;
		button{
			width: 100%;
			height: 90upx;
			background: #FFA800;
			border-radius: 4upx;
			font-size: 30upx;
			font-family: Source Han Sans CN;
			font-weight: 500;
			color: #010101;
			text-align: center;
			line-height: 90upx;
		}
	}
}
</style>

