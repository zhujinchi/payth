import 'package:flutter/material.dart';
import 'package:payth/state/shopping_cart.dart';
import 'package:provider/provider.dart';
import 'package:payth/net/api.dart';
import 'dart:async';
import 'dart:js' as js;

class RightView extends StatelessWidget {
  const RightView({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    var headingTextStyle = const TextStyle(
      fontWeight: FontWeight.bold,
      fontSize: 18.0,
    );
    return Consumer<ShoppingCartProvider>(
      builder: (context, value, state) =>
          Container(
            width: 400,
            padding: const EdgeInsets.all(32.0),
            color: Colors.grey.shade200,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 16.0),
                Text("Order Summary", style: headingTextStyle),
                Container(
                  margin: const EdgeInsets.symmetric(vertical: 16.0),
                  height: 1.0,
                  color: Colors.grey,
                ),
                Row(mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'TOTAL ITEMS',
                        style: TextStyle(
                            fontWeight: FontWeight.bold, fontSize: 14.0),
                      ),
                      Text(
                        '¥${value.totalprice}',
                        style: const TextStyle(
                            fontWeight: FontWeight.bold, fontSize: 14.0),
                      )
                    ]),
                const SizedBox(height: 32.0),
                const Text(
                  'SHIPPING',
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14.0),
                ),
                Container(
                    width: double.infinity,
                    color: Colors.white,
                    margin: const EdgeInsets.symmetric(vertical: 16.0),
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 8.0),
                      child: DropdownButtonHideUnderline(
                        child: DropdownButton(
                          icon: const Icon(Icons.keyboard_arrow_down),
                          value: value.currentPaymathod,
                          items: [
                            for (String paymathod in value.paymathodList)
                              DropdownMenuItem(
                                child: Text("Pay your fee with - " + paymathod),
                                value: paymathod,
                              )
                          ],
                          onChanged: (Object? v) {
                            value.changeCurentPaymethod(v);
                          },
                        ),
                      ),
                    )),
                const SizedBox(height: 32.0),
                const Text(
                  'EMAIL ADDRESS',
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14.0),
                ),
                Padding(
                  padding: const EdgeInsets.symmetric(vertical: 16.0),
                  child: TextField(
                    decoration: const InputDecoration(
                        filled: true,
                        fillColor: Colors.white,
                        hintText: "Enter your email to recieve card info",
                        hintStyle: TextStyle(color: Colors.grey),
                        border: InputBorder.none),
                    onChanged: (email) {
                      value.emailAddress = email;
                    },
                  ),
                ),
                Container(
                  child: const Text(
                    "Make sure you fill in the correct email address, otherwise you will not receive your shipment.",
                    style: TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 12.0,
                    ),
                  ),
                  color: Colors.redAccent,
                  padding:
                  const EdgeInsets.symmetric(horizontal: 12.0, vertical: 12.0),
                ),
                const Spacer(),
                Row(mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'TOTAL COST',
                        style: TextStyle(
                            fontWeight: FontWeight.bold, fontSize: 14.0),
                      ),
                      Text(
                        "¥" + value.totalprice.toString(),
                        style: const TextStyle(
                            fontWeight: FontWeight.bold, fontSize: 14.0),
                      )
                    ]),
                const SizedBox(height: 24.0),
                MaterialButton(
                  minWidth: double.infinity,
                  onPressed: () {
                    js.context.callMethod('open', ['http://www.baidu.com']);
                    // dealShopping(value);
                    judgeOrder(value);
                  },
                  child: const Text(
                    "CONFIRM AND PAY",
                    style: TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 12.0,
                    ),
                  ),
                  color: Colors.blueAccent,
                  padding:
                  const EdgeInsets.symmetric(horizontal: 18.0, vertical: 18.0),
                ),
              ],
            ),
          ),
    );
  }
}


  //测试  res的参数id待定
  dealShopping(ShoppingCartProvider value) async{
    value.product.forEach((element)async {
      var resp = await API().AddProduct(element.id, element.quantity);
    });
    var res = await API().createShop();
    value.setOrderId(res.id);
  }

  judgeOrder(ShoppingCartProvider value){
    Timer t;
    t = Timer.periodic(Duration(milliseconds: 3000), (timer) async{
      value.judgeOrderTimeOut--;
      var resp = API().getOrder(value.orderId);
      if(resp.info=='xxx'){
      //  弹窗购买成功
        value.clearProduct();
        timer.cancel();
      }
      if(resp.info=='xxx'){
        //弹窗取消购买
        timer.cancel();
      }
      if(value.judgeOrderTimeOut==0){
        // 弹窗购买超时
        timer.cancel();
      }
    });
}
