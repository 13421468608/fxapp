<template>
	<view class="page">
		<view class="ye flex between middle">
			<view class="ye-info">
				<text>当前余额</text>
				<view>
					<text class="unit">¥</text>
					<text class="price">957.32</text>
				</view>
			</view>
			<button @click="cash">提现</button>
		</view>
		<view class="cells flex between ">
			<view
				v-for="item in cellList"
				:key="item.route"
				class="cell"
				@click="hrefBtn(item.route)"
				>
				<view>
					<image :src="item.img"></image>
				</view>
				<text>{{item.name}}</text>
			</view>
		</view>
		<view class="bill">
			<view class="tlt">账单明细</view>
			<view ></view>
		</view>
	</view>
</template>

<script>
	// 实名认证
	// let account_bank = require('@/static/image/profile/account_bank.png')
	// let account_bank = require('@/static/image/profile/account_history.png')
	// let account_bank = require('@/static/image/profile/account_pwd')
	export default {
		async onShow() {
			// 初始化数据
			await this.initData();
		},
		data() {
			return {
				hasLogin: false,
				cellList: [
					{name:'银行卡',route:'/pages/user/bankCard/bankCard',img: require('@/static/image/profile/account_bank.png')},
					{name:'代金券记录',route:'/pages/user/voucher/voucher',img:require('@/static/image/profile/account_history.png')},
					{name:'支付密码',route:'/pages/user/updPwd/updPwd',img:require('@/static/image/profile/account_pwd.png')},
				]
			}
		},
		methods: {
			async initData() {
				this.hasLogin = this.$mStore.getters.hasLogin;
				if(this.hasLogin){
					// await this.getMemberInfo();
				}else {
					this.loading = false;
					// this.resetSectionData();
				}
			},
			cash(){},
			hrefBtn(route) {
				if (!route) return;
				if(!this.hasLogin){
					this.$mRouter.push({route: `/pages/public/login?type=login`});
					return
				}  
				
				this.$mRouter.push({ route });
			},
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
.mb20{
	margin-bottom: 20upx;
}
.page{
	min-height: 100vh;
	background: #f1f1f1;
	box-sizing: border-box;
	padding: 20upx 30upx 0 30upx;
	.ye{
		width: 100%;
		height: 280upx;
		background: #fff;
		margin-bottom: 20upx;
		padding: 0 30upx 0 49upx;
		box-sizing: border-box;
		border-radius: 16upx;
		background: url('@/static/image/profile/account_bg.png') no-repeat;
		background-size: 100%;
		&-info{
			flex:1;
			text{
				font-size: 24upx;
				font-family: Source Han Sans CN;
				font-weight: 500;
				color: #000000;
				&.price{
					font-size: 48upx;
				}
			}
		}
		button{
			width: 150upx;
			height: 64upx;
			background: #FFA800;
			border-radius: 32upx;
			font-size: 28upx;
			font-family: Source Han Sans CN;
			font-weight: 400;
			color: #000000;
			text-align: center;
			line-height: 64upx;
			flex-shrink: 0;
		}
	}
	.cells{
		width: 100%;
		height: 210upx;
		background: #FFFFFF;
		border-radius: 16upx;
		display: flex;
		align-items: center;
		.cell{
			flex:1;
			text-align: center;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			view{
				width: 88upx;
				height: 88upx;
				background: #FFA800;
				box-shadow: 0px 2px 15px 0px #FFD678;
				border-radius: 50%;
				display: flex;
				align-items: center;
				justify-content: center;
				image{
					height: 44upx;
					width: 40upx;
					display: inline-block;
					
				}
			}
			text{
				font-size: 28upx;
				font-family: Source Han Sans CN;
				font-weight: 400;
				color: #1A1A1A;
				padding-top: 20upx;
				text-align: center;
			}
		}
	}
	.bill{
		.tlt{
			font-size: 36upx;
			font-family: Source Han Sans CN;
			font-weight: 500;
			color: #1A1A1A;
		}
	}
	}
</style>
