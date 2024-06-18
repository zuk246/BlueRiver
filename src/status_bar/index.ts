import * as vscode from 'vscode';
import Bluesky from '../bluesky';
import { locale } from '../locale';

export default function showStatusBar(bluesky: Bluesky) {
    const status_bar = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Right,
        2
    );

    status_bar.text = '$(bluesky-logo)';
    status_bar.tooltip = 'Blueriver';
    status_bar.name = 'Blueriver';
    status_bar.command = 'blueriver.list';

    status_bar.show();

    setInterval(async () => {
        const unreadNotifications = await bluesky.notificationCount();

        status_bar.text =
            unreadNotifications > 0
                ? `$(bluesky-logo) ${unreadNotifications} ${locale(
                      'status-bar-unread'
                  )}`
                : '$(bluesky-logo)';

        status_bar.show();
    }, 20000);
}
