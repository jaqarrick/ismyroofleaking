document.addEventListener('DOMContentLoaded', () => {
    const dateTimeEl = document.querySelector("#date-time")
    const weatherDescriptionEl = document.querySelector("#weather-description")
    const footerDescriptionEl = document.querySelector("#footer-description")
    const videoStreamEl = document.querySelector("#video-stream")
    const logoEl = document.querySelector("#logo")

    const sunBackgroundColor = "#E8F2AD"
    const rainBackgroundColor = "#A2CFEF"
    const sunTextColor = "#FF0000"
    const rainTextColor = "#0E5385"
    const city = "Brooklyn, NY"

    const updateLogo = (isPrecipitation) => {
        // ascii chars for the glyphs
        const rain = "B"
        const sun = "I"
        logoEl.textContent = isPrecipitation ? rain : sun
        logoEl.style.color = isPrecipitation ? rainTextColor : sunTextColor
    }

    const isMobile = () => {
        const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
        return viewportWidth < 800
    }
    const convertToSpans = text => [...text].map((char) => `<span>${char === " " ? "&nbsp;" : char}</span>`).join('')

    const updateFooter = (isPrecipitation, description) => {
        const alert = 'my roof might be leaking'
        const descriptionSpans = convertToSpans(description)
        const alertSpans = convertToSpans(alert)
        const isMobileView = isMobile()
        if (isMobileView) {
            footerDescriptionEl.innerHTML = `<div class="footer-text-container">${description}</div>${isPrecipitation ? `<div class="footer-text-container">${alert}</div>` : ''}`
        } else {
            footerDescriptionEl.innerHTML = `<div class="footer-text-container">${descriptionSpans}</div>${isPrecipitation ? `<div class="footer-text-container">${alertSpans}</div>` : ''}`
        }
        footerDescriptionEl.style.color = isPrecipitation ? rainTextColor : sunTextColor
    }

    const updateBackground = (isPrecipitation) => {
        document.body.style.background = isPrecipitation ? rainBackgroundColor : sunBackgroundColor
    }

    const updateVideoDisplay = isPrecipitation => {
        videoStreamEl.style.border = `solid 3px ${isPrecipitation ? rainTextColor : sunTextColor}`
    }

    const updateDescription = (isPrecipitation, dailyPercipitationSum) => {
        weatherDescriptionEl.innerHTML = isPrecipitation ? `${dailyPercipitationSum} of rain in the last 24hrs in ${city}` : `It is <u>not</u> raining in ${city}`
        weatherDescriptionEl.style.color = isPrecipitation ? rainTextColor : sunTextColor
        dateTimeEl.style.color = isPrecipitation ? rainTextColor : sunTextColor
    }
    const updateTime = () => {
        const currentTime = new Date();
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            timeZoneName: 'short',
            timeZone: 'America/New_York'
        };
        const formattedTime = currentTime.toLocaleString('en-US', options);
        dateTimeEl.textContent = formattedTime;
    }


    const init = async () => {
        updateTime()
        setInterval(updateTime, 1000);
        const { isPrecipitation, description, dailyPercipitationSum } = await getWeatherData()
        updateBackground(isPrecipitation)
        updateLogo(isPrecipitation)
        updateFooter(isPrecipitation, description)
        updateDescription(isPrecipitation, dailyPercipitationSum)
        updateVideoDisplay(isPrecipitation)
        window.addEventListener('resize', () => {
            updateFooter(isPrecipitation, description)
        })
        initVideoPlayer(videoStreamEl, isPrecipitation)
    }

    init()
})