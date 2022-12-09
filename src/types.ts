import { type Role } from 'chatgpt'
import { type Client as TwitterClient } from 'twitter-api-sdk'
import { type TwitterApiv1 } from 'twitter-api-v2'
import { type AsyncReturnType } from 'type-fest'

export { TwitterClient }
export { TwitterApiv1 as TwitterClientV1 }

export interface Config {
  accessToken?: string
  refreshToken?: string
  sinceMentionId?: string
}

export interface ChatGPTInteraction {
  role?: Role

  prompt: string
  promptTweetId: string
  promptUserId: string
  promptUsername: string
  promptUrl?: string

  response?: string
  responseTweetIds?: string[]
  responseMediaId?: string
  responseUrl?: string

  chatgptConversationId?: string
  chatgptParentMessageId?: string
  chatgptMessageId?: string

  error?: string
  isErrorFinal?: boolean

  priorityScore?: number
  numFollowers?: number
  isReply?: boolean
}

export interface ChatGPTSession {
  interactions: ChatGPTInteraction[]
  isRateLimited: boolean
  isRateLimitedTwitter: boolean
  isExpiredAuth: boolean
  isExpiredAuthTwitter: boolean
  sinceMentionId?: string
}

export interface ChatGPTResponse {
  conversationId?: string
  messageId?: string
  response: string
}

type Unpacked<T> = T extends (infer U)[] ? U : T

export type Tweet = Unpacked<
  AsyncReturnType<TwitterClient['tweets']['findTweetsById']>['data']
>
export type TwitterUser = AsyncReturnType<
  TwitterClient['users']['findMyUser']
>['data']
export type CreatedTweet = AsyncReturnType<
  TwitterClient['tweets']['createTweet']
>['data']

export type TweetsQueryOptions = Pick<
  Parameters<TwitterClient['tweets']['findTweetsById']>[0],
  'expansions' | 'tweet.fields' | 'user.fields'
>

export type TwitterUserIdMentionsQueryOptions = Parameters<
  TwitterClient['tweets']['usersIdMentions']
>[1]

export type TweetMention = Partial<Tweet> & {
  prompt?: string
  numMentions?: number
  priorityScore?: number
  numFollowers?: number
  promptUrl?: string
  isReply?: boolean
}

export type TweetMentionBatch = {
  mentions: TweetMention[]
  users: Record<string, Partial<TwitterUser>>
  tweets: Record<string, TweetMention>
  minSinceMentionId: string
  sinceMentionId: string
  numMentionsPostponed: number
}

export type TweetMentionResult = {
  mentions: TweetMention[]
  users: Record<string, Partial<TwitterUser>>
  tweets: Record<string, TweetMention>
  sinceMentionId: string
}

export type ChatErrorType =
  | 'unknown'
  | 'timeout'
  | 'twitter:auth'
  | 'twitter:duplicate'
  | 'twitter:forbidden'
  | 'twitter:rate-limit'

export class ChatError extends Error {
  isFinal: boolean = false
  type?: ChatErrorType = 'unknown'
}

export type TweetMode = 'image' | 'thread'
