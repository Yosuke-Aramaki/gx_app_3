
let siteData = {"title": "", "url": "", "og_image": "", "article_note": ""}
let user_id
let article_data
var xhr = new XMLHttpRequest();

// chrome Extension 起動時
window.addEventListener('load',　async ()=>{

  // 開いてるタブのタイトルとURLを取得する
  await chrome.tabs.getSelected( tab => { 
    siteData.title = tab.title;
    siteData.url = tab.url;  
  });

  // chrome storage にユーザー情報があるか確認
  await chrome.storage.sync.get(['user_id'], async (result) => {
    // ログインしてない時の処理
    if (!Object.keys(result).length) { 
      // ログイン画面の挿入
      document.getElementById('body_contents').innerHTML = '<input type="email" id="email_input" placeholder="Enter email"><input type="password" id="password_input" placeholder="Password"><button type="submit" id="loginButton">Log In</button><a href="localhost:3000/" target="_blank">新規登録はこちらから</a>'
      // ログイン通信
      document.getElementById('loginButton').addEventListener('click', ()=>{
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = async function(){
          if(this.readyState == 4 && this.status == 200){
            let login_session = this.response;
            // chrome strage にユーザー情報を保存
            await chrome.storage.sync.set({user_id: login_session.user_id}, function() {
              console.log('Value is set to ' + login_session.user_id);
            });
            location.reload();
          }
        }
        // 通信のリクエスト 参照：https://qiita.com/sirone/items/412b2a171dccb11e1bb6
        xhr.open("post", "http://localhost:3000/api/v1/login", true);
        xhr.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded');
        xhr.responseType = 'json';
        // サーバーへリクエストの送信
        xhr.send(
          'session[email]='+ document.getElementById("email_input").value +
          '&session[password]=' + document.getElementById("password_input").value
        );
      });
    } else {　
      // ログイン時の処理
      user_id = result.user_id;

      // タブのタイトルを表示
      document.getElementById('og_title_section').textContent = siteData.title;
      
      // og:imageとog:descriptionの取得
      await fetch(siteData.url).then(res => res.text()).then(text => {
        const el = new DOMParser().parseFromString(text, "text/html")
        const headEls = (el.head.children)
        Array.from(headEls).map(v => {
          const prop = v.getAttribute('property')
          if (!prop) return;
          if (prop == "og:image") {
            siteData.og_image = v.getAttribute("content")
            document.getElementById('og_image').src = siteData.og_image
          }
          if (prop == "og:description") {
            siteData.article_note = v.getAttribute("content")
          }
        })
      })

      // 同じURLが保存されているかの確認
      xhr.open("get", "http://localhost:3000/api/v1/already_saved?" + 'article_url=' + siteData.url, true);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xhr.setRequestHeader('Authorization', 'Token ' + user_id);
      xhr.responseType = 'json';
      xhr.send();
      xhr.onload = async () => {
        article_data = await xhr.response 

        // タブで開いているURLがまだ保存されていない場合の処理
        if (article_data == null) {
          // タブで開いている記事の保存
          xhr.open("post", "http://localhost:3000/api/v1/articles", true);
          xhr.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded');
          xhr.setRequestHeader('Authorization', 'Token ' + user_id);
          xhr.responseType = 'json';
          // サーバーへリクエストの送信
          xhr.send(
            'article[title]='+ siteData.title +
            '&article[article_url]=' + siteData.url +
            '&article[og_image_url]=' + siteData.og_image +
            '&article[article_note]=' + siteData.article_note +
            '&article[category_id]=' + 1
          );
          xhr.onload = ()=> {
            article_data = xhr.response 
            // 記事を保存できたことを通知
            document.getElementById('save_notification').textContent = '記事を保存しました';
          };

        // タブで開いているURLがすでに保存されている場合（サービスサイトからリンクを開いた場合）
        } else {
          // メモを追加するを非表示
          document.getElementById('note_section_title').style.display = 'none';
          // メモ記入欄の表示
          document.getElementById('note_textarea').style.display = 'inline-block';
          // メモ記入欄に既存のメモを表示する
          document.getElementById('note_textarea').textContent = article_data.article_note;
        }
      };

      // メモを追加を押した時にテキストエリアが表示される
      document.getElementById('note_section_title').addEventListener('click', ()=>{
        document.getElementById('note_textarea').style.display = 'inline-block';
      })

      // メモを保存
      document.getElementById('article_save_button').addEventListener('click', ()=>{
        
        xhr.open("put", "http://localhost:3000/api/v1/articles/" + article_data.id , true);
        xhr.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded');
        xhr.setRequestHeader('Authorization', 'Token ' + user_id);
        // サーバーへリクエストの送信
        xhr.send(
          '&article[article_note]=' + document.getElementById("note_textarea").value +
          '&article[category_id]=' + 1
        );
        xhr.onload = ()=> {
          // 記事を保存できたことを通知
          if (xhr.readyState == 4 && xhr.status == "200") {
            document.getElementById('save_notification').textContent = 'メモを保存しました';
          } else {
          }
        };
      })

      // 保存しているURLを削除する
      document.getElementById('delete_section_title').addEventListener('click', ()=>{
        xhr.open("DELETE", "http://localhost:3000/api/v1/articles/" + article_data.id , true);
        xhr.setRequestHeader('Authorization', 'Token ' + user_id);
        xhr.send();
        xhr.onload = () => {
          if (xhr.readyState == 4 && xhr.status == "200") {
            document.getElementById('save_notification').textContent = '削除しました';
          } else {
          }
        }
      })

      // 未読にする
      document.getElementById('article_unread_button').addEventListener('click', ()=>{
        // xhr.open("PUT", 'http://localhost:3000/api/v1/articles/' + article_data.id + '/update_is_read?' + 'is_read=0', true);
        // xhr.setRequestHeader('Authorization', 'Token ' + user_id);
        // xhr.send();
        // xhr.onload = () => {
        //   if (xhr.readyState == 4 && xhr.status == "200") {
        //     document.getElementById('save_notification').textContent = '未読にしました';
        //   } else {
        //   }
        // }
        xhr.open("put", "http://localhost:3000/api/v1/articles/" + article_data.id , true);
        xhr.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded');
        xhr.setRequestHeader('Authorization', 'Token ' + user_id);
        // サーバーへリクエストの送信
        xhr.send(
          '&article[article_note]=' + document.getElementById("note_textarea").value +
          '&article[category_id]=' + 1 + 
          '&article[is_read]=' + 0
        );
        xhr.onload = ()=> {
          // 記事を保存できたことを通知
          if (xhr.readyState == 4 && xhr.status == "200") {
            document.getElementById('save_notification').textContent = 'メモを保存しました';
          } else {
          }
        };
      })

      // ログアウト
      document.getElementById('logout_extension').addEventListener('click', ()=>{
        chrome.storage.sync.remove(['user_id'], function() {
        });
      })
    }
  });
})