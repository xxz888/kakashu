<template>
  <div>
    
    <van-nav-bar
      title="增值业务"
      left-arrow
      @click-left="onClickLeft"
    ></van-nav-bar>
    <div class="warpper">
     <img src="../../assets/appserve.png"  alt="">
     <van-field class="vanField" v-model="digit" type="digit" label="" placeholder="请输入申请额度" />
     <van-field class="vanField2" v-model="fieldType"  label="" placeholder="请选择" @click.native="vanField2Show=true"/>
    </div>

      <div class="submit theme_btn_dark" @click="submitAction()">提交申请</div>

     <van-popup v-model="vanField2Show" position="bottom" :style="{ height: '40%' }">
      <van-picker
      placeholder= "请选择"
        show-toolbar
        title="选择账单日"
        :columns="columns"
        @cancel="vanField2Show=false"
        @confirm="selectType"/>
    </van-popup>

  </div>
</template>

<script>
import {
  NavBar,
  Icon,
  Grid,
  GridItem,
  Image as VanImage,
  Dialog,
  Field,
  Popup,
  Picker
} from "vant";
import { applyList } from "@/api/creditManage/apply";
import { bankIconQuery, getLinkUrl ,createOrder } from "@/api/card/card";

export default {
  name: "addserve",
  data() {
    return {
      digit:"",
      dataList: [],
      bankIconList: [],
      inputPhone: "",
      linkAlertShow: false,
      cellId: "",
      cellTitle: "",
      vanField2Show:false ,
      fieldType:'',
      columns:['风控花呗','京东白条']
    };
  },
  components: {
    [NavBar.name]: NavBar,
    [Icon.name]: Icon,
    [GridItem.name]: GridItem,
    [Grid.name]: Grid,
    [VanImage.name]: VanImage,
    [Dialog.Component.name]: Dialog.Component,
    [Field.name]: Field,
    [Popup.name]: Popup,
    [Picker.name]: Picker,
    [Dialog.Component.name]: Dialog.Component,


  },
  created() {
    this.getbankIcon();
  },
  methods: {
    submitAction(){
        var type =  this.fieldType == '风控花呗' ? "1" : this.fieldType == '京东白条' ? '2' : '';
        if (this.digit == '' || parseInt(this.digit) == 0) {
            this.$toast('请输入申请额度', "bottom");
            return;
        }
        if (type == '') {
            this.$toast('请选择服务类型', "bottom");
            return;
        }
        createOrder(this.digit,this.fieldType == '风控花呗' ? "1" : "2").then(res =>{
          if (res.resp_code == '000000') {
                  this.$toast("提交申请成功");
             setTimeout(() => {
         
                  _MEIQIA('init')
             _MEIQIA('showPanel')
             }, 1000);
                   
                      
          }else{
               this.$toast(res.resp_message);
          }
    
        })
    },
    selectType(value){
        this.fieldType = value;
        this.vanField2Show = false;
    },
    onClickLeft() {
      window.history.back();
    },
    jump(link, title, cellId) {
      if (link && link.lenght != 0) {

        window.location.href= link;


        // this.$router.push({
        //   name: "link",
        //   params: { url: JSON.stringify(link), title: JSON.stringify(title) },
        // });
      } else {
        this.cellTitle = title;
        this.cellId = cellId;
        this.linkAlertShow = true;
      }
    },
    inputPhonefinish() {
         // 确认
        if (this.inputPhone == "") {
          this.$toast("请填写手机号");
          return;
        }
        if (this.cellId == "") {
          this.$toast("id获取失败");
          return;
        }
      var that = this;

      getLinkUrl({ phone: this.inputPhone, id: this.cellId }).then((res) => {
        if (res.resp_code == "000000") {
          
           window.location.href= res.result;






          // that.$router.push({
          //   name: "link",
          //   params: {
          //     url: JSON.stringify(res.result),
          //     title: JSON.stringify(that.cellTitle),
          //   },
          // });
        }
      });
    },
    getbankIcon() {
      bankIconQuery().then((icon) => {
        if (icon.resp_code == "000000") {
          this.bankIconList = icon.result;
          this.getApplyList();
        }
      });
    },
    getApplyList() {
      var that = this;
      applyList().then((res) => {
        if (res.resp_code == "000000") {
          that.dataList = res.result;

          for (var iconItem of that.bankIconList) {
            var sub = iconItem.bank_name.substring(0, 2);

            for (var applyItem of that.dataList) {
              if (applyItem.title.indexOf(sub) != -1) {
                applyItem.bank_acronym = iconItem.bank_acronym;
              }
            }
          }
        } else {
          that.$Toast(res.resp_message, "bottom");
        }
      });
    },
  },
};
</script>

<style scoped>
.warpper img{
    width: 375px;
    height: 667px;
}
.warpper .vanField{
    position: relative;
    top:-310px;
    height: 40px;
    width: 200px;
    left: 130px;
}
.warpper .vanField2{
    position: relative;
    top:-285px;
    height: 40px;
    width: 180px;
    left: 130px;
}
.submit {
        position: relative;
    top:-180px;
  width: 340px;
  height: 45px;
  border-radius: 10px;
  margin: 30px auto 0;
  line-height: 45px;
  text-align: center;
  font-size: 16px;
  color: #FFFFFF;
  box-shadow: 2px 3px 3px 0 rgba(130, 130, 130, .1);
}
</style>
