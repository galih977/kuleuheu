async function vanillaGetJSON(url, qs_params) {
    function buildQueryString(params) {
      return Object.entries(params)
        .map(d => `${d[0]}=${d[1]}`)
        .join("&");
    }
  
    return new Promise((resolve, reject) => {
      const qs = qs_params ? "?" + buildQueryString(qs_params) : "";
      const xhr = new XMLHttpRequest();
      xhr.open("GET", `${url}${qs}`);
  
      xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 400) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          resolve(xhr.responseText);
        }
      };
      xhr.onerror = () => reject(xhr.statusText);
      xhr.send();
    });
  }
  
  var globalObtainJson;
  vanillaGetJSON("/data/cardObtain.json").then(
    data => {
      globalObtainJson = data;
    }
  );
  
  function getGlobalObtainJson(){
      if(globalObtainJson) {
          return globalObtainJson;
      }
      else {
          var promise = new Promise(function(resolve, reject) {
            window.setTimeout(function() {
              resolve(getGlobalObtainJson());
            }, 200);
          });
          return promise;
      }
  };