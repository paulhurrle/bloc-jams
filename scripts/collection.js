var buildCollectionItemTemplate = function() {
     var template =
//this is a string containing the collection-album-container as a string, using
//the "+" sign to concatenate each line while still making it readable.
//By placing this content in quotation marks, the script will be stored in
//cache when the page loads, improving the load speed.
         '<div class="collection-album-container column fourth">'
       + '  <img src="assets/images/album_covers/01.png"/>'
       + '  <div class="collection-album-info caption">'
       + '    <p>'
       + '      <a class="album-name" href="album.html"> The Colors </a>'
       + '      <br/>'
       + '      <a href="album.html"> Pablo Picasso </a>'
       + '      <br/>'
       + '      X songs'
       + '      <br/>'
       + '    </p>'
       + '  </div>'
       + '</div>'
       ;
       return $(template);
};

$(window).load(function() {
     var $collectionContainer = $('.album-covers');
     $collectionContainer.empty();
     for (var i = 0; i < 12; i++) {
         var $newThumbnail = buildCollectionItemTemplate();
         $collectionContainer.append($newThumbnail);
     }
 });
