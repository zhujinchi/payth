class User {
  User._privateConstructor();

  static final User _instance = User._privateConstructor();

  static User shared() {
    return _instance;
  }

  //user info
  String email='';
  String token = '';


}
