<template>
	<view class="page">
		<view class="item border-x-b">
			<view class="item-title">姓名</view>
			<view class="item-other">
				<input type="text" maxlength="10" v-model='name' placeholder="请输入真实姓名">
			</view>
		</view>
		<view class="item border-x-b">
			<view class="item-title">二代身份证号</view>
			<view class="item-other">
				<input type="text" v-model="id_card" maxlength="18" placeholder="请输入身份证号">
			</view>
		</view>
		
		<view class="btns">
			<button 
				:disabled="btnLoading"
				:loading="btnLoading"
				class="confirm-btn" 
				@tap="confirmBtn">
				提交
			</button>
		</view>
	</view>
</template>

<script>
	// 实名认证
	import { userRealname } from '@/api/userInfo';
	export default {
		data() {
			return {
				btnLoading: false,
				name: null,
				id_card: null
			}
		},
		methods: {
			confirmBtn(){
				if(!this.name){
					this.$mHelper.toast('请输入姓名');
					return
				}else if(!this.id_card){
					this.$mHelper.toast('请输入身份证号');
					return
				}else if(!/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(this.id_card)){
					this.$mHelper.toast('身份证号错误');
					return
				}
				this.authRealname()
			},
			// 更新用户信息
			async authRealname() {
				this.btnLoading = true;
				await this.$http
					.post(`${userRealname}`, {
						name: this.name,
						id_card: this.id_card
					})
					.then((res) => {
						this.$mHelper.toast(`恭喜您, ${res.message}`);
						setTimeout(() => {
							this.$mRouter.back();
						}, 1 * 1000);
					})
					.catch(() => {
						this.btnLoading = false;
					});
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
.page{
	min-height: 100vh;
	padding: 0 32upx;
	background-color: #fff;
	.item{
		width: 100%;
		padding-bottom: 20upx;
		&-title{
			font-size: 24upx;
			font-family: Source Han Sans CN;
			font-weight: 400;
			color: #333333;
			line-height: 72upx;
			margin-bottom: 10upx;
		}
		&-other{
			input{
				width: 100%;
				color: #333333;
				font-size: 30upx;
				font-family: Source Han Sans CN;
				font-weight: 500;
				&::placeholder {
					color: #BFBFBF;
					font-weight: 200;
				}
			}
			.qrcode-bd{
				width: 382upx;
				height: 242upx;
				border: 2upx solid #F5F5F5;
				image{
					width: 350upx;
					height: 220upx;
					border-radius: 8upx;
				}
			}
			.upd-btn{
				width: 162upx;
				height: 44upx;
				background: #FFA800;
				border-radius: 4upx;
				font-size: 24upx;
				line-height: 44upx;
				font-family: Source Han Sans CN;
				font-weight: 400;
				color: #FFFFFF;
				margin-top: 24upx;
			}
		}
	}
	.desc{
		font-size: 24upx;
		font-family: Source Han Sans CN;
		font-weight: 400;
		color: #808080;
		line-height: 36upx;
		padding-top: 30upx;
		margin-bottom: 43upx;
	}
	.btns{
		width: 100%;
		height: auto;
		.confirm-btn{
			width: 690upx;
			height: 90upx;
			background: rgba(255, 168, 0, 1);
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
