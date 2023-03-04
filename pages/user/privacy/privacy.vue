<template>
	<view class="address-manage rf-row-wrapper">
		<view class="cells">
			<view class="row default-row">
				<text class="tit">加我为好友时需要验证</text>
				<switch
					:checked="friendCheck"
					:color="themeColor.color"
					@change="switchChange(0)"
				/>
			</view>
			<text class="desc">可以通过以下方式找到我</text>
			<view class="row default-row">
				<text class="tit">手机号</text>
				<switch
					:checked="phoneCheck"
					:color="themeColor.color"
					@change="switchChange(1)"
				/>
			</view>
			<view class="row default-row">
				<text class="tit">ID</text>
				<switch
					:checked="IdCheck"
					:color="themeColor.color"
					@change="switchChange(2)"
				/>
			</view>
			<text class="desc">关闭后，其他用户将不能通过上述信息找到你</text>
		</view>

		<!--加载动画-->
		<rfLoading isFullScreen :active="loading"></rfLoading>
	</view>
</template>

<script>
/**
 * @des 收货地址列表
 *
 * @author stav stavyan@qq.com
 * @date 2020-03-10 18:00
 * @copyright 2019
 */
import { addressCreate, addressUpdate, addressDetail } from '@/api/userInfo';
import rfPickRegions from '@/components/rf-pick-regions';
export default {
	components: {
		rfPickRegions
	},
	data() {
		return {
			friendCheck: false,
			phoneCheck:false,
			IdCheck: false,
			loading: true
		};
	},
	onLoad(options) {
		this.initData(options);
	},
	methods: {
		// 数据初始化
		initData(options) {
			this.loading = false
			// uni.setNavigationBarTitle({
			// 	title
			// });
		},
		switchChange(type) {
			let typeName = ['friendCheck','phoneCheck','IdCheck']
			this[typeName[type]] = !this[typeName[type]]
		}
	}
};
</script>

<style lang="scss">
page {
	background: $page-color-base;
}
.address-manage {
	.cells{
		overflow: hidden;
	}
}
.desc{
	font-size: 28upx;
	font-family: Source Han Sans CN;
	font-weight: 400;
	color: #7F7F7F;
	line-height: 88upx;
	padding-left: 32upx;
}
.default-row{
	margin-top: 0;
}
</style>
