function omitHash(user) {
  console.log(user, "user12341234");
  const { hash, ...userWithoutHash } = user;
  return userWithoutHash;
}
