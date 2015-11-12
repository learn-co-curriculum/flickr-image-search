'use strict';

var app = {};

// Image Model

app.Image = function (farm, server, id, secret) {
  this.farm = farm;
  this.server = server;
  this.id = id;
  this.secret = secret;
  this.url = 'http://farm'+this.farm+'.staticflickr.com/'+this.server+'/'+this.id+'_'+this.secret;
  this.imageElement = '<img src="'+this.url+'_s.jpg" alt="fancy-gallery">';
  this.linkElement = '<a href="'+this.url+'.jpg" rel="fancy-gallery">'+this.imageElement+'</a>';
};

// Search Model

app.Search = function (keyword, view) {
  this.keyword = keyword;
  this.view = view;
  this.imageCollection = [];
  this.constructor.all.push(this);
};
app.Search.prototype.apiEndpoint = function () {
  return 'https://api.flickr.com/services/rest/?format=json&method=flickr.photos.search&api_key=2fd41b49fedfd589dc265350521ab539&tags='+this.keyword+'&jsoncallback=?';
};
app.Search.prototype.getData = function () {
  var self = this;
  $.getJSON(self.apiEndpoint(), function (json) {
    console.log(json); //see if results came in...
    $.each(json.photos.photo, function(i,photo) {
      var image = new app.Image(photo.farm, photo.server, photo.id, photo.secret);
      self.imageCollection.push(image);
      self.view.appendImage(image);
    });
  });
};
app.Search.all = [];

// Search View

app.SearchView = function () {
  this.listen();
};
app.SearchView.prototype.el = {
  $keyword: $('#keyword'),
  $feed   : $('#feed'),
  $search : $('#search')
};
app.SearchView.prototype.createSearch = function () {
  this.model = new app.Search(this.el.$keyword.val(), this);
  this.model.getData();
};
app.SearchView.prototype.appendImage = function (image) {
  this.el.$feed.append(image.linkElement);
  this.el.$feed.find('a').fancybox();
};
app.SearchView.prototype.listen = function () {
  var self = this;
  // create new searches
  this.el.$search.click(function(){
    self.createSearch();
  });
  // clear input and feed
  this.el.$keyword.focus(function(){
    self.el.$feed.html('');
    self.el.$keyword.val('');
  });
};

$(document).ready(function(){
  new app.SearchView(); // spin up a new search view.
});