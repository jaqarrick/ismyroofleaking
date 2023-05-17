

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
        51: "Drizzle: Light intensity",
        53: "Drizzle: Moderate intensity",
        55: "Drizzle: Dense intensity",
        56: "Freezing drizzle: Light intensity",
        57: "Freezing drizzle: Dense intensity",
        61: "Rain: Slight intensity",
        63: "Rain: Moderate intensity",
        65: "Rain: Heavy intensity",
        66: "Freezing rain: Light intensity",
        67: "Freezing rain: Heavy intensity",
        71: "Snowfall: Slight intensity",
        73: "Snowfall: Moderate intensity",
        75: "Snowfall: Heavy intensity",
        77: "Snow grains",
        80: "Rain showers: Slight intensity",
        81: "Rain showers: Moderate intensity",
        82: "Rain showers: Violent intensity",
        85: "Snow showers: Slight intensity",
        86: "Snow showers: Heavy intensity",
        95: "Thunderstorm: Slight or moderate",
        96: "Thunderstorm with slight hail",
        99: "Thunderstorm with heavy hail",
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



