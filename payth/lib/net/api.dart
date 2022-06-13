import 'dart:convert';
import 'package:crypto/crypto.dart';
import 'package:dio/dio.dart';
import 'package:payth/models/user.dart';

var BASE_IP = 'http://attic.vip:8085';

class API {

  dynamic GetCode(String email) async {
    String url = BASE_IP + "/sso/getAuthCode";

    Dio dio = Dio();

    Map<String, dynamic> map = {};
    map['telephone'] = email;

    Response response = await dio.get(url, queryParameters: map);

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
    map['telephone'] = email;
    map['authCode'] = code;
    map['password'] = passwordMd5;
    map['username'] = email;

    ///post
    print('url:'+url);
    Response response = await dio.post(url, data: map);

    var data = response.data;
    print(data);

    return data;
  }

  dynamic Login(String email, String password) async {
    String url = BASE_IP + '/sso/login';
    Dio dio = Dio();
    String passwordMd5 = md5.convert(utf8.encode(password)).toString();
    Map<String, dynamic> map = {};
    map['username'] = email;
    map['password'] = passwordMd5;

    Response response = await dio.post(url, data: map);

    var data = response.data;


    return data;
  }

  //获取商品列表
  dynamic GetProduct() async {
    String token = User.shared().token;
    String url = BASE_IP + '/brand/recommendList?${token}';
    Dio dio = Dio();
    Response response = await dio.get(url);
    return response.data;
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
    Response response = await dio.post(url, data: map);
    var data = response.data;
    return data;
  }

  //获取购物车ID
  dynamic getShoppingID() async{
    String token = User.shared().token;
    String url = BASE_IP+'/cart/list?${token}';
    Dio dio = Dio();

    Response response = await dio.get(url);
    var data = response.data;

    return data['data']['id'];

  }

  //生成订单并支付
  dynamic createShop() async {
    var id = getShoppingID();
    String url = BASE_IP + '/cart/add';
    Dio dio = Dio();
    Map<String, dynamic> map = {};
    map['token'] = User.shared().token;
    map['payType'] = 3;
    map['cartIds'] = [id];
    Response response = await dio.post(url, data: map);
    var data = response.data;
    return data;
  }
}
