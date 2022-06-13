import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';


///自定义toast弹窗
class MyToast {
  ///info
  static info(String msg) {
    Fluttertoast.cancel();
    Fluttertoast.showToast(
      msg: msg,
      gravity: ToastGravity.BOTTOM,
      backgroundColor: Colors.white,
    );
  }

  ///notice
  static notice(String msg) {
    Fluttertoast.cancel();
    Fluttertoast.showToast(
        msg: msg,
        gravity: ToastGravity.TOP,
        backgroundColor: const Color.fromARGB(255, 177, 39, 34));
  }

  //show
  static show(String msg) {
    Fluttertoast.cancel();
    Fluttertoast.showToast(
        msg: msg,
        gravity: ToastGravity.CENTER,
        backgroundColor: Color.fromARGB(255, 93, 84, 84));
  }

  ///error
  static error(String msg) {
    Fluttertoast.cancel();
    Fluttertoast.showToast(
        msg: msg,
        gravity: ToastGravity.BOTTOM,
        backgroundColor: const Color.fromARGB(255, 177, 39, 34));
  }
}
