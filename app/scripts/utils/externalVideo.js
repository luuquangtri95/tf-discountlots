(()=>{
  const videoList = document.querySelectorAll('.js-youtube-video');

  if(!videoList.length) return;

  const defaultConfig = `{ "autoplay": 0, "playsinline": 1, "controls": 0, "showinfo": 0, "rel": 0, "loop": 1}`;

  if(!document.getElementById('YTScript')){
    let tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    tag.id = 'YTScript';
    let firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }

  window['onYouTubeIframeAPIReady'] = ()=>{
    videoList.forEach(video=>{
      const playerVars = JSON.parse(video.dataset.config || defaultConfig);

      video.media = new YT.Player(video.id, {
        videoId: video.dataset.ytId,
        playerVars,
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange
        }
      })
    })
  }

  window['onPlayerStateChange'] = (event)=>{
    const video = event.target;
    const iframe = video.getIframe();

    switch (event.data) {
      case YT.PlayerState.PLAYING:
        document.getElementsByClassName(iframe.dataset.group || '')[0]?.querySelectorAll('.playing')?.forEach(i=>{
          if(i != iframe){
           i.classList.remove('playing');
           i.parentNode.classList.remove('video-is-playing');
           i.media.pauseVideo();
          }
        })

        iframe.classList.add('playing');
        iframe.parentNode.classList.add('video-is-playing');
        break;

      case YT.PlayerState.PAUSED:
        iframe.classList.remove('playing');
        iframe.parentNode.classList.remove('video-is-playing');
        break;

      case YT.PlayerState.ENDED:
        video.seekTo(0);
        iframe.classList.contains('playing') && video.playVideo();
        break;

      default:
        break;
    }
  }

  window['onPlayerReady'] = (event)=>{
    let video = event.target;
    const iframe = video.getIframe();

    if(!iframe.classList.contains('first-play')) return;

    video.mute();
    video.playVideo();
  }

})();


(()=>{
  const videoList = document.querySelectorAll('.js-vimeo-video');
  if(!videoList.length) return;

  function createVideo(){
    videoList.forEach(video=>{
      video.media = new Vimeo.Player(video);


      video.media.on('play', ()=>{
        document.getElementsByClassName(video.dataset.group)[0]?.querySelectorAll('.playing')?.forEach(i=>{           
          i != iframe && (i.classList.remove('playing'),i.media.pause());
        })
        video.classList.add('playing');
      })

      video.media.on('ended', ()=>{
        video.classList.contains('playing') && video.media.play();
      })

      video.classList.contains('first-play') && (video.media.setVolume(0),video.media.play());
    })
  }

  if(!document.getElementById('VMScript')){
      let tag = document.createElement('script');
      tag.src = "https://player.vimeo.com/api/player.js";
      tag.id = 'VMScript';
      tag.onload = createVideo;
      let firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
    else {
      createVideo();
    }

})()