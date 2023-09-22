import { RequestModel } from "../models/request.model";

export async function createRequest(
  userId: string,
  paymentSuccessful: boolean,
) {
  return await RequestModel.create({ user: userId, paymentSuccessful });
}

export async function updateRequest(
  requestId: string,
  paymentSuccessful: boolean,
) {
  const request = await RequestModel.findOne({ _id: requestId });
  if (!request) return;
  const newRequest = await RequestModel.updateOne(
    { _id: requestId },
    { $set: { paymentSuccessful } },
    { new: true },
  );
  return newRequest;
}
