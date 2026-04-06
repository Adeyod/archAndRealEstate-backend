import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { generatePaymentReference } from '../../../common/utils/helper';
import { ProjectType } from '../../../modules/projects/schemas/project.schema';
import {
  Payment,
  PaymentDocument,
  PaymentProvider,
  PaymentStatus,
} from '../schemas/payment.schema';

type PaymentHandlerInput = {
  reference: string;
  amount: number;
  userId: Types.ObjectId;
};

type PaymentHandler = (data: PaymentHandlerInput) => Promise<any>;

@Injectable()
export class PaymentsRepository {
  constructor(
    @InjectModel(Payment.name)
    private paymentModel: Model<PaymentDocument>,
  ) {}

  async createPaymentIntent(
    userId: Types.ObjectId,
    provider: PaymentProvider,
    projectType: ProjectType,
    amountToPay: number,
  ) {
    console.log('amountToPay:', amountToPay);

    const payload = {
      projectType,
      userId,
    };
    const reference = generatePaymentReference(payload);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    const newPayment = await new this.paymentModel({
      userId,
      projectType,
      amount: amountToPay,
      reference,
      provider,
      expiresAt,
    }).save();

    return newPayment;
  }

  async getPaymentByRefAndUserId(
    reference: string,
    userId: Types.ObjectId,
  ): Promise<PaymentDocument | null> {
    const payment = await this.paymentModel.findOne({
      providerReference: reference,
      userId,
    });

    return payment;
  }

  async updatePaymentStatusUsingPaymentId(
    paymentId: Types.ObjectId,
    status: PaymentStatus,
  ): Promise<PaymentDocument | null> {
    const paidAt = new Date(Date.now());
    console.log('paidAt:', paidAt);
    const payment = await this.paymentModel.findByIdAndUpdate(paymentId, {
      status,
      paidAt,
    });

    return payment;
  }

  async existingPendingPaymentUsingUserIdAndPlan(
    userId: Types.ObjectId,
    projectType: ProjectType,
    status: PaymentStatus,
  ): Promise<PaymentDocument | null> {
    const existing = await this.paymentModel.findOne({
      userId,
      projectType,
      status,
      expiresAt: { $gt: new Date() },
    });

    return existing;
  }

  async updateIntentWithAuthUrl(
    id: Types.ObjectId,
    authorizationUrl: string,
    providerReference: string,
  ): Promise<PaymentDocument | null> {
    const update = await this.paymentModel.findByIdAndUpdate(
      id,
      {
        authorizationUrl: authorizationUrl,
        providerReference: providerReference,
      },
      { new: true },
    );

    return update;
  }

  async setPendingPaymentToExpired(
    id: Types.ObjectId,
  ): Promise<PaymentDocument | null> {
    const updateStatus = await this.paymentModel.findByIdAndUpdate(
      id,
      { status: PaymentStatus.EXPIRED },
      { new: true },
    );

    return updateStatus;
  }

  async findSuccessfulPaymentPlan(
    id: Types.ObjectId,
    projectType: ProjectType,
  ): Promise<PaymentDocument | null> {
    const intent = await this.paymentModel.findOne({
      _id: id,
      projectType: projectType,
      status: PaymentStatus.SUCCESSFUL,
    });

    return intent;
  }
}
