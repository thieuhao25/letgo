//Menu thay đổi
$(function ($) {
    $toggleMenu = $('.header__toggle');
    $toggleMenu.bind('click', function (e) {
        var el = $(this);
        el.toggleClass('active');
        $('.menuMain').slideToggle(200);
        e.preventDefault();
    });

    $expand = $('.expand');
    $expand.click(function () {
        el = $(this);
        elUl = $(this).next("ul");
        if (el.hasClass('active')) {
            el.removeClass('active');
            elUl.stop().slideUp(200);
        } else {
            el.addClass('active');
            elUl.stop().slideDown(200);
        }
    });
});

function bannerSlider() {
    $('.banner__wrapper').slick({
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        dots: true
    });
}
function sliderDetail() {
    $('.sliderDetail__inner').slick({
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: true,
        dots: false,
        prevArrow: '<a class="arrow arrow-back" href="#"></a>',
        nextArrow: '<a class="arrow arrow-next" href="#"></a>',
        responsive: [
            {
                breakpoint: 991,
                settings: {
                    slidesToShow: 3
                }
            },
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1
                }
            }
        ]
    });
}

function showAllContentDetail() {
    var maxHeight = $('.mainDetail__primary .content .text').height();
    var contentHeight = $('.mainDetail__primary .content');

    var click = $('.btn-seeAll a');
    click.bind('click', function (e) {
        e.preventDefault();
        var el = $(this).parent();
        menuList = el.siblings('.content').find('.text');
        if (menuList.hasClass('active')) {
            el.removeClass('active');
            menuList.removeClass('active')
            contentHeight.css('height', '490px');
        } else {
            el.addClass('active');
            menuList.addClass('active');
            contentHeight.css('height', maxHeight);
        }
    })

}

function gotoTop() {
    var topTop = $('.footer__totop');
    $(window).scroll(function () {
        if ($(this).scrollTop() > 200) {
            topTop.stop().fadeIn(200)
        } else {
            topTop.stop().fadeOut(200)
        }
    });
    topTop.click(function () {
        $('body,html').animate({ scrollTop: 0 }, 500);
        return false
    })
}
function selectCustom() {
    $('#buy select').selectpicker();
    $('#residental select').selectpicker();
    $('#location select').selectpicker();
    $('#price select').selectpicker();
    $('#show select').selectpicker();
    $('#general select').selectpicker();
    $('.selectui').selectpicker();
}

function dropdownMore() {
    $(document).on('click', '.btn-more', function (e) {
        var el = $(this),
            elParent = el.parent('.bootstrap-select'),
            elNext = el.next('.dropdown-menu');

        if (elParent.hasClass('show')) {
            elParent.removeClass('show');
            elNext.removeClass('show');
        } else {

            elParent.addClass('show');
            elNext.addClass('show');
        }
    });

    $(document).click(function (event) {
        if (!($(event.target).parents().is('.dropdown-more') || $(event.target).is('.dropdown-more') || $(event.target).parents().is('.btn-more') || $(event.target).is('.btn-more'))) {
            $('.dropdown-more').removeClass('show');
            $('.dropdown-more').parent('.btn-group').removeClass('show');
        }
    });
}

function getValuedropdown(that) {
    var el=$('.dropdown-menu ul li a');
    var selText=$(that).html();
    $(that).parents('.input-group-prepend').find('.dropdown-toggle').html(selText)
}

function sliderInterest() {
    var el = $("#sliderInterest");
    el.slick({
        infinite: true,
        arrows: true,
        slidesToShow: 6,
        slidesToScroll: 6,
        prevArrow: '<a class="arrow arrow-back" href="#"></a>',
        nextArrow: '<a class="arrow arrow-next" href="#"></a>',
        responsive: [
            {
                breakpoint: 1600,
                settings: {
                    slidesToShow: 5,
                    slidesToScroll: 5,
                }
            },
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 4,
                }
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                }
            },
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
            },
            {
                breakpoint: 360,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    });
}

function quantityWidth() {

    var quantitiy = 0;
    $('.icon_plus_alt2').click(function (e) {
        // Stop acting like a button
        e.preventDefault();
        // Get the field name
        var width = $(this).siblings('input');

        var quantity = parseInt(width.val());
        max = (quantity + parseInt(1));

        score_width = max;
        // If is not undefined
        width.val(max);
        // Increment
    });

    $('.icon_minus_alt2').click(function (e) {
        // Stop acting like a button
        e.preventDefault();
        // Get the field name
        var width = $(this).siblings('input');

        var quantity = parseInt(width.val());
        min = (quantity - parseInt(1));

        score_width = min;
        // If is not undefined
        // Increment
        if (quantity > 0) {
            width.val(min);
        }
    });

    //add get value from on input
    $('.numberOfBath').on("input", function () {
        var dInput = this.value;
        score_width = dInput;
    });

    //check is_number
    $(".numberOfBath").on("keypress keyup blur", function (event) {
        //this.value = this.value.replace(/[^0-9\.]/g,'');
        $(this).val($(this).val().replace(/[^0-9\.]/g, ''));
        if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
            event.preventDefault();
        }
    });

}
quantityWidth();
//$('.fancybox').fancybox();
$(".fancybox").fancybox({
    thumbs : {
		autoStart : true
	},
    buttons : ['slideShow', 'close']
});

