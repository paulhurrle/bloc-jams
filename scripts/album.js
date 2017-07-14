var setSong = function(songNumber) {
    if (currentSoundFile) {
         currentSoundFile.stop();
    }
   currentlyPlayingSongNumber = parseInt(songNumber);
   currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
   currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
       formats: [ 'mp3' ],
       preload: true
   });
   setVolume(currentVolume);
};

var seek = function(time) {
     if (currentSoundFile) {
         currentSoundFile.setTime(time);
     }
 };

var setVolume = function(volume) {
     if (currentSoundFile) {
         currentSoundFile.setVolume(volume);
     }
     currentVolume = volume;
 };

var getSongNumberCell = function(number) {
    return $('.song-item-number[data-song-number="' + number + '"]');
};

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
        var $volumeBar = $('.volume .seek-bar');

        if (currentlyPlayingSongNumber !== null) {
            var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
		    currentlyPlayingCell.html(currentlyPlayingSongNumber);
        }
        if (currentlyPlayingSongNumber !== $songNumber) {
            $(this).html(pauseButtonTemplate);
            setSong($songNumber);
            currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
            updatePlayerBarSong();
            currentSoundFile.play();
            updateSeekBarWhileSongPlays();
        } else if (currentlyPlayingSongNumber === $songNumber) {
            if (currentSoundFile.isPaused()) {
                currentSoundFile.play();
                updateSeekBarWhileSongPlays()
                $(this).html(pauseButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPauseButton);
            } else {
                currentSoundFile.pause();
                $(this).html(playButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPlayButton);
            }
        }

        $volumeBar.find('.fill').width(currentVolume + "%");
        $volumeBar.find('.thumb').css({left: currentVolume + "%"});
     }

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

 var updateSeekBarWhileSongPlays = function() {
     if (currentSoundFile) {
         currentSoundFile.bind('timeupdate', function(event) {
             var seekBarFillRatio = this.getTime() / this.getDuration();
             var $seekBar = $('.seek-control .seek-bar');

             updateSeekPercentage($seekBar, seekBarFillRatio);
         });
     }
 };

 var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
     var offsetXPercent = seekBarFillRatio * 100;
     offsetXPercent = Math.max(0, offsetXPercent);
     offsetXPercent = Math.min(100, offsetXPercent);
     var percentageString = offsetXPercent + '%';
     $seekBar.find('.fill').width(percentageString);
     $seekBar.find('.thumb').css({left: percentageString});
 };

 var setupSeekBars = function() {
     var $seekBars = $('.player-bar .seek-bar');

     $seekBars.click(function(event) {

         var offsetX = event.pageX - $(this).offset().left;
         var barWidth = $(this).width();
         var seekBarFillRatio = offsetX / barWidth;

         if ($(this).parent().hasClass("seek-control")) {
             seek(seekBarFillRatio * currentSoundFile.getDuration());
         }
         if ($(this).parent().hasClass("volume")) {
             setVolume(seekBarFillRatio * 100);
             currentVolume = seekBarFillRatio * 100;
         }
         updateSeekPercentage($(this), seekBarFillRatio);


     });

     $seekBars.find('.thumb').mousedown(function(event) {
         var $seekBar = $(this).parent();

         $(document).bind('mousemove.thumb', function(event){
         var offsetX = event.pageX - $seekBar.offset().left;
         var barWidth = $seekBar.width();
         var seekBarFillRatio = offsetX / barWidth;

         updateSeekPercentage($seekBar, seekBarFillRatio);
     });

     $(document).bind('mouseup.thumb', function() {
         $(document).unbind('mousemove.thumb');
         $(document).unbind('mouseup.thumb');
     });
   });
 };

 var trackIndex = function(album, song) {
     return album.songs.indexOf(song);
 };

var songChange = function() {
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    var lastSongNumber = currentlyPlayingSongNumber;

    if ($(event.currentTarget).hasClass("previous")) {
        currentSongIndex--;
        if (currentSongIndex < 0) {
            currentSongIndex = currentAlbum.songs.length - 1;
        }
    }

    if ($(event.currentTarget).hasClass("next")) {
        currentSongIndex++;
        if (currentSongIndex == currentAlbum.songs.length) {
            currentSongIndex = 0;
        }
    }

    setSong(currentSongIndex + 1);
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();
    updatePlayerBarSong();

    var nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var lastSongNumberCell = getSongNumberCell(lastSongNumber);;

    nextSongNumberCell.html(pauseButtonTemplate);
    lastSongNumberCell.html(lastSongNumber);
};

/*
var nextSong = function() {
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    var lastSongNumber = currentlyPlayingSongNumber;
    currentSongIndex++;

    if (currentSongIndex == currentAlbum.songs.length) {
        currentSongIndex = 0;
    }

    setSong(currentSongIndex + 1);
    updatePlayerBarSong();

    var nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var lastSongNumberCell = getSongNumberCell(lastSongNumber);;

    nextSongNumberCell.html(pauseButtonTemplate);
    lastSongNumberCell.html(lastSongNumber);
};

var prevSong = function() {
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    var lastSongNumber = currentlyPlayingSongNumber;
    currentSongIndex--;

    if (currentSongIndex < 0) {
        currentSongIndex = currentAlbum.songs.length - 1;
    }

    setSong(currentSongIndex + 1);
    currentSoundFile.play();
    updatePlayerBarSong();

    var prevSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var lastSongNumberCell = getSongNumberCell(lastSongNumber);

    prevSongNumberCell.html(pauseButtonTemplate);
    lastSongNumberCell.html(lastSongNumber);
};
*/
var togglePlayFromPlayerBar = function() {
    var currSong = getSongNumberCell(currentlyPlayingSongNumber);
    if (currentSoundFile.isPaused()) {
        currentSoundFile.play();
        currSong.html(pauseButtonTemplate);
        $('.main-controls .play-pause').html(playerBarPauseButton);
    } else {
        currentSoundFile.pause();
        currSong.html(playButtonTemplate);
        $('.main-controls .play-pause').html(playerBarPlayButton);
    }
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
 var currentSoundFile = null;
 var currentVolume = 80;

 var $previousButton = $('.main-controls .previous');
 var $nextButton = $('.main-controls .next');
 var $playPause = $('.main-controls .play-pause');

$(document).ready(function() {
    setCurrentAlbum(albumPicasso);
    setupSeekBars();
    $previousButton.click(songChange);
    $nextButton.click(songChange);
    $playPause.click(togglePlayFromPlayerBar);
});
