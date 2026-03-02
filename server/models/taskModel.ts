import mongoose, { Document, Model, Schema } from "mongoose";

export interface ITask extends Document {
    title: string;
    description?: string;
    status: "todo" | "in-progress" | "completed";
    user: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const taskSchema: Schema<ITask> = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    status: {
        type: String,
        enum: ["todo", "in-progress", "completed"],
        default: "todo",
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
}, {
    timestamps: true,
});

// Index title for search optimization
taskSchema.index({ title: 'text' });

const taskModel: Model<ITask> = mongoose.models.task || mongoose.model<ITask>('task', taskSchema);
export default taskModel;

