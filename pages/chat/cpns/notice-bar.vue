<template>
	<view class="notice" @tap="noticeChange">
		<i class='icon-notice'></i>
		<text>{{info.text}}</text>
		<i class='icon-more'></i>
	</view>
</template>

<script>
	export default {
		props: {
			info: Object
		}
		data() {
			return {
				
			}
		},
		methods: {
			noticeChange(){
				
			}
		}
	}
</script>

<style lang="scss" scoped>

</style>