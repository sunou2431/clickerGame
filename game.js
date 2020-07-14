window.onload = function(){
  const templateHTML = `
    <div class="shop-menu" @click="wantToBuyItem">
      <span class="shop-menu-item-name">名前:{{ shopItem.name }}</span>
      <span class="shop-menu-item-price">値段:{{ shopItem.price }}</span>
      <span class="shop-menu-buy-count">購入個数:{{ buyCount }}</span>
      <span class="shop-menu-overview">{{ shopItem.overView }}</span>
      <span class="shop-menu-which-add" v-if="shopItem.isPerSecValue">自動生産量が上がる</span>
      <span class="shop-menu-which-add" v-else>クリック生産量が上がる</span>
    </div>
  `;
  
  const shopItemsComponent = Vue.component("shop-items", {
    props: {
      shopItem: Object,
      buyCount: Number,
      index: Number
    },
    data: function(){
      return {
      }
    },
    methods: {
      wantToBuyItem: function(){
        this.$emit("want-to-buy-item", this.shopItem.id, this.index);
      }
    },
    created: function(){
      if( this.buyCount == null ){
        this.test = 0;
      }
    },
    template: templateHTML
  });

  const game = new Vue({
    el: "#mainContent",
    data: {
      clickerName: "名無し", 
      haveCount: 0, 
      shopItems: shopItemsList,
      buyCount: {},
      increasePerSecondValue: 1,
      increaseClickValue: 1,
      timeObjForMake: null,
      timeObjForSave: null,
      cookie: new CookieData
    },
    methods: {
      // クリックしたら、個数が増える
      clickCount: function(){
        this.haveCount += this.increaseClickValue;
      },

      // アイテム購入処理
      canBuyItem: function(id, index){
        const shopItem = this.shopItems.find((value) => value.id === id);
        if( shopItem.price <= this.haveCount ){
          this.haveCount = this.haveCount - shopItem.price;
          if( shopItem.isPerSecValue ){
            this.increasePerSecondValue += parseInt( shopItem.increaseValue );
          }
          else{
            this.increaseClickValue += parseInt( shopItem.increaseValue );
          }
          this.buyCount[id]++;
          shopItem.price = parseInt( shopItem.price * 1.15 );
        }
      },

      // 毎秒作る
      increaseCountPerSecond: function(){
        this.haveCount += this.increasePerSecondValue;
      },

      // 一分置きにCookieにデータを保存
      saveToCookiePerMinute: function(){
        this.cookie.saveToCookie(["haveCount",
                                  "clickerName",
                                  "buyCount",
                                  "increaseClickValue",
                                  "increasePerSecondValue"
                                 ], this._data );
      },

      // Cookieのデータを読み込み
      loadForCookie: function(){
        const cookieDatas = CookieData.getCookieDatasHash();
        for( let key in cookieDatas ){
          if( this._data[key] == null ){ 
            continue;
          }
          // そのまま格納すると少々不都合があるため、データ処理をする。
          // 該当のところを確認する。
          switch( typeof this._data[key] ){
            // 文字列型で認識してしまうため、Int型として読み込む
            case "number":
              this._data[key] = parseInt( cookieDatas[key] );
              break;
            // JSON型で保存しているが、String型で読み込んでしまうため連想配列にする
            case "object": 
              this._data[key] = JSON.parse( cookieDatas[key] );
              break;
            default:
              this._data[key] = cookieDatas[key];
          }
        }
      },

      // 値段の登録
      setBuyCount: function(){
        for( let i = 0; i < this.shopItems.length ; i++ ){
          this.buyCount[ this.shopItems[i].id ] = this.buyCount[ this.shopItems[i].id ] || 0;
        }
      },

      setShopItemsPrice: function(){
        for( let key in this.buyCount ){
          const shopItem = this.shopItems.find((value) => value.id === key);
          shopItem.price = this.priceIncrease( shopItem.price, this.buyCount[ key ] );
        }
      },

      priceIncrease: function(price, count){
        if( count == 0 ){
          return price;
        }
        return parseInt( this.priceIncrease( price, count-1) * 1.15 );
      }  
    },
    // 作成時に実行される処理
    created: function(){
      let self = this;
      // 毎秒, 毎分実行したい処理の設定
      this.timerObjForMake = setInterval( function(){ self.increaseCountPerSecond() }, 1000);
      this.timerObjForSave = setInterval( function(){ self.saveToCookiePerMinute() }, 1000 * 60 );

      this.loadForCookie();
      this.setBuyCount();
      this.setShopItemsPrice();
    },
    components: {
      "shop-items": shopItemsComponent
    }
  });
};  
