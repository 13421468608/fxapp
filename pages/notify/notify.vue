<template>
	<view class="notify">
		<view class="rf-search-box">
			<i class='icon-search'></i>
			<text>搜索</text>
		</view>
		<view class="notify-list">
			<view
				v-for="(item,index) in notifyList"
				:key="item.id"
				:class="['notify-item-cnt','ellipsis',item.top ? 'grey' : ''] ">
				<view class="notify-btns">
					<view @tap="groupChatPersonalSite(false,item,index)">取消置顶</view>
					<view @tap="groupChatPersonalSite(true,item,index)">置顶</view>
					<view @tap="chatDeleteModal(item,index)">删除</view>
				</view>
				<view 
					:class="['notify-item',theIndex === index ? 'open' : oldIndex === index ? 'close' : '']"
					@touchstart="touchStart(index, $event)"
					@touchmove="touchMove(index, $event)"
					@touchend="touchEnd(index, $event)"
					@tap="goChat(item)"
					>
					<view class="notify-item-l">
						<image :src="$imgBase+item.avatar" mode=""></image>
						<i v-if="!item.undisturb && item.un_read_count" class='msg-bag'>{{item.un_read_count}}</i>
					</view>
					<view class="notify-item-r">
						<view class="name ellipsis">
							<text>{{item.name}}</text>
							<text class="time">{{item.date}}</text>
						</view>
						<view :class="['msg']">
							<text class="text ellipsis">{{item.last_message}}</text>
							<text v-if="item.undisturb" class="icon-undisturb"></text>
						</view>
					</view>
				</view>
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
	</view>
</template>
<script>
import moment from '@/common/moment';
import { apiChatList,apiChatRead,apiChatDelete,apiPersonalSite } from '@/api/chat.js';
import { apiGroupChatPersonalSite } from '@/api/maillList.js'