$('.dropdown-menu.ddRange')
        .click(function(e) {
          e.stopPropagation();
        });

      function disableDropDownRangeOptions(max_values, minValue) {
        if (max_values) {
          max_values.each(function() {
            var maxValue = $(this).attr("value");

            if (parseInt(maxValue) < parseInt(minValue)) {
              $(this).addClass('disabled');
            } else {
              $(this).removeClass('disabled');
            }
          });
        }
      }

      function setuinvestRangeDropDownList(min_values, max_values, min_input, max_input, clearLink, dropDownControl) {
        min_values.click(function() {
          var minValue = $(this).attr('value');
          min_input.val(minValue);
          document.getElementById('price_range1').innerHTML = minValue;

          disableDropDownRangeOptions(max_values, minValue);

          validateDropDownInputs();
        });

        max_values.click(function() {
          var maxValue = $(this).attr('value');
          max_input.val(maxValue);
          document.getElementById('price_range2').innerHTML = maxValue;

          toggleDropDown();
        });

        clearLink.click(function() {
          min_input.val('');
          max_input.val('');

          disableDropDownRangeOptions(max_values);

          validateDropDownInputs();
        });

        min_input.on('input',
          function() {
            var minValue = min_input.val();

            disableDropDownRangeOptions(max_values, minValue);
            validateDropDownInputs();
          });

        max_input.on('input', validateDropDownInputs);

        max_input.blur('input',
          function() {
            toggleDropDown();
          });

        function validateDropDownInputs() {
          var minValue = parseInt(min_input.val());
          var maxValue = parseInt(max_input.val());

          if (maxValue > 0 && minValue > 0 && maxValue < minValue) {
            min_input.addClass('inputError');
            max_input.addClass('inputError');

            return false;
          } else {
            min_input.removeClass('inputError');
            max_input.removeClass('inputError');

            return true;
          }
        }

        function toggleDropDown() {
          if (validateDropDownInputs() &&
            parseInt(min_input.val()) > 0 &&
            parseInt(max_input.val()) > 0) {

            // auto close if two values are valid
            dropDownControl.dropdown('toggle');
          }
        }
      }

      setuinvestRangeDropDownList(
        $('.investRange .min_value'),
        $('.investRange .max_value'),
        $('.investRange .freeformPrice .min_input'),
        $('.investRange .freeformPrice .max_input'),
        $('.investRange .btnClear'),
        $('.investRange .dropdown-toggle'));

getValuedropdown();

$('.dropdown-menu.ddRange1')
        .click(function(e) {
          e.stopPropagation();
        });

      function disableDropDownRangeOptions(max_values, minValue) {
        if (max_values) {
          max_values.each(function() {
            var maxValue = $(this).attr("value");

            if (parseInt(maxValue) < parseInt(minValue)) {
              $(this).addClass('disabled');
            } else {
              $(this).removeClass('disabled');
            }
          });
        }
      }

      function setuinvestRangeDropDownList1(min_values, max_values, min_input, max_input, clearLink, dropDownControl) {
        min_values.click(function() {
          var minValue = $(this).attr('value');
          min_input.val(minValue);
          document.getElementById('price_range1a').innerHTML = minValue;

          disableDropDownRangeOptions(max_values, minValue);

          validateDropDownInputs();
        });

        max_values.click(function() {
          var maxValue = $(this).attr('value');
          max_input.val(maxValue);
          document.getElementById('price_range2a').innerHTML = maxValue;

          toggleDropDown();
        });

        clearLink.click(function() {
          min_input.val('');
          max_input.val('');

          disableDropDownRangeOptions(max_values);

          validateDropDownInputs();
        });

        min_input.on('input',
          function() {
            var minValue = min_input.val();

            disableDropDownRangeOptions(max_values, minValue);
            validateDropDownInputs();
          });

        max_input.on('input', validateDropDownInputs);

        max_input.blur('input',
          function() {
            toggleDropDown();
          });

        function validateDropDownInputs() {
          var minValue = parseInt(min_input.val());
          var maxValue = parseInt(max_input.val());

          if (maxValue > 0 && minValue > 0 && maxValue < minValue) {
            min_input.addClass('inputError');
            max_input.addClass('inputError');

            return false;
          } else {
            min_input.removeClass('inputError');
            max_input.removeClass('inputError');

            return true;
          }
        }

        function toggleDropDown() {
          if (validateDropDownInputs() &&
            parseInt(min_input.val()) > 0 &&
            parseInt(max_input.val()) > 0) {

            // auto close if two values are valid
            dropDownControl.dropdown('toggle');
          }
        }
      }

      setuinvestRangeDropDownList1(
        $('.investRange .min_value1'),
        $('.investRange .max_value1'),
        $('.investRange .freeformPrice .min_input1'),
        $('.investRange .freeformPrice .max_input1'),
        $('.investRange .btnClear'),
        $('.investRange .dropdown-toggle'));

selectCustom();
dropdownMore();
gotoTop();
bannerSlider();
sliderDetail();
showAllContentDetail();
sliderInterest();