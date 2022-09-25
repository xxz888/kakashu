import request from '@/utils/request'
import qs from 'qs'

// 推广收益
export function userShareProfitQuery(){
    return request({
        url: '/user/app/query/direct/user/award/history/sum',
        method: 'post',
    })
}
// 获取推广用户列表
export function userDirectQuery(level,status,condition,size){
    return request({
        url: '/user/app/query/direct/user/info',
        method: 'post',
        data: qs.stringify({
            "level": level,//查询层级,1:直推,2:间推,3:二级间推
            "status": status,//状态筛选条件,0:全部,1:已注册,2:已实名,3:已激活,4:已认证
            "condition":condition,//手机号或姓名 筛选条件
            "size":size,
          }),
    })
}
// 获取中介用户列表
export function getEmpowerUser(page,size,fullname){
    return request({
        url: '/creditcardmanager/app/empower/user',
        method: 'post',
        data: qs.stringify({
            'page':page,
            "size":size,
            'fullname':fullname
          }),
    })
}
// 推广收益
export function profitSumQuery(queryType,queryDate){
    return request({
        url: '/transactionclear/app/query/profit/sum',
        method: 'post',
        data: qs.stringify({
            "queryType": queryType,//查询类型,1:快捷,2:余额还款,3:空卡还款,6:花呗 ,9:推广业绩
            "queryDate": queryDate,//查询月份,如2020年9月为:202009
          }),
    })
}

// 获取推广用户列表
export function userDirectDetailQuery(queryDate,level,queryType,size){
    return request({
        url: '/transactionclear/app/query/profit/detail',
        method: 'post',
        data: qs.stringify({
            "queryDate":queryDate,//查询月份,如2020年9月为:202009
            "level": level,//查询层级,1:直推,2:间推,3:二级间推
            "queryType": queryType,//查询类型,1:快捷,2:余额还款,3:空卡还款,5:返现,6:花呗
            "size":size,
          }),
    })
}

// 获取提现/弥补/达标 记录
export function orderDetailQuery(queryType,size){
    return request({
        url: '/transactionclear/app/query/order/detail',
        method: 'post',
        data: qs.stringify({
            "queryType": queryType,//查询类型,4:达标7:弥补,8:提现
            "size": size,//
          }),
    })
}

export function active(){
  return request({
    url: '/user/app/query/activate/award/config',
    method: 'post',
    data: qs.stringify({})
  })
}
/** 获取中介用户的token */
export function empowerToken(userId) {
    return request({
      url: 'user/app/empower/token',
      method: 'post',
      data: qs.stringify({
        'userId':userId,
    })
    })
  }
  

// 
export function activateList(queryDate,size){
    return request({
        url: '/user/app/activate/list',
        method: 'post',
        data: qs.stringify({
            "queryDate": queryDate,//查询类型,4:达标7:弥补,8:提现
            "size": size,//
            'page':'1'
          }),
    })
}




/** 获取中介用户的token */
export function statistics(userId) {
    return request({
      url: '/user/app/activate/statistics',
      method: 'post',

    })
  }