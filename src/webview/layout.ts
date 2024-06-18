import * as vscode from 'vscode';
import { locale } from '../locale';
import { getNonce } from '../utils/nonce';
import icons, { IconType } from './components/icons';

export default function webviewLayout(
    config: {
        webviewView: vscode.WebviewPanel;
        extensionUri: vscode.Uri;
    },
    content: string,
    settings: {
        title: string;
        scripts?: string[];
    }
) {
    const { webviewView, extensionUri } = config;

    webviewView.webview.options = {
        enableScripts: true,
    };

    const styleUri = webviewView.webview.asWebviewUri(
        vscode.Uri.joinPath(extensionUri, 'media', 'style.css')
    );

    const scriptPath: undefined | vscode.Uri = settings.scripts
        ? webviewView.webview.asWebviewUri(
              vscode.Uri.joinPath(extensionUri, ...settings.scripts)
          )
        : undefined;

    const layoutScriptPath = webviewView.webview.asWebviewUri(
        vscode.Uri.joinPath(extensionUri, 'media', 'layout-script.js')
    );

    const sidebarContent: {
        name: string;
        icon: IconType;
        command: string;
        secondaryCommand?: string;
    }[] = [
        {
            name: locale('command-name-timeline'),
            icon: 'home',
            command: 'blueriver.timeline',
        },
        {
            name: locale('command-name-notifications'),
            icon: 'notifications',
            command: 'blueriver.notifications',
        },
        {
            name: locale('command-name-like'),
            icon: 'like',
            command: 'blueriver.like',
        },
        // { name: 'Feed', icon: 'newspaper' },
        // { name: 'List', icon: 'list' },
        // { name: 'Account', icon: 'person' },
        {
            name: locale('command-name-settings'),
            icon: 'settings',
            command: 'workbench.action.openSettings',
            secondaryCommand: 'blueriver',
        },
    ];

    const sidebar = sidebarContent
        .map(
            (item) =>
                `<button class="sidebar-item" id="${item.command} ${
                    item.secondaryCommand
                }">
            ${icons(item.icon, 24)}
            <div class="sidebar-name">${item.name}</div>
        </button>`
        )
        .join('');

    const bugIcon = icons('bug', 26);

    webviewView.webview.onDidReceiveMessage((message) => {
        switch (message.command) {
            case 'sidebar':
                const data = message.id.split(' ');
                vscode.commands.executeCommand(data[0], data[1]);
                return;
        }
    });

    const postText = locale('command-name-post');

    const nonce = [getNonce(), getNonce()];

    const reportBug = locale('message-report-bug');

    webviewView.webview.html = `
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>
                ${settings.title}
            </title>
            <link rel="stylesheet" href="${styleUri}">
        </head>
        <body>
            <div class="main">
                <div class="sidebar">
                    <div class="sidebar-content">
                        ${sidebar}
                        <button class="sidebar-item sidebar-post" id="blueriver.post">
                            ${postText}
                        </button>
                    </div>
                </div>
                <div class="content">
                    ${content}
                </div>
                <div class="sub-sidebar">
                    <div class="sub-sidebar-content">
                        <div class="report-bug">
                            <div class="report-bug-content">
                                ${bugIcon}
                                <div class="report-bug-text">
                                    ${reportBug}
                                </div>
                            </div>
                            <div class="report-bug-link">
                                <a href="https://bsky.app/profile/zuk246.net" target="_blank" rel="noopener noreferrer" class="report-bug-link-button">
                                    Bluesky DM
                                </a>
                                <a href="https://github.com/zuk246/BlueRiver/issues/new/choose" target="_blank" rel="noopener noreferrer" class="report-bug-link-button">
                                    Github
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            ${
                scriptPath
                    ? `<script nonce="${nonce[0]}" src="${scriptPath}" ></script>`
                    : ''
            }
            <script nonce="${nonce[1]}" src="${layoutScriptPath}"></script>
        </body> 
    </html>
    `;
}
