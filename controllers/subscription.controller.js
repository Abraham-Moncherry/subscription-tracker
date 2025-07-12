import { workflowClient } from "../config/upstash.js";
import { SERVER_URL } from "../config/env.js";
import Subscription from "../models/subscription.model.js";

export const createSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.create({
      ...req.body,
      user: req.user._id,
    });

    console.log(`Created subscription: ${subscription._id}`);

    try {
      // Trigger workflow with subscription ID
      const workflowResult = await workflowClient.trigger({
        url: `${SERVER_URL}/api/workflow/reminder`,
        body: {
          subscriptionId: subscription._id,
        },
      });

      console.log(`Workflow triggered successfully:`, workflowResult);

      res.status(201).json({
        success: true,
        data: subscription,
        workflowId: workflowResult.workflowRunId,
      });
    } catch (workflowError) {
      console.error("Workflow trigger failed:", workflowError);
      // Still return success for subscription creation
      res.status(201).json({
        success: true,
        data: subscription,
        workflowError: workflowError.message,
      });
    }
  } catch (e) {
    next(e);
  }
};

export const getUserSubscription = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id) {
      const error = new Error("You are not the owner of this account");
      error.status = 401;
      throw error;
    }

    const subscriptions = await Subscription.find({ user: req.params.id });

    res.status(200).json({ success: true, data: subscriptions });
  } catch (e) {
    next(e);
  }
};
