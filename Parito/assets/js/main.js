(function ($) {
  "use strict";  //严格模式

  var BASE_IP = 'http://attic.vip:8085'



  //获取UUID标识请求
  function guidGenerator() {
    var S4 = function () {
      return ((1 + Math.random()) * 0X10000 | 0).toString(16).substring(1);
    };
    return (S4() + "-" + S4() + "-" + S4());
  }


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
    $.ajax({
      async: false,
      type: "post",
      url: BASE_IP + "/sso/login",
      data: { username: username, password: password },
      dataType: "json",
      success: function (response) {
        if (response.code == 200) {
          localStorage.setItem('token', response.data.token);
          location.href = 'index.html'
        } else {
          alert('邮箱或密码错误')
        }
      }
    });
  })


  $('#registerBody').ready(function () {
    var uuid = guidGenerator()
    localStorage.setItem('uuid', uuid)
    $('#register').find('.img').attr('src', BASE_IP + '/sso/captcha.jpg' + `?uuid=${uuid}`)
    console.log(1111, uuid);

  })

  $('#register').find('.changeImg').bind('click', function () {
    var uuid = guidGenerator()
    localStorage.setItem('uuid', uuid)
    $('#register').find('.img').attr('src', BASE_IP + '/sso/captcha.jpg' + `?uuid=${uuid}`)
  })


  $('#register').find('.btn').bind('click', function () {
    let email = $('#register').find('.email').val()
    let code = $('#register').find('.code').val()
    let password = $('#register').find('.password').val()
    console.log(email, code, password);
    $.ajax({
      type: "post",
      url: BASE_IP + '/sso/register',
      data: {
        authCode: code,
        uuid: localStorage.getItem('uuid'),
        password: password,
        username: email
      },
      dataType: "json",
      // headers: {
      //   'Content-Type': 'application/json',
      // },
      success: function (response) {
        console.log(response);
        if (response.code == 200) {
          localStorage.removeItem('uuid')
          location.href = 'index.html'
        }
      }
    });


  })
  // 刷新购物车
  function refreshCart() {
    var token = localStorage.getItem('token')
    $.ajax({
      async: false,
      type: "get",
      url: BASE_IP + "/cart/list",
      dataType: "json",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      success: function (response) {
        console.log(555, response);

        if (response.code == 200) {
          // $('#cartProductList,#indexCartProductList').html('')
          var data = response.data
          $('#indexCartButton,#cartButton,#shopCartButton').find('.count').text(data.length)
          var totalPrice = 0;
          for (var i = 0; i < data.length; i++) {
            var price = Number(data[i].price) * Number(data[i].quantity)
            totalPrice += price
          }
          $('#indexCartButton,#cartButton,#shopCartButton').find('.price').text(totalPrice)
        }
      }
    })
  }

  // 首页
  $('#indexBody').ready(function () {
    refreshCart();
    // 首页推荐商品

    $.ajax({
      type: "get",
      url: BASE_IP + "/home/hotProductList",
      dataType: "json",
      success: function (response) {
        var data = response.data;

        for (var i = 0; i < data.length; i++) {
          var html = `<div class="col-lg-3 col-md-4 col-sm-6">
          <div class="single-grid-product">
              <div class="product-top" >
                  <img class="product-thumbnal" style="height:300px"
                          src="${data[i].pic}" />
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
        for (var i = 0; i < target.length; i++) {
          $(target[i]).bind('click', function () {
            localStorage.setItem('productID', $(this).attr('productid'))
            location.href = 'shop-grid.html'
          })
        }

      }
    });
  })


  // 二级商品展示页
  $('#ProductItemBody').ready(function () {
    refreshCart();
    var productID = localStorage.getItem('productID')
    $.ajax({
      type: "get",
      url: BASE_IP + `/product/detail/${productID}`,
      data: "data",
      dataType: "json",
      success: function (response) {
        var data = response.data.skuStockList
        for (var i = 0; i < data.length; i++) {

          var html = `<div class="col-lg-3 col-md-4 col-sm-6" >
        <div class="single-grid-product">
            <div class="product-top">
                <img class="product-thumbnal"
                        src="${data[i].pic}"  alt="product" />
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
                    refreshCart();
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


  // 购物车按钮
  $('#cartButton,#indexCartButton').bind('click', function () {
    if (!localStorage.getItem('token')) {
      alert('please login in')
      location.href = 'sing-in.html'
    }

    // 获取购物车按钮内部的总价格
    function getTotalPrice() {
      var target = $('#cartProductList,#indexCartProductList').children('.product-item')
      var totalPrice = 0;
      for (var i = 0; i < target.length; i++) {
        totalPrice += Number($(target[i]).find('.price').text().split('$')[0])
      }

      $('#cartTotalPrice,#indexCartTotalPrice').text(totalPrice)
    }

    // 获取购物车列表
    var token = localStorage.getItem('token')
    $.ajax({
      async: false,
      type: "get",
      url: BASE_IP + "/cart/list",
      dataType: "json",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      success: function (response) {

        if (response.code == 200) {
          $('#cartProductList,#indexCartProductList').html('')
          var data = response.data
          $('#cartButton,#indexCartButton').find('.count').text(data.length)
          for (var i = 0; i < data.length; i++) {
            var html =
              `<div class="product-item cart-product-item" cartid=${data[i].id}>
            <div class="single-grid-product">
                <div class="product-top" >
                    <a href="single-product.html"><img class="product-thumbnal"
                            src="${data[i].productPic}" alt="cart"></a>
                </div>
                <div class="product-info">
                    <div class="product-name-part">
                        <h4 class="product-catagory">${data[i].productName}</h4>
                        <h3 class="product-name"><a class="product-link" href="single-product.html">${JSON.stringify(JSON.parse(data[i].productAttr))}</a></h3>

                        <div class="cart-quantity input-group">
                            <div class="increase-btn dec qtybutton btn">-</div>
                            <input class="qty-input cart-plus-minus-box" type="text" name="qtybutton" value="${data[i].quantity}"
                                readonly />
                            <div class="increase-btn inc qtybutton btn">+</div>
                        </div>

                        <button class="cart-remove-btn">Remove</button>
                    </div>
                    <div class="product-price">

                        <span class="price">$${Number(data[i].price) * Number(data[i].quantity)}</span>
                    </div>
                </div>
            </div>
        </div>`
            $('#cartProductList,#indexCartProductList').append(html)
            getTotalPrice()
          }



          var target = $('#cartProductList,#indexCartProductList').find('.product-item')

          for (var i = 0; i < target.length; i++) {

            $(target[i]).find('.dec').bind('click', function () {


              var cartid = $(this).parents('.product-item').attr('cartid');

              var quantity = $(this).siblings('.qty-input').attr('value')
              if (quantity > 0) {
                changeProductQuantity(Number(cartid), Number(quantity) - 1)
                $(this).siblings('.qty-input').attr('value', quantity - 1)
                getTotalPrice()
                refreshCart()
              }
            });

            $(target[i]).find('.inc').bind('click', function () {
              var cartid = $(this).parents('.product-item').attr('cartid');


              var quantity = $(this).siblings('.qty-input').attr('value')
              changeProductQuantity(Number(cartid), Number(quantity) + 1)

              $(this).siblings('.qty-input').attr('value', Number(quantity) + 1)
              getTotalPrice()
              refreshCart()

            });

            $(target[i]).find('.cart-remove-btn').bind('click', function () {
              var token = localStorage.getItem('token')

              var cartid = $(this).parents('.product-item').attr('cartid');
              $.ajax({
                async: false,
                type: "post",
                url: BASE_IP + "/cart/delete",
                data: { ids: cartid },
                dataType: "json",
                headers: {
                  // 'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + token
                },
                success: function (response) {
                  if (response.code == 200) {
                    var removeList = $('#cartProductList,#indexCartProductList').find('.product-item');
                    for (var i = 0; i < removeList.length; i++) {
                      if ($(removeList[i]).attr('cartid') == cartid) {
                        $(removeList[i]).remove()
                      }
                    }
                    getTotalPrice()
                    refreshCart()
                    // $(this).parents('.product-item').remove()
                    alert('删除成功')
                  }
                }
              });
            })
          }
        }
      }
    });
  })


  // 修改购物车中商品数量
  function changeProductQuantity(id, quantity) {
    var token = localStorage.getItem('token')
    $.ajax({
      type: "get",
      url: BASE_IP + "/cart/update/quantity",
      data: { id: id, quantity: quantity },
      dataType: "json",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      success: function (response) {
      }
    });
  }


  $('#cheakCartBody').ready(function () {
    var token = localStorage.getItem('token')
    $.ajax({
      async: false,
      type: "get",
      url: BASE_IP + "/cart/list",
      dataType: "json",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      success: function (response) {
        if (response.code == 200) {
          var totalPrice = 0
          var data = response.data
          console.log(data);
          for (let i = 0; i < data.length; i++) {
            const element = data[i];
            totalPrice += Number(element.price) * Number(element.quantity)
            var html = `<li class="single-cart-product d-flex justify-content-between">
            <div class="product-info" cartid=${element.id}>
            <h3>${element.productName}</h3>
            <p>${element.productAttr}</p>
            <p>Quantity: ${element.quantity}</p>

        </div>
        <div class="price-area">
            <h3 class="price">$${Number(element.price) * Number(element.quantity)}</h3>
        </div></li>`
            $('#checkCartItem').append(html)
          }
          $('#checkCartItem').siblings('.total-amount').find('span').text(`$${totalPrice}`)
        }
      }
    })
  })

  $('#checkoutButton').bind('click', function () {
    var check = $('#checkCartItem').find('.product-info')
    var cartID = []
    if (check.length == 0) {
      alert('You have not selected an item')
      return
    }
    for (let i = 0; i < check.length; i++) {
      const element = check[i];

      cartID.push(Number($(element).attr('cartid')))
    }
    var token = localStorage.getItem('token')
    $.ajax({
      async: false,
      type: "post",
      url: BASE_IP + "/order/generateOrder",
      data: JSON.stringify({
        "payType": 3,
        "cartIds": cartID
      }),
      dataType: "json",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      success: function (response) {
        console.log(response);
        var orderId = response.data.order.id
        $.ajax({
          type: "get",
          url: BASE_IP + `/order/pay/${orderId}`,
          dataType: "json",
          headers: {
            // 'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          },
          success: function (response) {
            console.log(444, response);
            if (response.code == 200) {
              location.href = response.data
            }
          }
        });
      }
    })
  })


  $('#cartBody').ready(function () {
    var token = localStorage.getItem('token')
    $.ajax({
      async: false,
      type: "get",
      url: BASE_IP + "/cart/list",
      dataType: "json",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      success: function (response) {
        var data = response.data
        console.log(456789, data);
        for (let index = 0; index < data.length; index++) {
          const element = data[index];
          let html = `<tr class="cart-page-item" cartid=${element.id}>
          <td>
              <div class="single-grid-product m-0">
                  <div class="product-top">
                      <img class="product-thumbnal"
                              src="${element.productPic}" alt="cart">
                  </div>
                  <div class="product-info text-center">
                      <h3 class="product-name">${element.productName}</h3>
                      <h4 class="product-catagory">${element.productAttr}</h4>

                  </div>
              </div>
          </td>
          <td>
              <div class="product-price text-center">
                  <h3 class="price">$${element.price}</h3>
              </div>
          </td>
          <td>
              <div class="cart-quantity input-group">
                  <div class="increase-btn dec qtybutton btn">-</div>
                  <input class="qty-input cart-plus-minus-box" type="text" name="qtybutton"
                      value=${element.quantity} readonly />
                  <div class="increase-btn inc qtybutton btn">+</div>
              </div>
          </td>
          <td>
              <h1 class="cart-table-item-total">$${Number(element.price) * Number(element.quantity)}</h1>
          </td>
          <td><button class="delet-btn" title="Delete Item"><img src="assets/images/close.svg"
                      alt="close" /></button></td>
      </tr>`
          $('#cartItem').append(html)
        }
        getItemTotalPrice()



        function getItemTotalPrice() {
          let totalPrice = 0
          var target = $('#cartItem').find('.cart-table-item-total')
          var num = $('#cartItem').find('.qty-input')
          var price = $('cartItem').find('.price')
          for (let i = 0; i < target.length; i++) {
            let number = Number($(num[i]).attr('value'))
            let pri = Number($(price[i]).text().split('$')[0])
            totalPrice += number * pri
            $(target[i]).text(number * pri)
          }
          $('#payTotalPrice').text(totalPrice);
        }


        var target = $('#cartItem').find('.cart-page-item')

        for (var i = 0; i < target.length; i++) {

          $(target[i]).find('.dec').bind('click', function () {
            var cartid = $(this).parents('.cart-page-item').attr('cartid');

            var quantity = $(this).siblings('.qty-input').attr('value')
            if (quantity > 0) {
              changeProductQuantity(Number(cartid), Number(quantity) - 1)
              $(this).siblings('.qty-input').attr('value', quantity - 1)
              getItemTotalPrice()
              refreshCart()
            }
          });

          $(target[i]).find('.inc').bind('click', function () {
            var cartid = $(this).parents('.cart-page-item').attr('cartid');


            var quantity = $(this).siblings('.qty-input').attr('value')
            changeProductQuantity(Number(cartid), Number(quantity) + 1)

            $(this).siblings('.qty-input').attr('value', Number(quantity) + 1)
            getItemTotalPrice()

            // refreshCart()

          });

          $(target[i]).find('.delet-btn').bind('click', function () {
            var token = localStorage.getItem('token')

            var cartid = $(this).parents('.cart-page-item').attr('cartid');
            $.ajax({
              async: false,
              type: "post",
              url: BASE_IP + "/cart/delete",
              data: { ids: cartid },
              dataType: "json",
              headers: {
                // 'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
              },
              success: function (response) {
                if (response.code == 200) {
                  var removeList = $('#cartItem').find('.cart-page-item');
                  for (var i = 0; i < removeList.length; i++) {
                    if ($(removeList[i]).attr('cartid') == cartid) {
                      $(removeList[i]).remove()
                    }
                  }
                  getItemTotalPrice()

                  alert('删除成功')
                }
              }
            });
          })
        }
      }
    })

  })


  $('#shopListBody').ready(function () {
    $.ajax({
      type: "get",
      url: BASE_IP + "/home/hotProductList",
      dataType: "json",
      success: function (response) {
        console.log(123, response);
        var data = response.data;

        for (var i = 0; i < data.length; i++) {
          var html = `<div class="single-list-product">
          <div class="product-left">
              <img class="product-thumbnal"
                      src="${data[i].pic}" alt="product" />
              <div class="product-flags">
                  <span class="product-flag sale">SALE</span>
                  <span class="product-flag discount">-15%</span>
              </div>
          </div>
          <div class="product-right">
              <div class="product-catagory-review d-flex align-items-center">
                  <h1 >${data[i].name}</h1>
                  
              </div>
              
              <div class="product-price-color d-flex align-items-center">
                  <div class="product-price">
                     
                  </div>
                  
              </div>
              
              <p class="prdouct-content show-lg">${data[i].keywords}</p>
              <ul class="prdouct-btn-wrapper d-flex align-items-center">
                  <li class="single-product-btn">
                      <button class="showProduct" productid=${data[i].id}>Show All</button>
                  </li>
                  
              </ul>
          </div>
      </div>`
          $('#shopList').append(html)
        }
        var target = $('#shopList').find('.showProduct')
        for (var i = 0; i < target.length; i++) {
          console.log(target[i]);
          $(target[i]).bind('click', function () {
            localStorage.setItem('productID', Number($(this).attr('productid')))
            location.href = 'shop-grid.html'
          })
        }
      }
    })
  })


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