
const dateTimeEl = document.querySelector("#date-time")
const weatherDescriptionEl = document.querySelector("#weather-description")
const footerDescriptionEl = document.querySelector("#footer-description")
const sunBackgroundColor = "#E8F2AD"
const rainBackgroundColor = "#A2CFEF"
const sunTextColor = "#FF0000"
const rainTextColor = "#0E5385"
const logoEl = document.querySelector("#logo")
const updateLogo = (isPrecipitation) => {
    // ascii chars for the glyphs
    const rain = "B"
    const sun = "I"
    logoEl.textContent = isPrecipitation ? rain : sun
    logoEl.style.color = isPrecipitation ? rainTextColor : sunTextColor
}

const convertToSpans = text => [...text].map((char) => `<span>${char === " " ? "&nbsp;" : char}</span>`).join('')
updateFooter = (isPrecipitation, description) => {

    const descriptionSpans = convertToSpans(description)
    const alertSpans = convertToSpans('my roof might be leaking')

    footerDescriptionEl.innerHTML = `<div class="footer-text-container">${descriptionSpans}</div>${isPrecipitation ? `<div class="footer-text-container">${alertSpans}</div>` : ''}`
    footerDescriptionEl.style.color = isPrecipitation ? rainTextColor : sunTextColor
}

const updateBackground = (isPrecipitation) => {
    document.body.style.background = isPrecipitation ? rainBackgroundColor : sunBackgroundColor
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
        timeZoneName: 'short'
    };
    const formattedTime = currentTime.toLocaleString('en-US', options);
    dateTimeEl.textContent = formattedTime;
}

const city = "Brooklyn, NY"

const init = async () => {
    updateTime()
    setInterval(updateTime, 1000);
    const { isPrecipitation, description, dailyPercipitationSum } = await getWeatherData()
    updateBackground(isPrecipitation)
    updateLogo(isPrecipitation)
    updateFooter(isPrecipitation, description)
    updateDescription(isPrecipitation, dailyPercipitationSum)
}

init()