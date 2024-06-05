import { BskyAgent } from '@atproto/api';
import * as vscode from 'vscode';

export default class Bluesky {
    agent: BskyAgent;
    configuration: vscode.WorkspaceConfiguration | undefined;
    loginStatus: boolean = false;

    constructor() {
        this.configuration = vscode.workspace.getConfiguration('blueriver');

        this.agent = new BskyAgent({
            service: this.configuration.get('service') ?? 'https://bsky.social',
        });
    }

    private resetConfiguration() {
        this.configuration = vscode.workspace.getConfiguration('blueriver');
    }

    public async login() {
        try {
            await this.agent.login({
                identifier: this.configuration?.get('user') ?? '',
                password: this.configuration?.get('password') ?? '',
            });
            this.loginStatus = true;
            return;
        } catch (e) {
            const message = vscode.window.showErrorMessage(
                'Failed to login. Please check your configuration.',
                'Open settings',
                'Retry'
            );

            message.then((value) => {
                if (value === 'Open settings') {
                    vscode.commands.executeCommand(
                        'workbench.action.openSettings',
                        'blueriver'
                    );
                }
                if (value === 'Retry') {
                    this.resetConfiguration();
                    this.login();
                }
            });
        }
    }

    public async timeline() {
        if (!this.loginStatus) {
            await this.login();
        }

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
        if (!this.loginStatus) {
            await this.login();
        }

        try {
            const notification = await this.agent.listNotifications();
            await this.agent.updateSeenNotifications();
            return notification;
        } catch (_) {
            vscode.window.showErrorMessage('Failed to get notification');
        }
    }

    public async notificationCount() {
        if (!this.loginStatus) {
            await this.login();
        }

        try {
            const notificationCount =
                await this.agent.countUnreadNotifications();
            return notificationCount.data.count;
        } catch (_) {
            return 0;
        }
    }

    public async post(text: string, lang: string) {
        if (!this.loginStatus) {
            await this.login();
        }

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

    public async like(uri: string, cid: string) {
        if (!this.loginStatus) {
            await this.login();
        }

        try {
            await this.agent.like(uri, cid);
        } catch (_) {
            vscode.window.showErrorMessage('Failed to like');
        }
    }
}
