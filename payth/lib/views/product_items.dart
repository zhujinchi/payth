import 'package:flutter/material.dart';
import 'package:payth/models/product.dart';
import 'package:payth/state/shopping_cart.dart';
import 'package:provider/provider.dart';

class ProductItemView extends StatelessWidget {
  final ProductModel productModel;

  const ProductItemView({
    Key? key,
    required this.productModel,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(vertical: 16.0),
      height: 80,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(children: [
            Container(
              width: 60,
              decoration: BoxDecoration(
                  image: DecorationImage(
                image: NetworkImage(productModel.imgUrl),
                fit: BoxFit.cover,
              )),
            ),
            const SizedBox(width: 16.0),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(productModel.name,
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                    )),
                Text(productModel.categoryName,
                    style: const TextStyle(
                      color: Colors.orange,
                    )),
                Text(
                  productModel.remark,
                  style: const TextStyle(color: Colors.grey),
                ),
              ],
            )
          ]),
          Consumer<ShoppingCartProvider>(
              builder: (context, value, state) => Row(
                    children: [
                      IconButton(
                          onPressed: () {
                            value.decrementQuantity(productModel.id);
                          },
                          icon: const Icon(Icons.remove)),
                      Container(
                        decoration: BoxDecoration(
                            border: Border.all(
                          color: Colors.grey,
                          width: 1.0,
                        )),
                        padding: const EdgeInsets.symmetric(
                            vertical: 4.0, horizontal: 12.0),
                        child: Text(productModel.quantity.toString()),
                      ),
                      IconButton(
                          onPressed: () {
                            value.incrementQuantity(productModel.id);
                          },
                          icon: const Icon(Icons.add))
                    ],
                  )),
          Text('¥${productModel.price}',
              style: const TextStyle(
                fontWeight: FontWeight.bold,
              )),
          Text('¥${productModel.price * productModel.quantity}',
              style: const TextStyle(
                fontWeight: FontWeight.bold,
              ))
        ],
      ),
    );
  }
}
