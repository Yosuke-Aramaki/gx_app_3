
let siteData = {"title": "", "url": "", "og_image": ""}

chrome.tabs.getSelected( tab => { 
  siteData.title = tab.title;
  siteData.url = tab.url;    
});

// chrome Extension 起動時
window.addEventListener('load',()=>{  
  console.log(1)
  chrome.tabs.getSelected( tab => { 
    siteData.title = tab.title;
    siteData.url = tab.url;  
    console.log(tab.url)  
  });

  document.getElementById('og_title_section').textContent = siteData.title;
  const url = siteData.url;
  fetch(url).then(res => res.text()).then(text => {
    const el = new DOMParser().parseFromString(text, "text/html")
    const headEls = (el.head.children)
    Array.from(headEls).map(v => {
      const prop = v.getAttribute('property')
      if (!prop) return;
      if (prop == "og:image") {
        siteData.og_image = v.getAttribute("content")
        document.getElementById('og_image').src = siteData.og_image
      }
    })
  })

  // ログイン
  document.getElementById('loginButton').addEventListener('click', ()=>{
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = async function(){
      if(this.readyState == 4 && this.status == 200){
        let login_session = this.response;
        // chrome strage にユーザー情報を保存
        await chrome.storage.sync.set({user_id: login_session.user_id}, function() {
          console.log('Value is set to ' + login_session.user_id);
        });
      }
    }
    // 通信のリクエスト 参照：https://qiita.com/sirone/items/412b2a171dccb11e1bb6
    xhr.open("post", "http://localhost:3000/api/v1/login", true);
    xhr.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' );
    xhr.responseType = 'json';
    // サーバーへリクエストの送信
    xhr.send(
      'session[email]='+ document.getElementById("email_input").value +
      '&session[password]=' + document.getElementById("password_input").value
    );
  });
})

// chrome.storage.sync.remove(['user_id'], function() {
//   chrome.storage.sync.get(['user_id'], function(result) {
//     console.log('Value currently is ' + result.user_id);
//   });
// });