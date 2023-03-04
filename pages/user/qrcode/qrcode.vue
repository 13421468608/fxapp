<template>
	<view class="page">
		<view class="qrcode flex column">
			<view class="head flex column center">
				<image :src="(userInfo.avatar || userInfo.avatar == 'default_avatar.jpg') ? headImg : userInfo.avatar " mode=""></image>
				<text>{{userInfo.nick_name}}</text>
			</view>
			<img class="qr-image" :src="qrcode" mode=""></image>
			<text class="desc">扫描二维码商城添加好友</text>
		</view>
		<view class="btns">
			<button class="confirm-btn" @tap="saveImg">保存至相册</button>
		</view>
	</view>
</template>

<script>
	// 实名认证
	export default {
		data() {
			return {
				headImg: this.$mAssetsPath.headImg,
				userInfo: {},
				qrcode: null
			}
		},
		async onLoad() {
			// 初始化数据
			this.userInfo = uni.getStorageSync('userInfo')
			console.log(this.userInfo)
			this.qrcode = 'data:image/png;base64,'+ this.userInfo.qr_code
		},
		methods: {
			saveImg(){
				uni.saveImageToPhotosAlbum({
					filePath: this.qrcode,
					success: function() {
						this.$mHelper.toast('已经保存至相册');
					},
					fail: function() {
						this.$mHelper.toast('保存失败，请返回后重试');
					}
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
	background: linear-gradient(0deg, #FFD76A, #FFA800);
	box-sizing: border-box;
	padding-top: 142upx;
	.qrcode{
		width: 640upx;
		height: 640upx;
		border-radius: 24upx;
		background-color: #fff;
		margin:  0 auto 80upx auto;
		justify-content: flex-start;
		.head{
			margin: -74upx auto 0 auto;
			image{
				margin: 0 auto;
				height: 148upx;
				width: 148upx;
			}
			text{
				display: block;
				text-align: center;
				font-size: 36upx;
				font-family: Source Han Sans CN;
				font-weight: 400;
				color: #000000;
				margin-top: 16upx;
			}
		}	
		.qr-image{
			height: 335upx;
			width: 335upx;
			margin: 40upx auto;
		}
		.desc{
			display: block;
			text-align: center;
			font-size: 24upx;
			font-family: Source Han Sans CN;
			font-weight: 400;
			color: #7F7F7F;
		}
	}
	.btns{
		width: 100%;
		height: auto;
		margin-top: 80upx;
		.confirm-btn{
			width: 690upx;
			height: 90upx;
			background: rgba(255, 168, 0, 1);
			border-radius: 4upx;
			font-size: 30upx;
			font-family: Source Han Sans CN;
			font-weight: 500;
			color: rgba(0, 0, 0, 1);
			text-align: center;
			line-height: 90upx;
		}
	}
}
</style>
