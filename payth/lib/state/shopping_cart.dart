import 'package:flutter/foundation.dart';
import 'package:payth/models/product.dart';

class ShoppingCartProvider with ChangeNotifier {
  List<ProductModel> product = [
    ProductModel(
        id: 0,
        name: 'card 1',
        categoryName: 'steam',
        remark: '备注',
        imgUrl:
            "https://img.alicdn.com/bao/uploaded/i1/2322816853/O1CN01qro9Zj20UisDcfG4x_!!2322816853.png_240x240.jpg",
        price: 12.5,
        quantity: 0),
    ProductModel(
        id: 1,
        name: 'card 2',
        categoryName: 'steam',
        remark: '备注2',
        imgUrl:
            "https://img.alicdn.com/bao/uploaded/i1/2322816853/O1CN01qro9Zj20UisDcfG4x_!!2322816853.png_240x240.jpg",
        price: 12.5,
        quantity: 0),
    ProductModel(
        id: 2,
        name: 'card 3',
        categoryName: 'steam',
        remark: '备注3',
        imgUrl:
            "https://img.alicdn.com/bao/uploaded/i1/2322816853/O1CN01qro9Zj20UisDcfG4x_!!2322816853.png_240x240.jpg",
        price: 60,
        quantity: 0),
  ];
  double totalprice = 0;
  List<String> paymathodList = ['stripe', 'paypal', 'alipay', 'wechatpay'];
  String currentPaymathod = 'stripe';
  String emailAddress = '';
  late double paymentPrice;

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
}
