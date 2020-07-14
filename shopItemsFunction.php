<?php
  function createShopItemsByArray(){
    // errorログ表示
    ini_set("display_errors", "On");
    error_reporting(E_ALL & ~E_NOTICE);

    // Mysqlクラス読み込み
    require "./mysqlClass.php";  
    $mysqlClient = new MysqlClient("localhost", "clickergame", "localadmin", "maap1029" );
    $mysqlClient -> tryConnectToMysql();
    $stmt = $mysqlClient -> fetchAllShopItems();

    $shopItemsList = array();
    while( $row = $stmt -> fetch( PDO::FETCH_ASSOC )){
      $shopItemsList[] = array(
        "id"             => $row["id"],
        "name"           => $row["name"],
        "price"          => $row["price"],
        "increaseValue"  => $row["increaseValue"],
        "isPerSecValue"  => $row["isPerSecValue"] == "1" ? true : false, 
        "overView"       => $row["overView"] 
      );
    }

    return $shopItemsList;
  }
?>
