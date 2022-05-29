"use strict";
(function () {
	var timeData = (function () {
		var data = decodeURIComponent(location.hash.substr(1));
		//Set Defaults
		if (!data) {
			var d = new Date();
			data = "2023 Seçimleri|" + (Date.UTC(d.getFullYear() + 1, 5, 18, 4, 30, 0) / 1000 | 0);
		}
		if (data.indexOf('|') < 0) {
			data = "Unknown Event|" + data;
		}
		var segments = data.split('|');

		return {
			name: decodeURIComponent(segments[0]).substr(0, 50),
			date: decodeURIComponent(segments[1]),
			options: segments.length > 2 ? segments[2].toLowerCase().split(',') : []
		};
	})();
	//Convert unix timestamp to JS Timestamp
	if (timeData.date == +timeData.date) {
		timeData.date = +timeData.date * 1000;
	}

	//Get Two digit number
	var n2 = function (x) {
		return ("00" + x).substr(-2);
	};

	//Get Timestamp
	var getDate = function () {
		var d = new Date(timeData.date);
		return d.getTime() || 0;
	};

	//Fill in the Form Values
	document.querySelector("[type=text]").value = timeData.name;
	document.querySelector("[type=datetime-local]").value = (function () {
		var d = new Date(timeData.date);
		if (isNaN(d.getDate())) {
			timeData.date = Date.now();
			d = new Date();
		}

		return d.getFullYear() + "-" + n2(d.getMonth() + 1) + "-" + n2(d.getDate()) + "T" + n2(d.getHours()) + ":" + n2(d.getMinutes());
	})();
	if (timeData.options.indexOf("hide-settings") >= 0) {
		document.querySelector("#settings").remove();
		document.querySelector("#timers").setAttribute("class", "col-sm-12");
	}

	var render = function () {
		document.querySelector("#eventname").textContent = timeData.name || "Unknown Event";
		var tl = document.querySelector("#timeleft");
		var timeLeft = ((getDate() - Date.now()) / 1000) | 0;

		if (timeLeft < 0) {
			var d = new Date(getDate());
			tl.textContent = "Timer ended";
		} else {
			var time = {
				days: (timeLeft / 86400 | 0).toString(),
				hours: n2(((timeLeft / 3600) | 0) % 24),
				mins: n2(((timeLeft / 60) | 0) % 60),
				secs: n2(timeLeft % 60)
			};
			tl.textContent = "";
			if (time.days > 0) {
				tl.textContent = time.days + " gün ";
			}
			tl.textContent += time.hours + ":" + time.mins + ":" + time.secs;
			window.setTimeout(render, 1500 - (Date.now() % 1000));
		}
	};
	if (getDate() == 0) {
		document.querySelector("#eventname").textContent = "Geçersiz Tarih";
	} else {
		var d = new Date(getDate());
		document.querySelector("#timeend").textContent = "Bitiş: " + d.toLocaleDateString() + " " + d.toLocaleTimeString();
		render();
	}

	var btn = document.querySelector("[type=button]");

	if (btn) {
		btn.addEventListener("click", function () {
			var name = document.querySelector("[type=text]").value || "Unknown Event";
			var date = new Date(document.querySelector("[type=datetime-local]").value);
			var options = [];
			if (document.querySelector("[type=checkbox]").checked) {
				options.push("hide-settings");
			}
			if (isNaN(date.getTime())) {
				alert("Please select a date and time");
			} else if (date.getTime() < Date.now()) {
				alert("Please select a date and time in the future");
			} else {
				location.hash = "#" + encodeURIComponent(name) + "|" + (date.getTime() / 1000 | 0) + "|" + options.join(',');
				location.reload();
			}
		});
	}
})();