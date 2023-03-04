<template>
	<view class="login">
		<view class="uni-head">
			<view class="flex middle fixed">
				<view class="l flex center">
					<text class="back-btn iconfont iconzuo" @tap="navBack"></text>
				</view>
				<view class="m"></view>
				<view class="r"></view>
			</view>
		</view>
		<view class="main">
			<view class="title">
				<text>{{typeNames[type][0]}}</text>
			</view>
			<view class="container">
				<view class="cell">
					<view class="name">手机号</view>
					<view class="cell-cnt border-x-b flex center">
						<view class="cell-l">+86</view>
						<input class="cell-m" type="number" v-model="params.phone" maxlength="13" placeholder="请输入手机号">
						<view class="cell-r"></view>
					</view>
				</view>
				<view class="cell" v-if="type !== 'login'">
					<view class="name">验证码</view>
					<view class="cell-cnt border-x-b flex center">
						<input class="cell-m" type="number" v-model="params.code" maxlength="6" placeholder="请输入验证码">
						<button class="cell-r shrink code" :disabled="!!verTimer" @tap.stop='getCode'>
							{{verTimer ? `重新发送 (${verTime}s)`:"获取验证码"}}
						</button>
					</view>
				</view>
				<view class="cell">
					<view class="name">密码</view>
					<view class="cell-cnt border-x-b flex center">
						<input class="cell-m" type="password" v-model="params.login_password" maxlength="12" placeholder="请输入密码">
						<view class="cell-r shrink">
							<!-- <image src="" mode=""></image> -->
						</view>
					</view>
				</view>
				<view class="xy" v-if="type === 'reg'">
					<text></text>
					<text>注册即代表阅读并同意</text>
					<text class="orange">《用户协议》</text>
				</view>
				<view class="wj" v-if="type === 'login'">
					<text @tap="swichType('updPwd')">忘记密码</text>
				</view>
			</view>
			<view class="btns">
				<button @tap.stop='btnFn' :disabled="btnDisabled">{{btnDisabled ? '请求中' : typeNames[type][1]}}</button>
				<view class="btn-txt orange" v-if="type == 'reg'">
					<text @tap="swichType('login')">去登录</text>
				</view>
				<view class="btn-txt"  v-else-if="type == 'login'">
					还没有账户，<text class="orange" @tap="swichType('reg')">去注册</text>
				</view>
			</view>
		</view>	
	</view>
</template>

