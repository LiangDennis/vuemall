<template>
    <div>
      <nav-header></nav-header>
      <nav-bread>
        <span>goods</span>
      </nav-bread>
      <div class="accessory-result-page accessory-page">
        <div class="container">
          <div class="filter-nav">
            <span class="sortby">Sort by:</span>
            <a href="javascript:void(0)" class="default cur">Default</a>
            <a href="javascript:void(0)" class="price">Price <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg></a>
            <a href="javascript:void(0)" class="filterby stopPop"
              @click="showFilterPop"
            >Filter by</a>
          </div>
          <div class="accessory-result">
            <!-- filter -->
            <div class="filter stopPop" id="filter"
              v-bind:class="{'filterby-show':filterBy}"
            >
              <dl class="filter-price">
                <dt>Price:</dt>
                <dd>
                <!-- 同时还有all点击后也会跳出 -->
                  <a href="javascript:void(0)" 
                    v-bind:class="{'cur':priceChecked=='all'}"
                    @click="setPriceFilter('all')"
                  >All</a></dd>
                <dd v-for="(price, index) in priceFilter" :key="index">
                  <a href="javascript:void(0)" 
                    v-bind:class="{'cur':priceChecked==index}"
                    @click="setPriceFilter(index)"
                  >{{price.startPrice}} - {{price.endPrice}}</a>
                </dd>
              </dl>
            </div>

            <!-- search result accessories list -->
            <div class="accessory-list-wrap">
              <div class="accessory-list col-4">
                <ul>
                  <li v-for="(item, index) in goodsData" :key="index">
                    <div class="pic">
                      <a href="#"><img v-lazy="'static/'+item.productImage" alt=""></a>
                    </div>
                    <div class="main">
                      <div class="name">{{item.productName}}</div>
                      <div class="price">{{item.salePrice}}</div>
                      <div class="btn-area">
                        <a href="javascript:;" class="btn btn--m">加入购物车</a>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="md-overlay" v-show="overLayFlag" @click="closePop"></div>
      <nav-footer></nav-footer>
    </div>
</template>
<script>
import '@/assets/css/base.css'
import '@/assets/css/product.css'
import '@/assets/css/login.css'
import NavHeader from '@/components/NavHeader.vue'
import NavFooter from '@/components/NavFooter.vue'
import NavBread from '@/components/NavBread.vue'
import axios from 'axios'


export default{
    data(){
        return {
          goodsData:[],
          priceFilter:[
            {
              startPrice:0.00,
              endPrice:500.00
            },
            {
              startPrice:500.00,
              endPrice:1000.00
            },
            {
              startPrice:1000.00,
              endPrice:2000.00
            }
          ],
          // 控制选中的是某一项，默认选中all项
          priceChecked:"all",
          filterBy:false,
          overLayFlag:false
        }
    },
    components:{
      NavHeader,
      NavFooter,
      NavBread
    },
    mounted () {
      /*说明：
       *1.res对象必须通过data属性才能获取到数据_1
       *2.数据_1即后端配置的dataresult和error对象数据的返回
       *3.通过对dataresult的访问才获得json文件
       *4.最后通过.result才最终获取到result的数据
      */
      axios.get("/goods").then(res => {
        // console.log(res);
        this.goodsData = res.data.result.list;
      }).catch(err => {
        console.log("fail"+err);
      });
    },
    methods:{
      showFilterPop () {
        this.filterBy = true;
        this.overLayFlag = true;
      },
      setPriceFilter (index) {
        // 同时保证点击all时也关闭
        this.priceChecked = index;
        this.closePop();
      },
      closePop () {
        this.filterBy = false;
        this.overLayFlag = false;
      }
    }
}
</script>
