import userModel from "../../models/userModel.js";
import { internalServerResponse } from "../../responses/serverErrorResponses.js";
import { response200 } from "../../responses/successResponses.js";
import createTransaction from "./createTransaction.js";

function extractCoins(identifier) {
  const regex = /_(\d+)_coins/;
  const match = regex.exec(identifier);
  if (match !== null) {
    return parseFloat(match[1]);
  }
  return null;
}

export default async function confirmApplePayPayment(req, res) {
  try {
    console.log({ request: JSON.stringify(req.body.event) });
    const eventType = req?.body?.event?.type;
    const productId = req?.body?.event?.product_id;
    const productType =
      productId?.split("_")?.[2] === "coins"
        ? "topup"
        : productId?.split("_")?.[2] === "elite"
        ? "subscription"
        : null;
    const userId = req?.body?.event?.app_user_id;
    const cost = req?.body?.event?.price_in_purchased_currency;

    if (eventType === "NON_RENEWING_PURCHASE") {
      const object = {
        type: productType,
        cost: cost,
        credits: extractCoins(productId),
      };

      if (productType === "topup") {
        console.log({ object });
        const user = await userModel.findOne({
          _id: userId,
          deleted: false,
        });
        console.log({ user });
        console.log({
          sum: parseFloat(user?.credits) + parseFloat(object?.credits),
        });
        const updateUserResult = await userModel.findOneAndUpdate(
          { _id: user?._id },
          { credits: parseFloat(user?.credits) + parseFloat(object?.credits) },
          { new: true }
        );
      }

      if (productType === "subscription") {
        await userModel.findOneAndUpdate(
          { _id: userId },
          { elite: true, subscriptionDate: new Date() },
          { new: true }
        );
      }

      const createTransactionResult = await createTransaction({
        userId: userId,
        type: productType,
        object: object,
      });
      console.log({ createTransactionResult });
    }

    response200(res, {});
  } catch (err) {
    console.log(err);
    internalServerResponse(res);
  }
}

/**
 * 
 * 
 * {
  req: {
    event: {
      event_timestamp_ms: 1721225136032,
      product_id: 'practe_4999_elite',
      period_type: 'NORMAL',
      purchased_at_ms: 1721225121000,
      expiration_at_ms: null,
      environment: 'SANDBOX',
      entitlement_id: null,
      entitlement_ids: null,
      presented_offering_id: null,
      transaction_id: '2000000659414222',
      original_transaction_id: '2000000659414222',
      is_family_share: false,
      country_code: 'IN',
      app_user_id: '665dc6d60e046b69d3ca100a',
      aliases: [Array],
      original_app_user_id: '665dc6d60e046b69d3ca100a',
      currency: 'INR',
      price: 59.835,
      price_in_purchased_currency: 4999,
      subscriber_attributes: [Object],
      store: 'APP_STORE',
      takehome_percentage: 0.7,
      offer_code: null,
      tax_percentage: 0.1725,
      commission_percentage: 0.2482,
      renewal_number: null,
      type: 'NON_RENEWING_PURCHASE',
      id: 'C864D1C8-5ABF-475E-848B-EC20FF3636C5',
      app_id: 'app12ebb7b81b'
    },
    api_version: '1.0'
  }
}
 */
