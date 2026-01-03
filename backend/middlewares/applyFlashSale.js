const FlashSale = require("../models/FlashSale");

module.exports = async function flashSale(req, res, next) {
  const sale = await FlashSale.findOne().sort({ createdAt: -1 });

  req.flashSale =
    sale && sale.active && sale.percentage > 0
      ? { percentage: sale.percentage, active: true }
      : { active: false };

  next();
};
