import 'package:flutter/foundation.dart';
import 'package:payth/models/product.dart';
import 'package:payth/net/api.dart';

class ShoppingCartProvider with ChangeNotifier {
  List<ProductModel> product = [];



  double totalprice = 0;
  List<String> paymathodList = ['stripe', 'paypal', 'alipay', 'wechatpay'];
  String currentPaymathod = 'stripe';
  String emailAddress = '';
  late double paymentPrice;


  initProduct() async {
    List resp = await API().GetProduct();
    print(resp);
    resp.forEach((element) {
      product.add(ProductModel(
          id: int.parse('0'),
          productID: element['productId'],
          skuID: element['id'],
          name: 'card',
          categoryName: element['spData'].toString(),
          remark: element['stock'].toString(),
          price: element['price'],
          imgUrl: element['pic'].toString(),
          quantity: int.parse('0')));
    });
    //


    for(int i = 0; i<product.length;i++){
      product[i].id = i;
    }
    notifyListeners();
  }

  addProduct(value) {
    product.add(value);
  }

  changeCurentPaymethod(v) {
    currentPaymathod = v;
    notifyListeners();
  }

  incrementQuantity(id) {

    product[id].quantity++;
    calculateTotalPrice();
  }

  decrementQuantity(id) {
    if (product[id].quantity > 0) {
      product[id].quantity--;
    }
    calculateTotalPrice();
  }

  calculateTotalPrice() {
    totalprice = 0;
    product.forEach((element) {
      totalprice += element.quantity * element.price;
    });
    notifyListeners();
  }

  clearProduct() {
    product.forEach((element) {
      element.quantity = 0;
    });
  }

  var orderId = 0;

  setOrderId(v) {
    orderId = v;
  }

  var judgeOrderTimeOut = 120;
}
