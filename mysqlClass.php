<?php
  class MysqlClient{
    private $dbh = NULL; 
    private $dbHost;
    private $dbName;
    private $dbUser;
    private $dbPass;

    public function __construct( $_dbHost, $_dbName, $_dbUser, $_dbPass ){
      $this -> dbHost = $_dbHost;
      $this -> dbName = $_dbName;
      $this -> dbUser = $_dbUser;
      $this -> dbPass = $_dbPass;
    }

    // Mysqlに接続して状態を保持する
    public function tryConnectToMysql(){
      try{
        $this -> dbh = new PDO( "mysql:host=".$this->dbHost.";dbname=".$this->dbName.";charset=utf8mb4", $this->dbUser, $this->dbPass );
        $this -> dbh -> setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );
      }
      catch( PDOException $e ){
        echo $e -> getMessage();
        exit;
      }
    }

    public function fetchAllShopItems(){
      if( !$this -> dbh ){
        echo "DBに接続していません";
        return;
      }

      $stmt = $this -> dbh -> prepare( "SELECT * FROM shop_items ORDER BY id ASC" );
      $stmt -> execute();

      return $stmt;
    }
  }
?>
