;
(function ($) {
	var monkeyupload = {
		init: function (options, div) {
			var $input = div.parent().find('input[type=file]');
			$.options = $.extend({}, $.defaults, options);
			this.input = $input;
			this.div = div;

			$input.bind($.options.action, function () {
				$.options.submit($input);
				monkeyupload.upload();
			});

			div.sortable();
			div.disableSelection();

			var contents = div.html();
			if (contents != '') {
				div.html('');
				var files = contents.split(',');

				for (var i in files) {
					if (files[i] != '')
						this.createDiv(files[i]);
				}
			}
		},
		createDiv: function (path) {
			var filename = path.split(/\\|\//).slice(-1)[0];
			var file = $(document.createElement('div'))
				.attr('class', 'file')
				.append('<input type="hidden" name="pic[]" value="' + path + '"><a href="#" data="' + path + '" class="pull-right del"><i class="icon icon-trash"></i></a><a target="_blank" href="' + path + '"><img src="' + path + '"></a>' + filename + '<div class="clearfix"></div>')

			monkeyupload.div.append(file);

			file.find('.del').click(function (e) {
				e.preventDefault();
				monkeyupload.delete($(this).parent());
			})
		},
		upload: function () {
			var $input = this.input,
				$newinput = $input.clone();
			formid = Math.floor(Math.random() * 10000 + 1);

			$input.val('');

			var form = $(document.createElement('form')).attr({
				id: 'f' + formid,
				method: 'post',
				action: $.options.url,
				enctype: 'multipart/form-data',
				style: 'display:none',
				class: 'upload-form'
			}).append($newinput).ajaxForm({
					url: $.options.url,
					dataType: 'json',
					cache: false,
					success: function (data) {
						//$('#f' + formid).remove();
						if (data.status == 'success') {
							$.options.success(data, $input);
						} else {
							$.options.error(data.error, $input);
						}
					}
				});
			$('body').append(form);
			$('#f' + formid).submit();
		},
		delete: function (file) {
			file.append($(document.createElement('li'))
				.attr('class', 'confirmation')
				.append('Are you sure you want delete this file? <button class="btn yes">Yes</button> <button class="btn no">No</button>'));

			file.find('.yes').click(function (e) {
				e.preventDefault();
				$.ajax({
					url: $.options.del_url,
					type: 'POST',
					cache: false,
					dataType: 'json',
					data: { file: file.find('input').val() },
					success: function(data) {
						if (data.status=='success')
							file.remove();
						else
							alert(data.error);
					}
				})
			});

			file.find('.no').click(function (e) {
				e.preventDefault();
				$(this).parent().remove();
			});
		}
	};

	$.defaults = {
		url: '/', // Upload processor
		del_url: '/', // Delete processor
		action: 'change', // Performing action
		submit: function (input) { // On submit action
			input.parent().find('.fake .file-info').html('Uploading file ' + $(input).val().split(/\\|\//).slice(-1)[0] + '...');
		},
		error: function (error, input) {
			input.parent().find('.file-info').html(error);
		},
		success: function (data, input) { // Success action
			var filename = data.file.split(/\\|\//).slice(-1)[0];
			monkeyupload.createDiv(data.file);
			input.parent().find('.file-info').html('');
		}
	}

	$.fn.monkeyupload = function (options) {
		if (typeof options === "object") {
			return this.each(function () {
				monkeyupload.init(options, $(this));
			});
		} else {
			switch (options) {
				case "upload":
					monkeyupload.upload($(this));
					break;
				case "delete":
					monkeyupload.delete($(this));
					break;
				default:
					monkeyupload.init($(this));
					break;
			}
		}
	}
})(jQuery);