<script>
	import { get_code, register, login, forget_login_password } from '@/api/login';
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
				},
				params:{
					phone:'17700560721',		// 手机号
					code: '999999',				// 验证码
					login_password: '123456'	// 密码
				},
				verTime: 60, 		// 验证码倒计时
				verTimer: null, 	// 定时器
				btnDisabled: false, // 提交按钮
				
				userInfo: null,
			}
		},
		onLoad(options) {
			this.type = options.type || 'login'
			this.params.phone = uni.getStorageSync('loginMobile') || '';
			this.params.login_password = uni.getStorageSync('loginPassword') || '';
			this.userInfo = uni.getStorageSync('wechatUserInfo');
		},
		methods:{
			// 切换类型
			swichType(type,info){
				this.params = info || { phone:'',code: '',login_password: '' }
				this.type = type
			},
			// 校验输入值
			validateField(value, key){
				let nameKeys = {
					phone: '手机号',		
					code: '验证码',	
					login_password: '密码'
				},
				status = false;
				if(!value){
					this.$mHelper.toast(`${nameKeys[key]}不能为空，请填写`)
					return false
				}
				switch (key){
					case 'phone':
						status = /^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/.test(value)
						break;
					case 'code':
						status = (value.length >= 6)
						break;
					case 'login_password':
						status = (value.length >= 6)
						break;
					default:
						break;
				}
				if(!status){
					this.$mHelper.toast(`${nameKeys[key]}错误，请重新填写`)
				}
				return status
			},
			
			
			// 验证码
			async getCode(){
				let phone = this.params.phone
				if(this.validateField(phone,'phone')){
					let req = { phone }
					if(this.type == 'reg') req['type']='register'
					let r = await this.$http.get(get_code, req)
					this.handleSmsCodeTime(59);
					this.$mHelper.toast('验证码已发送');
				}
			},
			handleSmsCodeTime(time){
				this.verTimer = setInterval(() => {
					if (time === 0) {
						clearInterval(this.timer);
						this.timer = null
					} else {
						this.verTime = time;
						time--;
					}
				}, 1000);
			},
			
			// 点击按钮
			btnFn(){
				if(this.type == 'login') delete this.params.code
				for (let key in this.params) {
					if(!this.validateField(this.params[key],key)) return
				}
				this.btnDisabled = true
				switch (this.type){
					case 'login':
						this.toLogin()
						break;
					case 'reg':
						this.toReg()
						break;
					case 'updPwd':
						this.toUpPwd()
						break;
					default:
					this.btnDisabled = false
						break;
				}
			},
			
			// 注册
			async toReg(){
				try{
					let r = await this.$http.post(register, this.params)
					this.$mHelper.toast(r.message);
					setTimeout(()=> {
						this.btnDisabled = false
						this.swichType('login',this.params)
					},1000)
				}catch(e){
					this.btnDisabled = false
				}
				
			},
			
			// 登录
			async toLogin(){
				try{
					let r = await this.$http.post(login, this.params)
					this.$mHelper.toast('恭喜您，登录成功！');
					this.$mStore.commit('login', r.data);
					setTimeout(() => {
						this.btnDisabled = false
						const backToPage = uni.getStorageSync('backToPage');
						uni.removeStorageSync('backToPage');
						if (backToPage) {
							if (
								backToPage.indexOf('/pages/profile/index') !== -1 ||
								backToPage.indexOf('/ages/maillList/maillList') !== -1 ||
								backToPage.indexOf('/pages/notify/notify') !== -1 ||
								backToPage.indexOf('/pages/index/index') !== -1
							) {
								this.$mRouter.reLaunch(JSON.parse(backToPage));
							} else {
								this.$mRouter.redirectTo(JSON.parse(backToPage));
							}
						} else {
							this.$mRouter.reLaunch({ route: '/pages/profile/index' });
						}
					},1000)
				}catch(e){
					this.btnDisabled = false
				}
			},
			
			// 修改密码
			async toUpPwd(){
				this.btnDisabled = true
				try{
					let r = await this.$http.post(forget_login_password, this.params)
					this.$mHelper.toast(r.message);
					setTimeout(()=> {
						this.btnDisabled = false
						this.navBack()
					},1000)
				}catch(e){
					this.btnDisabled = false
				}
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
	.uni-head{
		height: 88upx;
		width: 100%;
		.fixed{
			height: 88upx;
			position: fixed;
			top: 0;
			left: 0;
			.l{
				height: 100%;
				align-items: center;
				padding-left: 43upx;
				.iconzuo{
					font-size: 32upx;
				}
			}
		}
	}
	.main{
		padding: 0 50upx;
		.title{
			font-size: 60upx;
			font-family: Source Han Sans CN;
			font-weight: 500;
			color: #000000;
			line-height: 88upx;
			margin: 69upx 0;
		}
		.container{
			.cell{
				.name{
					font-size: 22upx;
					font-family: Source Han Sans CN;
					font-weight: 400;
					color: #000000;
					margin: 40upx 0 10upx 0;
					
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
						&.code{
							font-size: 30upx;
							background: none ;
							border: none;
							padding: 0 ;
							margin: 0 ;
							line-height: initial ;
							width: auto;
							font-weight: normal;
							height: auto ;
							border-radius: 0;
							height: auto;
							width: auto;
							&::after{
								border: none;
							}
							&:focus{
								outline:none;
							}
						}
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