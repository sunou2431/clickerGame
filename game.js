// messageスペースに表示される。
function messageView( str ){
  $("#message-space").html(str);
  $("#message-space").show( 1000 );
  $(function(){
    setTimeout( function(){
      $("#message-space").hide(1000);
    }, 5000);
  });
}
$("#message-space").css("display", "none");

window.onload = function(){
  /////////////////////////////////////
  // コンポーネントの設定 /////////////
  /////////////////////////////////////
  // ショップアイテムのコンポーネント
  // ここらへんも別ファイル化したい
  const shopItemsHTML = `
    <div class="shop-menu">
      <div class="shop-menu-list" @click="wantToBuyItem">
        <div class="shop-menu-list-item-image">img</div>
        <span class="shop-menu-list-item-name">{{ shopItem.name }}</span>
        <span class="shop-menu-list-item-price">値段:{{ shopItem.price }}</span>
        <span class="shop-menu-list-buy-count">{{ buyCount }}</span>
      </div>
      <div class="shop-menu-balloon">
        <div class="shop-menu-balloon-overview">{{ shopItem.overView }}</div>
        <div class="shop-menu-balloon-which-add" v-if="shopItem.isPerSecValue">自動生産量が{{ shopItem.increaseValue }}上がる</div>
        <div class="shop-menu-balloon-which-add" v-else>クリック生産量が{{ shopItem.increaseValue }}上がる</div>
      </div>
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
    },
    template: shopItemsHTML
  });

  //////////////////////////////////////////////////////////////////////////////////////
  // router-viewで表示させるためのview設定。
  const shopItemsBaseHTML = `
    <div class="shop-menu-base">
      <p class="router-title">アイテム購入</p>
      <shop-items
        @want-to-buy-item="wantToBuyItem"
        v-for="(shopItem, index) in shopItems"
        :key="shopItem.id"
        :shop-item="shopItem"
        :buy-count="buyCount[shopItem.id]"
        :index="index"
        ref="shopItems">
      </shop-items>
    </div>
  `;

  const shopItemsBaseComponent = Vue.component("shop-items-base", {
    props: {
      shopItems: Array,
      buyCount: Object
    },
    components: {
      "shop-items": shopItemsComponent
    },
    methods: {
      wantToBuyItem: function(id, index){
        this.$emit("want-to-buy-item", id, index);
      }
    },
    template: shopItemsBaseHTML
  });

  ////////////////////////////////////////////////////////////////////////////////
  // ユニークアイテムショップのコンポーネント。ここら辺も別ファイル化したい
  const shopUniqueItemsHTML = `
    <div class="shop-unique-items">
    </div>
  `;

  const shopUniqueItemsComponent = Vue.component("shop-unique-items", {
    template: shopUniqueItemsHTML
  });

  //////////////////////////////////////////////////////////////////////////////////
  // ログインするためのコンポーネント
  const loginUserHTML = `
    <div class="login-user-form">
      <p> TEST </p>
    </div>
  `;

  const loginUserComponent = Vue.component("login-user-form", {
    template: loginUserHTML
  });

  /////////////////////////////////////////////////////////////////////////////////
  // ユーザー作成のためのコンポーネント
  const createUserHTML = `
    <div class="create-user-form">
      <p> TEST2 </p>
    </div>
  `;

  const createUserComponent = Vue.component("create-user-form", {
    template: createUserHTML
  });

  ////////////////////////////////////////////////////////////////////////////////
  // セッティングするためのコンポーネント
  const settingsHTML = `
    <div class="settings">
      <p class="router-title">設定</p>
      <input type="Button" @click="saveToCookie" value="セーブする">
      <div class="user-form">
        <div class="user-form-router">
          <router-link to="/settings/login">ログイン</router-link>
          <router-link to="/settings/create">ユーザー作成</router-link>
        </div>
        <router-view>
        </router-view>
      </div>
    </div>
  `;

  const settingsComponent = Vue.component("settings", {
    methods: {
      saveToCookie: function(){
        this.$emit("save-to-cookie");
      }
    },
    template: settingsHTML
  });

  //////////////////////////////////////////////////////////////////////
  // ルーティングの設定 ///////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////
  const routes = [
    { path: "",                 component: shopItemsBaseComponent },
    { path: "/shopItems",       component: shopItemsBaseComponent },
    { path: "/shopUniqueItems", component: shopUniqueItemsComponent },
    { path: "/settings",        component: settingsComponent, 
      children: [
        { path: "create", component: createUserComponent },
        { path: "login",  component: loginUserComponent },
        { path: "",       component: loginUserComponent }
      ]
    }
  ];

  const router = new VueRouter({
    routes
  });

  ////////////////////////////////////////////////////////////////////
  // メインゲームの設定や描画 /////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////
  const game = new Vue({
    el: "#mainContent",
    data: {
      clickerName: "名無し", 
      haveCount: 0, 
      shopItems: shopItemsList,
      buyCount: {},
      increasePerSecondValue: 0,
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
                                  "increasePerSecondValue",
                                  "lastTime"
                                 ], this._data );
        messageView("セーブしました");
      },

      // Cookieのデータを読み込み
      loadForCookie: function(){
        const cookieDatas = CookieData.getCookieDatasHash();
        for( let key in cookieDatas ){
          if( this._data[key] == null ){
            // 最終ログイン時間が入力されていた場合、自動生産する
            if( key == "lastTime" ){
              this.productLeavingCount( cookieDatas );
            }
            continue;
          }
          // そのまま格納すると少々不都合があるため、データ処理をする。
          // 該当のところを確認する。
          switch( typeof this._data[key] ){
            // 文字列型で認識してしまうため、Int型として読み込む
            case "number":
              // 初期値の1のせいでセーブロードで永遠に増えてしまう為の対策
              if( key == "increaseClickValue" ){
                this._data[key] += parseInt( cookieDatas[key] ) - 1;
                break;
              }
              this._data[key] += parseInt( cookieDatas[key] );
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

      // 放置期間の生産を増やす
      productLeavingCount: function( cookieDatas ){
        const betweenLastPlayTime = parseInt( ( Date.now() - cookieDatas["lastTime"] ) / 2000 ); //ログインしなかった時間/2の自動精算を獲得
        // クッキーデータの自動生産量が０もしくは存在しないときは処理をしない
        if( !( cookieDatas["increasePerSecondValue"] == 0 || cookieDatas["increasePerSecondValue"] == null) ){
          const makeCount = cookieDatas["increasePerSecondValue"] * betweenLastPlayTime;
          this._data["haveCount"] += parseInt( makeCount );
          // 直接実行だとなぜかうまくできないから、delayを噛ませる
          $(function(){
            setTimeout( function(){
              messageView( "放置期間中に" + makeCount + "個の生産を行いました。" );
            }, 100);
          });
        }
      },

      // buyCountに未登録の商品IDを0にする。
      setBuyCount: function(){
        for( let i = 0; i < this.shopItems.length ; i++ ){
          this.buyCount[ this.shopItems[i].id ] = this.buyCount[ this.shopItems[i].id ] || 0;
        }
      },

      // 商品の値段を計算する。
      // Cookieに保存する方法も考えたけど…
      setShopItemsPrice: function(){
        for( let key in this.buyCount ){
          const shopItem = this.shopItems.find((value) => value.id === key);
          shopItem.price = this.priceIncrease( shopItem.price, this.buyCount[ key ] );
        }
      },

      // 再帰関数で値段を求めていく
      // 引数 : price => int : 商品の値段
      //      : count => int : 買った商品の個数
      // 返り : int          : 1.15倍した数値。切り下げ
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

      this.loadForCookie(); // クッキーからのデータ取得
      this.setBuyCount();   // 未購入の商品はnullになっているため0を埋める
      this.setShopItemsPrice(); // 商品の値段の計算
    },
    components: {
      "shop-items": shopItemsComponent
    },
    router
  });
}

