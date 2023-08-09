const refs = {
	input: document.querySelector(".inputLocation"),
	button: document.querySelector(".loc-button"),
	ulWeater: document.querySelector(".day-list"),
	dayInfo: document.querySelector(".day-info"),
	todayInfo: document.querySelector(".today-info"),
	todayWeather: document.querySelector(".left-info"),
}
refs.input.value = "London";
serviceWeather("London")
	.then((data) => {
		refs.dayInfo.innerHTML = createMarkupTudeyElse(data.forecast.forecastday);
		refs.ulWeater.innerHTML = createMarkup(data.forecast.forecastday);
		refs.todayWeather.innerHTML = createMarkupTudey(data.forecast.forecastday);
	})
	.catch((err) => console.error(err));

refs.button.addEventListener("click", serchWeather);

function serchWeather(e) {
	e.preventDefault();

	const city = refs.input.value;

	console.log(city);
	serviceWeather(city)
		.then((data) => {
			refs.dayInfo.innerHTML = createMarkupTudeyElse(data.forecast.forecastday);
			refs.ulWeater.innerHTML = createMarkup(data.forecast.forecastday);
			refs.todayWeather.innerHTML = createMarkupTudey(data.forecast.forecastday);
		})
		.catch((err) => console.error(err));
}


function serviceWeather(city) {
	const FORECAST_URL = "http://api.weatherapi.com/v1/forecast.json";
	const API_KEY = "66f9e81543404d02beb160521230808";

	const params = new URLSearchParams({
		key: API_KEY,
		q: city,
		days: 5,
		lang: "uk",
	});

	return fetch(`${FORECAST_URL}?${params}`).then((res) => {
		if (!res.ok) {
			throw new Error(res.statusText);
		}
		return res.json();
	});
}


console.log(serviceWeather("Kiev"));

function createMarkup(arr) {
	return arr.slice(1)
		.map(
			({
				date,
				day: {
					avgtemp_c,
					condition: { text, icon },
				},
			}) =>
				`<li>
					<img src="${icon}" alt="${text}" class="bx">
					<span>${date}</span>
					<span class="day-temp">${avgtemp_c} °C</span>
				</li>`
		)
		.join("");
}

function createMarkupTudey(arr) {
	return arr.slice(0, 1).map(
		({
			date,
			day: {
				avgtemp_c,
				condition: { text, icon },
			},
		}) =>
			`
			<div class="pic-gradient"></div>
			<div class="today-info">
				<h2>Сьогодні</h2>
				<span> ${date} </span>
				<div>
				<i class="bx-bx-current-location"></i>
					<span>${refs.input.value}</span>
				</div>
				</div>
			<div class="today-weather">
				<img src="${icon}" alt="${text}" class="bx">
				<h1 class="weather-temp">${avgtemp_c}&deg;C</h1>
				<h3>${text}</h3>
			</div>
				
				`
	);
}

function createMarkupTudeyElse(arr) {
	return arr.slice(0, 1).map(
		({
			date,
			day: {
				maxwind_kph,
				totalprecip_mm,
				avghumidity,
			},
		}) =>
			`
			<div>
					<span class="title">ОПАДИ</span>
					<span class="value">${totalprecip_mm} мм</span>
				</div>
				<div>
					<span class="title">ВОЛОГІСТЬ</span>
					<span class="value">${avghumidity}%</span>
				</div>
				<div>
					<span class="title">ШВИДКІСТЬ ВІТРУ</span>
					<span class="value">${maxwind_kph} км/г</span>
				</div>
				`
	);
}