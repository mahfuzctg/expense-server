import mongoose, { Schema } from 'mongoose';
import { ExpenseCategory } from './expense.constant';
import { IExpense } from './expense.interface';

export interface IExpenseDocument extends Omit<IExpense, '_id'>, mongoose.Document {
  _id: mongoose.Types.ObjectId;
}

const expenseSchema = new Schema<IExpenseDocument>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title must be less than 100 characters'],
    },
    category: {
      type: String,
      enum: {
        values: Object.values(ExpenseCategory),
        message: 'Invalid category',
      },
      required: [true, 'Category is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.01, 'Amount must be at least 0.01'],
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },
    createdBy: {
      type: Schema.Types.ObjectId as any,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
  },
{
    timestamps: true,
    toJSON: {
      transform: (_, ret) => {
        const r: any = ret; 
        r.id = r._id.toString();
        delete r._id;
        delete r.__v;
        return r;
      },
    },
  }
);

expenseSchema.index({ date: -1 });
expenseSchema.index({ category: 1 });
expenseSchema.index({ createdBy: 1 });
expenseSchema.index({ createdBy: 1, date: -1 });
expenseSchema.index({ createdBy: 1, category: 1 });
expenseSchema.index({ createdBy: 1, date: -1, category: 1 });

export const Expense = mongoose.model<IExpenseDocument>('Expense', expenseSchema);
