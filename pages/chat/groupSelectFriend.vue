<template>
	<view class="notify">
		<view class="rf-search-box">
			<i class='icon-search'></i>
			<input type="text" placeholder="搜索">
		</view>
		<view class="notify-list">
			<view
				class="notify-item ellipsis"
				v-for="item in notifyList"
				:key="item.id">
				<view class="notify-item-l">
					<image src="../../static/tab-my.png" mode=""></image>
				</view>
				<view class="notify-item-r">
					<view class="name ellipsis">
						<text>{{item.name}}</text>
						<text class="time">22:35</text>
					</view>
					<view :class="['msg']">
						<text class="text ellipsis">{{item.msg}}</text>
						<text v-if="item.undisturb" class="icon-undisturb"></text>
					</view>
				</view>
			</view>
		</view>
		<!--消息为空-->
		<rf-empty
			:bottom="bottom"
			info="您还没有推送消息"
			v-if="notifyList.length === 0 && hasLogin"
		></rf-empty>
		<view v-if="!hasLogin" class="notify-empty">
			<text class="iconfont iconxiaoxi-" :class="'text-'+themeColor.name"></text>
			<view class="empty-tips">
				暂未登录
				<view class="navigator" :class="'text-'+themeColor.name" @tap="navToLogin('/pages/public/logintype')"
					>登录/注册 </view
				>
			</view>
		</view>
		
		<view class="popup-notify" v-if="popupNotify">
			<view class="popup-body">
				<view
					v-for="(item,index) in popupList"
					:class="['tag-item' , (index+1) !==popupList.length ?  'border-x-b' : '']" 
					:key="item.class"
					@tap='tagFn(item)'>
					<i :class="['icon',item.class]"></i>
					<text>{{item.name}}</text>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
