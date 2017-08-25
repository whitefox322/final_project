var User = (function() {
	function User() {
		this.init();
	}
	User.prototype = {
		init: function() {
			this.position = ko.observable();
			this.phone = ko.observable();
			this.fullName = ko.observable();
			this.email = ko.observable();
			this.reset();
		},
		reset: function() {
			this.position("");
			this.phone("");
			this.fullName("");
			this.email("");
		}
	};

	return User;
})();
var Company = (function() {
	function Company() {
		this.init();
	}
	Company.prototype = {
		init: function() {
			this.logoSrc = ko.observable();
			this.name = ko.observable();
			this.description = ko.observable();
			this.contactLines = ko.observableArray();
			this.fullNameDirector = ko.observable();
			this.avatarDirector = ko.observable();
			this.isShowDirector = ko.observable();
			this.reset();
		},
		reset: function() {
			this.logoSrc("https://placehold.it/200x100");
			this.name("");
			this.description("");
			this.contactLines([]);
			this.fullNameDirector("");
			this.avatarDirector("https://placehold.it/200x100");
			this.isShowDirector(false);
		},
		addContact: function() {
			this.contactLines.push(new ContactLine());
		},
		removeContact: function(contact) {
			this.contactLines.remove(contact);
		}
	};
	return Company;
})();
var ContactLine = (function() {
	function ContactLine() {
		this.value = ko.observable();
		this.type = ko.observable();
	}
	ContactLine.types = [
		{ name: "Адреса", value: 0 },
		{ name: "Телефон", value: 1 },
		{ name: "Сторанка соц. мережі", value: 2 },
		{ name: "Мобільний", value: 4 },
		{ name: "E-mail", value: 5 },
		{ name: "Сайт", value: 6 }
	];
	return ContactLine;
})();