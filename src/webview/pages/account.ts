import * as vscode from 'vscode';
import Bluesky from '../../bluesky';
import webviewLayout from '../layout';
import getPostCardWebView from '../components/postCard';
import { locale } from '../../locale';

export class AccountView {
    constructor(private extensionUri: vscode.Uri, private bluesky: Bluesky) {}

    public async resolveWebviewView(webviewView: vscode.WebviewPanel) {
        let content = ``;

        const account = await this.bluesky.accountInfo();

        if (!account) {
            return;
        }

        const { info, posts } = account;

        const i18n = {
            followersCount: locale('app-profile-followers'),
            followsCount: locale('app-profile-following'),
            postsCount: locale('app-profile-posts'),
        };

        const contentDOM = {
            bio: info.description
                .split('\n')
                .map((line) => `<p class="account-info-bio-line">${line}</p>`)
                .join(' '),
            posts: posts.map((item) => getPostCardWebView(item)).join(' '),
        };

        content = `
        <div class="account">
            <img src="${info.banner}" class="account-banner"></img>
            <img src="${info.avatar}" width="130" height="130" class="account-icon"></img>
            <div class="account-info">
                <div>
                    <h1 class="account-info-name">${info.displayName}</h1>
                    <p class="account-info-handle">@${info.handle}</p>
                </div>
                <div class="account-info-bio">
                    ${contentDOM.bio}
                </div>
                <div class="account-info-status">
                    <p>${info.followersCount} ${i18n.followersCount}</p>
                    <p>${info.followsCount} ${i18n.followsCount}</p>
                    <p>${info.postsCount} ${i18n.postsCount}</p>
                </div>
            </div>
            <div class="timeline-list">
                ${contentDOM.posts}
            </div>
        </div>`;

        webviewLayout(
            {
                webviewView,
                extensionUri: this.extensionUri,
            },
            content,
            {
                title: 'Bluesky Account',
            }
        );
    }
}
