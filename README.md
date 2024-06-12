
# Clientify

Clientify is a powerful and intuitive mini Customer Relationship Management (CRM) portal designed to help businesses efficiently manage their customer interactions and data. With features tailored to streamline communication, track customer engagement, and organize customer information, Clientify provides an all-in-one solution for improving business relationships and boosting productivity. The platform's clean, modern interface and responsive design ensure a seamless user experience across all devices.


## Demo

https://clientify.vercel.app
## Run Locally

Clone the project

```bash
  git clone https://github.com/Priyanshu-web-tech/ClienTify.git
```

Go to the project directory

```bash
  cd ClienTify
```
### Backend Setup

Go to the server directory

```bash
  cd server
```

Install dependencies

```bash
  npm install
```

Create .env file & add the following in it:

```bash
MONGODB_URI=
PORT=
CLIENT_ORIGIN=
JWT_KEY= 
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
EMAIL_USER=
EMAIL_PASS=
```

Start the server

```bash
  npm run dev
```
### Frontend Setup

Go to the client directory

```bash
  cd client
```

Install dependencies

```bash
  npm install
```

Create .env file & add the following in it:

```bash
VITE_BASE_URL=
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Start the server

```bash
  npm run dev
```


## Tech Stack

**Client:** React, Redux Tool Kit, TailwindCSS

**Server:** Node, Express

**Database:** MongoDB with ORM-Mongoose

**Google Auth:** Firebase



## Screenshots

![App Screenshot](https://ik.imagekit.io/pz4meracm/Clientify.png?updatedAt=1718160195804)

