import resultFlight from "./resultFlight.js";
import moment from "moment";

export default function () {
	// pobieranie dane o lotach
	let url = "./data/flightData.json";

	fetch(url, {
		headers: {
			Accept: "application/json",
		},
	})
		.then((response) => response.json())
		.then((data) => {
			const sreachOption = () => {
				document.getElementById("DestinationValue").innerHTML = "";
				let orginalValue = document.getElementById("from").value;
				let optionValue = document.getElementById("DestinationValue");
				let dataTo = [];
				for (let i = 0; i < data.length; i++) {
					if (data[i].from === orginalValue) {
						dataTo.push(data[i].to);
					}
				}

				dataTo
					.filter((el, index) => dataTo.indexOf(el) === index)
					.forEach(
						(el) =>
							(optionValue.innerHTML += `<option
                        value="${el}"></option>`)
					);
			};

			document
				.getElementById("destination")
				.addEventListener("mousedown", sreachOption);

			// wyszukanie lotow po klikniecu
			document
				.querySelector(".c-formSreach")
				.addEventListener("submit", (e) => {
					e.preventDefault();

					let fromVal = document.getElementById("from").value;
					let dectVal = document.getElementById("destination").value;
					let departureDateVal = document.getElementById("departure-date")
						.value;
					let passengersNumbers = document.getElementById("passengersNumber")
						.value;
					let flightOption = document.querySelector(
						".l-section--option .c-flightResult"
					);

					for (let i = 0; i < data.length; i++) {
						if (data[i].from == fromVal && data[i].to == dectVal) {
							document.querySelector(".l-section--search").style.display =
								"none";
							document.querySelector(".l-section--option").style.display =
								"block";

							flightOption.innerHTML += `
                        <div class="c-flightResult__box" id="${data[i].code}">
                            <h2 class="c-flightResult__title">${data[i].from}<span> <i class="fas fa-plane"></i></span>${data[i].to} </h2>
                            <div class="c-flightResult__text">
                            <p class="c-flightResult__text--description"><span><i class="fas fa-plane"></i></span><span>Flight no.:</span>${data[i].code}</p>
                            <p class="c-flightResult__text--description"><span><i class="far fa-calendar-alt"></i></span><span>Date:</span>${departureDateVal}</p>
                            <p class="c-flightResult__text--description"><span><i class="fas fa-plane-departure"></i></span><span>Departure:</span>${data[i].depart}</p>
                            <p class="c-flightResult__text--description"><span><i class="fas fa-plane-arrival"></i></span><span>Arrival:</span>${data[i].arrive}</p>
                    <p class="c-flightResult__text--description"><span><i class="fas fa-dollar-sign"></i></span><span>Price from:</span>${data[i].priceMin}</p>
                    <p class="c-flightResult__text--description"><span><i class="fas fa-user-friends"></i></span><span>Passengerss:</span>${passengersNumbers}</p>
                            </div>
                            <div class="c-button c-button__option">Booking</div>
                        </div>`;
						}
					}
					resultFlight(data, departureDateVal, passengersNumbers);

					// back button
					document
						.querySelector(".c-back")
						.addEventListener("click", function () {
							document.querySelector(".l-section--option").style.display =
								"none";
							document.querySelector(
								".l-section--option .c-flightResult"
							).innerHTML = "";
							document.getElementById("passengersNumber").value = "";
							document.querySelector(".l-section--search").style.display =
								"flex";
							document.getElementById("destination").value = "";
							document.getElementById("from").value = "";
							document.getElementById("departure-date").value = "";
							document.getElementById("DestinationValue").innerHTML = "";
						});
				});
		});

	// min wartosc daty to dzisiejsza
	document.getElementById("departure-date").min = moment().format("YYYY-MM-DD");

	document
		.querySelector(".c-button__search--clear")
		.addEventListener("click", () => {
			document.getElementById("from").value = "";
			document.getElementById("destination").value = "";
			document.getElementById("departure-date").value = "";
			document.getElementById("passengersNumber").value = "";
			document.getElementById("DestinationValue").innerHTML = "";
		});
}
