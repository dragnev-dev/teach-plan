# Source code details

The code organisation goes as following:

```
├── components/
│   ├── ...
│       
├── models/
│   ├── ...
│   
├── navigation/
│   └── AppNavigator.tsx
│   
├── screens/
│   ├── ...
│   
├── store/
│   ├── ...
│   
├── utils/
│   ├── ...
│   
├── index.js
│   
└── App.tsx
```

- `App.tsx` contains the top-level component of the app.

- `index.js` sets up the app and renders the top-level component.

- screens folder contains all screens in the app.

The app has 3 main screens - `AgendaScreen`, `WeeklyScreen`, `MonthlyScreen`. Each of them works with a component to render its children.

- components folder contains all reusable UI components that can be used across multiple screens or other components.

`AgendaSchoolHour` is used to render the school hours in agenda, `DayOfMonth` is used to render the months in `MonthlyScreen` and `DayOfWeek` is used to render the days in `WeeklyScreen` respectively.

- utils folder contains any utility/helper functions used throughout the app.

- navigation folder contains the app's navigation logic and setup;

  - it takes care for all of the routing;

  - the app has 4 stack navigators and one tab navigator.

- store folder contains the logic related to the Redux store

  - Actions are split into their own folder under actions with an actionTypes.ts file.

  - Reducers are split into their own folder under `reducers`

  - The `store.ts` file:

    - combines the reducers into the root store

    - configures the persistency of the root store

  - The `hooks.ts` file exports `useAppDispatch` and `useAppSelector` constants that are called in the screens to dispatch actions and to get data respectively.
