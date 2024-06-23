# BlueRiver - VSCode client for Bluesky

This is a VSCode extension for the client of Bluesky. It has features such as posts, timeline, notifications, and liking. It also has multi-column view and notification status bar. We plan to add more features in the future.

Click [here](https://marketplace.visualstudio.com/items?itemName=zuk246.blueriver) to install.

![](./art/screenshot-1.png)

Once installed, you can use the following features:

-   Timeline view (with link cards)
-   Notifications
-   Like other people's posts
-   Status bar
-   Create new posts
-   Check your account information

## Installation

1. Install the extension from here.

2. Click "Open Settings" when you receive a notification.

3. Set the server, username, and password.

    (Don't worry, these will be saved as secret variables. Also, no unauthorized posting will be made.)

## Usage

At startup, a status bar is added.
And it can display a list of commands.

![](./art/screenshot-2.png)

-   Timeline

    `blueriver.timeline`

    Displays the home timeline of the logged-in user.

-   Post

    `blueriver.post`

    Edit the text you want to post, select the language of the written text, and post.

-   Like

    `blueriver.like`

    When you run it, your timeline will be displayed and you can select the post you want to like from it.

-   Notifications

    `blueriver.notifications`

    This is a list of notifications for the logged-in user.

-   Command list

    `blueriver.list`

    This is a list of commands for this extension.

-   Settings

    `blueriver.settings`

    You can set the server, username and password.

## Start developing

This is for developers.

### Built With

-   VSCode
-   Bluesky API

### Requirement

-   Node.js
-   VSCode

### Installation

Clone the repository.

```
git clone https://github.com/zuk246/BlueRiver.git
```

Install the node module dependencies.

```
npm install
```

When you didn't have vscode, please install vscode from [here](https://code.visualstudio.com/download).

press `F5` or run the command Debug: Start Debugging from the Command Palette (`⇧⌘P`). This will compile and run the extension in a new Extension Development Host window.

## License

Licensed under the [MIT](LICENSE.md) license.

## Contact

[<img src="https://img.shields.io/badge/GitHub-181717.svg?logo=github&style=for-the-badge" />](https://github.com/zuk246)
[<img src="https://img.shields.io/badge/Bluesky-fff.svg?logo=bluesky&style=for-the-badge" />](https://bsky.app/profile/zuk246.net)
[<img src="https://img.shields.io/badge/Twitter-fff.svg?logo=twitter&style=for-the-badge" />](https://x.com/zuk246)
[<img src="https://img.shields.io/badge/-Buymeacoffee-FF813F.svg?logo=buymeacoffee&style=for-the-badge">](https://www.buymeacoffee.com/zuk246)
