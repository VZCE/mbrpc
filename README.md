# mbrpc

This old project is an RPC integration for Discord, designed to work with MusicBee, a popular music player. Developed in Node.js, this script allows you to display the currently playing music information from MusicBee directly on your Discord profile. I completed this project with the help of the Beekeeper plugin, which allowed me to write it in JavaScript (avoiding C# which I am not familiar with).

[![Issues](https://img.shields.io/github/issues/vzce/mbrpc/total.svg?style=for-the-badge)]()
[![Github All Releases](https://img.shields.io/github/downloads/vzce/mbrpc/total.svg?style=for-the-badge)]()

## 🌟 Features

- Real-time display of the currently playing track information (title, artist, album, artwork, timestamps).
- Automatic updating of Discord status with the current track.
- Supports custom statuses for enhanced personalization.
- Drag and drop markdown and HTML files into Dillinger
- Export documents as Markdown, HTML and PDF

## 📋 Prerequisites

- Node.js (version 12 or higher)
- MusicBee (version 3.3 or higher)
- Beekeeper plugin for MusicBee
- IMGBB account and API key
- Discord account

## 📦 Installation

### 1. Install the dependencies

```sh
git clone https://github.com/VZCE/mbrpc.git
cd mbrpc
```

```sh
npm install
```

### 2. Install the Beekeeper plugin for MusicBee

Download and install the Beekeeper plugin from [here](http://grismar.net/beekeeper/). The Beekeeper plugin is an embedded web server for MusicBee. It exposes most of the MusicBee API as an HTTP interface or a web API.

### 3. Create an IMGBB account and generate an API key

- Go to [IMGBB](https://imgbb.com/).
- Sign up for an account and generate an [API key](https://api.imgbb.com/).

### 4. Create a `.env` file at the root of the project and insert the following information:

```env
## DISCORD

CLIENT_ID=""
SMALL_IMAGE_KEY=""

## BEEKEEPER

API_URL="http://127.0.0.1:8080"

# IMGBB
IMGBB_API_KEY=""
```

The API port for Beekeeper is the same for everyone unless you change the port in the MusicBee settings.

### 5. Configure your Discord application:

- Create a new application on the Discord [Developer Portal](https://discord.com/developers/applications).
- Note the application ID and add it to the CLIENT_ID field in the .env file.

### 6. Start the script

```sh
node index.js
```

## Usage

Launch MusicBee and start playing your music. Your Discord status will automatically update with the currently playing track information.

## Contributions

Contributions are welcome! The code is actually not really well optimized. Feel free to submit pull requests or open issues to report bugs or suggest improvements.
