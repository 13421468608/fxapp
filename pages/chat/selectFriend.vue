<template>
	<view class="maill">
		<view class="rf-search-box">
			<i class='icon-search'></i>
			<input v-model="searchTxt" placeholder="搜索"></text>
		</view>
		<block v-if="searchList.length">
			<view class="people-list">
				<block v-if="choiceNumber === 1">
					<view
						class="people-item"
						v-for="item in searchList"
						:key="item.id"
						@tap="itemChange(childItem)">
						<image :src="$imgBase + item.avatar" mode=""></image>
						<view class="people-name">{{item.nick_name}}</view>
					</view>
				</block>
				<block v-else>
					<view
						class="people-item"
						v-for="item in searchList"
						:key="item.id"
						@tap="item.check = !item.check">
						<i :class="['icon-radio',item.check ? 'on' : '']"></i>
						<image :src="$imgBase + item.avatar" mode=""></image>
						<view class="people-name">{{item.nick_name}}</view>
					</view>
				</block>
				
			</view>
		</block>
		
		<block v-else>
			<view class="maill-list" v-for="(item,index) in maillList" :key="item.key">
				<view class="maill-item" :id="item.key">
					<view class="check"></view>
					<view class="maill-item-letter">{{item.key}}</view>
					<view class="people-list">
						<block v-if="choiceNumber === 1">
							<view
								class="people-item"
								v-for="(childItem,childIndex) in item.list"
								:key="childItem.id"
								@tap="itemChange(childItem)">
								<image :src="$imgBase + childItem.avatar" mode=""></image>
								<view class="people-name">{{childItem.nick_name}}</view>
							</view>
						</block>
						<block v-else>
							<view
								class="people-item"
								v-for="(childItem,childIndex) in item.list"
								:key="childItem.id"
								@tap="childItem.check = !childItem.check">
								<i :class="['icon-radio',childItem.check ? 'on' : '']"></i>
								<image :src="$imgBase + childItem.avatar" mode=""></image>
								<view class="people-name">{{childItem.nick_name}}</view>
							</view>
						</block>
						<!-- itemChange(1,childItem,childIndex,index) -->
					</view>
				</view>
			</view>
			<view class="index-bar">
				<view v-for="item in letterList" :key='item'>{{item}}</view>
			</view>
		</block>
		
		<view class="fixed-btns">
			<button :loading="btnLoad" :disabled="btnLoad" class="confirm-btn" @tap="confirmBtn">
				确定
				<!-- {{choiceNumber === 1 ? '' : '('+selcetNumber+')'}} -->
			</button>
		</view>
	</view>
</template>
<script>
import rfLoadMore from '@/components/rf-load-more/rf-load-more';
import moment from '@/common/moment';


import { apiFriendwAll,apiGroupChatCreate } from '@/api/maillList.js';
import router from '../../utils/router';
export default {
	components: { rfLoadMore },
	// 下拉刷新
	onPullDownRefresh() {
		this.getFriendwAll('refresh');
	},
	data() {
		return {
			// 可选多少个好友 1 单选 2以上多选
			choiceNumber: 10000,
			type: 'xzlr',			// 选中好友处理类型 xzlr选择了联系人  exclusive 选择专属人
			
			maillList: [],		//字母-好友集合
			letterList:[],   	//字母集合
			sourceList: [],		//搜索的所有好友集合
			searchList: [],		//搜索的好友集合
			selcetNumber: 0, 	//已选中的好友数量
			searchTxt: null,	//搜索值
			searchTimer: null,	
			btnLoad: false, 
			hasLogin: false,
			
		};
	},
	filters: {
		time(val) {
			return moment(val * 1000).format('YYYY-MM-DD HH:mm:ss');
		},
	},
	onLoad(option = {}) {
		this.type = option.type
		if(['exclusive'].includes(this.type)){
			this.choiceNumber = 1
		}
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
			this.hasLogin = this.$mStore.getters.hasLogin;
			this.page = 1;
			this.letterList = (this.maillList.reduce((t,v) => [...t,v.key],[]))
			this.getFriendwAll()
		},
		// 获取所有数据
		async getFriendwAll(){
			try{
				let r = await this.$http.get(apiFriendwAll)
				let obj = r.data.friends || {},
					arr = []
				this.letterList = Object.keys(obj)
				let allArr = []	
				this.maillList = this.letterList.reduce((t,v) => {
					let firendArr = obj[v].map(item => {
						console.log(item);
						item.check = false
						return item
					})
					allArr = [...allArr,...firendArr]
					return [...t, { 'key': v,'list': firendArr} ]
				} , [])
				console.log(allArr);
				this.sourceList = allArr
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
			uni.setStorageSync('select-friend', item);
			this.$mRouter.back()
		},
		// 确认
		async confirmBtn(){
			switch (this.type){
				case 'xzlr':
					this.groupChatCreate()
					break;
				default:
					break;
			}
		},
		async groupChatCreate(){
			let req = this.sourceList.reduce((t,v)=> v.check ? [...t,v.ID] : t,[] )
			if(!req.length) {
				this.$mHelper.toast('请选择好友');
				return 
			}
			this.btnLoad = true
			try{
				let r = await this.$http.post(apiGroupChatCreate, {friends: req})
				this.$mHelper.toast('创建群聊成功');
				setTimeout(()=>{
					this.switchTab({url: '/pages/maillList/maillList'})
				},1000)
				this.btnLoad = false
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
