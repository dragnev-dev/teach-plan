# TeachPlan

![App logo](app-logo.jpg "App logo")

This is a Mobile Programming coursework developed with React Native.

# For source code explanations

please refer to [SOURCE_CODE_DETAILS.md](SOURCE_CODE_DETAILS.md).

## Technical overview

- Built with React Native
- State management with Redux
- Data management with `redux-persist`
- Internationalization with i18n

## Features

The teacher's assistant app `TeachPlan` is designed to help teachers manage their day-to-day work by providing them with schedules, syllabuses and non-schooling days information. The app allows teachers to import the bulk data to get only the specific slices of that information in their day-to-day work throughout the school year.

### Feature overview

- Schedule Management

Teachers can enter their schedule for the school year into the app and get the specific days and times they will be teaching each class.

- Programmatical distribution of syllabus entries

The app takes school schedules and syllabuses as input data to map the syllabus entries throughout the school year. For each of the classes they can see when each entry of the syllabus is taken when during the course of the year. The app offers viewing at a glance the broken down material they need to cover into digestible parts that can be taught within the time allotted.

- Non-Schooling Days

The app takes non-schooling days into account when scheduling lessons from the syllabus, ensuring that all material is covered within the available teaching time.

- Daily/Weekly/Monthly Overview

The app provides teachers with an overview of their schedule for the day, week, or month, showing which classes they will be teaching and which syllabus entry corresponds to each class.

- Completion Tracking

The app allows teachers to track the progress of their syllabus throughout the school year, indicating when each section has been completed.

## Screenshots

TODO

## How to use and sample data for the app

After installing the app, go to settings -> import data. You can use the link of [this sample data endpoint](https://raw.githubusercontent.com/kaisievagradina/teach-plan/data/app-data.json). 

## Building

### Prerequisites

You need the [default dev environment for React Native](https://reactnative.dev/docs/environment-setup?guide=native):

- Android Studio
  - Android SDK
  - Android SDK Platform
  - Android Virtual Device
- `ANDROID_HOME` environment variable
- [Watchman](https://facebook.github.io/watchman/docs/install/#buildinstall)
- node.js
- npm

### Build steps

```
npx react-native start
npx react-native run-android
```
