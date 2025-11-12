
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Users
 * 
 */
export type Users = $Result.DefaultSelection<Prisma.$UsersPayload>
/**
 * Model EKYCVerifications
 * 
 */
export type EKYCVerifications = $Result.DefaultSelection<Prisma.$EKYCVerificationsPayload>
/**
 * Model Bonds
 * 
 */
export type Bonds = $Result.DefaultSelection<Prisma.$BondsPayload>
/**
 * Model Events
 * 
 */
export type Events = $Result.DefaultSelection<Prisma.$EventsPayload>
/**
 * Model Subscriptions
 * 
 */
export type Subscriptions = $Result.DefaultSelection<Prisma.$SubscriptionsPayload>
/**
 * Model Transactions
 * 
 */
export type Transactions = $Result.DefaultSelection<Prisma.$TransactionsPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const Role: {
  admin: 'admin',
  user: 'user'
};

export type Role = (typeof Role)[keyof typeof Role]


export const Status: {
  open: 'open',
  closed: 'closed'
};

export type Status = (typeof Status)[keyof typeof Status]


export const Type: {
  subscription: 'subscription',
  transfer: 'transfer',
  maturity: 'maturity'
};

export type Type = (typeof Type)[keyof typeof Type]


export const BondType: {
  government_Bond: 'government_Bond',
  corporate_Bond: 'corporate_Bond',
  green_Bond: 'green_Bond',
  development_Bond: 'development_Bond',
  domestic_Bond: 'domestic_Bond'
};

export type BondType = (typeof BondType)[keyof typeof BondType]


export const Market: {
  current: 'current',
  resale: 'resale'
};

export type Market = (typeof Market)[keyof typeof Market]


export const KYCStatus: {
  pending: 'pending',
  verified: 'verified',
  rejected: 'rejected',
  error: 'error'
};

export type KYCStatus = (typeof KYCStatus)[keyof typeof KYCStatus]

}

export type Role = $Enums.Role

export const Role: typeof $Enums.Role

export type Status = $Enums.Status

export const Status: typeof $Enums.Status

export type Type = $Enums.Type

export const Type: typeof $Enums.Type

export type BondType = $Enums.BondType

export const BondType: typeof $Enums.BondType

export type Market = $Enums.Market

export const Market: typeof $Enums.Market

export type KYCStatus = $Enums.KYCStatus

