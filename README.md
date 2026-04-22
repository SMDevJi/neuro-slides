# 🧠 NeuroSlides – AI Powered Presentation Builder

NeuroSlides is an **AI-powered presentation generator** built with Next.js that allows users to create professional PowerPoint presentations quickly using AI.

Users can generate slides from prompts, edit content using AI before saving, generate images for slides, and export the final presentation as a **.ppt file**.

---
## ✨ Demo
- Demo of the project



---

## 🚀 Features

* **AI Slide Generation**
  Generate complete presentation slides from a simple prompt.

* **AI Image Generation**
  Create images for slides using ImageKit.

* **Prompt-based Content Editing**
  Modify slide content using AI prompts before saving.

* **Export to PowerPoint**
  Download presentations as **.ppt files**.

* **Credits System**
  Users consume credits for AI generation features.

* **Credits Purchase with Stripe**
  Users can securely purchase additional credits using Stripe.

* **Authentication System**
  Secure login and authentication using Auth.js.

* **Profile Management**
  User profile images stored using Cloudinary.

* **Modern UI Components**
  Built with Shadcn UI for reusable and accessible components.

* **Smooth Animations**
  Interactive UI animations powered by Framer Motion.

* **Database Storage**
  Presentation data stored in MongoDB.

* **Modern Full-stack Framework**
  Built with Next.js for fast performance and scalability.

---

## 🛠 Tech Stack

### Frontend

* Next.js
* React
* Tailwind CSS
* Shadcn UI
* Framer Motion

### Backend

* Next.js API Routes

### Database

* MongoDB

### Authentication

* Auth.js

### Payments

* Stripe

### Media & Image Generation

* ImageKit
* Cloudinary

### AI

* Google Gemini API for generating slides and updating content

---

## 📸 Workflow

1. User signs up or logs in
2. Enter a prompt describing the presentation
3. AI generates slide content
4. User can edit slides using prompts
5. Generate images for slides
6. Credits are deducted for AI usage
7. Users can purchase more credits using Stripe
8. Export and download the presentation as a **PowerPoint file**

---

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/SMDevJi/neuro-slides.git

# Navigate to project directory
cd neuro-slides

# Install dependencies
npm install

# Start development server
npm run dev
```

---

## ⚙️ Environment Variables

Create a `.env` file and add the following variables:

```
MONGODB_URI="mongodb+srv://..."

GOOGLE_CLIENT_ID="2355..."
GOOGLE_CLIENT_SECRET="GOC..."

EMAIL='example@gmail.com'
GMAIL_APP_PASSWORD='apuru...'

NEXTAUTH_SECRET='pptreallol12@'


CLOUDINARY_CLOUD_NAME=fdfd..
CLOUDINARY_API_KEY=78..
CLOUDINARY_API_SECRET=ZZgfh..

CLOUDINARY_UPLOAD_PRESET=ghd..

STRIPE_SECRET_KEY='sk_test_fghd..'
NEXT_PUBLIC_BASE_URL='http://...'
STRIPE_WEBHOOK_SECRET='whsec_...'

GEMINI_API_KEY='AI...'

GEMINI_MODEL='gemma-3-27b-it'

```



---

## 🤝 Contributing

Contributions are welcome!
Feel free to open an issue or submit a pull request.

---

## 📄 License

MIT License
