import * as vscode from 'vscode';
import Bluesky from '../../bluesky';
import { Notification } from '@atproto/api/dist/client/types/app/bsky/notification/listNotifications';
import { notifications_text } from '../../data/notifications';
import webviewLayout from '../layout';
import icons, { IconType } from '../components/icons';
import getRelativeTime from '../../utils/getRelativeTime';

export class NotificationsView {
    constructor(private extensionUri: vscode.Uri, private bluesky: Bluesky) {}

    public async resolveWebviewView(webviewView: vscode.WebviewPanel) {
        const notification = await this.bluesky.notification();

        if (!notification || !notification.success) {
            return;
        }

        const cards = notification.data.notifications
            .map((item) => this.notificationCard(item))
            .join(' ');

        const content = `
            <ul class="notifications-list">
                ${cards}
            </ul>`;

        webviewLayout(
            {
                webviewView,
                extensionUri: this.extensionUri,
            },
            content,
            {
                title: 'Bluesky Notifications',
            }
        );
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
