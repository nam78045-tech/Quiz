export interface Subject {
  id: string;
  name: string;
  createdBy: string;
  createdAt: number;
}

export interface Question {
  id: string;
  subjectId: string;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  isNoted?: boolean;
  createdBy: string;
  createdAt: number;
  updatedAt?: number;
}

export interface QuizResult {
  total: number;
  score: number;
  wrongQuestions: Question[];
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}
