  function loadGist(cb) {
   
      $.getJSON("https://gist.githubusercontent.com/karitotp/2de9e68191ee95343a929c1e9d7441cf/raw/7e71f339c93893b8ecc76dc3a2c1653c78d203aa/roads.geojson", function(data) {
        cb(data)
        $('#map').removeClass('loading');
      });
    
  }