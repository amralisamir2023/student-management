function ErrorHandle(err, req, res, next) {
  console.log("somthing broken", err);

  res.status(500).json({ msg: "somthing broken ! , try again " });
}
module.exports = { ErrorHandle };