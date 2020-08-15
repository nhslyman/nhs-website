# Open House

An easy to maintain central website for volunteer event based organizations

## Features

- You control it!
- Editable home information page
- Simple and versatile event creation and management
- Clear event sign up flow
- Simple account creation and management

## Setup

This setup references using basic git commands, explanations can be found [here](https://rogerdudler.github.io/git-guide/)

1. Create your own copy of the source code
   - GitHub Fork (recommended)
      1. Click "use this template"
      2. Follow the instructions on screen
      3. Git clone locally
   - Local Copy
      1. Click Code then download zip on this page
2. Setup Firebase
   1. [Create a firebase project](https://firebase.google.com/docs/web/setup#create-firebase-project) <- step 1
   2. On the firebase dashboard, go to Project Settings > General
   3. Under `Your project`, save `Project ID`
   4. Under `Your apps` select `Add app`
   5. Create a new web app with the hosting option selected
   6. Save the config options for later (`const firebaseConfig = { ... }`)
   7. Create a cloud firestore database
      1. Go to Database > Cloud Firestore in the sidebar
      2. Select test starting mode
      3. Select the location closest to your physical location
   8. Optionally, [connect to a domain](https://firebase.google.com/docs/hosting/custom-domain) (this requires paying ~$12/year for a domain)
3. Edit
   1. Firebase
      1. In `.firebaserc`, replace `PUT-PROJECT-ID-HERE` with your project id
      2. In `/src/main.ts`, replace `const configOptions = { _: "INSERT CONFIG HERE" };` with your config options
   2. Logo
      1. Get an SVG version of your logo (with nearly square dimensions)
      2. Replace `/public/logo.svg` with that
   3. Organization Name
      1. In `/src/main.ts`, replace `ORG_NAME` with your organization name
      2. Optionally, in `/public/index.html`, replace the `Open House` of `<title>Open House</title>` with your organization name to prevent it from flashing on page load
      3. Optional: change the color scheme in `/src/shared-style/variables.scss`
   4. If forked: git commit to backup your changes
4. Deploy
   1. [Download Node.js](https://nodejs.org/en/download/)
   2. Open the project folder in terminal
   3. Run `npm install -g firebase-tools`
   4. Run `firebase login` and follow the instructions that pop up
   5. Run `npm install && npm run build && firebase deploy`

## Development

### Commands

- Install dependencies: `npm install`
- Compiles and hot-reloads for development: `npm run serve`
- Compiles and minifies for production: `npm run build`
- Send build to production: `firebase deploy`
- Lints and fixes files: `npm run lint`
