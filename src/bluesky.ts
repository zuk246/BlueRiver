import { BskyAgent } from '@atproto/api';
import * as vscode from 'vscode';
import { Lang } from './data/lang';

export default class Bluesky {
    agent: BskyAgent;
    configuration: vscode.WorkspaceConfiguration | undefined;

    constructor() {
        this.configuration = vscode.workspace.getConfiguration('blueriver');

        this.agent = new BskyAgent({
            service: this.configuration.get('service') ?? 'https://bsky.social',
        });
    }

    public async login() {
        try {
            await this.agent.login({
                identifier: this.configuration?.get('user') ?? '',
                password: this.configuration?.get('password') ?? '',
            });
            return;
        } catch (_) {
            vscode.window.showErrorMessage('Failed to login');
        }
    }

    public async timeline() {
        try {
            const timeline = await this.agent.getTimeline({
                limit: 60,
            });
            return timeline.data.feed;
        } catch (_) {
            vscode.window.showErrorMessage('Failed to get timeline');
        }
    }

    public async notification() {
        try {
            const notification = await this.agent.listNotifications();
            return notification;
        } catch (_) {
            vscode.window.showErrorMessage('Failed to get notification');
        }
    }

    public async notificationCount() {
        try {
            const notificationCount =
                await this.agent.countUnreadNotifications();
            return notificationCount.data.count;
        } catch (_) {
            return 0;
        }
    }

    public async post(text: string, lang: Lang) {
        try {
            await this.agent.post({
                text: text,
                createdAt: new Date().toISOString(),
                langs: [lang],
            });
        } catch (_) {
            vscode.window.showErrorMessage('Failed to create new post');
        }
    }
}
