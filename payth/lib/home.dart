import 'package:flutter/material.dart';
import 'package:payth/views/left.dart';
import 'package:payth/views/product_items.dart';
import 'package:payth/views/right.dart';
import 'package:responsive_builder/responsive_builder.dart';

class HomeView extends StatefulWidget {
  @override
  _HomeViewState createState() => _HomeViewState();
}

class _HomeViewState extends State<HomeView> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(body: ResponsiveBuilder(
      builder: (context, sizingInformation) {
        // Check the sizing information here and return your UI
        if (sizingInformation.deviceScreenType == DeviceScreenType.desktop) {
          return Row(
            children: [
              const Expanded(child: LeftView()),
              Container(width: 400, child: const RightView())
            ],
          );
        } else {
          return Container(
            height: double.infinity,
            width: double.infinity,
            child: ListView(
              children: [
                Container(
                  height: 600,
                  child: Column(
                    children: const [
                      Expanded(
                        child: LeftView(),
                      )
                    ],
                  ),
                ),
                Container(
                  height: 600,
                  child: const RightView(),
                )
              ],
            ),
          );
        }
      },
    )

        // body: Row(
        //   children: [Expanded(child: LeftView()), RightView()],
        // ),
        );
  }
}
