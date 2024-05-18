import * as vscode from 'vscode';
import Bluesky from '../bluesky';

export default async function showStatusBar() {
    const bluesky = new Bluesky();
    await bluesky.login();

    const unreadNotifications = await bluesky.notificationCount();

    const status_bar = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Right,
        1000
    );

    status_bar.text =
        unreadNotifications > 0
            ? `$(bluesky-logo) ${unreadNotifications} unread`
            : '$(bluesky-logo)';
    status_bar.command = 'blueriver.list';

    status_bar.show();
}
