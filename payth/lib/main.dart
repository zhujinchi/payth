import 'package:flutter/material.dart';
import 'package:payth/state/shopping_cart.dart';
import 'package:provider/provider.dart';
import 'state/user_login_register.dart';
import 'views/login.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider<ShoppingCartProvider>(create: (_)=>ShoppingCartProvider(),),
        ChangeNotifierProvider<UserProvider>(create: (_)=>UserProvider(),),

      ],
      //可以了 谢谢
      child: MaterialApp(
        title: 'Flutter Demo',
        theme: ThemeData(
          primarySwatch: Colors.blue,
        ),
        home:  LoginView(),
      ),
    );
  }
}
