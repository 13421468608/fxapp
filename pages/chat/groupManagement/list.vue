<template>
	<view class="maill">
		<view class="rf-search-box">
			<i class='icon-search'></i>
			<input v-model="searchTxt" placeholder="搜索"></text>
		</view>
		<view class="people-list">
			<block v-if="isMany">
				<view
					class="people-item"
					v-for="item in chatList"
					:key="item.id"
					@tap="item.check = !item.check">
					<i v-if="isMany" :class="['icon-radio',item.check ? 'on' : '']"></i>
					<image :src="$imgBase + item.avatar" mode=""></image>
					<view class="people-name">{{item.nick_name}}</view>
				</view>
			</block>
			<block v-else>
				<view
					class="people-item flex between"
					v-for="(item,index) in chatList"
					:key="item.id"
					@tap="itemChange(item)">
					<view class="flex middle">
						<image :src="$imgBase + item.avatar" mode=""></image>
						<view class="people-name">{{item.nick_name}}</view>
					</view>
					<switch
						v-if="type === 'no'"
						:color="themeColor.color"
						:checked="item.ban_receiving_vouchers"
						@change.stop="switchChange($event,item,index)"
					/>
					<!-- style="transform:scale(0.7)" -->
				</view>
			</block>
		</view>
		
		<view class="fixed-btns" v-if="isMany">
			<button :loading="btnLoad" :disabled="btnLoad" class="confirm-btn" @tap="confirmBtn">
				确定
				<!-- {{choiceNumber === 1 ? '' : '('+selcetNumber+')'}} -->
			</button>
		</view>
		
		<!--页面加载动画-->
		<rfLoading isFullScreen :active="loading"></rfLoading>
	</view>
</template>
<script>
import rfLoadMore from '@/components/rf-load-more/rf-load-more';
import moment from '@/common/moment';


import {
	apiGroupChatAllMembers,
	apiGroupChatAdministratorAdd,
	apiGroupChatAdministratorDel,
	apiGroupChatBanReceivingVouchersAdd,
	apiGroupChatBanReceivingVouchersDel,
	apiGroupChatDeleteMember,
	apiGroupChatTransferGroupOwner,
	} from '@/api/maillList.js';
