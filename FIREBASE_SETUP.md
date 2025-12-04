# Firebase Setup Guide

## 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name (e.g., "job-start")
4. Enable/disable Google Analytics as needed
5. Click "Create project"

## 2. Enable Authentication

1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Enable **Email/Password** provider
3. Click "Save"

## 3. Create Firestore Database

1. Go to **Firestore Database**
2. Click "Create database"
3. Choose **Start in test mode** (for development)
4. Select your region
5. Click "Enable"

## 4. Get Firebase Config

1. Go to **Project Settings** (gear icon)
2. Scroll to "Your apps" section
3. Click the web icon (`</>`) to add a web app
4. Register your app with a nickname
5. Copy the config object

## 5. Environment Variables

Create a `.env.local` file in the project root with:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## 6. Firestore Security Rules

### Development Rules (Test Mode)
Use these permissive rules during development:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Production Rules
For production, use these stricter rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Jobs are readable by all authenticated users
    match /jobs/{jobId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        resource.data.posterId == request.auth.uid;
    }
    
    // Applications
    match /applications/{applicationId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
    }
    
    // Reviews
    match /reviews/{reviewId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
    }
    
    // Notifications - users can only access their own
    match /notifications/{notificationId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
      allow create: if request.auth != null;
    }
  }
}
```

## 7. Firebase Storage Setup

### Enable Storage
1. Go to **Storage** in Firebase Console
2. Click "Get started"
3. Choose **Start in test mode** (for development)
4. Select your region
5. Click "Done"

### Storage Security Rules
In Storage > Rules, use these rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /avatars/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### CORS Configuration (Required for local development)
1. Install Google Cloud SDK: https://cloud.google.com/sdk/docs/install
2. Login: `gcloud auth login`
3. Set project: `gcloud config set project YOUR_PROJECT_ID`
4. Apply CORS config:
```bash
gsutil cors set firebase-cors.json gs://YOUR_PROJECT_ID.appspot.com
```

Replace `YOUR_PROJECT_ID` with your Firebase project ID (e.g., `jobstart-c4e6e`).

## 8. Firestore Indexes

Create these composite indexes in Firestore Console > Indexes:

| Collection | Fields | Query scope |
|------------|--------|-------------|
| jobs | posterId (Asc), createdAt (Desc) | Collection |
| jobs | status (Asc), createdAt (Desc) | Collection |
| applications | seekerId (Asc), createdAt (Desc) | Collection |
| applications | jobId (Asc), createdAt (Desc) | Collection |
| reviews | revieweeId (Asc), createdAt (Desc) | Collection |
| notifications | userId (Asc), createdAt (Desc) | Collection |
| notifications | userId (Asc), read (Asc) | Collection |