export const KYCStatus: typeof $Enums.KYCStatus

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.users.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.users.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.users`: Exposes CRUD operations for the **Users** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.users.findMany()
    * ```
    */
  get users(): Prisma.UsersDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.eKYCVerifications`: Exposes CRUD operations for the **EKYCVerifications** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more EKYCVerifications
    * const eKYCVerifications = await prisma.eKYCVerifications.findMany()
    * ```
    */
  get eKYCVerifications(): Prisma.EKYCVerificationsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.bonds`: Exposes CRUD operations for the **Bonds** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Bonds
    * const bonds = await prisma.bonds.findMany()
    * ```
    */
  get bonds(): Prisma.BondsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.events`: Exposes CRUD operations for the **Events** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Events
    * const events = await prisma.events.findMany()
    * ```
    */
  get events(): Prisma.EventsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.subscriptions`: Exposes CRUD operations for the **Subscriptions** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Subscriptions
    * const subscriptions = await prisma.subscriptions.findMany()
    * ```
    */
  get subscriptions(): Prisma.SubscriptionsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.transactions`: Exposes CRUD operations for the **Transactions** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Transactions
    * const transactions = await prisma.transactions.findMany()
    * ```
    */
  get transactions(): Prisma.TransactionsDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.19.0
   * Query Engine version: 2ba551f319ab1df4bc874a89965d8b3641056773
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Users: 'Users',
    EKYCVerifications: 'EKYCVerifications',
    Bonds: 'Bonds',
    Events: 'Events',
    Subscriptions: 'Subscriptions',
    Transactions: 'Transactions'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "users" | "eKYCVerifications" | "bonds" | "events" | "subscriptions" | "transactions"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Users: {
        payload: Prisma.$UsersPayload<ExtArgs>
        fields: Prisma.UsersFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UsersFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsersPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UsersFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsersPayload>
          }
          findFirst: {
            args: Prisma.UsersFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsersPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UsersFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsersPayload>
          }
          findMany: {
            args: Prisma.UsersFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsersPayload>[]
          }
          create: {
            args: Prisma.UsersCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsersPayload>
          }
          createMany: {
            args: Prisma.UsersCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UsersCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsersPayload>[]
          }
          delete: {
            args: Prisma.UsersDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsersPayload>
          }
          update: {
            args: Prisma.UsersUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsersPayload>
          }
          deleteMany: {
            args: Prisma.UsersDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UsersUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UsersUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsersPayload>[]
          }
          upsert: {
            args: Prisma.UsersUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsersPayload>
          }
          aggregate: {
            args: Prisma.UsersAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUsers>
          }
          groupBy: {
            args: Prisma.UsersGroupByArgs<ExtArgs>
            result: $Utils.Optional<UsersGroupByOutputType>[]
          }
          count: {
            args: Prisma.UsersCountArgs<ExtArgs>
            result: $Utils.Optional<UsersCountAggregateOutputType> | number
          }
        }
      }
      EKYCVerifications: {
        payload: Prisma.$EKYCVerificationsPayload<ExtArgs>
        fields: Prisma.EKYCVerificationsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EKYCVerificationsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EKYCVerificationsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EKYCVerificationsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EKYCVerificationsPayload>
          }
          findFirst: {
            args: Prisma.EKYCVerificationsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EKYCVerificationsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EKYCVerificationsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EKYCVerificationsPayload>
          }
          findMany: {
            args: Prisma.EKYCVerificationsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EKYCVerificationsPayload>[]
          }
          create: {
            args: Prisma.EKYCVerificationsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EKYCVerificationsPayload>
          }
          createMany: {
            args: Prisma.EKYCVerificationsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EKYCVerificationsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EKYCVerificationsPayload>[]
          }
          delete: {
            args: Prisma.EKYCVerificationsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EKYCVerificationsPayload>
          }
          update: {
            args: Prisma.EKYCVerificationsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EKYCVerificationsPayload>
          }
          deleteMany: {
            args: Prisma.EKYCVerificationsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EKYCVerificationsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.EKYCVerificationsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EKYCVerificationsPayload>[]
          }
          upsert: {
            args: Prisma.EKYCVerificationsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EKYCVerificationsPayload>
          }
          aggregate: {
            args: Prisma.EKYCVerificationsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEKYCVerifications>
          }
          groupBy: {
            args: Prisma.EKYCVerificationsGroupByArgs<ExtArgs>
            result: $Utils.Optional<EKYCVerificationsGroupByOutputType>[]
          }
          count: {
            args: Prisma.EKYCVerificationsCountArgs<ExtArgs>
            result: $Utils.Optional<EKYCVerificationsCountAggregateOutputType> | number
          }
        }
      }
      Bonds: {
        payload: Prisma.$BondsPayload<ExtArgs>
        fields: Prisma.BondsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BondsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BondsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BondsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BondsPayload>
          }
          findFirst: {
            args: Prisma.BondsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BondsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BondsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BondsPayload>
          }
          findMany: {
            args: Prisma.BondsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BondsPayload>[]
          }
          create: {
            args: Prisma.BondsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BondsPayload>
          }
          createMany: {
            args: Prisma.BondsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BondsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BondsPayload>[]
          }
          delete: {
            args: Prisma.BondsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BondsPayload>
          }
          update: {
            args: Prisma.BondsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BondsPayload>
          }
          deleteMany: {
            args: Prisma.BondsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BondsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.BondsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BondsPayload>[]
          }
          upsert: {
            args: Prisma.BondsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BondsPayload>
          }
          aggregate: {
            args: Prisma.BondsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBonds>
          }
          groupBy: {
            args: Prisma.BondsGroupByArgs<ExtArgs>
            result: $Utils.Optional<BondsGroupByOutputType>[]
          }
          count: {
            args: Prisma.BondsCountArgs<ExtArgs>
            result: $Utils.Optional<BondsCountAggregateOutputType> | number
          }
        }
      }
      Events: {
        payload: Prisma.$EventsPayload<ExtArgs>
        fields: Prisma.EventsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EventsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EventsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventsPayload>
          }
          findFirst: {
            args: Prisma.EventsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EventsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventsPayload>
          }
          findMany: {
            args: Prisma.EventsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventsPayload>[]
          }
          create: {
            args: Prisma.EventsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventsPayload>
          }
          createMany: {
            args: Prisma.EventsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EventsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventsPayload>[]
          }
          delete: {
            args: Prisma.EventsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventsPayload>
          }
          update: {
            args: Prisma.EventsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventsPayload>
          }
          deleteMany: {
            args: Prisma.EventsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EventsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.EventsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventsPayload>[]
          }
          upsert: {
            args: Prisma.EventsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventsPayload>
          }
          aggregate: {
            args: Prisma.EventsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEvents>
          }
          groupBy: {
            args: Prisma.EventsGroupByArgs<ExtArgs>
            result: $Utils.Optional<EventsGroupByOutputType>[]
          }
          count: {
            args: Prisma.EventsCountArgs<ExtArgs>
            result: $Utils.Optional<EventsCountAggregateOutputType> | number
          }
        }
      }
      Subscriptions: {
        payload: Prisma.$SubscriptionsPayload<ExtArgs>
        fields: Prisma.SubscriptionsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SubscriptionsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SubscriptionsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionsPayload>
          }
          findFirst: {
            args: Prisma.SubscriptionsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SubscriptionsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionsPayload>
          }
          findMany: {
            args: Prisma.SubscriptionsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionsPayload>[]
          }
          create: {
            args: Prisma.SubscriptionsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionsPayload>
          }
          createMany: {
            args: Prisma.SubscriptionsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SubscriptionsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionsPayload>[]
          }
          delete: {
            args: Prisma.SubscriptionsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionsPayload>
          }
          update: {
            args: Prisma.SubscriptionsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionsPayload>
          }
          deleteMany: {
            args: Prisma.SubscriptionsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SubscriptionsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SubscriptionsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionsPayload>[]
          }
          upsert: {
            args: Prisma.SubscriptionsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionsPayload>
          }
          aggregate: {
            args: Prisma.SubscriptionsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSubscriptions>
          }
          groupBy: {
            args: Prisma.SubscriptionsGroupByArgs<ExtArgs>
            result: $Utils.Optional<SubscriptionsGroupByOutputType>[]
          }
          count: {
            args: Prisma.SubscriptionsCountArgs<ExtArgs>
            result: $Utils.Optional<SubscriptionsCountAggregateOutputType> | number
          }
        }
      }
      Transactions: {
        payload: Prisma.$TransactionsPayload<ExtArgs>
        fields: Prisma.TransactionsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TransactionsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TransactionsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionsPayload>
          }
          findFirst: {
            args: Prisma.TransactionsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TransactionsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionsPayload>
          }
          findMany: {
            args: Prisma.TransactionsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionsPayload>[]
          }
          create: {
            args: Prisma.TransactionsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionsPayload>
          }
          createMany: {
            args: Prisma.TransactionsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TransactionsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionsPayload>[]
          }
          delete: {
            args: Prisma.TransactionsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionsPayload>
          }
          update: {
            args: Prisma.TransactionsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionsPayload>
          }
          deleteMany: {
            args: Prisma.TransactionsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TransactionsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TransactionsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionsPayload>[]
          }
          upsert: {
            args: Prisma.TransactionsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionsPayload>
          }
          aggregate: {
            args: Prisma.TransactionsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTransactions>
          }
          groupBy: {
            args: Prisma.TransactionsGroupByArgs<ExtArgs>
            result: $Utils.Optional<TransactionsGroupByOutputType>[]
          }
          count: {
            args: Prisma.TransactionsCountArgs<ExtArgs>
            result: $Utils.Optional<TransactionsCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    users?: UsersOmit
    eKYCVerifications?: EKYCVerificationsOmit
    bonds?: BondsOmit
    events?: EventsOmit
    subscriptions?: SubscriptionsOmit
    transactions?: TransactionsOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UsersCountOutputType
   */

  export type UsersCountOutputType = {
    ekyc: number
    subscriptions: number
    events: number
    transactionsFrom: number
    transactionsTo: number
  }

  export type UsersCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    ekyc?: boolean | UsersCountOutputTypeCountEkycArgs
    subscriptions?: boolean | UsersCountOutputTypeCountSubscriptionsArgs
    events?: boolean | UsersCountOutputTypeCountEventsArgs
    transactionsFrom?: boolean | UsersCountOutputTypeCountTransactionsFromArgs
    transactionsTo?: boolean | UsersCountOutputTypeCountTransactionsToArgs
  }

  // Custom InputTypes
  /**
   * UsersCountOutputType without action
   */
  export type UsersCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsersCountOutputType
     */
    select?: UsersCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UsersCountOutputType without action
   */
  export type UsersCountOutputTypeCountEkycArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EKYCVerificationsWhereInput
  }

  /**
   * UsersCountOutputType without action
   */
  export type UsersCountOutputTypeCountSubscriptionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SubscriptionsWhereInput
  }

  /**
   * UsersCountOutputType without action
   */
  export type UsersCountOutputTypeCountEventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EventsWhereInput
  }

  /**
   * UsersCountOutputType without action
   */
  export type UsersCountOutputTypeCountTransactionsFromArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TransactionsWhereInput
  }

  /**
   * UsersCountOutputType without action
   */
  export type UsersCountOutputTypeCountTransactionsToArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TransactionsWhereInput
  }


  /**
   * Count Type BondsCountOutputType
   */

  export type BondsCountOutputType = {
    subscriptions: number
    events: number
    transactions: number
  }

  export type BondsCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    subscriptions?: boolean | BondsCountOutputTypeCountSubscriptionsArgs
    events?: boolean | BondsCountOutputTypeCountEventsArgs
    transactions?: boolean | BondsCountOutputTypeCountTransactionsArgs
  }

  // Custom InputTypes
  /**
   * BondsCountOutputType without action
   */
  export type BondsCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BondsCountOutputType
     */
    select?: BondsCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * BondsCountOutputType without action
   */
  export type BondsCountOutputTypeCountSubscriptionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SubscriptionsWhereInput
  }

  /**
   * BondsCountOutputType without action
   */
  export type BondsCountOutputTypeCountEventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EventsWhereInput
  }

  /**
   * BondsCountOutputType without action
   */
  export type BondsCountOutputTypeCountTransactionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TransactionsWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Users
   */

  export type AggregateUsers = {
    _count: UsersCountAggregateOutputType | null
    _avg: UsersAvgAggregateOutputType | null
    _sum: UsersSumAggregateOutputType | null
    _min: UsersMinAggregateOutputType | null
    _max: UsersMaxAggregateOutputType | null
  }

  export type UsersAvgAggregateOutputType = {
    national_id: number | null
  }

  export type UsersSumAggregateOutputType = {
    national_id: bigint | null
  }

  export type UsersMinAggregateOutputType = {
    id: string | null
    name: string | null
    national_id: bigint | null
    wallet_address: string | null
    salt: string | null
    email: string | null
    date_of_birth: Date | null
    password: string | null
    role: $Enums.Role | null
    hashed_mnemonic: string | null
    created_at: Date | null
    kyc_status: $Enums.KYCStatus | null
  }

  export type UsersMaxAggregateOutputType = {
    id: string | null
    name: string | null
    national_id: bigint | null
    wallet_address: string | null
    salt: string | null
    email: string | null
    date_of_birth: Date | null
    password: string | null
    role: $Enums.Role | null
    hashed_mnemonic: string | null
    created_at: Date | null
    kyc_status: $Enums.KYCStatus | null
  }

  export type UsersCountAggregateOutputType = {
    id: number
    name: number
    national_id: number
    wallet_address: number
    salt: number
    email: number
    date_of_birth: number
    password: number
    role: number
    hashed_mnemonic: number
    created_at: number
    kyc_status: number
    _all: number
  }


  export type UsersAvgAggregateInputType = {
    national_id?: true
  }

  export type UsersSumAggregateInputType = {
    national_id?: true
  }

  export type UsersMinAggregateInputType = {
    id?: true
    name?: true
    national_id?: true
    wallet_address?: true
    salt?: true
    email?: true
    date_of_birth?: true
    password?: true
    role?: true
    hashed_mnemonic?: true
    created_at?: true
    kyc_status?: true
  }

  export type UsersMaxAggregateInputType = {
    id?: true
    name?: true
    national_id?: true
    wallet_address?: true
    salt?: true
    email?: true
    date_of_birth?: true
    password?: true
    role?: true
    hashed_mnemonic?: true
    created_at?: true
    kyc_status?: true
  }

  export type UsersCountAggregateInputType = {
    id?: true
    name?: true
    national_id?: true
    wallet_address?: true
    salt?: true
    email?: true
    date_of_birth?: true
    password?: true
    role?: true
    hashed_mnemonic?: true
    created_at?: true
    kyc_status?: true
    _all?: true
  }

  export type UsersAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to aggregate.
     */
    where?: UsersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UsersOrderByWithRelationInput | UsersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UsersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UsersCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UsersAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UsersSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UsersMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UsersMaxAggregateInputType
  }

  export type GetUsersAggregateType<T extends UsersAggregateArgs> = {
        [P in keyof T & keyof AggregateUsers]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUsers[P]>
      : GetScalarType<T[P], AggregateUsers[P]>
  }




  export type UsersGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UsersWhereInput
    orderBy?: UsersOrderByWithAggregationInput | UsersOrderByWithAggregationInput[]
    by: UsersScalarFieldEnum[] | UsersScalarFieldEnum
    having?: UsersScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UsersCountAggregateInputType | true
    _avg?: UsersAvgAggregateInputType
    _sum?: UsersSumAggregateInputType
    _min?: UsersMinAggregateInputType
    _max?: UsersMaxAggregateInputType
  }

  export type UsersGroupByOutputType = {
    id: string
    name: string | null
    national_id: bigint
    wallet_address: string | null
    salt: string
    email: string
    date_of_birth: Date | null
    password: string | null
    role: $Enums.Role
    hashed_mnemonic: string | null
    created_at: Date
    kyc_status: $Enums.KYCStatus
    _count: UsersCountAggregateOutputType | null
    _avg: UsersAvgAggregateOutputType | null
    _sum: UsersSumAggregateOutputType | null
    _min: UsersMinAggregateOutputType | null
    _max: UsersMaxAggregateOutputType | null
  }

  type GetUsersGroupByPayload<T extends UsersGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UsersGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UsersGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UsersGroupByOutputType[P]>
            : GetScalarType<T[P], UsersGroupByOutputType[P]>
        }
      >
    >


  export type UsersSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    national_id?: boolean
    wallet_address?: boolean
    salt?: boolean
    email?: boolean
    date_of_birth?: boolean
    password?: boolean
    role?: boolean
    hashed_mnemonic?: boolean
    created_at?: boolean
    kyc_status?: boolean
    ekyc?: boolean | Users$ekycArgs<ExtArgs>
    subscriptions?: boolean | Users$subscriptionsArgs<ExtArgs>
    events?: boolean | Users$eventsArgs<ExtArgs>
    transactionsFrom?: boolean | Users$transactionsFromArgs<ExtArgs>
    transactionsTo?: boolean | Users$transactionsToArgs<ExtArgs>
    _count?: boolean | UsersCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["users"]>

  export type UsersSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    national_id?: boolean
    wallet_address?: boolean
    salt?: boolean
    email?: boolean
    date_of_birth?: boolean
    password?: boolean
    role?: boolean
    hashed_mnemonic?: boolean
    created_at?: boolean
    kyc_status?: boolean
  }, ExtArgs["result"]["users"]>

  export type UsersSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    national_id?: boolean
    wallet_address?: boolean
    salt?: boolean
    email?: boolean
    date_of_birth?: boolean
    password?: boolean
    role?: boolean
    hashed_mnemonic?: boolean
    created_at?: boolean
    kyc_status?: boolean
  }, ExtArgs["result"]["users"]>

  export type UsersSelectScalar = {
    id?: boolean
    name?: boolean
    national_id?: boolean
    wallet_address?: boolean
    salt?: boolean
    email?: boolean
    date_of_birth?: boolean
    password?: boolean
    role?: boolean
    hashed_mnemonic?: boolean
    created_at?: boolean
    kyc_status?: boolean
  }

  export type UsersOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "national_id" | "wallet_address" | "salt" | "email" | "date_of_birth" | "password" | "role" | "hashed_mnemonic" | "created_at" | "kyc_status", ExtArgs["result"]["users"]>
  export type UsersInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    ekyc?: boolean | Users$ekycArgs<ExtArgs>
    subscriptions?: boolean | Users$subscriptionsArgs<ExtArgs>
    events?: boolean | Users$eventsArgs<ExtArgs>
    transactionsFrom?: boolean | Users$transactionsFromArgs<ExtArgs>
    transactionsTo?: boolean | Users$transactionsToArgs<ExtArgs>
    _count?: boolean | UsersCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UsersIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UsersIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UsersPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Users"
    objects: {
      ekyc: Prisma.$EKYCVerificationsPayload<ExtArgs>[]
      subscriptions: Prisma.$SubscriptionsPayload<ExtArgs>[]
      events: Prisma.$EventsPayload<ExtArgs>[]
      transactionsFrom: Prisma.$TransactionsPayload<ExtArgs>[]
      transactionsTo: Prisma.$TransactionsPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string | null
      national_id: bigint
      wallet_address: string | null
      salt: string
      email: string
      date_of_birth: Date | null
      password: string | null
      role: $Enums.Role
      hashed_mnemonic: string | null
      created_at: Date
      kyc_status: $Enums.KYCStatus
    }, ExtArgs["result"]["users"]>
    composites: {}
  }

  type UsersGetPayload<S extends boolean | null | undefined | UsersDefaultArgs> = $Result.GetResult<Prisma.$UsersPayload, S>

  type UsersCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UsersFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UsersCountAggregateInputType | true
    }

  export interface UsersDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Users'], meta: { name: 'Users' } }
    /**
     * Find zero or one Users that matches the filter.
     * @param {UsersFindUniqueArgs} args - Arguments to find a Users
     * @example
     * // Get one Users
     * const users = await prisma.users.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UsersFindUniqueArgs>(args: SelectSubset<T, UsersFindUniqueArgs<ExtArgs>>): Prisma__UsersClient<$Result.GetResult<Prisma.$UsersPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Users that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UsersFindUniqueOrThrowArgs} args - Arguments to find a Users
     * @example
     * // Get one Users
     * const users = await prisma.users.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UsersFindUniqueOrThrowArgs>(args: SelectSubset<T, UsersFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UsersClient<$Result.GetResult<Prisma.$UsersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsersFindFirstArgs} args - Arguments to find a Users
     * @example
     * // Get one Users
     * const users = await prisma.users.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UsersFindFirstArgs>(args?: SelectSubset<T, UsersFindFirstArgs<ExtArgs>>): Prisma__UsersClient<$Result.GetResult<Prisma.$UsersPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Users that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsersFindFirstOrThrowArgs} args - Arguments to find a Users
     * @example
     * // Get one Users
     * const users = await prisma.users.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UsersFindFirstOrThrowArgs>(args?: SelectSubset<T, UsersFindFirstOrThrowArgs<ExtArgs>>): Prisma__UsersClient<$Result.GetResult<Prisma.$UsersPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsersFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.users.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.users.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const usersWithIdOnly = await prisma.users.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UsersFindManyArgs>(args?: SelectSubset<T, UsersFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UsersPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Users.
     * @param {UsersCreateArgs} args - Arguments to create a Users.
     * @example
     * // Create one Users
     * const Users = await prisma.users.create({
     *   data: {
     *     // ... data to create a Users
     *   }
     * })
     * 
     */
    create<T extends UsersCreateArgs>(args: SelectSubset<T, UsersCreateArgs<ExtArgs>>): Prisma__UsersClient<$Result.GetResult<Prisma.$UsersPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UsersCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const users = await prisma.users.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UsersCreateManyArgs>(args?: SelectSubset<T, UsersCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UsersCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const users = await prisma.users.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const usersWithIdOnly = await prisma.users.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UsersCreateManyAndReturnArgs>(args?: SelectSubset<T, UsersCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UsersPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Users.
     * @param {UsersDeleteArgs} args - Arguments to delete one Users.
     * @example
     * // Delete one Users
     * const Users = await prisma.users.delete({
     *   where: {
     *     // ... filter to delete one Users
     *   }
     * })
     * 
     */
    delete<T extends UsersDeleteArgs>(args: SelectSubset<T, UsersDeleteArgs<ExtArgs>>): Prisma__UsersClient<$Result.GetResult<Prisma.$UsersPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Users.
     * @param {UsersUpdateArgs} args - Arguments to update one Users.
     * @example
     * // Update one Users
     * const users = await prisma.users.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UsersUpdateArgs>(args: SelectSubset<T, UsersUpdateArgs<ExtArgs>>): Prisma__UsersClient<$Result.GetResult<Prisma.$UsersPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UsersDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.users.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UsersDeleteManyArgs>(args?: SelectSubset<T, UsersDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsersUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const users = await prisma.users.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UsersUpdateManyArgs>(args: SelectSubset<T, UsersUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UsersUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const users = await prisma.users.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const usersWithIdOnly = await prisma.users.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UsersUpdateManyAndReturnArgs>(args: SelectSubset<T, UsersUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UsersPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Users.
     * @param {UsersUpsertArgs} args - Arguments to update or create a Users.
     * @example
     * // Update or create a Users
     * const users = await prisma.users.upsert({
     *   create: {
     *     // ... data to create a Users
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Users we want to update
     *   }
     * })
     */
    upsert<T extends UsersUpsertArgs>(args: SelectSubset<T, UsersUpsertArgs<ExtArgs>>): Prisma__UsersClient<$Result.GetResult<Prisma.$UsersPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsersCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.users.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UsersCountArgs>(
      args?: Subset<T, UsersCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UsersCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsersAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UsersAggregateArgs>(args: Subset<T, UsersAggregateArgs>): Prisma.PrismaPromise<GetUsersAggregateType<T>>

    /**
     * Group by Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsersGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UsersGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UsersGroupByArgs['orderBy'] }
        : { orderBy?: UsersGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UsersGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUsersGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Users model
   */
  readonly fields: UsersFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Users.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UsersClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    ekyc<T extends Users$ekycArgs<ExtArgs> = {}>(args?: Subset<T, Users$ekycArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EKYCVerificationsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    subscriptions<T extends Users$subscriptionsArgs<ExtArgs> = {}>(args?: Subset<T, Users$subscriptionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubscriptionsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    events<T extends Users$eventsArgs<ExtArgs> = {}>(args?: Subset<T, Users$eventsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    transactionsFrom<T extends Users$transactionsFromArgs<ExtArgs> = {}>(args?: Subset<T, Users$transactionsFromArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    transactionsTo<T extends Users$transactionsToArgs<ExtArgs> = {}>(args?: Subset<T, Users$transactionsToArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Users model
   */
  interface UsersFieldRefs {
    readonly id: FieldRef<"Users", 'String'>
    readonly name: FieldRef<"Users", 'String'>
    readonly national_id: FieldRef<"Users", 'BigInt'>
    readonly wallet_address: FieldRef<"Users", 'String'>
    readonly salt: FieldRef<"Users", 'String'>
    readonly email: FieldRef<"Users", 'String'>
    readonly date_of_birth: FieldRef<"Users", 'DateTime'>
    readonly password: FieldRef<"Users", 'String'>
    readonly role: FieldRef<"Users", 'Role'>
    readonly hashed_mnemonic: FieldRef<"Users", 'String'>
    readonly created_at: FieldRef<"Users", 'DateTime'>
    readonly kyc_status: FieldRef<"Users", 'KYCStatus'>
  }
    

  // Custom InputTypes
  /**
   * Users findUnique
   */
  export type UsersFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Users
     */
    select?: UsersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Users
     */
    omit?: UsersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsersInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where: UsersWhereUniqueInput
  }

  /**
   * Users findUniqueOrThrow
   */
  export type UsersFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Users
     */
    select?: UsersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Users
     */
    omit?: UsersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsersInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where: UsersWhereUniqueInput
  }

  /**
   * Users findFirst
   */
  export type UsersFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Users
     */
    select?: UsersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Users
     */
    omit?: UsersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsersInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UsersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UsersOrderByWithRelationInput | UsersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UsersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UsersScalarFieldEnum | UsersScalarFieldEnum[]
  }

  /**
   * Users findFirstOrThrow
   */
  export type UsersFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Users
     */
    select?: UsersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Users
     */
    omit?: UsersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsersInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UsersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UsersOrderByWithRelationInput | UsersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UsersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UsersScalarFieldEnum | UsersScalarFieldEnum[]
  }

  /**
   * Users findMany
   */
  export type UsersFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Users
     */
    select?: UsersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Users
     */
    omit?: UsersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsersInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UsersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UsersOrderByWithRelationInput | UsersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UsersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UsersScalarFieldEnum | UsersScalarFieldEnum[]
  }

  /**
   * Users create
   */
  export type UsersCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Users
     */
    select?: UsersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Users
     */
    omit?: UsersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsersInclude<ExtArgs> | null
    /**
     * The data needed to create a Users.
     */
    data: XOR<UsersCreateInput, UsersUncheckedCreateInput>
  }

  /**
   * Users createMany
   */
  export type UsersCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UsersCreateManyInput | UsersCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Users createManyAndReturn
   */
  export type UsersCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Users
     */
    select?: UsersSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Users
     */
    omit?: UsersOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UsersCreateManyInput | UsersCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Users update
   */
  export type UsersUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Users
     */
    select?: UsersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Users
     */
    omit?: UsersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsersInclude<ExtArgs> | null
    /**
     * The data needed to update a Users.
     */
    data: XOR<UsersUpdateInput, UsersUncheckedUpdateInput>
    /**
     * Choose, which Users to update.
     */
    where: UsersWhereUniqueInput
  }

  /**
   * Users updateMany
   */
  export type UsersUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UsersUpdateManyMutationInput, UsersUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UsersWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * Users updateManyAndReturn
   */
  export type UsersUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Users
     */
    select?: UsersSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Users
     */
    omit?: UsersOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UsersUpdateManyMutationInput, UsersUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UsersWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * Users upsert
   */
  export type UsersUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Users
     */
    select?: UsersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Users
     */
    omit?: UsersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsersInclude<ExtArgs> | null
    /**
     * The filter to search for the Users to update in case it exists.
     */
    where: UsersWhereUniqueInput
    /**
     * In case the Users found by the `where` argument doesn't exist, create a new Users with this data.
     */
    create: XOR<UsersCreateInput, UsersUncheckedCreateInput>
    /**
     * In case the Users was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UsersUpdateInput, UsersUncheckedUpdateInput>
  }

  /**
   * Users delete
   */
  export type UsersDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Users
     */
    select?: UsersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Users
     */
    omit?: UsersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsersInclude<ExtArgs> | null
    /**
     * Filter which Users to delete.
     */
    where: UsersWhereUniqueInput
  }

  /**
   * Users deleteMany
   */
  export type UsersDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UsersWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * Users.ekyc
   */
  export type Users$ekycArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EKYCVerifications
     */
    select?: EKYCVerificationsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EKYCVerifications
     */
    omit?: EKYCVerificationsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EKYCVerificationsInclude<ExtArgs> | null
    where?: EKYCVerificationsWhereInput
    orderBy?: EKYCVerificationsOrderByWithRelationInput | EKYCVerificationsOrderByWithRelationInput[]
    cursor?: EKYCVerificationsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EKYCVerificationsScalarFieldEnum | EKYCVerificationsScalarFieldEnum[]
  }

  /**
   * Users.subscriptions
   */
  export type Users$subscriptionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscriptions
     */
    select?: SubscriptionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscriptions
     */
    omit?: SubscriptionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionsInclude<ExtArgs> | null
    where?: SubscriptionsWhereInput
    orderBy?: SubscriptionsOrderByWithRelationInput | SubscriptionsOrderByWithRelationInput[]
    cursor?: SubscriptionsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SubscriptionsScalarFieldEnum | SubscriptionsScalarFieldEnum[]
  }

  /**
   * Users.events
   */
  export type Users$eventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Events
     */
    select?: EventsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Events
     */
    omit?: EventsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventsInclude<ExtArgs> | null
    where?: EventsWhereInput
    orderBy?: EventsOrderByWithRelationInput | EventsOrderByWithRelationInput[]
    cursor?: EventsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EventsScalarFieldEnum | EventsScalarFieldEnum[]
  }

  /**
   * Users.transactionsFrom
   */
  export type Users$transactionsFromArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transactions
     */
    select?: TransactionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transactions
     */
    omit?: TransactionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionsInclude<ExtArgs> | null
    where?: TransactionsWhereInput
    orderBy?: TransactionsOrderByWithRelationInput | TransactionsOrderByWithRelationInput[]
    cursor?: TransactionsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TransactionsScalarFieldEnum | TransactionsScalarFieldEnum[]
  }

  /**
   * Users.transactionsTo
   */
  export type Users$transactionsToArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transactions
     */
    select?: TransactionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transactions
     */
    omit?: TransactionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionsInclude<ExtArgs> | null
    where?: TransactionsWhereInput
    orderBy?: TransactionsOrderByWithRelationInput | TransactionsOrderByWithRelationInput[]
    cursor?: TransactionsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TransactionsScalarFieldEnum | TransactionsScalarFieldEnum[]
  }

  /**
   * Users without action
   */
  export type UsersDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Users
     */
    select?: UsersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Users
     */
    omit?: UsersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsersInclude<ExtArgs> | null
  }


  /**
   * Model EKYCVerifications
   */

  export type AggregateEKYCVerifications = {
    _count: EKYCVerificationsCountAggregateOutputType | null
    _avg: EKYCVerificationsAvgAggregateOutputType | null
    _sum: EKYCVerificationsSumAggregateOutputType | null
    _min: EKYCVerificationsMinAggregateOutputType | null
    _max: EKYCVerificationsMaxAggregateOutputType | null
  }

  export type EKYCVerificationsAvgAggregateOutputType = {
    age: number | null
  }

  export type EKYCVerificationsSumAggregateOutputType = {
    age: number | null
  }

  export type EKYCVerificationsMinAggregateOutputType = {
    id: string | null
    user_id: string | null
    national_id_hash: string | null
    date_of_birth: Date | null
    age: number | null
    custodial_address: string | null
    tx_digest: string | null
    status: $Enums.KYCStatus | null
    reason: string | null
    request_id: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type EKYCVerificationsMaxAggregateOutputType = {
    id: string | null
    user_id: string | null
    national_id_hash: string | null
    date_of_birth: Date | null
    age: number | null
    custodial_address: string | null
    tx_digest: string | null
    status: $Enums.KYCStatus | null
    reason: string | null
    request_id: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type EKYCVerificationsCountAggregateOutputType = {
    id: number
    user_id: number
    national_id_hash: number
    date_of_birth: number
    age: number
    custodial_address: number
    tx_digest: number
    status: number
    reason: number
    request_id: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type EKYCVerificationsAvgAggregateInputType = {
    age?: true
  }

  export type EKYCVerificationsSumAggregateInputType = {
    age?: true
  }

  export type EKYCVerificationsMinAggregateInputType = {
    id?: true
    user_id?: true
    national_id_hash?: true
    date_of_birth?: true
    age?: true
    custodial_address?: true
    tx_digest?: true
    status?: true
    reason?: true
    request_id?: true
    created_at?: true
    updated_at?: true
  }

  export type EKYCVerificationsMaxAggregateInputType = {
    id?: true
    user_id?: true
    national_id_hash?: true
    date_of_birth?: true
    age?: true
    custodial_address?: true
    tx_digest?: true
    status?: true
    reason?: true
    request_id?: true
    created_at?: true
    updated_at?: true
  }

  export type EKYCVerificationsCountAggregateInputType = {
    id?: true
    user_id?: true
    national_id_hash?: true
    date_of_birth?: true
    age?: true
    custodial_address?: true
    tx_digest?: true
    status?: true
    reason?: true
    request_id?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type EKYCVerificationsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EKYCVerifications to aggregate.
     */
    where?: EKYCVerificationsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EKYCVerifications to fetch.
     */
    orderBy?: EKYCVerificationsOrderByWithRelationInput | EKYCVerificationsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EKYCVerificationsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EKYCVerifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EKYCVerifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned EKYCVerifications
    **/
    _count?: true | EKYCVerificationsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: EKYCVerificationsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: EKYCVerificationsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EKYCVerificationsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EKYCVerificationsMaxAggregateInputType
  }

  export type GetEKYCVerificationsAggregateType<T extends EKYCVerificationsAggregateArgs> = {
        [P in keyof T & keyof AggregateEKYCVerifications]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEKYCVerifications[P]>
      : GetScalarType<T[P], AggregateEKYCVerifications[P]>
  }




  export type EKYCVerificationsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EKYCVerificationsWhereInput
    orderBy?: EKYCVerificationsOrderByWithAggregationInput | EKYCVerificationsOrderByWithAggregationInput[]
    by: EKYCVerificationsScalarFieldEnum[] | EKYCVerificationsScalarFieldEnum
    having?: EKYCVerificationsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EKYCVerificationsCountAggregateInputType | true
    _avg?: EKYCVerificationsAvgAggregateInputType
    _sum?: EKYCVerificationsSumAggregateInputType
    _min?: EKYCVerificationsMinAggregateInputType
    _max?: EKYCVerificationsMaxAggregateInputType
  }

  export type EKYCVerificationsGroupByOutputType = {
    id: string
    user_id: string
    national_id_hash: string
    date_of_birth: Date
    age: number | null
    custodial_address: string
    tx_digest: string | null
    status: $Enums.KYCStatus
    reason: string | null
    request_id: string | null
    created_at: Date
    updated_at: Date
    _count: EKYCVerificationsCountAggregateOutputType | null
    _avg: EKYCVerificationsAvgAggregateOutputType | null
    _sum: EKYCVerificationsSumAggregateOutputType | null
    _min: EKYCVerificationsMinAggregateOutputType | null
    _max: EKYCVerificationsMaxAggregateOutputType | null
  }

  type GetEKYCVerificationsGroupByPayload<T extends EKYCVerificationsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EKYCVerificationsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EKYCVerificationsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EKYCVerificationsGroupByOutputType[P]>
            : GetScalarType<T[P], EKYCVerificationsGroupByOutputType[P]>
        }
      >
    >


  export type EKYCVerificationsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    national_id_hash?: boolean
    date_of_birth?: boolean
    age?: boolean
    custodial_address?: boolean
    tx_digest?: boolean
    status?: boolean
    reason?: boolean
    request_id?: boolean
    created_at?: boolean
    updated_at?: boolean
    user?: boolean | UsersDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["eKYCVerifications"]>

  export type EKYCVerificationsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    national_id_hash?: boolean
    date_of_birth?: boolean
    age?: boolean
    custodial_address?: boolean
    tx_digest?: boolean
    status?: boolean
    reason?: boolean
    request_id?: boolean
    created_at?: boolean
    updated_at?: boolean
    user?: boolean | UsersDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["eKYCVerifications"]>

  export type EKYCVerificationsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    national_id_hash?: boolean
    date_of_birth?: boolean
    age?: boolean
    custodial_address?: boolean
    tx_digest?: boolean
    status?: boolean
    reason?: boolean
    request_id?: boolean
    created_at?: boolean
    updated_at?: boolean
    user?: boolean | UsersDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["eKYCVerifications"]>

  export type EKYCVerificationsSelectScalar = {
    id?: boolean
    user_id?: boolean
    national_id_hash?: boolean
    date_of_birth?: boolean
    age?: boolean
    custodial_address?: boolean
    tx_digest?: boolean
    status?: boolean
    reason?: boolean
    request_id?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type EKYCVerificationsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "user_id" | "national_id_hash" | "date_of_birth" | "age" | "custodial_address" | "tx_digest" | "status" | "reason" | "request_id" | "created_at" | "updated_at", ExtArgs["result"]["eKYCVerifications"]>
  export type EKYCVerificationsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UsersDefaultArgs<ExtArgs>
  }
  export type EKYCVerificationsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UsersDefaultArgs<ExtArgs>
  }
  export type EKYCVerificationsIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UsersDefaultArgs<ExtArgs>
  }

  export type $EKYCVerificationsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "EKYCVerifications"
    objects: {
      user: Prisma.$UsersPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      user_id: string
      national_id_hash: string
      date_of_birth: Date
      age: number | null
      custodial_address: string
      tx_digest: string | null
      status: $Enums.KYCStatus
      reason: string | null
      request_id: string | null
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["eKYCVerifications"]>
    composites: {}
  }

  type EKYCVerificationsGetPayload<S extends boolean | null | undefined | EKYCVerificationsDefaultArgs> = $Result.GetResult<Prisma.$EKYCVerificationsPayload, S>

  type EKYCVerificationsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<EKYCVerificationsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: EKYCVerificationsCountAggregateInputType | true
    }

  export interface EKYCVerificationsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['EKYCVerifications'], meta: { name: 'EKYCVerifications' } }
    /**
     * Find zero or one EKYCVerifications that matches the filter.
     * @param {EKYCVerificationsFindUniqueArgs} args - Arguments to find a EKYCVerifications
     * @example
     * // Get one EKYCVerifications
     * const eKYCVerifications = await prisma.eKYCVerifications.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EKYCVerificationsFindUniqueArgs>(args: SelectSubset<T, EKYCVerificationsFindUniqueArgs<ExtArgs>>): Prisma__EKYCVerificationsClient<$Result.GetResult<Prisma.$EKYCVerificationsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one EKYCVerifications that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {EKYCVerificationsFindUniqueOrThrowArgs} args - Arguments to find a EKYCVerifications
     * @example
     * // Get one EKYCVerifications
     * const eKYCVerifications = await prisma.eKYCVerifications.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EKYCVerificationsFindUniqueOrThrowArgs>(args: SelectSubset<T, EKYCVerificationsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EKYCVerificationsClient<$Result.GetResult<Prisma.$EKYCVerificationsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first EKYCVerifications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EKYCVerificationsFindFirstArgs} args - Arguments to find a EKYCVerifications
     * @example
     * // Get one EKYCVerifications
     * const eKYCVerifications = await prisma.eKYCVerifications.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EKYCVerificationsFindFirstArgs>(args?: SelectSubset<T, EKYCVerificationsFindFirstArgs<ExtArgs>>): Prisma__EKYCVerificationsClient<$Result.GetResult<Prisma.$EKYCVerificationsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first EKYCVerifications that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EKYCVerificationsFindFirstOrThrowArgs} args - Arguments to find a EKYCVerifications
     * @example
     * // Get one EKYCVerifications
     * const eKYCVerifications = await prisma.eKYCVerifications.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EKYCVerificationsFindFirstOrThrowArgs>(args?: SelectSubset<T, EKYCVerificationsFindFirstOrThrowArgs<ExtArgs>>): Prisma__EKYCVerificationsClient<$Result.GetResult<Prisma.$EKYCVerificationsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more EKYCVerifications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EKYCVerificationsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all EKYCVerifications
     * const eKYCVerifications = await prisma.eKYCVerifications.findMany()
     * 
     * // Get first 10 EKYCVerifications
     * const eKYCVerifications = await prisma.eKYCVerifications.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const eKYCVerificationsWithIdOnly = await prisma.eKYCVerifications.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EKYCVerificationsFindManyArgs>(args?: SelectSubset<T, EKYCVerificationsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EKYCVerificationsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a EKYCVerifications.
     * @param {EKYCVerificationsCreateArgs} args - Arguments to create a EKYCVerifications.
     * @example
     * // Create one EKYCVerifications
     * const EKYCVerifications = await prisma.eKYCVerifications.create({
     *   data: {
     *     // ... data to create a EKYCVerifications
     *   }
     * })
     * 
     */
    create<T extends EKYCVerificationsCreateArgs>(args: SelectSubset<T, EKYCVerificationsCreateArgs<ExtArgs>>): Prisma__EKYCVerificationsClient<$Result.GetResult<Prisma.$EKYCVerificationsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many EKYCVerifications.
     * @param {EKYCVerificationsCreateManyArgs} args - Arguments to create many EKYCVerifications.
     * @example
     * // Create many EKYCVerifications
     * const eKYCVerifications = await prisma.eKYCVerifications.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EKYCVerificationsCreateManyArgs>(args?: SelectSubset<T, EKYCVerificationsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many EKYCVerifications and returns the data saved in the database.
     * @param {EKYCVerificationsCreateManyAndReturnArgs} args - Arguments to create many EKYCVerifications.
     * @example
     * // Create many EKYCVerifications
     * const eKYCVerifications = await prisma.eKYCVerifications.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many EKYCVerifications and only return the `id`
     * const eKYCVerificationsWithIdOnly = await prisma.eKYCVerifications.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EKYCVerificationsCreateManyAndReturnArgs>(args?: SelectSubset<T, EKYCVerificationsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EKYCVerificationsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a EKYCVerifications.
     * @param {EKYCVerificationsDeleteArgs} args - Arguments to delete one EKYCVerifications.
     * @example
     * // Delete one EKYCVerifications
     * const EKYCVerifications = await prisma.eKYCVerifications.delete({
     *   where: {
     *     // ... filter to delete one EKYCVerifications
     *   }
     * })
     * 
     */
    delete<T extends EKYCVerificationsDeleteArgs>(args: SelectSubset<T, EKYCVerificationsDeleteArgs<ExtArgs>>): Prisma__EKYCVerificationsClient<$Result.GetResult<Prisma.$EKYCVerificationsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one EKYCVerifications.
     * @param {EKYCVerificationsUpdateArgs} args - Arguments to update one EKYCVerifications.
     * @example
     * // Update one EKYCVerifications
     * const eKYCVerifications = await prisma.eKYCVerifications.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EKYCVerificationsUpdateArgs>(args: SelectSubset<T, EKYCVerificationsUpdateArgs<ExtArgs>>): Prisma__EKYCVerificationsClient<$Result.GetResult<Prisma.$EKYCVerificationsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more EKYCVerifications.
     * @param {EKYCVerificationsDeleteManyArgs} args - Arguments to filter EKYCVerifications to delete.
     * @example
     * // Delete a few EKYCVerifications
     * const { count } = await prisma.eKYCVerifications.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EKYCVerificationsDeleteManyArgs>(args?: SelectSubset<T, EKYCVerificationsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more EKYCVerifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EKYCVerificationsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many EKYCVerifications
     * const eKYCVerifications = await prisma.eKYCVerifications.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EKYCVerificationsUpdateManyArgs>(args: SelectSubset<T, EKYCVerificationsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more EKYCVerifications and returns the data updated in the database.
     * @param {EKYCVerificationsUpdateManyAndReturnArgs} args - Arguments to update many EKYCVerifications.
     * @example
     * // Update many EKYCVerifications
     * const eKYCVerifications = await prisma.eKYCVerifications.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more EKYCVerifications and only return the `id`
     * const eKYCVerificationsWithIdOnly = await prisma.eKYCVerifications.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends EKYCVerificationsUpdateManyAndReturnArgs>(args: SelectSubset<T, EKYCVerificationsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EKYCVerificationsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one EKYCVerifications.
     * @param {EKYCVerificationsUpsertArgs} args - Arguments to update or create a EKYCVerifications.
     * @example
     * // Update or create a EKYCVerifications
     * const eKYCVerifications = await prisma.eKYCVerifications.upsert({
     *   create: {
     *     // ... data to create a EKYCVerifications
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the EKYCVerifications we want to update
     *   }
     * })
     */
    upsert<T extends EKYCVerificationsUpsertArgs>(args: SelectSubset<T, EKYCVerificationsUpsertArgs<ExtArgs>>): Prisma__EKYCVerificationsClient<$Result.GetResult<Prisma.$EKYCVerificationsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of EKYCVerifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EKYCVerificationsCountArgs} args - Arguments to filter EKYCVerifications to count.
     * @example
     * // Count the number of EKYCVerifications
     * const count = await prisma.eKYCVerifications.count({
     *   where: {
     *     // ... the filter for the EKYCVerifications we want to count
     *   }
     * })
    **/
    count<T extends EKYCVerificationsCountArgs>(
      args?: Subset<T, EKYCVerificationsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EKYCVerificationsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a EKYCVerifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EKYCVerificationsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EKYCVerificationsAggregateArgs>(args: Subset<T, EKYCVerificationsAggregateArgs>): Prisma.PrismaPromise<GetEKYCVerificationsAggregateType<T>>

    /**
     * Group by EKYCVerifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EKYCVerificationsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends EKYCVerificationsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EKYCVerificationsGroupByArgs['orderBy'] }
        : { orderBy?: EKYCVerificationsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, EKYCVerificationsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEKYCVerificationsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the EKYCVerifications model
   */
  readonly fields: EKYCVerificationsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for EKYCVerifications.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EKYCVerificationsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UsersDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UsersDefaultArgs<ExtArgs>>): Prisma__UsersClient<$Result.GetResult<Prisma.$UsersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the EKYCVerifications model
   */
  interface EKYCVerificationsFieldRefs {
    readonly id: FieldRef<"EKYCVerifications", 'String'>
    readonly user_id: FieldRef<"EKYCVerifications", 'String'>
    readonly national_id_hash: FieldRef<"EKYCVerifications", 'String'>
    readonly date_of_birth: FieldRef<"EKYCVerifications", 'DateTime'>
    readonly age: FieldRef<"EKYCVerifications", 'Int'>
    readonly custodial_address: FieldRef<"EKYCVerifications", 'String'>
    readonly tx_digest: FieldRef<"EKYCVerifications", 'String'>
    readonly status: FieldRef<"EKYCVerifications", 'KYCStatus'>
    readonly reason: FieldRef<"EKYCVerifications", 'String'>
    readonly request_id: FieldRef<"EKYCVerifications", 'String'>
    readonly created_at: FieldRef<"EKYCVerifications", 'DateTime'>
    readonly updated_at: FieldRef<"EKYCVerifications", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * EKYCVerifications findUnique
   */
  export type EKYCVerificationsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EKYCVerifications
     */
    select?: EKYCVerificationsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EKYCVerifications
     */
    omit?: EKYCVerificationsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EKYCVerificationsInclude<ExtArgs> | null
    /**
     * Filter, which EKYCVerifications to fetch.
     */
    where: EKYCVerificationsWhereUniqueInput
  }

  /**
   * EKYCVerifications findUniqueOrThrow
   */
  export type EKYCVerificationsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EKYCVerifications
     */
    select?: EKYCVerificationsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EKYCVerifications
     */
    omit?: EKYCVerificationsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EKYCVerificationsInclude<ExtArgs> | null
    /**
     * Filter, which EKYCVerifications to fetch.
     */
    where: EKYCVerificationsWhereUniqueInput
  }

  /**
   * EKYCVerifications findFirst
   */
  export type EKYCVerificationsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EKYCVerifications
     */
    select?: EKYCVerificationsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EKYCVerifications
     */
    omit?: EKYCVerificationsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EKYCVerificationsInclude<ExtArgs> | null
    /**
     * Filter, which EKYCVerifications to fetch.
     */
    where?: EKYCVerificationsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EKYCVerifications to fetch.
     */
    orderBy?: EKYCVerificationsOrderByWithRelationInput | EKYCVerificationsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EKYCVerifications.
     */
    cursor?: EKYCVerificationsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EKYCVerifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EKYCVerifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EKYCVerifications.
     */
    distinct?: EKYCVerificationsScalarFieldEnum | EKYCVerificationsScalarFieldEnum[]
  }

  /**
   * EKYCVerifications findFirstOrThrow
   */
  export type EKYCVerificationsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EKYCVerifications
     */
    select?: EKYCVerificationsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EKYCVerifications
     */
    omit?: EKYCVerificationsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EKYCVerificationsInclude<ExtArgs> | null
    /**
     * Filter, which EKYCVerifications to fetch.
     */
    where?: EKYCVerificationsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EKYCVerifications to fetch.
     */
    orderBy?: EKYCVerificationsOrderByWithRelationInput | EKYCVerificationsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EKYCVerifications.
     */
    cursor?: EKYCVerificationsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EKYCVerifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EKYCVerifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EKYCVerifications.
     */
    distinct?: EKYCVerificationsScalarFieldEnum | EKYCVerificationsScalarFieldEnum[]
  }

  /**
   * EKYCVerifications findMany
   */
  export type EKYCVerificationsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EKYCVerifications
     */
    select?: EKYCVerificationsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EKYCVerifications
     */
    omit?: EKYCVerificationsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EKYCVerificationsInclude<ExtArgs> | null
    /**
     * Filter, which EKYCVerifications to fetch.
     */
    where?: EKYCVerificationsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EKYCVerifications to fetch.
     */
    orderBy?: EKYCVerificationsOrderByWithRelationInput | EKYCVerificationsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing EKYCVerifications.
     */
    cursor?: EKYCVerificationsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EKYCVerifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EKYCVerifications.
     */
    skip?: number
    distinct?: EKYCVerificationsScalarFieldEnum | EKYCVerificationsScalarFieldEnum[]
  }

  /**
   * EKYCVerifications create
   */
  export type EKYCVerificationsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EKYCVerifications
     */
    select?: EKYCVerificationsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EKYCVerifications
     */
    omit?: EKYCVerificationsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EKYCVerificationsInclude<ExtArgs> | null
    /**
     * The data needed to create a EKYCVerifications.
     */
    data: XOR<EKYCVerificationsCreateInput, EKYCVerificationsUncheckedCreateInput>
  }

  /**
   * EKYCVerifications createMany
   */
  export type EKYCVerificationsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many EKYCVerifications.
     */
    data: EKYCVerificationsCreateManyInput | EKYCVerificationsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * EKYCVerifications createManyAndReturn
   */
  export type EKYCVerificationsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EKYCVerifications
     */
    select?: EKYCVerificationsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the EKYCVerifications
     */
    omit?: EKYCVerificationsOmit<ExtArgs> | null
    /**
     * The data used to create many EKYCVerifications.
     */
    data: EKYCVerificationsCreateManyInput | EKYCVerificationsCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EKYCVerificationsIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * EKYCVerifications update
   */
  export type EKYCVerificationsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EKYCVerifications
     */
    select?: EKYCVerificationsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EKYCVerifications
     */
    omit?: EKYCVerificationsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EKYCVerificationsInclude<ExtArgs> | null
    /**
     * The data needed to update a EKYCVerifications.
     */
    data: XOR<EKYCVerificationsUpdateInput, EKYCVerificationsUncheckedUpdateInput>
    /**
     * Choose, which EKYCVerifications to update.
     */
    where: EKYCVerificationsWhereUniqueInput
  }

  /**
   * EKYCVerifications updateMany
   */
  export type EKYCVerificationsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update EKYCVerifications.
     */
    data: XOR<EKYCVerificationsUpdateManyMutationInput, EKYCVerificationsUncheckedUpdateManyInput>
    /**
     * Filter which EKYCVerifications to update
     */
    where?: EKYCVerificationsWhereInput
    /**
     * Limit how many EKYCVerifications to update.
     */
    limit?: number
  }

  /**
   * EKYCVerifications updateManyAndReturn
   */
  export type EKYCVerificationsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EKYCVerifications
     */
    select?: EKYCVerificationsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the EKYCVerifications
     */
    omit?: EKYCVerificationsOmit<ExtArgs> | null
    /**
     * The data used to update EKYCVerifications.
     */
    data: XOR<EKYCVerificationsUpdateManyMutationInput, EKYCVerificationsUncheckedUpdateManyInput>
    /**
     * Filter which EKYCVerifications to update
     */
    where?: EKYCVerificationsWhereInput
    /**
     * Limit how many EKYCVerifications to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EKYCVerificationsIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * EKYCVerifications upsert
   */
  export type EKYCVerificationsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EKYCVerifications
     */
    select?: EKYCVerificationsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EKYCVerifications
     */
    omit?: EKYCVerificationsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EKYCVerificationsInclude<ExtArgs> | null
    /**
     * The filter to search for the EKYCVerifications to update in case it exists.
     */
    where: EKYCVerificationsWhereUniqueInput
    /**
     * In case the EKYCVerifications found by the `where` argument doesn't exist, create a new EKYCVerifications with this data.
     */
    create: XOR<EKYCVerificationsCreateInput, EKYCVerificationsUncheckedCreateInput>
    /**
     * In case the EKYCVerifications was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EKYCVerificationsUpdateInput, EKYCVerificationsUncheckedUpdateInput>
  }

  /**
   * EKYCVerifications delete
   */
  export type EKYCVerificationsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EKYCVerifications
     */
    select?: EKYCVerificationsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EKYCVerifications
     */
    omit?: EKYCVerificationsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EKYCVerificationsInclude<ExtArgs> | null
    /**
     * Filter which EKYCVerifications to delete.
     */
    where: EKYCVerificationsWhereUniqueInput
  }

  /**
   * EKYCVerifications deleteMany
   */
  export type EKYCVerificationsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EKYCVerifications to delete
     */
    where?: EKYCVerificationsWhereInput
    /**
     * Limit how many EKYCVerifications to delete.
     */
    limit?: number
  }

  /**
   * EKYCVerifications without action
   */
  export type EKYCVerificationsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EKYCVerifications
     */
    select?: EKYCVerificationsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EKYCVerifications
     */
    omit?: EKYCVerificationsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EKYCVerificationsInclude<ExtArgs> | null
  }


  /**
   * Model Bonds
   */

  export type AggregateBonds = {
    _count: BondsCountAggregateOutputType | null
    _avg: BondsAvgAggregateOutputType | null
    _sum: BondsSumAggregateOutputType | null
    _min: BondsMinAggregateOutputType | null
    _max: BondsMaxAggregateOutputType | null
  }

  export type BondsAvgAggregateOutputType = {
    face_value: number | null
    tl_unit_offered: number | null
    tl_unit_subscribed: number | null
    subscription_period: number | null
  }

  export type BondsSumAggregateOutputType = {
    face_value: bigint | null
    tl_unit_offered: number | null
    tl_unit_subscribed: number | null
    subscription_period: number | null
  }

  export type BondsMinAggregateOutputType = {
    id: string | null
    bond_object_id: string | null
    bond_name: string | null
    bond_type: $Enums.BondType | null
    bond_symbol: string | null
    organization_name: string | null
    face_value: bigint | null
    tl_unit_offered: number | null
    tl_unit_subscribed: number | null
    maturity: Date | null
    status: $Enums.Status | null
    interest_rate: string | null
    purpose: string | null
    market: $Enums.Market | null
    created_at: Date | null
    subscription_period: number | null
    subscription_end_date: Date | null
  }

  export type BondsMaxAggregateOutputType = {
    id: string | null
    bond_object_id: string | null
    bond_name: string | null
    bond_type: $Enums.BondType | null
    bond_symbol: string | null
    organization_name: string | null
    face_value: bigint | null
    tl_unit_offered: number | null
    tl_unit_subscribed: number | null
    maturity: Date | null
    status: $Enums.Status | null
    interest_rate: string | null
    purpose: string | null
    market: $Enums.Market | null
    created_at: Date | null
    subscription_period: number | null
    subscription_end_date: Date | null
  }

  export type BondsCountAggregateOutputType = {
    id: number
    bond_object_id: number
    bond_name: number
    bond_type: number
    bond_symbol: number
    organization_name: number
    face_value: number
    tl_unit_offered: number
    tl_unit_subscribed: number
    maturity: number
    status: number
    interest_rate: number
    purpose: number
    market: number
    created_at: number
    subscription_period: number
    subscription_end_date: number
    _all: number
  }


  export type BondsAvgAggregateInputType = {
    face_value?: true
    tl_unit_offered?: true
    tl_unit_subscribed?: true
    subscription_period?: true
  }

  export type BondsSumAggregateInputType = {
    face_value?: true
    tl_unit_offered?: true
    tl_unit_subscribed?: true
    subscription_period?: true
  }

  export type BondsMinAggregateInputType = {
    id?: true
    bond_object_id?: true
    bond_name?: true
    bond_type?: true
    bond_symbol?: true
    organization_name?: true
    face_value?: true
    tl_unit_offered?: true
    tl_unit_subscribed?: true
    maturity?: true
    status?: true
    interest_rate?: true
    purpose?: true
    market?: true
    created_at?: true
    subscription_period?: true
    subscription_end_date?: true
  }

  export type BondsMaxAggregateInputType = {
    id?: true
    bond_object_id?: true
    bond_name?: true
    bond_type?: true
    bond_symbol?: true
    organization_name?: true
    face_value?: true
    tl_unit_offered?: true
    tl_unit_subscribed?: true
    maturity?: true
    status?: true
    interest_rate?: true
    purpose?: true
    market?: true
    created_at?: true
    subscription_period?: true
    subscription_end_date?: true
  }

  export type BondsCountAggregateInputType = {
    id?: true
    bond_object_id?: true
    bond_name?: true
    bond_type?: true
    bond_symbol?: true
    organization_name?: true
    face_value?: true
    tl_unit_offered?: true
    tl_unit_subscribed?: true
    maturity?: true
    status?: true
    interest_rate?: true
    purpose?: true
    market?: true
    created_at?: true
    subscription_period?: true
    subscription_end_date?: true
    _all?: true
  }

  export type BondsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Bonds to aggregate.
     */
    where?: BondsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Bonds to fetch.
     */
    orderBy?: BondsOrderByWithRelationInput | BondsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BondsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Bonds from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Bonds.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Bonds
    **/
    _count?: true | BondsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BondsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BondsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BondsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BondsMaxAggregateInputType
  }

  export type GetBondsAggregateType<T extends BondsAggregateArgs> = {
        [P in keyof T & keyof AggregateBonds]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBonds[P]>
      : GetScalarType<T[P], AggregateBonds[P]>
  }




  export type BondsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BondsWhereInput
    orderBy?: BondsOrderByWithAggregationInput | BondsOrderByWithAggregationInput[]
    by: BondsScalarFieldEnum[] | BondsScalarFieldEnum
    having?: BondsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BondsCountAggregateInputType | true
    _avg?: BondsAvgAggregateInputType
    _sum?: BondsSumAggregateInputType
    _min?: BondsMinAggregateInputType
    _max?: BondsMaxAggregateInputType
  }

  export type BondsGroupByOutputType = {
    id: string
    bond_object_id: string | null
    bond_name: string
    bond_type: $Enums.BondType
    bond_symbol: string
    organization_name: string
    face_value: bigint
    tl_unit_offered: number
    tl_unit_subscribed: number | null
    maturity: Date
    status: $Enums.Status
    interest_rate: string
    purpose: string
    market: $Enums.Market | null
    created_at: Date
    subscription_period: number
    subscription_end_date: Date
    _count: BondsCountAggregateOutputType | null
    _avg: BondsAvgAggregateOutputType | null
    _sum: BondsSumAggregateOutputType | null
    _min: BondsMinAggregateOutputType | null
    _max: BondsMaxAggregateOutputType | null
  }

  type GetBondsGroupByPayload<T extends BondsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BondsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BondsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BondsGroupByOutputType[P]>
            : GetScalarType<T[P], BondsGroupByOutputType[P]>
        }
      >
    >


  export type BondsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    bond_object_id?: boolean
    bond_name?: boolean
    bond_type?: boolean
    bond_symbol?: boolean
    organization_name?: boolean
    face_value?: boolean
    tl_unit_offered?: boolean
    tl_unit_subscribed?: boolean
    maturity?: boolean
    status?: boolean
    interest_rate?: boolean
    purpose?: boolean
    market?: boolean
    created_at?: boolean
    subscription_period?: boolean
    subscription_end_date?: boolean
    subscriptions?: boolean | Bonds$subscriptionsArgs<ExtArgs>
    events?: boolean | Bonds$eventsArgs<ExtArgs>
    transactions?: boolean | Bonds$transactionsArgs<ExtArgs>
    _count?: boolean | BondsCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["bonds"]>

  export type BondsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    bond_object_id?: boolean
    bond_name?: boolean
    bond_type?: boolean
    bond_symbol?: boolean
    organization_name?: boolean
    face_value?: boolean
    tl_unit_offered?: boolean
    tl_unit_subscribed?: boolean
    maturity?: boolean
    status?: boolean
    interest_rate?: boolean
    purpose?: boolean
    market?: boolean
    created_at?: boolean
    subscription_period?: boolean
    subscription_end_date?: boolean
  }, ExtArgs["result"]["bonds"]>

  export type BondsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    bond_object_id?: boolean
    bond_name?: boolean
    bond_type?: boolean
    bond_symbol?: boolean
    organization_name?: boolean
    face_value?: boolean
    tl_unit_offered?: boolean
    tl_unit_subscribed?: boolean
    maturity?: boolean
    status?: boolean
    interest_rate?: boolean
    purpose?: boolean
    market?: boolean
    created_at?: boolean
    subscription_period?: boolean
    subscription_end_date?: boolean
  }, ExtArgs["result"]["bonds"]>

  export type BondsSelectScalar = {
    id?: boolean
    bond_object_id?: boolean
    bond_name?: boolean
    bond_type?: boolean
    bond_symbol?: boolean
    organization_name?: boolean
    face_value?: boolean
    tl_unit_offered?: boolean
    tl_unit_subscribed?: boolean
    maturity?: boolean
    status?: boolean
    interest_rate?: boolean
    purpose?: boolean
    market?: boolean
    created_at?: boolean
    subscription_period?: boolean
    subscription_end_date?: boolean
  }

  export type BondsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "bond_object_id" | "bond_name" | "bond_type" | "bond_symbol" | "organization_name" | "face_value" | "tl_unit_offered" | "tl_unit_subscribed" | "maturity" | "status" | "interest_rate" | "purpose" | "market" | "created_at" | "subscription_period" | "subscription_end_date", ExtArgs["result"]["bonds"]>
  export type BondsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    subscriptions?: boolean | Bonds$subscriptionsArgs<ExtArgs>
    events?: boolean | Bonds$eventsArgs<ExtArgs>
    transactions?: boolean | Bonds$transactionsArgs<ExtArgs>
    _count?: boolean | BondsCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type BondsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type BondsIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $BondsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Bonds"
    objects: {
      subscriptions: Prisma.$SubscriptionsPayload<ExtArgs>[]
      events: Prisma.$EventsPayload<ExtArgs>[]
      transactions: Prisma.$TransactionsPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      bond_object_id: string | null
      bond_name: string
      bond_type: $Enums.BondType
      bond_symbol: string
      organization_name: string
      face_value: bigint
      tl_unit_offered: number
      tl_unit_subscribed: number | null
      maturity: Date
      status: $Enums.Status
      interest_rate: string
      purpose: string
      market: $Enums.Market | null
      created_at: Date
      subscription_period: number
      subscription_end_date: Date
    }, ExtArgs["result"]["bonds"]>
    composites: {}
  }

  type BondsGetPayload<S extends boolean | null | undefined | BondsDefaultArgs> = $Result.GetResult<Prisma.$BondsPayload, S>

  type BondsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BondsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BondsCountAggregateInputType | true
    }

  export interface BondsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Bonds'], meta: { name: 'Bonds' } }
    /**
     * Find zero or one Bonds that matches the filter.
     * @param {BondsFindUniqueArgs} args - Arguments to find a Bonds
     * @example
     * // Get one Bonds
     * const bonds = await prisma.bonds.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BondsFindUniqueArgs>(args: SelectSubset<T, BondsFindUniqueArgs<ExtArgs>>): Prisma__BondsClient<$Result.GetResult<Prisma.$BondsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Bonds that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BondsFindUniqueOrThrowArgs} args - Arguments to find a Bonds
     * @example
     * // Get one Bonds
     * const bonds = await prisma.bonds.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BondsFindUniqueOrThrowArgs>(args: SelectSubset<T, BondsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BondsClient<$Result.GetResult<Prisma.$BondsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Bonds that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BondsFindFirstArgs} args - Arguments to find a Bonds
     * @example
     * // Get one Bonds
     * const bonds = await prisma.bonds.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BondsFindFirstArgs>(args?: SelectSubset<T, BondsFindFirstArgs<ExtArgs>>): Prisma__BondsClient<$Result.GetResult<Prisma.$BondsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Bonds that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BondsFindFirstOrThrowArgs} args - Arguments to find a Bonds
     * @example
     * // Get one Bonds
     * const bonds = await prisma.bonds.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BondsFindFirstOrThrowArgs>(args?: SelectSubset<T, BondsFindFirstOrThrowArgs<ExtArgs>>): Prisma__BondsClient<$Result.GetResult<Prisma.$BondsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Bonds that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BondsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Bonds
     * const bonds = await prisma.bonds.findMany()
     * 
     * // Get first 10 Bonds
     * const bonds = await prisma.bonds.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const bondsWithIdOnly = await prisma.bonds.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BondsFindManyArgs>(args?: SelectSubset<T, BondsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BondsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Bonds.
     * @param {BondsCreateArgs} args - Arguments to create a Bonds.
     * @example
     * // Create one Bonds
     * const Bonds = await prisma.bonds.create({
     *   data: {
     *     // ... data to create a Bonds
     *   }
     * })
     * 
     */
    create<T extends BondsCreateArgs>(args: SelectSubset<T, BondsCreateArgs<ExtArgs>>): Prisma__BondsClient<$Result.GetResult<Prisma.$BondsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Bonds.
     * @param {BondsCreateManyArgs} args - Arguments to create many Bonds.
     * @example
     * // Create many Bonds
     * const bonds = await prisma.bonds.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BondsCreateManyArgs>(args?: SelectSubset<T, BondsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Bonds and returns the data saved in the database.
     * @param {BondsCreateManyAndReturnArgs} args - Arguments to create many Bonds.
     * @example
     * // Create many Bonds
     * const bonds = await prisma.bonds.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Bonds and only return the `id`
     * const bondsWithIdOnly = await prisma.bonds.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BondsCreateManyAndReturnArgs>(args?: SelectSubset<T, BondsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BondsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Bonds.
     * @param {BondsDeleteArgs} args - Arguments to delete one Bonds.
     * @example
     * // Delete one Bonds
     * const Bonds = await prisma.bonds.delete({
     *   where: {
     *     // ... filter to delete one Bonds
     *   }
     * })
     * 
     */
    delete<T extends BondsDeleteArgs>(args: SelectSubset<T, BondsDeleteArgs<ExtArgs>>): Prisma__BondsClient<$Result.GetResult<Prisma.$BondsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Bonds.
     * @param {BondsUpdateArgs} args - Arguments to update one Bonds.
     * @example
     * // Update one Bonds
     * const bonds = await prisma.bonds.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BondsUpdateArgs>(args: SelectSubset<T, BondsUpdateArgs<ExtArgs>>): Prisma__BondsClient<$Result.GetResult<Prisma.$BondsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Bonds.
     * @param {BondsDeleteManyArgs} args - Arguments to filter Bonds to delete.
     * @example
     * // Delete a few Bonds
     * const { count } = await prisma.bonds.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BondsDeleteManyArgs>(args?: SelectSubset<T, BondsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Bonds.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BondsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Bonds
     * const bonds = await prisma.bonds.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BondsUpdateManyArgs>(args: SelectSubset<T, BondsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Bonds and returns the data updated in the database.
     * @param {BondsUpdateManyAndReturnArgs} args - Arguments to update many Bonds.
     * @example
     * // Update many Bonds
     * const bonds = await prisma.bonds.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Bonds and only return the `id`
     * const bondsWithIdOnly = await prisma.bonds.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends BondsUpdateManyAndReturnArgs>(args: SelectSubset<T, BondsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BondsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Bonds.
     * @param {BondsUpsertArgs} args - Arguments to update or create a Bonds.
     * @example
     * // Update or create a Bonds
     * const bonds = await prisma.bonds.upsert({
     *   create: {
     *     // ... data to create a Bonds
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Bonds we want to update
     *   }
     * })
     */
    upsert<T extends BondsUpsertArgs>(args: SelectSubset<T, BondsUpsertArgs<ExtArgs>>): Prisma__BondsClient<$Result.GetResult<Prisma.$BondsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Bonds.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BondsCountArgs} args - Arguments to filter Bonds to count.
     * @example
     * // Count the number of Bonds
     * const count = await prisma.bonds.count({
     *   where: {
     *     // ... the filter for the Bonds we want to count
     *   }
     * })
    **/
    count<T extends BondsCountArgs>(
      args?: Subset<T, BondsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BondsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Bonds.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BondsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BondsAggregateArgs>(args: Subset<T, BondsAggregateArgs>): Prisma.PrismaPromise<GetBondsAggregateType<T>>

    /**
     * Group by Bonds.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BondsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BondsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BondsGroupByArgs['orderBy'] }
        : { orderBy?: BondsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BondsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBondsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Bonds model
   */
  readonly fields: BondsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Bonds.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BondsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    subscriptions<T extends Bonds$subscriptionsArgs<ExtArgs> = {}>(args?: Subset<T, Bonds$subscriptionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubscriptionsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    events<T extends Bonds$eventsArgs<ExtArgs> = {}>(args?: Subset<T, Bonds$eventsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    transactions<T extends Bonds$transactionsArgs<ExtArgs> = {}>(args?: Subset<T, Bonds$transactionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Bonds model
   */
  interface BondsFieldRefs {
    readonly id: FieldRef<"Bonds", 'String'>
    readonly bond_object_id: FieldRef<"Bonds", 'String'>
    readonly bond_name: FieldRef<"Bonds", 'String'>
    readonly bond_type: FieldRef<"Bonds", 'BondType'>
    readonly bond_symbol: FieldRef<"Bonds", 'String'>
    readonly organization_name: FieldRef<"Bonds", 'String'>
    readonly face_value: FieldRef<"Bonds", 'BigInt'>
    readonly tl_unit_offered: FieldRef<"Bonds", 'Int'>
    readonly tl_unit_subscribed: FieldRef<"Bonds", 'Int'>
    readonly maturity: FieldRef<"Bonds", 'DateTime'>
    readonly status: FieldRef<"Bonds", 'Status'>
    readonly interest_rate: FieldRef<"Bonds", 'String'>
    readonly purpose: FieldRef<"Bonds", 'String'>
    readonly market: FieldRef<"Bonds", 'Market'>
    readonly created_at: FieldRef<"Bonds", 'DateTime'>
    readonly subscription_period: FieldRef<"Bonds", 'Int'>
    readonly subscription_end_date: FieldRef<"Bonds", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Bonds findUnique
   */
  export type BondsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bonds
     */
    select?: BondsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bonds
     */
    omit?: BondsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BondsInclude<ExtArgs> | null
    /**
     * Filter, which Bonds to fetch.
     */
    where: BondsWhereUniqueInput
  }

  /**
   * Bonds findUniqueOrThrow
   */
  export type BondsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bonds
     */
    select?: BondsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bonds
     */
    omit?: BondsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BondsInclude<ExtArgs> | null
    /**
     * Filter, which Bonds to fetch.
     */
    where: BondsWhereUniqueInput
  }

  /**
   * Bonds findFirst
   */
  export type BondsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bonds
     */
    select?: BondsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bonds
     */
    omit?: BondsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BondsInclude<ExtArgs> | null
    /**
     * Filter, which Bonds to fetch.
     */
    where?: BondsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Bonds to fetch.
     */
    orderBy?: BondsOrderByWithRelationInput | BondsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Bonds.
     */
    cursor?: BondsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Bonds from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Bonds.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Bonds.
     */
    distinct?: BondsScalarFieldEnum | BondsScalarFieldEnum[]
  }

  /**
   * Bonds findFirstOrThrow
   */
  export type BondsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bonds
     */
    select?: BondsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bonds
     */
    omit?: BondsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BondsInclude<ExtArgs> | null
    /**
     * Filter, which Bonds to fetch.
     */
    where?: BondsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Bonds to fetch.
     */
    orderBy?: BondsOrderByWithRelationInput | BondsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Bonds.
     */
    cursor?: BondsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Bonds from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Bonds.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Bonds.
     */
    distinct?: BondsScalarFieldEnum | BondsScalarFieldEnum[]
  }

  /**
   * Bonds findMany
   */
  export type BondsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bonds
     */
    select?: BondsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bonds
     */
    omit?: BondsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BondsInclude<ExtArgs> | null
    /**
     * Filter, which Bonds to fetch.
     */
    where?: BondsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Bonds to fetch.
     */
    orderBy?: BondsOrderByWithRelationInput | BondsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Bonds.
     */
    cursor?: BondsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Bonds from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Bonds.
     */
    skip?: number
    distinct?: BondsScalarFieldEnum | BondsScalarFieldEnum[]
  }

  /**
   * Bonds create
   */
  export type BondsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bonds
     */
    select?: BondsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bonds
     */
    omit?: BondsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BondsInclude<ExtArgs> | null
    /**
     * The data needed to create a Bonds.
     */
    data: XOR<BondsCreateInput, BondsUncheckedCreateInput>
  }

  /**
   * Bonds createMany
   */
  export type BondsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Bonds.
     */
    data: BondsCreateManyInput | BondsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Bonds createManyAndReturn
   */
  export type BondsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bonds
     */
    select?: BondsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Bonds
     */
    omit?: BondsOmit<ExtArgs> | null
    /**
     * The data used to create many Bonds.
     */
    data: BondsCreateManyInput | BondsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Bonds update
   */
  export type BondsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bonds
     */
    select?: BondsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bonds
     */
    omit?: BondsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BondsInclude<ExtArgs> | null
    /**
     * The data needed to update a Bonds.
     */
    data: XOR<BondsUpdateInput, BondsUncheckedUpdateInput>
    /**
     * Choose, which Bonds to update.
     */
    where: BondsWhereUniqueInput
  }

  /**
   * Bonds updateMany
   */
  export type BondsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Bonds.
     */
    data: XOR<BondsUpdateManyMutationInput, BondsUncheckedUpdateManyInput>
    /**
     * Filter which Bonds to update
     */
    where?: BondsWhereInput
    /**
     * Limit how many Bonds to update.
     */
    limit?: number
  }

  /**
   * Bonds updateManyAndReturn
   */
  export type BondsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bonds
     */
    select?: BondsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Bonds
     */
    omit?: BondsOmit<ExtArgs> | null
    /**
     * The data used to update Bonds.
     */
    data: XOR<BondsUpdateManyMutationInput, BondsUncheckedUpdateManyInput>
    /**
     * Filter which Bonds to update
     */
    where?: BondsWhereInput
    /**
     * Limit how many Bonds to update.
     */
    limit?: number
  }

  /**
   * Bonds upsert
   */
  export type BondsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bonds
     */
    select?: BondsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bonds
     */
    omit?: BondsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BondsInclude<ExtArgs> | null
    /**
     * The filter to search for the Bonds to update in case it exists.
     */
    where: BondsWhereUniqueInput
    /**
     * In case the Bonds found by the `where` argument doesn't exist, create a new Bonds with this data.
     */
    create: XOR<BondsCreateInput, BondsUncheckedCreateInput>
    /**
     * In case the Bonds was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BondsUpdateInput, BondsUncheckedUpdateInput>
  }

  /**
   * Bonds delete
   */
  export type BondsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bonds
     */
    select?: BondsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bonds
     */
    omit?: BondsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BondsInclude<ExtArgs> | null
    /**
     * Filter which Bonds to delete.
     */
    where: BondsWhereUniqueInput
  }

  /**
   * Bonds deleteMany
   */
  export type BondsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Bonds to delete
     */
    where?: BondsWhereInput
    /**
     * Limit how many Bonds to delete.
     */
    limit?: number
  }

  /**
   * Bonds.subscriptions
   */
  export type Bonds$subscriptionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscriptions
     */
    select?: SubscriptionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscriptions
     */
    omit?: SubscriptionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionsInclude<ExtArgs> | null
    where?: SubscriptionsWhereInput
    orderBy?: SubscriptionsOrderByWithRelationInput | SubscriptionsOrderByWithRelationInput[]
    cursor?: SubscriptionsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SubscriptionsScalarFieldEnum | SubscriptionsScalarFieldEnum[]
  }

  /**
   * Bonds.events
   */
  export type Bonds$eventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Events
     */
    select?: EventsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Events
     */
    omit?: EventsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventsInclude<ExtArgs> | null
    where?: EventsWhereInput
    orderBy?: EventsOrderByWithRelationInput | EventsOrderByWithRelationInput[]
    cursor?: EventsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EventsScalarFieldEnum | EventsScalarFieldEnum[]
  }

  /**
   * Bonds.transactions
   */
  export type Bonds$transactionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transactions
     */
    select?: TransactionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transactions
     */
    omit?: TransactionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionsInclude<ExtArgs> | null
    where?: TransactionsWhereInput
    orderBy?: TransactionsOrderByWithRelationInput | TransactionsOrderByWithRelationInput[]
    cursor?: TransactionsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TransactionsScalarFieldEnum | TransactionsScalarFieldEnum[]
  }

  /**
   * Bonds without action
   */
  export type BondsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bonds
     */
    select?: BondsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bonds
     */
    omit?: BondsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BondsInclude<ExtArgs> | null
  }


  /**
   * Model Events
   */

  export type AggregateEvents = {
    _count: EventsCountAggregateOutputType | null
    _min: EventsMinAggregateOutputType | null
    _max: EventsMaxAggregateOutputType | null
  }

  export type EventsMinAggregateOutputType = {
    id: string | null
    type: $Enums.Type | null
    bond_id: string | null
    user_id: string | null
    details: string | null
    tx_hash: string | null
    created_at: Date | null
  }

  export type EventsMaxAggregateOutputType = {
    id: string | null
    type: $Enums.Type | null
    bond_id: string | null
    user_id: string | null
    details: string | null
    tx_hash: string | null
    created_at: Date | null
  }

  export type EventsCountAggregateOutputType = {
    id: number
    type: number
    bond_id: number
    user_id: number
    details: number
    tx_hash: number
    created_at: number
    _all: number
  }


  export type EventsMinAggregateInputType = {
    id?: true
    type?: true
    bond_id?: true
    user_id?: true
    details?: true
    tx_hash?: true
    created_at?: true
  }

  export type EventsMaxAggregateInputType = {
    id?: true
    type?: true
    bond_id?: true
    user_id?: true
    details?: true
    tx_hash?: true
    created_at?: true
  }

  export type EventsCountAggregateInputType = {
    id?: true
    type?: true
    bond_id?: true
    user_id?: true
    details?: true
    tx_hash?: true
    created_at?: true
    _all?: true
  }

  export type EventsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Events to aggregate.
     */
    where?: EventsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Events to fetch.
     */
    orderBy?: EventsOrderByWithRelationInput | EventsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EventsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Events from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Events.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Events
    **/
    _count?: true | EventsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EventsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EventsMaxAggregateInputType
  }

  export type GetEventsAggregateType<T extends EventsAggregateArgs> = {
        [P in keyof T & keyof AggregateEvents]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEvents[P]>
      : GetScalarType<T[P], AggregateEvents[P]>
  }




  export type EventsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EventsWhereInput
    orderBy?: EventsOrderByWithAggregationInput | EventsOrderByWithAggregationInput[]
    by: EventsScalarFieldEnum[] | EventsScalarFieldEnum
    having?: EventsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EventsCountAggregateInputType | true
    _min?: EventsMinAggregateInputType
    _max?: EventsMaxAggregateInputType
  }

  export type EventsGroupByOutputType = {
    id: string
    type: $Enums.Type
    bond_id: string
    user_id: string
    details: string
    tx_hash: string
    created_at: Date
    _count: EventsCountAggregateOutputType | null
    _min: EventsMinAggregateOutputType | null
    _max: EventsMaxAggregateOutputType | null
  }

  type GetEventsGroupByPayload<T extends EventsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EventsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EventsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EventsGroupByOutputType[P]>
            : GetScalarType<T[P], EventsGroupByOutputType[P]>
        }
      >
    >


  export type EventsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    type?: boolean
    bond_id?: boolean
    user_id?: boolean
    details?: boolean
    tx_hash?: boolean
    created_at?: boolean
    bond?: boolean | BondsDefaultArgs<ExtArgs>
    user?: boolean | UsersDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["events"]>

  export type EventsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    type?: boolean
    bond_id?: boolean
    user_id?: boolean
    details?: boolean
    tx_hash?: boolean
    created_at?: boolean
    bond?: boolean | BondsDefaultArgs<ExtArgs>
    user?: boolean | UsersDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["events"]>

  export type EventsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    type?: boolean
    bond_id?: boolean
    user_id?: boolean
    details?: boolean
    tx_hash?: boolean
    created_at?: boolean
    bond?: boolean | BondsDefaultArgs<ExtArgs>
    user?: boolean | UsersDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["events"]>

  export type EventsSelectScalar = {
    id?: boolean
    type?: boolean
    bond_id?: boolean
    user_id?: boolean
    details?: boolean
    tx_hash?: boolean
    created_at?: boolean
  }

  export type EventsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "type" | "bond_id" | "user_id" | "details" | "tx_hash" | "created_at", ExtArgs["result"]["events"]>
  export type EventsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    bond?: boolean | BondsDefaultArgs<ExtArgs>
    user?: boolean | UsersDefaultArgs<ExtArgs>
  }
  export type EventsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    bond?: boolean | BondsDefaultArgs<ExtArgs>
    user?: boolean | UsersDefaultArgs<ExtArgs>
  }
  export type EventsIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    bond?: boolean | BondsDefaultArgs<ExtArgs>
    user?: boolean | UsersDefaultArgs<ExtArgs>
  }

  export type $EventsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Events"
    objects: {
      bond: Prisma.$BondsPayload<ExtArgs>
      user: Prisma.$UsersPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      type: $Enums.Type
      bond_id: string
      user_id: string
      details: string
      tx_hash: string
      created_at: Date
    }, ExtArgs["result"]["events"]>
    composites: {}
  }

  type EventsGetPayload<S extends boolean | null | undefined | EventsDefaultArgs> = $Result.GetResult<Prisma.$EventsPayload, S>

  type EventsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<EventsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: EventsCountAggregateInputType | true
    }

  export interface EventsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Events'], meta: { name: 'Events' } }
    /**
     * Find zero or one Events that matches the filter.
     * @param {EventsFindUniqueArgs} args - Arguments to find a Events
     * @example
     * // Get one Events
     * const events = await prisma.events.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EventsFindUniqueArgs>(args: SelectSubset<T, EventsFindUniqueArgs<ExtArgs>>): Prisma__EventsClient<$Result.GetResult<Prisma.$EventsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Events that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {EventsFindUniqueOrThrowArgs} args - Arguments to find a Events
     * @example
     * // Get one Events
     * const events = await prisma.events.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EventsFindUniqueOrThrowArgs>(args: SelectSubset<T, EventsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EventsClient<$Result.GetResult<Prisma.$EventsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Events that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventsFindFirstArgs} args - Arguments to find a Events
     * @example
     * // Get one Events
     * const events = await prisma.events.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EventsFindFirstArgs>(args?: SelectSubset<T, EventsFindFirstArgs<ExtArgs>>): Prisma__EventsClient<$Result.GetResult<Prisma.$EventsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Events that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventsFindFirstOrThrowArgs} args - Arguments to find a Events
     * @example
     * // Get one Events
     * const events = await prisma.events.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EventsFindFirstOrThrowArgs>(args?: SelectSubset<T, EventsFindFirstOrThrowArgs<ExtArgs>>): Prisma__EventsClient<$Result.GetResult<Prisma.$EventsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Events that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Events
     * const events = await prisma.events.findMany()
     * 
     * // Get first 10 Events
     * const events = await prisma.events.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const eventsWithIdOnly = await prisma.events.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EventsFindManyArgs>(args?: SelectSubset<T, EventsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Events.
     * @param {EventsCreateArgs} args - Arguments to create a Events.
     * @example
     * // Create one Events
     * const Events = await prisma.events.create({
     *   data: {
     *     // ... data to create a Events
     *   }
     * })
     * 
     */
    create<T extends EventsCreateArgs>(args: SelectSubset<T, EventsCreateArgs<ExtArgs>>): Prisma__EventsClient<$Result.GetResult<Prisma.$EventsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Events.
     * @param {EventsCreateManyArgs} args - Arguments to create many Events.
     * @example
     * // Create many Events
     * const events = await prisma.events.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EventsCreateManyArgs>(args?: SelectSubset<T, EventsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Events and returns the data saved in the database.
     * @param {EventsCreateManyAndReturnArgs} args - Arguments to create many Events.
     * @example
     * // Create many Events
     * const events = await prisma.events.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Events and only return the `id`
     * const eventsWithIdOnly = await prisma.events.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EventsCreateManyAndReturnArgs>(args?: SelectSubset<T, EventsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Events.
     * @param {EventsDeleteArgs} args - Arguments to delete one Events.
     * @example
     * // Delete one Events
     * const Events = await prisma.events.delete({
     *   where: {
     *     // ... filter to delete one Events
     *   }
     * })
     * 
     */
    delete<T extends EventsDeleteArgs>(args: SelectSubset<T, EventsDeleteArgs<ExtArgs>>): Prisma__EventsClient<$Result.GetResult<Prisma.$EventsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Events.
     * @param {EventsUpdateArgs} args - Arguments to update one Events.
     * @example
     * // Update one Events
     * const events = await prisma.events.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EventsUpdateArgs>(args: SelectSubset<T, EventsUpdateArgs<ExtArgs>>): Prisma__EventsClient<$Result.GetResult<Prisma.$EventsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Events.
     * @param {EventsDeleteManyArgs} args - Arguments to filter Events to delete.
     * @example
     * // Delete a few Events
     * const { count } = await prisma.events.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EventsDeleteManyArgs>(args?: SelectSubset<T, EventsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Events.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Events
     * const events = await prisma.events.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EventsUpdateManyArgs>(args: SelectSubset<T, EventsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Events and returns the data updated in the database.
     * @param {EventsUpdateManyAndReturnArgs} args - Arguments to update many Events.
     * @example
     * // Update many Events
     * const events = await prisma.events.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Events and only return the `id`
     * const eventsWithIdOnly = await prisma.events.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends EventsUpdateManyAndReturnArgs>(args: SelectSubset<T, EventsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Events.
     * @param {EventsUpsertArgs} args - Arguments to update or create a Events.
     * @example
     * // Update or create a Events
     * const events = await prisma.events.upsert({
     *   create: {
     *     // ... data to create a Events
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Events we want to update
     *   }
     * })
     */
    upsert<T extends EventsUpsertArgs>(args: SelectSubset<T, EventsUpsertArgs<ExtArgs>>): Prisma__EventsClient<$Result.GetResult<Prisma.$EventsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Events.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventsCountArgs} args - Arguments to filter Events to count.
     * @example
     * // Count the number of Events
     * const count = await prisma.events.count({
     *   where: {
     *     // ... the filter for the Events we want to count
     *   }
     * })
    **/
    count<T extends EventsCountArgs>(
      args?: Subset<T, EventsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EventsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Events.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EventsAggregateArgs>(args: Subset<T, EventsAggregateArgs>): Prisma.PrismaPromise<GetEventsAggregateType<T>>

    /**
     * Group by Events.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends EventsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EventsGroupByArgs['orderBy'] }
        : { orderBy?: EventsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, EventsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEventsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Events model
   */
  readonly fields: EventsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Events.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EventsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    bond<T extends BondsDefaultArgs<ExtArgs> = {}>(args?: Subset<T, BondsDefaultArgs<ExtArgs>>): Prisma__BondsClient<$Result.GetResult<Prisma.$BondsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    user<T extends UsersDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UsersDefaultArgs<ExtArgs>>): Prisma__UsersClient<$Result.GetResult<Prisma.$UsersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Events model
   */
  interface EventsFieldRefs {
    readonly id: FieldRef<"Events", 'String'>
    readonly type: FieldRef<"Events", 'Type'>
    readonly bond_id: FieldRef<"Events", 'String'>
    readonly user_id: FieldRef<"Events", 'String'>
    readonly details: FieldRef<"Events", 'String'>
    readonly tx_hash: FieldRef<"Events", 'String'>
    readonly created_at: FieldRef<"Events", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Events findUnique
   */
  export type EventsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Events
     */
    select?: EventsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Events
     */
    omit?: EventsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventsInclude<ExtArgs> | null
    /**
     * Filter, which Events to fetch.
     */
    where: EventsWhereUniqueInput
  }

  /**
   * Events findUniqueOrThrow
   */
  export type EventsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Events
     */
    select?: EventsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Events
     */
    omit?: EventsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventsInclude<ExtArgs> | null
    /**
     * Filter, which Events to fetch.
     */
    where: EventsWhereUniqueInput
  }

  /**
   * Events findFirst
   */
  export type EventsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Events
     */
    select?: EventsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Events
     */
    omit?: EventsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventsInclude<ExtArgs> | null
    /**
     * Filter, which Events to fetch.
     */
    where?: EventsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Events to fetch.
     */
    orderBy?: EventsOrderByWithRelationInput | EventsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Events.
     */
    cursor?: EventsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Events from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Events.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Events.
     */
    distinct?: EventsScalarFieldEnum | EventsScalarFieldEnum[]
  }

  /**
   * Events findFirstOrThrow
   */
  export type EventsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Events
     */
    select?: EventsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Events
     */
    omit?: EventsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventsInclude<ExtArgs> | null
    /**
     * Filter, which Events to fetch.
     */
    where?: EventsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Events to fetch.
     */
    orderBy?: EventsOrderByWithRelationInput | EventsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Events.
     */
    cursor?: EventsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Events from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Events.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Events.
     */
    distinct?: EventsScalarFieldEnum | EventsScalarFieldEnum[]
  }

  /**
   * Events findMany
   */
  export type EventsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Events
     */
    select?: EventsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Events
     */
    omit?: EventsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventsInclude<ExtArgs> | null
    /**
     * Filter, which Events to fetch.
     */
    where?: EventsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Events to fetch.
     */
    orderBy?: EventsOrderByWithRelationInput | EventsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Events.
     */
    cursor?: EventsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Events from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Events.
     */
    skip?: number
    distinct?: EventsScalarFieldEnum | EventsScalarFieldEnum[]
  }

  /**
   * Events create
   */
  export type EventsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Events
     */
    select?: EventsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Events
     */
    omit?: EventsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventsInclude<ExtArgs> | null
    /**
     * The data needed to create a Events.
     */
    data: XOR<EventsCreateInput, EventsUncheckedCreateInput>
  }

  /**
   * Events createMany
   */
  export type EventsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Events.
     */
    data: EventsCreateManyInput | EventsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Events createManyAndReturn
   */
  export type EventsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Events
     */
    select?: EventsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Events
     */
    omit?: EventsOmit<ExtArgs> | null
    /**
     * The data used to create many Events.
     */
    data: EventsCreateManyInput | EventsCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventsIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Events update
   */
  export type EventsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Events
     */
    select?: EventsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Events
     */
    omit?: EventsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventsInclude<ExtArgs> | null
    /**
     * The data needed to update a Events.
     */
    data: XOR<EventsUpdateInput, EventsUncheckedUpdateInput>
    /**
     * Choose, which Events to update.
     */
    where: EventsWhereUniqueInput
  }

  /**
   * Events updateMany
   */
  export type EventsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Events.
     */
    data: XOR<EventsUpdateManyMutationInput, EventsUncheckedUpdateManyInput>
    /**
     * Filter which Events to update
     */
    where?: EventsWhereInput
    /**
     * Limit how many Events to update.
     */
    limit?: number
  }

  /**
   * Events updateManyAndReturn
   */
  export type EventsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Events
     */
    select?: EventsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Events
     */
    omit?: EventsOmit<ExtArgs> | null
    /**
     * The data used to update Events.
     */
    data: XOR<EventsUpdateManyMutationInput, EventsUncheckedUpdateManyInput>
    /**
     * Filter which Events to update
     */
    where?: EventsWhereInput
    /**
     * Limit how many Events to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventsIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Events upsert
   */
  export type EventsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Events
     */
    select?: EventsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Events
     */
    omit?: EventsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventsInclude<ExtArgs> | null
    /**
     * The filter to search for the Events to update in case it exists.
     */
    where: EventsWhereUniqueInput
    /**
     * In case the Events found by the `where` argument doesn't exist, create a new Events with this data.
     */
    create: XOR<EventsCreateInput, EventsUncheckedCreateInput>
    /**
     * In case the Events was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EventsUpdateInput, EventsUncheckedUpdateInput>
  }

  /**
   * Events delete
   */
  export type EventsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Events
     */
    select?: EventsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Events
     */
    omit?: EventsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventsInclude<ExtArgs> | null
    /**
     * Filter which Events to delete.
     */
    where: EventsWhereUniqueInput
  }

  /**
   * Events deleteMany
   */
  export type EventsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Events to delete
     */
    where?: EventsWhereInput
    /**
     * Limit how many Events to delete.
     */
    limit?: number
  }

  /**
   * Events without action
   */
  export type EventsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Events
     */
    select?: EventsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Events
     */
    omit?: EventsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventsInclude<ExtArgs> | null
  }


  /**
   * Model Subscriptions
   */

  export type AggregateSubscriptions = {
    _count: SubscriptionsCountAggregateOutputType | null
    _avg: SubscriptionsAvgAggregateOutputType | null
    _sum: SubscriptionsSumAggregateOutputType | null
    _min: SubscriptionsMinAggregateOutputType | null
    _max: SubscriptionsMaxAggregateOutputType | null
  }

  export type SubscriptionsAvgAggregateOutputType = {
    committed_amount: number | null
    subscription_amt: number | null
  }

  export type SubscriptionsSumAggregateOutputType = {
    committed_amount: bigint | null
    subscription_amt: bigint | null
  }

  export type SubscriptionsMinAggregateOutputType = {
    id: string | null
    bond_id: string | null
    user_id: string | null
    wallet_address: string | null
    committed_amount: bigint | null
    tx_hash: string | null
    subscription_amt: bigint | null
    created_at: Date | null
  }

  export type SubscriptionsMaxAggregateOutputType = {
    id: string | null
    bond_id: string | null
    user_id: string | null
    wallet_address: string | null
    committed_amount: bigint | null
    tx_hash: string | null
    subscription_amt: bigint | null
    created_at: Date | null
  }

  export type SubscriptionsCountAggregateOutputType = {
    id: number
    bond_id: number
    user_id: number
    wallet_address: number
    committed_amount: number
    tx_hash: number
    subscription_amt: number
    created_at: number
    _all: number
  }


  export type SubscriptionsAvgAggregateInputType = {
    committed_amount?: true
    subscription_amt?: true
  }

  export type SubscriptionsSumAggregateInputType = {
    committed_amount?: true
    subscription_amt?: true
  }

  export type SubscriptionsMinAggregateInputType = {
    id?: true
    bond_id?: true
    user_id?: true
    wallet_address?: true
    committed_amount?: true
    tx_hash?: true
    subscription_amt?: true
    created_at?: true
  }

  export type SubscriptionsMaxAggregateInputType = {
    id?: true
    bond_id?: true
    user_id?: true
    wallet_address?: true
    committed_amount?: true
    tx_hash?: true
    subscription_amt?: true
    created_at?: true
  }

  export type SubscriptionsCountAggregateInputType = {
    id?: true
    bond_id?: true
    user_id?: true
    wallet_address?: true
    committed_amount?: true
    tx_hash?: true
    subscription_amt?: true
    created_at?: true
    _all?: true
  }

  export type SubscriptionsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Subscriptions to aggregate.
     */
    where?: SubscriptionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Subscriptions to fetch.
     */
    orderBy?: SubscriptionsOrderByWithRelationInput | SubscriptionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SubscriptionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Subscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Subscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Subscriptions
    **/
    _count?: true | SubscriptionsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SubscriptionsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SubscriptionsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SubscriptionsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SubscriptionsMaxAggregateInputType
  }

  export type GetSubscriptionsAggregateType<T extends SubscriptionsAggregateArgs> = {
        [P in keyof T & keyof AggregateSubscriptions]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSubscriptions[P]>
      : GetScalarType<T[P], AggregateSubscriptions[P]>
  }




  export type SubscriptionsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SubscriptionsWhereInput
    orderBy?: SubscriptionsOrderByWithAggregationInput | SubscriptionsOrderByWithAggregationInput[]
    by: SubscriptionsScalarFieldEnum[] | SubscriptionsScalarFieldEnum
    having?: SubscriptionsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SubscriptionsCountAggregateInputType | true
    _avg?: SubscriptionsAvgAggregateInputType
    _sum?: SubscriptionsSumAggregateInputType
    _min?: SubscriptionsMinAggregateInputType
    _max?: SubscriptionsMaxAggregateInputType
  }

  export type SubscriptionsGroupByOutputType = {
    id: string
    bond_id: string
    user_id: string
    wallet_address: string
    committed_amount: bigint
    tx_hash: string
    subscription_amt: bigint | null
    created_at: Date
    _count: SubscriptionsCountAggregateOutputType | null
    _avg: SubscriptionsAvgAggregateOutputType | null
    _sum: SubscriptionsSumAggregateOutputType | null
    _min: SubscriptionsMinAggregateOutputType | null
    _max: SubscriptionsMaxAggregateOutputType | null
  }

  type GetSubscriptionsGroupByPayload<T extends SubscriptionsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SubscriptionsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SubscriptionsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SubscriptionsGroupByOutputType[P]>
            : GetScalarType<T[P], SubscriptionsGroupByOutputType[P]>
        }
      >
    >


  export type SubscriptionsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    bond_id?: boolean
    user_id?: boolean
    wallet_address?: boolean
    committed_amount?: boolean
    tx_hash?: boolean
    subscription_amt?: boolean
    created_at?: boolean
    bond?: boolean | BondsDefaultArgs<ExtArgs>
    user?: boolean | UsersDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["subscriptions"]>

  export type SubscriptionsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    bond_id?: boolean
    user_id?: boolean
    wallet_address?: boolean
    committed_amount?: boolean
    tx_hash?: boolean
    subscription_amt?: boolean
    created_at?: boolean
    bond?: boolean | BondsDefaultArgs<ExtArgs>
    user?: boolean | UsersDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["subscriptions"]>

  export type SubscriptionsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    bond_id?: boolean
    user_id?: boolean
    wallet_address?: boolean
    committed_amount?: boolean
    tx_hash?: boolean
    subscription_amt?: boolean
    created_at?: boolean
    bond?: boolean | BondsDefaultArgs<ExtArgs>
    user?: boolean | UsersDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["subscriptions"]>

  export type SubscriptionsSelectScalar = {
    id?: boolean
    bond_id?: boolean
    user_id?: boolean
    wallet_address?: boolean
    committed_amount?: boolean
    tx_hash?: boolean
    subscription_amt?: boolean
    created_at?: boolean
  }

  export type SubscriptionsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "bond_id" | "user_id" | "wallet_address" | "committed_amount" | "tx_hash" | "subscription_amt" | "created_at", ExtArgs["result"]["subscriptions"]>
  export type SubscriptionsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    bond?: boolean | BondsDefaultArgs<ExtArgs>
    user?: boolean | UsersDefaultArgs<ExtArgs>
  }
  export type SubscriptionsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    bond?: boolean | BondsDefaultArgs<ExtArgs>
    user?: boolean | UsersDefaultArgs<ExtArgs>
  }
  export type SubscriptionsIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    bond?: boolean | BondsDefaultArgs<ExtArgs>
    user?: boolean | UsersDefaultArgs<ExtArgs>
  }

  export type $SubscriptionsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Subscriptions"
    objects: {
      bond: Prisma.$BondsPayload<ExtArgs>
      user: Prisma.$UsersPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      bond_id: string
      user_id: string
      wallet_address: string
      committed_amount: bigint
      tx_hash: string
      subscription_amt: bigint | null
      created_at: Date
    }, ExtArgs["result"]["subscriptions"]>
    composites: {}
  }

  type SubscriptionsGetPayload<S extends boolean | null | undefined | SubscriptionsDefaultArgs> = $Result.GetResult<Prisma.$SubscriptionsPayload, S>

  type SubscriptionsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SubscriptionsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SubscriptionsCountAggregateInputType | true
    }

  export interface SubscriptionsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Subscriptions'], meta: { name: 'Subscriptions' } }
    /**
     * Find zero or one Subscriptions that matches the filter.
     * @param {SubscriptionsFindUniqueArgs} args - Arguments to find a Subscriptions
     * @example
     * // Get one Subscriptions
     * const subscriptions = await prisma.subscriptions.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SubscriptionsFindUniqueArgs>(args: SelectSubset<T, SubscriptionsFindUniqueArgs<ExtArgs>>): Prisma__SubscriptionsClient<$Result.GetResult<Prisma.$SubscriptionsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Subscriptions that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SubscriptionsFindUniqueOrThrowArgs} args - Arguments to find a Subscriptions
     * @example
     * // Get one Subscriptions
     * const subscriptions = await prisma.subscriptions.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SubscriptionsFindUniqueOrThrowArgs>(args: SelectSubset<T, SubscriptionsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SubscriptionsClient<$Result.GetResult<Prisma.$SubscriptionsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Subscriptions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionsFindFirstArgs} args - Arguments to find a Subscriptions
     * @example
     * // Get one Subscriptions
     * const subscriptions = await prisma.subscriptions.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SubscriptionsFindFirstArgs>(args?: SelectSubset<T, SubscriptionsFindFirstArgs<ExtArgs>>): Prisma__SubscriptionsClient<$Result.GetResult<Prisma.$SubscriptionsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Subscriptions that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionsFindFirstOrThrowArgs} args - Arguments to find a Subscriptions
     * @example
     * // Get one Subscriptions
     * const subscriptions = await prisma.subscriptions.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SubscriptionsFindFirstOrThrowArgs>(args?: SelectSubset<T, SubscriptionsFindFirstOrThrowArgs<ExtArgs>>): Prisma__SubscriptionsClient<$Result.GetResult<Prisma.$SubscriptionsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Subscriptions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Subscriptions
     * const subscriptions = await prisma.subscriptions.findMany()
     * 
     * // Get first 10 Subscriptions
     * const subscriptions = await prisma.subscriptions.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const subscriptionsWithIdOnly = await prisma.subscriptions.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SubscriptionsFindManyArgs>(args?: SelectSubset<T, SubscriptionsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubscriptionsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Subscriptions.
     * @param {SubscriptionsCreateArgs} args - Arguments to create a Subscriptions.
     * @example
     * // Create one Subscriptions
     * const Subscriptions = await prisma.subscriptions.create({
     *   data: {
     *     // ... data to create a Subscriptions
     *   }
     * })
     * 
     */
    create<T extends SubscriptionsCreateArgs>(args: SelectSubset<T, SubscriptionsCreateArgs<ExtArgs>>): Prisma__SubscriptionsClient<$Result.GetResult<Prisma.$SubscriptionsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Subscriptions.
     * @param {SubscriptionsCreateManyArgs} args - Arguments to create many Subscriptions.
     * @example
     * // Create many Subscriptions
     * const subscriptions = await prisma.subscriptions.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SubscriptionsCreateManyArgs>(args?: SelectSubset<T, SubscriptionsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Subscriptions and returns the data saved in the database.
     * @param {SubscriptionsCreateManyAndReturnArgs} args - Arguments to create many Subscriptions.
     * @example
     * // Create many Subscriptions
     * const subscriptions = await prisma.subscriptions.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Subscriptions and only return the `id`
     * const subscriptionsWithIdOnly = await prisma.subscriptions.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SubscriptionsCreateManyAndReturnArgs>(args?: SelectSubset<T, SubscriptionsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubscriptionsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Subscriptions.
     * @param {SubscriptionsDeleteArgs} args - Arguments to delete one Subscriptions.
     * @example
     * // Delete one Subscriptions
     * const Subscriptions = await prisma.subscriptions.delete({
     *   where: {
     *     // ... filter to delete one Subscriptions
     *   }
     * })
     * 
     */
    delete<T extends SubscriptionsDeleteArgs>(args: SelectSubset<T, SubscriptionsDeleteArgs<ExtArgs>>): Prisma__SubscriptionsClient<$Result.GetResult<Prisma.$SubscriptionsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Subscriptions.
     * @param {SubscriptionsUpdateArgs} args - Arguments to update one Subscriptions.
     * @example
     * // Update one Subscriptions
     * const subscriptions = await prisma.subscriptions.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SubscriptionsUpdateArgs>(args: SelectSubset<T, SubscriptionsUpdateArgs<ExtArgs>>): Prisma__SubscriptionsClient<$Result.GetResult<Prisma.$SubscriptionsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Subscriptions.
     * @param {SubscriptionsDeleteManyArgs} args - Arguments to filter Subscriptions to delete.
     * @example
     * // Delete a few Subscriptions
     * const { count } = await prisma.subscriptions.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SubscriptionsDeleteManyArgs>(args?: SelectSubset<T, SubscriptionsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Subscriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Subscriptions
     * const subscriptions = await prisma.subscriptions.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SubscriptionsUpdateManyArgs>(args: SelectSubset<T, SubscriptionsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Subscriptions and returns the data updated in the database.
     * @param {SubscriptionsUpdateManyAndReturnArgs} args - Arguments to update many Subscriptions.
     * @example
     * // Update many Subscriptions
     * const subscriptions = await prisma.subscriptions.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Subscriptions and only return the `id`
     * const subscriptionsWithIdOnly = await prisma.subscriptions.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SubscriptionsUpdateManyAndReturnArgs>(args: SelectSubset<T, SubscriptionsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubscriptionsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Subscriptions.
     * @param {SubscriptionsUpsertArgs} args - Arguments to update or create a Subscriptions.
     * @example
     * // Update or create a Subscriptions
     * const subscriptions = await prisma.subscriptions.upsert({
     *   create: {
     *     // ... data to create a Subscriptions
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Subscriptions we want to update
     *   }
     * })
     */
    upsert<T extends SubscriptionsUpsertArgs>(args: SelectSubset<T, SubscriptionsUpsertArgs<ExtArgs>>): Prisma__SubscriptionsClient<$Result.GetResult<Prisma.$SubscriptionsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Subscriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionsCountArgs} args - Arguments to filter Subscriptions to count.
     * @example
     * // Count the number of Subscriptions
     * const count = await prisma.subscriptions.count({
     *   where: {
     *     // ... the filter for the Subscriptions we want to count
     *   }
     * })
    **/
    count<T extends SubscriptionsCountArgs>(
      args?: Subset<T, SubscriptionsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SubscriptionsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Subscriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SubscriptionsAggregateArgs>(args: Subset<T, SubscriptionsAggregateArgs>): Prisma.PrismaPromise<GetSubscriptionsAggregateType<T>>

    /**
     * Group by Subscriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SubscriptionsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SubscriptionsGroupByArgs['orderBy'] }
        : { orderBy?: SubscriptionsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SubscriptionsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSubscriptionsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Subscriptions model
   */
  readonly fields: SubscriptionsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Subscriptions.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SubscriptionsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    bond<T extends BondsDefaultArgs<ExtArgs> = {}>(args?: Subset<T, BondsDefaultArgs<ExtArgs>>): Prisma__BondsClient<$Result.GetResult<Prisma.$BondsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    user<T extends UsersDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UsersDefaultArgs<ExtArgs>>): Prisma__UsersClient<$Result.GetResult<Prisma.$UsersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Subscriptions model
   */
  interface SubscriptionsFieldRefs {
    readonly id: FieldRef<"Subscriptions", 'String'>
    readonly bond_id: FieldRef<"Subscriptions", 'String'>
    readonly user_id: FieldRef<"Subscriptions", 'String'>
    readonly wallet_address: FieldRef<"Subscriptions", 'String'>
    readonly committed_amount: FieldRef<"Subscriptions", 'BigInt'>
    readonly tx_hash: FieldRef<"Subscriptions", 'String'>
    readonly subscription_amt: FieldRef<"Subscriptions", 'BigInt'>
    readonly created_at: FieldRef<"Subscriptions", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Subscriptions findUnique
   */
  export type SubscriptionsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscriptions
     */
    select?: SubscriptionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscriptions
     */
    omit?: SubscriptionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionsInclude<ExtArgs> | null
    /**
     * Filter, which Subscriptions to fetch.
     */
    where: SubscriptionsWhereUniqueInput
  }

  /**
   * Subscriptions findUniqueOrThrow
   */
  export type SubscriptionsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscriptions
     */
    select?: SubscriptionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscriptions
     */
    omit?: SubscriptionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionsInclude<ExtArgs> | null
    /**
     * Filter, which Subscriptions to fetch.
     */
    where: SubscriptionsWhereUniqueInput
  }

  /**
   * Subscriptions findFirst
   */
  export type SubscriptionsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscriptions
     */
    select?: SubscriptionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscriptions
     */
    omit?: SubscriptionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionsInclude<ExtArgs> | null
    /**
     * Filter, which Subscriptions to fetch.
     */
    where?: SubscriptionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Subscriptions to fetch.
     */
    orderBy?: SubscriptionsOrderByWithRelationInput | SubscriptionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Subscriptions.
     */
    cursor?: SubscriptionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Subscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Subscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Subscriptions.
     */
    distinct?: SubscriptionsScalarFieldEnum | SubscriptionsScalarFieldEnum[]
  }

  /**
   * Subscriptions findFirstOrThrow
   */
  export type SubscriptionsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscriptions
     */
    select?: SubscriptionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscriptions
     */
    omit?: SubscriptionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionsInclude<ExtArgs> | null
    /**
     * Filter, which Subscriptions to fetch.
     */
    where?: SubscriptionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Subscriptions to fetch.
     */
    orderBy?: SubscriptionsOrderByWithRelationInput | SubscriptionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Subscriptions.
     */
    cursor?: SubscriptionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Subscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Subscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Subscriptions.
     */
    distinct?: SubscriptionsScalarFieldEnum | SubscriptionsScalarFieldEnum[]
  }

  /**
   * Subscriptions findMany
   */
  export type SubscriptionsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscriptions
     */
    select?: SubscriptionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscriptions
     */
    omit?: SubscriptionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionsInclude<ExtArgs> | null
    /**
     * Filter, which Subscriptions to fetch.
     */
    where?: SubscriptionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Subscriptions to fetch.
     */
    orderBy?: SubscriptionsOrderByWithRelationInput | SubscriptionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Subscriptions.
     */
    cursor?: SubscriptionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Subscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Subscriptions.
     */
    skip?: number
    distinct?: SubscriptionsScalarFieldEnum | SubscriptionsScalarFieldEnum[]
  }

  /**
   * Subscriptions create
   */
  export type SubscriptionsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscriptions
     */
    select?: SubscriptionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscriptions
     */
    omit?: SubscriptionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionsInclude<ExtArgs> | null
    /**
     * The data needed to create a Subscriptions.
     */
    data: XOR<SubscriptionsCreateInput, SubscriptionsUncheckedCreateInput>
  }

  /**
   * Subscriptions createMany
   */
  export type SubscriptionsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Subscriptions.
     */
    data: SubscriptionsCreateManyInput | SubscriptionsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Subscriptions createManyAndReturn
   */
  export type SubscriptionsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscriptions
     */
    select?: SubscriptionsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Subscriptions
     */
    omit?: SubscriptionsOmit<ExtArgs> | null
    /**
     * The data used to create many Subscriptions.
     */
    data: SubscriptionsCreateManyInput | SubscriptionsCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionsIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Subscriptions update
   */
  export type SubscriptionsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscriptions
     */
    select?: SubscriptionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscriptions
     */
    omit?: SubscriptionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionsInclude<ExtArgs> | null
    /**
     * The data needed to update a Subscriptions.
     */
    data: XOR<SubscriptionsUpdateInput, SubscriptionsUncheckedUpdateInput>
    /**
     * Choose, which Subscriptions to update.
     */
    where: SubscriptionsWhereUniqueInput
  }

  /**
   * Subscriptions updateMany
   */
  export type SubscriptionsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Subscriptions.
     */
    data: XOR<SubscriptionsUpdateManyMutationInput, SubscriptionsUncheckedUpdateManyInput>
    /**
     * Filter which Subscriptions to update
     */
    where?: SubscriptionsWhereInput
    /**
     * Limit how many Subscriptions to update.
     */
    limit?: number
  }

  /**
   * Subscriptions updateManyAndReturn
   */
  export type SubscriptionsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscriptions
     */
    select?: SubscriptionsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Subscriptions
     */
    omit?: SubscriptionsOmit<ExtArgs> | null
    /**
     * The data used to update Subscriptions.
     */
    data: XOR<SubscriptionsUpdateManyMutationInput, SubscriptionsUncheckedUpdateManyInput>
    /**
     * Filter which Subscriptions to update
     */
    where?: SubscriptionsWhereInput
    /**
     * Limit how many Subscriptions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionsIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Subscriptions upsert
   */
  export type SubscriptionsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscriptions
     */
    select?: SubscriptionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscriptions
     */
    omit?: SubscriptionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionsInclude<ExtArgs> | null
    /**
     * The filter to search for the Subscriptions to update in case it exists.
     */
    where: SubscriptionsWhereUniqueInput
    /**
     * In case the Subscriptions found by the `where` argument doesn't exist, create a new Subscriptions with this data.
     */
    create: XOR<SubscriptionsCreateInput, SubscriptionsUncheckedCreateInput>
    /**
     * In case the Subscriptions was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SubscriptionsUpdateInput, SubscriptionsUncheckedUpdateInput>
  }

  /**
   * Subscriptions delete
   */
  export type SubscriptionsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscriptions
     */
    select?: SubscriptionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscriptions
     */
    omit?: SubscriptionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionsInclude<ExtArgs> | null
    /**
     * Filter which Subscriptions to delete.
     */
    where: SubscriptionsWhereUniqueInput
  }

  /**
   * Subscriptions deleteMany
   */
  export type SubscriptionsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Subscriptions to delete
     */
    where?: SubscriptionsWhereInput
    /**
     * Limit how many Subscriptions to delete.
     */
    limit?: number
  }

  /**
   * Subscriptions without action
   */
  export type SubscriptionsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscriptions
     */
    select?: SubscriptionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscriptions
     */
    omit?: SubscriptionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionsInclude<ExtArgs> | null
  }


  /**
   * Model Transactions
   */

  export type AggregateTransactions = {
    _count: TransactionsCountAggregateOutputType | null
    _min: TransactionsMinAggregateOutputType | null
    _max: TransactionsMaxAggregateOutputType | null
  }

  export type TransactionsMinAggregateOutputType = {
    id: string | null
    bond_id: string | null
    user_from: string | null
    user_to: string | null
    tx_hash: string | null
    created_at: Date | null
  }

  export type TransactionsMaxAggregateOutputType = {
    id: string | null
    bond_id: string | null
    user_from: string | null
    user_to: string | null
    tx_hash: string | null
    created_at: Date | null
  }

  export type TransactionsCountAggregateOutputType = {
    id: number
    bond_id: number
    user_from: number
    user_to: number
    tx_hash: number
    created_at: number
    _all: number
  }


  export type TransactionsMinAggregateInputType = {
    id?: true
    bond_id?: true
    user_from?: true
    user_to?: true
    tx_hash?: true
    created_at?: true
  }

  export type TransactionsMaxAggregateInputType = {
    id?: true
    bond_id?: true
    user_from?: true
    user_to?: true
    tx_hash?: true
    created_at?: true
  }

  export type TransactionsCountAggregateInputType = {
    id?: true
    bond_id?: true
    user_from?: true
    user_to?: true
    tx_hash?: true
    created_at?: true
    _all?: true
  }

  export type TransactionsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Transactions to aggregate.
     */
    where?: TransactionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transactions to fetch.
     */
    orderBy?: TransactionsOrderByWithRelationInput | TransactionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TransactionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Transactions
    **/
    _count?: true | TransactionsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TransactionsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TransactionsMaxAggregateInputType
  }

  export type GetTransactionsAggregateType<T extends TransactionsAggregateArgs> = {
        [P in keyof T & keyof AggregateTransactions]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTransactions[P]>
      : GetScalarType<T[P], AggregateTransactions[P]>
  }




  export type TransactionsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TransactionsWhereInput
    orderBy?: TransactionsOrderByWithAggregationInput | TransactionsOrderByWithAggregationInput[]
    by: TransactionsScalarFieldEnum[] | TransactionsScalarFieldEnum
    having?: TransactionsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TransactionsCountAggregateInputType | true
    _min?: TransactionsMinAggregateInputType
    _max?: TransactionsMaxAggregateInputType
  }

  export type TransactionsGroupByOutputType = {
    id: string
    bond_id: string
    user_from: string
    user_to: string
    tx_hash: string
    created_at: Date
    _count: TransactionsCountAggregateOutputType | null
    _min: TransactionsMinAggregateOutputType | null
    _max: TransactionsMaxAggregateOutputType | null
  }

  type GetTransactionsGroupByPayload<T extends TransactionsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TransactionsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TransactionsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TransactionsGroupByOutputType[P]>
            : GetScalarType<T[P], TransactionsGroupByOutputType[P]>
        }
      >
    >


  export type TransactionsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    bond_id?: boolean
    user_from?: boolean
    user_to?: boolean
    tx_hash?: boolean
    created_at?: boolean
    bond?: boolean | BondsDefaultArgs<ExtArgs>
    from?: boolean | UsersDefaultArgs<ExtArgs>
    to?: boolean | UsersDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["transactions"]>

  export type TransactionsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    bond_id?: boolean
    user_from?: boolean
    user_to?: boolean
    tx_hash?: boolean
    created_at?: boolean
    bond?: boolean | BondsDefaultArgs<ExtArgs>
    from?: boolean | UsersDefaultArgs<ExtArgs>
    to?: boolean | UsersDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["transactions"]>

  export type TransactionsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    bond_id?: boolean
    user_from?: boolean
    user_to?: boolean
    tx_hash?: boolean
    created_at?: boolean
    bond?: boolean | BondsDefaultArgs<ExtArgs>
    from?: boolean | UsersDefaultArgs<ExtArgs>
    to?: boolean | UsersDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["transactions"]>

  export type TransactionsSelectScalar = {
    id?: boolean
    bond_id?: boolean
    user_from?: boolean
    user_to?: boolean
    tx_hash?: boolean
    created_at?: boolean
  }

  export type TransactionsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "bond_id" | "user_from" | "user_to" | "tx_hash" | "created_at", ExtArgs["result"]["transactions"]>
  export type TransactionsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    bond?: boolean | BondsDefaultArgs<ExtArgs>
    from?: boolean | UsersDefaultArgs<ExtArgs>
    to?: boolean | UsersDefaultArgs<ExtArgs>
  }
  export type TransactionsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    bond?: boolean | BondsDefaultArgs<ExtArgs>
    from?: boolean | UsersDefaultArgs<ExtArgs>
    to?: boolean | UsersDefaultArgs<ExtArgs>
  }
  export type TransactionsIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    bond?: boolean | BondsDefaultArgs<ExtArgs>
    from?: boolean | UsersDefaultArgs<ExtArgs>
    to?: boolean | UsersDefaultArgs<ExtArgs>
  }

  export type $TransactionsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Transactions"
    objects: {
      bond: Prisma.$BondsPayload<ExtArgs>
      from: Prisma.$UsersPayload<ExtArgs>
      to: Prisma.$UsersPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      bond_id: string
      user_from: string
      user_to: string
      tx_hash: string
      created_at: Date
    }, ExtArgs["result"]["transactions"]>
    composites: {}
  }

  type TransactionsGetPayload<S extends boolean | null | undefined | TransactionsDefaultArgs> = $Result.GetResult<Prisma.$TransactionsPayload, S>

  type TransactionsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TransactionsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TransactionsCountAggregateInputType | true
    }

  export interface TransactionsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Transactions'], meta: { name: 'Transactions' } }
    /**
     * Find zero or one Transactions that matches the filter.
     * @param {TransactionsFindUniqueArgs} args - Arguments to find a Transactions
     * @example
     * // Get one Transactions
     * const transactions = await prisma.transactions.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TransactionsFindUniqueArgs>(args: SelectSubset<T, TransactionsFindUniqueArgs<ExtArgs>>): Prisma__TransactionsClient<$Result.GetResult<Prisma.$TransactionsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Transactions that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TransactionsFindUniqueOrThrowArgs} args - Arguments to find a Transactions
     * @example
     * // Get one Transactions
     * const transactions = await prisma.transactions.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TransactionsFindUniqueOrThrowArgs>(args: SelectSubset<T, TransactionsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TransactionsClient<$Result.GetResult<Prisma.$TransactionsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Transactions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionsFindFirstArgs} args - Arguments to find a Transactions
     * @example
     * // Get one Transactions
     * const transactions = await prisma.transactions.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TransactionsFindFirstArgs>(args?: SelectSubset<T, TransactionsFindFirstArgs<ExtArgs>>): Prisma__TransactionsClient<$Result.GetResult<Prisma.$TransactionsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Transactions that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionsFindFirstOrThrowArgs} args - Arguments to find a Transactions
     * @example
     * // Get one Transactions
     * const transactions = await prisma.transactions.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TransactionsFindFirstOrThrowArgs>(args?: SelectSubset<T, TransactionsFindFirstOrThrowArgs<ExtArgs>>): Prisma__TransactionsClient<$Result.GetResult<Prisma.$TransactionsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Transactions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Transactions
     * const transactions = await prisma.transactions.findMany()
     * 
     * // Get first 10 Transactions
     * const transactions = await prisma.transactions.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const transactionsWithIdOnly = await prisma.transactions.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TransactionsFindManyArgs>(args?: SelectSubset<T, TransactionsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Transactions.
     * @param {TransactionsCreateArgs} args - Arguments to create a Transactions.
     * @example
     * // Create one Transactions
     * const Transactions = await prisma.transactions.create({
     *   data: {
     *     // ... data to create a Transactions
     *   }
     * })
     * 
     */
    create<T extends TransactionsCreateArgs>(args: SelectSubset<T, TransactionsCreateArgs<ExtArgs>>): Prisma__TransactionsClient<$Result.GetResult<Prisma.$TransactionsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Transactions.
     * @param {TransactionsCreateManyArgs} args - Arguments to create many Transactions.
     * @example
     * // Create many Transactions
     * const transactions = await prisma.transactions.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TransactionsCreateManyArgs>(args?: SelectSubset<T, TransactionsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Transactions and returns the data saved in the database.
     * @param {TransactionsCreateManyAndReturnArgs} args - Arguments to create many Transactions.
     * @example
     * // Create many Transactions
     * const transactions = await prisma.transactions.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Transactions and only return the `id`
     * const transactionsWithIdOnly = await prisma.transactions.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TransactionsCreateManyAndReturnArgs>(args?: SelectSubset<T, TransactionsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Transactions.
     * @param {TransactionsDeleteArgs} args - Arguments to delete one Transactions.
     * @example
     * // Delete one Transactions
     * const Transactions = await prisma.transactions.delete({
     *   where: {
     *     // ... filter to delete one Transactions
     *   }
     * })
     * 
     */
    delete<T extends TransactionsDeleteArgs>(args: SelectSubset<T, TransactionsDeleteArgs<ExtArgs>>): Prisma__TransactionsClient<$Result.GetResult<Prisma.$TransactionsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Transactions.
     * @param {TransactionsUpdateArgs} args - Arguments to update one Transactions.
     * @example
     * // Update one Transactions
     * const transactions = await prisma.transactions.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TransactionsUpdateArgs>(args: SelectSubset<T, TransactionsUpdateArgs<ExtArgs>>): Prisma__TransactionsClient<$Result.GetResult<Prisma.$TransactionsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Transactions.
     * @param {TransactionsDeleteManyArgs} args - Arguments to filter Transactions to delete.
     * @example
     * // Delete a few Transactions
     * const { count } = await prisma.transactions.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TransactionsDeleteManyArgs>(args?: SelectSubset<T, TransactionsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Transactions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Transactions
     * const transactions = await prisma.transactions.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TransactionsUpdateManyArgs>(args: SelectSubset<T, TransactionsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Transactions and returns the data updated in the database.
     * @param {TransactionsUpdateManyAndReturnArgs} args - Arguments to update many Transactions.
     * @example
     * // Update many Transactions
     * const transactions = await prisma.transactions.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Transactions and only return the `id`
     * const transactionsWithIdOnly = await prisma.transactions.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TransactionsUpdateManyAndReturnArgs>(args: SelectSubset<T, TransactionsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Transactions.
     * @param {TransactionsUpsertArgs} args - Arguments to update or create a Transactions.
     * @example
     * // Update or create a Transactions
     * const transactions = await prisma.transactions.upsert({
     *   create: {
     *     // ... data to create a Transactions
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Transactions we want to update
     *   }
     * })
     */
    upsert<T extends TransactionsUpsertArgs>(args: SelectSubset<T, TransactionsUpsertArgs<ExtArgs>>): Prisma__TransactionsClient<$Result.GetResult<Prisma.$TransactionsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Transactions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionsCountArgs} args - Arguments to filter Transactions to count.
     * @example
     * // Count the number of Transactions
     * const count = await prisma.transactions.count({
     *   where: {
     *     // ... the filter for the Transactions we want to count
     *   }
     * })
    **/
    count<T extends TransactionsCountArgs>(
      args?: Subset<T, TransactionsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TransactionsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Transactions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TransactionsAggregateArgs>(args: Subset<T, TransactionsAggregateArgs>): Prisma.PrismaPromise<GetTransactionsAggregateType<T>>

    /**
     * Group by Transactions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TransactionsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TransactionsGroupByArgs['orderBy'] }
        : { orderBy?: TransactionsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TransactionsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTransactionsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Transactions model
   */
  readonly fields: TransactionsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Transactions.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TransactionsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    bond<T extends BondsDefaultArgs<ExtArgs> = {}>(args?: Subset<T, BondsDefaultArgs<ExtArgs>>): Prisma__BondsClient<$Result.GetResult<Prisma.$BondsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    from<T extends UsersDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UsersDefaultArgs<ExtArgs>>): Prisma__UsersClient<$Result.GetResult<Prisma.$UsersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    to<T extends UsersDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UsersDefaultArgs<ExtArgs>>): Prisma__UsersClient<$Result.GetResult<Prisma.$UsersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Transactions model
   */
  interface TransactionsFieldRefs {
    readonly id: FieldRef<"Transactions", 'String'>
    readonly bond_id: FieldRef<"Transactions", 'String'>
    readonly user_from: FieldRef<"Transactions", 'String'>
    readonly user_to: FieldRef<"Transactions", 'String'>
    readonly tx_hash: FieldRef<"Transactions", 'String'>
    readonly created_at: FieldRef<"Transactions", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Transactions findUnique
   */
  export type TransactionsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transactions
     */
    select?: TransactionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transactions
     */
    omit?: TransactionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionsInclude<ExtArgs> | null
    /**
     * Filter, which Transactions to fetch.
     */
    where: TransactionsWhereUniqueInput
  }

  /**
   * Transactions findUniqueOrThrow
   */
  export type TransactionsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transactions
     */
    select?: TransactionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transactions
     */
    omit?: TransactionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionsInclude<ExtArgs> | null
    /**
     * Filter, which Transactions to fetch.
     */
    where: TransactionsWhereUniqueInput
  }

  /**
   * Transactions findFirst
   */
  export type TransactionsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transactions
     */
    select?: TransactionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transactions
     */
    omit?: TransactionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionsInclude<ExtArgs> | null
    /**
     * Filter, which Transactions to fetch.
     */
    where?: TransactionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transactions to fetch.
     */
    orderBy?: TransactionsOrderByWithRelationInput | TransactionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Transactions.
     */
    cursor?: TransactionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Transactions.
     */
    distinct?: TransactionsScalarFieldEnum | TransactionsScalarFieldEnum[]
  }

  /**
   * Transactions findFirstOrThrow
   */
  export type TransactionsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transactions
     */
    select?: TransactionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transactions
     */
    omit?: TransactionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionsInclude<ExtArgs> | null
    /**
     * Filter, which Transactions to fetch.
     */
    where?: TransactionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transactions to fetch.
     */
    orderBy?: TransactionsOrderByWithRelationInput | TransactionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Transactions.
     */
    cursor?: TransactionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Transactions.
     */
    distinct?: TransactionsScalarFieldEnum | TransactionsScalarFieldEnum[]
  }

  /**
   * Transactions findMany
   */
  export type TransactionsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transactions
     */
    select?: TransactionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transactions
     */
    omit?: TransactionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionsInclude<ExtArgs> | null
    /**
     * Filter, which Transactions to fetch.
     */
    where?: TransactionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transactions to fetch.
     */
    orderBy?: TransactionsOrderByWithRelationInput | TransactionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Transactions.
     */
    cursor?: TransactionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transactions.
     */
    skip?: number
    distinct?: TransactionsScalarFieldEnum | TransactionsScalarFieldEnum[]
  }

  /**
   * Transactions create
   */
  export type TransactionsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transactions
     */
    select?: TransactionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transactions
     */
    omit?: TransactionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionsInclude<ExtArgs> | null
    /**
     * The data needed to create a Transactions.
     */
    data: XOR<TransactionsCreateInput, TransactionsUncheckedCreateInput>
  }

  /**
   * Transactions createMany
   */
  export type TransactionsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Transactions.
     */
    data: TransactionsCreateManyInput | TransactionsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Transactions createManyAndReturn
   */
  export type TransactionsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transactions
     */
    select?: TransactionsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Transactions
     */
    omit?: TransactionsOmit<ExtArgs> | null
    /**
     * The data used to create many Transactions.
     */
    data: TransactionsCreateManyInput | TransactionsCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionsIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Transactions update
   */
  export type TransactionsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transactions
     */
    select?: TransactionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transactions
     */
    omit?: TransactionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionsInclude<ExtArgs> | null
    /**
     * The data needed to update a Transactions.
     */
    data: XOR<TransactionsUpdateInput, TransactionsUncheckedUpdateInput>
    /**
     * Choose, which Transactions to update.
     */
    where: TransactionsWhereUniqueInput
  }

  /**
   * Transactions updateMany
   */
  export type TransactionsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Transactions.
     */
    data: XOR<TransactionsUpdateManyMutationInput, TransactionsUncheckedUpdateManyInput>
    /**
     * Filter which Transactions to update
     */
    where?: TransactionsWhereInput
    /**
     * Limit how many Transactions to update.
     */
    limit?: number
  }

  /**
   * Transactions updateManyAndReturn
   */
  export type TransactionsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transactions
     */
    select?: TransactionsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Transactions
     */
    omit?: TransactionsOmit<ExtArgs> | null
    /**
     * The data used to update Transactions.
     */
    data: XOR<TransactionsUpdateManyMutationInput, TransactionsUncheckedUpdateManyInput>
    /**
     * Filter which Transactions to update
     */
    where?: TransactionsWhereInput
    /**
     * Limit how many Transactions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionsIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Transactions upsert
   */
  export type TransactionsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transactions
     */
    select?: TransactionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transactions
     */
    omit?: TransactionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionsInclude<ExtArgs> | null
    /**
     * The filter to search for the Transactions to update in case it exists.
     */
    where: TransactionsWhereUniqueInput
    /**
     * In case the Transactions found by the `where` argument doesn't exist, create a new Transactions with this data.
     */
    create: XOR<TransactionsCreateInput, TransactionsUncheckedCreateInput>
    /**
     * In case the Transactions was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TransactionsUpdateInput, TransactionsUncheckedUpdateInput>
  }

  /**
   * Transactions delete
   */
  export type TransactionsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transactions
     */
    select?: TransactionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transactions
     */
    omit?: TransactionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionsInclude<ExtArgs> | null
    /**
     * Filter which Transactions to delete.
     */
    where: TransactionsWhereUniqueInput
  }

  /**
   * Transactions deleteMany
   */
  export type TransactionsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Transactions to delete
     */
    where?: TransactionsWhereInput
    /**
     * Limit how many Transactions to delete.
     */
    limit?: number
  }

  /**
   * Transactions without action
   */
  export type TransactionsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transactions
     */
    select?: TransactionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transactions
     */
    omit?: TransactionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionsInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UsersScalarFieldEnum: {
    id: 'id',
    name: 'name',
    national_id: 'national_id',
    wallet_address: 'wallet_address',
    salt: 'salt',
    email: 'email',
    date_of_birth: 'date_of_birth',
    password: 'password',
    role: 'role',
    hashed_mnemonic: 'hashed_mnemonic',
    created_at: 'created_at',
    kyc_status: 'kyc_status'
  };

  export type UsersScalarFieldEnum = (typeof UsersScalarFieldEnum)[keyof typeof UsersScalarFieldEnum]


  export const EKYCVerificationsScalarFieldEnum: {
    id: 'id',
    user_id: 'user_id',
    national_id_hash: 'national_id_hash',
    date_of_birth: 'date_of_birth',
    age: 'age',
    custodial_address: 'custodial_address',
    tx_digest: 'tx_digest',
    status: 'status',
    reason: 'reason',
    request_id: 'request_id',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type EKYCVerificationsScalarFieldEnum = (typeof EKYCVerificationsScalarFieldEnum)[keyof typeof EKYCVerificationsScalarFieldEnum]


  export const BondsScalarFieldEnum: {
    id: 'id',
    bond_object_id: 'bond_object_id',
    bond_name: 'bond_name',
    bond_type: 'bond_type',
    bond_symbol: 'bond_symbol',
    organization_name: 'organization_name',
    face_value: 'face_value',
    tl_unit_offered: 'tl_unit_offered',
    tl_unit_subscribed: 'tl_unit_subscribed',
    maturity: 'maturity',
    status: 'status',
    interest_rate: 'interest_rate',
    purpose: 'purpose',
    market: 'market',
    created_at: 'created_at',
    subscription_period: 'subscription_period',
    subscription_end_date: 'subscription_end_date'
  };

  export type BondsScalarFieldEnum = (typeof BondsScalarFieldEnum)[keyof typeof BondsScalarFieldEnum]


  export const EventsScalarFieldEnum: {
    id: 'id',
    type: 'type',
    bond_id: 'bond_id',
    user_id: 'user_id',
    details: 'details',
    tx_hash: 'tx_hash',
    created_at: 'created_at'
  };

  export type EventsScalarFieldEnum = (typeof EventsScalarFieldEnum)[keyof typeof EventsScalarFieldEnum]


  export const SubscriptionsScalarFieldEnum: {
    id: 'id',
    bond_id: 'bond_id',
    user_id: 'user_id',
    wallet_address: 'wallet_address',
    committed_amount: 'committed_amount',
    tx_hash: 'tx_hash',
    subscription_amt: 'subscription_amt',
    created_at: 'created_at'
  };

  export type SubscriptionsScalarFieldEnum = (typeof SubscriptionsScalarFieldEnum)[keyof typeof SubscriptionsScalarFieldEnum]


  export const TransactionsScalarFieldEnum: {
    id: 'id',
    bond_id: 'bond_id',
    user_from: 'user_from',
    user_to: 'user_to',
    tx_hash: 'tx_hash',
    created_at: 'created_at'
  };

  export type TransactionsScalarFieldEnum = (typeof TransactionsScalarFieldEnum)[keyof typeof TransactionsScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'BigInt'
   */
  export type BigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt'>
    


  /**
   * Reference to a field of type 'BigInt[]'
   */
  export type ListBigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Role'
   */
  export type EnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role'>
    


  /**
   * Reference to a field of type 'Role[]'
   */
  export type ListEnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role[]'>
    


  /**
   * Reference to a field of type 'KYCStatus'
   */
  export type EnumKYCStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'KYCStatus'>
    


  /**
   * Reference to a field of type 'KYCStatus[]'
   */
  export type ListEnumKYCStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'KYCStatus[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'BondType'
   */
  export type EnumBondTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BondType'>
    


  /**
   * Reference to a field of type 'BondType[]'
   */
  export type ListEnumBondTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BondType[]'>
    


  /**
   * Reference to a field of type 'Status'
   */
  export type EnumStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Status'>
    


  /**
   * Reference to a field of type 'Status[]'
   */
  export type ListEnumStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Status[]'>
    


  /**
   * Reference to a field of type 'Market'
   */
  export type EnumMarketFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Market'>
    


  /**
   * Reference to a field of type 'Market[]'
   */
  export type ListEnumMarketFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Market[]'>
    


  /**
   * Reference to a field of type 'Type'
   */
  export type EnumTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Type'>
    


  /**
   * Reference to a field of type 'Type[]'
   */
  export type ListEnumTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Type[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UsersWhereInput = {
    AND?: UsersWhereInput | UsersWhereInput[]
    OR?: UsersWhereInput[]
    NOT?: UsersWhereInput | UsersWhereInput[]
    id?: StringFilter<"Users"> | string
    name?: StringNullableFilter<"Users"> | string | null
    national_id?: BigIntFilter<"Users"> | bigint | number
    wallet_address?: StringNullableFilter<"Users"> | string | null
    salt?: StringFilter<"Users"> | string
    email?: StringFilter<"Users"> | string
    date_of_birth?: DateTimeNullableFilter<"Users"> | Date | string | null
    password?: StringNullableFilter<"Users"> | string | null
    role?: EnumRoleFilter<"Users"> | $Enums.Role
    hashed_mnemonic?: StringNullableFilter<"Users"> | string | null
    created_at?: DateTimeFilter<"Users"> | Date | string
    kyc_status?: EnumKYCStatusFilter<"Users"> | $Enums.KYCStatus
    ekyc?: EKYCVerificationsListRelationFilter
    subscriptions?: SubscriptionsListRelationFilter
    events?: EventsListRelationFilter
    transactionsFrom?: TransactionsListRelationFilter
    transactionsTo?: TransactionsListRelationFilter
  }

  export type UsersOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrderInput | SortOrder
    national_id?: SortOrder
    wallet_address?: SortOrderInput | SortOrder
    salt?: SortOrder
    email?: SortOrder
    date_of_birth?: SortOrderInput | SortOrder
    password?: SortOrderInput | SortOrder
    role?: SortOrder
    hashed_mnemonic?: SortOrderInput | SortOrder
    created_at?: SortOrder
    kyc_status?: SortOrder
    ekyc?: EKYCVerificationsOrderByRelationAggregateInput
    subscriptions?: SubscriptionsOrderByRelationAggregateInput
    events?: EventsOrderByRelationAggregateInput
    transactionsFrom?: TransactionsOrderByRelationAggregateInput
    transactionsTo?: TransactionsOrderByRelationAggregateInput
  }

  export type UsersWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    national_id?: bigint | number
    wallet_address?: string
    email?: string
    AND?: UsersWhereInput | UsersWhereInput[]
    OR?: UsersWhereInput[]
    NOT?: UsersWhereInput | UsersWhereInput[]
    name?: StringNullableFilter<"Users"> | string | null
    salt?: StringFilter<"Users"> | string
    date_of_birth?: DateTimeNullableFilter<"Users"> | Date | string | null
    password?: StringNullableFilter<"Users"> | string | null
    role?: EnumRoleFilter<"Users"> | $Enums.Role
    hashed_mnemonic?: StringNullableFilter<"Users"> | string | null
    created_at?: DateTimeFilter<"Users"> | Date | string
    kyc_status?: EnumKYCStatusFilter<"Users"> | $Enums.KYCStatus
    ekyc?: EKYCVerificationsListRelationFilter
    subscriptions?: SubscriptionsListRelationFilter
    events?: EventsListRelationFilter
    transactionsFrom?: TransactionsListRelationFilter
    transactionsTo?: TransactionsListRelationFilter
  }, "id" | "national_id" | "wallet_address" | "email">

  export type UsersOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrderInput | SortOrder
    national_id?: SortOrder
    wallet_address?: SortOrderInput | SortOrder
    salt?: SortOrder
    email?: SortOrder
    date_of_birth?: SortOrderInput | SortOrder
    password?: SortOrderInput | SortOrder
    role?: SortOrder
    hashed_mnemonic?: SortOrderInput | SortOrder
    created_at?: SortOrder
    kyc_status?: SortOrder
    _count?: UsersCountOrderByAggregateInput
    _avg?: UsersAvgOrderByAggregateInput
    _max?: UsersMaxOrderByAggregateInput
    _min?: UsersMinOrderByAggregateInput
    _sum?: UsersSumOrderByAggregateInput
  }

  export type UsersScalarWhereWithAggregatesInput = {
    AND?: UsersScalarWhereWithAggregatesInput | UsersScalarWhereWithAggregatesInput[]
    OR?: UsersScalarWhereWithAggregatesInput[]
    NOT?: UsersScalarWhereWithAggregatesInput | UsersScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Users"> | string
    name?: StringNullableWithAggregatesFilter<"Users"> | string | null
    national_id?: BigIntWithAggregatesFilter<"Users"> | bigint | number
    wallet_address?: StringNullableWithAggregatesFilter<"Users"> | string | null
    salt?: StringWithAggregatesFilter<"Users"> | string
    email?: StringWithAggregatesFilter<"Users"> | string
    date_of_birth?: DateTimeNullableWithAggregatesFilter<"Users"> | Date | string | null
    password?: StringNullableWithAggregatesFilter<"Users"> | string | null
    role?: EnumRoleWithAggregatesFilter<"Users"> | $Enums.Role
    hashed_mnemonic?: StringNullableWithAggregatesFilter<"Users"> | string | null
    created_at?: DateTimeWithAggregatesFilter<"Users"> | Date | string
    kyc_status?: EnumKYCStatusWithAggregatesFilter<"Users"> | $Enums.KYCStatus
  }

  export type EKYCVerificationsWhereInput = {
    AND?: EKYCVerificationsWhereInput | EKYCVerificationsWhereInput[]
    OR?: EKYCVerificationsWhereInput[]
    NOT?: EKYCVerificationsWhereInput | EKYCVerificationsWhereInput[]
    id?: StringFilter<"EKYCVerifications"> | string
    user_id?: StringFilter<"EKYCVerifications"> | string
    national_id_hash?: StringFilter<"EKYCVerifications"> | string
    date_of_birth?: DateTimeFilter<"EKYCVerifications"> | Date | string
    age?: IntNullableFilter<"EKYCVerifications"> | number | null
    custodial_address?: StringFilter<"EKYCVerifications"> | string
    tx_digest?: StringNullableFilter<"EKYCVerifications"> | string | null
    status?: EnumKYCStatusFilter<"EKYCVerifications"> | $Enums.KYCStatus
    reason?: StringNullableFilter<"EKYCVerifications"> | string | null
    request_id?: StringNullableFilter<"EKYCVerifications"> | string | null
    created_at?: DateTimeFilter<"EKYCVerifications"> | Date | string
    updated_at?: DateTimeFilter<"EKYCVerifications"> | Date | string
    user?: XOR<UsersScalarRelationFilter, UsersWhereInput>
  }

  export type EKYCVerificationsOrderByWithRelationInput = {
    id?: SortOrder
    user_id?: SortOrder
    national_id_hash?: SortOrder
    date_of_birth?: SortOrder
    age?: SortOrderInput | SortOrder
    custodial_address?: SortOrder
    tx_digest?: SortOrderInput | SortOrder
    status?: SortOrder
    reason?: SortOrderInput | SortOrder
    request_id?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    user?: UsersOrderByWithRelationInput
  }

  export type EKYCVerificationsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: EKYCVerificationsWhereInput | EKYCVerificationsWhereInput[]
    OR?: EKYCVerificationsWhereInput[]
    NOT?: EKYCVerificationsWhereInput | EKYCVerificationsWhereInput[]
    user_id?: StringFilter<"EKYCVerifications"> | string
    national_id_hash?: StringFilter<"EKYCVerifications"> | string
    date_of_birth?: DateTimeFilter<"EKYCVerifications"> | Date | string
    age?: IntNullableFilter<"EKYCVerifications"> | number | null
    custodial_address?: StringFilter<"EKYCVerifications"> | string
    tx_digest?: StringNullableFilter<"EKYCVerifications"> | string | null
    status?: EnumKYCStatusFilter<"EKYCVerifications"> | $Enums.KYCStatus
    reason?: StringNullableFilter<"EKYCVerifications"> | string | null
    request_id?: StringNullableFilter<"EKYCVerifications"> | string | null
    created_at?: DateTimeFilter<"EKYCVerifications"> | Date | string
    updated_at?: DateTimeFilter<"EKYCVerifications"> | Date | string
    user?: XOR<UsersScalarRelationFilter, UsersWhereInput>
  }, "id">

  export type EKYCVerificationsOrderByWithAggregationInput = {
    id?: SortOrder
    user_id?: SortOrder
    national_id_hash?: SortOrder
    date_of_birth?: SortOrder
    age?: SortOrderInput | SortOrder
    custodial_address?: SortOrder
    tx_digest?: SortOrderInput | SortOrder
    status?: SortOrder
    reason?: SortOrderInput | SortOrder
    request_id?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: EKYCVerificationsCountOrderByAggregateInput
    _avg?: EKYCVerificationsAvgOrderByAggregateInput
    _max?: EKYCVerificationsMaxOrderByAggregateInput
    _min?: EKYCVerificationsMinOrderByAggregateInput
    _sum?: EKYCVerificationsSumOrderByAggregateInput
  }

  export type EKYCVerificationsScalarWhereWithAggregatesInput = {
    AND?: EKYCVerificationsScalarWhereWithAggregatesInput | EKYCVerificationsScalarWhereWithAggregatesInput[]
    OR?: EKYCVerificationsScalarWhereWithAggregatesInput[]
    NOT?: EKYCVerificationsScalarWhereWithAggregatesInput | EKYCVerificationsScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"EKYCVerifications"> | string
    user_id?: StringWithAggregatesFilter<"EKYCVerifications"> | string
    national_id_hash?: StringWithAggregatesFilter<"EKYCVerifications"> | string
    date_of_birth?: DateTimeWithAggregatesFilter<"EKYCVerifications"> | Date | string
    age?: IntNullableWithAggregatesFilter<"EKYCVerifications"> | number | null
    custodial_address?: StringWithAggregatesFilter<"EKYCVerifications"> | string
    tx_digest?: StringNullableWithAggregatesFilter<"EKYCVerifications"> | string | null
    status?: EnumKYCStatusWithAggregatesFilter<"EKYCVerifications"> | $Enums.KYCStatus
    reason?: StringNullableWithAggregatesFilter<"EKYCVerifications"> | string | null
    request_id?: StringNullableWithAggregatesFilter<"EKYCVerifications"> | string | null
    created_at?: DateTimeWithAggregatesFilter<"EKYCVerifications"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"EKYCVerifications"> | Date | string
  }

  export type BondsWhereInput = {
    AND?: BondsWhereInput | BondsWhereInput[]
    OR?: BondsWhereInput[]
    NOT?: BondsWhereInput | BondsWhereInput[]
    id?: StringFilter<"Bonds"> | string
    bond_object_id?: StringNullableFilter<"Bonds"> | string | null
    bond_name?: StringFilter<"Bonds"> | string
    bond_type?: EnumBondTypeFilter<"Bonds"> | $Enums.BondType
    bond_symbol?: StringFilter<"Bonds"> | string
    organization_name?: StringFilter<"Bonds"> | string
    face_value?: BigIntFilter<"Bonds"> | bigint | number
    tl_unit_offered?: IntFilter<"Bonds"> | number
    tl_unit_subscribed?: IntNullableFilter<"Bonds"> | number | null
    maturity?: DateTimeFilter<"Bonds"> | Date | string
    status?: EnumStatusFilter<"Bonds"> | $Enums.Status
    interest_rate?: StringFilter<"Bonds"> | string
    purpose?: StringFilter<"Bonds"> | string
    market?: EnumMarketNullableFilter<"Bonds"> | $Enums.Market | null
    created_at?: DateTimeFilter<"Bonds"> | Date | string
    subscription_period?: IntFilter<"Bonds"> | number
    subscription_end_date?: DateTimeFilter<"Bonds"> | Date | string
    subscriptions?: SubscriptionsListRelationFilter
    events?: EventsListRelationFilter
    transactions?: TransactionsListRelationFilter
  }

  export type BondsOrderByWithRelationInput = {
    id?: SortOrder
    bond_object_id?: SortOrderInput | SortOrder
    bond_name?: SortOrder
    bond_type?: SortOrder
    bond_symbol?: SortOrder
    organization_name?: SortOrder
    face_value?: SortOrder
    tl_unit_offered?: SortOrder
    tl_unit_subscribed?: SortOrderInput | SortOrder
    maturity?: SortOrder
    status?: SortOrder
    interest_rate?: SortOrder
    purpose?: SortOrder
    market?: SortOrderInput | SortOrder
    created_at?: SortOrder
    subscription_period?: SortOrder
    subscription_end_date?: SortOrder
    subscriptions?: SubscriptionsOrderByRelationAggregateInput
    events?: EventsOrderByRelationAggregateInput
    transactions?: TransactionsOrderByRelationAggregateInput
  }

  export type BondsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: BondsWhereInput | BondsWhereInput[]
    OR?: BondsWhereInput[]
    NOT?: BondsWhereInput | BondsWhereInput[]
    bond_object_id?: StringNullableFilter<"Bonds"> | string | null
    bond_name?: StringFilter<"Bonds"> | string
    bond_type?: EnumBondTypeFilter<"Bonds"> | $Enums.BondType
    bond_symbol?: StringFilter<"Bonds"> | string
    organization_name?: StringFilter<"Bonds"> | string
    face_value?: BigIntFilter<"Bonds"> | bigint | number
    tl_unit_offered?: IntFilter<"Bonds"> | number
    tl_unit_subscribed?: IntNullableFilter<"Bonds"> | number | null
    maturity?: DateTimeFilter<"Bonds"> | Date | string
    status?: EnumStatusFilter<"Bonds"> | $Enums.Status
    interest_rate?: StringFilter<"Bonds"> | string
    purpose?: StringFilter<"Bonds"> | string
    market?: EnumMarketNullableFilter<"Bonds"> | $Enums.Market | null
    created_at?: DateTimeFilter<"Bonds"> | Date | string
    subscription_period?: IntFilter<"Bonds"> | number
    subscription_end_date?: DateTimeFilter<"Bonds"> | Date | string
    subscriptions?: SubscriptionsListRelationFilter
    events?: EventsListRelationFilter
    transactions?: TransactionsListRelationFilter
  }, "id">

  export type BondsOrderByWithAggregationInput = {
    id?: SortOrder
    bond_object_id?: SortOrderInput | SortOrder
    bond_name?: SortOrder
    bond_type?: SortOrder
    bond_symbol?: SortOrder
    organization_name?: SortOrder
    face_value?: SortOrder
    tl_unit_offered?: SortOrder
    tl_unit_subscribed?: SortOrderInput | SortOrder
    maturity?: SortOrder
    status?: SortOrder
    interest_rate?: SortOrder
    purpose?: SortOrder
    market?: SortOrderInput | SortOrder
    created_at?: SortOrder
    subscription_period?: SortOrder
    subscription_end_date?: SortOrder
    _count?: BondsCountOrderByAggregateInput
    _avg?: BondsAvgOrderByAggregateInput
    _max?: BondsMaxOrderByAggregateInput
    _min?: BondsMinOrderByAggregateInput
    _sum?: BondsSumOrderByAggregateInput
  }

  export type BondsScalarWhereWithAggregatesInput = {
    AND?: BondsScalarWhereWithAggregatesInput | BondsScalarWhereWithAggregatesInput[]
    OR?: BondsScalarWhereWithAggregatesInput[]
    NOT?: BondsScalarWhereWithAggregatesInput | BondsScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Bonds"> | string
    bond_object_id?: StringNullableWithAggregatesFilter<"Bonds"> | string | null
    bond_name?: StringWithAggregatesFilter<"Bonds"> | string
    bond_type?: EnumBondTypeWithAggregatesFilter<"Bonds"> | $Enums.BondType
    bond_symbol?: StringWithAggregatesFilter<"Bonds"> | string
    organization_name?: StringWithAggregatesFilter<"Bonds"> | string
    face_value?: BigIntWithAggregatesFilter<"Bonds"> | bigint | number
    tl_unit_offered?: IntWithAggregatesFilter<"Bonds"> | number
    tl_unit_subscribed?: IntNullableWithAggregatesFilter<"Bonds"> | number | null
    maturity?: DateTimeWithAggregatesFilter<"Bonds"> | Date | string
    status?: EnumStatusWithAggregatesFilter<"Bonds"> | $Enums.Status
    interest_rate?: StringWithAggregatesFilter<"Bonds"> | string
    purpose?: StringWithAggregatesFilter<"Bonds"> | string
    market?: EnumMarketNullableWithAggregatesFilter<"Bonds"> | $Enums.Market | null
    created_at?: DateTimeWithAggregatesFilter<"Bonds"> | Date | string
    subscription_period?: IntWithAggregatesFilter<"Bonds"> | number
    subscription_end_date?: DateTimeWithAggregatesFilter<"Bonds"> | Date | string
  }

  export type EventsWhereInput = {
    AND?: EventsWhereInput | EventsWhereInput[]
    OR?: EventsWhereInput[]
    NOT?: EventsWhereInput | EventsWhereInput[]
    id?: StringFilter<"Events"> | string
    type?: EnumTypeFilter<"Events"> | $Enums.Type
    bond_id?: StringFilter<"Events"> | string
    user_id?: StringFilter<"Events"> | string
    details?: StringFilter<"Events"> | string
    tx_hash?: StringFilter<"Events"> | string
    created_at?: DateTimeFilter<"Events"> | Date | string
    bond?: XOR<BondsScalarRelationFilter, BondsWhereInput>
    user?: XOR<UsersScalarRelationFilter, UsersWhereInput>
  }

  export type EventsOrderByWithRelationInput = {
    id?: SortOrder
    type?: SortOrder
    bond_id?: SortOrder
    user_id?: SortOrder
    details?: SortOrder
    tx_hash?: SortOrder
    created_at?: SortOrder
    bond?: BondsOrderByWithRelationInput
    user?: UsersOrderByWithRelationInput
  }

  export type EventsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: EventsWhereInput | EventsWhereInput[]
    OR?: EventsWhereInput[]
    NOT?: EventsWhereInput | EventsWhereInput[]
    type?: EnumTypeFilter<"Events"> | $Enums.Type
    bond_id?: StringFilter<"Events"> | string
    user_id?: StringFilter<"Events"> | string
    details?: StringFilter<"Events"> | string
    tx_hash?: StringFilter<"Events"> | string
    created_at?: DateTimeFilter<"Events"> | Date | string
    bond?: XOR<BondsScalarRelationFilter, BondsWhereInput>
    user?: XOR<UsersScalarRelationFilter, UsersWhereInput>
  }, "id">

  export type EventsOrderByWithAggregationInput = {
    id?: SortOrder
    type?: SortOrder
    bond_id?: SortOrder
    user_id?: SortOrder
    details?: SortOrder
    tx_hash?: SortOrder
    created_at?: SortOrder
    _count?: EventsCountOrderByAggregateInput
    _max?: EventsMaxOrderByAggregateInput
    _min?: EventsMinOrderByAggregateInput
  }

  export type EventsScalarWhereWithAggregatesInput = {
    AND?: EventsScalarWhereWithAggregatesInput | EventsScalarWhereWithAggregatesInput[]
    OR?: EventsScalarWhereWithAggregatesInput[]
    NOT?: EventsScalarWhereWithAggregatesInput | EventsScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Events"> | string
    type?: EnumTypeWithAggregatesFilter<"Events"> | $Enums.Type
    bond_id?: StringWithAggregatesFilter<"Events"> | string
    user_id?: StringWithAggregatesFilter<"Events"> | string
    details?: StringWithAggregatesFilter<"Events"> | string
    tx_hash?: StringWithAggregatesFilter<"Events"> | string
    created_at?: DateTimeWithAggregatesFilter<"Events"> | Date | string
  }

  export type SubscriptionsWhereInput = {
    AND?: SubscriptionsWhereInput | SubscriptionsWhereInput[]
    OR?: SubscriptionsWhereInput[]
    NOT?: SubscriptionsWhereInput | SubscriptionsWhereInput[]
    id?: StringFilter<"Subscriptions"> | string
    bond_id?: StringFilter<"Subscriptions"> | string
    user_id?: StringFilter<"Subscriptions"> | string
    wallet_address?: StringFilter<"Subscriptions"> | string
    committed_amount?: BigIntFilter<"Subscriptions"> | bigint | number
    tx_hash?: StringFilter<"Subscriptions"> | string
    subscription_amt?: BigIntNullableFilter<"Subscriptions"> | bigint | number | null
    created_at?: DateTimeFilter<"Subscriptions"> | Date | string
    bond?: XOR<BondsScalarRelationFilter, BondsWhereInput>
    user?: XOR<UsersScalarRelationFilter, UsersWhereInput>
  }

  export type SubscriptionsOrderByWithRelationInput = {
    id?: SortOrder
    bond_id?: SortOrder
    user_id?: SortOrder
    wallet_address?: SortOrder
    committed_amount?: SortOrder
    tx_hash?: SortOrder
    subscription_amt?: SortOrderInput | SortOrder
    created_at?: SortOrder
    bond?: BondsOrderByWithRelationInput
    user?: UsersOrderByWithRelationInput
  }

  export type SubscriptionsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SubscriptionsWhereInput | SubscriptionsWhereInput[]
    OR?: SubscriptionsWhereInput[]
    NOT?: SubscriptionsWhereInput | SubscriptionsWhereInput[]
    bond_id?: StringFilter<"Subscriptions"> | string
    user_id?: StringFilter<"Subscriptions"> | string
    wallet_address?: StringFilter<"Subscriptions"> | string
    committed_amount?: BigIntFilter<"Subscriptions"> | bigint | number
    tx_hash?: StringFilter<"Subscriptions"> | string
    subscription_amt?: BigIntNullableFilter<"Subscriptions"> | bigint | number | null
    created_at?: DateTimeFilter<"Subscriptions"> | Date | string
    bond?: XOR<BondsScalarRelationFilter, BondsWhereInput>
    user?: XOR<UsersScalarRelationFilter, UsersWhereInput>
  }, "id">

  export type SubscriptionsOrderByWithAggregationInput = {
    id?: SortOrder
    bond_id?: SortOrder
    user_id?: SortOrder
    wallet_address?: SortOrder
    committed_amount?: SortOrder
    tx_hash?: SortOrder
    subscription_amt?: SortOrderInput | SortOrder
    created_at?: SortOrder
    _count?: SubscriptionsCountOrderByAggregateInput
    _avg?: SubscriptionsAvgOrderByAggregateInput
    _max?: SubscriptionsMaxOrderByAggregateInput
    _min?: SubscriptionsMinOrderByAggregateInput
    _sum?: SubscriptionsSumOrderByAggregateInput
  }

  export type SubscriptionsScalarWhereWithAggregatesInput = {
    AND?: SubscriptionsScalarWhereWithAggregatesInput | SubscriptionsScalarWhereWithAggregatesInput[]
    OR?: SubscriptionsScalarWhereWithAggregatesInput[]
    NOT?: SubscriptionsScalarWhereWithAggregatesInput | SubscriptionsScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Subscriptions"> | string
    bond_id?: StringWithAggregatesFilter<"Subscriptions"> | string
    user_id?: StringWithAggregatesFilter<"Subscriptions"> | string
    wallet_address?: StringWithAggregatesFilter<"Subscriptions"> | string
    committed_amount?: BigIntWithAggregatesFilter<"Subscriptions"> | bigint | number
    tx_hash?: StringWithAggregatesFilter<"Subscriptions"> | string
    subscription_amt?: BigIntNullableWithAggregatesFilter<"Subscriptions"> | bigint | number | null
    created_at?: DateTimeWithAggregatesFilter<"Subscriptions"> | Date | string
  }

  export type TransactionsWhereInput = {
    AND?: TransactionsWhereInput | TransactionsWhereInput[]
    OR?: TransactionsWhereInput[]
    NOT?: TransactionsWhereInput | TransactionsWhereInput[]
    id?: StringFilter<"Transactions"> | string
    bond_id?: StringFilter<"Transactions"> | string
    user_from?: StringFilter<"Transactions"> | string
    user_to?: StringFilter<"Transactions"> | string
    tx_hash?: StringFilter<"Transactions"> | string
    created_at?: DateTimeFilter<"Transactions"> | Date | string
    bond?: XOR<BondsScalarRelationFilter, BondsWhereInput>
    from?: XOR<UsersScalarRelationFilter, UsersWhereInput>
    to?: XOR<UsersScalarRelationFilter, UsersWhereInput>
  }

  export type TransactionsOrderByWithRelationInput = {
    id?: SortOrder
    bond_id?: SortOrder
    user_from?: SortOrder
    user_to?: SortOrder
    tx_hash?: SortOrder
    created_at?: SortOrder
    bond?: BondsOrderByWithRelationInput
    from?: UsersOrderByWithRelationInput
    to?: UsersOrderByWithRelationInput
  }

  export type TransactionsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TransactionsWhereInput | TransactionsWhereInput[]
    OR?: TransactionsWhereInput[]
    NOT?: TransactionsWhereInput | TransactionsWhereInput[]
    bond_id?: StringFilter<"Transactions"> | string
    user_from?: StringFilter<"Transactions"> | string
    user_to?: StringFilter<"Transactions"> | string
    tx_hash?: StringFilter<"Transactions"> | string
    created_at?: DateTimeFilter<"Transactions"> | Date | string
    bond?: XOR<BondsScalarRelationFilter, BondsWhereInput>
    from?: XOR<UsersScalarRelationFilter, UsersWhereInput>
    to?: XOR<UsersScalarRelationFilter, UsersWhereInput>
  }, "id">

  export type TransactionsOrderByWithAggregationInput = {
    id?: SortOrder
    bond_id?: SortOrder
    user_from?: SortOrder
    user_to?: SortOrder
    tx_hash?: SortOrder
    created_at?: SortOrder
    _count?: TransactionsCountOrderByAggregateInput
    _max?: TransactionsMaxOrderByAggregateInput
    _min?: TransactionsMinOrderByAggregateInput
  }

  export type TransactionsScalarWhereWithAggregatesInput = {
    AND?: TransactionsScalarWhereWithAggregatesInput | TransactionsScalarWhereWithAggregatesInput[]
    OR?: TransactionsScalarWhereWithAggregatesInput[]
    NOT?: TransactionsScalarWhereWithAggregatesInput | TransactionsScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Transactions"> | string
    bond_id?: StringWithAggregatesFilter<"Transactions"> | string
    user_from?: StringWithAggregatesFilter<"Transactions"> | string
    user_to?: StringWithAggregatesFilter<"Transactions"> | string
    tx_hash?: StringWithAggregatesFilter<"Transactions"> | string
    created_at?: DateTimeWithAggregatesFilter<"Transactions"> | Date | string
  }

  export type UsersCreateInput = {
    id?: string
    name?: string | null
    national_id: bigint | number
    wallet_address?: string | null
    salt: string
    email: string
    date_of_birth?: Date | string | null
    password?: string | null
    role: $Enums.Role
    hashed_mnemonic?: string | null
    created_at?: Date | string
    kyc_status?: $Enums.KYCStatus
    ekyc?: EKYCVerificationsCreateNestedManyWithoutUserInput
    subscriptions?: SubscriptionsCreateNestedManyWithoutUserInput
    events?: EventsCreateNestedManyWithoutUserInput
    transactionsFrom?: TransactionsCreateNestedManyWithoutFromInput
    transactionsTo?: TransactionsCreateNestedManyWithoutToInput
  }

  export type UsersUncheckedCreateInput = {
    id?: string
    name?: string | null
    national_id: bigint | number
    wallet_address?: string | null
    salt: string
    email: string
    date_of_birth?: Date | string | null
    password?: string | null
    role: $Enums.Role
    hashed_mnemonic?: string | null
    created_at?: Date | string
    kyc_status?: $Enums.KYCStatus
    ekyc?: EKYCVerificationsUncheckedCreateNestedManyWithoutUserInput
    subscriptions?: SubscriptionsUncheckedCreateNestedManyWithoutUserInput
    events?: EventsUncheckedCreateNestedManyWithoutUserInput
    transactionsFrom?: TransactionsUncheckedCreateNestedManyWithoutFromInput
    transactionsTo?: TransactionsUncheckedCreateNestedManyWithoutToInput
  }

  export type UsersUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    national_id?: BigIntFieldUpdateOperationsInput | bigint | number
    wallet_address?: NullableStringFieldUpdateOperationsInput | string | null
    salt?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    date_of_birth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    hashed_mnemonic?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    kyc_status?: EnumKYCStatusFieldUpdateOperationsInput | $Enums.KYCStatus
    ekyc?: EKYCVerificationsUpdateManyWithoutUserNestedInput
    subscriptions?: SubscriptionsUpdateManyWithoutUserNestedInput
    events?: EventsUpdateManyWithoutUserNestedInput
    transactionsFrom?: TransactionsUpdateManyWithoutFromNestedInput
    transactionsTo?: TransactionsUpdateManyWithoutToNestedInput
  }

  export type UsersUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    national_id?: BigIntFieldUpdateOperationsInput | bigint | number
    wallet_address?: NullableStringFieldUpdateOperationsInput | string | null
    salt?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    date_of_birth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    hashed_mnemonic?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    kyc_status?: EnumKYCStatusFieldUpdateOperationsInput | $Enums.KYCStatus
    ekyc?: EKYCVerificationsUncheckedUpdateManyWithoutUserNestedInput
    subscriptions?: SubscriptionsUncheckedUpdateManyWithoutUserNestedInput
    events?: EventsUncheckedUpdateManyWithoutUserNestedInput
    transactionsFrom?: TransactionsUncheckedUpdateManyWithoutFromNestedInput
    transactionsTo?: TransactionsUncheckedUpdateManyWithoutToNestedInput
  }

  export type UsersCreateManyInput = {
    id?: string
    name?: string | null
    national_id: bigint | number
    wallet_address?: string | null
    salt: string
    email: string
    date_of_birth?: Date | string | null
    password?: string | null
    role: $Enums.Role
    hashed_mnemonic?: string | null
    created_at?: Date | string
    kyc_status?: $Enums.KYCStatus
  }

  export type UsersUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    national_id?: BigIntFieldUpdateOperationsInput | bigint | number
    wallet_address?: NullableStringFieldUpdateOperationsInput | string | null
    salt?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    date_of_birth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    hashed_mnemonic?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    kyc_status?: EnumKYCStatusFieldUpdateOperationsInput | $Enums.KYCStatus
  }

  export type UsersUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    national_id?: BigIntFieldUpdateOperationsInput | bigint | number
    wallet_address?: NullableStringFieldUpdateOperationsInput | string | null
    salt?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    date_of_birth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    hashed_mnemonic?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    kyc_status?: EnumKYCStatusFieldUpdateOperationsInput | $Enums.KYCStatus
  }

  export type EKYCVerificationsCreateInput = {
    id?: string
    national_id_hash: string
    date_of_birth: Date | string
    age?: number | null
    custodial_address: string
    tx_digest?: string | null
    status?: $Enums.KYCStatus
    reason?: string | null
    request_id?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    user: UsersCreateNestedOneWithoutEkycInput
  }

  export type EKYCVerificationsUncheckedCreateInput = {
    id?: string
    user_id: string
    national_id_hash: string
    date_of_birth: Date | string
    age?: number | null
    custodial_address: string
    tx_digest?: string | null
    status?: $Enums.KYCStatus
    reason?: string | null
    request_id?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type EKYCVerificationsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    national_id_hash?: StringFieldUpdateOperationsInput | string
    date_of_birth?: DateTimeFieldUpdateOperationsInput | Date | string
    age?: NullableIntFieldUpdateOperationsInput | number | null
    custodial_address?: StringFieldUpdateOperationsInput | string
    tx_digest?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumKYCStatusFieldUpdateOperationsInput | $Enums.KYCStatus
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    request_id?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UsersUpdateOneRequiredWithoutEkycNestedInput
  }

  export type EKYCVerificationsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    national_id_hash?: StringFieldUpdateOperationsInput | string
    date_of_birth?: DateTimeFieldUpdateOperationsInput | Date | string
    age?: NullableIntFieldUpdateOperationsInput | number | null
    custodial_address?: StringFieldUpdateOperationsInput | string
    tx_digest?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumKYCStatusFieldUpdateOperationsInput | $Enums.KYCStatus
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    request_id?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EKYCVerificationsCreateManyInput = {
    id?: string
    user_id: string
    national_id_hash: string
    date_of_birth: Date | string
    age?: number | null
    custodial_address: string
    tx_digest?: string | null
    status?: $Enums.KYCStatus
    reason?: string | null
    request_id?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type EKYCVerificationsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    national_id_hash?: StringFieldUpdateOperationsInput | string
    date_of_birth?: DateTimeFieldUpdateOperationsInput | Date | string
    age?: NullableIntFieldUpdateOperationsInput | number | null
    custodial_address?: StringFieldUpdateOperationsInput | string
    tx_digest?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumKYCStatusFieldUpdateOperationsInput | $Enums.KYCStatus
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    request_id?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EKYCVerificationsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    national_id_hash?: StringFieldUpdateOperationsInput | string
    date_of_birth?: DateTimeFieldUpdateOperationsInput | Date | string
    age?: NullableIntFieldUpdateOperationsInput | number | null
    custodial_address?: StringFieldUpdateOperationsInput | string
    tx_digest?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumKYCStatusFieldUpdateOperationsInput | $Enums.KYCStatus
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    request_id?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BondsCreateInput = {
    id?: string
    bond_object_id?: string | null
    bond_name: string
    bond_type: $Enums.BondType
    bond_symbol: string
    organization_name: string
    face_value: bigint | number
    tl_unit_offered: number
    tl_unit_subscribed?: number | null
    maturity: Date | string
    status: $Enums.Status
    interest_rate: string
    purpose: string
    market?: $Enums.Market | null
    created_at?: Date | string
    subscription_period: number
    subscription_end_date: Date | string
    subscriptions?: SubscriptionsCreateNestedManyWithoutBondInput
    events?: EventsCreateNestedManyWithoutBondInput
    transactions?: TransactionsCreateNestedManyWithoutBondInput
  }

  export type BondsUncheckedCreateInput = {
    id?: string
    bond_object_id?: string | null
    bond_name: string
    bond_type: $Enums.BondType
    bond_symbol: string
    organization_name: string
    face_value: bigint | number
    tl_unit_offered: number
    tl_unit_subscribed?: number | null
    maturity: Date | string
    status: $Enums.Status
    interest_rate: string
    purpose: string
    market?: $Enums.Market | null
    created_at?: Date | string
    subscription_period: number
    subscription_end_date: Date | string
    subscriptions?: SubscriptionsUncheckedCreateNestedManyWithoutBondInput
    events?: EventsUncheckedCreateNestedManyWithoutBondInput
    transactions?: TransactionsUncheckedCreateNestedManyWithoutBondInput
  }

  export type BondsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    bond_object_id?: NullableStringFieldUpdateOperationsInput | string | null
    bond_name?: StringFieldUpdateOperationsInput | string
    bond_type?: EnumBondTypeFieldUpdateOperationsInput | $Enums.BondType
    bond_symbol?: StringFieldUpdateOperationsInput | string
    organization_name?: StringFieldUpdateOperationsInput | string
    face_value?: BigIntFieldUpdateOperationsInput | bigint | number
    tl_unit_offered?: IntFieldUpdateOperationsInput | number
    tl_unit_subscribed?: NullableIntFieldUpdateOperationsInput | number | null
    maturity?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumStatusFieldUpdateOperationsInput | $Enums.Status
    interest_rate?: StringFieldUpdateOperationsInput | string
    purpose?: StringFieldUpdateOperationsInput | string
    market?: NullableEnumMarketFieldUpdateOperationsInput | $Enums.Market | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    subscription_period?: IntFieldUpdateOperationsInput | number
    subscription_end_date?: DateTimeFieldUpdateOperationsInput | Date | string
    subscriptions?: SubscriptionsUpdateManyWithoutBondNestedInput
    events?: EventsUpdateManyWithoutBondNestedInput
    transactions?: TransactionsUpdateManyWithoutBondNestedInput
  }

  export type BondsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    bond_object_id?: NullableStringFieldUpdateOperationsInput | string | null
    bond_name?: StringFieldUpdateOperationsInput | string
    bond_type?: EnumBondTypeFieldUpdateOperationsInput | $Enums.BondType
    bond_symbol?: StringFieldUpdateOperationsInput | string
    organization_name?: StringFieldUpdateOperationsInput | string
    face_value?: BigIntFieldUpdateOperationsInput | bigint | number
    tl_unit_offered?: IntFieldUpdateOperationsInput | number
    tl_unit_subscribed?: NullableIntFieldUpdateOperationsInput | number | null
    maturity?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumStatusFieldUpdateOperationsInput | $Enums.Status
    interest_rate?: StringFieldUpdateOperationsInput | string
    purpose?: StringFieldUpdateOperationsInput | string
    market?: NullableEnumMarketFieldUpdateOperationsInput | $Enums.Market | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    subscription_period?: IntFieldUpdateOperationsInput | number
    subscription_end_date?: DateTimeFieldUpdateOperationsInput | Date | string
    subscriptions?: SubscriptionsUncheckedUpdateManyWithoutBondNestedInput
    events?: EventsUncheckedUpdateManyWithoutBondNestedInput
    transactions?: TransactionsUncheckedUpdateManyWithoutBondNestedInput
  }

  export type BondsCreateManyInput = {
    id?: string
    bond_object_id?: string | null
    bond_name: string
    bond_type: $Enums.BondType
    bond_symbol: string
    organization_name: string
    face_value: bigint | number
    tl_unit_offered: number
    tl_unit_subscribed?: number | null
    maturity: Date | string
    status: $Enums.Status
    interest_rate: string
    purpose: string
    market?: $Enums.Market | null
    created_at?: Date | string
    subscription_period: number
    subscription_end_date: Date | string
  }

  export type BondsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    bond_object_id?: NullableStringFieldUpdateOperationsInput | string | null
    bond_name?: StringFieldUpdateOperationsInput | string
    bond_type?: EnumBondTypeFieldUpdateOperationsInput | $Enums.BondType
    bond_symbol?: StringFieldUpdateOperationsInput | string
    organization_name?: StringFieldUpdateOperationsInput | string
    face_value?: BigIntFieldUpdateOperationsInput | bigint | number
    tl_unit_offered?: IntFieldUpdateOperationsInput | number
    tl_unit_subscribed?: NullableIntFieldUpdateOperationsInput | number | null
    maturity?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumStatusFieldUpdateOperationsInput | $Enums.Status
    interest_rate?: StringFieldUpdateOperationsInput | string
    purpose?: StringFieldUpdateOperationsInput | string
    market?: NullableEnumMarketFieldUpdateOperationsInput | $Enums.Market | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    subscription_period?: IntFieldUpdateOperationsInput | number
    subscription_end_date?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BondsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    bond_object_id?: NullableStringFieldUpdateOperationsInput | string | null
    bond_name?: StringFieldUpdateOperationsInput | string
    bond_type?: EnumBondTypeFieldUpdateOperationsInput | $Enums.BondType
    bond_symbol?: StringFieldUpdateOperationsInput | string
    organization_name?: StringFieldUpdateOperationsInput | string
    face_value?: BigIntFieldUpdateOperationsInput | bigint | number
    tl_unit_offered?: IntFieldUpdateOperationsInput | number
    tl_unit_subscribed?: NullableIntFieldUpdateOperationsInput | number | null
    maturity?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumStatusFieldUpdateOperationsInput | $Enums.Status
    interest_rate?: StringFieldUpdateOperationsInput | string
    purpose?: StringFieldUpdateOperationsInput | string
    market?: NullableEnumMarketFieldUpdateOperationsInput | $Enums.Market | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    subscription_period?: IntFieldUpdateOperationsInput | number
    subscription_end_date?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventsCreateInput = {
    id?: string
    type: $Enums.Type
    details: string
    tx_hash: string
    created_at?: Date | string
    bond: BondsCreateNestedOneWithoutEventsInput
    user: UsersCreateNestedOneWithoutEventsInput
  }

  export type EventsUncheckedCreateInput = {
    id?: string
    type: $Enums.Type
    bond_id: string
    user_id: string
    details: string
    tx_hash: string
    created_at?: Date | string
  }

  export type EventsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumTypeFieldUpdateOperationsInput | $Enums.Type
    details?: StringFieldUpdateOperationsInput | string
    tx_hash?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    bond?: BondsUpdateOneRequiredWithoutEventsNestedInput
    user?: UsersUpdateOneRequiredWithoutEventsNestedInput
  }

  export type EventsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumTypeFieldUpdateOperationsInput | $Enums.Type
    bond_id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    details?: StringFieldUpdateOperationsInput | string
    tx_hash?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventsCreateManyInput = {
    id?: string
    type: $Enums.Type
    bond_id: string
    user_id: string
    details: string
    tx_hash: string
    created_at?: Date | string
  }

  export type EventsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumTypeFieldUpdateOperationsInput | $Enums.Type
    details?: StringFieldUpdateOperationsInput | string
    tx_hash?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumTypeFieldUpdateOperationsInput | $Enums.Type
    bond_id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    details?: StringFieldUpdateOperationsInput | string
    tx_hash?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionsCreateInput = {
    id?: string
    wallet_address: string
    committed_amount: bigint | number
    tx_hash: string
    subscription_amt?: bigint | number | null
    created_at?: Date | string
    bond: BondsCreateNestedOneWithoutSubscriptionsInput
    user: UsersCreateNestedOneWithoutSubscriptionsInput
  }

  export type SubscriptionsUncheckedCreateInput = {
    id?: string
    bond_id: string
    user_id: string
    wallet_address: string
    committed_amount: bigint | number
    tx_hash: string
    subscription_amt?: bigint | number | null
    created_at?: Date | string
  }

  export type SubscriptionsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    wallet_address?: StringFieldUpdateOperationsInput | string
    committed_amount?: BigIntFieldUpdateOperationsInput | bigint | number
    tx_hash?: StringFieldUpdateOperationsInput | string
    subscription_amt?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    bond?: BondsUpdateOneRequiredWithoutSubscriptionsNestedInput
    user?: UsersUpdateOneRequiredWithoutSubscriptionsNestedInput
  }

  export type SubscriptionsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    bond_id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    wallet_address?: StringFieldUpdateOperationsInput | string
    committed_amount?: BigIntFieldUpdateOperationsInput | bigint | number
    tx_hash?: StringFieldUpdateOperationsInput | string
    subscription_amt?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionsCreateManyInput = {
    id?: string
    bond_id: string
    user_id: string
    wallet_address: string
    committed_amount: bigint | number
    tx_hash: string
    subscription_amt?: bigint | number | null
    created_at?: Date | string
  }

  export type SubscriptionsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    wallet_address?: StringFieldUpdateOperationsInput | string
    committed_amount?: BigIntFieldUpdateOperationsInput | bigint | number
    tx_hash?: StringFieldUpdateOperationsInput | string
    subscription_amt?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    bond_id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    wallet_address?: StringFieldUpdateOperationsInput | string
    committed_amount?: BigIntFieldUpdateOperationsInput | bigint | number
    tx_hash?: StringFieldUpdateOperationsInput | string
    subscription_amt?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionsCreateInput = {
    id?: string
    tx_hash: string
    created_at?: Date | string
    bond: BondsCreateNestedOneWithoutTransactionsInput
    from: UsersCreateNestedOneWithoutTransactionsFromInput
    to: UsersCreateNestedOneWithoutTransactionsToInput
  }

  export type TransactionsUncheckedCreateInput = {
    id?: string
    bond_id: string
    user_from: string
    user_to: string
    tx_hash: string
    created_at?: Date | string
  }

  export type TransactionsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tx_hash?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    bond?: BondsUpdateOneRequiredWithoutTransactionsNestedInput
    from?: UsersUpdateOneRequiredWithoutTransactionsFromNestedInput
    to?: UsersUpdateOneRequiredWithoutTransactionsToNestedInput
  }

  export type TransactionsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    bond_id?: StringFieldUpdateOperationsInput | string
    user_from?: StringFieldUpdateOperationsInput | string
    user_to?: StringFieldUpdateOperationsInput | string
    tx_hash?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionsCreateManyInput = {
    id?: string
    bond_id: string
    user_from: string
    user_to: string
    tx_hash: string
    created_at?: Date | string
  }

  export type TransactionsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tx_hash?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    bond_id?: StringFieldUpdateOperationsInput | string
    user_from?: StringFieldUpdateOperationsInput | string
    user_to?: StringFieldUpdateOperationsInput | string
    tx_hash?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type BigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type EnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type EnumKYCStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.KYCStatus | EnumKYCStatusFieldRefInput<$PrismaModel>
    in?: $Enums.KYCStatus[] | ListEnumKYCStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.KYCStatus[] | ListEnumKYCStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumKYCStatusFilter<$PrismaModel> | $Enums.KYCStatus
  }

  export type EKYCVerificationsListRelationFilter = {
    every?: EKYCVerificationsWhereInput
    some?: EKYCVerificationsWhereInput
    none?: EKYCVerificationsWhereInput
  }

  export type SubscriptionsListRelationFilter = {
    every?: SubscriptionsWhereInput
    some?: SubscriptionsWhereInput
    none?: SubscriptionsWhereInput
  }

  export type EventsListRelationFilter = {
    every?: EventsWhereInput
    some?: EventsWhereInput
    none?: EventsWhereInput
  }

  export type TransactionsListRelationFilter = {
    every?: TransactionsWhereInput
    some?: TransactionsWhereInput
    none?: TransactionsWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type EKYCVerificationsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SubscriptionsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type EventsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TransactionsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UsersCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    national_id?: SortOrder
    wallet_address?: SortOrder
    salt?: SortOrder
    email?: SortOrder
    date_of_birth?: SortOrder
    password?: SortOrder
    role?: SortOrder
    hashed_mnemonic?: SortOrder
    created_at?: SortOrder
    kyc_status?: SortOrder
  }

  export type UsersAvgOrderByAggregateInput = {
    national_id?: SortOrder
  }

  export type UsersMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    national_id?: SortOrder
    wallet_address?: SortOrder
    salt?: SortOrder
    email?: SortOrder
    date_of_birth?: SortOrder
    password?: SortOrder
    role?: SortOrder
    hashed_mnemonic?: SortOrder
    created_at?: SortOrder
    kyc_status?: SortOrder
  }

  export type UsersMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    national_id?: SortOrder
    wallet_address?: SortOrder
    salt?: SortOrder
    email?: SortOrder
    date_of_birth?: SortOrder
    password?: SortOrder
    role?: SortOrder
    hashed_mnemonic?: SortOrder
    created_at?: SortOrder
    kyc_status?: SortOrder
  }

  export type UsersSumOrderByAggregateInput = {
    national_id?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type BigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type EnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type EnumKYCStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.KYCStatus | EnumKYCStatusFieldRefInput<$PrismaModel>
    in?: $Enums.KYCStatus[] | ListEnumKYCStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.KYCStatus[] | ListEnumKYCStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumKYCStatusWithAggregatesFilter<$PrismaModel> | $Enums.KYCStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumKYCStatusFilter<$PrismaModel>
    _max?: NestedEnumKYCStatusFilter<$PrismaModel>
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type UsersScalarRelationFilter = {
    is?: UsersWhereInput
    isNot?: UsersWhereInput
  }

  export type EKYCVerificationsCountOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    national_id_hash?: SortOrder
    date_of_birth?: SortOrder
    age?: SortOrder
    custodial_address?: SortOrder
    tx_digest?: SortOrder
    status?: SortOrder
    reason?: SortOrder
    request_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type EKYCVerificationsAvgOrderByAggregateInput = {
    age?: SortOrder
  }

  export type EKYCVerificationsMaxOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    national_id_hash?: SortOrder
    date_of_birth?: SortOrder
    age?: SortOrder
    custodial_address?: SortOrder
    tx_digest?: SortOrder
    status?: SortOrder
    reason?: SortOrder
    request_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type EKYCVerificationsMinOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    national_id_hash?: SortOrder
    date_of_birth?: SortOrder
    age?: SortOrder
    custodial_address?: SortOrder
    tx_digest?: SortOrder
    status?: SortOrder
    reason?: SortOrder
    request_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type EKYCVerificationsSumOrderByAggregateInput = {
    age?: SortOrder
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type EnumBondTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.BondType | EnumBondTypeFieldRefInput<$PrismaModel>
    in?: $Enums.BondType[] | ListEnumBondTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.BondType[] | ListEnumBondTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumBondTypeFilter<$PrismaModel> | $Enums.BondType
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type EnumStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.Status | EnumStatusFieldRefInput<$PrismaModel>
    in?: $Enums.Status[] | ListEnumStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.Status[] | ListEnumStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusFilter<$PrismaModel> | $Enums.Status
  }

  export type EnumMarketNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.Market | EnumMarketFieldRefInput<$PrismaModel> | null
    in?: $Enums.Market[] | ListEnumMarketFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.Market[] | ListEnumMarketFieldRefInput<$PrismaModel> | null
    not?: NestedEnumMarketNullableFilter<$PrismaModel> | $Enums.Market | null
  }

  export type BondsCountOrderByAggregateInput = {
    id?: SortOrder
    bond_object_id?: SortOrder
    bond_name?: SortOrder
    bond_type?: SortOrder
    bond_symbol?: SortOrder
    organization_name?: SortOrder
    face_value?: SortOrder
    tl_unit_offered?: SortOrder
    tl_unit_subscribed?: SortOrder
    maturity?: SortOrder
    status?: SortOrder
    interest_rate?: SortOrder
    purpose?: SortOrder
    market?: SortOrder
    created_at?: SortOrder
    subscription_period?: SortOrder
    subscription_end_date?: SortOrder
  }

  export type BondsAvgOrderByAggregateInput = {
    face_value?: SortOrder
    tl_unit_offered?: SortOrder
    tl_unit_subscribed?: SortOrder
    subscription_period?: SortOrder
  }

  export type BondsMaxOrderByAggregateInput = {
    id?: SortOrder
    bond_object_id?: SortOrder
    bond_name?: SortOrder
    bond_type?: SortOrder
    bond_symbol?: SortOrder
    organization_name?: SortOrder
    face_value?: SortOrder
    tl_unit_offered?: SortOrder
    tl_unit_subscribed?: SortOrder
    maturity?: SortOrder
    status?: SortOrder
    interest_rate?: SortOrder
    purpose?: SortOrder
    market?: SortOrder
    created_at?: SortOrder
    subscription_period?: SortOrder
    subscription_end_date?: SortOrder
  }

  export type BondsMinOrderByAggregateInput = {
    id?: SortOrder
    bond_object_id?: SortOrder
    bond_name?: SortOrder
    bond_type?: SortOrder
    bond_symbol?: SortOrder
    organization_name?: SortOrder
    face_value?: SortOrder
    tl_unit_offered?: SortOrder
    tl_unit_subscribed?: SortOrder
    maturity?: SortOrder
    status?: SortOrder
    interest_rate?: SortOrder
    purpose?: SortOrder
    market?: SortOrder
    created_at?: SortOrder
    subscription_period?: SortOrder
    subscription_end_date?: SortOrder
  }

  export type BondsSumOrderByAggregateInput = {
    face_value?: SortOrder
    tl_unit_offered?: SortOrder
    tl_unit_subscribed?: SortOrder
    subscription_period?: SortOrder
  }

  export type EnumBondTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BondType | EnumBondTypeFieldRefInput<$PrismaModel>
    in?: $Enums.BondType[] | ListEnumBondTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.BondType[] | ListEnumBondTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumBondTypeWithAggregatesFilter<$PrismaModel> | $Enums.BondType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumBondTypeFilter<$PrismaModel>
    _max?: NestedEnumBondTypeFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type EnumStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Status | EnumStatusFieldRefInput<$PrismaModel>
    in?: $Enums.Status[] | ListEnumStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.Status[] | ListEnumStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusWithAggregatesFilter<$PrismaModel> | $Enums.Status
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumStatusFilter<$PrismaModel>
    _max?: NestedEnumStatusFilter<$PrismaModel>
  }

  export type EnumMarketNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Market | EnumMarketFieldRefInput<$PrismaModel> | null
    in?: $Enums.Market[] | ListEnumMarketFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.Market[] | ListEnumMarketFieldRefInput<$PrismaModel> | null
    not?: NestedEnumMarketNullableWithAggregatesFilter<$PrismaModel> | $Enums.Market | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumMarketNullableFilter<$PrismaModel>
    _max?: NestedEnumMarketNullableFilter<$PrismaModel>
  }

  export type EnumTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.Type | EnumTypeFieldRefInput<$PrismaModel>
    in?: $Enums.Type[] | ListEnumTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.Type[] | ListEnumTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumTypeFilter<$PrismaModel> | $Enums.Type
  }

  export type BondsScalarRelationFilter = {
    is?: BondsWhereInput
    isNot?: BondsWhereInput
  }

  export type EventsCountOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    bond_id?: SortOrder
    user_id?: SortOrder
    details?: SortOrder
    tx_hash?: SortOrder
    created_at?: SortOrder
  }

  export type EventsMaxOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    bond_id?: SortOrder
    user_id?: SortOrder
    details?: SortOrder
    tx_hash?: SortOrder
    created_at?: SortOrder
  }

  export type EventsMinOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    bond_id?: SortOrder
    user_id?: SortOrder
    details?: SortOrder
    tx_hash?: SortOrder
    created_at?: SortOrder
  }

  export type EnumTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Type | EnumTypeFieldRefInput<$PrismaModel>
    in?: $Enums.Type[] | ListEnumTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.Type[] | ListEnumTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumTypeWithAggregatesFilter<$PrismaModel> | $Enums.Type
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTypeFilter<$PrismaModel>
    _max?: NestedEnumTypeFilter<$PrismaModel>
  }

  export type BigIntNullableFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel> | null
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntNullableFilter<$PrismaModel> | bigint | number | null
  }

  export type SubscriptionsCountOrderByAggregateInput = {
    id?: SortOrder
    bond_id?: SortOrder
    user_id?: SortOrder
    wallet_address?: SortOrder
    committed_amount?: SortOrder
    tx_hash?: SortOrder
    subscription_amt?: SortOrder
    created_at?: SortOrder
  }

  export type SubscriptionsAvgOrderByAggregateInput = {
    committed_amount?: SortOrder
    subscription_amt?: SortOrder
  }

  export type SubscriptionsMaxOrderByAggregateInput = {
    id?: SortOrder
    bond_id?: SortOrder
    user_id?: SortOrder
    wallet_address?: SortOrder
    committed_amount?: SortOrder
    tx_hash?: SortOrder
    subscription_amt?: SortOrder
    created_at?: SortOrder
  }

  export type SubscriptionsMinOrderByAggregateInput = {
    id?: SortOrder
    bond_id?: SortOrder
    user_id?: SortOrder
    wallet_address?: SortOrder
    committed_amount?: SortOrder
    tx_hash?: SortOrder
    subscription_amt?: SortOrder
    created_at?: SortOrder
  }

  export type SubscriptionsSumOrderByAggregateInput = {
    committed_amount?: SortOrder
    subscription_amt?: SortOrder
  }

  export type BigIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel> | null
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntNullableWithAggregatesFilter<$PrismaModel> | bigint | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedBigIntNullableFilter<$PrismaModel>
    _min?: NestedBigIntNullableFilter<$PrismaModel>
    _max?: NestedBigIntNullableFilter<$PrismaModel>
  }

  export type TransactionsCountOrderByAggregateInput = {
    id?: SortOrder
    bond_id?: SortOrder
    user_from?: SortOrder
    user_to?: SortOrder
    tx_hash?: SortOrder
    created_at?: SortOrder
  }

  export type TransactionsMaxOrderByAggregateInput = {
    id?: SortOrder
    bond_id?: SortOrder
    user_from?: SortOrder
    user_to?: SortOrder
    tx_hash?: SortOrder
    created_at?: SortOrder
  }

  export type TransactionsMinOrderByAggregateInput = {
    id?: SortOrder
    bond_id?: SortOrder
    user_from?: SortOrder
    user_to?: SortOrder
    tx_hash?: SortOrder
    created_at?: SortOrder
  }

  export type EKYCVerificationsCreateNestedManyWithoutUserInput = {
    create?: XOR<EKYCVerificationsCreateWithoutUserInput, EKYCVerificationsUncheckedCreateWithoutUserInput> | EKYCVerificationsCreateWithoutUserInput[] | EKYCVerificationsUncheckedCreateWithoutUserInput[]
    connectOrCreate?: EKYCVerificationsCreateOrConnectWithoutUserInput | EKYCVerificationsCreateOrConnectWithoutUserInput[]
    createMany?: EKYCVerificationsCreateManyUserInputEnvelope
    connect?: EKYCVerificationsWhereUniqueInput | EKYCVerificationsWhereUniqueInput[]
  }

  export type SubscriptionsCreateNestedManyWithoutUserInput = {
    create?: XOR<SubscriptionsCreateWithoutUserInput, SubscriptionsUncheckedCreateWithoutUserInput> | SubscriptionsCreateWithoutUserInput[] | SubscriptionsUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SubscriptionsCreateOrConnectWithoutUserInput | SubscriptionsCreateOrConnectWithoutUserInput[]
    createMany?: SubscriptionsCreateManyUserInputEnvelope
    connect?: SubscriptionsWhereUniqueInput | SubscriptionsWhereUniqueInput[]
  }

  export type EventsCreateNestedManyWithoutUserInput = {
    create?: XOR<EventsCreateWithoutUserInput, EventsUncheckedCreateWithoutUserInput> | EventsCreateWithoutUserInput[] | EventsUncheckedCreateWithoutUserInput[]
    connectOrCreate?: EventsCreateOrConnectWithoutUserInput | EventsCreateOrConnectWithoutUserInput[]
    createMany?: EventsCreateManyUserInputEnvelope
    connect?: EventsWhereUniqueInput | EventsWhereUniqueInput[]
  }

  export type TransactionsCreateNestedManyWithoutFromInput = {
    create?: XOR<TransactionsCreateWithoutFromInput, TransactionsUncheckedCreateWithoutFromInput> | TransactionsCreateWithoutFromInput[] | TransactionsUncheckedCreateWithoutFromInput[]
    connectOrCreate?: TransactionsCreateOrConnectWithoutFromInput | TransactionsCreateOrConnectWithoutFromInput[]
    createMany?: TransactionsCreateManyFromInputEnvelope
    connect?: TransactionsWhereUniqueInput | TransactionsWhereUniqueInput[]
  }

  export type TransactionsCreateNestedManyWithoutToInput = {
    create?: XOR<TransactionsCreateWithoutToInput, TransactionsUncheckedCreateWithoutToInput> | TransactionsCreateWithoutToInput[] | TransactionsUncheckedCreateWithoutToInput[]
    connectOrCreate?: TransactionsCreateOrConnectWithoutToInput | TransactionsCreateOrConnectWithoutToInput[]
    createMany?: TransactionsCreateManyToInputEnvelope
    connect?: TransactionsWhereUniqueInput | TransactionsWhereUniqueInput[]
  }

  export type EKYCVerificationsUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<EKYCVerificationsCreateWithoutUserInput, EKYCVerificationsUncheckedCreateWithoutUserInput> | EKYCVerificationsCreateWithoutUserInput[] | EKYCVerificationsUncheckedCreateWithoutUserInput[]
    connectOrCreate?: EKYCVerificationsCreateOrConnectWithoutUserInput | EKYCVerificationsCreateOrConnectWithoutUserInput[]
    createMany?: EKYCVerificationsCreateManyUserInputEnvelope
    connect?: EKYCVerificationsWhereUniqueInput | EKYCVerificationsWhereUniqueInput[]
  }

  export type SubscriptionsUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<SubscriptionsCreateWithoutUserInput, SubscriptionsUncheckedCreateWithoutUserInput> | SubscriptionsCreateWithoutUserInput[] | SubscriptionsUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SubscriptionsCreateOrConnectWithoutUserInput | SubscriptionsCreateOrConnectWithoutUserInput[]
    createMany?: SubscriptionsCreateManyUserInputEnvelope
    connect?: SubscriptionsWhereUniqueInput | SubscriptionsWhereUniqueInput[]
  }

  export type EventsUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<EventsCreateWithoutUserInput, EventsUncheckedCreateWithoutUserInput> | EventsCreateWithoutUserInput[] | EventsUncheckedCreateWithoutUserInput[]
    connectOrCreate?: EventsCreateOrConnectWithoutUserInput | EventsCreateOrConnectWithoutUserInput[]
    createMany?: EventsCreateManyUserInputEnvelope
    connect?: EventsWhereUniqueInput | EventsWhereUniqueInput[]
  }

  export type TransactionsUncheckedCreateNestedManyWithoutFromInput = {
    create?: XOR<TransactionsCreateWithoutFromInput, TransactionsUncheckedCreateWithoutFromInput> | TransactionsCreateWithoutFromInput[] | TransactionsUncheckedCreateWithoutFromInput[]
    connectOrCreate?: TransactionsCreateOrConnectWithoutFromInput | TransactionsCreateOrConnectWithoutFromInput[]
    createMany?: TransactionsCreateManyFromInputEnvelope
    connect?: TransactionsWhereUniqueInput | TransactionsWhereUniqueInput[]
  }

  export type TransactionsUncheckedCreateNestedManyWithoutToInput = {
    create?: XOR<TransactionsCreateWithoutToInput, TransactionsUncheckedCreateWithoutToInput> | TransactionsCreateWithoutToInput[] | TransactionsUncheckedCreateWithoutToInput[]
    connectOrCreate?: TransactionsCreateOrConnectWithoutToInput | TransactionsCreateOrConnectWithoutToInput[]
    createMany?: TransactionsCreateManyToInputEnvelope
    connect?: TransactionsWhereUniqueInput | TransactionsWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type BigIntFieldUpdateOperationsInput = {
    set?: bigint | number
    increment?: bigint | number
    decrement?: bigint | number
    multiply?: bigint | number
    divide?: bigint | number
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type EnumRoleFieldUpdateOperationsInput = {
    set?: $Enums.Role
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type EnumKYCStatusFieldUpdateOperationsInput = {
    set?: $Enums.KYCStatus
  }

  export type EKYCVerificationsUpdateManyWithoutUserNestedInput = {
    create?: XOR<EKYCVerificationsCreateWithoutUserInput, EKYCVerificationsUncheckedCreateWithoutUserInput> | EKYCVerificationsCreateWithoutUserInput[] | EKYCVerificationsUncheckedCreateWithoutUserInput[]
    connectOrCreate?: EKYCVerificationsCreateOrConnectWithoutUserInput | EKYCVerificationsCreateOrConnectWithoutUserInput[]
    upsert?: EKYCVerificationsUpsertWithWhereUniqueWithoutUserInput | EKYCVerificationsUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: EKYCVerificationsCreateManyUserInputEnvelope
    set?: EKYCVerificationsWhereUniqueInput | EKYCVerificationsWhereUniqueInput[]
    disconnect?: EKYCVerificationsWhereUniqueInput | EKYCVerificationsWhereUniqueInput[]
    delete?: EKYCVerificationsWhereUniqueInput | EKYCVerificationsWhereUniqueInput[]
    connect?: EKYCVerificationsWhereUniqueInput | EKYCVerificationsWhereUniqueInput[]
    update?: EKYCVerificationsUpdateWithWhereUniqueWithoutUserInput | EKYCVerificationsUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: EKYCVerificationsUpdateManyWithWhereWithoutUserInput | EKYCVerificationsUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: EKYCVerificationsScalarWhereInput | EKYCVerificationsScalarWhereInput[]
  }

  export type SubscriptionsUpdateManyWithoutUserNestedInput = {
    create?: XOR<SubscriptionsCreateWithoutUserInput, SubscriptionsUncheckedCreateWithoutUserInput> | SubscriptionsCreateWithoutUserInput[] | SubscriptionsUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SubscriptionsCreateOrConnectWithoutUserInput | SubscriptionsCreateOrConnectWithoutUserInput[]
    upsert?: SubscriptionsUpsertWithWhereUniqueWithoutUserInput | SubscriptionsUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SubscriptionsCreateManyUserInputEnvelope
    set?: SubscriptionsWhereUniqueInput | SubscriptionsWhereUniqueInput[]
    disconnect?: SubscriptionsWhereUniqueInput | SubscriptionsWhereUniqueInput[]
    delete?: SubscriptionsWhereUniqueInput | SubscriptionsWhereUniqueInput[]
    connect?: SubscriptionsWhereUniqueInput | SubscriptionsWhereUniqueInput[]
    update?: SubscriptionsUpdateWithWhereUniqueWithoutUserInput | SubscriptionsUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SubscriptionsUpdateManyWithWhereWithoutUserInput | SubscriptionsUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SubscriptionsScalarWhereInput | SubscriptionsScalarWhereInput[]
  }

  export type EventsUpdateManyWithoutUserNestedInput = {
    create?: XOR<EventsCreateWithoutUserInput, EventsUncheckedCreateWithoutUserInput> | EventsCreateWithoutUserInput[] | EventsUncheckedCreateWithoutUserInput[]
    connectOrCreate?: EventsCreateOrConnectWithoutUserInput | EventsCreateOrConnectWithoutUserInput[]
    upsert?: EventsUpsertWithWhereUniqueWithoutUserInput | EventsUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: EventsCreateManyUserInputEnvelope
    set?: EventsWhereUniqueInput | EventsWhereUniqueInput[]
    disconnect?: EventsWhereUniqueInput | EventsWhereUniqueInput[]
    delete?: EventsWhereUniqueInput | EventsWhereUniqueInput[]
    connect?: EventsWhereUniqueInput | EventsWhereUniqueInput[]
    update?: EventsUpdateWithWhereUniqueWithoutUserInput | EventsUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: EventsUpdateManyWithWhereWithoutUserInput | EventsUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: EventsScalarWhereInput | EventsScalarWhereInput[]
  }

  export type TransactionsUpdateManyWithoutFromNestedInput = {
    create?: XOR<TransactionsCreateWithoutFromInput, TransactionsUncheckedCreateWithoutFromInput> | TransactionsCreateWithoutFromInput[] | TransactionsUncheckedCreateWithoutFromInput[]
    connectOrCreate?: TransactionsCreateOrConnectWithoutFromInput | TransactionsCreateOrConnectWithoutFromInput[]
    upsert?: TransactionsUpsertWithWhereUniqueWithoutFromInput | TransactionsUpsertWithWhereUniqueWithoutFromInput[]
    createMany?: TransactionsCreateManyFromInputEnvelope
    set?: TransactionsWhereUniqueInput | TransactionsWhereUniqueInput[]
    disconnect?: TransactionsWhereUniqueInput | TransactionsWhereUniqueInput[]
    delete?: TransactionsWhereUniqueInput | TransactionsWhereUniqueInput[]
    connect?: TransactionsWhereUniqueInput | TransactionsWhereUniqueInput[]
    update?: TransactionsUpdateWithWhereUniqueWithoutFromInput | TransactionsUpdateWithWhereUniqueWithoutFromInput[]
    updateMany?: TransactionsUpdateManyWithWhereWithoutFromInput | TransactionsUpdateManyWithWhereWithoutFromInput[]
    deleteMany?: TransactionsScalarWhereInput | TransactionsScalarWhereInput[]
  }

  export type TransactionsUpdateManyWithoutToNestedInput = {
    create?: XOR<TransactionsCreateWithoutToInput, TransactionsUncheckedCreateWithoutToInput> | TransactionsCreateWithoutToInput[] | TransactionsUncheckedCreateWithoutToInput[]
    connectOrCreate?: TransactionsCreateOrConnectWithoutToInput | TransactionsCreateOrConnectWithoutToInput[]
    upsert?: TransactionsUpsertWithWhereUniqueWithoutToInput | TransactionsUpsertWithWhereUniqueWithoutToInput[]
    createMany?: TransactionsCreateManyToInputEnvelope
    set?: TransactionsWhereUniqueInput | TransactionsWhereUniqueInput[]
    disconnect?: TransactionsWhereUniqueInput | TransactionsWhereUniqueInput[]
    delete?: TransactionsWhereUniqueInput | TransactionsWhereUniqueInput[]
    connect?: TransactionsWhereUniqueInput | TransactionsWhereUniqueInput[]
    update?: TransactionsUpdateWithWhereUniqueWithoutToInput | TransactionsUpdateWithWhereUniqueWithoutToInput[]
    updateMany?: TransactionsUpdateManyWithWhereWithoutToInput | TransactionsUpdateManyWithWhereWithoutToInput[]
    deleteMany?: TransactionsScalarWhereInput | TransactionsScalarWhereInput[]
  }

  export type EKYCVerificationsUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<EKYCVerificationsCreateWithoutUserInput, EKYCVerificationsUncheckedCreateWithoutUserInput> | EKYCVerificationsCreateWithoutUserInput[] | EKYCVerificationsUncheckedCreateWithoutUserInput[]
    connectOrCreate?: EKYCVerificationsCreateOrConnectWithoutUserInput | EKYCVerificationsCreateOrConnectWithoutUserInput[]
    upsert?: EKYCVerificationsUpsertWithWhereUniqueWithoutUserInput | EKYCVerificationsUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: EKYCVerificationsCreateManyUserInputEnvelope
    set?: EKYCVerificationsWhereUniqueInput | EKYCVerificationsWhereUniqueInput[]
    disconnect?: EKYCVerificationsWhereUniqueInput | EKYCVerificationsWhereUniqueInput[]
    delete?: EKYCVerificationsWhereUniqueInput | EKYCVerificationsWhereUniqueInput[]
    connect?: EKYCVerificationsWhereUniqueInput | EKYCVerificationsWhereUniqueInput[]
    update?: EKYCVerificationsUpdateWithWhereUniqueWithoutUserInput | EKYCVerificationsUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: EKYCVerificationsUpdateManyWithWhereWithoutUserInput | EKYCVerificationsUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: EKYCVerificationsScalarWhereInput | EKYCVerificationsScalarWhereInput[]
  }

  export type SubscriptionsUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<SubscriptionsCreateWithoutUserInput, SubscriptionsUncheckedCreateWithoutUserInput> | SubscriptionsCreateWithoutUserInput[] | SubscriptionsUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SubscriptionsCreateOrConnectWithoutUserInput | SubscriptionsCreateOrConnectWithoutUserInput[]
    upsert?: SubscriptionsUpsertWithWhereUniqueWithoutUserInput | SubscriptionsUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SubscriptionsCreateManyUserInputEnvelope
    set?: SubscriptionsWhereUniqueInput | SubscriptionsWhereUniqueInput[]
    disconnect?: SubscriptionsWhereUniqueInput | SubscriptionsWhereUniqueInput[]
    delete?: SubscriptionsWhereUniqueInput | SubscriptionsWhereUniqueInput[]
    connect?: SubscriptionsWhereUniqueInput | SubscriptionsWhereUniqueInput[]
    update?: SubscriptionsUpdateWithWhereUniqueWithoutUserInput | SubscriptionsUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SubscriptionsUpdateManyWithWhereWithoutUserInput | SubscriptionsUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SubscriptionsScalarWhereInput | SubscriptionsScalarWhereInput[]
  }

  export type EventsUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<EventsCreateWithoutUserInput, EventsUncheckedCreateWithoutUserInput> | EventsCreateWithoutUserInput[] | EventsUncheckedCreateWithoutUserInput[]
    connectOrCreate?: EventsCreateOrConnectWithoutUserInput | EventsCreateOrConnectWithoutUserInput[]
    upsert?: EventsUpsertWithWhereUniqueWithoutUserInput | EventsUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: EventsCreateManyUserInputEnvelope
    set?: EventsWhereUniqueInput | EventsWhereUniqueInput[]
    disconnect?: EventsWhereUniqueInput | EventsWhereUniqueInput[]
    delete?: EventsWhereUniqueInput | EventsWhereUniqueInput[]
    connect?: EventsWhereUniqueInput | EventsWhereUniqueInput[]
    update?: EventsUpdateWithWhereUniqueWithoutUserInput | EventsUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: EventsUpdateManyWithWhereWithoutUserInput | EventsUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: EventsScalarWhereInput | EventsScalarWhereInput[]
  }

  export type TransactionsUncheckedUpdateManyWithoutFromNestedInput = {
    create?: XOR<TransactionsCreateWithoutFromInput, TransactionsUncheckedCreateWithoutFromInput> | TransactionsCreateWithoutFromInput[] | TransactionsUncheckedCreateWithoutFromInput[]
    connectOrCreate?: TransactionsCreateOrConnectWithoutFromInput | TransactionsCreateOrConnectWithoutFromInput[]
    upsert?: TransactionsUpsertWithWhereUniqueWithoutFromInput | TransactionsUpsertWithWhereUniqueWithoutFromInput[]
    createMany?: TransactionsCreateManyFromInputEnvelope
    set?: TransactionsWhereUniqueInput | TransactionsWhereUniqueInput[]
    disconnect?: TransactionsWhereUniqueInput | TransactionsWhereUniqueInput[]
    delete?: TransactionsWhereUniqueInput | TransactionsWhereUniqueInput[]
    connect?: TransactionsWhereUniqueInput | TransactionsWhereUniqueInput[]
    update?: TransactionsUpdateWithWhereUniqueWithoutFromInput | TransactionsUpdateWithWhereUniqueWithoutFromInput[]
    updateMany?: TransactionsUpdateManyWithWhereWithoutFromInput | TransactionsUpdateManyWithWhereWithoutFromInput[]
    deleteMany?: TransactionsScalarWhereInput | TransactionsScalarWhereInput[]
  }

  export type TransactionsUncheckedUpdateManyWithoutToNestedInput = {
    create?: XOR<TransactionsCreateWithoutToInput, TransactionsUncheckedCreateWithoutToInput> | TransactionsCreateWithoutToInput[] | TransactionsUncheckedCreateWithoutToInput[]
    connectOrCreate?: TransactionsCreateOrConnectWithoutToInput | TransactionsCreateOrConnectWithoutToInput[]
    upsert?: TransactionsUpsertWithWhereUniqueWithoutToInput | TransactionsUpsertWithWhereUniqueWithoutToInput[]
    createMany?: TransactionsCreateManyToInputEnvelope
    set?: TransactionsWhereUniqueInput | TransactionsWhereUniqueInput[]
    disconnect?: TransactionsWhereUniqueInput | TransactionsWhereUniqueInput[]
    delete?: TransactionsWhereUniqueInput | TransactionsWhereUniqueInput[]
    connect?: TransactionsWhereUniqueInput | TransactionsWhereUniqueInput[]
    update?: TransactionsUpdateWithWhereUniqueWithoutToInput | TransactionsUpdateWithWhereUniqueWithoutToInput[]
    updateMany?: TransactionsUpdateManyWithWhereWithoutToInput | TransactionsUpdateManyWithWhereWithoutToInput[]
    deleteMany?: TransactionsScalarWhereInput | TransactionsScalarWhereInput[]
  }

  export type UsersCreateNestedOneWithoutEkycInput = {
    create?: XOR<UsersCreateWithoutEkycInput, UsersUncheckedCreateWithoutEkycInput>
    connectOrCreate?: UsersCreateOrConnectWithoutEkycInput
    connect?: UsersWhereUniqueInput
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UsersUpdateOneRequiredWithoutEkycNestedInput = {
    create?: XOR<UsersCreateWithoutEkycInput, UsersUncheckedCreateWithoutEkycInput>
    connectOrCreate?: UsersCreateOrConnectWithoutEkycInput
    upsert?: UsersUpsertWithoutEkycInput
    connect?: UsersWhereUniqueInput
    update?: XOR<XOR<UsersUpdateToOneWithWhereWithoutEkycInput, UsersUpdateWithoutEkycInput>, UsersUncheckedUpdateWithoutEkycInput>
  }

  export type SubscriptionsCreateNestedManyWithoutBondInput = {
    create?: XOR<SubscriptionsCreateWithoutBondInput, SubscriptionsUncheckedCreateWithoutBondInput> | SubscriptionsCreateWithoutBondInput[] | SubscriptionsUncheckedCreateWithoutBondInput[]
    connectOrCreate?: SubscriptionsCreateOrConnectWithoutBondInput | SubscriptionsCreateOrConnectWithoutBondInput[]
    createMany?: SubscriptionsCreateManyBondInputEnvelope
    connect?: SubscriptionsWhereUniqueInput | SubscriptionsWhereUniqueInput[]
  }

  export type EventsCreateNestedManyWithoutBondInput = {
    create?: XOR<EventsCreateWithoutBondInput, EventsUncheckedCreateWithoutBondInput> | EventsCreateWithoutBondInput[] | EventsUncheckedCreateWithoutBondInput[]
    connectOrCreate?: EventsCreateOrConnectWithoutBondInput | EventsCreateOrConnectWithoutBondInput[]
    createMany?: EventsCreateManyBondInputEnvelope
    connect?: EventsWhereUniqueInput | EventsWhereUniqueInput[]
  }

  export type TransactionsCreateNestedManyWithoutBondInput = {
    create?: XOR<TransactionsCreateWithoutBondInput, TransactionsUncheckedCreateWithoutBondInput> | TransactionsCreateWithoutBondInput[] | TransactionsUncheckedCreateWithoutBondInput[]
    connectOrCreate?: TransactionsCreateOrConnectWithoutBondInput | TransactionsCreateOrConnectWithoutBondInput[]
    createMany?: TransactionsCreateManyBondInputEnvelope
    connect?: TransactionsWhereUniqueInput | TransactionsWhereUniqueInput[]
  }

  export type SubscriptionsUncheckedCreateNestedManyWithoutBondInput = {
    create?: XOR<SubscriptionsCreateWithoutBondInput, SubscriptionsUncheckedCreateWithoutBondInput> | SubscriptionsCreateWithoutBondInput[] | SubscriptionsUncheckedCreateWithoutBondInput[]
    connectOrCreate?: SubscriptionsCreateOrConnectWithoutBondInput | SubscriptionsCreateOrConnectWithoutBondInput[]
    createMany?: SubscriptionsCreateManyBondInputEnvelope
    connect?: SubscriptionsWhereUniqueInput | SubscriptionsWhereUniqueInput[]
  }

  export type EventsUncheckedCreateNestedManyWithoutBondInput = {
    create?: XOR<EventsCreateWithoutBondInput, EventsUncheckedCreateWithoutBondInput> | EventsCreateWithoutBondInput[] | EventsUncheckedCreateWithoutBondInput[]
    connectOrCreate?: EventsCreateOrConnectWithoutBondInput | EventsCreateOrConnectWithoutBondInput[]
    createMany?: EventsCreateManyBondInputEnvelope
    connect?: EventsWhereUniqueInput | EventsWhereUniqueInput[]
  }

  export type TransactionsUncheckedCreateNestedManyWithoutBondInput = {
    create?: XOR<TransactionsCreateWithoutBondInput, TransactionsUncheckedCreateWithoutBondInput> | TransactionsCreateWithoutBondInput[] | TransactionsUncheckedCreateWithoutBondInput[]
    connectOrCreate?: TransactionsCreateOrConnectWithoutBondInput | TransactionsCreateOrConnectWithoutBondInput[]
    createMany?: TransactionsCreateManyBondInputEnvelope
    connect?: TransactionsWhereUniqueInput | TransactionsWhereUniqueInput[]
  }

  export type EnumBondTypeFieldUpdateOperationsInput = {
    set?: $Enums.BondType
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EnumStatusFieldUpdateOperationsInput = {
    set?: $Enums.Status
  }

  export type NullableEnumMarketFieldUpdateOperationsInput = {
    set?: $Enums.Market | null
  }

  export type SubscriptionsUpdateManyWithoutBondNestedInput = {
    create?: XOR<SubscriptionsCreateWithoutBondInput, SubscriptionsUncheckedCreateWithoutBondInput> | SubscriptionsCreateWithoutBondInput[] | SubscriptionsUncheckedCreateWithoutBondInput[]
    connectOrCreate?: SubscriptionsCreateOrConnectWithoutBondInput | SubscriptionsCreateOrConnectWithoutBondInput[]
    upsert?: SubscriptionsUpsertWithWhereUniqueWithoutBondInput | SubscriptionsUpsertWithWhereUniqueWithoutBondInput[]
    createMany?: SubscriptionsCreateManyBondInputEnvelope
    set?: SubscriptionsWhereUniqueInput | SubscriptionsWhereUniqueInput[]
    disconnect?: SubscriptionsWhereUniqueInput | SubscriptionsWhereUniqueInput[]
    delete?: SubscriptionsWhereUniqueInput | SubscriptionsWhereUniqueInput[]
    connect?: SubscriptionsWhereUniqueInput | SubscriptionsWhereUniqueInput[]
    update?: SubscriptionsUpdateWithWhereUniqueWithoutBondInput | SubscriptionsUpdateWithWhereUniqueWithoutBondInput[]
    updateMany?: SubscriptionsUpdateManyWithWhereWithoutBondInput | SubscriptionsUpdateManyWithWhereWithoutBondInput[]
    deleteMany?: SubscriptionsScalarWhereInput | SubscriptionsScalarWhereInput[]
  }

  export type EventsUpdateManyWithoutBondNestedInput = {
    create?: XOR<EventsCreateWithoutBondInput, EventsUncheckedCreateWithoutBondInput> | EventsCreateWithoutBondInput[] | EventsUncheckedCreateWithoutBondInput[]
    connectOrCreate?: EventsCreateOrConnectWithoutBondInput | EventsCreateOrConnectWithoutBondInput[]
    upsert?: EventsUpsertWithWhereUniqueWithoutBondInput | EventsUpsertWithWhereUniqueWithoutBondInput[]
    createMany?: EventsCreateManyBondInputEnvelope
    set?: EventsWhereUniqueInput | EventsWhereUniqueInput[]
    disconnect?: EventsWhereUniqueInput | EventsWhereUniqueInput[]
    delete?: EventsWhereUniqueInput | EventsWhereUniqueInput[]
    connect?: EventsWhereUniqueInput | EventsWhereUniqueInput[]
    update?: EventsUpdateWithWhereUniqueWithoutBondInput | EventsUpdateWithWhereUniqueWithoutBondInput[]
    updateMany?: EventsUpdateManyWithWhereWithoutBondInput | EventsUpdateManyWithWhereWithoutBondInput[]
    deleteMany?: EventsScalarWhereInput | EventsScalarWhereInput[]
  }

  export type TransactionsUpdateManyWithoutBondNestedInput = {
    create?: XOR<TransactionsCreateWithoutBondInput, TransactionsUncheckedCreateWithoutBondInput> | TransactionsCreateWithoutBondInput[] | TransactionsUncheckedCreateWithoutBondInput[]
    connectOrCreate?: TransactionsCreateOrConnectWithoutBondInput | TransactionsCreateOrConnectWithoutBondInput[]
    upsert?: TransactionsUpsertWithWhereUniqueWithoutBondInput | TransactionsUpsertWithWhereUniqueWithoutBondInput[]
    createMany?: TransactionsCreateManyBondInputEnvelope
    set?: TransactionsWhereUniqueInput | TransactionsWhereUniqueInput[]
    disconnect?: TransactionsWhereUniqueInput | TransactionsWhereUniqueInput[]
    delete?: TransactionsWhereUniqueInput | TransactionsWhereUniqueInput[]
    connect?: TransactionsWhereUniqueInput | TransactionsWhereUniqueInput[]
    update?: TransactionsUpdateWithWhereUniqueWithoutBondInput | TransactionsUpdateWithWhereUniqueWithoutBondInput[]
    updateMany?: TransactionsUpdateManyWithWhereWithoutBondInput | TransactionsUpdateManyWithWhereWithoutBondInput[]
    deleteMany?: TransactionsScalarWhereInput | TransactionsScalarWhereInput[]
  }

  export type SubscriptionsUncheckedUpdateManyWithoutBondNestedInput = {
    create?: XOR<SubscriptionsCreateWithoutBondInput, SubscriptionsUncheckedCreateWithoutBondInput> | SubscriptionsCreateWithoutBondInput[] | SubscriptionsUncheckedCreateWithoutBondInput[]
    connectOrCreate?: SubscriptionsCreateOrConnectWithoutBondInput | SubscriptionsCreateOrConnectWithoutBondInput[]
    upsert?: SubscriptionsUpsertWithWhereUniqueWithoutBondInput | SubscriptionsUpsertWithWhereUniqueWithoutBondInput[]
    createMany?: SubscriptionsCreateManyBondInputEnvelope
    set?: SubscriptionsWhereUniqueInput | SubscriptionsWhereUniqueInput[]
    disconnect?: SubscriptionsWhereUniqueInput | SubscriptionsWhereUniqueInput[]
    delete?: SubscriptionsWhereUniqueInput | SubscriptionsWhereUniqueInput[]
    connect?: SubscriptionsWhereUniqueInput | SubscriptionsWhereUniqueInput[]
    update?: SubscriptionsUpdateWithWhereUniqueWithoutBondInput | SubscriptionsUpdateWithWhereUniqueWithoutBondInput[]
    updateMany?: SubscriptionsUpdateManyWithWhereWithoutBondInput | SubscriptionsUpdateManyWithWhereWithoutBondInput[]
    deleteMany?: SubscriptionsScalarWhereInput | SubscriptionsScalarWhereInput[]
  }

  export type EventsUncheckedUpdateManyWithoutBondNestedInput = {
    create?: XOR<EventsCreateWithoutBondInput, EventsUncheckedCreateWithoutBondInput> | EventsCreateWithoutBondInput[] | EventsUncheckedCreateWithoutBondInput[]
    connectOrCreate?: EventsCreateOrConnectWithoutBondInput | EventsCreateOrConnectWithoutBondInput[]
    upsert?: EventsUpsertWithWhereUniqueWithoutBondInput | EventsUpsertWithWhereUniqueWithoutBondInput[]
    createMany?: EventsCreateManyBondInputEnvelope
    set?: EventsWhereUniqueInput | EventsWhereUniqueInput[]
    disconnect?: EventsWhereUniqueInput | EventsWhereUniqueInput[]
    delete?: EventsWhereUniqueInput | EventsWhereUniqueInput[]
    connect?: EventsWhereUniqueInput | EventsWhereUniqueInput[]
    update?: EventsUpdateWithWhereUniqueWithoutBondInput | EventsUpdateWithWhereUniqueWithoutBondInput[]
    updateMany?: EventsUpdateManyWithWhereWithoutBondInput | EventsUpdateManyWithWhereWithoutBondInput[]
    deleteMany?: EventsScalarWhereInput | EventsScalarWhereInput[]
  }

  export type TransactionsUncheckedUpdateManyWithoutBondNestedInput = {
    create?: XOR<TransactionsCreateWithoutBondInput, TransactionsUncheckedCreateWithoutBondInput> | TransactionsCreateWithoutBondInput[] | TransactionsUncheckedCreateWithoutBondInput[]
    connectOrCreate?: TransactionsCreateOrConnectWithoutBondInput | TransactionsCreateOrConnectWithoutBondInput[]
    upsert?: TransactionsUpsertWithWhereUniqueWithoutBondInput | TransactionsUpsertWithWhereUniqueWithoutBondInput[]
    createMany?: TransactionsCreateManyBondInputEnvelope
    set?: TransactionsWhereUniqueInput | TransactionsWhereUniqueInput[]
    disconnect?: TransactionsWhereUniqueInput | TransactionsWhereUniqueInput[]
    delete?: TransactionsWhereUniqueInput | TransactionsWhereUniqueInput[]
    connect?: TransactionsWhereUniqueInput | TransactionsWhereUniqueInput[]
    update?: TransactionsUpdateWithWhereUniqueWithoutBondInput | TransactionsUpdateWithWhereUniqueWithoutBondInput[]
    updateMany?: TransactionsUpdateManyWithWhereWithoutBondInput | TransactionsUpdateManyWithWhereWithoutBondInput[]
    deleteMany?: TransactionsScalarWhereInput | TransactionsScalarWhereInput[]
  }

  export type BondsCreateNestedOneWithoutEventsInput = {
    create?: XOR<BondsCreateWithoutEventsInput, BondsUncheckedCreateWithoutEventsInput>
    connectOrCreate?: BondsCreateOrConnectWithoutEventsInput
    connect?: BondsWhereUniqueInput
  }

  export type UsersCreateNestedOneWithoutEventsInput = {
    create?: XOR<UsersCreateWithoutEventsInput, UsersUncheckedCreateWithoutEventsInput>
    connectOrCreate?: UsersCreateOrConnectWithoutEventsInput
    connect?: UsersWhereUniqueInput
  }

  export type EnumTypeFieldUpdateOperationsInput = {
    set?: $Enums.Type
  }

  export type BondsUpdateOneRequiredWithoutEventsNestedInput = {
    create?: XOR<BondsCreateWithoutEventsInput, BondsUncheckedCreateWithoutEventsInput>
    connectOrCreate?: BondsCreateOrConnectWithoutEventsInput
    upsert?: BondsUpsertWithoutEventsInput
    connect?: BondsWhereUniqueInput
    update?: XOR<XOR<BondsUpdateToOneWithWhereWithoutEventsInput, BondsUpdateWithoutEventsInput>, BondsUncheckedUpdateWithoutEventsInput>
  }

  export type UsersUpdateOneRequiredWithoutEventsNestedInput = {
    create?: XOR<UsersCreateWithoutEventsInput, UsersUncheckedCreateWithoutEventsInput>
    connectOrCreate?: UsersCreateOrConnectWithoutEventsInput
    upsert?: UsersUpsertWithoutEventsInput
    connect?: UsersWhereUniqueInput
    update?: XOR<XOR<UsersUpdateToOneWithWhereWithoutEventsInput, UsersUpdateWithoutEventsInput>, UsersUncheckedUpdateWithoutEventsInput>
  }

  export type BondsCreateNestedOneWithoutSubscriptionsInput = {
    create?: XOR<BondsCreateWithoutSubscriptionsInput, BondsUncheckedCreateWithoutSubscriptionsInput>
    connectOrCreate?: BondsCreateOrConnectWithoutSubscriptionsInput
    connect?: BondsWhereUniqueInput
  }

  export type UsersCreateNestedOneWithoutSubscriptionsInput = {
    create?: XOR<UsersCreateWithoutSubscriptionsInput, UsersUncheckedCreateWithoutSubscriptionsInput>
    connectOrCreate?: UsersCreateOrConnectWithoutSubscriptionsInput
    connect?: UsersWhereUniqueInput
  }

  export type NullableBigIntFieldUpdateOperationsInput = {
    set?: bigint | number | null
    increment?: bigint | number
    decrement?: bigint | number
    multiply?: bigint | number
    divide?: bigint | number
  }

  export type BondsUpdateOneRequiredWithoutSubscriptionsNestedInput = {
    create?: XOR<BondsCreateWithoutSubscriptionsInput, BondsUncheckedCreateWithoutSubscriptionsInput>
    connectOrCreate?: BondsCreateOrConnectWithoutSubscriptionsInput
    upsert?: BondsUpsertWithoutSubscriptionsInput
    connect?: BondsWhereUniqueInput
    update?: XOR<XOR<BondsUpdateToOneWithWhereWithoutSubscriptionsInput, BondsUpdateWithoutSubscriptionsInput>, BondsUncheckedUpdateWithoutSubscriptionsInput>
  }

  export type UsersUpdateOneRequiredWithoutSubscriptionsNestedInput = {
    create?: XOR<UsersCreateWithoutSubscriptionsInput, UsersUncheckedCreateWithoutSubscriptionsInput>
    connectOrCreate?: UsersCreateOrConnectWithoutSubscriptionsInput
    upsert?: UsersUpsertWithoutSubscriptionsInput
    connect?: UsersWhereUniqueInput
    update?: XOR<XOR<UsersUpdateToOneWithWhereWithoutSubscriptionsInput, UsersUpdateWithoutSubscriptionsInput>, UsersUncheckedUpdateWithoutSubscriptionsInput>
  }

  export type BondsCreateNestedOneWithoutTransactionsInput = {
    create?: XOR<BondsCreateWithoutTransactionsInput, BondsUncheckedCreateWithoutTransactionsInput>
    connectOrCreate?: BondsCreateOrConnectWithoutTransactionsInput
    connect?: BondsWhereUniqueInput
  }

  export type UsersCreateNestedOneWithoutTransactionsFromInput = {
    create?: XOR<UsersCreateWithoutTransactionsFromInput, UsersUncheckedCreateWithoutTransactionsFromInput>
    connectOrCreate?: UsersCreateOrConnectWithoutTransactionsFromInput
    connect?: UsersWhereUniqueInput
  }

  export type UsersCreateNestedOneWithoutTransactionsToInput = {
    create?: XOR<UsersCreateWithoutTransactionsToInput, UsersUncheckedCreateWithoutTransactionsToInput>
    connectOrCreate?: UsersCreateOrConnectWithoutTransactionsToInput
    connect?: UsersWhereUniqueInput
  }

  export type BondsUpdateOneRequiredWithoutTransactionsNestedInput = {
    create?: XOR<BondsCreateWithoutTransactionsInput, BondsUncheckedCreateWithoutTransactionsInput>
    connectOrCreate?: BondsCreateOrConnectWithoutTransactionsInput
    upsert?: BondsUpsertWithoutTransactionsInput
    connect?: BondsWhereUniqueInput
    update?: XOR<XOR<BondsUpdateToOneWithWhereWithoutTransactionsInput, BondsUpdateWithoutTransactionsInput>, BondsUncheckedUpdateWithoutTransactionsInput>
  }

  export type UsersUpdateOneRequiredWithoutTransactionsFromNestedInput = {
    create?: XOR<UsersCreateWithoutTransactionsFromInput, UsersUncheckedCreateWithoutTransactionsFromInput>
    connectOrCreate?: UsersCreateOrConnectWithoutTransactionsFromInput
    upsert?: UsersUpsertWithoutTransactionsFromInput
    connect?: UsersWhereUniqueInput
    update?: XOR<XOR<UsersUpdateToOneWithWhereWithoutTransactionsFromInput, UsersUpdateWithoutTransactionsFromInput>, UsersUncheckedUpdateWithoutTransactionsFromInput>
  }

  export type UsersUpdateOneRequiredWithoutTransactionsToNestedInput = {
    create?: XOR<UsersCreateWithoutTransactionsToInput, UsersUncheckedCreateWithoutTransactionsToInput>
    connectOrCreate?: UsersCreateOrConnectWithoutTransactionsToInput
    upsert?: UsersUpsertWithoutTransactionsToInput
    connect?: UsersWhereUniqueInput
    update?: XOR<XOR<UsersUpdateToOneWithWhereWithoutTransactionsToInput, UsersUpdateWithoutTransactionsToInput>, UsersUncheckedUpdateWithoutTransactionsToInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedBigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedEnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedEnumKYCStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.KYCStatus | EnumKYCStatusFieldRefInput<$PrismaModel>
    in?: $Enums.KYCStatus[] | ListEnumKYCStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.KYCStatus[] | ListEnumKYCStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumKYCStatusFilter<$PrismaModel> | $Enums.KYCStatus
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedEnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedEnumKYCStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.KYCStatus | EnumKYCStatusFieldRefInput<$PrismaModel>
    in?: $Enums.KYCStatus[] | ListEnumKYCStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.KYCStatus[] | ListEnumKYCStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumKYCStatusWithAggregatesFilter<$PrismaModel> | $Enums.KYCStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumKYCStatusFilter<$PrismaModel>
    _max?: NestedEnumKYCStatusFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumBondTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.BondType | EnumBondTypeFieldRefInput<$PrismaModel>
    in?: $Enums.BondType[] | ListEnumBondTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.BondType[] | ListEnumBondTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumBondTypeFilter<$PrismaModel> | $Enums.BondType
  }

  export type NestedEnumStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.Status | EnumStatusFieldRefInput<$PrismaModel>
    in?: $Enums.Status[] | ListEnumStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.Status[] | ListEnumStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusFilter<$PrismaModel> | $Enums.Status
  }

  export type NestedEnumMarketNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.Market | EnumMarketFieldRefInput<$PrismaModel> | null
    in?: $Enums.Market[] | ListEnumMarketFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.Market[] | ListEnumMarketFieldRefInput<$PrismaModel> | null
    not?: NestedEnumMarketNullableFilter<$PrismaModel> | $Enums.Market | null
  }

  export type NestedEnumBondTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BondType | EnumBondTypeFieldRefInput<$PrismaModel>
    in?: $Enums.BondType[] | ListEnumBondTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.BondType[] | ListEnumBondTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumBondTypeWithAggregatesFilter<$PrismaModel> | $Enums.BondType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumBondTypeFilter<$PrismaModel>
    _max?: NestedEnumBondTypeFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedEnumStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Status | EnumStatusFieldRefInput<$PrismaModel>
    in?: $Enums.Status[] | ListEnumStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.Status[] | ListEnumStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusWithAggregatesFilter<$PrismaModel> | $Enums.Status
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumStatusFilter<$PrismaModel>
    _max?: NestedEnumStatusFilter<$PrismaModel>
  }

  export type NestedEnumMarketNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Market | EnumMarketFieldRefInput<$PrismaModel> | null
    in?: $Enums.Market[] | ListEnumMarketFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.Market[] | ListEnumMarketFieldRefInput<$PrismaModel> | null
    not?: NestedEnumMarketNullableWithAggregatesFilter<$PrismaModel> | $Enums.Market | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumMarketNullableFilter<$PrismaModel>
    _max?: NestedEnumMarketNullableFilter<$PrismaModel>
  }

  export type NestedEnumTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.Type | EnumTypeFieldRefInput<$PrismaModel>
    in?: $Enums.Type[] | ListEnumTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.Type[] | ListEnumTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumTypeFilter<$PrismaModel> | $Enums.Type
  }

  export type NestedEnumTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Type | EnumTypeFieldRefInput<$PrismaModel>
    in?: $Enums.Type[] | ListEnumTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.Type[] | ListEnumTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumTypeWithAggregatesFilter<$PrismaModel> | $Enums.Type
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTypeFilter<$PrismaModel>
    _max?: NestedEnumTypeFilter<$PrismaModel>
  }

  export type NestedBigIntNullableFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel> | null
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntNullableFilter<$PrismaModel> | bigint | number | null
  }

  export type NestedBigIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel> | null
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntNullableWithAggregatesFilter<$PrismaModel> | bigint | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedBigIntNullableFilter<$PrismaModel>
    _min?: NestedBigIntNullableFilter<$PrismaModel>
    _max?: NestedBigIntNullableFilter<$PrismaModel>
  }

  export type EKYCVerificationsCreateWithoutUserInput = {
    id?: string
    national_id_hash: string
    date_of_birth: Date | string
    age?: number | null
    custodial_address: string
    tx_digest?: string | null
    status?: $Enums.KYCStatus
    reason?: string | null
    request_id?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type EKYCVerificationsUncheckedCreateWithoutUserInput = {
    id?: string
    national_id_hash: string
    date_of_birth: Date | string
    age?: number | null
    custodial_address: string
    tx_digest?: string | null
    status?: $Enums.KYCStatus
    reason?: string | null
    request_id?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type EKYCVerificationsCreateOrConnectWithoutUserInput = {
    where: EKYCVerificationsWhereUniqueInput
    create: XOR<EKYCVerificationsCreateWithoutUserInput, EKYCVerificationsUncheckedCreateWithoutUserInput>
  }

  export type EKYCVerificationsCreateManyUserInputEnvelope = {
    data: EKYCVerificationsCreateManyUserInput | EKYCVerificationsCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type SubscriptionsCreateWithoutUserInput = {
    id?: string
    wallet_address: string
    committed_amount: bigint | number
    tx_hash: string
    subscription_amt?: bigint | number | null
    created_at?: Date | string
    bond: BondsCreateNestedOneWithoutSubscriptionsInput
  }

  export type SubscriptionsUncheckedCreateWithoutUserInput = {
    id?: string
    bond_id: string
    wallet_address: string
    committed_amount: bigint | number
    tx_hash: string
    subscription_amt?: bigint | number | null
    created_at?: Date | string
  }

  export type SubscriptionsCreateOrConnectWithoutUserInput = {
    where: SubscriptionsWhereUniqueInput
    create: XOR<SubscriptionsCreateWithoutUserInput, SubscriptionsUncheckedCreateWithoutUserInput>
  }

  export type SubscriptionsCreateManyUserInputEnvelope = {
    data: SubscriptionsCreateManyUserInput | SubscriptionsCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type EventsCreateWithoutUserInput = {
    id?: string
    type: $Enums.Type
    details: string
    tx_hash: string
    created_at?: Date | string
    bond: BondsCreateNestedOneWithoutEventsInput
  }

  export type EventsUncheckedCreateWithoutUserInput = {
    id?: string
    type: $Enums.Type
    bond_id: string
    details: string
    tx_hash: string
    created_at?: Date | string
  }

  export type EventsCreateOrConnectWithoutUserInput = {
    where: EventsWhereUniqueInput
    create: XOR<EventsCreateWithoutUserInput, EventsUncheckedCreateWithoutUserInput>
  }

  export type EventsCreateManyUserInputEnvelope = {
    data: EventsCreateManyUserInput | EventsCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type TransactionsCreateWithoutFromInput = {
    id?: string
    tx_hash: string
    created_at?: Date | string
    bond: BondsCreateNestedOneWithoutTransactionsInput
    to: UsersCreateNestedOneWithoutTransactionsToInput
  }

  export type TransactionsUncheckedCreateWithoutFromInput = {
    id?: string
    bond_id: string
    user_to: string
    tx_hash: string
    created_at?: Date | string
  }

  export type TransactionsCreateOrConnectWithoutFromInput = {
    where: TransactionsWhereUniqueInput
    create: XOR<TransactionsCreateWithoutFromInput, TransactionsUncheckedCreateWithoutFromInput>
  }

  export type TransactionsCreateManyFromInputEnvelope = {
    data: TransactionsCreateManyFromInput | TransactionsCreateManyFromInput[]
    skipDuplicates?: boolean
  }

  export type TransactionsCreateWithoutToInput = {
    id?: string
    tx_hash: string
    created_at?: Date | string
    bond: BondsCreateNestedOneWithoutTransactionsInput
    from: UsersCreateNestedOneWithoutTransactionsFromInput
  }

  export type TransactionsUncheckedCreateWithoutToInput = {
    id?: string
    bond_id: string
    user_from: string
    tx_hash: string
    created_at?: Date | string
  }

  export type TransactionsCreateOrConnectWithoutToInput = {
    where: TransactionsWhereUniqueInput
    create: XOR<TransactionsCreateWithoutToInput, TransactionsUncheckedCreateWithoutToInput>
  }

  export type TransactionsCreateManyToInputEnvelope = {
    data: TransactionsCreateManyToInput | TransactionsCreateManyToInput[]
    skipDuplicates?: boolean
  }

  export type EKYCVerificationsUpsertWithWhereUniqueWithoutUserInput = {
    where: EKYCVerificationsWhereUniqueInput
    update: XOR<EKYCVerificationsUpdateWithoutUserInput, EKYCVerificationsUncheckedUpdateWithoutUserInput>
    create: XOR<EKYCVerificationsCreateWithoutUserInput, EKYCVerificationsUncheckedCreateWithoutUserInput>
  }

  export type EKYCVerificationsUpdateWithWhereUniqueWithoutUserInput = {
    where: EKYCVerificationsWhereUniqueInput
    data: XOR<EKYCVerificationsUpdateWithoutUserInput, EKYCVerificationsUncheckedUpdateWithoutUserInput>
  }

  export type EKYCVerificationsUpdateManyWithWhereWithoutUserInput = {
    where: EKYCVerificationsScalarWhereInput
    data: XOR<EKYCVerificationsUpdateManyMutationInput, EKYCVerificationsUncheckedUpdateManyWithoutUserInput>
  }

  export type EKYCVerificationsScalarWhereInput = {
    AND?: EKYCVerificationsScalarWhereInput | EKYCVerificationsScalarWhereInput[]
    OR?: EKYCVerificationsScalarWhereInput[]
    NOT?: EKYCVerificationsScalarWhereInput | EKYCVerificationsScalarWhereInput[]
    id?: StringFilter<"EKYCVerifications"> | string
    user_id?: StringFilter<"EKYCVerifications"> | string
    national_id_hash?: StringFilter<"EKYCVerifications"> | string
    date_of_birth?: DateTimeFilter<"EKYCVerifications"> | Date | string
    age?: IntNullableFilter<"EKYCVerifications"> | number | null
    custodial_address?: StringFilter<"EKYCVerifications"> | string
    tx_digest?: StringNullableFilter<"EKYCVerifications"> | string | null
    status?: EnumKYCStatusFilter<"EKYCVerifications"> | $Enums.KYCStatus
    reason?: StringNullableFilter<"EKYCVerifications"> | string | null
    request_id?: StringNullableFilter<"EKYCVerifications"> | string | null
    created_at?: DateTimeFilter<"EKYCVerifications"> | Date | string
    updated_at?: DateTimeFilter<"EKYCVerifications"> | Date | string
  }

  export type SubscriptionsUpsertWithWhereUniqueWithoutUserInput = {
    where: SubscriptionsWhereUniqueInput
    update: XOR<SubscriptionsUpdateWithoutUserInput, SubscriptionsUncheckedUpdateWithoutUserInput>
    create: XOR<SubscriptionsCreateWithoutUserInput, SubscriptionsUncheckedCreateWithoutUserInput>
  }

  export type SubscriptionsUpdateWithWhereUniqueWithoutUserInput = {
    where: SubscriptionsWhereUniqueInput
    data: XOR<SubscriptionsUpdateWithoutUserInput, SubscriptionsUncheckedUpdateWithoutUserInput>
  }

  export type SubscriptionsUpdateManyWithWhereWithoutUserInput = {
    where: SubscriptionsScalarWhereInput
    data: XOR<SubscriptionsUpdateManyMutationInput, SubscriptionsUncheckedUpdateManyWithoutUserInput>
  }

  export type SubscriptionsScalarWhereInput = {
    AND?: SubscriptionsScalarWhereInput | SubscriptionsScalarWhereInput[]
    OR?: SubscriptionsScalarWhereInput[]
    NOT?: SubscriptionsScalarWhereInput | SubscriptionsScalarWhereInput[]
    id?: StringFilter<"Subscriptions"> | string
    bond_id?: StringFilter<"Subscriptions"> | string
    user_id?: StringFilter<"Subscriptions"> | string
    wallet_address?: StringFilter<"Subscriptions"> | string
    committed_amount?: BigIntFilter<"Subscriptions"> | bigint | number
    tx_hash?: StringFilter<"Subscriptions"> | string
    subscription_amt?: BigIntNullableFilter<"Subscriptions"> | bigint | number | null
    created_at?: DateTimeFilter<"Subscriptions"> | Date | string
  }

  export type EventsUpsertWithWhereUniqueWithoutUserInput = {
    where: EventsWhereUniqueInput
    update: XOR<EventsUpdateWithoutUserInput, EventsUncheckedUpdateWithoutUserInput>
    create: XOR<EventsCreateWithoutUserInput, EventsUncheckedCreateWithoutUserInput>
  }

  export type EventsUpdateWithWhereUniqueWithoutUserInput = {
    where: EventsWhereUniqueInput
    data: XOR<EventsUpdateWithoutUserInput, EventsUncheckedUpdateWithoutUserInput>
  }

  export type EventsUpdateManyWithWhereWithoutUserInput = {
    where: EventsScalarWhereInput
    data: XOR<EventsUpdateManyMutationInput, EventsUncheckedUpdateManyWithoutUserInput>
  }

  export type EventsScalarWhereInput = {
    AND?: EventsScalarWhereInput | EventsScalarWhereInput[]
    OR?: EventsScalarWhereInput[]
    NOT?: EventsScalarWhereInput | EventsScalarWhereInput[]
    id?: StringFilter<"Events"> | string
    type?: EnumTypeFilter<"Events"> | $Enums.Type
    bond_id?: StringFilter<"Events"> | string
    user_id?: StringFilter<"Events"> | string
    details?: StringFilter<"Events"> | string
    tx_hash?: StringFilter<"Events"> | string
    created_at?: DateTimeFilter<"Events"> | Date | string
  }

  export type TransactionsUpsertWithWhereUniqueWithoutFromInput = {
    where: TransactionsWhereUniqueInput
    update: XOR<TransactionsUpdateWithoutFromInput, TransactionsUncheckedUpdateWithoutFromInput>
    create: XOR<TransactionsCreateWithoutFromInput, TransactionsUncheckedCreateWithoutFromInput>
  }

  export type TransactionsUpdateWithWhereUniqueWithoutFromInput = {
    where: TransactionsWhereUniqueInput
    data: XOR<TransactionsUpdateWithoutFromInput, TransactionsUncheckedUpdateWithoutFromInput>
  }

  export type TransactionsUpdateManyWithWhereWithoutFromInput = {
    where: TransactionsScalarWhereInput
    data: XOR<TransactionsUpdateManyMutationInput, TransactionsUncheckedUpdateManyWithoutFromInput>
  }

  export type TransactionsScalarWhereInput = {
    AND?: TransactionsScalarWhereInput | TransactionsScalarWhereInput[]
    OR?: TransactionsScalarWhereInput[]
    NOT?: TransactionsScalarWhereInput | TransactionsScalarWhereInput[]
    id?: StringFilter<"Transactions"> | string
    bond_id?: StringFilter<"Transactions"> | string
    user_from?: StringFilter<"Transactions"> | string
    user_to?: StringFilter<"Transactions"> | string
    tx_hash?: StringFilter<"Transactions"> | string
    created_at?: DateTimeFilter<"Transactions"> | Date | string
  }

  export type TransactionsUpsertWithWhereUniqueWithoutToInput = {
    where: TransactionsWhereUniqueInput
    update: XOR<TransactionsUpdateWithoutToInput, TransactionsUncheckedUpdateWithoutToInput>
    create: XOR<TransactionsCreateWithoutToInput, TransactionsUncheckedCreateWithoutToInput>
  }

  export type TransactionsUpdateWithWhereUniqueWithoutToInput = {
    where: TransactionsWhereUniqueInput
    data: XOR<TransactionsUpdateWithoutToInput, TransactionsUncheckedUpdateWithoutToInput>
  }

  export type TransactionsUpdateManyWithWhereWithoutToInput = {
    where: TransactionsScalarWhereInput
    data: XOR<TransactionsUpdateManyMutationInput, TransactionsUncheckedUpdateManyWithoutToInput>
  }

  export type UsersCreateWithoutEkycInput = {
    id?: string
    name?: string | null
    national_id: bigint | number
    wallet_address?: string | null
    salt: string
    email: string
    date_of_birth?: Date | string | null
    password?: string | null
    role: $Enums.Role
    hashed_mnemonic?: string | null
    created_at?: Date | string
    kyc_status?: $Enums.KYCStatus
    subscriptions?: SubscriptionsCreateNestedManyWithoutUserInput
    events?: EventsCreateNestedManyWithoutUserInput
    transactionsFrom?: TransactionsCreateNestedManyWithoutFromInput
    transactionsTo?: TransactionsCreateNestedManyWithoutToInput
  }

  export type UsersUncheckedCreateWithoutEkycInput = {
    id?: string
    name?: string | null
    national_id: bigint | number
    wallet_address?: string | null
    salt: string
    email: string
    date_of_birth?: Date | string | null
    password?: string | null
    role: $Enums.Role
    hashed_mnemonic?: string | null
    created_at?: Date | string
    kyc_status?: $Enums.KYCStatus
    subscriptions?: SubscriptionsUncheckedCreateNestedManyWithoutUserInput
    events?: EventsUncheckedCreateNestedManyWithoutUserInput
    transactionsFrom?: TransactionsUncheckedCreateNestedManyWithoutFromInput
    transactionsTo?: TransactionsUncheckedCreateNestedManyWithoutToInput
  }

  export type UsersCreateOrConnectWithoutEkycInput = {
    where: UsersWhereUniqueInput
    create: XOR<UsersCreateWithoutEkycInput, UsersUncheckedCreateWithoutEkycInput>
  }

  export type UsersUpsertWithoutEkycInput = {
    update: XOR<UsersUpdateWithoutEkycInput, UsersUncheckedUpdateWithoutEkycInput>
    create: XOR<UsersCreateWithoutEkycInput, UsersUncheckedCreateWithoutEkycInput>
    where?: UsersWhereInput
  }

  export type UsersUpdateToOneWithWhereWithoutEkycInput = {
    where?: UsersWhereInput
    data: XOR<UsersUpdateWithoutEkycInput, UsersUncheckedUpdateWithoutEkycInput>
  }

  export type UsersUpdateWithoutEkycInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    national_id?: BigIntFieldUpdateOperationsInput | bigint | number
    wallet_address?: NullableStringFieldUpdateOperationsInput | string | null
    salt?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    date_of_birth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    hashed_mnemonic?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    kyc_status?: EnumKYCStatusFieldUpdateOperationsInput | $Enums.KYCStatus
    subscriptions?: SubscriptionsUpdateManyWithoutUserNestedInput
    events?: EventsUpdateManyWithoutUserNestedInput
    transactionsFrom?: TransactionsUpdateManyWithoutFromNestedInput
    transactionsTo?: TransactionsUpdateManyWithoutToNestedInput
  }

  export type UsersUncheckedUpdateWithoutEkycInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    national_id?: BigIntFieldUpdateOperationsInput | bigint | number
    wallet_address?: NullableStringFieldUpdateOperationsInput | string | null
    salt?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    date_of_birth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    hashed_mnemonic?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    kyc_status?: EnumKYCStatusFieldUpdateOperationsInput | $Enums.KYCStatus
    subscriptions?: SubscriptionsUncheckedUpdateManyWithoutUserNestedInput
    events?: EventsUncheckedUpdateManyWithoutUserNestedInput
    transactionsFrom?: TransactionsUncheckedUpdateManyWithoutFromNestedInput
    transactionsTo?: TransactionsUncheckedUpdateManyWithoutToNestedInput
  }

  export type SubscriptionsCreateWithoutBondInput = {
    id?: string
    wallet_address: string
    committed_amount: bigint | number
    tx_hash: string
    subscription_amt?: bigint | number | null
    created_at?: Date | string
    user: UsersCreateNestedOneWithoutSubscriptionsInput
  }

  export type SubscriptionsUncheckedCreateWithoutBondInput = {
    id?: string
    user_id: string
    wallet_address: string
    committed_amount: bigint | number
    tx_hash: string
    subscription_amt?: bigint | number | null
    created_at?: Date | string
  }

  export type SubscriptionsCreateOrConnectWithoutBondInput = {
    where: SubscriptionsWhereUniqueInput
    create: XOR<SubscriptionsCreateWithoutBondInput, SubscriptionsUncheckedCreateWithoutBondInput>
  }

  export type SubscriptionsCreateManyBondInputEnvelope = {
    data: SubscriptionsCreateManyBondInput | SubscriptionsCreateManyBondInput[]
    skipDuplicates?: boolean
  }

  export type EventsCreateWithoutBondInput = {
    id?: string
    type: $Enums.Type
    details: string
    tx_hash: string
    created_at?: Date | string
    user: UsersCreateNestedOneWithoutEventsInput
  }

  export type EventsUncheckedCreateWithoutBondInput = {
    id?: string
    type: $Enums.Type
    user_id: string
    details: string
    tx_hash: string
    created_at?: Date | string
  }

  export type EventsCreateOrConnectWithoutBondInput = {
    where: EventsWhereUniqueInput
    create: XOR<EventsCreateWithoutBondInput, EventsUncheckedCreateWithoutBondInput>
  }

  export type EventsCreateManyBondInputEnvelope = {
    data: EventsCreateManyBondInput | EventsCreateManyBondInput[]
    skipDuplicates?: boolean
  }

  export type TransactionsCreateWithoutBondInput = {
    id?: string
    tx_hash: string
    created_at?: Date | string
    from: UsersCreateNestedOneWithoutTransactionsFromInput
    to: UsersCreateNestedOneWithoutTransactionsToInput
  }

  export type TransactionsUncheckedCreateWithoutBondInput = {
    id?: string
    user_from: string
    user_to: string
    tx_hash: string
    created_at?: Date | string
  }

  export type TransactionsCreateOrConnectWithoutBondInput = {
    where: TransactionsWhereUniqueInput
    create: XOR<TransactionsCreateWithoutBondInput, TransactionsUncheckedCreateWithoutBondInput>
  }

  export type TransactionsCreateManyBondInputEnvelope = {
    data: TransactionsCreateManyBondInput | TransactionsCreateManyBondInput[]
    skipDuplicates?: boolean
  }

  export type SubscriptionsUpsertWithWhereUniqueWithoutBondInput = {
    where: SubscriptionsWhereUniqueInput
    update: XOR<SubscriptionsUpdateWithoutBondInput, SubscriptionsUncheckedUpdateWithoutBondInput>
    create: XOR<SubscriptionsCreateWithoutBondInput, SubscriptionsUncheckedCreateWithoutBondInput>
  }

  export type SubscriptionsUpdateWithWhereUniqueWithoutBondInput = {
    where: SubscriptionsWhereUniqueInput
    data: XOR<SubscriptionsUpdateWithoutBondInput, SubscriptionsUncheckedUpdateWithoutBondInput>
  }

  export type SubscriptionsUpdateManyWithWhereWithoutBondInput = {
    where: SubscriptionsScalarWhereInput
    data: XOR<SubscriptionsUpdateManyMutationInput, SubscriptionsUncheckedUpdateManyWithoutBondInput>
  }

  export type EventsUpsertWithWhereUniqueWithoutBondInput = {
    where: EventsWhereUniqueInput
    update: XOR<EventsUpdateWithoutBondInput, EventsUncheckedUpdateWithoutBondInput>
    create: XOR<EventsCreateWithoutBondInput, EventsUncheckedCreateWithoutBondInput>
  }

  export type EventsUpdateWithWhereUniqueWithoutBondInput = {
    where: EventsWhereUniqueInput
    data: XOR<EventsUpdateWithoutBondInput, EventsUncheckedUpdateWithoutBondInput>
  }

  export type EventsUpdateManyWithWhereWithoutBondInput = {
    where: EventsScalarWhereInput
    data: XOR<EventsUpdateManyMutationInput, EventsUncheckedUpdateManyWithoutBondInput>
  }

  export type TransactionsUpsertWithWhereUniqueWithoutBondInput = {
    where: TransactionsWhereUniqueInput
    update: XOR<TransactionsUpdateWithoutBondInput, TransactionsUncheckedUpdateWithoutBondInput>
    create: XOR<TransactionsCreateWithoutBondInput, TransactionsUncheckedCreateWithoutBondInput>
  }

  export type TransactionsUpdateWithWhereUniqueWithoutBondInput = {
    where: TransactionsWhereUniqueInput
    data: XOR<TransactionsUpdateWithoutBondInput, TransactionsUncheckedUpdateWithoutBondInput>
  }

  export type TransactionsUpdateManyWithWhereWithoutBondInput = {
    where: TransactionsScalarWhereInput
    data: XOR<TransactionsUpdateManyMutationInput, TransactionsUncheckedUpdateManyWithoutBondInput>
  }

  export type BondsCreateWithoutEventsInput = {
    id?: string
    bond_object_id?: string | null
    bond_name: string
    bond_type: $Enums.BondType
    bond_symbol: string
    organization_name: string
    face_value: bigint | number
    tl_unit_offered: number
    tl_unit_subscribed?: number | null
    maturity: Date | string
    status: $Enums.Status
    interest_rate: string
    purpose: string
    market?: $Enums.Market | null
    created_at?: Date | string
    subscription_period: number
    subscription_end_date: Date | string
    subscriptions?: SubscriptionsCreateNestedManyWithoutBondInput
    transactions?: TransactionsCreateNestedManyWithoutBondInput
  }

  export type BondsUncheckedCreateWithoutEventsInput = {
    id?: string
    bond_object_id?: string | null
    bond_name: string
    bond_type: $Enums.BondType
    bond_symbol: string
    organization_name: string
    face_value: bigint | number
    tl_unit_offered: number
    tl_unit_subscribed?: number | null
    maturity: Date | string
    status: $Enums.Status
    interest_rate: string
    purpose: string
    market?: $Enums.Market | null
    created_at?: Date | string
    subscription_period: number
    subscription_end_date: Date | string
    subscriptions?: SubscriptionsUncheckedCreateNestedManyWithoutBondInput
    transactions?: TransactionsUncheckedCreateNestedManyWithoutBondInput
  }

  export type BondsCreateOrConnectWithoutEventsInput = {
    where: BondsWhereUniqueInput
    create: XOR<BondsCreateWithoutEventsInput, BondsUncheckedCreateWithoutEventsInput>
  }

  export type UsersCreateWithoutEventsInput = {
    id?: string
    name?: string | null
    national_id: bigint | number
    wallet_address?: string | null
    salt: string
    email: string
    date_of_birth?: Date | string | null
    password?: string | null
    role: $Enums.Role
    hashed_mnemonic?: string | null
    created_at?: Date | string
    kyc_status?: $Enums.KYCStatus
    ekyc?: EKYCVerificationsCreateNestedManyWithoutUserInput
    subscriptions?: SubscriptionsCreateNestedManyWithoutUserInput
    transactionsFrom?: TransactionsCreateNestedManyWithoutFromInput
    transactionsTo?: TransactionsCreateNestedManyWithoutToInput
  }

  export type UsersUncheckedCreateWithoutEventsInput = {
    id?: string
    name?: string | null
    national_id: bigint | number
    wallet_address?: string | null
    salt: string
    email: string
    date_of_birth?: Date | string | null
    password?: string | null
    role: $Enums.Role
    hashed_mnemonic?: string | null
    created_at?: Date | string
    kyc_status?: $Enums.KYCStatus
    ekyc?: EKYCVerificationsUncheckedCreateNestedManyWithoutUserInput
    subscriptions?: SubscriptionsUncheckedCreateNestedManyWithoutUserInput
    transactionsFrom?: TransactionsUncheckedCreateNestedManyWithoutFromInput
    transactionsTo?: TransactionsUncheckedCreateNestedManyWithoutToInput
  }

  export type UsersCreateOrConnectWithoutEventsInput = {
    where: UsersWhereUniqueInput
    create: XOR<UsersCreateWithoutEventsInput, UsersUncheckedCreateWithoutEventsInput>
  }

  export type BondsUpsertWithoutEventsInput = {
    update: XOR<BondsUpdateWithoutEventsInput, BondsUncheckedUpdateWithoutEventsInput>
    create: XOR<BondsCreateWithoutEventsInput, BondsUncheckedCreateWithoutEventsInput>
    where?: BondsWhereInput
  }

  export type BondsUpdateToOneWithWhereWithoutEventsInput = {
    where?: BondsWhereInput
    data: XOR<BondsUpdateWithoutEventsInput, BondsUncheckedUpdateWithoutEventsInput>
  }

  export type BondsUpdateWithoutEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    bond_object_id?: NullableStringFieldUpdateOperationsInput | string | null
    bond_name?: StringFieldUpdateOperationsInput | string
    bond_type?: EnumBondTypeFieldUpdateOperationsInput | $Enums.BondType
    bond_symbol?: StringFieldUpdateOperationsInput | string
    organization_name?: StringFieldUpdateOperationsInput | string
    face_value?: BigIntFieldUpdateOperationsInput | bigint | number
    tl_unit_offered?: IntFieldUpdateOperationsInput | number
    tl_unit_subscribed?: NullableIntFieldUpdateOperationsInput | number | null
    maturity?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumStatusFieldUpdateOperationsInput | $Enums.Status
    interest_rate?: StringFieldUpdateOperationsInput | string
    purpose?: StringFieldUpdateOperationsInput | string
    market?: NullableEnumMarketFieldUpdateOperationsInput | $Enums.Market | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    subscription_period?: IntFieldUpdateOperationsInput | number
    subscription_end_date?: DateTimeFieldUpdateOperationsInput | Date | string
    subscriptions?: SubscriptionsUpdateManyWithoutBondNestedInput
    transactions?: TransactionsUpdateManyWithoutBondNestedInput
  }

  export type BondsUncheckedUpdateWithoutEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    bond_object_id?: NullableStringFieldUpdateOperationsInput | string | null
    bond_name?: StringFieldUpdateOperationsInput | string
    bond_type?: EnumBondTypeFieldUpdateOperationsInput | $Enums.BondType
    bond_symbol?: StringFieldUpdateOperationsInput | string
    organization_name?: StringFieldUpdateOperationsInput | string
    face_value?: BigIntFieldUpdateOperationsInput | bigint | number
    tl_unit_offered?: IntFieldUpdateOperationsInput | number
    tl_unit_subscribed?: NullableIntFieldUpdateOperationsInput | number | null
    maturity?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumStatusFieldUpdateOperationsInput | $Enums.Status
    interest_rate?: StringFieldUpdateOperationsInput | string
    purpose?: StringFieldUpdateOperationsInput | string
    market?: NullableEnumMarketFieldUpdateOperationsInput | $Enums.Market | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    subscription_period?: IntFieldUpdateOperationsInput | number
    subscription_end_date?: DateTimeFieldUpdateOperationsInput | Date | string
    subscriptions?: SubscriptionsUncheckedUpdateManyWithoutBondNestedInput
    transactions?: TransactionsUncheckedUpdateManyWithoutBondNestedInput
  }

  export type UsersUpsertWithoutEventsInput = {
    update: XOR<UsersUpdateWithoutEventsInput, UsersUncheckedUpdateWithoutEventsInput>
    create: XOR<UsersCreateWithoutEventsInput, UsersUncheckedCreateWithoutEventsInput>
    where?: UsersWhereInput
  }

  export type UsersUpdateToOneWithWhereWithoutEventsInput = {
    where?: UsersWhereInput
    data: XOR<UsersUpdateWithoutEventsInput, UsersUncheckedUpdateWithoutEventsInput>
  }

  export type UsersUpdateWithoutEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    national_id?: BigIntFieldUpdateOperationsInput | bigint | number
    wallet_address?: NullableStringFieldUpdateOperationsInput | string | null
    salt?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    date_of_birth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    hashed_mnemonic?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    kyc_status?: EnumKYCStatusFieldUpdateOperationsInput | $Enums.KYCStatus
    ekyc?: EKYCVerificationsUpdateManyWithoutUserNestedInput
    subscriptions?: SubscriptionsUpdateManyWithoutUserNestedInput
    transactionsFrom?: TransactionsUpdateManyWithoutFromNestedInput
    transactionsTo?: TransactionsUpdateManyWithoutToNestedInput
  }

  export type UsersUncheckedUpdateWithoutEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    national_id?: BigIntFieldUpdateOperationsInput | bigint | number
    wallet_address?: NullableStringFieldUpdateOperationsInput | string | null
    salt?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    date_of_birth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    hashed_mnemonic?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    kyc_status?: EnumKYCStatusFieldUpdateOperationsInput | $Enums.KYCStatus
    ekyc?: EKYCVerificationsUncheckedUpdateManyWithoutUserNestedInput
    subscriptions?: SubscriptionsUncheckedUpdateManyWithoutUserNestedInput
    transactionsFrom?: TransactionsUncheckedUpdateManyWithoutFromNestedInput
    transactionsTo?: TransactionsUncheckedUpdateManyWithoutToNestedInput
  }

  export type BondsCreateWithoutSubscriptionsInput = {
    id?: string
    bond_object_id?: string | null
    bond_name: string
    bond_type: $Enums.BondType
    bond_symbol: string
    organization_name: string
    face_value: bigint | number
    tl_unit_offered: number
    tl_unit_subscribed?: number | null
    maturity: Date | string
    status: $Enums.Status
    interest_rate: string
    purpose: string
    market?: $Enums.Market | null
    created_at?: Date | string
    subscription_period: number
    subscription_end_date: Date | string
    events?: EventsCreateNestedManyWithoutBondInput
    transactions?: TransactionsCreateNestedManyWithoutBondInput
  }

  export type BondsUncheckedCreateWithoutSubscriptionsInput = {
    id?: string
    bond_object_id?: string | null
    bond_name: string
    bond_type: $Enums.BondType
    bond_symbol: string
    organization_name: string
    face_value: bigint | number
    tl_unit_offered: number
    tl_unit_subscribed?: number | null
    maturity: Date | string
    status: $Enums.Status
    interest_rate: string
    purpose: string
    market?: $Enums.Market | null
    created_at?: Date | string
    subscription_period: number
    subscription_end_date: Date | string
    events?: EventsUncheckedCreateNestedManyWithoutBondInput
    transactions?: TransactionsUncheckedCreateNestedManyWithoutBondInput
  }

  export type BondsCreateOrConnectWithoutSubscriptionsInput = {
    where: BondsWhereUniqueInput
    create: XOR<BondsCreateWithoutSubscriptionsInput, BondsUncheckedCreateWithoutSubscriptionsInput>
  }

  export type UsersCreateWithoutSubscriptionsInput = {
    id?: string
    name?: string | null
    national_id: bigint | number
    wallet_address?: string | null
    salt: string
    email: string
    date_of_birth?: Date | string | null
    password?: string | null
    role: $Enums.Role
    hashed_mnemonic?: string | null
    created_at?: Date | string
    kyc_status?: $Enums.KYCStatus
    ekyc?: EKYCVerificationsCreateNestedManyWithoutUserInput
    events?: EventsCreateNestedManyWithoutUserInput
    transactionsFrom?: TransactionsCreateNestedManyWithoutFromInput
    transactionsTo?: TransactionsCreateNestedManyWithoutToInput
  }

  export type UsersUncheckedCreateWithoutSubscriptionsInput = {
    id?: string
    name?: string | null
    national_id: bigint | number
    wallet_address?: string | null
    salt: string
    email: string
    date_of_birth?: Date | string | null
    password?: string | null
    role: $Enums.Role
    hashed_mnemonic?: string | null
    created_at?: Date | string
    kyc_status?: $Enums.KYCStatus
    ekyc?: EKYCVerificationsUncheckedCreateNestedManyWithoutUserInput
    events?: EventsUncheckedCreateNestedManyWithoutUserInput
    transactionsFrom?: TransactionsUncheckedCreateNestedManyWithoutFromInput
    transactionsTo?: TransactionsUncheckedCreateNestedManyWithoutToInput
  }

  export type UsersCreateOrConnectWithoutSubscriptionsInput = {
    where: UsersWhereUniqueInput
    create: XOR<UsersCreateWithoutSubscriptionsInput, UsersUncheckedCreateWithoutSubscriptionsInput>
  }

  export type BondsUpsertWithoutSubscriptionsInput = {
    update: XOR<BondsUpdateWithoutSubscriptionsInput, BondsUncheckedUpdateWithoutSubscriptionsInput>
    create: XOR<BondsCreateWithoutSubscriptionsInput, BondsUncheckedCreateWithoutSubscriptionsInput>
    where?: BondsWhereInput
  }

  export type BondsUpdateToOneWithWhereWithoutSubscriptionsInput = {
    where?: BondsWhereInput
    data: XOR<BondsUpdateWithoutSubscriptionsInput, BondsUncheckedUpdateWithoutSubscriptionsInput>
  }

  export type BondsUpdateWithoutSubscriptionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    bond_object_id?: NullableStringFieldUpdateOperationsInput | string | null
    bond_name?: StringFieldUpdateOperationsInput | string
    bond_type?: EnumBondTypeFieldUpdateOperationsInput | $Enums.BondType
    bond_symbol?: StringFieldUpdateOperationsInput | string
    organization_name?: StringFieldUpdateOperationsInput | string
    face_value?: BigIntFieldUpdateOperationsInput | bigint | number
    tl_unit_offered?: IntFieldUpdateOperationsInput | number
    tl_unit_subscribed?: NullableIntFieldUpdateOperationsInput | number | null
    maturity?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumStatusFieldUpdateOperationsInput | $Enums.Status
    interest_rate?: StringFieldUpdateOperationsInput | string
    purpose?: StringFieldUpdateOperationsInput | string
    market?: NullableEnumMarketFieldUpdateOperationsInput | $Enums.Market | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    subscription_period?: IntFieldUpdateOperationsInput | number
    subscription_end_date?: DateTimeFieldUpdateOperationsInput | Date | string
    events?: EventsUpdateManyWithoutBondNestedInput
    transactions?: TransactionsUpdateManyWithoutBondNestedInput
  }

  export type BondsUncheckedUpdateWithoutSubscriptionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    bond_object_id?: NullableStringFieldUpdateOperationsInput | string | null
    bond_name?: StringFieldUpdateOperationsInput | string
    bond_type?: EnumBondTypeFieldUpdateOperationsInput | $Enums.BondType
    bond_symbol?: StringFieldUpdateOperationsInput | string
    organization_name?: StringFieldUpdateOperationsInput | string
    face_value?: BigIntFieldUpdateOperationsInput | bigint | number
    tl_unit_offered?: IntFieldUpdateOperationsInput | number
    tl_unit_subscribed?: NullableIntFieldUpdateOperationsInput | number | null
    maturity?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumStatusFieldUpdateOperationsInput | $Enums.Status
    interest_rate?: StringFieldUpdateOperationsInput | string
    purpose?: StringFieldUpdateOperationsInput | string
    market?: NullableEnumMarketFieldUpdateOperationsInput | $Enums.Market | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    subscription_period?: IntFieldUpdateOperationsInput | number
    subscription_end_date?: DateTimeFieldUpdateOperationsInput | Date | string
    events?: EventsUncheckedUpdateManyWithoutBondNestedInput
    transactions?: TransactionsUncheckedUpdateManyWithoutBondNestedInput
  }

  export type UsersUpsertWithoutSubscriptionsInput = {
    update: XOR<UsersUpdateWithoutSubscriptionsInput, UsersUncheckedUpdateWithoutSubscriptionsInput>
    create: XOR<UsersCreateWithoutSubscriptionsInput, UsersUncheckedCreateWithoutSubscriptionsInput>
    where?: UsersWhereInput
  }

  export type UsersUpdateToOneWithWhereWithoutSubscriptionsInput = {
    where?: UsersWhereInput
    data: XOR<UsersUpdateWithoutSubscriptionsInput, UsersUncheckedUpdateWithoutSubscriptionsInput>
  }

  export type UsersUpdateWithoutSubscriptionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    national_id?: BigIntFieldUpdateOperationsInput | bigint | number
    wallet_address?: NullableStringFieldUpdateOperationsInput | string | null
    salt?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    date_of_birth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    hashed_mnemonic?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    kyc_status?: EnumKYCStatusFieldUpdateOperationsInput | $Enums.KYCStatus
    ekyc?: EKYCVerificationsUpdateManyWithoutUserNestedInput
    events?: EventsUpdateManyWithoutUserNestedInput
    transactionsFrom?: TransactionsUpdateManyWithoutFromNestedInput
    transactionsTo?: TransactionsUpdateManyWithoutToNestedInput
  }

  export type UsersUncheckedUpdateWithoutSubscriptionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    national_id?: BigIntFieldUpdateOperationsInput | bigint | number
    wallet_address?: NullableStringFieldUpdateOperationsInput | string | null
    salt?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    date_of_birth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    hashed_mnemonic?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    kyc_status?: EnumKYCStatusFieldUpdateOperationsInput | $Enums.KYCStatus
    ekyc?: EKYCVerificationsUncheckedUpdateManyWithoutUserNestedInput
    events?: EventsUncheckedUpdateManyWithoutUserNestedInput
    transactionsFrom?: TransactionsUncheckedUpdateManyWithoutFromNestedInput
    transactionsTo?: TransactionsUncheckedUpdateManyWithoutToNestedInput
  }

  export type BondsCreateWithoutTransactionsInput = {
    id?: string
    bond_object_id?: string | null
    bond_name: string
    bond_type: $Enums.BondType
    bond_symbol: string
    organization_name: string
    face_value: bigint | number
    tl_unit_offered: number
    tl_unit_subscribed?: number | null
    maturity: Date | string
    status: $Enums.Status
    interest_rate: string
    purpose: string
    market?: $Enums.Market | null
    created_at?: Date | string
    subscription_period: number
    subscription_end_date: Date | string
    subscriptions?: SubscriptionsCreateNestedManyWithoutBondInput
    events?: EventsCreateNestedManyWithoutBondInput
  }

  export type BondsUncheckedCreateWithoutTransactionsInput = {
    id?: string
    bond_object_id?: string | null
    bond_name: string
    bond_type: $Enums.BondType
    bond_symbol: string
    organization_name: string
    face_value: bigint | number
    tl_unit_offered: number
    tl_unit_subscribed?: number | null
    maturity: Date | string
    status: $Enums.Status
    interest_rate: string
    purpose: string
    market?: $Enums.Market | null
    created_at?: Date | string
    subscription_period: number
    subscription_end_date: Date | string
    subscriptions?: SubscriptionsUncheckedCreateNestedManyWithoutBondInput
    events?: EventsUncheckedCreateNestedManyWithoutBondInput
  }

  export type BondsCreateOrConnectWithoutTransactionsInput = {
    where: BondsWhereUniqueInput
    create: XOR<BondsCreateWithoutTransactionsInput, BondsUncheckedCreateWithoutTransactionsInput>
  }

  export type UsersCreateWithoutTransactionsFromInput = {
    id?: string
    name?: string | null
    national_id: bigint | number
    wallet_address?: string | null
    salt: string
    email: string
    date_of_birth?: Date | string | null
    password?: string | null
    role: $Enums.Role
    hashed_mnemonic?: string | null
    created_at?: Date | string
    kyc_status?: $Enums.KYCStatus
    ekyc?: EKYCVerificationsCreateNestedManyWithoutUserInput
    subscriptions?: SubscriptionsCreateNestedManyWithoutUserInput
    events?: EventsCreateNestedManyWithoutUserInput
    transactionsTo?: TransactionsCreateNestedManyWithoutToInput
  }

  export type UsersUncheckedCreateWithoutTransactionsFromInput = {
    id?: string
    name?: string | null
    national_id: bigint | number
    wallet_address?: string | null
    salt: string
    email: string
    date_of_birth?: Date | string | null
    password?: string | null
    role: $Enums.Role
    hashed_mnemonic?: string | null
    created_at?: Date | string
    kyc_status?: $Enums.KYCStatus
    ekyc?: EKYCVerificationsUncheckedCreateNestedManyWithoutUserInput
    subscriptions?: SubscriptionsUncheckedCreateNestedManyWithoutUserInput
    events?: EventsUncheckedCreateNestedManyWithoutUserInput
    transactionsTo?: TransactionsUncheckedCreateNestedManyWithoutToInput
  }

  export type UsersCreateOrConnectWithoutTransactionsFromInput = {
    where: UsersWhereUniqueInput
    create: XOR<UsersCreateWithoutTransactionsFromInput, UsersUncheckedCreateWithoutTransactionsFromInput>
  }

  export type UsersCreateWithoutTransactionsToInput = {
    id?: string
    name?: string | null
    national_id: bigint | number
    wallet_address?: string | null
    salt: string
    email: string
    date_of_birth?: Date | string | null
    password?: string | null
    role: $Enums.Role
    hashed_mnemonic?: string | null
    created_at?: Date | string
    kyc_status?: $Enums.KYCStatus
    ekyc?: EKYCVerificationsCreateNestedManyWithoutUserInput
    subscriptions?: SubscriptionsCreateNestedManyWithoutUserInput
    events?: EventsCreateNestedManyWithoutUserInput
    transactionsFrom?: TransactionsCreateNestedManyWithoutFromInput
  }

  export type UsersUncheckedCreateWithoutTransactionsToInput = {
    id?: string
    name?: string | null
    national_id: bigint | number
    wallet_address?: string | null
    salt: string
    email: string
    date_of_birth?: Date | string | null
    password?: string | null
    role: $Enums.Role
    hashed_mnemonic?: string | null
    created_at?: Date | string
    kyc_status?: $Enums.KYCStatus
    ekyc?: EKYCVerificationsUncheckedCreateNestedManyWithoutUserInput
    subscriptions?: SubscriptionsUncheckedCreateNestedManyWithoutUserInput
    events?: EventsUncheckedCreateNestedManyWithoutUserInput
    transactionsFrom?: TransactionsUncheckedCreateNestedManyWithoutFromInput
  }

  export type UsersCreateOrConnectWithoutTransactionsToInput = {
    where: UsersWhereUniqueInput
    create: XOR<UsersCreateWithoutTransactionsToInput, UsersUncheckedCreateWithoutTransactionsToInput>
  }

  export type BondsUpsertWithoutTransactionsInput = {
    update: XOR<BondsUpdateWithoutTransactionsInput, BondsUncheckedUpdateWithoutTransactionsInput>
    create: XOR<BondsCreateWithoutTransactionsInput, BondsUncheckedCreateWithoutTransactionsInput>
    where?: BondsWhereInput
  }

  export type BondsUpdateToOneWithWhereWithoutTransactionsInput = {
    where?: BondsWhereInput
    data: XOR<BondsUpdateWithoutTransactionsInput, BondsUncheckedUpdateWithoutTransactionsInput>
  }

  export type BondsUpdateWithoutTransactionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    bond_object_id?: NullableStringFieldUpdateOperationsInput | string | null
    bond_name?: StringFieldUpdateOperationsInput | string
    bond_type?: EnumBondTypeFieldUpdateOperationsInput | $Enums.BondType
    bond_symbol?: StringFieldUpdateOperationsInput | string
    organization_name?: StringFieldUpdateOperationsInput | string
    face_value?: BigIntFieldUpdateOperationsInput | bigint | number
    tl_unit_offered?: IntFieldUpdateOperationsInput | number
    tl_unit_subscribed?: NullableIntFieldUpdateOperationsInput | number | null
    maturity?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumStatusFieldUpdateOperationsInput | $Enums.Status
    interest_rate?: StringFieldUpdateOperationsInput | string
    purpose?: StringFieldUpdateOperationsInput | string
    market?: NullableEnumMarketFieldUpdateOperationsInput | $Enums.Market | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    subscription_period?: IntFieldUpdateOperationsInput | number
    subscription_end_date?: DateTimeFieldUpdateOperationsInput | Date | string
    subscriptions?: SubscriptionsUpdateManyWithoutBondNestedInput
    events?: EventsUpdateManyWithoutBondNestedInput
  }

  export type BondsUncheckedUpdateWithoutTransactionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    bond_object_id?: NullableStringFieldUpdateOperationsInput | string | null
    bond_name?: StringFieldUpdateOperationsInput | string
    bond_type?: EnumBondTypeFieldUpdateOperationsInput | $Enums.BondType
    bond_symbol?: StringFieldUpdateOperationsInput | string
    organization_name?: StringFieldUpdateOperationsInput | string
    face_value?: BigIntFieldUpdateOperationsInput | bigint | number
    tl_unit_offered?: IntFieldUpdateOperationsInput | number
    tl_unit_subscribed?: NullableIntFieldUpdateOperationsInput | number | null
    maturity?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumStatusFieldUpdateOperationsInput | $Enums.Status
    interest_rate?: StringFieldUpdateOperationsInput | string
    purpose?: StringFieldUpdateOperationsInput | string
    market?: NullableEnumMarketFieldUpdateOperationsInput | $Enums.Market | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    subscription_period?: IntFieldUpdateOperationsInput | number
    subscription_end_date?: DateTimeFieldUpdateOperationsInput | Date | string
    subscriptions?: SubscriptionsUncheckedUpdateManyWithoutBondNestedInput
    events?: EventsUncheckedUpdateManyWithoutBondNestedInput
  }

  export type UsersUpsertWithoutTransactionsFromInput = {
    update: XOR<UsersUpdateWithoutTransactionsFromInput, UsersUncheckedUpdateWithoutTransactionsFromInput>
    create: XOR<UsersCreateWithoutTransactionsFromInput, UsersUncheckedCreateWithoutTransactionsFromInput>
    where?: UsersWhereInput
  }

  export type UsersUpdateToOneWithWhereWithoutTransactionsFromInput = {
    where?: UsersWhereInput
    data: XOR<UsersUpdateWithoutTransactionsFromInput, UsersUncheckedUpdateWithoutTransactionsFromInput>
  }

  export type UsersUpdateWithoutTransactionsFromInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    national_id?: BigIntFieldUpdateOperationsInput | bigint | number
    wallet_address?: NullableStringFieldUpdateOperationsInput | string | null
    salt?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    date_of_birth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    hashed_mnemonic?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    kyc_status?: EnumKYCStatusFieldUpdateOperationsInput | $Enums.KYCStatus
    ekyc?: EKYCVerificationsUpdateManyWithoutUserNestedInput
    subscriptions?: SubscriptionsUpdateManyWithoutUserNestedInput
    events?: EventsUpdateManyWithoutUserNestedInput
    transactionsTo?: TransactionsUpdateManyWithoutToNestedInput
  }

  export type UsersUncheckedUpdateWithoutTransactionsFromInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    national_id?: BigIntFieldUpdateOperationsInput | bigint | number
    wallet_address?: NullableStringFieldUpdateOperationsInput | string | null
    salt?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    date_of_birth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    hashed_mnemonic?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    kyc_status?: EnumKYCStatusFieldUpdateOperationsInput | $Enums.KYCStatus
    ekyc?: EKYCVerificationsUncheckedUpdateManyWithoutUserNestedInput
    subscriptions?: SubscriptionsUncheckedUpdateManyWithoutUserNestedInput
    events?: EventsUncheckedUpdateManyWithoutUserNestedInput
    transactionsTo?: TransactionsUncheckedUpdateManyWithoutToNestedInput
  }

  export type UsersUpsertWithoutTransactionsToInput = {
    update: XOR<UsersUpdateWithoutTransactionsToInput, UsersUncheckedUpdateWithoutTransactionsToInput>
    create: XOR<UsersCreateWithoutTransactionsToInput, UsersUncheckedCreateWithoutTransactionsToInput>
    where?: UsersWhereInput
  }

  export type UsersUpdateToOneWithWhereWithoutTransactionsToInput = {
    where?: UsersWhereInput
    data: XOR<UsersUpdateWithoutTransactionsToInput, UsersUncheckedUpdateWithoutTransactionsToInput>
  }

  export type UsersUpdateWithoutTransactionsToInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    national_id?: BigIntFieldUpdateOperationsInput | bigint | number
    wallet_address?: NullableStringFieldUpdateOperationsInput | string | null
    salt?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    date_of_birth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    hashed_mnemonic?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    kyc_status?: EnumKYCStatusFieldUpdateOperationsInput | $Enums.KYCStatus
    ekyc?: EKYCVerificationsUpdateManyWithoutUserNestedInput
    subscriptions?: SubscriptionsUpdateManyWithoutUserNestedInput
    events?: EventsUpdateManyWithoutUserNestedInput
    transactionsFrom?: TransactionsUpdateManyWithoutFromNestedInput
  }

  export type UsersUncheckedUpdateWithoutTransactionsToInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    national_id?: BigIntFieldUpdateOperationsInput | bigint | number
    wallet_address?: NullableStringFieldUpdateOperationsInput | string | null
    salt?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    date_of_birth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    hashed_mnemonic?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    kyc_status?: EnumKYCStatusFieldUpdateOperationsInput | $Enums.KYCStatus
    ekyc?: EKYCVerificationsUncheckedUpdateManyWithoutUserNestedInput
    subscriptions?: SubscriptionsUncheckedUpdateManyWithoutUserNestedInput
    events?: EventsUncheckedUpdateManyWithoutUserNestedInput
    transactionsFrom?: TransactionsUncheckedUpdateManyWithoutFromNestedInput
  }

  export type EKYCVerificationsCreateManyUserInput = {
    id?: string
    national_id_hash: string
    date_of_birth: Date | string
    age?: number | null
    custodial_address: string
    tx_digest?: string | null
    status?: $Enums.KYCStatus
    reason?: string | null
    request_id?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type SubscriptionsCreateManyUserInput = {
    id?: string
    bond_id: string
    wallet_address: string
    committed_amount: bigint | number
    tx_hash: string
    subscription_amt?: bigint | number | null
    created_at?: Date | string
  }

  export type EventsCreateManyUserInput = {
    id?: string
    type: $Enums.Type
    bond_id: string
    details: string
    tx_hash: string
    created_at?: Date | string
  }

  export type TransactionsCreateManyFromInput = {
    id?: string
    bond_id: string
    user_to: string
    tx_hash: string
    created_at?: Date | string
  }

  export type TransactionsCreateManyToInput = {
    id?: string
    bond_id: string
    user_from: string
    tx_hash: string
    created_at?: Date | string
  }

  export type EKYCVerificationsUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    national_id_hash?: StringFieldUpdateOperationsInput | string
    date_of_birth?: DateTimeFieldUpdateOperationsInput | Date | string
    age?: NullableIntFieldUpdateOperationsInput | number | null
    custodial_address?: StringFieldUpdateOperationsInput | string
    tx_digest?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumKYCStatusFieldUpdateOperationsInput | $Enums.KYCStatus
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    request_id?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EKYCVerificationsUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    national_id_hash?: StringFieldUpdateOperationsInput | string
    date_of_birth?: DateTimeFieldUpdateOperationsInput | Date | string
    age?: NullableIntFieldUpdateOperationsInput | number | null
    custodial_address?: StringFieldUpdateOperationsInput | string
    tx_digest?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumKYCStatusFieldUpdateOperationsInput | $Enums.KYCStatus
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    request_id?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EKYCVerificationsUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    national_id_hash?: StringFieldUpdateOperationsInput | string
    date_of_birth?: DateTimeFieldUpdateOperationsInput | Date | string
    age?: NullableIntFieldUpdateOperationsInput | number | null
    custodial_address?: StringFieldUpdateOperationsInput | string
    tx_digest?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumKYCStatusFieldUpdateOperationsInput | $Enums.KYCStatus
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    request_id?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionsUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    wallet_address?: StringFieldUpdateOperationsInput | string
    committed_amount?: BigIntFieldUpdateOperationsInput | bigint | number
    tx_hash?: StringFieldUpdateOperationsInput | string
    subscription_amt?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    bond?: BondsUpdateOneRequiredWithoutSubscriptionsNestedInput
  }

  export type SubscriptionsUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    bond_id?: StringFieldUpdateOperationsInput | string
    wallet_address?: StringFieldUpdateOperationsInput | string
    committed_amount?: BigIntFieldUpdateOperationsInput | bigint | number
    tx_hash?: StringFieldUpdateOperationsInput | string
    subscription_amt?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionsUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    bond_id?: StringFieldUpdateOperationsInput | string
    wallet_address?: StringFieldUpdateOperationsInput | string
    committed_amount?: BigIntFieldUpdateOperationsInput | bigint | number
    tx_hash?: StringFieldUpdateOperationsInput | string
    subscription_amt?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventsUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumTypeFieldUpdateOperationsInput | $Enums.Type
    details?: StringFieldUpdateOperationsInput | string
    tx_hash?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    bond?: BondsUpdateOneRequiredWithoutEventsNestedInput
  }

  export type EventsUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumTypeFieldUpdateOperationsInput | $Enums.Type
    bond_id?: StringFieldUpdateOperationsInput | string
    details?: StringFieldUpdateOperationsInput | string
    tx_hash?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventsUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumTypeFieldUpdateOperationsInput | $Enums.Type
    bond_id?: StringFieldUpdateOperationsInput | string
    details?: StringFieldUpdateOperationsInput | string
    tx_hash?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionsUpdateWithoutFromInput = {
    id?: StringFieldUpdateOperationsInput | string
    tx_hash?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    bond?: BondsUpdateOneRequiredWithoutTransactionsNestedInput
    to?: UsersUpdateOneRequiredWithoutTransactionsToNestedInput
  }

  export type TransactionsUncheckedUpdateWithoutFromInput = {
    id?: StringFieldUpdateOperationsInput | string
    bond_id?: StringFieldUpdateOperationsInput | string
    user_to?: StringFieldUpdateOperationsInput | string
    tx_hash?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionsUncheckedUpdateManyWithoutFromInput = {
    id?: StringFieldUpdateOperationsInput | string
    bond_id?: StringFieldUpdateOperationsInput | string
    user_to?: StringFieldUpdateOperationsInput | string
    tx_hash?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionsUpdateWithoutToInput = {
    id?: StringFieldUpdateOperationsInput | string
    tx_hash?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    bond?: BondsUpdateOneRequiredWithoutTransactionsNestedInput
    from?: UsersUpdateOneRequiredWithoutTransactionsFromNestedInput
  }

  export type TransactionsUncheckedUpdateWithoutToInput = {
    id?: StringFieldUpdateOperationsInput | string
    bond_id?: StringFieldUpdateOperationsInput | string
    user_from?: StringFieldUpdateOperationsInput | string
    tx_hash?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionsUncheckedUpdateManyWithoutToInput = {
    id?: StringFieldUpdateOperationsInput | string
    bond_id?: StringFieldUpdateOperationsInput | string
    user_from?: StringFieldUpdateOperationsInput | string
    tx_hash?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionsCreateManyBondInput = {
    id?: string
    user_id: string
    wallet_address: string
    committed_amount: bigint | number
    tx_hash: string
    subscription_amt?: bigint | number | null
    created_at?: Date | string
  }

  export type EventsCreateManyBondInput = {
    id?: string
    type: $Enums.Type
    user_id: string
    details: string
    tx_hash: string
    created_at?: Date | string
  }

  export type TransactionsCreateManyBondInput = {
    id?: string
    user_from: string
    user_to: string
    tx_hash: string
    created_at?: Date | string
  }

  export type SubscriptionsUpdateWithoutBondInput = {
    id?: StringFieldUpdateOperationsInput | string
    wallet_address?: StringFieldUpdateOperationsInput | string
    committed_amount?: BigIntFieldUpdateOperationsInput | bigint | number
    tx_hash?: StringFieldUpdateOperationsInput | string
    subscription_amt?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UsersUpdateOneRequiredWithoutSubscriptionsNestedInput
  }

  export type SubscriptionsUncheckedUpdateWithoutBondInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    wallet_address?: StringFieldUpdateOperationsInput | string
    committed_amount?: BigIntFieldUpdateOperationsInput | bigint | number
    tx_hash?: StringFieldUpdateOperationsInput | string
    subscription_amt?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionsUncheckedUpdateManyWithoutBondInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    wallet_address?: StringFieldUpdateOperationsInput | string
    committed_amount?: BigIntFieldUpdateOperationsInput | bigint | number
    tx_hash?: StringFieldUpdateOperationsInput | string
    subscription_amt?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventsUpdateWithoutBondInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumTypeFieldUpdateOperationsInput | $Enums.Type
    details?: StringFieldUpdateOperationsInput | string
    tx_hash?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UsersUpdateOneRequiredWithoutEventsNestedInput
  }

  export type EventsUncheckedUpdateWithoutBondInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumTypeFieldUpdateOperationsInput | $Enums.Type
    user_id?: StringFieldUpdateOperationsInput | string
    details?: StringFieldUpdateOperationsInput | string
    tx_hash?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventsUncheckedUpdateManyWithoutBondInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumTypeFieldUpdateOperationsInput | $Enums.Type
    user_id?: StringFieldUpdateOperationsInput | string
    details?: StringFieldUpdateOperationsInput | string
    tx_hash?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionsUpdateWithoutBondInput = {
    id?: StringFieldUpdateOperationsInput | string
    tx_hash?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    from?: UsersUpdateOneRequiredWithoutTransactionsFromNestedInput
    to?: UsersUpdateOneRequiredWithoutTransactionsToNestedInput
  }

  export type TransactionsUncheckedUpdateWithoutBondInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_from?: StringFieldUpdateOperationsInput | string
    user_to?: StringFieldUpdateOperationsInput | string
    tx_hash?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionsUncheckedUpdateManyWithoutBondInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_from?: StringFieldUpdateOperationsInput | string
    user_to?: StringFieldUpdateOperationsInput | string
    tx_hash?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}