// 引入websocket
import UniSockt from '@/api/websocket.js'
export default {
	onPullDownRefresh(){
		this.getChatList('refresh')
	},
	data() {
		return {
			popupList: [
				{class:'ql',name: '发起群聊',path:'/pages/chat/selectFriend'},
				{class:'tjpy',name: '添加朋友',path:'/pages/maillList/addFriend'},
				{class:'sys',name: '扫一扫',path:''},
			],
			popupNotify: false,
			notifyList: [],
			
			loadingType: 'more',
			page: 1,
			hasLogin: false,
			// 控制滑动效果
			theIndex: null,
			oldIndex: null,
			isStop: false,
			ws: null,
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
	onLaunch() {
		// Vue.prototype.$WS.initSocket((e) => {
		// 	console.log(e);
		// },(err) => {
		// 	console.log(err);
		// })
		// console.log(Vue.prototype.$WS.sendSocketMessage({
		// "sender": 1,
		// "receiver": 7,
		// "chat_type": 1,
		// "msg": "ping",
		// "msg_type": 0
		// }
		// ));
	},
	onShow() {
		this.hasLogin = this.$mStore.getters.hasLogin;
		if(this.hasLogin && !this.ws){
			this.initWS()
		}
		this.getChatList();
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
		// 
		initWS(){
			console.log(this);
		},
		// 数据初始化
		async getChatList(type) {
			try{
				let r = await this.$http.get(apiChatList)
				this.notifyList = r.data
				console.log(this.chatInfo);
				this.groupFriends = this.chatInfo.members
				uni.setNavigationBarTitle({ title: `${this.chatInfo.name}(${this.chatInfo.total})` });
			}catch(e){
				this.$mHelper.toast(e);
			}
			if(type === 'refresh'){
				uni.stopPullDownRefresh('refresh')
			}else{
				this.loading = false
			}
		},
		// 通用跳转
		navToLogin(route) {
			if(!this.hasLogin) ret
			this.$mRouter.push({ route });
		},
		// 去聊天页面
		goChat(item){
			if((typeof this.oldIndex) === 'number') return
			// type 1个人 2群聊
			this.$mRouter.push({ route: `/pages/chat/chat?type=${item.type}&chat_id=${item.chat_id}&target_id=${item.target_id}` });
		},
		// tag
		tagFn(item){
			if(item.class === 'sys' ){
				
			}else{
				this.popupNotify = false
				this.navToLogin(item.path)
			}
		},
		
		// 置顶 取消置顶
		async groupChatPersonalSite(flag,item,index){
			this.isStop = false;
			this.oldIndex = null
			this.theIndex = null
			console.log(flag,item,index);
			try{
				let r = await this.$http.post(apiPersonalSite,{
					disturb: item.disturb,
					chat_id: item.chat_id,
					top: flag
				})
				let curObj = this.notifyList.splice(index,1)
				curObj[0]['top'] = flag 
				if(flag){
					// 置顶
					this.notifyList.unshift(...curObj)
				}else{
					// 取消置顶
					let noTopIndex = this.notifyList.findIndex(res => !res.top)
					this.notifyList.splice(noTopIndex,0,...curObj)
				}
			}catch(e){
				this.$mHelper.toast(e);
			}
		},
		
		// 删除聊天记录
		async chatDeleteModal(item,index){
			let _this = this
			uni.showModal({
				content: '确定清除聊天记录？',
				success: res => {
					if (res.confirm) {
						_this.chatDelete(item,index)
					}
				}
			});
		},
		async chatDelete(item,index){
			try{
				let r = await this.$http.get(apiChatDelete,{id:chat_id})
				this.notifyList.splice(index,1)
			}catch(e){
				this.$mHelper.toast(e);
			}
		},
		
		
		// 控制左滑删除效果
		touchStart(index, event) {
			// 多点触控不触发
			if (event.touches.length > 1) {
				this.isStop = true;
				return;
			}
			this.oldIndex = this.theIndex;
			this.theIndex = null;
			// 初始坐标
			this.initXY = [event.touches[0].pageX, event.touches[0].pageY];
		},
		touchMove(index, event) {
			// 多点触控不触发
			if (event.touches.length > 1) {
				this.isStop = true;
				return;
			}
			let moveX = event.touches[0].pageX - this.initXY[0];
			let moveY = event.touches[0].pageY - this.initXY[1];
		
			if (this.isStop || Math.abs(moveX) < 5) {
				return;
			}
			if (Math.abs(moveY) > Math.abs(moveX)) {
				// 竖向滑动-不触发左滑效果
				this.isStop = true;
				return;
			}
		
			if (moveX < 0) {
				this.theIndex = index;
				this.isStop = true;
			} else if (moveX > 0) {
				if (this.theIndex != null && this.oldIndex === this.theIndex) {
					this.oldIndex = index;
					this.theIndex = null;
					this.isStop = true;
					setTimeout(() => {
						this.oldIndex = null;
					}, 150);
				}
			}
		},
		touchEnd(index, $event) {
			// 结束禁止触发效果
			this.isStop = false;
		},
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
		.notify-item-cnt{
			position: relative;
			&.grey{
				.notify-item{
					background-color: #f5f5f5;
				}
			}
		}
		.notify-btns{
			position: absolute;
			right: 0;
			height: 100%;
			z-index: 1;
			display: flex;
			view{
				font-size: 30upx;
				font-family: Source Han Sans CN;
				font-weight: 400;
				color: #FFFFFF;
				line-height: 140upx;
				width: 160upx;
				text-align: center;
				&:nth-child(1){
					background-color: #B4B4B4;
				}
				&:nth-child(2){
					background-color: #FFA800
				}
				&:nth-child(3){
					background-color: #DF0022;
					
				}
			}
		}
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
			z-index: 2;
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

			&.open {
				animation: showMenu 0.25s linear both;
			}
			
			&.close {
				animation: closeMenu 0.15s linear both;
			}
			@keyframes showMenu {
				0% {
					transform: translateX(0);
				}
				100% {
					transform: translateX(-480upx);
				}
			}
			@keyframes closeMenu {
				0% {
					transform: translateX(-480upx);
				}
				100% {
					transform: translateX(0);
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
