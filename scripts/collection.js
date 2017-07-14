/*
var createSongRow = function(songNumber, songName, songLength) {
     var template =
        '<tr class="album-view-song-item">'
      + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + filterTimeCode(songLength) + '</td>'
      + '</tr>'
      ;
     var $row = $(template);
*/
var buildCollectionItemTemplate = function(img, album, artist, numSongs) {
     var template =
//this is a string containing the collection-album-container as a string, using
//the "+" sign to concatenate each line while still making it readable.
//By placing this content in quotation marks, the script will be stored in
//cache when the page loads, improving the load speed.
         '<div class="collection-album-container column fourth">'
       + '  <img src="assets/images/album_covers/' + img + '.png"/>'
       + '  <div class="collection-album-info caption">'
       + '    <p>'
       + '      <a class="album-name" href="album.html"> ' + album + ' </a>'
       + '      <br/>'
       + '      <a href="album.html"> ' + artist + ' </a>'
       + '      <br/>'
       + '      ' + numSongs + ' songs'
       + '      <br/>'
       + '    </p>'
       + '  </div>'
       + '</div>'
       ;
       var $album = $(template);

       return $album;
};

$(window).load(function() {
     var $collectionContainer = $('.album-covers');
     $collectionContainer.empty();
     $collectionContainer.append(buildCollectionItemTemplate("01", "The Colors", "Pablo Picasso", "5"));
     $collectionContainer.append(buildCollectionItemTemplate("20", "The Telephone", "Marconi", "5"));

//     for (var i = 0; i < 12; i++) {
//         var $newThumbnail = buildCollectionItemTemplate();
//         $collectionContainer.append($newThumbnail);
//     }
 });
