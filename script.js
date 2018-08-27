function elem(el) {
    return document.getElementById(el);
}

function makePostData(args) {
    var data = [];
    Object.keys(args).forEach(function(key) {
        data.push(encodeURIComponent(key) + '=' + encodeURIComponent(args[key]));
    });
    return data.join('&').replace(/%20/g, '+');
}

function post(url, args, done) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var data = xhr.response;
            done(data);
        }
    }
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.responseType = "json";
    var postData = makePostData(args);
    xhr.send(postData);
}

function get(url, done) {
  var request = new XMLHttpRequest();
  request.open('GET', url, true);

  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      var data = JSON.parse(request.responseText);
      done(data);
      console.log(request.getAllResponseHeaders());
    } else {
      console.log("Error with get request");
    }
  };

  request.onerror = function() {
    // There was a connection error of some sort
  };

  request.send();
}

function fetch_followings(base_url, user_id, done){
  get(base_url+'/api/v1/accounts/'+user_id+'/followers?limit=80&access_token='+localStorage.getItem("MASTODON_ACCESS_TOKEN"), done);
}

document.addEventListener("DOMContentLoaded", function(event) {
  /* main */
  var redirect_uri = "https://mastoviz.glitch.me/";
  var mastodon_url = localStorage.getItem("MASTODON_URL");
  var client_id = localStorage.getItem("MASTODON_CLIENT_ID");
  var client_secret = localStorage.getItem("MASTODON_CLIENT_SECRET");
  if (window.location.href.indexOf("?code=") !== -1 && mastodon_url != "" && client_id != "" && client_secret != "") {
    elem("mastodon_url").value = mastodon_url;
    var code = window.location.href.replace(window.location.origin+window.location.pathname+"?code=", "");
    var url2 = mastodon_url+"/oauth/token";
    var args2 = {client_id: client_id,
                 client_secret: client_secret,
                 redirect_uri: redirect_uri,
                 grant_type: "authorization_code",
                 code: code};
    post(url2, args2, function(data) {
      localStorage.setItem("MASTODON_ACCESS_TOKEN", data.access_token);
      get(localStorage.getItem("MASTODON_URL")+"/api/v1/accounts/verify_credentials/?access_token="+localStorage.getItem("MASTODON_ACCESS_TOKEN"), (user) => {
        localStorage.setItem("MASTODON_USER", user.id);
      });
    })
  }
  if (localStorage.getItem("MASTODON_URL")) elem("mastodon_url").value = localStorage.getItem("MASTODON_URL");
  elem("sbmt").addEventListener("submit", function(event) {
    event.preventDefault();
    var url = elem("mastodon_url").value+"/api/v1/apps";
    var scopes = "read";
    var args = {client_name: "Mastoviz",
                redirect_uris: redirect_uri,
                website: "https://mastoviz.glitch.me/",
                scopes: scopes};
    post(url ,args, function(data) {
      localStorage.setItem("MASTODON_URL", elem("mastodon_url").value);
      localStorage.setItem("MASTODON_CLIENT_ID", data.client_id);
      localStorage.setItem("MASTODON_CLIENT_SECRET", data.client_secret);
      var redirectLink = elem("mastodon_url").value+"/oauth/authorize?client_id="+data.client_id+"&redirect_uri="+redirect_uri+"&response_type=code&scope=" + scopes;
      window.location.href = redirectLink;
    });
  });
  elem("btn_clr").addEventListener("click", function(event) {
    elem("mastodon_url").value = "";
    localStorage.removeItem("MASTODON_USER");
    localStorage.removeItem("MASTODON_URL", "");
    localStorage.removeItem("MASTODON_ACCESS_TOKEN", "");
    localStorage.removeItem("MASTODON_CLIENT_ID", "");
    localStorage.removeItem("MASTODON_CLIENT_SECRET", "");
  });
  elem("btn_load").addEventListener("click", function(event) {
    fetch_followings(localStorage.getItem("MASTODON_URL"), localStorage.getItem("MASTODON_USER"), console.log)
  });
});