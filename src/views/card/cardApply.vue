<template>
  <div>
    
    <van-nav-bar
      title="在线申请信用卡"
      left-arrow
      @click-left="onClickLeft"
    ></van-nav-bar>
    <div class="warpper">
      <!-- <ul class="my_cell_list">
        <li v-for="item in dataList" class="my_cell_item van-hairline--bottom" :key="item.title"
            @click="jump(item.link)">
          <div class="left">
            <img src="../../assets/my/card_icon.png" alt="">
            <span>{{ item.title }}</span>
          </div>
          <div class="icon">
            <van-icon class="icon_icon" size="16" name="arrow"/>
          </div>
        </li>
      </ul> -->
      <div style="height: 10px"></div>
      <van-grid class="" :column-num="3" :gutter="10">
        <van-grid-item v-for="item in dataList" :key="item.title">
          <div class="content" @click="jump(item.link, item.title, item.id)">
            <img
              class="contentImg"
              :src="
                require('../../assets/bankIcon/BANK_' +
                  item.bank_acronym +
                  '.png')
              "
              alt=""
            />
            <p class="contentTitle">{{ item.title }}</p>
          </div>
          <p></p>
        </van-grid-item>
      </van-grid>


    </div>

    <!--弹出框，赋予chargeBtn事件-->
    <van-dialog
      v-model="linkAlertShow"
      title="请输入手机号"
      show-cancel-button
      @confirm="inputPhonefinish()"
    >
      <!--输入框-->
      <van-field
        v-model="inputPhone"
        rows="1"
        autosize
        placeholder="请输入手机号"
      />
    </van-dialog>
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
} from "vant";
import { applyList } from "@/api/creditManage/apply";
import { bankIconQuery, getLinkUrl } from "@/api/card/card";

export default {
  name: "cardApply.vue",
  data() {
    return {
      dataList: [],
      bankIconList: [],
      inputPhone: "",
      linkAlertShow: false,
      cellId: "",
      cellTitle: "",
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
  },
  created() {
    this.getbankIcon();
  },
  methods: {

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
.my_cell_list {
  background: #fff;
  border-radius: 12px;
  /* padding: 10px; */
  margin-bottom: 10px;
}

.my_cell_item {
  height: 64px;
  display: flex;
  font-size: 18px;
  color: #5d5d5d;
  line-height: 64px;
  padding: 0 15px;
}

.my_cell_item .left {
  flex: 1;
}

.my_cell_item .left > img {
  height: 28px;
  width: 28px;
  vertical-align: middle;
  margin-right: 7px;
}
.content {
  width: 100%;
  height: 100%;
  align-items: center;
  display: flex;
  flex-direction: column;
}

.contentImg {
  margin-top: 10px;
  width: 25px;
  height: 25px;
}
.contentTitle {
  width: 80%;
  margin-top: 10px;
  font-size: 13px;
  text-align: center;
}
</style>
