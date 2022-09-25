<template>
  <div class="login">
    <div class="top">
      <img class="login_logo" src="@/assets/login/login_logo.png" alt="">

         <div class="mt-40 fcc jc0sa">
           <div class="flex2 fcc">
             <div :class="!active ? 'active' : 'noactive'" @click="active = !active">登录</div>
              <div class="line1" v-if="!active"></div>
           </div>
            

           <div class="flex2 fcc " style="margin-left:80px">
            <div :class="active ? 'active' : 'noactive'" @click="active = !active" >注册</div>
              <div class="line1" v-if="active"></div>
           </div>
          </div>
    </div>

    
    <div class="cont">
        <div class="switchover fcc">
            <div class="loginTitle ">{{active ? '欢迎注册咔咔鼠App' : '欢迎登录咔咔鼠App'}}</div>
          </div>
      <ul class="list mt-20 ">


        <li class="item theme_border_radius mt-20">
          <div class="">
            <div class="right">
              <van-field class="tfClass" v-model="phone" type="number" clearable placeholder="请输入手机号" maxlength="11"/>
            </div>
          </div>
        </li>

        <li class="item mt-20" v-show="active">
          <div class=" theme_border_radius">
            <div class="">
              <van-field class="tfClass" v-model="smsCode" clearable type="number" placeholder="请输入短信验证码" maxlength="6">
                <template #button>
                  <div class="sms" @click="message == '发送验证码' ? getCode() : ''">
                    {{ message }}
                  </div>
                </template>
              </van-field>
            </div>
          </div>

          <div class=" mt-20 theme_border_radius">
            <div class="">
              <van-field  class="tfClass" v-model="regPwd" clearable type="password" placeholder="请输入密码，6-16位数字字母组合">
              </van-field>
            </div>
          </div>


       <div class=" mt-20 theme_border_radius">
            <div class="">
              <van-field  class="tfClass" v-model="regPwd1" clearable type="password" placeholder="请再次输入密码">
              </van-field>
            </div>
          </div>


          <div class=" mt-20 theme_border_radius">
            <div class="">
              <van-field class="tfClass" v-model="preUserPhone" clearable type="number" maxlength="11" placeholder="推荐人手机号">
              </van-field>
            </div>
          </div>
          <!-- <p v-if="geMeiqia" class="forget"><span @click="meiqia">收不到验证码?点我</span></p> -->

        </li>

        <!-- 密码登录 -->
        <div v-show="!active">
          <li class="item mt-20 theme_border_radius">
            <div class="">
              <div class="">
                <van-field  class="tfClass" v-model="password" clearable type="password" placeholder="请输入密码">
                </van-field>
              </div>
            </div>
          </li>
        
        </div>
        <!-- 密码登录 -->
      </ul>


      <div class="btn" @click="confirm">{{active ? '立即注册' : '登录'}}</div>

      <p class="forget"><span @click="forget">忘记密码?</span></p>
      <div v-if="!active" class="login_tips" @click="pull">
        登录即代表已同意 <span>《咔咔鼠服务协议》</span>
      </div>
    </div>
  </div>
</template>


<script>
import {Field} from "vant";
import Cookies from "js-cookie";
import {smsSend, smsLogin, userLogin, register,authPhone} from "@/api/login";
import md5 from 'js-md5';

