<template>
	<view class="page">
		<text class="desc">请绑定持卡人本人的银行卡</text>
		<view class="cell-group">
			<block v-if="step === 1">
				<view class="cell border-x-b">
					<view class="cell_l">
						持卡人
					</view>
					<view class="cell_m">
						<input type="text" v-model="cardInfo.name" maxlength="10" placeholder="请输入持卡人姓名">
					</view>
					<view class="cell_r"></view>
				</view>
				<view class="cell border-x-b">
					<view class="cell_l">
						银行名称
					</view>
					<view class="cell_m">
						<input type="text" v-model="cardInfo.bank_name" maxlength="10" placeholder="请输入持卡人姓名">
					</view>
					<view class="cell_r"></view>
				</view>
				<view class="cell">
					<view class="cell_l">
						卡号
					</view>
					<view class="cell_m">
						<input type="number" v-model="cardInfo.card_number" placeholder="请输入银行卡号(无需空格)">
					</view>
					<view class="cell_r"></view>
				</view>
			</block>
			<block v-else-if="step === 2">
				<view class="cell border-x-b">
					<view class="cell_l">
						手机号
					</view>
					<view class="cell_m">
						<input type="text" v-model="phoneInfo.phone" maxlength="11" placeholder="请输入手机号">
					</view>
					<view class="cell_r"></view>
				</view>
				<view class="cell">
					<view class="cell_l">验证码</view>
					<view class="cell_m">
						<input type="number" v-model="phoneInfo.code" maxlength="6" placeholder="请输入短信验证码">
					</view>
					<view class="cell_r">
						<button class="shrink code" :disabled="!!verTimer" @tap.stop='getCode'>
							{{verTimer ? `重新发送 (${verTime}s)`:"获取验证码"}}
						</button>
					</view>
				</view>
			</block>
		</view>
		<view class="btns">
			<button @click='nextBtn'>{{step === 2 ? '完成' : '下一步'}}</button>
		</view>
	</view>
</template>

<script>
	//添加银行卡
	
	import { bankCreate, } from '@/api/userInfo';
	import { get_code } from '@/api/login';
	export default {
		async onShow() {
			// 初始化数据
			await this.initData();
		},
		// 数据初始化
		
		data() {
			return {
				step: 1, // step 1=> 卡号 2=> 手机号,
				codeStatus: true, // 验证码状态 true 未发送 60-0发送中 false超时二次发送
				verTime: 60, 		// 验证码倒计时
				verTimer: null, 	// 定时器
				phoneInfo:{
					phone: '17700560722',
					code:'999999'
				},
				cardInfo: {
					name:'黎悠文',
					bank_name: '招商银行',
					card_number: 6225767565976370
				}
			}
		},
		methods: {
			async initData() {
				this.hasLogin = this.$mStore.getters.hasLogin;
				this.loading = false;
			},
			
			// 验证码
			async getCode(){
				let phone = this.phoneInfo.phone
				if(this.validateField(phone,'phone')){
					let req = { phone }
					let r = await this.$http.get(get_code, req)
					this.handleSmsCodeTime(59);
					this.$mHelper.toast('验证码已发送');
				}
			},
			handleSmsCodeTime(time){
				this.verTimer = setInterval(() => {
					if (time === 0) {
						clearInterval(this.verTimer);
						this.verTimer = null
					} else {
						this.verTime = time;
						time--;
					}
				}, 1000);
			},
			
			// 校验输入值
			validateField(value, key){
				let nameKeys = {
					phone: '手机号',		
					code: '验证码',	
					name: '持卡人',
					bank_name: '银行名称',
					card_number: '卡号'
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
					case 'name':
						status = (value.length >= 2)
						break;
					case 'bank_name':
						status = (value.length >= 2)
						break;
					case 'card_number':
						status = /^([1-9]{1})(\d{15}|\d{18}|\d{19})$/.test(value)
						break;
					default:
						break;
				}
				if(!status){
					this.$mHelper.toast(`${nameKeys[key]}错误，请重新填写`)
				}
				return status
			},
			
			nextBtn(){
				if(this.step === 1){
					for (let key in this.cardInfo) {
						if(!this.validateField(this.cardInfo[key],key)) return
					}
					this.step = 2
				}else{
					for (let key in this.phoneInfo) {
						if(!this.validateField(this.phoneInfo[key],key)) return
					}
					this.confirmBtn()
				}
			},
			async confirmBtn(){
				// ,...this.phoneInfo
				let req = {...this.cardInfo ,...this.phoneInfo}
				req.card_number = String(req.card_number)
				let r =  await this.$http.post(bankCreate, req)
				this.$mHelper.toast('添加银行卡成功');
				this.$mRouter.back();
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
.mb20{
	margin-bottom: 20upx;
}
.cell-group{
	width: 100%;
	height: auto;
	.cell {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #fff;
		height: 112upx;
		padding: 0 32upx;
		box-sizing: border-box;
		&_l{
			width: 150upx; 	
			font-size: 30upx;
			font-family: Source Han Sans CN;
			font-weight: 400;
			color: #1A1A1A;
			line-height: 88upx;
			flex-shrink: 0;
		}
		&_m{
			flex: 1;
			font-size: 30upx;
			font-family: Source Han Sans CN;
			font-weight: 400;
			color: #1A1A1A;
			&::placeholder{
				font-weight: 310;
				color: #BFBFBF;
			}
		}
		&_r{
			width: auto;
			flex-shrink: 0;
			.code{
				color: #FFA800;
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
	}
}
.page{
	min-height: 100vh;
	background: #f2f2f2;
	box-sizing: border-box;
	.desc{
		font-size: 24upx;
		font-family: Source Han Sans CN;
		font-weight: 400;
		color: #808080;
		line-height: 88upx;
		padding-left: 30upx;
	}
	.btns{
		width: 100%;
		height: auto;
		margin-top: 90upx;
		button{
			width: 92%;
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

