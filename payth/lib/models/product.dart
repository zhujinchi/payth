// ignore_for_file: public_member_api_docs, sort_constructors_first
import 'dart:convert';

class ProductModel {
  int id;
  int productID;
  int skuID;
  String name;
  String categoryName;
  String imgUrl;
  String remark;
  double price;
  int quantity;
  ProductModel({
    required this.id,
    required this.productID,
    required this.skuID,
    required this.name,
    required this.categoryName,
    required this.imgUrl,
    required this.remark,
    required this.price,
    required this.quantity,
  });

  ProductModel copyWith({
    int? id,
    int? productID,
    int? skuID,
    String? name,
    String? categoryName,
    String? imgUrl,
    String? remark,
    double? price,
    int? quantity,
  }) {
    return ProductModel(
      id: id ?? this.id,
      productID: productID ?? this.productID,
      skuID: skuID ?? this.skuID,
      name: name ?? this.name,
      categoryName: categoryName ?? this.categoryName,
      imgUrl: imgUrl ?? this.imgUrl,
      remark: remark ?? this.remark,
      price: price ?? this.price,
      quantity: quantity ?? this.quantity,
    );
  }

  Map<String, dynamic> toMap() {
    return <String, dynamic>{
      'id': id,
      'productID':productID,
      'skuID':skuID,
      'name': name,
      'categoryName': categoryName,
      'imgUrl': imgUrl,
      'remark': remark,
      'price': price,
      'quantity': quantity,
    };
  }

  factory ProductModel.fromMap(Map<String, dynamic> map) {
    return ProductModel(
      id: map['id'] as int,
      productID: map['productID'] as int,
      skuID: map['skuID'] as int,
      name: map['name'] as String,
      categoryName: map['categoryName'] as String,
      imgUrl: map['imgUrl'] as String,
      remark: map['remark'] as String,
      price: map['price'] as double,
      quantity: map['quantity'] as int,
    );
  }

  String toJson() => json.encode(toMap());

  factory ProductModel.fromJson(String source) =>
      ProductModel.fromMap(json.decode(source) as Map<String, dynamic>);

  @override
  String toString() {
    return 'ProductModel(id: $id, productID:$productID,skuID:$skuID,name: $name, categoryName: $categoryName, imgUrl: $imgUrl, remark: $remark, price: $price, quantity: $quantity)';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;

    return other is ProductModel &&
        other.id == id &&
        other.productID == productID &&
        other.skuID == skuID &&
        other.name == name &&
        other.categoryName == categoryName &&
        other.imgUrl == imgUrl &&
        other.remark == remark &&
        other.price == price &&
        other.quantity == quantity;
  }

  @override
  int get hashCode {
    return id.hashCode ^
    productID.hashCode ^
    skuID.hashCode ^
        name.hashCode ^
        categoryName.hashCode ^
        imgUrl.hashCode ^
        remark.hashCode ^
        price.hashCode ^
        quantity.hashCode;
  }
}
