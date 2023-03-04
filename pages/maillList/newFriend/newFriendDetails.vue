<template>
	<view class="friend">
		<view class="info space border-x-t">
			<image :src="$imgBase+friendInfo.avatar" mode=""></image>
			<view class="info-text">
				<view>{{friendInfo.nick_name}}</view>
				<view class="desc">ID：{{friendInfo.ID}}</view>
			</view>
		</view>
		<view class="source space">
			<text>签名</text>
			<text>{{friendInfo.signature || 'TA 什么都没写～'}}</text>
		</view>
		<block v-if="type === 'agree'">
			<view class="source space mb20">
				<text>来源</text>
				<text>{{friendInfo.source_info}}</text>
			</view>
			<view class="introduce space">
				<text>{{friendInfo.nick_name}}：{{friendInfo.remark}}</text>
			</view>
		</block>
		<block v-else>
			<view class="add-box">
				<view class="add-title">发送添加好友申请：</view>
				<textarea v-model="remark" maxlength="100"></textarea>
			</view>
		</block>
		<view class="btns">
			<button
				v-if="type ==='agree'"
				class="cancel-btn refuse"
				:disabled="cancelBtnLoading"
				:loading="cancelBtnLoading"
				@tap="cancelBtn"
			>
				拒绝
			</button>
			<button
				class="confirm-btn add"
				:disabled="confirmbtnLoading"
				:loading="confirmbtnLoading"
				@tap="confirmBtn"
			>
				{{type ==='add' ? '发送' : '同意'}}
			</button>
		</view>
		
		<!--加载动画-->
		<rfLoading isFullScreen :active="loading"></rfLoading>
	</view>
</template>
<script>
import rfLoadMore from '@/components/rf-load-more/rf-load-more';
import moment from '@/common/moment';

