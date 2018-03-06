var map;
  function init(){
// initiate leaflet map
map = new L.Map('map', {
    center: [0,10],
    zoom: 3
});

L.tileLayer("https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png", {
  attribution: '<a href="https://openup.org.za/" target="_blank">OpenUp</a>'
}).addTo(map);

var layerUrl = 'https://adi45.cartodb.com/api/v2/viz/1178935a-d175-11e5-bbae-0e31c9be1b51/viz.json';

var sublayers = [];

cartodb.createLayer(map, layerUrl)
.addTo(map)
.on('done', function(layer) {
  // change the query for the first layer
  var subLayerOptions = {
    sql: "SELECT * FROM african_university_presses",
    interactivity:"university_carto, scholarly_publisher_carto, facebook_carto, twitter_carto, url_carto, repository_carto, open_access_carto, most_recent_carto, image_url_carto, type_carto",
  };

var sublayer = layer.getSubLayer(0);
sublayer.set(subLayerOptions);

sublayer.on('featureClick', function(e, latlng, pos, data, subLayerIndex) {
  var university = data.university_carto;
  var scholarly_publisher = data.scholarly_publisher_carto;
  if (data.url_carto) {
    var url = '<li><i class="fa-li fa fa-link"></i>' + data.url_carto + '</li>';
  } else {
    var url = '';
  };

  if (data.twitter_carto) {
    var twitter = '<li><i class="fa-li fa fa-twitter"></i>' + data.twitter_carto + '</li>';
  } else {
    var twitter = '';
  };

  if (data.facebook_carto) {
    var facebook = '<li><i class="fa-li fa fa-facebook"></i>' + data.facebook_carto + '</li>';
  } else {
    var facebook = '';
  };

  if (data.open_access_carto) {
    var open_access = '<li><i class="fa-li fa fa-folder-open"></i>Open access? ' + data.open_access_carto + '</li>';
  } else {
    var open_access = '';
  };

  if (data.image_url_carto) {
    image = '<img src="' + data.image_url_carto + '">';
  } else {
    image = '';
  }

  var title = '<div class="title">' + scholarly_publisher + '</div>';
  var details = '<ul class="fa-ul">' + url + twitter + facebook + open_access + '</ul></div>';

  info.innerHTML = title + details + image;
});

sublayer.on('mouseover', function() {
    $("#map").css('cursor', 'pointer');
});

sublayer.on('mouseout', function() {
    $("#map").css('cursor', 'auto');
});

sublayer.setInteraction(true);

    sublayers.push(sublayer);
  }).on('error', function() {
    //log the error
  })

  //we define the queries that will be performed when we click on the buttons, by modifying the SQL of our layer
  var LayerActions = {
    all: function(){
      sublayers[0].setSQL("SELECT * FROM african_university_presses");
      return true;
    },
    twitter: function(){
      sublayers[0].setSQL("SELECT * FROM african_university_presses WHERE twitter_carto != ''");
      return true;
    },
    facebook: function(){
      sublayers[0].setSQL("SELECT * FROM african_university_presses WHERE facebook_carto != ''");
      return true;
    },
    openaccess: function(){
      sublayers[0].setSQL("SELECT * FROM african_university_presses WHERE open_access_carto = 'yes'");
      return true;
    },
    url: function(){
      sublayers[0].setSQL("SELECT * FROM african_university_presses WHERE url_carto != ''");
      return true;
    },
    unipress: function(){
      sublayers[0].setSQL("SELECT * FROM african_university_presses WHERE type_carto = 'university press'");
      return true;
    },
    printing: function(){
      sublayers[0].setSQL("SELECT * FROM african_university_presses WHERE type_carto = 'printing press'");
      return true;
    },
    academic: function(){
      sublayers[0].setSQL("SELECT * FROM african_university_presses WHERE type_carto = 'academic publisher'");
      return true;
    },
    predatory: function(){
      sublayers[0].setSQL("SELECT * FROM african_university_presses WHERE type_carto = 'possible predatory publisher'");
      return true;
    },
    other: function(){
      sublayers[0].setSQL("SELECT * FROM african_university_presses WHERE type_carto = 'other'");
      return true;
    }
  }

  $('.button').click(function() {
    $('.button').removeClass('selected');
    $(this).addClass('selected');
    //this gets the id of the different buttons and calls to LayerActions which responds according to the selected id
    LayerActions[$(this).attr('id')]();
  });
}