export default {
  data() {
    return {
      active: false,
      brandId: this.global.brandId,
      password: '',
      phone: "",
      smsCode: "",
      num: 60,
      message: "发送验证码",
      preUserPhone: '',
      regPwd: '',
      regPwd1:''
    };
  },
  components: {
    [Field.name]: Field,
  },
  created() {
    this.phone = Cookies.get("kd_l_phone");
  },

  
  beforeRouteEnter: (to, from, next) => {
    if ((from.name == null || from.name == '') && localStorage.getItem('token')) { //判断从哪个页面进入如果有token 并且不是从退出登录进入 直接跳入主页
      next(vm => {
        vm.nextReplace()
      })
    }
    next()
  },
  methods: {
    nextReplace() {
      this.$router.replace({name: 'home'})
    },
    time() {
      let timer = setInterval(() => {
        this.message = "(" + this.num + ")秒";
        this.num--;
        if (this.num == 0) {
          clearInterval(timer);
          this.num = 60;
          this.message = "发送验证码";
        }
      }, 1000);
    },
    // 获取验证码
    getCode() {

      authPhone(this.phone).then(res => {
        
        if (res.resp_message.indexOf('未注册') > -1) {
              smsSend(this.brandId, this.phone).then((res) => {
            if (res.resp_code == "000000") {
              this.time();
              this.$toast({message: res.resp_message, position: "bottom"});
            }
          })
        } else if (res.resp_message.indexOf('已注册') > -1) {
               this.$toast({message: res.resp_message, position: "bottom"});
        }
      })
    },
    //注册
    regconfirm() {
      if (this.smsCode == "") {
        this.$toast({message: "请先获取输入验证码", position: "bottom"});
        return;
      }
      if (!this.regPwd) {
        this.$toast({message: "请设置密码", position: "bottom"});
        return;
      }
      
      if (this.regPwd != this.regPwd1) {
          this.$toast({message: "两次密码输入不一致", position: "bottom"});
        return;
      }
      if (this.preUserPhone == '') {
        this.$toast({message: "推荐人手机号码有误,请重填", position: "bottom"});
        return;
      }
      register(this.brandId, this.phone, this.smsCode, this.regPwd,this.preUserPhone).then(res => {
        if (res.resp_code == "000000") {
          this.active = false
          this.password = this.regPwd
          this.$toast({message: "注册成功", position: "bottom"});
        }
      }, err => {
        this.$toast({message: "注册失败", position: "bottom"});
      })

    },
    //登录
    confirm() {
      if (this.active) {
        this.regconfirm();
        return
      }


      if (this.publicJs.isPhoneNumber(this.phone)) {
        this.$toast({message: "手机号码有误，请重填", position: "bottom"});
        return;
      }
      if (this.active) {
        if (this.smsCode == "") {
          this.$toast({message: "请先获取输入验证码", position: "bottom"});
          return;
        }
        this.$store.commit('Loading')
        smsLogin(this.brandId, this.phone, this.smsCode).then((res) => {
          this.$store.commit('closeLoading')
          if (res.resp_code == "000000") {
            if (res.result.realnameStatus == 1) {  //未实名 让跳转APP
               this.$router.replace({name: "home"});//首页
            } else {
               this.$router.push({name: "faceRecognitionDetail"});


              // this.$toast({message: '请到咔咔鼠APP实名后登录', position: 'bottom'})
              // this.$store.commit('Loading')
              // let time = setTimeout(() => {
              //   this.$store.commit('closeLoading')
              //   this._getDownload()
              //   clearTimeout(time)
              // }, 2500);
              // return
            }
            localStorage.setItem("userId", res.result.id);
            localStorage.setItem("phone", res.result.phone);
            localStorage.setItem("token", res.result.userToken);
            localStorage.setItem("ip", this.global.ip);
            localStorage.setItem("userName", res.result.fullname);
            localStorage.setItem("loginT", true);
            localStorage.setItem('brandId', res.result.brandId)
            this.deviceId();
            Cookies.set("kd_l_phone", this.phone);
            sessionStorage.setItem("userName", res.result.fullname);
            sessionStorage.setItem("phone", res.result.phone);
            localStorage.setItem('realnameStatus', res.result.realnameStatus)


            Cookies.set("userId", res.result.id);
            Cookies.set("phone", res.result.phone);
            Cookies.set("token", res.result.userToken);
            Cookies.set("ip", this.global.ip);
            Cookies.set("userName", res.result.fullname);
            Cookies.set("loginT", true);
            lCookies.set('brandId', res.result.brandId)
            Cookies.set("kd_l_phone", this.phone);
            Cookies.set("userName", res.result.fullname);
            Cookies.set("phone", res.result.phone);
            Cookies.set('realnameStatus', res.result.realnameStatus)
            
          }
        });
      } else {
        if (this.password == '') {
          this.$toast({message: "密码不能为空", position: "bottom"})
          return
        } else if (this.password.length < 6) {
          this.$toast({message: "密码不能小于6位", position: "bottom"})
          return
        }
        this.$store.commit('Loading')
        let str = 'brandId=' + this.brandId + '&password=' + this.password + '&phone=' + this.phone + '&key=' + 'cader#%world' //拼接
        let sign = md5(str).toUpperCase() //MD5加密然后字母转为大写
        userLogin(this.phone, this.password, this.brandId, sign).then(res => {
          this.$store.commit('closeLoading')
          if (res.resp_code == "000000") {
            if (res.result.realnameStatus == 1) {
              this.$router.replace({name: "home"});//首页
            } else {
              this.$router.push({name: "faceRecognitionDetail"});//实名认证

              // this.$toast({message: '请到咔咔鼠APP实名后登录', position: 'bottom'})
              // this.$store.commit('Loading')
              // let time = setTimeout(() => {
              //   this.$store.commit('closeLoading')
              //   this._getDownload()
              //   clearTimeout(time)
              // }, 2500);
              // return
            }
            localStorage.setItem("userId", res.result.id);
            localStorage.setItem("phone", res.result.phone);
            localStorage.setItem("token", res.result.userToken);
            localStorage.setItem("ip", this.global.ip);
            localStorage.setItem("userName", res.result.fullname);
            localStorage.setItem("loginT", true);
            localStorage.setItem('brandId', res.result.brandId)
            this.deviceId();
            Cookies.set("kd_l_phone", this.phone);
            sessionStorage.setItem("userName", res.result.fullname);
            sessionStorage.setItem("phone", res.result.phone);
            localStorage.setItem('realnameStatus', res.result.realnameStatus)
            
          }else{
             this.$toast({message: res.resp_message, position: "bottom"});
          }
        })
      }
    },
    deviceId() {
      const platform = Math.ceil(navigator.platform.length / 3);
      let str = "";
      let num = 0;
      const arr = returnCitySN["cip"].split(".");
      arr.forEach((item, i) => {
        if (i != arr.length - 1) {
          str += item + navigator.platform.substring(num, num + platform);
          num += platform;
        } else {
          str += item;
        }
      });
      localStorage.setItem("kd_webapp_deviceId", str);
    },
    pull() {
      this.$router.push({name: "pull"});
    },
    forget() {
      this.$router.push({name: 'userpassword'})
    }
  }
}
</script>
<style scoped lang='less'>
.forget {
  margin-top: 12px;
  color: #9B3C9D;
  font-size: 12px;
  text-align: right;
}

