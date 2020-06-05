import bigAirplane from "./../html/inc/_section-bigAirplane.html";
import mediumAirplane from "./../html/inc/_section-mediumAirplane.html";
import smallAirplane from "./../html/inc/_section-smallAirplane.html";
import { getLoginForm, getOrderSummary } from "./loginFlight.js";
import moment from "moment";
import tippy from "tippy.js";
import "tippy.js/dist/tippy-bundle.umd";

export default function (data, departureDateVal, passengersNumbers) {
	const ticketPassengers = {
		passengersNumber: Number(passengersNumbers),
		selectPassengersNumber: 0,
	};

	// Click booking button. Wyświetlenie wybranego lotu
	let flightResult = document.querySelector(
		".l-section--result .c-flightResult"
	);

	const btnBooking = [...document.querySelectorAll(".c-button__option")];
	btnBooking.forEach((btn) =>
		btn.addEventListener("click", function () {
			const idPlane = btn.parentElement.id;
			let choiceFlight = [];
			for (let i = 0; i < data.length; i++) {
				if (data[i].code == idPlane) {
					document.querySelector(".l-section--result").style.display = "block";
					document.querySelector(".l-section--option").style.display = "none";
					choiceFlight.push(data[i]);
					flightResult.classList.add(data[i].img);
					flightResult.innerHTML = `<div class="c-flightResult__box" id="${
						data[i].code
					}">
                            <h2 class="c-flightResult__title">${
															data[i].from
														}<span> <i class="fas fa-plane"></i></span>${
						data[i].to
					} </h2>
                            <div class="c-flightResult__text">
                            <p class="c-flightResult__text--description"><span><i class="fas fa-plane"></i></span><span>Flight no.:</span>${
															data[i].code
														}</p>
                            <p class="c-flightResult__text--description"><span><i class="far fa-calendar-alt"></i></span><span>Date:</span>${departureDateVal}</p>
                            <p class="c-flightResult__text--description"><span><i class="fas fa-plane-departure"></i></span><span>Departure:</span>${
															data[i].depart
														}</p>
                            <p class="c-flightResult__text--description"><span><i class="fas fa-plane-arrival"></i></span><span>Arrival:</span>${
															data[i].arrive
														}</p>
                            <p class="c-flightResult__text--description"><span><i class="fas fa-user-friends"></i></span><span>Passengerss:</span>${passengersNumbers}</p>
                            <p class="c-flightResult__text--description"><span><i class="fas fa-clock"></i></span><span>Flight time:</span>${getFlightTime(
															departureDateVal,
															data[i].depart,
															data[i].arrive
														)}</p>
                             </div>
                             <div class="c-flightResult__ticket">
                            <div class="c-flightResult__position"></div>
                            <p class="c-flightResult__value"><span>Total Price:</span><span class="c-flightResult__value--allValue">0</span>$</p>
                </div>
                            <div class="c-button c-button__option">Buy and Login</div>
                        </div>`;
				}
			}
			getAirplane(flightResult);
			setTimeout(function () {
				getFlightPositions(choiceFlight);
			}, 500);

			orderUser();
		})
	);

	// wybór samolotu
	const getAirplane = (flightResult) => {
		const div = document.createElement("div");
		div.classList.add("c-airSeatMap");
		if (flightResult.classList.contains("bigAirplane")) {
			div.innerHTML = bigAirplane;
		} else if (flightResult.classList.contains("mediumAirplane")) {
			div.innerHTML = mediumAirplane;
		} else {
			div.innerHTML = smallAirplane;
		}

		flightResult.appendChild(div);
	};

	// wybór pozycji + podsumowanie
	const getFlightPositions = (data) => {
		const allPositions = [...document.querySelectorAll("rect")];
		let valuePosition = document.querySelector(".c-flightResult__position");
		let maxPassengersNumber = Number(
			document.getElementById("passengersNumber").max
		);

		// losowanie zajetych miejsc
		for (let i = 0; i < allPositions.length - maxPassengersNumber; i++) {
			allPositions[
				Math.floor(allPositions.length * Math.random())
			].classList.add("notAvailable");
		}

		// losowanie cen dla klasy premium i economic
		allPositions.forEach((el) => {
			el.getAttribute("fill") != "#005C71"
				? (el.dataset.value = randomSeatPrice(
						Number(data[0].priceMin),
						Number(data[0].priceMax)
				  ))
				: (el.dataset.value = Number(data[0].priceMax));
		});

		allPositions.forEach((e) => {
			e.addEventListener("click", function () {
				const div = document.createElement("div");

				if (
					!e.classList.contains("available") &&
					!e.classList.contains("notAvailable") &&
					ticketPassengers.selectPassengersNumber <
						ticketPassengers.passengersNumber
				) {
					e.classList.add("available");
					div.classList.add(
						e.getAttribute("id"),
						"c-flightResult__position--box"
					);

					ticketPassengers.selectPassengersNumber++;

					div.innerHTML = `<span class="${e.getAttribute(
						"id"
					)}"><i class="fas fa-times"></i></span><div><span>Place:</span> ${e.getAttribute(
						"id"
					)} ${
						e.getAttribute("fill") == "#005C71" ? "Premium" : "Economic"
					};</div><div> <span>Price:</span> <select class="ticket">
                    <option data-value="${e.dataset.value}" selected>Adult ${
						e.dataset.value
					}$</option>
                      <option data-value="${Math.floor(
												e.dataset.value * 0.5
											)}" >Children ${Math.floor(
						e.dataset.value * 0.5
					)}$</option>
					</select></div><div><span>  
                    Extra bag:</span>
                    <select class="baggage">
                    <option value="0" data-value="0" selected>No</option>
                      <option value="15" data-value="15">Yes</option>
					</select>
					</div>
					 `;
				} else if (e.classList.contains("available")) {
					ticketPassengers.selectPassengersNumber--;
					e.classList.remove("available");
					document.querySelector(`div.${e.getAttribute("id")}`).remove();
				}

				valuePosition.appendChild(div);

				// usuwam element po wcisnieniu x
				document
					.querySelectorAll(".c-flightResult__position--box>span")
					.forEach((el) =>
						el.addEventListener("click", function () {
							allPositions.findIndex(function (elem) {
								if (
									elem.id === el.className &&
									elem.classList.contains("available")
								) {
									elem.classList.remove("available");
									ticketPassengers.selectPassengersNumber--;
									el.parentElement.remove();
									getPriceTicket();
								}
							});
						})
					);
				getPriceTicket();
			});
		});

		allPositions.forEach((el) =>
			el.classList != "notAvailable"
				? el.setAttribute(
						"data-tippy-content",
						`Price: ${el.dataset.value} Seat: ${el.id}`
				  )
				: el.setAttribute("data-tippy-content", `Seat: not available`)
		);

		tippy("[data-tippy-content]");
	};

	// losowanie cen w zakresie od min do max
	const randomSeatPrice = (min, max) => {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};

	//podliczenie wartości
	const getPriceTicket = () => {
		const prices = [
			...document.querySelectorAll(
				".baggage>option:checked, .ticket>option:checked"
			),
		];
		let priceTicket = 0;
		prices.forEach((price) => {
			priceTicket += Number(price.dataset.value);
		});
		document.querySelector(
			".c-flightResult__value--allValue"
		).textContent = priceTicket;
	};

	// obliczenie czasu trwania lotu
	const getFlightTime = (date, dep, arr) => {
		let arrival = `${date} ${arr}`;
		let departure = `${date} ${dep}`;
		let calc = moment(arrival, "YYYY-MM-DD HH:mm").diff(
			moment(departure, "YYYY-MM-DD HH:mm")
		);
		let time = moment.duration(calc);
		return time.hours() > 0
			? `${time.hours()}h ${time.minutes()}min`
			: `${time.minutes()}min`;
	};

	// wybor dpdatkowego bagazu
	document
		.querySelector(".l-section--result")
		.addEventListener("input", function () {
			getPriceTicket();
		});

	// back button
	document
		.querySelector(".l-section--result .c-back")
		.addEventListener("click", function () {
			document.querySelector(".l-section--result").style.display = "none";
			document.querySelector(".l-section--option").style.display = "block";
			ticketPassengers.selectPassengersNumber = 0;

			if (
				document
					.querySelector(".l-section--result .c-flightResult")
					.getAttribute("class")
					.split(" ").length == 2
			) {
				document
					.querySelector(".l-section--result .c-flightResult")
					.classList.remove(
						document
							.querySelector(".l-section--result .c-flightResult")
							.getAttribute("class")
							.split(" ")
							.slice(-1)
					);
			}
		});

	// po zatwierdzeniu lotu. Logowanie && podsumowanie zamówienia
	const orderUser = () => {
		document
			.querySelector(".l-section--result .c-button__option")
			.addEventListener("click", function (e) {
				e.stopPropagation();

				if (
					ticketPassengers.passengersNumber !=
					ticketPassengers.selectPassengersNumber
				) {
					alert("Please, select places first!");
				} else if (
					document
						.getElementById("c-button__login")
						.getAttribute("data-user") == null &&
					ticketPassengers.passengersNumber ==
						ticketPassengers.selectPassengersNumber
				) {
					getLoginForm(getOrderSummary);
				} else {
					getOrderSummary();
				}
			});
	};

	// przeladowanie strony po klikneciu w logo
	document.querySelector(".c-logo").addEventListener("click", function () {
		location.reload();
	});
}
