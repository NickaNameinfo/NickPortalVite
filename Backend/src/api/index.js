const express = require("express");
const { productFeedbackRouter } = require("./resources/feedback/productFeedback.router");
const { subscriptionRouter } = require("./resources/subcription/subcription.router");
const { adRouter } = require("./resources/ad/ad.router");
const authRouter = require("./resources/auth").authRouter;
const productRouter = require("./resources/product").productRouter;
const vendorRouter = require("./resources/vendor").vendorRouter;
const storerRouter = require("./resources/store").storeRouter;
const categoryRouter = require("./resources/category").categoryRouter;
const locationRouter = require("./resources/location").locationRouter;
const customerRouter = require("./resources/customer").customerRouter;
const orderRouter = require("./resources/order").orderRouter;
const paymentRouter = require("./resources/payment").paymentRouter;
const vendorStockRouter = require("./resources/vendorStock").vendorStockRouter;
const cartRouter = require("./resources/cart").cartRouter;
const requestStoreRouter =
  require("./resources/requestStores/index").requestStoreRouter;

const restRouter = express.Router();
restRouter.use("/auth", authRouter);
restRouter.use("/customer", customerRouter);
restRouter.use("/location", locationRouter);
restRouter.use("/product", productRouter);
restRouter.use("/vendor", vendorRouter);
restRouter.use("/store", storerRouter);
restRouter.use("/category", categoryRouter);
restRouter.use("/order", orderRouter);
restRouter.use("/payment", paymentRouter);
restRouter.use("/vendorStock", vendorStockRouter);
restRouter.use("/cart", cartRouter);
restRouter.use("/requestStore", requestStoreRouter);
restRouter.use("/productFeedbackRouter", productFeedbackRouter);
restRouter.use("/subscription", subscriptionRouter);
restRouter.use("/ads", adRouter);

module.exports = { restRouter };
