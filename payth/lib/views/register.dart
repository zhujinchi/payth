import 'package:flutter/material.dart';
import 'package:payth/state/user_login_register.dart';
import 'package:provider/provider.dart';
import 'package:payth/home.dart';

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
              RegisterLoginButton(context),
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

Widget ConfirmPasswordInput(UserProvider value) {
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
        label: Text('Please input password again'),
        border: OutlineInputBorder(
            borderRadius: BorderRadius.all(Radius.circular(30))),
      ),
    ),
  );
}

Widget RegisterLoginButton(context) {
  return ElevatedButton(
      onPressed: () {
        Navigator.of(context)
            .push(MaterialPageRoute(builder: (context) => HomeView()));
      },
      child: Text(
        'Register&Login',
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
        padding: EdgeInsets.only(left: 10),
        child: ElevatedButton(onPressed: () {}, child: Text('Send Code')),
      )
    ],
  );
}
