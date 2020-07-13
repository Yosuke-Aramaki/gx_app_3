
let siteData = {"title": "", "url": "", "og_image": ""}

chrome.tabs.getSelected( tab => { 
  siteData.title = tab.title;
  siteData.url = tab.url;    
});

window.addEventListener('load',()=>{  
  
  chrome.tabs.getSelected( tab => { 
    siteData.title = tab.title;
    siteData.url = tab.url;    
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

  $("#loginButton").on("click", () => {
  // document.getElementById('loginButton').addEventListener('click',()=>{  // クリックされたときにテキストボックスに出力
    console.log(document.getElementById("email_address").value)
    // var xhr = new XMLHttpRequest();

    // var data = { session: { email: document.getElementById("email_address").value, password: document.getElementById("exampleInputPassword1").value } };
    // var json_date = JSON.stringify(data);
    // xhr.open("post", "http://localhost:3000/api/v1/login", true);
    // // サーバに対して解析方法を指定する
    // xhr.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' );
    // // データをリクエスト ボディに含めて送信する
    // xhr.send(json_date);
    // xhr.addEventListener("load", function(){ 
    //   console.log(this.response); 
    //   document.getElementById('sample').textContent = this.response;
    // }, false);

    $.ajax({
      method: "POST",
      url: "http://localhost:3000/api/v1/login",
      data: { name: {email: document.getElementById("email_address").value, password: document.getElementById("exampleInputPassword1").value } }
    })
    .done(function(result) {
      console.log(result);
      document.getElementById('sample').textContent = this.response;
    })
  });
})