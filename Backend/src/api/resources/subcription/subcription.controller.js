const db = require("../../../models");

module.exports = {
  // Get all subscriptions
  async getAllSubscriptions(req, res, next) {
    try {
      const subscriptions = await db.Subscription.findAll({
        order: [["createdAt", "DESC"]],
      });
      res.status(200).json({ success: true, data: subscriptions });
    } catch (error) {
      next(error);
    }
  },

  // Get subscription by ID
  async getSubscriptionById(req, res, next) {
    try {
      const { id } = req.params;
      const subscription = await db.Subscription.findAll({
        where: { customerId: id },
      });
      if (!subscription) {
        return res.status(404).json({ success: false, message: "Subscription not found" });
      }
      res.status(200).json({ success: true, data: subscription });
    } catch (error) {
      next(error);
    }
  },

  // Add new subscription
  async addSubscription(req, res, next) {
    try {
      const { subscriptionType, subscriptionPlan, subscriptionPrice, customerId, status, subscriptionCount } = req.body;
      const subscription = await db.Subscription.create({
        subscriptionType,
        subscriptionPlan,
        subscriptionPrice,
        customerId,
        status,
        subscriptionCount,
      });
      res.status(200).json({ success: true, data: subscription });
    } catch (error) {
      next(error);
    }
  },

  // Update subscription
  async updateSubscription(req, res, next) {
    try {
      const { id, subscriptionType, subscriptionPlan, subscriptionPrice, status, subscriptionCount } = req.body;
      const subscription = await db.Subscription.findOne({ where: { id: id } });
      if (!subscription) {
        return res.status(404).json({ success: false, message: "Subscription not found" });
      }
      await subscription.update({
        subscriptionType,
        subscriptionPlan,
        subscriptionPrice,
        status,
        subscriptionCount,
      });
      res.status(200).json({ success: true, message: "Subscription updated successfully" });
    } catch (error) {
      next(error);
    }
  },

  // Delete subscription
  async deleteSubscription(req, res, next) {
    try {
      const { id } = req.params;
      const subscription = await db.Subscription.findOne({ where: { id: id } });
      if (!subscription) {
        return res.status(404).json({ success: false, message: "Subscription not found" });
      }
      await subscription.destroy();
      res.status(200).json({ success: true, message: "Subscription deleted successfully" });
    } catch (error) {
      next(error);
    }
  },
};
