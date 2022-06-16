(function ($) {
  "use strict";  //严格模式

  var BASE_IP = 'http://attic.vip:8085'


  $(window).on('scroll', function () {
    if ($(window).scrollTop() > 80) {
      $('#sticky').addClass('stick');
    } else {
      $('#sticky').removeClass('stick');
    }
  });


  // 登录按钮
  $('#loginButton').bind('click', function () {
    var username = $('#username').val();
    var password = $('#password').val();
    // console.log(username, password);
    $.ajax({
      async: false,
      type: "post",
      url: BASE_IP + "/sso/login",
      data: { username: username, password: password },
      dataType: "json",
      success: function (response) {
        console.log(response);
        if (response.code == 200) {
          localStorage.setItem('token', response.data.token);
          location.href = 'index.html'
        } else {
          alert('邮箱或密码错误')
        }
      }
    });
  })

  $('#indexBody').ready(function () {

    // 首页推荐商品

    $.ajax({
      type: "get",
      url: BASE_IP + "/home/hotProductList",
      dataType: "json",
      success: function (response) {
        console.log(123, response);

        var data = response.data;


        for (var i = 0; i < data.length; i++) {

          var html = `<div class="col-lg-3 col-md-4 col-sm-6">
          <div class="single-grid-product">
              <div class="product-top" >
                  <img class="product-thumbnal" style="height:200;width:200"
                          src="${data[i].pic}?${data[i].pic}:./assets/images/blog-1.jpg" />
              </div>
              <div class="product-info text-center">
                  <div class="product-price">
                      <span class="price">$${data[i].price}</span>
                      
                  </div>
                
                  <button class="add-cart" productid=${data[i].id}>Show All</button>
              </div>
          </div>
      </div>`
          $('#indexItem').append(html)
        }
        var target = $('#indexItem').find('.add-cart')
        console.log(47, target);
        for (var i = 0; i < target.length; i++) {
          $(target[i]).bind('click', function () {
            // console.log($(this).attr('productid'));
            localStorage.setItem('productID', $(this).attr('productid'))
            location.href = 'shop-grid.html'
          })
        }

      }
    });
  })







  $('#ProductItemBody').ready(function () {
    var productID = localStorage.getItem('productID')
    $.ajax({
      type: "get",
      url: BASE_IP + `/product/detail/${productID}`,
      data: "data",
      dataType: "json",
      success: function (response) {
        console.log(response.data.skuStockList[0]);
        var data = response.data.skuStockList
        for (var i = 0; i < data.length; i++) {

          var html = `<div class="col-lg-3 col-md-4 col-sm-6" >
        <div class="single-grid-product">
            <div class="product-top">
                <a href="single-product.html"><img class="product-thumbnal"
                        src="${data[i].pic}?${data[i].pic}:./assets/images/blog-1.jpg" alt="product" /></a>
            </div>
            <div class="product-info text-center">
                <h4 class="product-catagory"<${data[i].spData}</h4>
                <div class="product-price">
                    <span class="price">$${data[i].price}</span>
                </div>
                <input class="quantity" type="text" style="margin-bottom:10px" placeholder="Input quantity" >
                <button class="add-cart" productID="${data[i].productId}" productSkuId="${data[i].id}" >Add To Cart<i
                        class="icon fas fa-plus-circle"></i></button>
            </div>
        </div>
    </div>`
          $('#productItem').append(html)

        }

        var addCartButton = $('#productItem').find('.add-cart')
        var inputQuantity = $('#productItem').find('.quantity')
        for (var i = 0; i < addCartButton.length; i++) {
          $(addCartButton[i]).bind('click', function () {
            console.log(147, $(inputQuantity[i]));
            var quantityT = $(this).parent().find('.quantity')
            var quantity = $(quantityT).val()
            if (!quantity) {
              alert('请输入正确的数量');
            } else {
              var productID = $(this).attr('productID')
              var productSkuId = $(this).attr('productSkuId')
              var token = localStorage.getItem('token')

              // 添加到购物车;
              $.ajax({
                type: "post",
                url: BASE_IP + "/cart/add",
                data: JSON.stringify({
                  productId: productID,
                  productSkuId: productSkuId,
                  quantity: quantity
                }),

                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + token
                },
                dataType: "json",
                success: function (response) {
                  if (response.code == 200) {
                    alert('添加成功')
                    $(quantityT).val('');
                  }

                },
              });
            }

          })
        }
      }
    });

  })


  // $(body).ready(function () {
  //   $.ajax({
  //     type: "post",
  //     url: "url",
  //     data: "data",
  //     dataType: "dataType",
  //     success: function (response) {

  //     }
  //   });
  // })

  /*-------------------------------------------
  Mobile Menu
  --------------------------------------------- */
  function mobile_menu_active() {
    /*Category Sub Menu Toggle*/
    $('.mobile-menu-area .main-menu').on('click', 'li a, .menu-expand', function (e) {
      var $this = $(this);
      if ($this.attr('href') === '#' || $this.hasClass('menu-expand')) {
        e.preventDefault();
        if ($this.siblings('ul:visible').length) {
          $this.parent('li').removeClass('active');
          $this.siblings('ul').slideUp();
          $this.parent('li').find('li').removeClass('active');
          $this.parent('li').find('ul:visible').slideUp();
        } else {
          $this.parent('li').addClass('active');
          $this.closest('li').siblings('li').removeClass('active').find('li').removeClass('active');
          $this.closest('li').siblings('li').find('ul:visible').slideUp();
          $this.siblings('ul').slideDown();
        }
      }
    });
  }
  mobile_menu_active();

  /*-------------------------------------------
  js scrollup
  --------------------------------------------- */
  $.scrollUp({
    scrollText: '<i class="fa fa-angle-up"></i>',
    easingType: 'linear',
    scrollSpeed: 500,
    animation: 'fade'
  });

  /*-------------------------------------------
  hero-slider active
  --------------------------------------------- */
  $('.hero-slider').slick({
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 3000,
    dots: true,
    arrows: false,
    prevArrow: '<i class="slick-prev fas fa-angle-left"></i> ',
    nextArrow: '<i class="slick-next fas fa-angle-right"></i> ',
  });

  /*-------------------------------------------
  hero-banner-slide-v3 active
  --------------------------------------------- */
  $('.hero-banner-slide-v3').slick({
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    dots: true,
    fade: true,
    arrows: false,
    prevArrow: '<i class="slick-prev fas fa-angle-left"></i> ',
    nextArrow: '<i class="slick-next fas fa-angle-right"></i> ',
  });

  /*-------------------------------------------
  brads-slide active
  --------------------------------------------- */
  $('.brads-slide').slick({
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    dots: false,
    arrows: false,
    prevArrow: '<i class="slick-prev fas fa-angle-left"></i> ',
    nextArrow: '<i class="slick-next fas fa-angle-right"></i> ',
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 3,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1
        }
      }
    ]
  });

  /*-------------------------------------------
  story-box-slide active
  --------------------------------------------- */
  $('.story-box-slide').slick({
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    dots: true,
    arrows: true,
    prevArrow: '<i class="slick-prev fas fa-angle-left"></i> ',
    nextArrow: '<i class="slick-next fas fa-angle-right"></i> ',
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  });

  /*-------------------------------------------
  blog-slide active
  --------------------------------------------- */
  $('.blog-slide').slick({
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    dots: true,
    arrows: true,
    prevArrow: '<i class="slick-prev fas fa-angle-left"></i> ',
    nextArrow: '<i class="slick-next fas fa-angle-right"></i> ',
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  });

  /*-------------------------------------------
  testimonial-slide active
  --------------------------------------------- */
  $('.testimonial-image-slide').slick({
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    dots: false,
    arrows: false,
    fade: true,
    cssEase: 'linear',
    asNavFor: '.testimonail-slide',
  });
  $('.testimonail-slide').slick({
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    dots: true,
    arrows: false,
    fade: true,
    cssEase: 'linear',
    asNavFor: '.testimonial-image-slide',
  });

  /*-------------------------------------------
  recommend-product-slide active
  --------------------------------------------- */
  $('.recommend-product-slide').slick({
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    dots: false,
    arrows: true,
    prevArrow: '<i class="slick-prev fas fa-angle-left"></i> ',
    nextArrow: '<i class="slick-next fas fa-angle-right"></i> ',
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  });
  $('button[data-bs-toggle="tab"]').on('shown.bs.tab', function (e) {
    $('.recommend-product-slide').slick('setPosition');
  });

  /*-------------------------------------------
  testimonial-slide-two active
  --------------------------------------------- */
  $('.testimonial-slide-two').slick({
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 3000,
    dots: false,
    arrows: true,
    prevArrow: '<i class="slick-prev flaticon-left-arrow-1"></i> ',
    nextArrow: '<i class="slick-next flaticon-right-arrow"></i> ',
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      },
      {
        breakpoint: 481,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  });

  /*-------------------------------------------
  testimonial-slide-v3 active
  --------------------------------------------- */
  $('.testimonial-slide-v3').slick({
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    dots: true,
    arrows: false,
    prevArrow: '<i class="slick-prev flaticon-left-arrow-1"></i> ',
    nextArrow: '<i class="slick-next flaticon-right-arrow"></i> ',
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 2
        }
      },
      {
        breakpoint: 481,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  });

  /*-------------------------------------------
  best-selling-product-silde active
  --------------------------------------------- */
  $('.best-selling-product-silde').slick({
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    dots: false,
    arrows: true,
    prevArrow: '<i class="slick-prev fas fa-angle-left"></i> ',
    nextArrow: '<i class="slick-next fas fa-angle-right"></i> ',
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      },
      {
        breakpoint: 481,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  });

  /*-------------------------------------------
    product-priview-slide active
  --------------------------------------------- */
  $('.product-priview-slide').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    arrows: false,
    fade: true,
    asNavFor: '.product-thumb-silide'
  });
  $('.product-thumb-silide').slick({
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: false,
    asNavFor: '.product-priview-slide',
    dots: false,
    arrows: false,
    centerMode: false,
    focusOnSelect: true,
    vertical: true,
  });

  /*-------------------------------------------
    product-priview-slide-v2 active
  --------------------------------------------- */
  $('.product-priview-slide-v2').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    arrows: false,
    fade: true,
    asNavFor: '.product-thumb-silide-v2'
  });
  $('.product-thumb-silide-v2').slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: false,
    asNavFor: '.product-priview-slide-v2',
    dots: false,
    arrows: false,
    focusOnSelect: true,
  });

  /*---------------------------------
  Language Switcher  active
  -----------------------------------*/
  $(".lang-switcher").on("click", function (e) {
    e.preventDefault();
    $(".lang-list").toggleClass("lang-list-open");
    $(".currency-list").removeClass("currency-list-open");
  });
  $(".lang-list li").each(function () {
    $(this).on("click", function () {
      var logoSrc = $(this).children(".flag").children("img").attr("src");
      var flagText = $(this).children("a").text() + '<span><i class="fas fa-angle-down"></i></span>';
      $(".lang-switcher > .flag img").attr("src", logoSrc);
      $(".lang-switcher > a").html(flagText);
    });
  });

  /*---------------------------------
  Language Switcher  active
  -----------------------------------*/
  $(".currency-switcher").on("click", function (e) {
    e.preventDefault();
    $(".currency-list").toggleClass("currency-list-open");
    $(".lang-list").removeClass("lang-list-open");
  });
  $(".currency-list li").each(function () {
    $(this).on("click", function () {
      var logoSrc = $(this).children(".flag").children("i").attr("class");
      var flagText = $(this).children("a").text() + '<span><i class="fas fa-angle-down"></i></span>';
      $(".currency-switcher > .flag i").attr("class", logoSrc);
      $(".currency-switcher > a").html(flagText);
    });
  });

  /*---------------------------------
  magnificPopup active
  -----------------------------------*/
  $('.popup-image').magnificPopup({
    type: 'image',
    gallery: {
      enabled: true
    }
  });

  /*-------------------------------------------
  offer-product-time active
  --------------------------------------------- */
  $('#offer-product-time').countdown({
    date: '12/24/2020 23:59:59',// TODO Date format: 07/27/2017 17:00:00
    offset: +6, // TODO Your Timezone Offset
    day: 'Day',
    days: 'Days',
    hideOnComplete: true,
  });

  /*-------------------------------------------
  js counterUp
  --------------------------------------------- */
  $('.counter').counterUp({
    delay: 10,
    time: 1000
  });

  /*-------------------------------------------
  offer-product-time active
  --------------------------------------------- */
  $('.offer-product-time').countdown({
    date: '12/24/2021 23:59:59',// TODO Date format: 07/27/2017 17:00:00
    offset: +6, // TODO Your Timezone Offset
    day: 'Day',
    days: 'Days',
    hideOnComplete: true,
  });

  /*----------------------------
    Cart Plus Minus Button
  ------------------------------ */
  $(".qtybutton").on("click", function () {
    var $button = $(this);
    var oldValue = $button.parent().find("input").val();
    if ($button.text() === "+") {
      var newVal = parseFloat(oldValue) + 1;
    } else {
      // Don't allow decrementing below zero
      if (oldValue > 1) {
        var newVal = parseFloat(oldValue) - 1;
      } else {
        newVal = 1;
      }
    }
    $button.parent().find("input").val(newVal);
  });

  /*----------------------------
  checkout payment method active
  ------------------------------*/
  $('input[type="radio"]').on("click", function () {
    if ($(this).attr("value") == "creditcard") {
      $(".card-infor-box").slideDown('slow');
    }
    else {
      $(".card-infor-box").slideUp('slow');
    }
  });

  /*----------------------------
    footer widget dropdoen Button
  ------------------------------ */
  $(".single-widget .mobile-dropdown-title").on("click", function () {
    $('.single-widget .widget-menu').removeClass('show');
    $(this).siblings('.widget-menu').addClass('show');
  });

  /*----------------------------
    Offer Popup Modal
  ------------------------------ */
  $(window).on('load', function () {
    setTimeout(function () {
      //$('#popUpModal').modal('show');
    }, 500);
  });

  /*----------------------------
    Product size change
  ------------------------------ */
  if ($(".featured-productss-area, .featured-products-area-v2, .product-list, .product-single-right").length) {
    var singleProductGrid = $(".single-grid-product");

    var size = $(".size-switch li");

    size.on("click", function () {
      $(this).addClass("active");
      $(this).siblings().removeClass("active");
    })

  }
  /*----------------------------
    Product size change
  ------------------------------ */

  /*----------------------------
   Preloader
  ------------------------------ */
  $(window).on("load", function () {
    $("#status").fadeOut();
    $("#preloader")
      .delay(350)
      .fadeOut("slow");
  });

}(jQuery));