import rfLoadMore from '@/components/rf-load-more/rf-load-more';
import moment from '@/common/moment';
import mConstDataConfig from '@/config/constData.config';
import { mapMutations } from 'vuex';
export default {
  components: { rfLoadMore },
	data() {
		return {
			popupList: [
				{class:'ql',name: '发起群聊',path:'page/'},
				{class:'tjpy',name: '添加朋友',path:'/pages/maillList/addFriend'},
				{class:'sys',name: '扫一扫',path:'page/'},
			],
			popupNotify: false,
			notifyList: [],
			
			loadingType: 'more',
			page: 1,
			hasLogin: false,
			// 控制滑动效果
			theIndex: null,
			oldIndex: null
		};
	},
	filters: {
		time(val) {
			return moment(val * 1000).format('YYYY-MM-DD HH:mm:ss');
		},
		notifyTypeFilter(val) {
			return mConstDataConfig.notifyTypeList[val].content;
		}
	},
	onShow() {
		this.initData();
	},
	computed: {
		bottom () {
			let bottom = 0;
			/*  #ifdef H5  */
			bottom = 90;
			/*  #endif */
			return bottom;
		}
	},
	// 头部按钮方法
	onNavigationBarButtonTap(e) {
		this.popupNotify = !this.popupNotify
	},
	methods: {
		// 数据初始化
		initData() {
			this.hasLogin = this.$mStore.getters.hasLogin;
			this.page = 1;
			this.notifyList = [
				{name:'满血方法',msg:'是我的存在吗擦拭每次看马上马上；达拉斯看到；拉萨；了没撒的；阿里斯顿；离开了；看',msgNumber: 0,src:''},
				{name:'满血方法',msg:'saxasxc1',msgNumber: 1,undisturb:true,src:''},
				{name:'满血方法',msg:'是我的存在吗擦拭每次看马上马上是我的存在吗擦拭每次看马上马上是我的存在吗擦拭每次看马上马上',msgNumber: 1,undisturb:true,src:''},
			]
			this.letterList = (this.notifyList.reduce((t,v) => [...t,v.key],[]))
		},
		// 通用跳转
		navToLogin(route) {
			this.$mRouter.push({ route });
		},
		
		// tag
		tagFn(item){
			if(item.class === 'sys' ){
				
			}else{
				this.popupNotify = false
				this.navToLogin(item.path)
			}
		}
	}
};
</script>
<style lang="scss">
page {
	background-color: $page-color-base;
}
.notify {
	.notify-list{
		width: 100%;
		padding-top: 20upx;
		.notify-item{
			width: 100%;
			height: auto;
			box-sizing: border-box;
			display: flex;
			align-items: center;
			padding: 0 30upx;
			height: 140upx;
			position: relative;
			overflow: hidden;
			background-color: #fff;
			.notify-item-l{
				display: inherit;
				position: relative;
				flex-shrink: 0;
				image{
					width: 98upx;
					height: 98upx;
					background: #FFA800;
					border-radius: 4px;
				}
				.msg-bag{
					font-style: inherit;
					height: 36upx;
					width: 36upx;
					line-height: 36upx;
					font-size: 24upx;
					font-family: Source Han Sans CN;
					font-weight: 500;
					color: #FFFFFF;
					background-color: #DF0022;
					text-align: center;
					border-radius: 50%;
					position: absolute;
					top: -14upx;
					right: -14upx;
					
					
				}
			}
			.notify-item-r{
				width: 100%;
				padding-left: 24upx;
				box-sizing: border-box;
				overflow: hidden;
				&::before{
					position: absolute;
					left: 150upx;
					bottom: 0;
					z-index: 1;
					content: '';
					width: 100%;
					height: 1px;
					background-color: #eee;
					-webkit-transform: scaleY(0.5);
					transform: scaleY(0.5);
				}
				.name{
					font-size: 30upx;
					font-family: Source Han Sans CN;
					font-weight: 400;
					color: #171716;
					display: flex;
					justify-content: space-between;
					align-items: center;
					.time{
						font-size: 24upx;
						font-family: Source Han Sans CN;
						font-weight: 400;
						color: #B4B4B4;
					}
				}
				.msg{
					display: block;
					width: 100%;
					margin-top: 4upx;
					display: flex;
					align-items: center;
					justify-content: space-between;
					overflow: hidden;
					.text{
						font-size: 24upx;
						font-family: Source Han Sans CN;
						font-weight: 400;
						color: #B4B4B4;
					}
					.icon-undisturb{
						flex-shrink: 0;
						margin-left: 40upx;
						height: 24upx;
						width: 24upx;
						background: url('../../static/top.png') no-repeat;
						background-size: 100%;
					}
					
				}
			}
		
			
		}
	}
	.notify-empty {
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
	width: 92vw;
	height: 70upx;
	background-color: #fff;
	border-radius: 4upx;
	margin: 20upx auto;
	display: flex;
	align-items: center;
	justify-content: center;
	.icon-search{
		height: 30upx;
		width: 31upx;
		background: url('@/static/image/maillList/icon_search.png') no-repeat;
		background-size: 100%;
		// margin-right: 5px;
	}
	text{
		font-size: 28upx;
		font-family: Source Han Sans CN;
		font-weight: 400;
		color: #B4B4B4;
		line-height: 36px;
		margin-left: 12upx;
	}
}
.popup-notify{
	position: fixed;
	top: 92upx;
	right: 30upx;
	z-index: 99;
	.popup-body{
		width: 258upx;
		height: 316upx;
		background: url('@/static/image/notify/more_bg.png') no-repeat;
		background-size: 100%;
		padding-top: 16upx;
		.tag-item{
			height: 100upx;
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0 24upx;
			&.border-x-b::after{
				left: 94upx;
			}
			i{
				display: inline-block;
				height: 40upx;
				width: 40upx;
				background-repeat: no-repeat;
				background-size: 100%;
				margin-right: 22upx;
				&.ql{
					background-image: url('@/static/image/notify/icon_ql.png'),
				}
				&.sys{
					background-image: url('@/static/image/notify/icon_sys.png')
				}
				&.tjpy{
					background-image: url('@/static/image/notify/icon_tjpy.png')
				}
			}
			text{
				flex: 1;
				font-size: 30upx;
				font-family: Source Han Sans CN;
				font-weight: 400;
				color: #FFFFFF;
				line-height: 36upx;
			}
		}
	}
}
</style>
