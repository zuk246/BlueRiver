import * as vscode from 'vscode';
import Bluesky from '../bluesky';
import getPostCardWebView from '../components/postCard';

export class TimelineView {
    constructor(private extensionUri: vscode.Uri) {}

    public async resolveWebviewView(webviewView: vscode.WebviewPanel) {
        webviewView.webview.options = {};

        const styleUri = webviewView.webview.asWebviewUri(
            vscode.Uri.joinPath(this.extensionUri, 'media', 'style.css')
        );

        const bluesky = new Bluesky();
        await bluesky.login();

        const timeline = await bluesky.timeline();

        if (!timeline) {
            return;
        }

        const cards = timeline
            .map((item) => {
                return getPostCardWebView(item);
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
}
