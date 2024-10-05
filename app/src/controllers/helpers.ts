import { Request, Response, NextFunction } from "express";
import { capitalize } from "../utils/helpers";
import { Model } from "mongoose";

export type ErrorHandler = (req: Request, res: Response, next: NextFunction) => void

export const renderNewForm =
  (path: string) => (req: Request, res: Response, next: NextFunction) => {
    try {
      const { tab } = req.query;
      res.render(path, { autoclose: tab });
    } catch (err) {
      next(err);
    }
  };

export const createItem =
  (
    Model: Model<any>,
    modelName: string,
    errorHandler?: ErrorHandler,
  ) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const model = new Model(data);
      model.responsable = req.user?._id;
      await model.save();

      req.flash("success", `${capitalize(modelName)} creat/da correctament!`);

      if (data.autoclose) {
        res.redirect("/autoclose");
      } else {
        res.redirect(`/${modelName}s/${model._id}`);
      }
    } catch (err) {
      if (err instanceof Error && "code" in err && (err as any).code == 11000) {
        req.flash("error", `Un/a ${modelName} amb el mateix nom ja existeix.`);
        return res.redirect(
          `/${modelName}s/new${req.query.tab ? "?tab=true" : ""}`,
        );
      }

      if (errorHandler) {
        errorHandler(req, res, next);
      } else {
        next(err);
      }
    }
  };
