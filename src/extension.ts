import * as vscode from 'vscode';
import { AccountView, NotificationsView, TimelineView } from './webview';
import showStatusBar from './status_bar';
import { listCommand, postCommand, likeCommand } from './command';
import Bluesky from './bluesky';
import { locale } from './locale';

function iconPath(context: vscode.ExtensionContext) {
    return {
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
}

export async function activate(context: vscode.ExtensionContext) {
    const bluesky = new Bluesky();
    await bluesky.login();

    // status bar
    showStatusBar(bluesky);

    // list
    vscode.commands.registerCommand('blueriver.list', async () => {
        await listCommand();
    });

    // timeline
    vscode.commands.registerCommand('blueriver.timeline', () => {
        const title = locale('command-name-timeline');
        const panel = vscode.window.createWebviewPanel(
            'timeline',
            title,
            vscode.ViewColumn.One
        );
        panel.iconPath = iconPath(context);
        const view = new TimelineView(context.extensionUri, bluesky);
        view.resolveWebviewView(panel);
    });

    // post
    vscode.commands.registerCommand('blueriver.post', async () => {
        await postCommand(bluesky);
    });

    // notifications
    vscode.commands.registerCommand('blueriver.notifications', () => {
        const title = locale('command-name-notifications');
        const panel = vscode.window.createWebviewPanel(
            'notifications',
            title,
            vscode.ViewColumn.One
        );
        panel.iconPath = iconPath(context);
        const view = new NotificationsView(context.extensionUri, bluesky);
        view.resolveWebviewView(panel);
    });

    // like
    vscode.commands.registerCommand('blueriver.like', async () => {
        await likeCommand(bluesky);
    });

    // account
    vscode.commands.registerCommand('blueriver.account', async () => {
        const title = locale('command-name-account');
        const panel = vscode.window.createWebviewPanel(
            'account',
            title,
            vscode.ViewColumn.One
        );
        panel.iconPath = iconPath(context);
        const view = new AccountView(context.extensionUri, bluesky);
        view.resolveWebviewView(panel);
    });
}

// This method is called when your extension is deactivated
export function deactivate() {}
