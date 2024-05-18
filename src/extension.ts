import * as vscode from 'vscode';
import { NotificationsView, TimelineView } from './webview';
import showStatusBar from './status_bar';
import { listCommand, postCommand, likeCommand } from './command';

export function activate(context: vscode.ExtensionContext) {
    // status bar
    showStatusBar();

    // list
    vscode.commands.registerCommand('blueriver.list', async () => {
        await listCommand();
    });

    // timeline
    vscode.commands.registerCommand('blueriver.timeline', () => {
        const panel = vscode.window.createWebviewPanel(
            'timeline',
            'Timeline',
            vscode.ViewColumn.One,
            {}
        );
        panel.iconPath = {
            light: vscode.Uri.joinPath(
                context.extensionUri,
                'assets',
                'bluesky.svg'
            ),
            dark: vscode.Uri.joinPath(
                context.extensionUri,
                'assets',
                'bluesky.svg'
            ),
        };
        const view = new TimelineView(context.extensionUri);
        view.resolveWebviewView(panel);
    });

    // post
    vscode.commands.registerCommand('blueriver.post', async () => {
        await postCommand();
    });

    // notifications
    vscode.commands.registerCommand('blueriver.notifications', () => {
        const panel = vscode.window.createWebviewPanel(
            'notifications',
            'Notifications',
            vscode.ViewColumn.One,
            {}
        );
        panel.iconPath = {
            light: vscode.Uri.joinPath(
                context.extensionUri,
                'assets',
                'bluesky.svg'
            ),
            dark: vscode.Uri.joinPath(
                context.extensionUri,
                'assets',
                'bluesky.svg'
            ),
        };
        const view = new NotificationsView(context.extensionUri);
        view.resolveWebviewView(panel);
    });

    // like
    vscode.commands.registerCommand('blueriver.like', async () => {
        await likeCommand();
    });
}

// This method is called when your extension is deactivated
export function deactivate() {}
