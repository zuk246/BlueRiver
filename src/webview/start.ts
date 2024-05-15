import * as vscode from 'vscode';
import Bluesky from '../bluesky';
import { FeedViewPost } from '@atproto/api/dist/client/types/app/bsky/feed/defs';
import { ViewImage } from '@atproto/api/dist/client/types/app/bsky/embed/images';
import { ViewExternal } from '@atproto/api/dist/client/types/app/bsky/embed/external';
import icons from '../components/icons';
import getRelativeTime from '../features/getRelativeTime';

export class StartView {
    constructor(private extensionUri: vscode.Uri) {}

    public async resolveWebviewView(webviewView: vscode.WebviewPanel) {
        webviewView.webview.options = {};

        const styleUri = webviewView.webview.asWebviewUri(
            vscode.Uri.joinPath(this.extensionUri, 'src', 'media', 'style.css')
        );

        const bluesky = new Bluesky();
        await bluesky.login();

        const timeline = await bluesky.timeline();

        if (!timeline) {
            return;
        }

        const cards = timeline
            .map((item) => {
                return this.getWebviewPostCard(item);
            })
            .join(' ');

        webviewView.webview.html = `
        <!DOCTYPE html>
        <html lang="ja">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Bluesky Timeline</title>
                <link rel="stylesheet" href="${styleUri}">
            </head>
            <body>
                <div class="head">
                    <h1 class="title">Following Timeline</h1>
                    <p class="subtitle">List of posts by users you follow</p>
                </div>
                <ul class="timeline-list">
                    ${cards}
                </ul>
            </body> 
        </html>
        `;
    }

    private getWebviewPostCard(item: FeedViewPost) {
        const relativeTime = getRelativeTime(item.post.indexedAt);

        const external = item.post.embed?.external as
            | ViewExternal
            | undefined
            | null;
        const images = item.post.embed?.images as
            | ViewImage[]
            | undefined
            | null;

        let embed = ``;
        const likeIcon = icons('like', 16);
        const repostIcon = icons('repost', 16);
        const replyIcon = icons('reply', 16);

        if (external) {
            const url = new URL(external.uri).hostname;
            embed = `
                <div class="link-card">
                    <a href="${external.uri}" class="link-card-a">
                        <img src="${external.thumb}" alt="external" width="full" class="link-card-img" />
                        <p class="link-card-url">${url}</p>
                        <p class="link-card-title">${external.title}</p>
                    </a>
                </div>
            `;
        }

        if (images) {
            embed = `
                <div class="images-card">
                    ${images
                        .map(
                            (image) =>
                                `<img src="${image.thumb}" width="full" class="image-item" />`
                        )
                        .join('')}
                </div>
            `;
        }

        return `
        <li class="timeline-item">
            <div class="timeline-item-first">
                <img src="${
                    item.post.author.avatar
                }" alt="avatar" width="40" height="40" class="avatar-image" />
            </div>
            <div class="timeline-item-second">
                <div class="timeline-item-detail">
                    <p>${item.post.author.displayName}</p>
                    <div class="timeline-item-detail-post">
                        <p>
                            @${item.post.author.handle}
                        </p>
                        <p>
                            ${relativeTime}
                        </p>
                    </div>
                </div>
                <div class="timeline-item-content">
                    ${(
                        item.post.record as {
                            text?: string;
                        }
                    )?.text
                        ?.split('\n')
                        .map((line) => `<p>${line}</p>`)
                        .join('')}
                </div>
                ${embed}
                <div class="timeline-item-status-counter">
                    <div class="timeline-item-status-counter-item">
                        ${replyIcon}
                        <p>
                            ${item.post.replyCount}
                        </p>
                    </div>
                    <div class="timeline-item-status-counter-item">
                        ${repostIcon}
                        <p>
                            ${item.post.repostCount}
                        </p>
                    </div>
                    <div class="timeline-item-status-counter-item">
                        ${likeIcon}
                        <p>
                            ${item.post.likeCount}
                        </p>
                    </div>
                </div>
            </div>
        </li>`;
    }
}
