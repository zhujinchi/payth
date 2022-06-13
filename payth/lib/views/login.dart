import 'package:flutter/material.dart';
import 'package:payth/state/user_login_register.dart';
import 'package:provider/provider.dart';
import 'package:payth/home.dart';
import 'register.dart';
import 'forget_password.dart';
import 'package:payth/net/api.dart';

class LoginView extends StatelessWidget {
  const LoginView({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: Center(
      child: Container(
        width: 400,
        height: 500,
        decoration: BoxDecoration(
          borderRadius: new BorderRadius.all(new Radius.circular(30.0)),
          border: Border.all(width: 0.5, color: Colors.black),
        ),
        child: Consumer<UserProvider>(builder: (context, value, child) {
          return Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                height: 40,
                child: Text(
                  'LOGIN',
                  style: TextStyle(fontSize: 20),
                ),
              ),
              SizedBox(
                height: 40,
              ),
              EmailInput(value),
              SizedBox(
                height: 30,
              ),
              PasswordInput(value),
              forgetPassword(context),
              SizedBox(
                height: 60,
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  RegisterButton(context),
                  SizedBox(
                    width: 20,
                  ),
                  LoginButton(context, value)
                ],
              )
            ],
          );
        }),
      ),
    ));
  }
}

//邮箱输入框
var EmailController = TextEditingController();

Widget EmailInput(UserProvider value) {
  return Container(
    height: 60,
    width: 350,
    child: TextField(
      onChanged: (v) {
        value.setEmail(v);
      },
      controller: EmailController,
      maxLines: 1,
      decoration: InputDecoration(
        suffixIcon: (value.email == '')
            ? null
            : IconButton(
                icon: Icon(Icons.clear),
                onPressed: () {
                  EmailController.text = '';
                  value.setEmail('');
                },
              ),
        icon: Icon(Icons.person),
        label: Text('Please input Email'),
        border: OutlineInputBorder(
            borderRadius: BorderRadius.all(Radius.circular(30))),
      ),
    ),
  );
}

//密码输入框
Widget PasswordInput(UserProvider value) {
  return Container(
    height: 60,
    width: 350,
    child: TextField(
      onChanged: (v) {
        value.setPassword(v);
      },
      obscureText: value.passwordShow,
      maxLines: 1,
      decoration: InputDecoration(
        suffixIcon: IconButton(
          icon: value.passwordShow
              ? Icon(Icons.remove_red_eye_outlined)
              : Icon(Icons.remove_red_eye_rounded),
          onPressed: () {
            value.changePasswordShow();
          },
        ),
        icon: Icon(Icons.password_sharp),
        label: Text('Please input password'),
        border: OutlineInputBorder(
            borderRadius: BorderRadius.all(Radius.circular(30))),
      ),
    ),
  );
}

//忘记密码
Widget forgetPassword(context) {
  return Container(
      child: Padding(
    padding: EdgeInsets.only(top: 5),
    child: Align(
      alignment: Alignment.centerRight,
      child: TextButton(
        onPressed: () {
          // Navigator.pop(context);
          Navigator.of(context).push(
              MaterialPageRoute(builder: (context) => ForgetPasswordView()));
        },
        child: Text("forget password?",
            style: TextStyle(fontSize: 14, color: Colors.grey)),
      ),
    ),
  ));
}

//注册按钮
Widget RegisterButton(context) {
  return ElevatedButton(
      onPressed: () {
        Navigator.of(context)
            .push(MaterialPageRoute(builder: (context) => RegisterView()));
      },
      child: Text(
        'Register',
        style: TextStyle(fontSize: 20, color: Colors.lightGreen),
      ),
      style: ButtonStyle(
        shape: MaterialStateProperty.all(
            RoundedRectangleBorder(borderRadius: BorderRadius.circular(20))),
        //边框
        side: MaterialStateProperty.all(
            BorderSide(color: Colors.lightBlue, width: 0.5)),
        backgroundColor:
            MaterialStateProperty.resolveWith((states) => Colors.white),
        minimumSize: MaterialStateProperty.all(Size(120, 50)),
      ));
}

//登录按钮
Widget LoginButton(context, UserProvider value) {
  return ElevatedButton(
      onPressed: () async {
        Navigator.of(context)
            .push(MaterialPageRoute(builder: (context) => HomeView()));
        // var resp = await API().Login(value.email, value.password);
        // if (resp['code'] == 200) {
        //
        // } else {
        //   //  弹框提示账号或密码错误
        // }
      },
      child: Text(
        'Login',
        style: TextStyle(fontSize: 20, color: Colors.lightGreen),
      ),
      style: ButtonStyle(
        shape: MaterialStateProperty.all(
            RoundedRectangleBorder(borderRadius: BorderRadius.circular(20))),
        //边框
        side: MaterialStateProperty.all(
            BorderSide(color: Colors.lightBlue, width: 0.5)),
        backgroundColor:
            MaterialStateProperty.resolveWith((states) => Colors.white),
        minimumSize: MaterialStateProperty.all(Size(120, 50)),
      ));
}
