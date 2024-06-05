import * as vscode from 'vscode';
import Bluesky from '../bluesky';

interface PostItem extends vscode.QuickPickItem {
    uri: string;
    cid: string;
}

export default async function likeCommand(bluesky: Bluesky) {
    const timeline = await bluesky.timeline();

    if (!timeline) {
        return;
    }

    const items: PostItem[] = timeline.map((post) => ({
        label: `${(post.post.record as { text?: string })?.text
            ?.split('\n')
            .join(' ')}`,
        description: post.post.author.handle,
        uri: post.post.uri,
        cid: post.post.cid,
        iconPath: post.post.viewer?.like
            ? new vscode.ThemeIcon('heart')
            : undefined,
    }));

    const selected = await vscode.window.showQuickPick(items);

    if (!selected) {
        return;
    }

    await bluesky.like(selected.uri, selected.cid).then(() => {
        vscode.window.showInformationMessage(
            `Liked post by ${selected.description}`
        );
    });
}
