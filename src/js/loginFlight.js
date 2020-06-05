export default function () {
	document
		.getElementById("c-button__login")
		.addEventListener("click", getLoginForm);
}

// formularz logowania
const getLoginForm = () => {
	document.querySelector("main").style.filter = "blur(20px)";
	const loginDiv = document.createElement("div");
	loginDiv.classList.add("l-login__container");
	let htmldiv = (loginDiv.innerHTML = `<form class="l-login__form">
	<div><input id="login" type="text" placeholder="Login"></div>
	<div><input id="password" type="password" placeholder="Password"></div>
	<button type="submit" class="c-button c-button__login c-button__login--box">Sign in</button>
	<div><span>Login data</span></div>
	</form>`);

	if (document.body.querySelector(".l-login__container") == null) {
		document.querySelector(".l-login").appendChild(loginDiv);
		document.getElementById("login").focus();
		document.body
			.querySelector(".l-login__container span")
			.addEventListener("click", function () {
				loginDiv.innerHTML = `<div class="l-login__data">
				<div>
				<span><i class="fas fa-user"></i></span>
				<span><i class="fas fa-lock"></i></span>
				</div><div><span>admin</span><span>admin</span>
				</div><div><span>user</span><span>user</span>
				</div><div><span>marcin</span><span>mucha</span></div>
				<button class="c-button c-button__login-data">Back</button></div>`;

				document
					.querySelector(".c-button__login-data")
					.addEventListener("click", function () {
						if (document.querySelector(".l-login__container") != null) {
							document.querySelector(".l-login__container").remove();
							getLoginForm();
						}
					});
			});

		document.querySelector("main").addEventListener("click", getBlur);
	}

	loginUser(getOrderSummary);
};

// logowanie uzytkownika. poprawnosc danych
const loginUser = (getOrderSummary) => {
	document
		.querySelector(".c-button__login--box")
		.addEventListener("click", function (e) {
			e.preventDefault();

			let loginVal = document.getElementById("login").value;
			let passwordVal = document.getElementById("password").value;
			let welcomeUser = document.querySelector(".c-button__login");

			let url = "./data/user.json";

			fetch(url, {
				headers: {
					Accept: "application/json",
				},
			})
				.then((response) => response.json())
				.then((data) => {
					let loginData = data.filter(
						(el) => el.user == loginVal && el.password == passwordVal
					);

					if (loginData.length > 0) {
						welcomeUser.removeEventListener("click", getLoginForm);
						welcomeUser.innerHTML = `Hello, ${loginData[0].user}!<span></span> <span><i class="fas fa-sign-out-alt"></i></span>`;
						welcomeUser.setAttribute("data-user", loginData[0].user);
						document.querySelector(".l-login__container").remove();
						document.querySelector("main").style.filter = "blur(0px)";
						const taimer = getTimer();
						let stop = setInterval(taimer, 1000);
						getLogout(stop);
						return getOrderSummary();
					} else {
						alert("wrong data");
						document.getElementById("password").value = "";
						document.getElementById("login").value = "";
					}
				});
		});
};

// koncowe podsumowanie zamowienia
const getOrderSummary = () => {
	const sumBooking = document.createElement("div");
	sumBooking.classList.add("l-login__order");

	const user = document
		.querySelector(".c-button__login")
		.getAttribute("data-user");
	const allTicket = document.querySelector(
		".l-section--result .c-flightResult__box"
	);

	if (
		document.querySelector(".c-flightResult__position--box") != null &&
		user != null
	) {
		sumBooking.innerHTML = `<h1 class="l-login__order--title">
		Your order: ${user} </h1> ${allTicket.innerHTML}`;
		document.querySelector("main").innerHTML = "";
		document.querySelector("main").appendChild(sumBooking);
		document
			.querySelectorAll(".c-flightResult__text--description")
			.forEach((el) => (el.style.width = "100%"));
		// usuniecie X
		document
			.querySelectorAll(".c-flightResult__position--box")
			.forEach((el) => el.firstElementChild.remove());
		// zablokowanie inputów
		document
			.querySelectorAll(".ticket, .baggage")
			.forEach((el) => (el.disabled = true));

		sumBooking.lastElementChild.remove();
	}
};

// taimer. czas do wylogowania
const getTimer = () => {
	let span = document.querySelector(".c-button__login span");
	let loginForm = document.querySelector(".l-login");
	let number = 60;

	return () => {
		number--;
		span.textContent = number;

		if (number == 15) {
			document.querySelector("main").style.filter = "blur(10px)";
			document.querySelector("main").removeEventListener("click", getBlur);
			const div = document.createElement("div");
			div.classList.add("l-login__timer");
			div.innerHTML = `<h2 style="padding-bottom: 15px;">${number} </h2><button class="c-button">
				click to extend <span><i class="fas fa-redo-alt"></i></span></button>`;
			loginForm.appendChild(div);
			let stop = setInterval(function () {
				document.querySelector(".l-login__timer h2").textContent = number;
			}, 100);

			div.addEventListener("click", function () {
				number = 60;
				document.querySelector("main").style.filter = "blur(0px)";
				div.remove();
				clearInterval(stop);
			});
			getLogout(stop);
		} else if (number == 0) {
			return location.reload();
		}
	};
};

// dezaktywacja tła
const getBlur = () => {
	document.querySelector("main").style.filter = "blur(0px)";
	if (document.querySelector(".l-login div") != null) {
		document.querySelector(".l-login div").remove();
	}
};

// wylogowanie
const getLogout = (stop) => {
	document
		.querySelector(".c-button__login")
		.addEventListener("click", function () {
			document.querySelector(".c-button__login").textContent = "Sign in";
			document.querySelector(".c-button__login").removeAttribute("data-user");
			window.clearInterval(stop);
			if (document.querySelector(".l-login__timer") != null) getBlur();
			this.addEventListener("click", getLoginForm);
		});
};

export { getOrderSummary, getLoginForm };
