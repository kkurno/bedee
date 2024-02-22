export type ArrayElementType<A extends any[]> = A extends (infer ElementType)[] ? ElementType : A;
