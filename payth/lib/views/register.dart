import 'package:flutter/material.dart';
import 'package:payth/state/user_login_register.dart';
import 'package:payth/views/login.dart';
import 'package:provider/provider.dart';
import 'package:payth/net/api.dart';
import 'dart:async';

class RegisterView extends StatelessWidget {
  const RegisterView({Key? key}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: Center(
      child: Container(
        width: 400,
        height: 550,
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
                child: Text('REGISTER',style: TextStyle(fontSize: 20),),
              ),
              SizedBox(
                height: 30,
              ),

              EmailInput(value),
              SizedBox(
                height: 20,
              ),
              SendCode(value),
              SizedBox(
                height: 30,
              ),
              PasswordInput(value),
              SizedBox(
                height: 20,
              ),
              ConfirmPasswordInput(value),
              SizedBox(
                height: 40,
              ),
              RegisterLoginButton(context,value),
            ],
          );
        }),
      ),
    ));
  }
}

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

//密码框
Widget PasswordInput(UserProvider value) {
  return Container(
    height: 60,
    width: 350,
    child: TextField(
      onChanged: (v) {
        value.setPassword(v);
      },
      obscureText: true,
      maxLines: 1,
      decoration: InputDecoration(
        icon: Icon(Icons.password_sharp),
        label: Text('Please input password'),
        border: OutlineInputBorder(
            borderRadius: BorderRadius.all(Radius.circular(30))),
      ),
    ),
  );
}

//确认密码框
Widget ConfirmPasswordInput(UserProvider value) {
  return Container(
    height: 60,
    width: 350,
    child: TextField(
      onChanged: (v) {
        value.setConfirmPassword(v);
      },
      obscureText: true,
      maxLines: 1,
      decoration: InputDecoration(
        icon: Icon(Icons.password_sharp),
        label: Text('Please input password again'),
        border: OutlineInputBorder(
            borderRadius: BorderRadius.all(Radius.circular(30))),
      ),
    ),
  );
}

//注册按钮
Widget RegisterLoginButton(context,UserProvider value) {
  return ElevatedButton(
      onPressed: () async {
        if(value.password==value.confirmPassword){
          var resp = await API().Register(value.email, value.code, value.password);
          if(resp['code']==200){
            Navigator.of(context)
                .push(MaterialPageRoute(builder: (context) => LoginView()));
          }
          else{
          //  弹窗提示错误
          }
        }else{
        //  弹窗提示两次密码不一样
        }


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


//验证码
Widget SendCode(UserProvider value) {
  return Row(
    mainAxisAlignment: MainAxisAlignment.center,
    children: [
      Container(
          width: 150,
          height: 50,
          child: TextField(
            onChanged: (v){
              value.setCode(v);
            },
              maxLines: 1,
              decoration: InputDecoration(
                label: Text('Input Code'),
                border: OutlineInputBorder(
                    borderRadius: BorderRadius.all(Radius.circular(30))),
              ))),
      Container(
        height: 40,
        alignment: Alignment.center,
        padding: EdgeInsets.only(left: 10),
        child: Container(
          height: 40,
          child: value.sendCodeButton?ElevatedButton(onPressed: () async{
            _showTimer(value);
            var resp = await API().GetCode(value.email);
            if(resp['code']==200){
            //  弹窗发送成功
              print(resp);
              value.setShowCode(resp['data']);
            }else{
            //  验证码发送失败
            }
          }, child: Text('Send Code')):Container(height:40,alignment:Alignment.center,child: Text('填入'+value.showCode,textAlign:TextAlign.center,)),
        ),
      )
    ],
  );
}


_showTimer(UserProvider value){
  Timer t;
  t = Timer.periodic(Duration(milliseconds: 1000), (timer) {
    value.DoSeconds();
    value.setCodeButtonF();
    if(value.seconds==0){
      timer.cancel();
      value.setCodeButtonT();
    }
  });

}


