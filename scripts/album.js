var createSongRow = function(songNumber, songName, songLength) {
     var template =
        '<tr class="album-view-song-item">'
      + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + songLength + '</td>'
      + '</tr>'
      ;
     var $row = $(template);

     var clickHandler = function() {

        var $songNumber = parseInt($(this).attr('data-song-number'));

        if (currentlyPlayingSongNumber !== null) {
            var $currentSongElem = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
            $currentSongElem.html(currentlyPlayingSongNumber);
        }
        if (currentlyPlayingSongNumber !== $songNumber) {
            $(this).html(pauseButtonTemplate);
            currentlyPlayingSongNumber = $songNumber;
            currentSongFromAlbum = currentAlbum.songs[$songNumber - 1];
            updatePlayerBarSong();
        } else if (currentlyPlayingSongNumber === $songNumber) {
            $(this).html(playButtonTemplate);
            $('.main-controls .play-pause').html(playerBarPlayButton);
            currentlyPlayingSongNumber = null;
            currentSongFromAlbum = null;
        }
     };

     var onHover = function(event) {
         var $songItem = $(this).find('.song-item-number');
         var $songItemNumber = parseInt($songItem.attr('data-song-number'));
         if ($songItemNumber !== currentlyPlayingSongNumber) {
             $songItem.html(playButtonTemplate);
         }
     };

     var offHover = function(event) {
         var $songItem = $(this).find('.song-item-number');
         var $songItemNumber = parseInt($songItem.attr('data-song-number'));
         if ($songItemNumber !== currentlyPlayingSongNumber) {
             $songItem.html($songItemNumber);
         }
         console.log("songNumber type is " + typeof songNumber + "\n and currentlyPlayingSongNumber type is " + typeof currentlyPlayingSongNumber);
     };

     $row.find('.song-item-number').click(clickHandler);
     $row.hover(onHover, offHover);
     return $row;
 };

 var setCurrentAlbum = function(album) {
     currentAlbum = album;
     var $albumTitle = $('.album-view-title');
     var $albumArtist = $('.album-view-artist');
     var $albumReleaseInfo = $('.album-view-release-info');
     var $albumImage = $('.album-cover-art');
     var $albumSongList = $('.album-view-song-list');
     $albumTitle.text(album.title);
     $albumArtist.text(album.artist);
     $albumReleaseInfo.text(album.year + ' ' + album.label);
     $albumImage.attr('src', album.albumArtUrl);
     $albumSongList.empty();

     for (var i = 0; i < album.songs.length; i++) {
         var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
         $albumSongList.append($newRow);
     }
 };

 var trackIndex = function(album, song) {
     return album.songs.indexOf(song);
 };

/* my attempt at writing nextSong function...not sure if this would have worked or not
 var nextSong = function() {
     var $nextSongIndex = trackIndex(album, song);
     var $currSongIndex = currentlyPlayingSongNumber;
     var $nextSongItem = $('.song-item-number[data-song-number="' + $nextSongIndex + '"]');
     var $currSongItem = $('.song-item-number[data-song-number="' + $currSongIndex + '"]');
     if ($currSongIndex == album.songs['length - 1']) {
         currentSongFromAlbum = currentAlbum.songs[0];
     } else {
         currentSongFromAlbum = currentAlbum.songs[index + 1];
     }
     updatePlayerBarSong();
     $currSongItem.html($currSongIndex);
     $nextSongItem.html(pauseButtonTemplate);
 };
*/

var nextSong = function() {
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currentSongIndex++;

    if (currentSongIndex >= currentAlbum.songs.length) {
        currentSongIndex = 0;
    }

    var lastSongNumber = currentlyPlayingSongNumber;

    currentlyPlayingSongNumber = currentSongIndex + 1;
    currentSongFromAlbum = currentAlbum.songs[currentSongIndex];

    updatePlayerBarSong();

    var $nextSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
    var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');

    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};

var prevSong = function() {
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currentSongIndex--;

    if (currentSongIndex < 0) {
        currentSongIndex = currentAlbum.songs.length - 1;
    }

    var lastSongNumber = currentlyPlayingSongNumber;

    currentlyPlayingSongNumber = currentSongIndex + 1;
    currentSongFromAlbum = currentAlbum.songs[currentSongIndex];

    updatePlayerBarSong();

    $('.main-controls .play-pause').html(playerBarPauseButton);

    var $prevSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
    var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');

    $prevSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};

 var updatePlayerBarSong = function() {
     $(".currently-playing .song-name").text(currentSongFromAlbum.title);
     $(".currently-playing .artist-song-mobile").text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
     $(".currently-playing .artist-name").text(currentAlbum.artist);
     $('.main-controls .play-pause').html(playerBarPauseButton);
 };

 var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
 var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
 var playerBarPlayButton = '<span class="ion-play"></span>';
 var playerBarPauseButton = '<span class="ion-pause"></span>';

 var currentlyPlayingSongNumber = null;
 var currentSongFromAlbum = null;
 var currentAlbum = null;

 var $previousButton = $('.main-controls .previous');
 var $nextButton = $('.main-controls .next');

$(document).ready(function() {
    setCurrentAlbum(albumPicasso);
    $previousButton.click(prevSong);
    $nextButton.click(nextSong);
});
