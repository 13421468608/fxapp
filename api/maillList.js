/**
 *@des 登录注册相关接口
 *@author stav stavyan@qq.com
 *@blog https://stavtop.club
 *@date 2019/11/15 15:14:47
 *@param login.js
 */

// 搜索用户
const apiUserFind = '/api/v1/app/user/find';
// 申请添加用户
const apiFriendAdd = '/api/v1/app/friend/add';
// 通过用户id查找用户
const apiUserFriend = '/api/v1/app/user/';
// 验证添加好友
const apiFriendVer = '/api/v1/app/friend/verify';
// 获取好友申请列表信息
const apiFriendwAllReq = '/api/v1/app/friend/all/friend_request';
// 所有好友
const apiFriendwAll = '/api/v1/app/friend/all';
// 删除好友
const apiFriendDel = '/api/v1/app/friend/delete/'



// 我的群聊
const apiGroupChatMy = '/api/v1/app/group_chat/my';
// 获取群聊详情
const apiGroupChatDetail = '/api/v1/app/group_chat/detail/';
// 创建群聊
const apiGroupChatCreate = '/api/v1/app/group_chat/create';
// 群聊信息设置
const apiGroupChatInfoSite = '/api/v1/app/group_chat/info_site/';
// 个人设置
const apiGroupChatPersonalSite = '/api/v1/app/group_chat/personal_site/';
// 获取/设置 群聊管理设置
const apiGroupChatManagementSite = '/api/v1/app/group_chat/management_site/';
// 增加禁止领取代金券用户
const apiGroupChatBanReceivingVouchersAdd = '/api/v1/app/group_chat/ban_receiving_vouchers/add';
// 删除禁止领取代金券用户
const apiGroupChatBanReceivingVouchersDel = '/api/v1/app/group_chat/ban_receiving_vouchers/delete';
// 所有微信群成员
const apiGroupChatAllMembers = '/api/v1/app/group_chat/all_members';
// 增加管理员
const apiGroupChatAdministratorAdd = '/api/v1/app/group_chat/administrator/add';
// 删除管理员
const apiGroupChatAdministratorDel = '/api/v1/app/group_chat/administrator/delete';
// 删除群内成员
const apiGroupChatDeleteMember = '/api/v1/app/group_chat/delete_member';
// 转让群主
const apiGroupChatTransferGroupOwner = '/api/v1/app/group_chat/transfer_group_owner';
// 退出群聊
const apiGroupChatExit = '/api/v1/app/group_chat/exit/';
// 解散群聊
const apiGroupChatDissolve = '/api/v1/app/group_chat/dissolve/1';
// 邀请好友列表
const apiGroupChatInviteFriendsSlice = '/api/v1/app/group_chat/invite_friends_slice/';
// 邀请
const apiGroupChatInvite = '/api/v1/app/group_chat/invite/';
// 获取群聊申请验证
const apiGroupChatMemberVerify = '/api/v1/app/group_chat/member_verify/';
// 处理群聊申请
const apiGroupChatMemberVerifyDeal = '/api/v1/app/group_chat/member_verify/deal';

export {
	// lyw-start
	apiUserFind,
	apiFriendAdd,
	apiFriendVer,
	apiFriendwAllReq,
	apiFriendwAll,
	apiUserFriend,
	apiFriendDel,
	
	apiGroupChatMy,
	apiGroupChatDetail,
	apiGroupChatCreate,
	apiGroupChatInfoSite,
	apiGroupChatPersonalSite,
	apiGroupChatManagementSite,
	apiGroupChatBanReceivingVouchersAdd,
	apiGroupChatBanReceivingVouchersDel,
	apiGroupChatAllMembers,
	apiGroupChatAdministratorAdd,
	apiGroupChatAdministratorDel,
	apiGroupChatDeleteMember,
	apiGroupChatTransferGroupOwner,
	apiGroupChatExit,
	apiGroupChatDissolve,
	apiGroupChatInviteFriendsSlice,
	apiGroupChatInvite,
	apiGroupChatMemberVerify,
	apiGroupChatMemberVerifyDeal
};
