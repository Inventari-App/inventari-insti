const Center = require("../models/center")

module.exports.index = async (req, res) => {
  res.render("centre")
};

module.exports.verify = async (req, res) => {
  const { email } = req.query
  const center = await Center.findOne({ email })

  if (center && center.email) {
    res.json({ success: true, data: center })
  } else {
    res.json({ success: false })
  }
};