import { apiUserFind,apiUserFriend,apiFriendAdd,apiFriendVer,apiFriendwAllReq } from '@/api/maillList.js';
export default {
	components: { rfLoadMore },
	data() {
		return {
			option: {},
			loading: true,
			confirmbtnLoading: false,
			cancelBtnLoading:false,
			source: null, // 1手机号 2id 3扫描二维码 4群聊
			key: '',		// 搜索信息''
			type: 'add', 		// agree 同意添加账者   add 添加别人
			userInfo: {},
			remark: '你好，我是',
			friendInfo: {},
		};
	},
	filters: {
		time(val) {
			return moment(val * 1000).format('YYYY-MM-DD HH:mm:ss');
		}
	},
	onLoad(option) {
		this.option = option || {}
		this.key = option.key
		this.type = option.type || 'add'
		
	},
	onShow() {
		this.initData();
	},
	methods: {
		// 数据初始化
		initData() {
			this.userInfo = uni.getStorageSync('userInfo')
			if(this.type === 'add'){
				this.remark = '你好，我是'+this.userInfo.nick_name
				if(this.option.form === 'chat'){
					// 通过用户id查询
					this.searchIdChange()
				}else{
					// 通过手机号/uid查询
					this.searchChange()
				}
				
			}else{
				this.getFriendwAllReq()
			}
			
		},
		// 搜索用户
		async getFriendwAllReq() {
			this.loading = false;
			await this.$http
				.post(`${apiFriendwAllReq}`, {
					page:1,
					size: 100,
				})
				.then((r) => {
					this.loading = false;
					let arr = r.data.items
					for (let i = 0; i < arr.length; i++) {
						if(arr[i].ID == this.key){
							console.log(this.friendInfo);
							this.friendInfo = arr[i]
							return
						}
					}
				}).catch(() => {
					this.loading = false;
				});
		},
		// 通过手机号/uid搜索用户
		async searchChange() {
			this.loading = false;
			await this.$http
				.get(`${apiUserFind}`, { search: String(this.key)})
				.then((r) => {
					this.loading = false;
					this.friendInfo = r.data
				}).catch(() => {
					this.loading = false;
				});
		},
		// 通过用户id搜索用户
		async searchIdChange() {
			this.loading = false;
			await this.$http
				.get(`${apiUserFriend}${this.key}`)
				.then((r) => {
					this.loading = false;
					this.friendInfo = r.data
				}).catch(() => {
					this.loading = false;
				});
		},
		
		cancelBtn(){
			this.verFriend(false)
		},
		confirmBtn(){
			if(this.type === 'add'){
				this.addFriend()
			}else{
				this.verFriend(true)
			}
		},
		// 同意添加好友
		async verFriend(status) {
			this.cancelBtnLoading = true;
			await this.$http
				.get(`${apiFriendVer}`, {
					id: this.key,
					agree: status,
				}).then((r) => {
					this.cancelBtnLoading = false;
					this.$mHelper.toast(`已${status ? '同意添加好友' : '拒绝'}`);
					this.$mRouter.back();
				}).catch(() => {
					this.cancelBtnLoading = false;
				});
		},
		
		// 申请添加好友
		async addFriend() {
			this.confirmBtnLoading = true;
			let req = {
				"to_user_id": this.friendInfo.ID,
				"chat_group_id": Number(this.option.chatId || this.friendInfo.source),
				"source": this.option.form === 'chat' ? 4 : this.friendInfo.source,
				"remark": this.remark
			}
			await this.$http
				.post(`${apiFriendAdd}`, req)
				.then((r) => {
					this.confirmBtnLoading = false;
					this.$mHelper.toast('添加信息已发送');
					this.$mRouter.back();
				}).catch(() => {
					this.confirmBtnLoading = false;
				});
		},
		// 通用跳转
		navToLogin(route) {
			this.$mRouter.push({ route });
		}
	}
};
</script>
<style lang="scss">
page {
	background-color: $page-color-base;
}
.space{
	padding: 30upx;
	box-sizing: border-box;
	background-color: #fff;
}
.mb20{
	margin-bottom: 20upx;
}
.friend {
	.info{
		height: 110upx;
		display: flex;
		align-items: center;
		background-color: #fff;
		image{
			height: 78upx;
			width: 78upx;
		}
		.info-text{
			font-size: 30upx;
			font-family: Source Han Sans CN;
			font-weight: 400;
			color: #171716;
			line-height: 36upx;
			padding-left: 20upx;
			.desc{
				font-size: 24upx;
				color: #A6A6A6;
			}
		}
	}
	.add-box{
		padding: 0 30upx;
		box-sizing: border-box;
		
		.add-title{
			font-size: 30upx;
			font-family: Source Han Sans CN;
			font-weight: 400;
			color: #000000;
			line-height: 88upx;
		}
		textarea{
			background-color: #fff;
			width: 100%;
			padding: 30upx;
			box-sizing: border-box;
			border-radius: 10upx;
		}
		
	}
	.introduce{
		height: auto;
		font-size: 24upx;
		font-family: Source Han Sans CN;
		font-weight: 400;
		color: #808080;
	}
	.source{
		display: flex;
		justify-content: space-between;
		text{
			font-size: 30upx;
			font-family: Source Han Sans CN;
			font-weight: 400;
			color: #1A1A1A;
			&:last-child{
				color: #808080;
			}
		}
	}
	.btns{
		width: 92%;
		margin: 0 auto;
		padding-top: 40upx;
		display: flex;
		justify-content: center;
		button{
			height: 90upx;
			line-height: 90upx;
			font-size: 30upx;
			font-family: Source Han Sans CN;
			font-weight: 400;
			&.refuse{
				width: 236upx;
				background-color: #fff;
				margin-right: 40upx;
				margin-top:0;
				&::after{
					border: none;
				}
			}
			&.add{
				flex: 1;
				background-color: #FFA800;
				max-width: 100%;
				margin-top:0;
			}
		}
	}
}



</style>
