
import 'package:flutter/cupertino.dart';

class UserProvider with ChangeNotifier{
  String email='';
  String password = '';
  String confirmPassword = '';
  String code = '';
  String showCode = '';
  bool passwordShow = true;
  bool sendCodeButton = true;
  int seconds = 60;


  setCodeButtonF(){
    sendCodeButton = false;
    notifyListeners();
  }

  setShowCode(v){
    showCode = v;
    notifyListeners();
  }
  setCodeButtonT(){
    sendCodeButton = true;
    notifyListeners();
  }
  DoSeconds(){
    seconds--;
  }


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