var vm = {
	user: new User(),
	company: new Company(),
	isLogoChanging: true,

	setFileInput: function (id) {
		console.log(arguments);
		vm.fileInput = document.getElementById(id);
		return false;
	},
	uploadImage: function (vm, e) {
		if (!e.target.files.length) {
			return;
		}

		var file = e.target.files[0];
		if (!file) {
			return;
		}
		if (!file.type.match("image/*")) {
			return;
		}
		var reader = new FileReader();
		reader.addEventListener("loadend", function (e) {
			if (vm.isLogoChanging) {
				vm.company.logoSrc(reader.result);
			} else {
				vm.company.avatarDirector(reader.result);
			}
		});
		reader.readAsDataURL(file);
	},
	save: function () {
		var plainUser = ko.toJS(vm.user);
		var plainCompany = ko.toJS(vm.company);
		console.log(plainCompany, plainUser)
		var
			USER_REGISTER_URL = "/account/register";
		var data = JSON.stringify({
			user: plainUser,
			company: plainCompany
		});
		$.ajax({
			url: USER_REGISTER_URL,
			data: data,
			dataType: "json",
			contentType: "plain/text",
			type: "POST"
		}).done(function () {
			toastr.success("Дякуємо за вашу заявку! Після затвердження адміністрацією Ваша компанія появиться на сайті.");
			vm.resetForm();
			$(".modal").modal("hide");
		}).error(function () {
			toastr.error("Приносим свої вибачення! Сталась помилка при обробці вашої заявки. Спробуйте обновити сторінку і відправити заявку повторно. Якщо це не допомогло - повідомте про це адміністрацію.")
		});
	},
	resetForm: function () {
		vm.user.reset();
		vm.company.reset();
	},
	changeLogo: function () {
		vm.isLogoChanging = true;
		vm.fileInput.click();
	},
	changeDirectorAvatar: function () {
		vm.isLogoChanging = false;
		vm.fileInput.click();
	}
};

ko.applyBindings(vm);