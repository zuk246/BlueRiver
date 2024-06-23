import { BskyAgent } from '@atproto/api';
import * as vscode from 'vscode';
import { SecretStorage } from 'vscode';
import { locale } from './locale';

export default class Bluesky {
    agent: BskyAgent;
    secrets: SecretStorage | undefined;
    public loginStatus: boolean = false;

    constructor(context: vscode.ExtensionContext) {
        this.secrets = context.secrets;
    }

    public async login(context?: vscode.ExtensionContext) {
        try {
            const identifier = (await this.secrets?.get('user')).toString();
            const password = (await this.secrets?.get('password')).toString();

            this.agent = new BskyAgent({
                service:
                    (await this.secrets?.get('service')).toString() ??
                    'https://bsky.social',
            });

            await this.agent.login({
                identifier: identifier,
                password: password,
            });

            this.loginStatus = true;
            return;
        } catch (e) {
            const message = vscode.window.showErrorMessage(
                'Failed to login. Please check your configuration.',
                context ? 'Set settings' : '',
                'Retry'
            );

            message.then((value) => {
                if (value === 'Set settings' && !!context) {
                    this.setCredentials(context);
                }
                if (value === 'Retry') {
                    this.login(context);
                }
            });
        }
    }

    public async setCredentials(context: vscode.ExtensionContext) {
        this.secrets = context.secrets;
        this.loginStatus = false;

        const previousCredentials = {
            service:
                (await this.secrets?.get('service'))?.toString() ??
                'https://bsky.social',
            user: (await this.secrets?.get('user'))?.toString() ?? '',
            password: (await this.secrets?.get('password'))?.toString() ?? '',
        };

        const service = await vscode.window.showInputBox({
            title: locale('setting-service'),
            placeHolder: locale('setting-service'),
            value: previousCredentials.service,
        });
        const identifier = await vscode.window.showInputBox({
            title: locale('setting-user'),
            placeHolder: locale('setting-user'),
            value: previousCredentials.user,
        });
        const password = await vscode.window.showInputBox({
            title: locale('setting-password'),
            placeHolder: locale('setting-password'),
            password: true,
            value: previousCredentials.password,
        });

        await this.secrets.store('service', service);
        await this.secrets.store('user', identifier);
        await this.secrets.store('password', password);

        this.agent = new BskyAgent({
            service: service ?? 'https://bsky.social',
        });

        await this.login(context).then(() => {
            vscode.window.showInformationMessage('Successfully logged in');
        });

        return;
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
            await this.agent.updateSeenNotifications();
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

    public async post(text: string, lang: string) {
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
        try {
            await this.agent.like(uri, cid);
        } catch (_) {
            vscode.window.showErrorMessage('Failed to like');
        }
    }

    public async accountInfo() {
        try {
            const accountInfo = await this.agent.getProfile({
                actor: this.agent.session.did,
            });
            const postData = await this.agent.getAuthorFeed({
                actor: this.agent.session.did,
            });
            return {
                info: accountInfo.data,
                posts: postData.data.feed,
            };
        } catch (_) {
            vscode.window.showErrorMessage('Failed to get account info');
        }
    }
}
