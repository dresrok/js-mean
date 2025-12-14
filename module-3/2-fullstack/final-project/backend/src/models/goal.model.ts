import { Schema, model, Document } from 'mongoose';

export interface IGoal extends Document {
  text: string;
  // TODO: Agregar más campos (fechaCumplimiento, estado, etc.)
}

const goalSchema = new Schema<IGoal>(
  {
    // TODO: Definir esquema completo
  },
  {
    timestamps: true,
  }
);

export const Goal = model<IGoal>('Goal', goalSchema);
