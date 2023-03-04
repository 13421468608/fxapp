<template>
	<view>
		<button
			:class="[computedType,computedSize,computedCharLength]"
			:disabled="disabled"
			@click="doClick">
			
			<slot>{{text}}</slot>
		</button>
	</view>
</template>

<script>
	export default {
		name: 'RfButton',
		props: {
			// 按钮文字
			text: {
			    type: String,
			    default: ''
			},
			// 按钮类型：primary-黄色 disabled-灰色 success-绿色 danger-红色
			type: {
			    type: String,
			    default: ''
			},
			// 按钮大小：xs-特小 s-小 m-中 l-大 xl-特大 full-100%宽
			size: {
			    type: String,
			    default: 'full'
			},
			// 按钮图标
			icon: {
			    type: String
			},
			// 图标位置：start、end
			iconPosition: {
			    type: String
			},
			// 宽度等同于有指定个数汉字的按钮宽度（支持2到10个汉字数）
			charLength: {
			    type: Number
			},
			// 是否启用函数节流
			throttle: {
			    type: Boolean,
			    default: true
			},
			// 函数节流等待时间，单位：毫秒
			throttleTime: {
			    type: Number,
			    default: 1000 // 1秒
			},
			// 按钮是否可用, 如果为true不触发点击事件
			disabled: {
			    type: Boolean,
			    default: false
			},
			// 动画速度
			speed: {
			    type: Number,
			    default: 20
			},
			// 动画透明度
			opacity: {
			    type: Number,
			    default: 0.4
			}
		},
		computed: {
		        // 控制按钮的类型
		        computedType () {
				let btnCls = this.type ? `btn-${this.type}` : ''
				if (this.disabled) {
					btnCls+=' btn-disabled'
				}
				return btnCls
		        },
		        // 控制按钮大小尺寸
		        computedSize () {
		            return this.size ? `btn-${this.size}` : ''
		        },
		        // 控制按钮宽度等同于有指定个数汉字的按钮
		        computedCharLength () {
		            return this.charLength && this.charLength >= 2 && this.charLength <= 10 ? `btn-char-length${this.charLength}` : ''
		        }
		},
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss" scoped>
$btn-font-size: 30upx;
$btn-padding: 35upx;

.btn {
    position: relative;
    padding: 0 $btn-padding;
    height: 90upx;
    box-sizing: content-box;
    font-weight: 400;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    user-select: none;
    background-color: #FFF;
    border-radius: 4upx;
    font-size: $btn-font-size;
    color: #010101;
    transition: background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    overflow: hidden;
    outline: none;
}
.btn:active {
    box-shadow: 0 1px 3px -1px rgba(0, 0, 0, .5), 0 0 5px 0 rgba(0, 0, 0, 0.12);
}
.zk-ripple {
    opacity: 0;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
.btn-primary {
    color: #010101;
    background-color: $uni-color-success;
}
.btn-success {
    color: #010101;
    background-color: $uni-color-success;
    border-color: $uni-color-success;
}
.btn-danger {
    color: #fff;
    background-color: $uni-color-error;
    border-color: $uni-color-error;
}


.btn-xs{
    padding: 0 $btn-padding;
    height: 22upx;
    font-size: $btn-font-size;
}
.btn-s{
    padding: 0 $btn-padding;
    height: 26px;
    font-size: $btn-font-size;
}
.btn-m{
}
.btn-l{
    padding: 0 $btn-padding;
    height: 32px;
    font-size: $btn-font-size;
}
.btn-xl{
    padding: 0 $btn-padding;
    height: 34px;
    font-size: $btn-font-size;
}
button.btn-char-length2{
    width: 2em;
}
button.btn-char-length3{
    width: 3em;
}
button.btn-char-length4{
    width: 4em;
}
button.btn-char-length5{
    width: 5em;
}
button.btn-char-length6{
    width: 6em;
}
button.btn-char-length7{
    width: 7em;
}
button.btn-char-length8{
    width: 8em;
}
button.btn-char-length9{
    width: 9em;
}
button.btn-char-length10{
    width: 10em;
}
button.btn-disabled {
    color: #fff;
    background-color: #ccc;
    border-color: #ccc;
}
</style>

