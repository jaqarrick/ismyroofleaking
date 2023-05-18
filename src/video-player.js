const hlsStreamUrl = 'https://ext-tech.online/hls/mystream.m3u8'
const dashStreamUrl = 'https://ext-tech.online/dash/mystream.mpd'
const rainPosterSmall = 'assets/rain-poster-small.jpg'
const rainPosterLarge = 'assets/rain-poster-large.jpg'
const sunPosterSmall = 'assets/sun-poster-small.jpg'
const sunPosterLarge = 'assets/sun-poster-large.jpg'

const getBrowser = () => {
    const bowserParser = bowser.getParser(window.navigator.userAgent).parsedResult;
    const platformType = bowserParser.platform.type
    return {
        browser: bowserParser.browser.name,
        isMobile: platformType === 'mobile' || platformType === 'tablet'
    }
}

const showUnsupportedBrowserPoster = (videoEl, isMobile, isPrecipitation) => {
    videoEl.controls = false
    if (isMobile) {
        videoEl.setAttribute("poster", isPrecipitation ? rainPosterSmall : sunPosterSmall)
    } else {
        videoEl.setAttribute("poster", isPrecipitation ? rainPosterLarge : sunPosterLarge)
    }
}

const initVideoPlayer = (videoEl, isPrecipitation) => {
    /* Because of inconsistencies in browser support for dash/hls we have to update the video
    element for each browser and platform */
    const { isMobile, browser } = getBrowser()
    // for safari (desktop or ios we can use the native video element with the dash stream)
    if (browser === 'Safari') {
        videoEl.setAttribute("src", hlsStreamUrl)
        videoEl.setAttribute("type", "application/x-mpegURL")
        videoEl.addEventListener('loadedmetadata', function () {
            // HLS stream metadata has been loaded
            videoEl.setAttribute("controls", false)
            videoEl.play();
        });
    } else if (isMobile && browser !== 'Android Browser') {
        // afaik dash and hls aren't supported in other mobile browsers in iOs, so don't load stream
        // show alert poster
        showUnsupportedBrowserPoster(videoEl, isMobile, isPrecipitation)
    } else if (Hls.isSupported()) {
        const hls = new Hls();
        // Load the HLS stream URL
        hls.loadSource(hlsStreamUrl);
        hls.attachMedia(videoEl);
        // Optional: Handle HLS.js events
        hls.on(Hls.Events.MANIFEST_PARSED, function () {
            // HLS manifest has been parsed and stream is ready to play
            video.play();
        });
    } else if (dashjs.supportsMediaSource()) {
        const dashPlayer = dashjs.MediaPlayer().create();
        dashPlayer.initialize(videoEl, dashStreamUrl);
    } else {
        showUnsupportedBrowserPoster(isMobile, isPrecipitation)
    }
}

