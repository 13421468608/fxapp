<template>
	<view class="userinfo">
		<!--头像 + 背景-->
		<view class="user-section" :class="'bg-' + themeColor.name">
			<image class="bg" :src="userBg"></image>
			<!--#ifdef H5-->
			<!--h5直接上传头像-->
			<view class="portrait-box" @tap="uploadImage">
				<image
					class="portrait"
					:src="!(!profileInfo.avatar || profileInfo.avatar=='default_avatar.jpg')? profileInfo.avatar : headImg"
				></image>
			</view>
			<!-- #endif -->
			<!--#ifndef H5-->
			<!--非h5裁剪头像上传-->
			<view class="portrait-box">
				<avatar
					canRotate="false"
					selWidth="200px"
					selHeight="400upx"
					@upload="handleUploadFile"
					:avatarSrc="!(!profileInfo.avatar || profileInfo.avatar=='default_avatar.jpg') ? profileInfo.avatar : headImg"
					avatarStyle="width: 200upx; height: 200upx; border-radius: 100%; border: 6upx solid #fff;"
				>
				</avatar>
			</view>
			<!-- #endif -->
		</view>
		<view class="input-content">
			
			<view class="input-item">
				<text class="tit">昵　称</text>
				<input
					type="text"
					v-model="profileInfo.nick_name"
					placeholder="请输入您的昵称"
					maxlength="20"
				/>
			</view>
			<view class="input-item">
				<text class="tit">用户ID</text>
				<input
					type="text"
					v-model="profileInfo.uid"
					placeholder="请输入您的用户ID"
					maxlength="20"
				/>
			</view>
			<view class="input-item">
				<text class="tit">手机号</text>
				<input
					type="number"
					v-model="profileInfo.phone"
					disabled
					placeholder="请输入手机号码"
				/>
			</view>
			<view class="input-item">
				<text class="tit">性　别</text>
				<radio-group @change="handleGenderChange">
					<label
						class="gender-item"
						v-for="(item, index) in genders"
						:key="index"
					>
						<radio
							class="gender-item-radio"
							height='40upx'
							width='40upx'
							:color="themeColor.color"
							:value="item.value"
							:checked="item.value == profileInfo.sex"
						/>
						<text class="gender-item-text">{{ item.name }}</text>
					</label>
				</radio-group>
			</view>
			<button
				class="confirm-btn"
				:class="'bg-' + themeColor.name"
				:disabled="btnLoading"
				:loading="btnLoading"
				@tap="toUpdateInfo"
			>
				修改资料
			</button>
		</view>

		<!--加载动画-->
		<rfLoading isFullScreen :active="loading"></rfLoading>

		<!--进度条加载-->
		<rf-load-progress
			:height="CustomBar"
			:progress="loadProgress"
		></rf-load-progress>
	</view>
</template>

<script>
import { userInfoApi,userUpdateInfo, uploadImage } from '@/api/userInfo';
import avatar from '@/components/rf-avatar/rf-avatar';
import moment from '@/common/moment';

export default {
	components: { avatar },
	data() {
		return {
			loadProgress: 0,
			CustomBar: this.CustomBar,
			profileInfo: {},
			genders: [
				{
					value: '1',
					name: '男'
				},
				{
					value: '2',
					name: '女'
				}
			],
			date: moment().format('YYYY-MM-DD'),
			token: null,
			loading: true,
			headImg: this.$mAssetsPath.headImg,
			userBg: this.$mAssetsPath.userBg,
			btnLoading: false
		};
	},
	onLoad() {
		this.initData();
	},
	methods: {
		// 上传头像
		uploadImage() {
			// 从相册选择图片
			const _this = this;
			uni.chooseImage({
				count: 1,
				sizeType: ['original', 'compressed'],
				sourceType: ['album'],
				success: function(res) {
					_this.handleUploadFile(res.tempFilePaths);
				}
			});
		},
		// 上传头像
		handleUploadFile(data) {
			const _this = this;
			const filePath = data.path || data[0];
			_this.$http
				.upload(uploadImage, {
					filePath,
					name: 'file'
				})
				.then(r => {
					_this.profileInfo.head_portrait = r.data.url;
					_this.handleUpdateInfo(_this.profileInfo);
				});
		},
		// 监听日期更改
		bindDateChange(e) {
			this.date = e.target.value;
		},
		// 监听性别更改
		handleGenderChange(e) {
			console.log(e)
			this.profileInfo.sex = e.detail.value;
		},
		// 数据初始化
		initData() {
			this.token = uni.getStorageSync('accessToken') || undefined;
			this.getMemberInfo();
		},
		// 获取用户信息
		async getMemberInfo() {
			await this.$http
				.get(userInfoApi)
				.then(r => {
					this.loading = false;
					this.profileInfo = r.data;
					console.log(this.profileInfo)
				})
				.catch(() => {
					this.loading = false;
				});
		},
		// 更新用户信息
		async toUpdateInfo() {
			this.handleUpdateInfo();
		},
		// 更新用户信息
		async handleUpdateInfo() {
			this.btnLoading = true;
			await this.$http
				.post(`${userUpdateInfo}`, {
					// ...this.profileInfo,
					nick_name: this.profileInfo.nick_name,
					sex: Number(this.profileInfo.sex),
					uid: this.profileInfo.uid,
					signature: this.profileInfo.signature
				})
				.then(() => {
					this.$mHelper.toast('恭喜您, 资料修改成功!');
					setTimeout(() => {
						this.$mRouter.back();
					}, 1 * 1000);
				})
				.catch(() => {
					this.btnLoading = false;
				});
		}
	}
};
</script>

<style lang="scss" scoped>
page {
	background-color: $color-white;
}

.userinfo {
	.user-section {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 320upx;
		padding: 40upx 30upx 0;
		overflow: hidden;
		position: relative;
		.bg {
			position: absolute;
			left: 0;
			top: 0;
			width: 100vw;
			opacity: 0.84;
		}

		.portrait-box {
			clear: both;
			z-index: 2;
		}

		.portrait {
			position: relative;
			width: 200upx;
			height: 200upx;
			border-radius: 50%;
			border: 6upx solid #fff;
		}

		.yticon {
			position: absolute;
			// line-height: 1;
			font-size: 48upx;
			color: #fff;
			padding: 4upx 6upx;
			border-radius: 6upx;
			background: rgba(0, 0, 0, 0.4);
		}

		.pt-upload-btn {
			right: 0;
			bottom: 10upx;
		}

		.bg-upload-btn {
			right: 20upx;
			bottom: 16upx;
		}
	}

	.input-content {
		padding: 40upx 60upx;

		.input-item {
			display: flex;
			padding: 0 30upx;
			background: $page-color-light;
			height: 80upx;
			line-height: 80upx;
			border-radius: 4px;
			margin-bottom: 30upx;

			&:last-child {
				margin-bottom: 0;
			}

			.tit {
				width: 100upx;
				font-size: $font-sm + 2upx;
				color: $font-color-base;
			}

			input {
				width: calc(100% - 100upx);
				height: 80upx;
				line-height: 80upx;
				font-size: $font-base + 2upx;
				color: $font-color-dark;
			}

			.date {
				height: 80upx;
				line-height: 80upx;
				font-size: $font-base + 2upx;
				color: $font-color-dark;
			}

			.gender-item {
				margin-right: 20upx;

				.gender-item-text {
					padding-left: 10upx;
				}

				radio .wx-radio-input.wx-radio-input-checked {
					background: $uni-color-primary;
					border-color: $uni-color-primary;
				}
				
				
			}
		}
	}
}
.confirm-btn{
	width: 100%;
}
</style>
