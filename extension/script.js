
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
})