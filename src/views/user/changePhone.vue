<!-- 忘记密码 -->
<template>
  <div>
    <van-nav-bar :title="'修改登录手机'" left-text="" left-arrow fixed @click-left="onClickLeft" right-text="客服"
                 @click-right="onClickRight"/>
    <div class="main">
      <div class="input_item">
        <van-field clearable label="新手机号" v-model="phone" type="number" :placeholder="'请输入手机号'" maxlength="11"/>
      </div>
      <div class="input_item">
        <van-field clearable label="当前登录密码" v-model="password" type="password" :placeholder="'请输入'+title+'密码'"/>
      </div>
      <div class="submit theme_btn" @click="next()">确定</div>
    </div>
  </div>
</template>

<script>
import {NavBar, Field} from 'vant';
import {userSms, changePhone} from '@/api/login'
import Cookies from "js-cookie";

export default {
  data() {
    return {
      type: '0',
      title: '登录',
      phone: '',
      password: '',
      passsure: '', // 确认密码
      brandId: this.global.brandId,
      num: 60
    };
  },
  components: {
    [NavBar.name]: NavBar,
    [Field.name]: Field,
  },
  methods: {
  
    onClickRight() {
      _MEIQIA('init')
      _MEIQIA('showPanel')
    },
    onClickLeft() {
      window.history.go(-1)
    },
    next() {
      if (this.phone == '') {
        this.$toast({message: '请输入新手机号', position: 'bottom'})
        return
      }
      if (this.password == '') {
        this.$toast({message: '请输入当前登录密码', position: 'bottom'})
        return
      }
      changePhone(this.phone,this.password).then(res => {
        if (res.resp_code == '000000') {
          this.$toast({message: res.resp_message + '请重新登录', position: 'bottom'})
          let did = localStorage.getItem('did')
          localStorage.clear();Cookies.remove('token');
          if (did)
            localStorage.setItem('did', did)
            this.$router.push({name: 'login'})
        }
      })
    }
  }
}

</script>
<style scoped>
.main {

  padding: 60px 10px 0px 10px;
}

.input_item {
  margin-bottom: 1px;
}

.submit {
  width: 300px;
  margin: 20px auto;
  height: 45px;
  line-height: 45px;
  border-radius: 25px;
  color: #FFFFFF;
  font-size: 18px;
  text-align: center;
}

.sms {
  color: #9B3C9D;
}
</style>
