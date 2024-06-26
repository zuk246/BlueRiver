import { FeedViewPost } from '@atproto/api/dist/client/types/app/bsky/feed/defs';
import { ViewExternal } from '@atproto/api/dist/client/types/app/bsky/embed/external';
import { ViewImage } from '@atproto/api/dist/client/types/app/bsky/embed/images';
import icons, { icons_svg } from './icons';
import getRelativeTime from '../../utils/getRelativeTime';
import { locale } from '../../locale';

export default function getPostCardWebView(item: FeedViewPost) {
    const relativeTime = getRelativeTime(item.post.indexedAt);

    const external = item.post.embed?.external as
        | ViewExternal
        | undefined
        | null;
    const images = item.post.embed?.images as ViewImage[] | undefined | null;

    let embed = ``;
    const likeIcon = icons('like', 16);
    const repostIcon = icons('repost', 16);
    const replyIcon = icons('reply', 16);
    const reasonType = item.reason && item.reason.$type;
    let reason: string = '';
    let show: boolean = true;

    switch (reasonType) {
        case 'app.bsky.feed.defs#reasonRepost':
            const text = locale('app-timeline-repost');
            const icon = icons('repost', 16);
            reason = `
            <div class="timeline-item-reason-repost">
                ${icon} 
                <p>
                    ${/* @ts-ignore */ ''}
                    ${item.reason.by?.displayName} ${text}
                </p>
            </div>`;
            break;
    }

    if (external) {
        const url = new URL(external.uri).hostname;
        embed = `
            <div class="link-card">
                <a href="${external.uri}" class="link-card-a">
                    <img src="${external.thumb}" alt="external" width="full" class="link-card-img" />
                    <div class="link-card-text">
                        <p class="link-card-url">${url}</p>
                        <p class="link-card-title">${external.title}</p>
                    </div>
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

    if (!show) {
        return;
    }

    return `
    <li class="timeline-item">
        <div class="timeline-item-first">
            <img src="${
                item.post.author.avatar
            }" alt="avatar" width="40" height="40" class="avatar-image" />
        </div>
        <div class="timeline-item-second">
            ${reason}
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
                <div class="timeline-item-status-counter-item ${
                    !!item.post.viewer.repost &&
                    'timeline-item-status-counter-item-repost-active'
                }">
                    ${repostIcon}
                    <p>
                        ${item.post.repostCount}
                    </p>
                </div>
                <div class="timeline-item-status-counter-item ${
                    !!item.post.viewer.like &&
                    'timeline-item-status-counter-item-like-active'
                }">
                    ${likeIcon}
                    <p>
                        ${item.post.likeCount}
                    </p>
                </div>
            </div>
        </div>
    </li>`;
}
