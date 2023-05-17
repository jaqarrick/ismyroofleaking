

const fetchWeather = async () => {
    const url = "https://api.open-meteo.com/v1/forecast?latitude=40.76&longitude=-73.90&current_weather=true&hourly=rain&hourly=showers&daily=precipitation_sum&timezone=EST"
    const response = await fetch(url)
    return response.json()
}

const weathercodeToDescription = (code) => {
    const codeMapping = {
        0: "Clear sky",
        1: "Mainly clear",
        2: "Partly cloudy",
        3: "Overcast",
        45: "Fog",
        48: "Depositing rime fog",
        51: "Light drizzle",
        53: "Moderate drizzle",
        55: "Desnse drizzle",
        56: "Light Freezing drizzle",
        57: "Dense Freezing drizzle",
        61: "Slight rain",
        63: "Moderate rain",
        65: "Heavy rain",
        66: "Light freezing rain",
        67: "Heavy freezing rain",
        71: "Slight snowfall",
        73: "Moderate snowfall",
        75: "Heavy snowfall",
        77: "Snow grains",
        80: "Slight showers",
        81: "Moderate showers",
        82: "Violent showers",
        85: "Slight snow",
        86: "Heavy snow",
        95: "Slight Thunderstorm",
        96: "Thunderstorm and slight hail",
        99: "Thunderstorm and heavy hail",
    };
    return codeMapping[code] || "Unknown";
}


const getWeatherData = async () => {
    const weatherJSON = await fetchWeather()
    const {
        current_weather: {
            weathercode
        },
        daily: {
            precipitation_sum: precipitationSum
        },
        daily_units: {
            precipitation_sum: precipitationUnits

        }
    } = weatherJSON

    const isPrecipitationCode = weathercode >= 51 && weathercode <= 67 || weathercode >= 71 && weathercode <= 82 || weathercode === 85 || weathercode === 86 || weathercode === 95 || weathercode === 96 || weathercode === 99;
    const isPrecipitation = isPrecipitationCode || precipitationSum[0] > 0
    return {
        isPrecipitation,
        description: weathercodeToDescription(weathercode),
        dailyPercipitationSum: `${precipitationSum[0]}${precipitationUnits}`
    }
}



