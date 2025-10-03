import mongoose from 'mongoose';

const taskSchema = mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    projectId: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true, 
        ref: 'Project' 
    },
    status: { 
        type: String, 
        required: true, 
        enum: ['To Do', 'In Progress', 'Done'], 
        default: 'To Do' 
    },
    description: { 
        type: String 
    },
    assigneeId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }
}, { 
    timestamps: true 
});

const Task = mongoose.model('Task', taskSchema);

export default Task;