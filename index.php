<?php
  // error 表示
  ini_set("display_errors", "On");
  error_reporting(E_ALL & ~E_NOTICE);

  // shopItem取得
  require "./shopItemsFunction.php";
  $shopItemsList = createShopItemsByArray();
?>
<!DOCTYPE html>
<html lang="ja">

  <head>
    <?php
      $headHedder = file_get_contents("http://sunou2431.work/headHedder.html");
      echo $headHedder;
    ?>
    <link rel="stylesheet" href="./cookie.css" type="text/css">

    <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
    <script src="https://unpkg.com/vue-router/dist/vue-router.js"></script>
    <script src="./cookieClient.js"></script>
    <script src="./game.js"></script>
    <script type="text/javascript">
      var shopItemsList = <?php echo json_encode($shopItemsList); ?>;
    </script>

  </head>

  <body>
    <?php
      // ヘッダー描画
      $hedder = file_get_contents("http://sunou2431.work/hedder.html");
      echo $hedder;
    ?>

    <div class="mainContents" id="mainContent">
      <div class="container">
        <div class="row">
          <div class="col-lg-6 col-md-6 col-xs-12 click">
            <input v-model="clickerName" class="click-name">
            <div class="click-have-count">{{ haveCount }}</div>
            <div class="click-view-data">自動生産量:{{ increasePerSecondValue }} | クリック生産量:{{ increaseClickValue }}</div>
            <div class="button-area" @click="clickCount"></div>
          </div>

          <div class="col-lg-6 col-md-6 col-xs-12">
            <div class="router-hedder">
              <router-link to="/shopItems">施設購入</router-link>
              <router-link to="/settings">設定</router-link>
            </div>
            <router-view
              :buy-count="buyCount"
              :shop-items="shopItems"
              @want-to-buy-item="canBuyItem"
              @save-to-cookie="saveToCookiePerMinute"
            >
            </router-view>
          </div>
          <div id="message-space" class="message-space">
          </div>
        </div>
      </div>
    </div>
  </body>
</html>
