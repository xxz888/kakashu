<!-- 设置 -->
<template>
  <div>
    <van-nav-bar :title="'设置'" left-arrow fixed @click-left="onClickLeft" right-text="刷新" @click-right="onClickRight"/>
    <div class="main">
      <van-cell-group>
        <van-cell title="设置登录密码" 
                  is-link to="userpassword">
        </van-cell>
        <van-cell title="修改交易密码"
                   is-link
                  to="password"/>
          <van-cell title="修改登录手机"
         is-link
        to="changePhone"/>
      </van-cell-group>
      <div class="submit theme_btn_dark" @click="outLogin()">退出登录</div>
    </div>
  </div>
</template>

<script>
import {NavBar, Cell, CellGroup, Dialog} from 'vant';
import {brandQuery} from '@/api/showBrand'
import Cookies from "js-cookie";

export default {
  data() {
    return {
      version: '1.0.0',
      brandId: this.global.brandId,
      cfg: this.global.configType,
    };
  },
  components: {
    [NavBar.name]: NavBar,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Dialog.Component.name]: Dialog.Component,
  },
  created() {
    this.getBrand()
  },
  methods: {
    onClickRight(){
      location.reload()
    },
    onClickLeft() {
      window.history.back()
      return
    },
    getBrand() {
      brandQuery(this.brandId).then(res => {
        if (res.resp_code == '000000') {
          let u = navigator.userAgent;
          var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
          var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
          if (isAndroid) {
            this.version = res.result.androidVersion
          } else if (isiOS) {
            this.version = res.result.iosVersion
          }
        } else {
          this.$toast({message: res.resp_message, position: 'bottom'})
        }
      })
    },
    // 退出登录
    outLogin() {
      Dialog.confirm({
        title: '温馨提示',
        message: '确认要退出登录吗？'
      }).then(() => {
        let did = localStorage.getItem('did')
        localStorage.clear();
        sessionStorage.clear()
        if (did) {
          localStorage.setItem('did', did)
        }
      Cookies.remove('token');

            
        this.$router.push({name: 'login'})
      }).catch(() => {
      })
    },
  }
}

</script>
<style scoped>
.main {
  padding-top: 47px;
  text-align: left;
}

.submit {
  width: 300px;
  height: 45px;
  border-radius: 25px;
  margin: 30px auto 0;
  line-height: 45px;
  text-align: center;
  font-size: 16px;
  color: #FFFFFF;
  box-shadow: 2px 3px 3px 0 rgba(130, 130, 130, .1);
}
</style>
