import request from '@/utils/request'

export function applyList(){
  return request({
    url: '/creditcardmanager/app/get/creditcardapply',
    method: 'post',
  })
}
