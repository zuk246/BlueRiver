import * as vscode from 'vscode';
import Bluesky from '../bluesky';
import { Notification } from '@atproto/api/dist/client/types/app/bsky/notification/listNotifications';
import icons, { IconType } from '../components/icons';
import getRelativeTime from '../features/getRelativeTime';
import { notifications_text } from '../data/notifications';

export class NotificationsView {
    constructor(private extensionUri: vscode.Uri) {}

    public async resolveWebviewView(webviewView: vscode.WebviewPanel) {
        webviewView.webview.options = {};

        const styleUri = webviewView.webview.asWebviewUri(
            vscode.Uri.joinPath(this.extensionUri, 'src', 'media', 'style.css')
        );

        const bluesky = new Bluesky();
        await bluesky.login();

        const notification = await bluesky.notification();

        if (!notification || !notification.success) {
            return;
        }

        const a = notification.data.notifications;

        const cards = notification.data.notifications
            .map((item) => this.notificationCard(item))
            .join(' ');

        const unread = notification.data.notifications.filter(
            (item) => !item.isRead
        ).length;

        webviewView.webview.html = `
        <!DOCTYPE html>
        <html lang="ja">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Bluesky Notifications</title>
                <link rel="stylesheet" href="${styleUri}">
            </head>
            <body>
                <div class="head">
                    <h1 class="title">Notification</h1>
                    <p class="subtitle">You have ${unread} notifications.</p>
                </div>
                <ul class="notifications-list">
                    ${cards}
                </ul>
            </body> 
        </html>
        `;
    }

    private notificationCard(notification: Notification) {
        let reason: IconType;
        switch (notification.reason) {
            case 'reply':
                reason = 'reply';
                break;
            case 'repost':
                reason = 'repost';
                break;
            case 'like':
                reason = 'like';
                break;
            case 'follow':
                reason = 'follow';
                break;
            case 'mention':
                reason = 'mention';
                break;
            case 'quote':
                reason = 'quote';
                break;
            default:
                reason = 'reply';
        }

        const icon = icons(reason, 30);
        const relativeTime = getRelativeTime(notification.indexedAt);

        return `
        <li class="notification-card">
            <div class="notification-icon">${icon}</div>
            <div class="notification-content">
                <img src="${
                    notification.author.avatar
                }" alt="avatar" class="notification-avatar" width="32" height="32" />
                <p class="notification-title">
                    <span class="notification-author">${
                        notification.author.displayName
                    }</span>
                    ${' '}${notifications_text[reason]}${' '}${relativeTime}
                </p>
            </div>
        </li>
        `;
    }
}
