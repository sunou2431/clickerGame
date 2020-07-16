class CookieData{
  constructor(){
    const timeLimit = 60; // Cookieの有効期限　とりあえず2か月(60日)
    const nowDate = new Date();
    nowDate.setTime( nowDate.getTime() + timeLimit * 24 * 60 * 60 * 1000 ); // 2か月後のデータを作成
    const timeLimitDate = nowDate.toGMTString(); //GMT形式に変換
    const expires = "expires=" + timeLimitDate + "; ";
    const path = "path=/; ";
    const samesite = 'sameSite=lax';

    this.suffix = expires + path + samesite;
  }

  saveToCookie(saveKeys, datas){
    var saveStr = "";
    for( let i = 0; i < saveKeys.length; i++){
      switch( typeof datas[ saveKeys[i]] ){
        case "object":
          saveStr = saveKeys[i] + "=" + encodeURIComponent( JSON.stringify( datas[saveKeys[i]] )) + "; ";
          break; 
        default:
          if( saveKeys[i] == "lastTime" ){
            saveStr = saveKeys[i] + "=" + Date.now() + "; ";
          }
          else{
            saveStr = saveKeys[i] + "=" + encodeURIComponent( datas[saveKeys[i]] ) + "; ";
          }
      }
      
      document.cookie = saveStr + this.suffix;
    }
  }

  // クッキーからデータを取得し、それをHashにして返す。
  static getCookieDatasHash(){
    var cookieDatas = {};
    if( document.cookie != '' ){
      const splitDatas = document.cookie.split("; ");
      for( let i = 0; i < splitDatas.length; i++){
        const splitData = splitDatas[i].split("=");
        cookieDatas[ splitData.splice(0, 1)] = decodeURIComponent( splitData.join("="));
      }
    }
    return cookieDatas;
  }
}

