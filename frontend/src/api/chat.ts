// Mock implementation. Backend team: replace with api<T>('/chat/sessions/...') from ./client.

export interface ChatMessage {
  who: 'bot' | 'usr'
  text: string
}

export const CHAT_SUGGESTIONS = [
  'Find campsites near Da Lat.',
  'I want a campsite near a lake.',
  'Find a campsite suitable for 10 people.',
  'Show me campsites with BBQ facilities.',
  'Find campsites with mountain views.',
  'Find a campsite suitable for families.',
]

/** First assistant message of every new session. */
export const CHAT_INTRO: ChatMessage = {
  who: 'bot',
  text: 'Chao ban! I am the VietCamp assistant.\nTell me where you want to camp, how many people, your budget per night and what facilities you need. I only recommend campsites that exist in the VietCamp directory.',
}

export async function getChatIntro(): Promise<ChatMessage[]> {
  return [CHAT_INTRO]
}
