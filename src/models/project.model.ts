import mongoose, { Schema, model, Document } from "mongoose";

export type Outline = {
    slideNo: string,
    slidePoint: string
    outline: string
}

export type Slide = {
    code: string
}

export type DesignStyle = {
    styleName: string
    colors: {
        primary: string,
        secondary: string,
        accent: string,
        background: string,
        gradient: string
    },
    designGuide: string
    icon: string
    bannerImage: string

}


export interface IProject {
    _id: mongoose.Types.ObjectId;
    userInputPrompt: string;
    noOfSlides: string
    userId: mongoose.Types.ObjectId;
    outline?: Outline[]
    designStyle?: DesignStyle
    slides?: Slide[]
    // expiresAt: Date;
    // verified: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}




const outlineSchema = new Schema<Outline>({
    slideNo: {
        type: String,
        required: true
    },
    slidePoint: {
        type: String,
        required: true
    },
    outline: {
        type: String,
        required: true
    }
});


const slideSchema = new Schema<Slide>({
    code: {
        type: String,
        required: true
    }
});


const designStyleSchema = new Schema<DesignStyle>({
    styleName: {
        type: String,
        required: true
    },
    colors: {
        primary: {
            type: String,
            required: true
        },
        secondary: {
            type: String,
            required: true
        },
        accent: {
            type: String,
            required: true
        },
        background: {
            type: String,
            required: true
        },
        gradient: {
            type: String,
            required: true
        }
    },
    designGuide: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        required: true
    },
    bannerImage: {
        type: String,
        required: true
    }
});



const projectSchema = new Schema<IProject>(
    {
        userInputPrompt: {
            type: String,
            required: true
        },
        noOfSlides: {
            type: String,
            required: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        outline: {
            type: [outlineSchema],
            required: false
        },
        designStyle: {
            type: designStyleSchema,
            required: false
        },
        slides: {
            type:[slideSchema],
            required: false
        }
        // expiresAt: {
        //     type: Date,
        //     required: true
        // },
        // verified: {
        //     type: Boolean,
        //     default: false
        // }
    },
    { timestamps: true }
);

const projectModel = mongoose.models?.Project || model<IProject>("Project", projectSchema);

export default projectModel;