import * as vscode from 'vscode';
import Bluesky from '../../bluesky';
import webviewLayout from '../layout';
import getPostCardWebView from '../components/postCard';

export class TimelineView {
    constructor(private extensionUri: vscode.Uri, private bluesky: Bluesky) {}

    public async resolveWebviewView(webviewView: vscode.WebviewPanel) {
        let content = ``;

        const timeline = await this.bluesky.timeline();

        if (!timeline) {
            return;
        }

        const cards = timeline
            .map((item) => getPostCardWebView(item))
            .join(' ');

        content = `
        <div class="timeline-list">
            ${cards}
        </div>`;

        webviewLayout(
            {
                webviewView,
                extensionUri: this.extensionUri,
            },
            content,
            {
                title: 'Bluesky Timeline',
                scripts: ['src', 'webview', 'timeline', 'script.js'],
            }
        );
    }
}
