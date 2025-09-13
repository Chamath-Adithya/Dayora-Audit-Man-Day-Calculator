# Audit Man-Day Calculator (Offline Desktop Application)

This repository contains the Audit Man-Day Calculator, originally a React-based web application, now converted into a standalone offline desktop application for Windows and Linux (AppImage) using Electron.

## Project Overview

The Audit Man-Day Calculator is designed to assist users in calculating audit man-days based on various parameters. It provides a user-friendly interface for inputting data and generating audit duration estimates. The conversion to an Electron application allows it to run independently on Windows PCs and Linux distributions without requiring a web browser or internet connection, making it suitable for offline use cases.

## Offline Conversion Details

The original Next.js (React) application has been configured for static export, generating a set of static HTML, CSS, and JavaScript files. These static assets are then bundled with an Electron wrapper, which provides a native desktop environment. This approach ensures that the application\'s core functionality remains intact while enabling offline access and native desktop features.

## Features

*   **Offline Functionality**: No internet connection required after installation.
*   **Cross-Platform (Windows & Linux AppImage)**: Packaged specifically for Windows operating systems and Linux distributions.
*   **User-Friendly Interface**: Intuitive design for easy audit man-day calculation.
*   **Local Data Persistence**: Data is stored locally on the user\'s machine.

## Installation

### For Windows PC

To install the Audit Man-Day Calculator on your Windows PC, follow these steps:

1.  **Download the Installer**: Obtain the `Audit Man-Day Calculator Setup 1.0.0.exe` file from the `build` directory.
2.  **Run the Installer**: Double-click the downloaded `.exe` file to start the installation process.
3.  **Follow On-Screen Prompts**: The installer will guide you through the necessary steps to install the application.
4.  **Launch the Application**: Once installed, you can launch the application from your Start Menu or desktop shortcut.

### For Linux (AppImage)

To run the Audit Man-Day Calculator on Linux using AppImage, follow these steps:

1.  **Download the AppImage**: Obtain the `Audit Man-Day Calculator-1.0.0.AppImage` file from the `build` directory.
2.  **Make Executable**: Open a terminal, navigate to the directory where you downloaded the AppImage, and make it executable:
    ```bash
    chmod +x "Audit Man-Day Calculator-1.0.0.AppImage"
    ```
3.  **Run the AppImage**: Execute the AppImage from the terminal or by double-clicking it in your file manager:
    ```bash
    ./"Audit Man-Day Calculator-1.0.0.AppImage"
    ```

## Development Setup

If you wish to set up the development environment or build the application yourself, follow these instructions:

### Prerequisites

*   Node.js (LTS version recommended)
*   npm or Yarn (for package management)
*   Git
*   Wine (for building Windows executables on Linux/macOS)

### 1. Clone the Repository

```bash
git clone https://github.com/Chamath-Adithya/React-audit-man-day-calculator.git
cd React-audit-man-day-calculator
```

### 2. Install React App Dependencies

Navigate to the `React-audit-man-day-calculator` directory and install its dependencies using npm or Yarn:

```bash
npm install
# or
yarn install
```

### 3. Build the React App for Static Export

Ensure the `next.config.mjs` file is configured for static export (`output: "export"`). Then, run the build command using npm or Yarn:

```bash
npm run build
# or
yarn build
```

This will generate the static assets in the `out` directory.

### 4. Set up and Build the Electron Application

Navigate to the `electron-app` directory and install Electron dependencies using npm or Yarn:

```bash
cd ../electron-app
npm install
# or
yarn install
```

Then, build the executables using npm or Yarn:

*   **For Windows**: 
    ```bash
    npm run dist
    # or
    yarn dist
    ```
*   **For Linux (AppImage)**:
    ```bash
    npm run dist:linux
    # or
    yarn dist:linux
    ```

The installers/AppImage will be located in the `electron-app/build` directory.

## Usage

After installation, launch the application. The interface will be familiar to users of the web version. All calculations and data will be stored locally on your machine.

## Contributing

Feel free to fork the repository, make improvements, and submit pull requests. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the ISC License.

