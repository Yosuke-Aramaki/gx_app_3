// chrome Extension 起動時
window.addEventListener('load',　async ()=>{

  var xhr = new XMLHttpRequest();

  // chrome storage にユーザー情報があるか確認
  await chrome.storage.sync.get(['session_token'], async (result) => {
    // ログインしてない時の処理
    if (!Object.keys(result).length) { 
      
      // ログイン画面に切り替える
      // document.getElementById('body_contents').innerHTML = '<input type="email" id="email_input" placeholder="Enter email"><input type="password" id="password_input" placeholder="Password"><button type="submit" id="signin_button">Log In</button><a href="localhost:3000/" target="_blank">新規登録はこちらから</a>'
      document.getElementById('body_contents').style.display = 'none';

      // ログイン通信
      document.getElementById('signin_button').addEventListener('click', ()=>{
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = async function(){
          if(this.readyState == 4 && this.status == 200){
            // chrome strage にユーザー情報を保存
            console.log(this.response.token)
            await chrome.storage.sync.set({session_token: this.response.token}, function() {
              location.reload();
            });
          }
        }
        // 通信のリクエスト 参照：https://qiita.com/sirone/items/412b2a171dccb11e1bb6
        xhr.open("post", "http://localhost:3000/api/v1/signin", true);
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
      document.getElementById('signin_section').style.display = 'none';

      let siteData = {"title": "", "url": "", "og_image": "", "article_note": ""}
      let session_token
      let article_data

      // ユーザーIDを設定する
      session_token = result.session_token;

      // 開いてるタブのタイトルとURLを取得する
      await chrome.tabs.getSelected( async(tab) => { 
 
        // タブのタイトルを表示
        document.getElementById('og_title_section').textContent = tab.title;  
        
        // og:imageとog:descriptionの取得
        await fetch(tab.url).then(res => res.text()).then(text => {
          const el = new DOMParser().parseFromString(text, "text/html")
          const headEls = (el.head.children)
          Array.from(headEls).map(v => {
            console.log(v)
            const prop = v.getAttribute('property')
            if (!prop) return
            if (prop == "og:image") {
              siteData.og_image = v.getAttribute("content")
              document.getElementById('og_image').src = siteData.og_image
            }
            if (prop == "og:description") {
              siteData.article_note = v.getAttribute("content")
            }
          })
        })
        .catch((error) => { //サイトのスクレイピングがうまくいかない場合
          console.error('Error:', error);
          siteData.og_image = "images/default_image.ico" //　デフォルトのイメージの参照先の指定
          document.getElementById('og_image').src = "images/logo.ico"
          siteData.article_note = tab.title
          return
        });

        // 同じURLが保存されているかの確認
        xhr.open("get", "http://localhost:3000/api/v1/already_saved?" + 'article_url=' + tab.url, true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.setRequestHeader('Authorization', 'Token ' + session_token);
        xhr.responseType = 'json';
        xhr.send();
        xhr.onload = async () => {
          article_data = await xhr.response 

          // タブで開いているURLがまだ保存されていない場合の処理
          if (article_data == null) {

            // タブで開いている記事の保存
            xhr.open("post", "http://localhost:3000/api/v1/articles", true);
            xhr.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded');
            xhr.setRequestHeader('Authorization', 'Token ' + session_token);
            xhr.responseType = 'json';

            // サーバーへリクエストの送信
            xhr.send(
              'article[title]='+ tab.title +
              '&article[article_url]=' + tab.url +
              '&article[og_image_url]=' + siteData.og_image +
              '&article[article_note]=' + siteData.article_note +
              '&article[category_id]=' + 1
            );
            xhr.onload = ()=> {
              // 最初の保存は自動的に未読記事で
              document.getElementById('unread_button').classList.add('status_active');
              document.getElementById('read_button').classList.add('status_inactive');
              // 記事を保存できたことを通知
              document.getElementById('notification').textContent = '記事を保存しました';
              deleteNotification()
            };

          // タブで開いているURLがすでに保存されている場合
          } else {
            // メモを追加するを非表示
            document.getElementById('note_section').style.display = 'none';
            // メモ記入欄の表示
            document.getElementById('note_textarea').style.display = 'inline-block';
            // メモ記入欄に既存のメモを表示する
            document.getElementById('note_textarea').textContent = article_data.article_note;
            if (article_data.is_read == 0 ) {
              document.getElementById('unread_button').classList.add('status_active');
              document.getElementById('read_button').classList.add('status_inactive');
            } else {
              document.getElementById('read_button').classList.add('status_active');
              document.getElementById('unread_button').classList.add('status_inactive');
            }
            // その他オプションの表示
  
          }
        };
      });

      // メモを追加を押した時にテキストエリアが表示される
      document.getElementById('note_section').addEventListener('click', ()=>{
        document.getElementById('note_section').style.display = 'none';
        document.getElementById('note_textarea').style.display = 'inline-block';
      })

      // カテゴリリストの追加
      xhr.open("get", "http://localhost:3000/api/v1/categories", true);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xhr.setRequestHeader('Authorization', 'Token ' + session_token);
      xhr.responseType = 'json';
      xhr.send();
      xhr.onload = async () => {
        document.getElementById('category_list').style.display = 'inline-block';
        category_data = await xhr.response
        for (let i=0; i < category_data.length; i++) {
          document.getElementById('category_list').insertAdjacentHTML('beforeend','<option value=' + category_data[i].id + '>' + category_data[i].category_name + '</option>');
        }
      };

      // 記事の未読既読の切り替え
      var unread_button_element = document.getElementById('unread_button')
      var read_button_element = document.getElementById('read_button')
      unread_button_element.addEventListener('click', () => {
        if (unread_button_element.classList.contains('status_inactive')) {
          unread_button_element.classList.remove('status_inactive');
          read_button_element.classList.remove('status_active');
          unread_button_element.classList.add('status_active');
          read_button_element.classList.add('status_inactive');
        }
      })
      read_button_element.addEventListener('click', () => {
        if (read_button_element.classList.contains('status_inactive')) {
          read_button_element.classList.remove('status_inactive');
          unread_button_element.classList.remove('status_active');
          read_button_element.classList.add('status_active');
          unread_button_element.classList.add('status_inactive');
        }
      })

      // 保存しているURLを削除する
      document.getElementById('delete_section').addEventListener('click', ()=>{
        xhr.open("DELETE", "http://localhost:3000/api/v1/articles/" + article_data.id , true);
        xhr.setRequestHeader('Authorization', 'Token ' + session_token);
        xhr.send();
        xhr.onload = () => {
          if (xhr.readyState == 4 && xhr.status == "200") {
            document.getElementById('notification').textContent = '削除しました';
            document.getElementById('note_textarea').style.display = 'none';
            document.getElementById('category_section').style.display = 'none';
            document.getElementById('status_section').style.display = 'none';
            deleteNotification()
            setTimeout(function(){
              window.close()
            }, 5000);
          } else {
          }
        }
      })

      // 記事の保存
      document.getElementById('article_save_button').addEventListener('click', ()=>{
  
        xhr.open("put", "http://localhost:3000/api/v1/articles/" + article_data.id , true);
        xhr.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded');
        xhr.setRequestHeader('Authorization', 'Token ' + session_token);
        // サーバーへリクエストの送信
        xhr.send(
          '&article[article_note]=' + document.getElementById("note_textarea").value +
          '&article[category_id]=' + document.getElementById("category_list").value +
          '&article[is_read]=' + document.getElementsByClassName("status_active")[0].value 
        );
        xhr.onload = ()=> {
          // 記事を保存できたことを通知
          if (xhr.readyState == 4 && xhr.status == "204") {
            document.getElementById('notification').textContent = 'メモを保存しました';
            deleteNotification()
          } else {
          }
        };
      })

      // ログアウト
      document.getElementById('signout_extension').addEventListener('click', ()=>{
        chrome.storage.sync.remove(['session_token'], function() {
        });
      })
    }
  });
})

function deleteNotification() {
  setTimeout(function(){
    document.getElementById('notification').textContent = '';
  }, 5000);
}

async function get_og_contents(tab) {
  return new Promise((resolve, reject) => {

  })
}

async function save_article(tab) {
  return new Promise((resolve, reject) => {
    
  })
} 