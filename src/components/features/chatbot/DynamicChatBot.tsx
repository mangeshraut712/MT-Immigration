'use client';

import dynamic from 'next/dynamic';

const ChatBot = dynamic(() => import('./ChatBot').then((mod) => mod.ChatBot), {
    ssr: false,
});

export function DynamicChatBot() {
    return <ChatBot />;
}
