# Rick and Morty Challenge

A technical challenge app built with Ignite, Expo, React Native, and TypeScript.

The app consumes the Rick and Morty API and provides a clean mobile experience for browsing episodes and viewing the characters that appear in each episode.

---

<img width="300" height="2622" alt="Image" src="https://github.com/user-attachments/assets/eb3d7273-8ea6-4492-a77b-46d660d1a5a7" />
<img width="300" height="2622" alt="Image" src="https://github.com/user-attachments/assets/72938c5e-39d9-49be-84a8-97bbceffd1ec" />



## Overview

This project focuses on:

- scalable feature-based architecture
- clean separation between UI, hooks, services, and types
- typed React Navigation flows
- reusable themed components
- API-driven filtering and fetching
- a polished user experience with search, pull-to-refresh, offline-friendly states, and theme switching

---

## Tools and Technologies Used

### Core stack

- React Native
- Expo Dev Client
- Ignite boilerplate
- TypeScript
- React Navigation

### UI and developer experience

- Ignite theming system
- React Native Reanimated and Animated APIs
- MMKV storage for persisted theme preferences
- Reactotron for development debugging

### Testing and quality

- Jest
- React Native Testing Library
- ESLint
- Prettier
- TypeScript compiler checks

### API

- Rick and Morty API
- native fetch with typed service wrappers
- query param support for name and episode filtering

---

## Architecture

The project follows a feature-based approach inside the app folder.

```text
app/
  features/
    episodes/
      components/
      hooks/
      services/
      types/
  screens/
  navigators/
  components/
  theme/
  utils/
```

### Architectural principles

#### UI components

Presentational components live close to the feature and only care about rendering.

Examples:

- EpisodeCard
- CharacterCard

#### Hooks

Hooks manage state, effects, API-driven filtering, memoization, and refresh behavior.

Examples:

- useEpisodes
- useEpisodeCharacters

#### Services

Service files are responsible only for API communication and normalized error handling.

Example:

- episodesApi

#### Types

Shared contracts and interfaces are centralized in one place for better reuse and stronger typing.

Example:

- episode, character, paginated response, navigation params

#### Navigation

The app uses a typed stack flow:

- EpisodesList
- EpisodeDetail

---

## Features Implemented

### Episodes list

- fetches episodes from the API
- search is handled through the Rick and Morty API using supported query params
- supports filtering by episode name or episode code
- pull-to-refresh support
- loading, error, and empty states
- top theme toggle button
- memoized separation between the search header and the list to reduce unnecessary re-renders while typing

### Episode details

- receives the episode through typed React Navigation params
- also supports a stable episode id for better refresh resilience
- shows summary information for the selected episode
- fetches characters for that episode
- renders a responsive character list

### Character information

- image
- name
- status badge
- species
- gender
- type
- origin
- location

### UX improvements

- light and dark theme switching
- simple card entry animations
- offline-friendly error messages
- responsive spacing and reusable styles
- debounced search input before API requests

---

## Project Structure Notes

Although the original exercise mentioned a src folder, this implementation uses the existing Ignite app structure because the project already ships with aliases and theming configured there.

That means the feature architecture was integrated into the current app layout instead of forcing a second parallel source root.

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start the development server

```bash
npm run start
```

### 3. Run the iOS development build

```bash
npm run ios
```

### 4. Run Android

```bash
npm run android
```

> This project uses Expo Dev Client, so a development build must be installed before the app can run on a simulator or device.

---

## Useful Scripts

| Script             | Purpose                        |
| ------------------ | ------------------------------ |
| npm run start      | Start Expo with dev client     |
| npm run ios        | Build and open the iOS app     |
| npm run android    | Build and open the Android app |
| npm run web        | Run the web target             |
| npm run compile    | Run TypeScript checks          |
| npm run lint:check | Check lint issues              |
| npm run test       | Run unit tests                 |

---

## Why This Architecture Works Well

This structure makes the project easier to scale because each feature can own:

- its own UI
- its own hooks
- its own API layer
- its own types

As more features are added, the codebase stays easier to read, test, and maintain.

---

## Future Improvements

If more time were available, useful next steps would be:

- pagination for the full episodes catalog
- favorites and local persistence
- unit tests for hooks and service functions
- integration tests for navigation flows
- image caching and performance tuning
- richer accessibility support

---

## Troubleshooting

### No development build installed

If Expo reports that no development build is installed, run:

```bash
npm run ios
```

or

```bash
npm run android
```

### TypeScript validation

To verify the project compiles:

```bash
npm run compile
```

---

## Summary

This repository demonstrates a modern React Native technical challenge implementation using strong typing, modular architecture, API-first filtering, reusable components, and a production-minded mobile UX.
