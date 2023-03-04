<template>
	<view class="page">
		<view class="coucher">
			<view class="coucher-container flex column center">
				<view class="coucher-top">
					<text class="title">代金券金额</text>
					<view>
						<text class="unit">¥</text>
						<text class="price">957.32</text>
					</view>
				</view>
				<view class="coucher-btm flex middle center">
					<view class="box border-y-r">
						<text class="title">收到的代金券</text>
						<view class="flex end center">
							<text class="unit">¥</text>
							<text class="price">1.2</text>
						</view>
					</view>
					<view class="box">
						<text class="title">发出的代金券</text>
						<view class="flex end center">
							<text class="unit">¥</text>
							<text class="price">5.2</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="bill">
			<view class="tlt">账单明细</view>
			<view ></view>
		</view>
	</view>
</template>

<script>
	// 代金券记录
	export default {
		async onShow() {
			// 初始化数据
			await this.initData();
		},
		data() {
			return {
				hasLogin: false,
				cellList: [
					{name:'银行卡',route:'/pages/user/bankCard/bankCard',src:''},
					{name:'代金券记录',route:'/',src:''},
					{name:'支付密码',route:'/',src:''},
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
	&.end{
		align-items: flex-end;
	}
}
.mb20{
	margin-bottom: 20upx;
}
.page{
	min-height: 100vh;
	background: #f1f1f1;
	box-sizing: border-box;
	.coucher{
		height: 400upx;
		background: linear-gradient(0deg, #FFD76A, #FFA800);
		width: 100%;
		position: relative;
		.coucher-container{
			width: 690upx;
			height: 320upx;
			background: #FFFFFF;
			border-radius: 16upx;
			position: absolute;
			left: 50%;
			bottom: -160upx;
			transform: translateX(-50%);
			padding: 50upx 0;
			box-sizing: border-box;
			.coucher-top{
				text-align: center;
				padding-bottom: 20upx;
				text{
					font-family: Source Han Sans CN;
					font-weight: 500;
					color: #000000;
					&.title{
						font-size: 24upx;
						font-weight: 400;
					}
					&.unit{
						font-size: 30upx;
					}
					&.price{
						font-size: 48upx;
					}
				}
			}
			.coucher-btm{
				text-align: center;
				width: 100%;
				.box{
					width: 50%;
					&.border-y-r{
						&::after{
							height: 58upx;
							background-color: #eee;
							top:50%;
							transform: translateY(-50%);
						}
					}
					text{
						font-family: Source Han Sans CN;
						font-weight: 400;
						color: #000000;
						&.title{
							display: inline-block;
							font-size: 22upx;
							color: #808080;
							padding-bottom: 14upx;
						}
						&.unit{
							font-size: 24upx;
							line-height: 24upx;
							vertical-align: middle;
						}
						&.price{
							font-size: 36upx;
							line-height: 36upx;
						}
					}
				}
			}
		}
	}
	.bill{
		padding-top: 160upx;
		.tlt{
			font-size: 36upx;
			font-family: Source Han Sans CN;
			font-weight: 500;
			color: #1A1A1A;
		}
	}
}
</style>
