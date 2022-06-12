import 'dart:convert';
import 'package:crypto/crypto.dart';
import 'package:dio/dio.dart';
import 'package:payth/models/user.dart';

var BASE_IP = 'http://127.0.0.1';

class API {
  samplePost() async {
    // sample post
    // String url = "http://1.14.103.90:5000/paypal_return";

    // ///build Dio
    // Dio dio = Dio();

    // dio.options.headers['Authorization'] = SystemInfo.shared().token;

    // ///build map
    // Map<String, dynamic> map = {};

    // map['deal_id'] = User.shared().deal_id;
    // map['amount_USD'] = amount;

    // ///post
    // Response response = await dio.post(url, queryParameters: map);
    // var data = response.data;
    // print(data);

    //sample get
    // String url = "http://1.14.103.90:5000/paypal_wallet";

    // ///build Dio
    // Dio dio = Dio();

    // dio.options.headers['Authorization'] = SystemInfo.shared().token;

    // ///get
    // Response response = await dio.get(url);

    // var data = response.data;

    // print(data);
  }

  dynamic GetCode(String email) async {
    String url = BASE_IP + "/sso/getAuthCode";

    Dio dio = Dio();

    Map<String, dynamic> map = {};
    map['email'] = email;

    Response response = await dio.post(url, queryParameters: map);

    var data = response.data;
    print(data);

    return data;
  }

  dynamic Register(String email, String code, String password) async {
    String url = BASE_IP + "/sso/register";

    ///build Dio
    Dio dio = Dio();

    ///md5
    String passwordMd5 = md5.convert(utf8.encode(password)).toString();

    ///build map
    Map<String, dynamic> map = {};
    map['email'] = email;
    map['code'] = code;
    map['password'] = passwordMd5;

    ///post
    Response response = await dio.post(url, queryParameters: map);

    var data = response.data;
    print(data);

    return data;
  }

  dynamic Login(String email, String password) async {
    String url = BASE_IP + '/sso/login';
    Dio dio = Dio();
    String passwordMd5 = md5.convert(utf8.encode(password)).toString();
    Map<String, dynamic> map = {};
    map['email'] = email;
    map['password'] = passwordMd5;

    Response response = await dio.post(url, queryParameters: map);

    var data = response.data;


    return data;
  }

  //获取商品列表
  dynamic GetProduct() async {
    String token = User.shared().token;
    String url = BASE_IP + '/brand/recommendList?${token}';
    Dio dio = Dio();
    Response response = await dio.get(url);
    return response.data['data'];
  }

  //根据商品ID 获取商品sku
  dynamic GetSku(int id) async {
    String token = User.shared().token;
    String url = BASE_IP + '/product/detail/${id}?${token}';
    Dio dio = Dio();
    Response response = await dio.get(url);
    Map<String, dynamic> map = {};
    map['skuCode'] = response.data['data']['skuStockList']['skuCode'];
    map ['skuID'] = response.data['data']['skuStockList']['id'];
    return map;
  }


  //添加商品到购物车
  dynamic AddProduct(int id, int quantity) async {
    String url = BASE_IP + '/cart/add';
    var skuInfo = await GetSku(id);
    Dio dio = Dio();
    Map<String, dynamic> map = {};
    map['token'] = User.shared().token;
    map['id'] = id;
    map['productSkuId'] = skuInfo['skuID'];
    map['skuCode'] = skuInfo['skuCode'];
    map['quantity'] = quantity;
    Response response = await dio.post(url, queryParameters: map);
    var data = response.data;
    return data;
  }

  //生成订单并支付
  dynamic createShop(int id) async {
    String url = BASE_IP + '/cart/add';
    Dio dio = Dio();
    Map<String, dynamic> map = {};
    map['token'] = User.shared().token;
    map['payType'] = 3;
    map['cartIds'] = id;
    Response response = await dio.post(url, queryParameters: map);
    var data = response.data;
    return data;
  }
}
