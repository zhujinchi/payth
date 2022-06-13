import 'dart:convert';
import 'package:crypto/crypto.dart';
import 'package:dio/dio.dart';
import 'package:payth/models/user.dart';
import 'package:payth/net/fluttertoast.dart';

var BASE_IP = 'http://attic.vip:8085';

class API {
  dynamic GetCode(String email) async {
    String url = BASE_IP + "/sso/getAuthCode";

    Dio dio = Dio();

    Map<String, dynamic> map = {};
    map['telephone'] = email.split('@')[0];

    Response response = await dio.get(url, queryParameters: map);

    var data = response.data;
    // print(data);

    return data;
  }

  dynamic Register(String email, String code, String password) async {
    String url = BASE_IP + "/sso/register";

    ///build Dio
    Dio dio = Dio();

    ///md5
    // String passwordMd5 = md5.convert(utf8.encode(password)).toString();

    ///build map
    FormData formData = FormData.fromMap({
      "telephone": email.split('@')[0],
      "authCode": code,
      'password': password,
      'username': email,
    });

    ///post
    Response response = await dio.post(url, data: formData);

    var data = response.data;
    // print(data);

    return data;
  }

  Login(String email, String password) async {
    // String url = BASE_IP + '/sso/login';
    String url = 'http://attic.vip:8085/sso/login';
    Dio dio = Dio();

    FormData formData = FormData.fromMap({
      "username": email,
      "password": password,
    });

    Response response = await dio.post(url, data: formData);
    var data = response.data;
    // print(data);

    return data;
  }

  //获取商品列表id
  dynamic GetProductID() async {
    String url = BASE_IP + '/home/content';
    Dio dio = Dio();
    Response response = await dio.get(url);
    List product_list = response.data['data']['hotProductList'];
    var ID_list = [];
    product_list.forEach((element) {
      ID_list.add(element['id']);
    });

    // print(ID_list);
    return ID_list;
  }

  //获取商品列表
  dynamic GetProduct() async {
    String token = User.shared().token;
    List ID_list = await GetProductID();
    List Product = [];
    Dio dio = Dio();

    for(int i = 0; i<ID_list.length; i++){
      // print('count'+i.toString());
      String url = BASE_IP + '/product/detail/${ID_list[i]}';
      Response response = await dio.get(url);
      // print(response.data);
      response.data['data']['skuStockList'].forEach((element) {
        Product.add(element);
      });
    }

    return Product;
  }

  //添加商品到购物车
  dynamic AddProduct(var productID, var skuID, var quantity) async {
    String url = BASE_IP + '/cart/add';
    String token = User.shared().token;

    Dio dio = Dio();
    dio.options.headers = {'Authorization': 'Bearer ' + token};

    var map = {
      "productId": productID,
      'productSkuId': skuID,
      'quantity': quantity,
    };


    Response response = await dio.post(url, data: map);
    var data = response.data;
    return data;
  }

  //获取购物车ID
  dynamic getShoppingID() async {
    String token = User.shared().token;
    String url = BASE_IP + '/cart/list';
    Dio dio = Dio();
    dio.options.headers = {'Authorization': 'Bearer ' + token};
    Response response = await dio.get(url = url);
    var data = response.data;
    // print(789);
    // print(data);
    var goodsID = [];
    var ID_list = data['data'];
    for(var i=0;i<ID_list.length;i++){
      goodsID.add(ID_list[i]['id']);
    }
    print(goodsID);

    return goodsID;
  }

  //生成订单并支付
  dynamic createShop() async {
    String token = User.shared().token;

    var goodsID = await getShoppingID();
    String url = BASE_IP + '/order/generateOrder';
    Dio dio = Dio();
    dio.options.headers = {'Authorization': 'Bearer ' + token};

    var map = {
      "payType": 3,
      'cartIds': goodsID,
    };
    Response response = await dio.post(url, data: map);
    var data = response.data;
    print(data);
    var orderID = data['data']['order']['id'];
    return orderID;
  }

//  根据orderID 去支付
  dynamic pay(int orderID) async {
    String token = User.shared().token;
    String url = BASE_IP + '/order/pay/${orderID}';
    Dio dio = Dio();
    dio.options.headers = {'Authorization': 'Bearer ' + token};
    var response = await dio.get(url);
    return response.data['data'];
  }

//  获取订单详情
  dynamic getOrder(int orderId) async {
    String token = User.shared().token;
    String url = BASE_IP + '/order/detail';
    Map<String, dynamic> map = {};
    map['orderId'] = orderId;
    Dio dio = Dio();
    dio.options.headers = {'Authorization': 'Bearer ' + token};
    Response response = await dio.get(url, queryParameters: map);
    var data = response.data;

    return data;
  }
}