export default {
	components: { rfLoadMore }, 
	// 下拉刷新
	onPullDownRefresh() {
		this.getFriendwAll('refresh');
	},
	data() {
		return {
			chatId: null,
			type: null, 		// add新增群管理员 del删除群管理员 transfer转移新群主 no禁止代金券领取
			typeToTitle: {
				add: '添加群管理员',
				del: '移除群管理员',
				transfer: '选择新群主',
				no: '禁止领取代金券',
			},
			searchTxt: null,	//搜索值
			searchTimer: null,	
			swichTimer: null,
			chatList: [],
			loading: false,
			btnLoad: false, 
			hasLogin: false,
			
		};
	},
	onLoad(option){
		this.chatId = option.chatId
		this.type = option.type
		this.isMany = ['add','del'].includes(this.type)
		uni.setNavigationBarTitle({ title: this.typeToTitle[this.type] })
	},
	onShow() {
		this.initData();
	},
	watch: {
		searchTxt(val){
			if(this.searchTimer) clearTimeout(this.searchTimer)
			this.searchTimer = setTimeout(()=>{
				this.searchTxtToArr(val)
			},300)
		}
	},
	
	methods: {
		// 数据初始化
		initData() {
			this.hasLogin = this.$mStore.getters.hasLogin
			this.getFriendwAll()
		},
		// 获取所有数据
		async getFriendwAll(){
			try{
				let r = await this.$http.get(apiGroupChatAllMembers,{
					id: this.chatId,
					ban_receiving_vouchers: false,
					administrator: this.type==='del'
				})
				r.data = r.data.filter(res => res.identity !== 1)
				this.chatList = (this.isMany ? r.data.reduce((t,v) => [...t,{...v,check:false}],[]) :  r.data)
			}catch(e){
				this.btnDisabled = false
			}
		},
		
		// 搜索值转换
		searchTxtToArr(txt){
			if(txt){
				this.searchList = this.sourceList.filter(res => res.nick_name.includes(txt))
			}else{
				this.searchList = []
			}
		},
		// 单选选中
		itemChange(item){
			if(this.type === 'transfer'){
				let _this = this
				uni.showModal({
					content: `确认选择${item.nick_name}为新群主，你将自动放弃群主身份。`,
					success: confirmRes => {
						if (confirmRes.confirm) {
							_this.transferGroupOwner(item)
						}
					}
				});
			}
		},
		// 转让群主
		async transferGroupOwner(item){
			this.loading = true
			try{
				let r = await this.$http.get(apiGroupChatTransferGroupOwner, {
					id:this.chatId,
					member_id: item.user_id
				})
				this.$mHelper.toast('转让群主成功');
				setTimeout(()=>{
					this.$mRouter.back()
				},1000)
				this.loading = false
			}catch(e){
				this.$mHelper.toast(e);
				this.loading = false
			}
		},
		// 确认 
		async confirmBtn(){
			let req = this.chatList.reduce((t,v)=> v.check ? [...t,v.user_id] : t,[] )
			if(!req.length) {
				this.$mHelper.toast('请选择群友');
				return 
			}
			this.btnLoad = true
			try{
				// 删除或者新增
				let r = await this.$http.post(this.type ==='add' ? apiGroupChatAdministratorAdd : apiGroupChatAdministratorDel, {
					id: this.chatId,
					member_id: req.join(',')
				})
				this.$mHelper.toast(`${this.typeToTitle[this.type]}成功`);
				setTimeout(()=>{
					this.$mRouter.back()
				},1000)
				this.btnLoad = false
			}catch(e){
				this.$mHelper.toast(e);
				this.btnLoad = false
			}
		},
		
		// 是否获取禁止领取代金券
		switchChange(e,item,index){
			if(this.swichTimer) clearTimeout(this.swichTimer)
			this.swichTimer =  setTimeout(()=>{
				this.chatList[index].ban_receiving_vouchers = e.detail.value
				this.receivingVouchers(e.detail.value,{
					id: this.chatId,
					member_id: item.user_id
				})
			},500)
		},
		// ReceivingVouchers
		async receivingVouchers(status,req){
			// 删除或者新增
			try{
				let r = await this.$http.get((status ? apiGroupChatBanReceivingVouchersAdd : apiGroupChatBanReceivingVouchersDel), req)
				this.$mHelper.toast(`已${status?'禁止' : '开启'}领取代金券`);
			}catch(e){
				this.$mHelper.toast(e);
				this.btnLoad = false
			}
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
.fixed-btns{
	position: fixed;
	bottom: 0;
	width: 100%;
	button{
		height: 90upx;
		line-height: 90upx;
		width: 100%;
		background-color: #FFA800;
	}
}
.maill {
	.maill-list{
		width: 92%;
		margin: 20upx auto;
		.maill-item{
			width: 100%;
			height: auto;
			.maill-item-letter{
				font-size: 28upx;
				font-family: Source Han Sans CN;
				font-weight: 400;
				color: #808080;
				padding: 10upx 0;
			}
			.people-list{
				
				margin-left: -4vw;
			}
		}
	}
	.people-list{
		background-color: #fff;
		width: 100vw;
		.people-item{
			display: flex;
			align-items: center;
			padding: 16upx 40upx 16upx 30upx;
			box-sizing: border-box;
			position: relative;
			overflow: hidden;
			&::before{
				position: absolute;
				left: 30upx;
				bottom: 0;
				z-index: 1;
				content: '';
				width: 100%;
				height: 1px;
				background-color: #eee;
				-webkit-transform: scaleY(0.5);
				transform: scaleY(0.5);
			}
			.icon-radio{
				margin-right: 30upx
			}
			image{
				width: 78upx;
				height: 78upx;
				background: #FFA800;
				border-radius: 4px;
			}
			.people-name{
				padding-left: 25upx;
				font-size: 30upx;
				font-family: Source Han Sans CN;
				font-weight: 400;
				color: #000000;
			}
		}
	}
	
	.index-bar{
		position: fixed;
		right: 0upx;
		top: 50%;
		transform: translateY(-50%);
		view{
			padding: 0 12upx;
			font-size: 24upx;
			font-family: Source Han Sans CN;
			font-weight: 500;
			color: #000000;
		}
	}
	.maill-empty {
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100vh;
		padding-bottom: 100upx;
		display: flex;
		justify-content: center;
		flex-direction: column;
		align-items: center;
		background: #fff;
		.iconfont {
			font-size: $font-lg + 100upx;
		}

		.empty-tips {
			display: flex;
			font-size: $font-sm + 2upx;
			color: $font-color-disabled;

			.navigator {
				margin-left: 16upx;
			}
		}
	}
}
.rf-search-box{
	width: 92%;
	height: 70upx;
	background-color: #fff;
	border-radius: 4upx;
	margin: 20upx auto;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 20upx;
	
	.icon-search{
		height: 30upx;
		width: 31upx;
		background: url('@/static/image/maillList/icon_search.png') no-repeat;
		background-size: 100%;
		flex-shrink: 0;
	}
	input{
		flex: 1;
		font-size: 28upx;
		font-family: Source Han Sans CN;
		font-weight: 400;
		
		line-height: 36px;
		margin-left: 12upx;
		&::placeholder{
			color: #B4B4B4;
		}
	}
}
</style>
