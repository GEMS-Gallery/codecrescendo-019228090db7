import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Answer {
  'id' : AnswerId,
  'content' : string,
  'authorId' : UserId,
  'votes' : bigint,
  'createdAt' : Time,
  'questionId' : QuestionId,
}
export type AnswerId = bigint;
export interface Question {
  'id' : QuestionId,
  'title' : string,
  'content' : string,
  'authorId' : UserId,
  'votes' : bigint,
  'createdAt' : Time,
}
export type QuestionId = bigint;
export type Time = bigint;
export interface User {
  'id' : UserId,
  'username' : string,
  'reputation' : bigint,
}
export type UserId = Principal;
export interface _SERVICE {
  'answerQuestion' : ActorMethod<[QuestionId, string], [] | [AnswerId]>,
  'askQuestion' : ActorMethod<[string, string], QuestionId>,
  'getAllQuestions' : ActorMethod<[], Array<Question>>,
  'getAnswer' : ActorMethod<[AnswerId], [] | [Answer]>,
  'getAnswersForQuestion' : ActorMethod<[QuestionId], Array<Answer>>,
  'getQuestion' : ActorMethod<[QuestionId], [] | [Question]>,
  'getUser' : ActorMethod<[UserId], [] | [User]>,
  'register' : ActorMethod<[string], boolean>,
  'voteAnswer' : ActorMethod<[AnswerId, boolean], boolean>,
  'voteQuestion' : ActorMethod<[QuestionId, boolean], boolean>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
