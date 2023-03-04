<template>
	<view class="address-manage rf-row-wrapper">
		<view class="cells">
		<view class="row b-b">
			<text class="tit">收获地址</text>
			<input
				class="input"
				type="text"
				v-model="addressData.shipping_address"
				placeholder="例:广东省深圳市罗湖区"
				placeholder-class="placeholder"
			/>
		</view>
		<view class="row b-b">
			<text class="tit">门牌号</text>
			<input
				class="input"
				type="text"
				v-model="addressData.house_number"
				placeholder="例:阳光小区8栋8楼808"
				placeholder-class="placeholder"
			/>
		</view>
		<view class="row b-b">
			<text class="tit">联系人</text>
			<input
				class="input"
				type="text"
				v-model="addressData.contact_person"
				@blur="handleRealNameChange"
				placeholder="收货人姓名"
				placeholder-class="placeholder"
			/>
		</view>
		<view class="row b-b">
			<text class="tit">手机号</text>
			<input
				class="input"
				type="number"
				v-model="addressData.phone"
				@blur="handleMobileChange"
				placeholder="收货人手机号码"
				placeholder-class="placeholder"
			/>
		</view>
		
		
		<view class="row default-row">
			<text class="tit">设为默认</text>
			<switch
				:checked="addressData.default ? true : false"
				:color="themeColor.color"
				@change="switchChange"
			/>
		</view>
		</view>
		<button
			class="btn add-btn"
			:disabled="btnLoading"
			:loading="btnLoading"
			@tap="confirm"
		>
			保存
		</button>
		
		<button
			v-if="manageType === 'edit'"
			class="btn del-btn"
			:disabled="delbtnLoading"
			:loading="delbtnLoading"
			@tap="confirm"
		>
			删除
		</button>

		<!--加载动画-->
		<rfLoading isFullScreen :active="loading"></rfLoading>
	</view>
</template>

<script>

import { addressCreate, addressUpd, addressAll,addressDel } from '@/api/userInfo';
export default {
	data() {
		return {
			addressData: {
				shipping_address: '',
				house_number: '',
				contact_person: '',
				phone:'',
				default: false,
			},
			btnLoading: false,
			delbtnLoading: false,
			loading: true,
			manageType: null,
		};
	},
	onLoad(options) {
		this.initData(options);
	},
	methods: {
		
		// 数据初始化
		async initData(options) {
			let title = '新增地址';
			if (options.type === 'edit') {
				title = '编辑地址';
				await this.getAddressList(options.id);
			} else {
				setTimeout(() => {
					this.loading = false;
				}, 1 * 1000);
			}
			this.manageType = options.type;
			uni.setNavigationBarTitle({
				title
			});
		},
		// 获取收货地址列表
		async getAddressList(id) {
			await this.$http
				.post(`${addressAll}`, {
					page: this.page,
					page_size: 1000
				})
				.then(r => {
					this.addressData = r.data.items.find(res => res.ID == id) || {}
					this.loading = false;
				})
				.catch(() => {
					this.loading = false;
					if (type === 'refresh') {
						uni.stopPullDownRefresh();
					}
				});
		},
		handleRealNameChange(e) {
			this.addressData.realname = e.detail.value;
		},
		bindAddressDetailsChange(e) {
			this.addressData.address_details = e.detail.value;
		},
		handleMobileChange(e) {
			this.addressData.mobile = e.detail.value;
		},
		switchChange(e) {
			this.addressData.is_default = e.detail.value;
		},
		// 提交
		confirm() {
			let data = this.addressData;
			if (!data.shipping_address) {
				this.$mHelper.toast('请填写收货地址');
				return;
			}
			if (!data.house_number) {
				this.$mHelper.toast('请填写门牌号');
				return;
			}
			if (!data.contact_person) {
				this.$mHelper.toast('请填写收货人姓名');
				return;
			}
			if (!/^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(data.phone)) {
				this.$mHelper.toast('请输入正确的手机号码');
				return;
			}
			if (this.manageType === 'edit') {
				this.delbtnLoading = true;
				this.handleAddressUpdate(data);
			} else {
				this.btnLoading = true;
				this.handleAddressCreate(data);
			}
		},
		async handleAddressUpdate(data) {
			await this.$http
				.get(`${addressDel}?id=${data.ID}`)
				.then(() => {
					this.delbtnLoading = false;
					this.$mHelper.toast('已删除地址！');
					setTimeout(()=>{
						this.$mRouter.back();
					},1000)
				})
				.catch(() => {
					this.delbtnLoading = false;
				});
		},
		async handleAddressCreate(data) {
			await this.$http
				.post(`${addressCreate}`, data)
				.then(() => {
					this.btnLoading = false;
					this.$mHelper.toast('新增地址成功！');
					setTimeout(()=>{
						this.$mRouter.back();
					},1000)
				})
				.catch(() => {
					this.btnLoading = false;
				});
		}
	}
};
</script>

<style lang="scss">
page {
	background: $page-color-base;
}
.address-manage {
	padding-top: 20upx;
	.cells{
		width: 92%;
		margin: 0 auto;
		border-radius: 16upx;
		overflow: hidden;
	}
}
.default-row{
	margin-top: 0;
}
.btn{
	width: 92%;
	margin: 38upx auto;
	font-size: 30upx;
	font-family: Source Han Sans CN;
	font-weight: 400;
	color: #010101;
	&:after{
		border-color: #FFA800;
	}
	&.add-btn{
		background: #FFA800;
		color: #010101;
	}
	&.del-btn{
		color: #010101;
	}
}
</style>
