const { capitalize } = require("../utils/helpers");

module.exports.renderNewForm = path => 
  (req, res, next) => {
    try {
      const { tab } = req.query;
      res.render(path, { autoclose: tab });
    } catch (err) {
      next(err);
    }
  };

module.exports.createItem = (Model, modelName, errorHandler) =>
  async (req, res, next) => {
    try {
      const data = req.body
      const model = new Model(data);
      model.responsable = req.user._id;
      await model.save();

      req.flash("success", `${capitalize(modelName)} creat correctament!`);

      if (data.autoclose) {
        res.redirect("/autoclose");
      } else {
        res.redirect(`/${modelName}s/${model._id}`);
      }
    } catch (err) {
      if (errorHandler) {
        errorHandler(req, res, err)
      } else {
        next(err);
      }
    }
  };