.active {
  // border-bottom: 2px solid#9B3C9D;


font-size: 22px;
font-family: PingFang SC;
font-weight: 500;
line-height: 34px;
color: #FFFFFF;
opacity: 1;
}

.noactive {

font-size: 17px;
font-family: PingFang SC;
font-weight: 500;
line-height: 20px;
color: #FFFFFF;
opacity: 1;
}

.login_logo {
  width: 100px;
  margin-top: 80px;
  margin-bottom: 5px;
}

.theme {
  margin-right: 15px;
}

.login {
   background: url('../assets/蒙版组 875@3x.png') no-repeat ;
   background-size: 100% 100%;

  height: 100vh;
}

.top {
  color: #fff;
  font-size: 15px;
  background-size: 100% 100%;
  width: 100%;
  text-align: center;
}

.cont {
  padding: 20px;
  font-size: 14px;
  background: #fff;
  width: 90%;
  border-radius: 5px;
  margin: 0px auto;
  margin-top: 20px;
}

.cont .item > span {
  line-height: 40px;
}

.cont .item .input {
  display: flex;
  margin-top: 20px;
}

.cont .list {
  padding-bottom: 40px;
}

.sms {
  color: #9B3C9D;
}

.btn {
  width: 100%;
  line-height: 56px;
  border-radius: 28px;
  font-size: 20px;
  font-weight: 400;
  color: #ffffff;
  text-align: center;
  background: #9B3C9D;
  box-shadow: 0 0 16px 2px rgba(0, 0, 0, 0.1);
}

.login_tips {
  font-size: 13px;
  color: #666;
  text-align: center;
  margin-top: 35px;
  line-height: 40px;
  margin-bottom: 20px;
}

.login_tips span {
  color: #9B3C9D;
}

.zc {
  margin-top: 5px;
  text-align: center;
  color: #9B3C9D;
}

.right {
  border-bottom: .1px solid rgba(204, 103, 10, 0);
}

.switchover {
  display: flex;
  margin-bottom: 10px;

  span {
    flex: 1;
    text-align: center;
  }
}
.noSms{
  margin-top: 15px;
}
.line1{
  margin-top: 3px;
  width: 30px;
height: 3px;
background: rgba(255,255,255,0.39);
opacity: 1;
border-radius: 3px;
}

.loginTitle{
height: 28px;
font-size: 20px;
font-family: PingFang SC;
font-weight: 400;
line-height: 31px;
color: #9B3C9D;
opacity: 1;
}

.theme_border_radius{
 border: 1px solid #E4E7EA;
 border-radius: 30px;
 
}

.tfClass{
  width: calc(100% - 40px);
  margin-left: 20px;
  
}
</style>
