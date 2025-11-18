import mongoose, { Schema } from 'mongoose';
import { IBudget } from './budget.interface';

export interface IBudgetDocument extends Omit<IBudget, '_id' | 'id'>, mongoose.Document {
  _id: mongoose.Types.ObjectId;
}

const budgetSchema = new Schema<IBudgetDocument>(
  {
    amount: {
      type: Number,
      required: [true, 'Budget amount is required'],
      min: [0, 'Budget amount must be positive'],
    },
    month: {
      type: Number,
      required: [true, 'Month is required'],
      min: [1, 'Month must be between 1 and 12'],
      max: [12, 'Month must be between 1 and 12'],
    },
    year: {
      type: Number,
      required: [true, 'Year is required'],
      min: [2000, 'Year must be between 2000 and 2100'],
      max: [2100, 'Year must be between 2000 and 2100'],
    },
    createdBy: {
      type: Schema.Types.ObjectId as any,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret: any) => {
        ret.id = ret._id?.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

budgetSchema.index({ createdBy: 1, year: 1, month: 1 }, { unique: true });

export const Budget = mongoose.model<IBudgetDocument>('Budget', budgetSchema);


