<?php
  require "./shopItemsFunction.php";
  header( "Content-type: application/json" );
  $shopItemsList = createShopItemsByArray();
  echo json_encode( $shopItemsList, JSON_UNESCAPED_UNICODE );
?>
