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
            <a href="javascript:void(0)" 
              :class="{'default':true, 'cur':isDefault}"
              @click="sortMethod('default')"
            >Default</a>
            <a href="javascript:void(0)" 
              :class="{'price':true,'cur':isPrice}"
              @click="sortMethod('price')"
            >Price <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg></a>
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
                <!-- 加载插件 -->
                <div class="load-more" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="30">
                  <!-- 加载中。。。 -->
                  <img src="./../assets/loading-spinning-bubbles.svg" v-show="loading">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="md-overlay" v-show="overLayFlag" @click="closePop"></div>
      <nav-footer></nav-footer>
    </div>
</template>
<style scoped>
  .load-more {
    margin: 0 auto;
    height: 100px;
    width: 100px;
  }
</style>

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
              endPrice:100.00
            },
            {
              startPrice:100.00,
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
          overLayFlag:false,
          // 排序和分页
          isPrice:false,//设置样式
          isDefault:true,//设置样式
          page:1,
          pageSize:7,
          sort:true,
          // 控制是否启用滚动加载
          busy:true,
          // 默认不显示loading图片
          loading:false
        }
    },
    components:{
      NavHeader,
      NavFooter,
      NavBread
    },
    mounted () {
      // 默认加载default
      this.sortMethod('default');
      /*说明：
       *1.res对象必须通过data属性才能获取到数据_1
       *2.数据_1即后端配置的dataresult和error对象数据的返回
       *3.通过对dataresult的访问才获得json文件
       *4.最后通过.result才最终获取到result的数据
      */
    },
    methods:{
      showFilterPop () {
        this.filterBy = true;
        this.overLayFlag = true;
      },
      setPriceFilter (index) {
        // 同时保证点击all时也关闭
        this.priceChecked = index;
        this.page = 1;
        this.sort = 1;
        this.getGoodsList();
        // this.closePop();
      },
      closePop () {
        this.filterBy = false;
        this.overLayFlag = false;
      },
      // 排序与分页
      // flag 表示分页的标志
      getGoodsList(flag) {
        let url = "/goods/sort";
        let param = {
          page:this.page,
          pageSize:this.pageSize,
          sort:this.sort?1:-1,
          // 价格过滤
          priceLevel:this.priceChecked
        };
        // 接口还没有请求前，显示loading
        this.loading = true;
        axios.get(url,{params:param}).then(res => {
          // 接口请求完成后，不显示loading
          this.loading = false;
          // console.log(res);
          // 判断数据是否获取成功
          if(res.status == "200") {
            // 成功获取数据
            if(flag) {
              this.goodsData = this.goodsData.concat(res.data.result.list);
              // 判断是否还有数据加载
              if(res.data.result.count === 0) {
                this.busy = true;
              }else {
                this.busy = false;
              }
            }else {
              this.goodsData = res.data.result.list;
              this.busy = false;//开始启用
            }
          }else {
            // 否则为空
            this.goodsData = [];
          }
        }).catch(err => {
          console.log("fail"+err);
        });
      },
      sortMethod (flag)  {
        // 加载排序的方式
        if(flag == "price") {
          this.isPrice = true;
          this.isDefault = false;
          this.sort = !this.sort;
          // 从低到高排序
          this.getGoodsList();
        }else if(flag == 'default') {
          // 加载default的方式
          this.isPrice = false;
          this.isDefault = true;
          this.sort = false;//重置第一次排序
          axios.get("/goods").then(res => {
            // console.log(res);
            this.goodsData = res.data.result.list;
          }).catch(err => {
            console.log("fail"+err);
          });
        }else {
          // 发生未知错误
          alert("Wrong, unexpected error");
        }
      },
      // 滚动加载的方法
      loadMore () {
        this.busy = true;
        // 由于scroll有很多请求，不能直接使用
        setTimeout(() => {
          this.page++;
          this.getGoodsList(true);
        },500);
      }
    }
}
</script>
