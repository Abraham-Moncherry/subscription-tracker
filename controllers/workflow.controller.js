import dayjs from "dayjs";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { serve } = require("@upstash/workflow/express");
import Subscription from "../models/subscription.model.js";

const REMINDER = [7, 5, 2, 1];

export const sendReminder = serve(async (context) => {
  const { subscriptionId } = context.requestPayload;
  console.log(`Starting workflow for subscription: ${subscriptionId}`);

  const subscription = await fetchSubscription(context, subscriptionId);

  if (!subscription || subscription.status !== "active") {
    console.log(`Subscription ${subscriptionId} not found or not active`);
    return;
  }

  // Calculate renewal date if it's null
  let renewalDate;
  if (subscription.renewalDate) {
    renewalDate = dayjs(subscription.renewalDate);
  } else {
    // Calculate renewal date as 30 days from start date (adjust as needed)
    renewalDate = dayjs(subscription.startDate).add(30, "day");
    console.log(`Calculated renewal date: ${renewalDate.format()}`);
  }

  if (renewalDate.isBefore(dayjs())) {
    console.log(
      `Renewal date has passed for subscription ${subscriptionId}. Stopping workflow`
    );
    return;
  }

  console.log(`Renewal date: ${renewalDate.format()}, setting up reminders`);

  for (const daysBefore of REMINDER) {
    const reminderDate = renewalDate.subtract(daysBefore, "day");

    if (reminderDate.isAfter(dayjs())) {
      await sleepUntilReminder(
        context,
        `Reminder ${daysBefore} days before`,
        reminderDate
      );
    }

    await triggerReminder(context, `Reminder ${daysBefore} days before`);
  }
});

const fetchSubscription = async (context, subscriptionId) => {
  return await context.run("get subscription", async () => {
    return Subscription.findById(subscriptionId).populate("user", "name email");
  });
};

const sleepUntilReminder = async (context, label, date) => {
  console.log(`Sleeping until ${label} reminder at ${date}`);
  await context.sleepUntil(label, date.toDate());
};

const triggerReminder = async (context, label) => {
  return await context.run(label, () => {
    console.log(`Trigger ${label} reminder`);
  });
};
