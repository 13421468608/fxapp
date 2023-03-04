<template>
	<view class="login">
		<view class="main">
			<view class="container">
				<view class="cell">
					<view class="name">手机号</view>
					<view class="cell-cnt border-x-b flex center">
						<view class="cell-l">+86</view>
						<input class="cell-m" type="number" maxlength="13" placeholder="请输入手机号">
						<view class="cell-r"></view>
					</view>
				</view>
				<view class="cell" v-if="type !== 'login'">
					<view class="name">验证码</view>
					<view class="cell-cnt border-x-b flex center">
						<input class="cell-m" type="number" maxlength="6" placeholder="请输入验证码">
						<view class="cell-r shrink">获取验证码</view>
					</view>
				</view>
				<view class="cell">
					<view class="name">密码</view>
					<view class="cell-cnt border-x-b flex center">
						<input class="cell-m" type="password" maxlength="12" placeholder="请输入密码">
						<view class="cell-r shrink">
							<!-- <image src="" mode=""></image> -->
						</view>
					</view>
				</view>
			</view>
			<view class="btns">
				<button>确认</button>
			</view>
		</view>	
	</view>
</template>

<script>
	export default {
		data(){
			return {
				type: 'updPwd'  ,// reg注册账号  login 登录商城  updPwd修改登录密码 ,
				typeNames: {
					reg: ['注册账号','注册'],
					login: ['登录商城','登录'],
					updPwd: ['修改登录密码','确认']
				},
				btnName: {
					reg: '注册账号',
					login: '登录商城',
					updPwd: '修改登录密码'
				}
			}
		},
		onLoad(options) {
			this.initData(options)
		},
		methods:{
			initData(options){
				this.type = options.type || 'reg'
			},
			// 返回上一页
			navBack() {
				this.$mRouter.back();
			},
		}
	}
</script>

<style lang="scss" scoped>
	.login{
		min-height: 100vh;
		width: 100vw;
		background: #fff;
	}
	.main{
		padding: 0 50upx;
		.container{
			.cell{
				.name{
					font-size: 22upx;
					font-family: Source Han Sans CN;
					font-weight: 400;
					color: #000000;
					padding: 40upx 0 10upx 0;
					
				}
				.cell-cnt{
					padding: 20upx 0;
					.cell-l {
						font-size: 30upx;
						font-family: Source Han Sans CN;
						font-weight: 400;
						color: #171716;
						padding-right: 48upx;
					}
					.cell-r{
						color: #FFB400;
					}
					input{
						flex: 1;
					}
				}
			}
		}
		.xy,.wj{
			padding: 24upx 0;
			font-size: 24upx;
			font-family: Source Han Sans CN;
			font-weight: 400;
			color: #000000;
			
		}
		.wj{
			text-align: right;
		}
		.btns{
			margin-top: 80upx;
			button{
				background-color: rgba(255, 168, 0, .5);
				font-size: 30upx;
				font-family: Source Han Sans CN;
				font-weight: 400;
				color: #010101;
				&::after{
					border: none;
				}
			}
			.btn-txt{
				font-size: 30upx;
				font-family: Source Han Sans CN;
				font-weight: 400;
				text-align: center;
				margin-top: 20upx;
				line-height: 90upx;
			}
		}
	}
	.orange{
		color: #FFB400;
	}
</style>