import * as vscode from 'vscode';
import Bluesky from '../bluesky';

export default function showStatusBar() {
    const status_bar = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Right,
        2
    );

    status_bar.text = '$(bluesky-logo)';
    status_bar.tooltip = 'Blueriver';
    status_bar.name = 'Blueriver';
    status_bar.command = 'blueriver.list';

    status_bar.show();

    const bluesky = new Bluesky();

    setInterval(async () => {
        status_bar.show();

        await bluesky.login();

        const unreadNotifications = await bluesky.notificationCount();

        status_bar.text =
            unreadNotifications > 0
                ? `$(bluesky-logo) ${unreadNotifications} unread`
                : '$(bluesky-logo)';

        status_bar.show();
    }, 30000);
}
