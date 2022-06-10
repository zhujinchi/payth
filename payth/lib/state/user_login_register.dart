
import 'package:flutter/cupertino.dart';

class UserProvider with ChangeNotifier{
  String email='';
  String password = '';
  String confirmPassword = '';
  String code = '';
  bool passwordShow = false;


  changePasswordShow(){
    passwordShow = !passwordShow;
    notifyListeners();
  }

  setEmail(v){
    email = v;
    notifyListeners();
  }

  setPassword(v){
    password = v;
    notifyListeners();
  }

  setConfirmPassword(v){
    confirmPassword = v;
  }
  setCode(v){
    code = v;
  }
}