<template>
	<view class="address-list">
		<view class="rf-list" v-if="addressList.length > 0">
			<view
				class="rf-list-item"
				v-for="(item, index) in addressList"
				:key="index"
				@tap="checkAddress(item)"
			>
				<view
					class="item-top border-x-b"
					@longtap="deleteAddress(item.ID)"
				>
					<view class="address-box">
						<!-- <text v-if="parseInt(item.is_default, 10) === 1" class="tag" :class="'text-' + themeColor.name"
							>默认</text
						> -->
						<text class="name">{{ item.contact_person }} </text>
						<text class="mobile">{{ item.phone }}</text>
					</view>
					<view class="u-box">
						<text class="address">{{ item.shipping_address }} {{ item.house_number }}</text>
					</view>
				</view>
				<view class="item-btm">
					<label :class="['flex','middle',,defaultIndex === index ? 'on' : '']" @tap='defaultChange(index,item)'>
						<i :class="['icon',defaultIndex === index ? 'icon-check' : 'icon-uncheck']"></i>
						<text>默认地址</text>
					</label>
					<view class="iconfont iconbianji" @tap.stop="addAddress('edit', item.ID)">
						<text class="edit">编辑</text>
					</view>
				</view>
			</view>
			<<!-- text v-if="addressList.length > 0" class="tips" :class="'text-' + themeColor.name">
				提示：长按可删除当前收货地址。最多只能存在一个默认地址。
			</text> -->
			<rf-load-more v-if="addressList.length > 0" :status="loadingType" />
		</view>
		<view class="add-btn-wrapper">
			<button class="add-btn" :class="'bg-' + themeColor.name" @tap="addAddress('add')">新增地址</button>
		</view>
		<rf-empty
			:info="`暂无收货地址，请添加地址`"
			v-if="addressList.length === 0 && !loading"
		></rf-empty>
		<!--加载动画-->
		<rfLoading isFullScreen :active="loading"></rfLoading>
	</view>
</template>
<script>
import { addressDel, addressAll,addressUpd } from '@/api/userInfo';
import rfLoadMore from '@/components/rf-load-more/rf-load-more';
export default {
	components: {
		rfLoadMore
	},
	data() {
		return {
			timeOutEvent: 0,
			source: 0,
			page: 1,
			loadingType: 'more',
			addressList: [],
			loading: true,
			defaultIndex: null,
			timer:null,
		};
	},
	// 下拉刷新
	onPullDownRefresh() {
		this.page = 1;
		this.addressList = [];
		this.getAddressList('refresh');
	},
	// 加载更多
	onReachBottom() {
  if (this.loadingType === 'nomore') return;
		this.page++;
		this.getAddressList();
	},
	onLoad(option) {
		this.source = option.source;
	},
	onShow() {
		this.initData();
	},
	methods: {
		// 数据初始化
		initData() {
			this.page = 1;
			this.addressList.length = 0;
			this.getAddressList();
		},
		// 获取收货地址列表
		async getAddressList(type) {
			await this.$http
				.post(`${addressAll}`, {
					page: this.page
				})
				.then(r => {
					this.loading = false;
					if (type === 'refresh') {
						uni.stopPullDownRefresh();
					}
					this.loadingType = r.data.items.length === 10 ? 'more' : 'nomore';
					this.addressList = [...this.addressList, ...r.data.items];
					this.defaultIndex = this.addressList.findIndex(r => r.default)
				})
				.catch(() => {
					this.loading = false;
					if (type === 'refresh') {
						uni.stopPullDownRefresh();
					}
				});
		},
		// 默认点击
		defaultChange(index,item){
			this.defaultIndex = index
			if(this.timer) clearTimeout(this.timer)
			this.timer = setTimeout(()=> {
				this.handleAddressUpdate(item)
			})
		},
		// 修改默认地址
		handleAddressUpdate(data) {
			data.default = true
			this.$http.post(`${addressUpd}?id=${data.ID}`, data)
		},
		deleteAddress(id) {
			uni.showModal({
				content: '确定要删除该收货地址吗',
				success: e => {
					if (e.confirm) {
						this.handleAddressDelete(id);
					}
				}
			});
		},
		// 手释放，如果在500毫秒内就释放，则取消长按事件，此时可以执行onclick应该执行的事件
		goTouchEnd() {
			clearTimeout(this.timeOutEvent);
		},
		// 如果手指有移动，则取消所有事件，此时说明用户只是要移动而不是长按
		goTouchMove() {
			clearTimeout(this.timeOutEvent); // 清除定时器
			this.timeOutEvent = 0;
		},
		// 删除地址
		async handleAddressDelete(id) {
			await this.$http.delete(`${addressDelete}?id=${id}`).then(() => {
				this.page = 1;
				this.addressList.length = 0;
				this.getAddressList();
			});
		},
		
		// 选择地址
		checkAddress(item) {
			if (parseInt(this.source, 10) === 1) {
				// this.$mHelper.prePage()获取上一页实例，在App.vue定义
				this.$mHelper.prePage().addressData = item;
				this.$mRouter.back();
			}
		},
		// 跳转添加地址页面
		addAddress(type, id) {
			this.$mRouter.push({
				route: `/pages/user/address/manage?type=${type}&id=${id}`
			});
		}
	}
};
</script>
<style lang="scss">
page {
	background-color: $page-color-base;
}
i.icon{
	display: inline-block;
	background-size: 100%;
	background-repeat: no-repeat;
	&.icon-check{
		width: 24upx;
		height: 24upx;
		margin-right: 18upx;
		background-image: url('@/static/image/profile/checked.png');
	}
	&.icon-uncheck{
		width: 24upx;
		height: 24upx;
		margin-right: 18upx;
		background-image: url('@/static/image/profile/unchecked.png');
	}
}
.address-list {
	position: relative;
	.rf-list-item{
		flex-direction: column;
		align-items: flex-start;
		padding: 20upx 0;
		margin: 0upx 30upx 20upx 30upx;
		.item-top{
			width: 100%;
			padding: 0 20upx;
			&.border-x-b{
				
			}
			.address-box {
				display: flex;
				align-items: center;
				justify-content: space-between;
				.name, .mobile {
					font-size: 28upx;
					font-family: Source Han Sans CN;
					font-weight: 500;
					color: #000000;
				}
			}
			.u-box {
				font-size: 28upx;
				color: $font-color-light;
				padding: 14upx 0 20upx 0;
				.address{
					font-size: 24upx;
					font-family: Source Han Sans CN;
					font-weight: 400;
					color: #808080;
				}
			}
		}
		.item-btm{
			width: 100%;
			padding: 20upx 20upx 0 20upx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.radio{
				font-size: 24upx;
				font-family: Source Han Sans CN;
				font-weight: 400;
				color: #333333;
				&.on{
					color: #FFA800;
				}
			}
			.edit{
				padding-left: 12upx;
				font-size: 24upx;
				font-family: Source Han Sans CN;
				font-weight: 400;
				color: #333333;
			}
			.on{
				color: #FFA800;
			}
		}
	}
}
</style>
