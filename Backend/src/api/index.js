const express = require("express");
const authRouter = require("./resources/auth").authRouter;
const productRouter = require("./resources/product").productRouter;
const vendorRouter = require("./resources/vendor").vendorRouter;
const categoryRouter = require("./resources/category").categoryRouter;
const locationRouter = require("./resources/location").locationRouter;
const customerRouter = require("./resources/customer").customerRouter;
const orderRouter = require("./resources/order").orderRouter;
const paymentRouter = require("./resources/payment").paymentRouter;

const restRouter = express.Router();
restRouter.use("/auth", authRouter);
restRouter.use("/customer", customerRouter);
restRouter.use("/location", locationRouter); 
restRouter.use("/product", productRouter);
restRouter.use("/vendor", vendorRouter);
restRouter.use("/category", categoryRouter);
restRouter.use("/order", orderRouter);
restRouter.use("/payment", paymentRouter);

module.exports = { restRouter };
 