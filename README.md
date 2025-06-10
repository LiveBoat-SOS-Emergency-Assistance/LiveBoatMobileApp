<p align="center">
  <img src="https://i.imgur.com/PsJbnE9.png" alt="Liveboat Logo" width=70%/>
</p>

# Liveboat – Mobile App

![React Native](https://img.shields.io/badge/react_native-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![Expo](https://img.shields.io/badge/expo-1C1E24?style=for-the-badge&logo=expo&logoColor=#D04A37)

A powerful hybrid mobile application built with **React Native** and **Expo**.

---
## 📱 Preview

| Screen 1 | Screen 2 |
|----------|----------|
| <img src="https://i.imgur.com/rl8L3ZU.png" width="200"/> | <img src="https://i.imgur.com/rl8L3ZU.png" width="200"/> |


---

## 🛠️ This project was built on

- 🪟 Windows 10/11  
- 📦 Npm to install dependencies  
- 🧮 Npm (v10.7.0 or compatible)

> ⚠️ **Different environments (OS system, Java versions, etc.) can vastly affect the project**

---

## 🚀 Tech stack

- ⚛️ React Native  
- ⚙️ Expo  

---

## 📖 Explain the project in technical term

- **This project uses hybrid workflow (besides this there are Managed workflow & Bare workflow):**
    - It means it uses both Expo's tools (expo CLI for easier setup) & custom native code (modules, libs that are not supported in Expo).
    - When developing, you use expo CLI like `expo start`, `expo run:android`, etc., and when running you should see `Using development build` instead of ~~`Using Expo Go`~~

- **When to use `npm start` (expo start):**
    - When developing the app, `npm start` is enough, but you still need some CLI below in a few cases.

- **When to use `npm run android` (expo run:android) or `npx expo prebuild`:**
    - `expo run:android` is equal to two CLI commands combined: `npx expo prebuild` then `expo start`
    - You need `npx expo prebuild` when you just added a new module or library that is not supported by Expo  
    - *For example:*
        - *If you just did `npm install react-native-vision-camera`, this library is not supported by Expo*  
          so you need to do `npx expo prebuild` to build this native module to the `android/` folder  
          then you can do `expo start` again

---

## 🧪 How to run the project for development

- Run `npm i` to install dependencies  
- Run `npx expo prebuild` if the `android/` folder is not up-to-date  
- Run `npm start` to run the project without rebuilding the native components  
- If you have added a new lib that is not supported by Expo, run `npx expo prebuild` again then `npm start`

---

## 📦 How to build APK

> ⚠️ **Only build when you can run the project perfectly fine with `expo start`**

### 🧰 There are 2 ways to get the .apk file

1. **Use EAS**
    - For EAS, it's a system **provided by Expo**, you can build using this CLI locally and remotely.  
    - But when doing it locally, it **requires Ubuntu or macOS**, it **doesn't support Windows**  
    - When doing it remotely, it sends the code to the cloud and builds it from there. So it takes time and is harder to debug if there are any issues

2. **Gradlew**
    - Build locally available for both **Ubuntu** and **Windows**  
    - Must have Java, SDK, etc. (More details on *how to build with gradlew on Windows*)

---

### 🧱 Build with gradlew on Windows

These steps are for **Windows** (will differ on Ubuntu):

**🔧 Prerequisites**:  
You must have Node.js, Java JDK, Android Studio with SDK, and environment variables like `JAVA_HOME` & `ANDROID_HOME`

**🔨 Steps**:

1. `npx expo prebuild` from the root folder  
    - Do this to rebuild if there are any changes in the app's name, icon image, etc.

2. `npx react-native bundle ...` from the root folder  
    - This step builds the JS Bundle, so that the APK can run independently from Expo  
    - After this step, you will see folders `android/app/src/main/assets` and `/res`, with `index.android.bundle` file inside the assets folder

    **📜 Full CLI script**:
    ```sh
    npx react-native bundle ^
    --platform android ^
    --dev false ^
    --entry-file node_modules/expo-router/entry.js ^
    --bundle-output android/app/src/main/assets/index.android.bundle ^
    --assets-dest android/app/src/main/res
    ```

3. **🧹 [Optional]** Clean the build
    ```sh
    cd android
    gradlew clean
    ```

4. **🏗️ Build the APK**
    ```sh
    cd android
    gradlew assembleRelease
    ```

5. **📁 Get the APK**  
    The APK will be placed in:  
    ```
    android/app/build/outputs/apk/release/app-release.apk
    ```

6. **🔐 [Optional] Configure Release Keystore**  
    This step is to sign the APK for release — the APK will become a signed APK and can be uploaded to Google Play (CHPlay)

Some errors may need taken cares of
1. ``npx react-native codegen`` in root folder before ``gradlew assembleRelease`` to avoid cmake errors
    if cmake error happen:
    ```
        cd android
        ./gradlew clean
        cd ..
        rm -rf android/app/build
        rm -rf node_modules
        rm -rf android/app/.cxx
        rm -rf android/.gradle
        rm -rf android/build
        rm -rf android/.cxx
        rm -rf package-lock.json yarn.lock
    ```
    then open cmd with admin perm
    ```
        npm i
        npx react-native codegen
        gradlew clean
        gradlew assembleRelease
    ```
2. make sure all images are in its true extension
3. might need ``chmod +x android/gradlew``

---

## 📄 License

Update later
