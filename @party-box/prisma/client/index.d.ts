
/**
 * Client
**/

import * as runtime from './runtime/index';
declare const prisma: unique symbol
export type PrismaPromise<A> = Promise<A> & {[prisma]: true}
type UnwrapPromise<P extends any> = P extends Promise<infer R> ? R : P
type UnwrapTuple<Tuple extends readonly unknown[]> = {
  [K in keyof Tuple]: K extends `${number}` ? Tuple[K] extends PrismaPromise<infer X> ? X : UnwrapPromise<Tuple[K]> : UnwrapPromise<Tuple[K]>
};


/**
 * Model Event
 * 
 */
export type Event = {
  id: number
  name: string
  description: string | null
  published: boolean
  prices: Prisma.JsonValue[]
  media: string[]
  thumbnail: string | null
  hashtags: string[]
  maxTickets: number
  location: string
  stripeProductId: string | null
  snsTopicArn: string | null
  startTime: Date
  endTime: Date
  hostId: number
}

/**
 * Model EventNotification
 * 
 */
export type EventNotification = {
  id: number
  messageTime: Date
  message: string
  eventId: number
  sent: boolean
}

/**
 * Model User
 * 
 */
export type User = {
  id: string
  email: string
  name: string | null
  roles: string[]
}

/**
 * Model Host
 * 
 */
export type Host = {
  id: number
  name: string
  description: string | null
  createdBy: string
  imageUrl: string | null
}

/**
 * Model HostRole
 * 
 */
export type HostRole = {
  hostId: number
  userId: string
  role: string
}

/**
 * Model Ticket
 * 
 */
export type Ticket = {
  id: number
  eventId: number
  stripeSessionId: string
  stripeChargeId: string
  receiptUrl: string
  customerName: string
  customerPhoneNumber: string
  customerEmail: string
  userId: string | null
  ticketQuantity: number
  used: boolean
  purchasedAt: Date
}

/**
 * Model Service
 * 
 */
export type Service = {
  id: number
  name: string
  description: string | null
  imageUrl: string | null
  price: number
}

/**
 * Model Artist
 * 
 */
export type Artist = {
  id: number
  name: string
  description: string | null
  imageUrl: string | null
  price: number
  phoneNumber: string | null
  email: string | null
  website: string | null
  genres: string[]
}


/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Events
 * const events = await prisma.event.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  T extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof T ? T['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<T['log']> : never : never,
  GlobalReject extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined = 'rejectOnNotFound' extends keyof T
    ? T['rejectOnNotFound']
    : false
      > {
      /**
       * @private
       */
      private fetcher;
      /**
       * @private
       */
      private readonly dmmf;
      /**
       * @private
       */
      private connectionPromise?;
      /**
       * @private
       */
      private disconnectionPromise?;
      /**
       * @private
       */
      private readonly engineConfig;
      /**
       * @private
       */
      private readonly measurePerformance;

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Events
   * const events = await prisma.event.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<T, Prisma.PrismaClientOptions>);
  $on<V extends (U | 'beforeExit')>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : V extends 'beforeExit' ? () => Promise<void> : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): Promise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): Promise<void>;

  /**
   * Add a middleware
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): PrismaPromise<number>;

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
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): PrismaPromise<T>;

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
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): PrismaPromise<T>;

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
  $transaction<P extends PrismaPromise<any>[]>(arg: [...P]): Promise<UnwrapTuple<P>>;

      /**
   * `prisma.event`: Exposes CRUD operations for the **Event** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Events
    * const events = await prisma.event.findMany()
    * ```
    */
  get event(): Prisma.EventDelegate<GlobalReject>;

  /**
   * `prisma.eventNotification`: Exposes CRUD operations for the **EventNotification** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more EventNotifications
    * const eventNotifications = await prisma.eventNotification.findMany()
    * ```
    */
  get eventNotification(): Prisma.EventNotificationDelegate<GlobalReject>;

  /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<GlobalReject>;

  /**
   * `prisma.host`: Exposes CRUD operations for the **Host** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Hosts
    * const hosts = await prisma.host.findMany()
    * ```
    */
  get host(): Prisma.HostDelegate<GlobalReject>;

  /**
   * `prisma.hostRole`: Exposes CRUD operations for the **HostRole** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more HostRoles
    * const hostRoles = await prisma.hostRole.findMany()
    * ```
    */
  get hostRole(): Prisma.HostRoleDelegate<GlobalReject>;

  /**
   * `prisma.ticket`: Exposes CRUD operations for the **Ticket** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Tickets
    * const tickets = await prisma.ticket.findMany()
    * ```
    */
  get ticket(): Prisma.TicketDelegate<GlobalReject>;

  /**
   * `prisma.service`: Exposes CRUD operations for the **Service** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Services
    * const services = await prisma.service.findMany()
    * ```
    */
  get service(): Prisma.ServiceDelegate<GlobalReject>;

  /**
   * `prisma.artist`: Exposes CRUD operations for the **Artist** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Artists
    * const artists = await prisma.artist.findMany()
    * ```
    */
  get artist(): Prisma.ArtistDelegate<GlobalReject>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

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
  export import Metrics = runtime.Metrics
  export import Metric = runtime.Metric
  export import MetricHistogram = runtime.MetricHistogram
  export import MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
   * Prisma Client JS version: 4.3.1
   * Query Engine version: c875e43600dfe042452e0b868f7a48b817b9640b
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON object.
   * This type can be useful to enforce some input to be JSON-compatible or as a super-type to be extended from. 
   */
  export type JsonObject = {[Key in string]?: JsonValue}

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON array.
   */
  export interface JsonArray extends Array<JsonValue> {}

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches any valid JSON value.
   */
  export type JsonValue = string | number | boolean | JsonObject | JsonArray | null

  /**
   * Matches a JSON object.
   * Unlike `JsonObject`, this type allows undefined and read-only properties.
   */
  export type InputJsonObject = {readonly [Key in string]?: InputJsonValue | null}

  /**
   * Matches a JSON array.
   * Unlike `JsonArray`, readonly arrays are assignable to this type.
   */
  export interface InputJsonArray extends ReadonlyArray<InputJsonValue | null> {}

  /**
   * Matches any valid value that can be used as an input for operations like
   * create and update as the value of a JSON field. Unlike `JsonValue`, this
   * type allows read-only arrays and read-only object properties and disallows
   * `null` at the top level.
   *
   * `null` cannot be used as the value of a JSON field because its meaning
   * would be ambiguous. Use `Prisma.JsonNull` to store the JSON null value or
   * `Prisma.DbNull` to clear the JSON value and set the field to the database
   * NULL value instead.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-by-null-values
   */
  export type InputJsonValue = string | number | boolean | InputJsonObject | InputJsonArray

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
  type HasSelect = {
    select: any
  }
  type HasInclude = {
    include: any
  }
  type CheckSelect<T, S, U> = T extends SelectAndInclude
    ? 'Please either choose `select` or `include`'
    : T extends HasSelect
    ? U
    : T extends HasInclude
    ? U
    : S

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => Promise<any>> = PromiseType<ReturnType<T>>

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

  export type TruthyKeys<T> = {
    [key in keyof T]: T[key] extends false | undefined | null ? never : key
  }[keyof T]

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

  type Exact<A, W = unknown> = 
  W extends unknown ? A extends Narrowable ? Cast<A, W> : Cast<
  {[K in keyof A]: K extends keyof W ? Exact<A[K], W[K]> : never},
  {[K in keyof W]: K extends keyof A ? Exact<A[K], W[K]> : W[K]}>
  : never;

  type Narrowable = string | number | boolean | bigint;

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;

  export function validator<V>(): <S>(select: Exact<S, V>) => S;

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
   * Like `Pick`, but with an array
   */
  type PickArray<T, K extends Array<keyof T>> = Prisma__Pick<T, TupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export import FieldRef = runtime.FieldRef

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>

  class PrismaClientFetcher {
    private readonly prisma;
    private readonly debug;
    private readonly hooks?;
    constructor(prisma: PrismaClient<any, any>, debug?: boolean, hooks?: Hooks | undefined);
    request<T>(document: any, dataPath?: string[], rootField?: string, typeName?: string, isList?: boolean, callsite?: string): Promise<T>;
    sanitizeMessage(message: string): string;
    protected unpack(document: any, data: any, path: string[], rootField?: string, isList?: boolean): any;
  }

  export const ModelName: {
    Event: 'Event',
    EventNotification: 'EventNotification',
    User: 'User',
    Host: 'Host',
    HostRole: 'HostRole',
    Ticket: 'Ticket',
    Service: 'Service',
    Artist: 'Artist'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  export type RejectOnNotFound = boolean | ((error: Error) => Error)
  export type RejectPerModel = { [P in ModelName]?: RejectOnNotFound }
  export type RejectPerOperation =  { [P in "findUnique" | "findFirst"]?: RejectPerModel | RejectOnNotFound } 
  type IsReject<T> = T extends true ? True : T extends (err: Error) => Error ? True : False
  export type HasReject<
    GlobalRejectSettings extends Prisma.PrismaClientOptions['rejectOnNotFound'],
    LocalRejectSettings,
    Action extends PrismaAction,
    Model extends ModelName
  > = LocalRejectSettings extends RejectOnNotFound
    ? IsReject<LocalRejectSettings>
    : GlobalRejectSettings extends RejectPerOperation
    ? Action extends keyof GlobalRejectSettings
      ? GlobalRejectSettings[Action] extends RejectOnNotFound
        ? IsReject<GlobalRejectSettings[Action]>
        : GlobalRejectSettings[Action] extends RejectPerModel
        ? Model extends keyof GlobalRejectSettings[Action]
          ? IsReject<GlobalRejectSettings[Action][Model]>
          : False
        : False
      : False
    : IsReject<GlobalRejectSettings>
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'

  export interface PrismaClientOptions {
    /**
     * Configure findUnique/findFirst to throw an error if the query returns null. 
     * @deprecated since 4.0.0. Use `findUniqueOrThrow`/`findFirstOrThrow` methods instead.
     * @example
     * ```
     * // Reject on both findUnique/findFirst
     * rejectOnNotFound: true
     * // Reject only on findFirst with a custom error
     * rejectOnNotFound: { findFirst: (err) => new Error("Custom Error")}
     * // Reject on user.findUnique with a custom error
     * rejectOnNotFound: { findUnique: {User: (err) => new Error("User not found")}}
     * ```
     */
    rejectOnNotFound?: RejectOnNotFound | RejectPerOperation
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources

    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat

    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: Array<LogLevel | LogDefinition>
  }

  export type Hooks = {
    beforeRequest?: (options: { query: string, path: string[], rootField?: string, typeName?: string, document: any }) => any
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

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
    | 'findMany'
    | 'findFirst'
    | 'create'
    | 'createMany'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'

  /**
   * These options are being passed in to the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => Promise<T>,
  ) => Promise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type EventCountOutputType
   */


  export type EventCountOutputType = {
    tickets: number
    eventNotifications: number
  }

  export type EventCountOutputTypeSelect = {
    tickets?: boolean
    eventNotifications?: boolean
  }

  export type EventCountOutputTypeGetPayload<
    S extends boolean | null | undefined | EventCountOutputTypeArgs,
    U = keyof S
      > = S extends true
        ? EventCountOutputType
    : S extends undefined
    ? never
    : S extends EventCountOutputTypeArgs
    ?'include' extends U
    ? EventCountOutputType 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]:
    P extends keyof EventCountOutputType ? EventCountOutputType[P] : never
  } 
    : EventCountOutputType
  : EventCountOutputType




  // Custom InputTypes

  /**
   * EventCountOutputType without action
   */
  export type EventCountOutputTypeArgs = {
    /**
     * Select specific fields to fetch from the EventCountOutputType
     * 
    **/
    select?: EventCountOutputTypeSelect | null
  }



  /**
   * Count Type UserCountOutputType
   */


  export type UserCountOutputType = {
    hostRoles: number
    tickets: number
    hosts: number
  }

  export type UserCountOutputTypeSelect = {
    hostRoles?: boolean
    tickets?: boolean
    hosts?: boolean
  }

  export type UserCountOutputTypeGetPayload<
    S extends boolean | null | undefined | UserCountOutputTypeArgs,
    U = keyof S
      > = S extends true
        ? UserCountOutputType
    : S extends undefined
    ? never
    : S extends UserCountOutputTypeArgs
    ?'include' extends U
    ? UserCountOutputType 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]:
    P extends keyof UserCountOutputType ? UserCountOutputType[P] : never
  } 
    : UserCountOutputType
  : UserCountOutputType




  // Custom InputTypes

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeArgs = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     * 
    **/
    select?: UserCountOutputTypeSelect | null
  }



  /**
   * Count Type HostCountOutputType
   */


  export type HostCountOutputType = {
    events: number
    hostRoles: number
  }

  export type HostCountOutputTypeSelect = {
    events?: boolean
    hostRoles?: boolean
  }

  export type HostCountOutputTypeGetPayload<
    S extends boolean | null | undefined | HostCountOutputTypeArgs,
    U = keyof S
      > = S extends true
        ? HostCountOutputType
    : S extends undefined
    ? never
    : S extends HostCountOutputTypeArgs
    ?'include' extends U
    ? HostCountOutputType 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]:
    P extends keyof HostCountOutputType ? HostCountOutputType[P] : never
  } 
    : HostCountOutputType
  : HostCountOutputType




  // Custom InputTypes

  /**
   * HostCountOutputType without action
   */
  export type HostCountOutputTypeArgs = {
    /**
     * Select specific fields to fetch from the HostCountOutputType
     * 
    **/
    select?: HostCountOutputTypeSelect | null
  }



  /**
   * Models
   */

  /**
   * Model Event
   */


  export type AggregateEvent = {
    _count: EventCountAggregateOutputType | null
    _avg: EventAvgAggregateOutputType | null
    _sum: EventSumAggregateOutputType | null
    _min: EventMinAggregateOutputType | null
    _max: EventMaxAggregateOutputType | null
  }

  export type EventAvgAggregateOutputType = {
    id: number | null
    maxTickets: number | null
    hostId: number | null
  }

  export type EventSumAggregateOutputType = {
    id: number | null
    maxTickets: number | null
    hostId: number | null
  }

  export type EventMinAggregateOutputType = {
    id: number | null
    name: string | null
    description: string | null
    published: boolean | null
    thumbnail: string | null
    maxTickets: number | null
    location: string | null
    stripeProductId: string | null
    snsTopicArn: string | null
    startTime: Date | null
    endTime: Date | null
    hostId: number | null
  }

  export type EventMaxAggregateOutputType = {
    id: number | null
    name: string | null
    description: string | null
    published: boolean | null
    thumbnail: string | null
    maxTickets: number | null
    location: string | null
    stripeProductId: string | null
    snsTopicArn: string | null
    startTime: Date | null
    endTime: Date | null
    hostId: number | null
  }

  export type EventCountAggregateOutputType = {
    id: number
    name: number
    description: number
    published: number
    prices: number
    media: number
    thumbnail: number
    hashtags: number
    maxTickets: number
    location: number
    stripeProductId: number
    snsTopicArn: number
    startTime: number
    endTime: number
    hostId: number
    _all: number
  }


  export type EventAvgAggregateInputType = {
    id?: true
    maxTickets?: true
    hostId?: true
  }

  export type EventSumAggregateInputType = {
    id?: true
    maxTickets?: true
    hostId?: true
  }

  export type EventMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    published?: true
    thumbnail?: true
    maxTickets?: true
    location?: true
    stripeProductId?: true
    snsTopicArn?: true
    startTime?: true
    endTime?: true
    hostId?: true
  }

  export type EventMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    published?: true
    thumbnail?: true
    maxTickets?: true
    location?: true
    stripeProductId?: true
    snsTopicArn?: true
    startTime?: true
    endTime?: true
    hostId?: true
  }

  export type EventCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    published?: true
    prices?: true
    media?: true
    thumbnail?: true
    hashtags?: true
    maxTickets?: true
    location?: true
    stripeProductId?: true
    snsTopicArn?: true
    startTime?: true
    endTime?: true
    hostId?: true
    _all?: true
  }

  export type EventAggregateArgs = {
    /**
     * Filter which Event to aggregate.
     * 
    **/
    where?: EventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Events to fetch.
     * 
    **/
    orderBy?: Enumerable<EventOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     * 
    **/
    cursor?: EventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Events from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Events.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Events
    **/
    _count?: true | EventCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: EventAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: EventSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EventMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EventMaxAggregateInputType
  }

  export type GetEventAggregateType<T extends EventAggregateArgs> = {
        [P in keyof T & keyof AggregateEvent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEvent[P]>
      : GetScalarType<T[P], AggregateEvent[P]>
  }




  export type EventGroupByArgs = {
    where?: EventWhereInput
    orderBy?: Enumerable<EventOrderByWithAggregationInput>
    by: Array<EventScalarFieldEnum>
    having?: EventScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EventCountAggregateInputType | true
    _avg?: EventAvgAggregateInputType
    _sum?: EventSumAggregateInputType
    _min?: EventMinAggregateInputType
    _max?: EventMaxAggregateInputType
  }


  export type EventGroupByOutputType = {
    id: number
    name: string
    description: string | null
    published: boolean
    prices: JsonValue[]
    media: string[]
    thumbnail: string | null
    hashtags: string[]
    maxTickets: number
    location: string
    stripeProductId: string | null
    snsTopicArn: string | null
    startTime: Date
    endTime: Date
    hostId: number
    _count: EventCountAggregateOutputType | null
    _avg: EventAvgAggregateOutputType | null
    _sum: EventSumAggregateOutputType | null
    _min: EventMinAggregateOutputType | null
    _max: EventMaxAggregateOutputType | null
  }

  type GetEventGroupByPayload<T extends EventGroupByArgs> = PrismaPromise<
    Array<
      PickArray<EventGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EventGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EventGroupByOutputType[P]>
            : GetScalarType<T[P], EventGroupByOutputType[P]>
        }
      >
    >


  export type EventSelect = {
    id?: boolean
    name?: boolean
    description?: boolean
    published?: boolean
    prices?: boolean
    media?: boolean
    thumbnail?: boolean
    hashtags?: boolean
    maxTickets?: boolean
    location?: boolean
    tickets?: boolean | TicketFindManyArgs
    stripeProductId?: boolean
    snsTopicArn?: boolean
    startTime?: boolean
    endTime?: boolean
    eventNotifications?: boolean | EventNotificationFindManyArgs
    hostId?: boolean
    host?: boolean | HostArgs
    _count?: boolean | EventCountOutputTypeArgs
  }

  export type EventInclude = {
    tickets?: boolean | TicketFindManyArgs
    eventNotifications?: boolean | EventNotificationFindManyArgs
    host?: boolean | HostArgs
    _count?: boolean | EventCountOutputTypeArgs
  }

  export type EventGetPayload<
    S extends boolean | null | undefined | EventArgs,
    U = keyof S
      > = S extends true
        ? Event
    : S extends undefined
    ? never
    : S extends EventArgs | EventFindManyArgs
    ?'include' extends U
    ? Event  & {
    [P in TrueKeys<S['include']>]:
        P extends 'tickets' ? Array < TicketGetPayload<Exclude<S['include'], undefined | null>[P]>>  :
        P extends 'eventNotifications' ? Array < EventNotificationGetPayload<Exclude<S['include'], undefined | null>[P]>>  :
        P extends 'host' ? HostGetPayload<Exclude<S['include'], undefined | null>[P]> :
        P extends '_count' ? EventCountOutputTypeGetPayload<Exclude<S['include'], undefined | null>[P]> :  never
  } 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]:
        P extends 'tickets' ? Array < TicketGetPayload<Exclude<S['select'], undefined | null>[P]>>  :
        P extends 'eventNotifications' ? Array < EventNotificationGetPayload<Exclude<S['select'], undefined | null>[P]>>  :
        P extends 'host' ? HostGetPayload<Exclude<S['select'], undefined | null>[P]> :
        P extends '_count' ? EventCountOutputTypeGetPayload<Exclude<S['select'], undefined | null>[P]> :  P extends keyof Event ? Event[P] : never
  } 
    : Event
  : Event


  type EventCountArgs = Merge<
    Omit<EventFindManyArgs, 'select' | 'include'> & {
      select?: EventCountAggregateInputType | true
    }
  >

  export interface EventDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined> {
    /**
     * Find zero or one Event that matches the filter.
     * @param {EventFindUniqueArgs} args - Arguments to find a Event
     * @example
     * // Get one Event
     * const event = await prisma.event.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends EventFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, EventFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'Event'> extends True ? CheckSelect<T, Prisma__EventClient<Event>, Prisma__EventClient<EventGetPayload<T>>> : CheckSelect<T, Prisma__EventClient<Event | null >, Prisma__EventClient<EventGetPayload<T> | null >>

    /**
     * Find the first Event that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventFindFirstArgs} args - Arguments to find a Event
     * @example
     * // Get one Event
     * const event = await prisma.event.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends EventFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, EventFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'Event'> extends True ? CheckSelect<T, Prisma__EventClient<Event>, Prisma__EventClient<EventGetPayload<T>>> : CheckSelect<T, Prisma__EventClient<Event | null >, Prisma__EventClient<EventGetPayload<T> | null >>

    /**
     * Find zero or more Events that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Events
     * const events = await prisma.event.findMany()
     * 
     * // Get first 10 Events
     * const events = await prisma.event.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const eventWithIdOnly = await prisma.event.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends EventFindManyArgs>(
      args?: SelectSubset<T, EventFindManyArgs>
    ): CheckSelect<T, PrismaPromise<Array<Event>>, PrismaPromise<Array<EventGetPayload<T>>>>

    /**
     * Create a Event.
     * @param {EventCreateArgs} args - Arguments to create a Event.
     * @example
     * // Create one Event
     * const Event = await prisma.event.create({
     *   data: {
     *     // ... data to create a Event
     *   }
     * })
     * 
    **/
    create<T extends EventCreateArgs>(
      args: SelectSubset<T, EventCreateArgs>
    ): CheckSelect<T, Prisma__EventClient<Event>, Prisma__EventClient<EventGetPayload<T>>>

    /**
     * Create many Events.
     *     @param {EventCreateManyArgs} args - Arguments to create many Events.
     *     @example
     *     // Create many Events
     *     const event = await prisma.event.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends EventCreateManyArgs>(
      args?: SelectSubset<T, EventCreateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Delete a Event.
     * @param {EventDeleteArgs} args - Arguments to delete one Event.
     * @example
     * // Delete one Event
     * const Event = await prisma.event.delete({
     *   where: {
     *     // ... filter to delete one Event
     *   }
     * })
     * 
    **/
    delete<T extends EventDeleteArgs>(
      args: SelectSubset<T, EventDeleteArgs>
    ): CheckSelect<T, Prisma__EventClient<Event>, Prisma__EventClient<EventGetPayload<T>>>

    /**
     * Update one Event.
     * @param {EventUpdateArgs} args - Arguments to update one Event.
     * @example
     * // Update one Event
     * const event = await prisma.event.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends EventUpdateArgs>(
      args: SelectSubset<T, EventUpdateArgs>
    ): CheckSelect<T, Prisma__EventClient<Event>, Prisma__EventClient<EventGetPayload<T>>>

    /**
     * Delete zero or more Events.
     * @param {EventDeleteManyArgs} args - Arguments to filter Events to delete.
     * @example
     * // Delete a few Events
     * const { count } = await prisma.event.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends EventDeleteManyArgs>(
      args?: SelectSubset<T, EventDeleteManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Update zero or more Events.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Events
     * const event = await prisma.event.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends EventUpdateManyArgs>(
      args: SelectSubset<T, EventUpdateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Create or update one Event.
     * @param {EventUpsertArgs} args - Arguments to update or create a Event.
     * @example
     * // Update or create a Event
     * const event = await prisma.event.upsert({
     *   create: {
     *     // ... data to create a Event
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Event we want to update
     *   }
     * })
    **/
    upsert<T extends EventUpsertArgs>(
      args: SelectSubset<T, EventUpsertArgs>
    ): CheckSelect<T, Prisma__EventClient<Event>, Prisma__EventClient<EventGetPayload<T>>>

    /**
     * Find one Event that matches the filter or throw
     * `NotFoundError` if no matches were found.
     * @param {EventFindUniqueOrThrowArgs} args - Arguments to find a Event
     * @example
     * // Get one Event
     * const event = await prisma.event.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends EventFindUniqueOrThrowArgs>(
      args?: SelectSubset<T, EventFindUniqueOrThrowArgs>
    ): CheckSelect<T, Prisma__EventClient<Event>, Prisma__EventClient<EventGetPayload<T>>>

    /**
     * Find the first Event that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventFindFirstOrThrowArgs} args - Arguments to find a Event
     * @example
     * // Get one Event
     * const event = await prisma.event.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends EventFindFirstOrThrowArgs>(
      args?: SelectSubset<T, EventFindFirstOrThrowArgs>
    ): CheckSelect<T, Prisma__EventClient<Event>, Prisma__EventClient<EventGetPayload<T>>>

    /**
     * Count the number of Events.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventCountArgs} args - Arguments to filter Events to count.
     * @example
     * // Count the number of Events
     * const count = await prisma.event.count({
     *   where: {
     *     // ... the filter for the Events we want to count
     *   }
     * })
    **/
    count<T extends EventCountArgs>(
      args?: Subset<T, EventCountArgs>,
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EventCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Event.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends EventAggregateArgs>(args: Subset<T, EventAggregateArgs>): PrismaPromise<GetEventAggregateType<T>>

    /**
     * Group by Event.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventGroupByArgs} args - Group by arguments.
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
      T extends EventGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EventGroupByArgs['orderBy'] }
        : { orderBy?: EventGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
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
    >(args: SubsetIntersection<T, EventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEventGroupByPayload<T> : PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for Event.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__EventClient<T> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: runtime.DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';

    tickets<T extends TicketFindManyArgs = {}>(args?: Subset<T, TicketFindManyArgs>): CheckSelect<T, PrismaPromise<Array<Ticket>>, PrismaPromise<Array<TicketGetPayload<T>>>>;

    eventNotifications<T extends EventNotificationFindManyArgs = {}>(args?: Subset<T, EventNotificationFindManyArgs>): CheckSelect<T, PrismaPromise<Array<EventNotification>>, PrismaPromise<Array<EventNotificationGetPayload<T>>>>;

    host<T extends HostArgs = {}>(args?: Subset<T, HostArgs>): CheckSelect<T, Prisma__HostClient<Host | null >, Prisma__HostClient<HostGetPayload<T> | null >>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * Event base type for findUnique actions
   */
  export type EventFindUniqueArgsBase = {
    /**
     * Select specific fields to fetch from the Event
     * 
    **/
    select?: EventSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: EventInclude | null
    /**
     * Filter, which Event to fetch.
     * 
    **/
    where: EventWhereUniqueInput
  }

  /**
   * Event: findUnique
   */
  export interface EventFindUniqueArgs extends EventFindUniqueArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Event base type for findFirst actions
   */
  export type EventFindFirstArgsBase = {
    /**
     * Select specific fields to fetch from the Event
     * 
    **/
    select?: EventSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: EventInclude | null
    /**
     * Filter, which Event to fetch.
     * 
    **/
    where?: EventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Events to fetch.
     * 
    **/
    orderBy?: Enumerable<EventOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Events.
     * 
    **/
    cursor?: EventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Events from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Events.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Events.
     * 
    **/
    distinct?: Enumerable<EventScalarFieldEnum>
  }

  /**
   * Event: findFirst
   */
  export interface EventFindFirstArgs extends EventFindFirstArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Event findMany
   */
  export type EventFindManyArgs = {
    /**
     * Select specific fields to fetch from the Event
     * 
    **/
    select?: EventSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: EventInclude | null
    /**
     * Filter, which Events to fetch.
     * 
    **/
    where?: EventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Events to fetch.
     * 
    **/
    orderBy?: Enumerable<EventOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Events.
     * 
    **/
    cursor?: EventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Events from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Events.
     * 
    **/
    skip?: number
    distinct?: Enumerable<EventScalarFieldEnum>
  }


  /**
   * Event create
   */
  export type EventCreateArgs = {
    /**
     * Select specific fields to fetch from the Event
     * 
    **/
    select?: EventSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: EventInclude | null
    /**
     * The data needed to create a Event.
     * 
    **/
    data: XOR<EventCreateInput, EventUncheckedCreateInput>
  }


  /**
   * Event createMany
   */
  export type EventCreateManyArgs = {
    /**
     * The data used to create many Events.
     * 
    **/
    data: Enumerable<EventCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * Event update
   */
  export type EventUpdateArgs = {
    /**
     * Select specific fields to fetch from the Event
     * 
    **/
    select?: EventSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: EventInclude | null
    /**
     * The data needed to update a Event.
     * 
    **/
    data: XOR<EventUpdateInput, EventUncheckedUpdateInput>
    /**
     * Choose, which Event to update.
     * 
    **/
    where: EventWhereUniqueInput
  }


  /**
   * Event updateMany
   */
  export type EventUpdateManyArgs = {
    /**
     * The data used to update Events.
     * 
    **/
    data: XOR<EventUpdateManyMutationInput, EventUncheckedUpdateManyInput>
    /**
     * Filter which Events to update
     * 
    **/
    where?: EventWhereInput
  }


  /**
   * Event upsert
   */
  export type EventUpsertArgs = {
    /**
     * Select specific fields to fetch from the Event
     * 
    **/
    select?: EventSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: EventInclude | null
    /**
     * The filter to search for the Event to update in case it exists.
     * 
    **/
    where: EventWhereUniqueInput
    /**
     * In case the Event found by the `where` argument doesn't exist, create a new Event with this data.
     * 
    **/
    create: XOR<EventCreateInput, EventUncheckedCreateInput>
    /**
     * In case the Event was found with the provided `where` argument, update it with this data.
     * 
    **/
    update: XOR<EventUpdateInput, EventUncheckedUpdateInput>
  }


  /**
   * Event delete
   */
  export type EventDeleteArgs = {
    /**
     * Select specific fields to fetch from the Event
     * 
    **/
    select?: EventSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: EventInclude | null
    /**
     * Filter which Event to delete.
     * 
    **/
    where: EventWhereUniqueInput
  }


  /**
   * Event deleteMany
   */
  export type EventDeleteManyArgs = {
    /**
     * Filter which Events to delete
     * 
    **/
    where?: EventWhereInput
  }


  /**
   * Event: findUniqueOrThrow
   */
  export type EventFindUniqueOrThrowArgs = EventFindUniqueArgsBase
      

  /**
   * Event: findFirstOrThrow
   */
  export type EventFindFirstOrThrowArgs = EventFindFirstArgsBase
      

  /**
   * Event without action
   */
  export type EventArgs = {
    /**
     * Select specific fields to fetch from the Event
     * 
    **/
    select?: EventSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: EventInclude | null
  }



  /**
   * Model EventNotification
   */


  export type AggregateEventNotification = {
    _count: EventNotificationCountAggregateOutputType | null
    _avg: EventNotificationAvgAggregateOutputType | null
    _sum: EventNotificationSumAggregateOutputType | null
    _min: EventNotificationMinAggregateOutputType | null
    _max: EventNotificationMaxAggregateOutputType | null
  }

  export type EventNotificationAvgAggregateOutputType = {
    id: number | null
    eventId: number | null
  }

  export type EventNotificationSumAggregateOutputType = {
    id: number | null
    eventId: number | null
  }

  export type EventNotificationMinAggregateOutputType = {
    id: number | null
    messageTime: Date | null
    message: string | null
    eventId: number | null
    sent: boolean | null
  }

  export type EventNotificationMaxAggregateOutputType = {
    id: number | null
    messageTime: Date | null
    message: string | null
    eventId: number | null
    sent: boolean | null
  }

  export type EventNotificationCountAggregateOutputType = {
    id: number
    messageTime: number
    message: number
    eventId: number
    sent: number
    _all: number
  }


  export type EventNotificationAvgAggregateInputType = {
    id?: true
    eventId?: true
  }

  export type EventNotificationSumAggregateInputType = {
    id?: true
    eventId?: true
  }

  export type EventNotificationMinAggregateInputType = {
    id?: true
    messageTime?: true
    message?: true
    eventId?: true
    sent?: true
  }

  export type EventNotificationMaxAggregateInputType = {
    id?: true
    messageTime?: true
    message?: true
    eventId?: true
    sent?: true
  }

  export type EventNotificationCountAggregateInputType = {
    id?: true
    messageTime?: true
    message?: true
    eventId?: true
    sent?: true
    _all?: true
  }

  export type EventNotificationAggregateArgs = {
    /**
     * Filter which EventNotification to aggregate.
     * 
    **/
    where?: EventNotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EventNotifications to fetch.
     * 
    **/
    orderBy?: Enumerable<EventNotificationOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     * 
    **/
    cursor?: EventNotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EventNotifications from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EventNotifications.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned EventNotifications
    **/
    _count?: true | EventNotificationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: EventNotificationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: EventNotificationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EventNotificationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EventNotificationMaxAggregateInputType
  }

  export type GetEventNotificationAggregateType<T extends EventNotificationAggregateArgs> = {
        [P in keyof T & keyof AggregateEventNotification]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEventNotification[P]>
      : GetScalarType<T[P], AggregateEventNotification[P]>
  }




  export type EventNotificationGroupByArgs = {
    where?: EventNotificationWhereInput
    orderBy?: Enumerable<EventNotificationOrderByWithAggregationInput>
    by: Array<EventNotificationScalarFieldEnum>
    having?: EventNotificationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EventNotificationCountAggregateInputType | true
    _avg?: EventNotificationAvgAggregateInputType
    _sum?: EventNotificationSumAggregateInputType
    _min?: EventNotificationMinAggregateInputType
    _max?: EventNotificationMaxAggregateInputType
  }


  export type EventNotificationGroupByOutputType = {
    id: number
    messageTime: Date
    message: string
    eventId: number
    sent: boolean
    _count: EventNotificationCountAggregateOutputType | null
    _avg: EventNotificationAvgAggregateOutputType | null
    _sum: EventNotificationSumAggregateOutputType | null
    _min: EventNotificationMinAggregateOutputType | null
    _max: EventNotificationMaxAggregateOutputType | null
  }

  type GetEventNotificationGroupByPayload<T extends EventNotificationGroupByArgs> = PrismaPromise<
    Array<
      PickArray<EventNotificationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EventNotificationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EventNotificationGroupByOutputType[P]>
            : GetScalarType<T[P], EventNotificationGroupByOutputType[P]>
        }
      >
    >


  export type EventNotificationSelect = {
    id?: boolean
    messageTime?: boolean
    message?: boolean
    eventId?: boolean
    event?: boolean | EventArgs
    sent?: boolean
  }

  export type EventNotificationInclude = {
    event?: boolean | EventArgs
  }

  export type EventNotificationGetPayload<
    S extends boolean | null | undefined | EventNotificationArgs,
    U = keyof S
      > = S extends true
        ? EventNotification
    : S extends undefined
    ? never
    : S extends EventNotificationArgs | EventNotificationFindManyArgs
    ?'include' extends U
    ? EventNotification  & {
    [P in TrueKeys<S['include']>]:
        P extends 'event' ? EventGetPayload<Exclude<S['include'], undefined | null>[P]> :  never
  } 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]:
        P extends 'event' ? EventGetPayload<Exclude<S['select'], undefined | null>[P]> :  P extends keyof EventNotification ? EventNotification[P] : never
  } 
    : EventNotification
  : EventNotification


  type EventNotificationCountArgs = Merge<
    Omit<EventNotificationFindManyArgs, 'select' | 'include'> & {
      select?: EventNotificationCountAggregateInputType | true
    }
  >

  export interface EventNotificationDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined> {
    /**
     * Find zero or one EventNotification that matches the filter.
     * @param {EventNotificationFindUniqueArgs} args - Arguments to find a EventNotification
     * @example
     * // Get one EventNotification
     * const eventNotification = await prisma.eventNotification.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends EventNotificationFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, EventNotificationFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'EventNotification'> extends True ? CheckSelect<T, Prisma__EventNotificationClient<EventNotification>, Prisma__EventNotificationClient<EventNotificationGetPayload<T>>> : CheckSelect<T, Prisma__EventNotificationClient<EventNotification | null >, Prisma__EventNotificationClient<EventNotificationGetPayload<T> | null >>

    /**
     * Find the first EventNotification that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventNotificationFindFirstArgs} args - Arguments to find a EventNotification
     * @example
     * // Get one EventNotification
     * const eventNotification = await prisma.eventNotification.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends EventNotificationFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, EventNotificationFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'EventNotification'> extends True ? CheckSelect<T, Prisma__EventNotificationClient<EventNotification>, Prisma__EventNotificationClient<EventNotificationGetPayload<T>>> : CheckSelect<T, Prisma__EventNotificationClient<EventNotification | null >, Prisma__EventNotificationClient<EventNotificationGetPayload<T> | null >>

    /**
     * Find zero or more EventNotifications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventNotificationFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all EventNotifications
     * const eventNotifications = await prisma.eventNotification.findMany()
     * 
     * // Get first 10 EventNotifications
     * const eventNotifications = await prisma.eventNotification.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const eventNotificationWithIdOnly = await prisma.eventNotification.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends EventNotificationFindManyArgs>(
      args?: SelectSubset<T, EventNotificationFindManyArgs>
    ): CheckSelect<T, PrismaPromise<Array<EventNotification>>, PrismaPromise<Array<EventNotificationGetPayload<T>>>>

    /**
     * Create a EventNotification.
     * @param {EventNotificationCreateArgs} args - Arguments to create a EventNotification.
     * @example
     * // Create one EventNotification
     * const EventNotification = await prisma.eventNotification.create({
     *   data: {
     *     // ... data to create a EventNotification
     *   }
     * })
     * 
    **/
    create<T extends EventNotificationCreateArgs>(
      args: SelectSubset<T, EventNotificationCreateArgs>
    ): CheckSelect<T, Prisma__EventNotificationClient<EventNotification>, Prisma__EventNotificationClient<EventNotificationGetPayload<T>>>

    /**
     * Create many EventNotifications.
     *     @param {EventNotificationCreateManyArgs} args - Arguments to create many EventNotifications.
     *     @example
     *     // Create many EventNotifications
     *     const eventNotification = await prisma.eventNotification.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends EventNotificationCreateManyArgs>(
      args?: SelectSubset<T, EventNotificationCreateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Delete a EventNotification.
     * @param {EventNotificationDeleteArgs} args - Arguments to delete one EventNotification.
     * @example
     * // Delete one EventNotification
     * const EventNotification = await prisma.eventNotification.delete({
     *   where: {
     *     // ... filter to delete one EventNotification
     *   }
     * })
     * 
    **/
    delete<T extends EventNotificationDeleteArgs>(
      args: SelectSubset<T, EventNotificationDeleteArgs>
    ): CheckSelect<T, Prisma__EventNotificationClient<EventNotification>, Prisma__EventNotificationClient<EventNotificationGetPayload<T>>>

    /**
     * Update one EventNotification.
     * @param {EventNotificationUpdateArgs} args - Arguments to update one EventNotification.
     * @example
     * // Update one EventNotification
     * const eventNotification = await prisma.eventNotification.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends EventNotificationUpdateArgs>(
      args: SelectSubset<T, EventNotificationUpdateArgs>
    ): CheckSelect<T, Prisma__EventNotificationClient<EventNotification>, Prisma__EventNotificationClient<EventNotificationGetPayload<T>>>

    /**
     * Delete zero or more EventNotifications.
     * @param {EventNotificationDeleteManyArgs} args - Arguments to filter EventNotifications to delete.
     * @example
     * // Delete a few EventNotifications
     * const { count } = await prisma.eventNotification.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends EventNotificationDeleteManyArgs>(
      args?: SelectSubset<T, EventNotificationDeleteManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Update zero or more EventNotifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventNotificationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many EventNotifications
     * const eventNotification = await prisma.eventNotification.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends EventNotificationUpdateManyArgs>(
      args: SelectSubset<T, EventNotificationUpdateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Create or update one EventNotification.
     * @param {EventNotificationUpsertArgs} args - Arguments to update or create a EventNotification.
     * @example
     * // Update or create a EventNotification
     * const eventNotification = await prisma.eventNotification.upsert({
     *   create: {
     *     // ... data to create a EventNotification
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the EventNotification we want to update
     *   }
     * })
    **/
    upsert<T extends EventNotificationUpsertArgs>(
      args: SelectSubset<T, EventNotificationUpsertArgs>
    ): CheckSelect<T, Prisma__EventNotificationClient<EventNotification>, Prisma__EventNotificationClient<EventNotificationGetPayload<T>>>

    /**
     * Find one EventNotification that matches the filter or throw
     * `NotFoundError` if no matches were found.
     * @param {EventNotificationFindUniqueOrThrowArgs} args - Arguments to find a EventNotification
     * @example
     * // Get one EventNotification
     * const eventNotification = await prisma.eventNotification.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends EventNotificationFindUniqueOrThrowArgs>(
      args?: SelectSubset<T, EventNotificationFindUniqueOrThrowArgs>
    ): CheckSelect<T, Prisma__EventNotificationClient<EventNotification>, Prisma__EventNotificationClient<EventNotificationGetPayload<T>>>

    /**
     * Find the first EventNotification that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventNotificationFindFirstOrThrowArgs} args - Arguments to find a EventNotification
     * @example
     * // Get one EventNotification
     * const eventNotification = await prisma.eventNotification.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends EventNotificationFindFirstOrThrowArgs>(
      args?: SelectSubset<T, EventNotificationFindFirstOrThrowArgs>
    ): CheckSelect<T, Prisma__EventNotificationClient<EventNotification>, Prisma__EventNotificationClient<EventNotificationGetPayload<T>>>

    /**
     * Count the number of EventNotifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventNotificationCountArgs} args - Arguments to filter EventNotifications to count.
     * @example
     * // Count the number of EventNotifications
     * const count = await prisma.eventNotification.count({
     *   where: {
     *     // ... the filter for the EventNotifications we want to count
     *   }
     * })
    **/
    count<T extends EventNotificationCountArgs>(
      args?: Subset<T, EventNotificationCountArgs>,
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EventNotificationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a EventNotification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventNotificationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends EventNotificationAggregateArgs>(args: Subset<T, EventNotificationAggregateArgs>): PrismaPromise<GetEventNotificationAggregateType<T>>

    /**
     * Group by EventNotification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventNotificationGroupByArgs} args - Group by arguments.
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
      T extends EventNotificationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EventNotificationGroupByArgs['orderBy'] }
        : { orderBy?: EventNotificationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
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
    >(args: SubsetIntersection<T, EventNotificationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEventNotificationGroupByPayload<T> : PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for EventNotification.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__EventNotificationClient<T> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: runtime.DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';

    event<T extends EventArgs = {}>(args?: Subset<T, EventArgs>): CheckSelect<T, Prisma__EventClient<Event | null >, Prisma__EventClient<EventGetPayload<T> | null >>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * EventNotification base type for findUnique actions
   */
  export type EventNotificationFindUniqueArgsBase = {
    /**
     * Select specific fields to fetch from the EventNotification
     * 
    **/
    select?: EventNotificationSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: EventNotificationInclude | null
    /**
     * Filter, which EventNotification to fetch.
     * 
    **/
    where: EventNotificationWhereUniqueInput
  }

  /**
   * EventNotification: findUnique
   */
  export interface EventNotificationFindUniqueArgs extends EventNotificationFindUniqueArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * EventNotification base type for findFirst actions
   */
  export type EventNotificationFindFirstArgsBase = {
    /**
     * Select specific fields to fetch from the EventNotification
     * 
    **/
    select?: EventNotificationSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: EventNotificationInclude | null
    /**
     * Filter, which EventNotification to fetch.
     * 
    **/
    where?: EventNotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EventNotifications to fetch.
     * 
    **/
    orderBy?: Enumerable<EventNotificationOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EventNotifications.
     * 
    **/
    cursor?: EventNotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EventNotifications from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EventNotifications.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EventNotifications.
     * 
    **/
    distinct?: Enumerable<EventNotificationScalarFieldEnum>
  }

  /**
   * EventNotification: findFirst
   */
  export interface EventNotificationFindFirstArgs extends EventNotificationFindFirstArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * EventNotification findMany
   */
  export type EventNotificationFindManyArgs = {
    /**
     * Select specific fields to fetch from the EventNotification
     * 
    **/
    select?: EventNotificationSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: EventNotificationInclude | null
    /**
     * Filter, which EventNotifications to fetch.
     * 
    **/
    where?: EventNotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EventNotifications to fetch.
     * 
    **/
    orderBy?: Enumerable<EventNotificationOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing EventNotifications.
     * 
    **/
    cursor?: EventNotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EventNotifications from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EventNotifications.
     * 
    **/
    skip?: number
    distinct?: Enumerable<EventNotificationScalarFieldEnum>
  }


  /**
   * EventNotification create
   */
  export type EventNotificationCreateArgs = {
    /**
     * Select specific fields to fetch from the EventNotification
     * 
    **/
    select?: EventNotificationSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: EventNotificationInclude | null
    /**
     * The data needed to create a EventNotification.
     * 
    **/
    data: XOR<EventNotificationCreateInput, EventNotificationUncheckedCreateInput>
  }


  /**
   * EventNotification createMany
   */
  export type EventNotificationCreateManyArgs = {
    /**
     * The data used to create many EventNotifications.
     * 
    **/
    data: Enumerable<EventNotificationCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * EventNotification update
   */
  export type EventNotificationUpdateArgs = {
    /**
     * Select specific fields to fetch from the EventNotification
     * 
    **/
    select?: EventNotificationSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: EventNotificationInclude | null
    /**
     * The data needed to update a EventNotification.
     * 
    **/
    data: XOR<EventNotificationUpdateInput, EventNotificationUncheckedUpdateInput>
    /**
     * Choose, which EventNotification to update.
     * 
    **/
    where: EventNotificationWhereUniqueInput
  }


  /**
   * EventNotification updateMany
   */
  export type EventNotificationUpdateManyArgs = {
    /**
     * The data used to update EventNotifications.
     * 
    **/
    data: XOR<EventNotificationUpdateManyMutationInput, EventNotificationUncheckedUpdateManyInput>
    /**
     * Filter which EventNotifications to update
     * 
    **/
    where?: EventNotificationWhereInput
  }


  /**
   * EventNotification upsert
   */
  export type EventNotificationUpsertArgs = {
    /**
     * Select specific fields to fetch from the EventNotification
     * 
    **/
    select?: EventNotificationSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: EventNotificationInclude | null
    /**
     * The filter to search for the EventNotification to update in case it exists.
     * 
    **/
    where: EventNotificationWhereUniqueInput
    /**
     * In case the EventNotification found by the `where` argument doesn't exist, create a new EventNotification with this data.
     * 
    **/
    create: XOR<EventNotificationCreateInput, EventNotificationUncheckedCreateInput>
    /**
     * In case the EventNotification was found with the provided `where` argument, update it with this data.
     * 
    **/
    update: XOR<EventNotificationUpdateInput, EventNotificationUncheckedUpdateInput>
  }


  /**
   * EventNotification delete
   */
  export type EventNotificationDeleteArgs = {
    /**
     * Select specific fields to fetch from the EventNotification
     * 
    **/
    select?: EventNotificationSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: EventNotificationInclude | null
    /**
     * Filter which EventNotification to delete.
     * 
    **/
    where: EventNotificationWhereUniqueInput
  }


  /**
   * EventNotification deleteMany
   */
  export type EventNotificationDeleteManyArgs = {
    /**
     * Filter which EventNotifications to delete
     * 
    **/
    where?: EventNotificationWhereInput
  }


  /**
   * EventNotification: findUniqueOrThrow
   */
  export type EventNotificationFindUniqueOrThrowArgs = EventNotificationFindUniqueArgsBase
      

  /**
   * EventNotification: findFirstOrThrow
   */
  export type EventNotificationFindFirstOrThrowArgs = EventNotificationFindFirstArgsBase
      

  /**
   * EventNotification without action
   */
  export type EventNotificationArgs = {
    /**
     * Select specific fields to fetch from the EventNotification
     * 
    **/
    select?: EventNotificationSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: EventNotificationInclude | null
  }



  /**
   * Model User
   */


  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    name: string | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    name: string | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    name: number
    roles: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    name?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    name?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    name?: true
    roles?: true
    _all?: true
  }

  export type UserAggregateArgs = {
    /**
     * Filter which User to aggregate.
     * 
    **/
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     * 
    **/
    orderBy?: Enumerable<UserOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     * 
    **/
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs = {
    where?: UserWhereInput
    orderBy?: Enumerable<UserOrderByWithAggregationInput>
    by: Array<UserScalarFieldEnum>
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }


  export type UserGroupByOutputType = {
    id: string
    email: string
    name: string | null
    roles: string[]
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = PrismaPromise<
    Array<
      PickArray<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect = {
    id?: boolean
    email?: boolean
    name?: boolean
    roles?: boolean
    hostRoles?: boolean | HostRoleFindManyArgs
    tickets?: boolean | TicketFindManyArgs
    hosts?: boolean | HostFindManyArgs
    _count?: boolean | UserCountOutputTypeArgs
  }

  export type UserInclude = {
    hostRoles?: boolean | HostRoleFindManyArgs
    tickets?: boolean | TicketFindManyArgs
    hosts?: boolean | HostFindManyArgs
    _count?: boolean | UserCountOutputTypeArgs
  }

  export type UserGetPayload<
    S extends boolean | null | undefined | UserArgs,
    U = keyof S
      > = S extends true
        ? User
    : S extends undefined
    ? never
    : S extends UserArgs | UserFindManyArgs
    ?'include' extends U
    ? User  & {
    [P in TrueKeys<S['include']>]:
        P extends 'hostRoles' ? Array < HostRoleGetPayload<Exclude<S['include'], undefined | null>[P]>>  :
        P extends 'tickets' ? Array < TicketGetPayload<Exclude<S['include'], undefined | null>[P]>>  :
        P extends 'hosts' ? Array < HostGetPayload<Exclude<S['include'], undefined | null>[P]>>  :
        P extends '_count' ? UserCountOutputTypeGetPayload<Exclude<S['include'], undefined | null>[P]> :  never
  } 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]:
        P extends 'hostRoles' ? Array < HostRoleGetPayload<Exclude<S['select'], undefined | null>[P]>>  :
        P extends 'tickets' ? Array < TicketGetPayload<Exclude<S['select'], undefined | null>[P]>>  :
        P extends 'hosts' ? Array < HostGetPayload<Exclude<S['select'], undefined | null>[P]>>  :
        P extends '_count' ? UserCountOutputTypeGetPayload<Exclude<S['select'], undefined | null>[P]> :  P extends keyof User ? User[P] : never
  } 
    : User
  : User


  type UserCountArgs = Merge<
    Omit<UserFindManyArgs, 'select' | 'include'> & {
      select?: UserCountAggregateInputType | true
    }
  >

  export interface UserDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined> {
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends UserFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, UserFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'User'> extends True ? CheckSelect<T, Prisma__UserClient<User>, Prisma__UserClient<UserGetPayload<T>>> : CheckSelect<T, Prisma__UserClient<User | null >, Prisma__UserClient<UserGetPayload<T> | null >>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends UserFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, UserFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'User'> extends True ? CheckSelect<T, Prisma__UserClient<User>, Prisma__UserClient<UserGetPayload<T>>> : CheckSelect<T, Prisma__UserClient<User | null >, Prisma__UserClient<UserGetPayload<T> | null >>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends UserFindManyArgs>(
      args?: SelectSubset<T, UserFindManyArgs>
    ): CheckSelect<T, PrismaPromise<Array<User>>, PrismaPromise<Array<UserGetPayload<T>>>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
    **/
    create<T extends UserCreateArgs>(
      args: SelectSubset<T, UserCreateArgs>
    ): CheckSelect<T, Prisma__UserClient<User>, Prisma__UserClient<UserGetPayload<T>>>

    /**
     * Create many Users.
     *     @param {UserCreateManyArgs} args - Arguments to create many Users.
     *     @example
     *     // Create many Users
     *     const user = await prisma.user.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends UserCreateManyArgs>(
      args?: SelectSubset<T, UserCreateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
    **/
    delete<T extends UserDeleteArgs>(
      args: SelectSubset<T, UserDeleteArgs>
    ): CheckSelect<T, Prisma__UserClient<User>, Prisma__UserClient<UserGetPayload<T>>>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends UserUpdateArgs>(
      args: SelectSubset<T, UserUpdateArgs>
    ): CheckSelect<T, Prisma__UserClient<User>, Prisma__UserClient<UserGetPayload<T>>>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends UserDeleteManyArgs>(
      args?: SelectSubset<T, UserDeleteManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends UserUpdateManyArgs>(
      args: SelectSubset<T, UserUpdateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
    **/
    upsert<T extends UserUpsertArgs>(
      args: SelectSubset<T, UserUpsertArgs>
    ): CheckSelect<T, Prisma__UserClient<User>, Prisma__UserClient<UserGetPayload<T>>>

    /**
     * Find one User that matches the filter or throw
     * `NotFoundError` if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(
      args?: SelectSubset<T, UserFindUniqueOrThrowArgs>
    ): CheckSelect<T, Prisma__UserClient<User>, Prisma__UserClient<UserGetPayload<T>>>

    /**
     * Find the first User that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(
      args?: SelectSubset<T, UserFindFirstOrThrowArgs>
    ): CheckSelect<T, Prisma__UserClient<User>, Prisma__UserClient<UserGetPayload<T>>>

    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
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
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
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
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__UserClient<T> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: runtime.DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';

    hostRoles<T extends HostRoleFindManyArgs = {}>(args?: Subset<T, HostRoleFindManyArgs>): CheckSelect<T, PrismaPromise<Array<HostRole>>, PrismaPromise<Array<HostRoleGetPayload<T>>>>;

    tickets<T extends TicketFindManyArgs = {}>(args?: Subset<T, TicketFindManyArgs>): CheckSelect<T, PrismaPromise<Array<Ticket>>, PrismaPromise<Array<TicketGetPayload<T>>>>;

    hosts<T extends HostFindManyArgs = {}>(args?: Subset<T, HostFindManyArgs>): CheckSelect<T, PrismaPromise<Array<Host>>, PrismaPromise<Array<HostGetPayload<T>>>>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * User base type for findUnique actions
   */
  export type UserFindUniqueArgsBase = {
    /**
     * Select specific fields to fetch from the User
     * 
    **/
    select?: UserSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: UserInclude | null
    /**
     * Filter, which User to fetch.
     * 
    **/
    where: UserWhereUniqueInput
  }

  /**
   * User: findUnique
   */
  export interface UserFindUniqueArgs extends UserFindUniqueArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * User base type for findFirst actions
   */
  export type UserFindFirstArgsBase = {
    /**
     * Select specific fields to fetch from the User
     * 
    **/
    select?: UserSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: UserInclude | null
    /**
     * Filter, which User to fetch.
     * 
    **/
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     * 
    **/
    orderBy?: Enumerable<UserOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     * 
    **/
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     * 
    **/
    distinct?: Enumerable<UserScalarFieldEnum>
  }

  /**
   * User: findFirst
   */
  export interface UserFindFirstArgs extends UserFindFirstArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * User findMany
   */
  export type UserFindManyArgs = {
    /**
     * Select specific fields to fetch from the User
     * 
    **/
    select?: UserSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: UserInclude | null
    /**
     * Filter, which Users to fetch.
     * 
    **/
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     * 
    **/
    orderBy?: Enumerable<UserOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     * 
    **/
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     * 
    **/
    skip?: number
    distinct?: Enumerable<UserScalarFieldEnum>
  }


  /**
   * User create
   */
  export type UserCreateArgs = {
    /**
     * Select specific fields to fetch from the User
     * 
    **/
    select?: UserSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: UserInclude | null
    /**
     * The data needed to create a User.
     * 
    **/
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }


  /**
   * User createMany
   */
  export type UserCreateManyArgs = {
    /**
     * The data used to create many Users.
     * 
    **/
    data: Enumerable<UserCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * User update
   */
  export type UserUpdateArgs = {
    /**
     * Select specific fields to fetch from the User
     * 
    **/
    select?: UserSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: UserInclude | null
    /**
     * The data needed to update a User.
     * 
    **/
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     * 
    **/
    where: UserWhereUniqueInput
  }


  /**
   * User updateMany
   */
  export type UserUpdateManyArgs = {
    /**
     * The data used to update Users.
     * 
    **/
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     * 
    **/
    where?: UserWhereInput
  }


  /**
   * User upsert
   */
  export type UserUpsertArgs = {
    /**
     * Select specific fields to fetch from the User
     * 
    **/
    select?: UserSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: UserInclude | null
    /**
     * The filter to search for the User to update in case it exists.
     * 
    **/
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     * 
    **/
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     * 
    **/
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }


  /**
   * User delete
   */
  export type UserDeleteArgs = {
    /**
     * Select specific fields to fetch from the User
     * 
    **/
    select?: UserSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: UserInclude | null
    /**
     * Filter which User to delete.
     * 
    **/
    where: UserWhereUniqueInput
  }


  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs = {
    /**
     * Filter which Users to delete
     * 
    **/
    where?: UserWhereInput
  }


  /**
   * User: findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs = UserFindUniqueArgsBase
      

  /**
   * User: findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs = UserFindFirstArgsBase
      

  /**
   * User without action
   */
  export type UserArgs = {
    /**
     * Select specific fields to fetch from the User
     * 
    **/
    select?: UserSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: UserInclude | null
  }



  /**
   * Model Host
   */


  export type AggregateHost = {
    _count: HostCountAggregateOutputType | null
    _avg: HostAvgAggregateOutputType | null
    _sum: HostSumAggregateOutputType | null
    _min: HostMinAggregateOutputType | null
    _max: HostMaxAggregateOutputType | null
  }

  export type HostAvgAggregateOutputType = {
    id: number | null
  }

  export type HostSumAggregateOutputType = {
    id: number | null
  }

  export type HostMinAggregateOutputType = {
    id: number | null
    name: string | null
    description: string | null
    createdBy: string | null
    imageUrl: string | null
  }

  export type HostMaxAggregateOutputType = {
    id: number | null
    name: string | null
    description: string | null
    createdBy: string | null
    imageUrl: string | null
  }

  export type HostCountAggregateOutputType = {
    id: number
    name: number
    description: number
    createdBy: number
    imageUrl: number
    _all: number
  }


  export type HostAvgAggregateInputType = {
    id?: true
  }

  export type HostSumAggregateInputType = {
    id?: true
  }

  export type HostMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    createdBy?: true
    imageUrl?: true
  }

  export type HostMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    createdBy?: true
    imageUrl?: true
  }

  export type HostCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    createdBy?: true
    imageUrl?: true
    _all?: true
  }

  export type HostAggregateArgs = {
    /**
     * Filter which Host to aggregate.
     * 
    **/
    where?: HostWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Hosts to fetch.
     * 
    **/
    orderBy?: Enumerable<HostOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     * 
    **/
    cursor?: HostWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Hosts from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Hosts.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Hosts
    **/
    _count?: true | HostCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: HostAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: HostSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: HostMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: HostMaxAggregateInputType
  }

  export type GetHostAggregateType<T extends HostAggregateArgs> = {
        [P in keyof T & keyof AggregateHost]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateHost[P]>
      : GetScalarType<T[P], AggregateHost[P]>
  }




  export type HostGroupByArgs = {
    where?: HostWhereInput
    orderBy?: Enumerable<HostOrderByWithAggregationInput>
    by: Array<HostScalarFieldEnum>
    having?: HostScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: HostCountAggregateInputType | true
    _avg?: HostAvgAggregateInputType
    _sum?: HostSumAggregateInputType
    _min?: HostMinAggregateInputType
    _max?: HostMaxAggregateInputType
  }


  export type HostGroupByOutputType = {
    id: number
    name: string
    description: string | null
    createdBy: string
    imageUrl: string | null
    _count: HostCountAggregateOutputType | null
    _avg: HostAvgAggregateOutputType | null
    _sum: HostSumAggregateOutputType | null
    _min: HostMinAggregateOutputType | null
    _max: HostMaxAggregateOutputType | null
  }

  type GetHostGroupByPayload<T extends HostGroupByArgs> = PrismaPromise<
    Array<
      PickArray<HostGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof HostGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], HostGroupByOutputType[P]>
            : GetScalarType<T[P], HostGroupByOutputType[P]>
        }
      >
    >


  export type HostSelect = {
    id?: boolean
    name?: boolean
    description?: boolean
    events?: boolean | EventFindManyArgs
    hostRoles?: boolean | HostRoleFindManyArgs
    createdBy?: boolean
    creator?: boolean | UserArgs
    imageUrl?: boolean
    _count?: boolean | HostCountOutputTypeArgs
  }

  export type HostInclude = {
    events?: boolean | EventFindManyArgs
    hostRoles?: boolean | HostRoleFindManyArgs
    creator?: boolean | UserArgs
    _count?: boolean | HostCountOutputTypeArgs
  }

  export type HostGetPayload<
    S extends boolean | null | undefined | HostArgs,
    U = keyof S
      > = S extends true
        ? Host
    : S extends undefined
    ? never
    : S extends HostArgs | HostFindManyArgs
    ?'include' extends U
    ? Host  & {
    [P in TrueKeys<S['include']>]:
        P extends 'events' ? Array < EventGetPayload<Exclude<S['include'], undefined | null>[P]>>  :
        P extends 'hostRoles' ? Array < HostRoleGetPayload<Exclude<S['include'], undefined | null>[P]>>  :
        P extends 'creator' ? UserGetPayload<Exclude<S['include'], undefined | null>[P]> :
        P extends '_count' ? HostCountOutputTypeGetPayload<Exclude<S['include'], undefined | null>[P]> :  never
  } 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]:
        P extends 'events' ? Array < EventGetPayload<Exclude<S['select'], undefined | null>[P]>>  :
        P extends 'hostRoles' ? Array < HostRoleGetPayload<Exclude<S['select'], undefined | null>[P]>>  :
        P extends 'creator' ? UserGetPayload<Exclude<S['select'], undefined | null>[P]> :
        P extends '_count' ? HostCountOutputTypeGetPayload<Exclude<S['select'], undefined | null>[P]> :  P extends keyof Host ? Host[P] : never
  } 
    : Host
  : Host


  type HostCountArgs = Merge<
    Omit<HostFindManyArgs, 'select' | 'include'> & {
      select?: HostCountAggregateInputType | true
    }
  >

  export interface HostDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined> {
    /**
     * Find zero or one Host that matches the filter.
     * @param {HostFindUniqueArgs} args - Arguments to find a Host
     * @example
     * // Get one Host
     * const host = await prisma.host.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends HostFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, HostFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'Host'> extends True ? CheckSelect<T, Prisma__HostClient<Host>, Prisma__HostClient<HostGetPayload<T>>> : CheckSelect<T, Prisma__HostClient<Host | null >, Prisma__HostClient<HostGetPayload<T> | null >>

    /**
     * Find the first Host that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HostFindFirstArgs} args - Arguments to find a Host
     * @example
     * // Get one Host
     * const host = await prisma.host.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends HostFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, HostFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'Host'> extends True ? CheckSelect<T, Prisma__HostClient<Host>, Prisma__HostClient<HostGetPayload<T>>> : CheckSelect<T, Prisma__HostClient<Host | null >, Prisma__HostClient<HostGetPayload<T> | null >>

    /**
     * Find zero or more Hosts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HostFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Hosts
     * const hosts = await prisma.host.findMany()
     * 
     * // Get first 10 Hosts
     * const hosts = await prisma.host.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const hostWithIdOnly = await prisma.host.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends HostFindManyArgs>(
      args?: SelectSubset<T, HostFindManyArgs>
    ): CheckSelect<T, PrismaPromise<Array<Host>>, PrismaPromise<Array<HostGetPayload<T>>>>

    /**
     * Create a Host.
     * @param {HostCreateArgs} args - Arguments to create a Host.
     * @example
     * // Create one Host
     * const Host = await prisma.host.create({
     *   data: {
     *     // ... data to create a Host
     *   }
     * })
     * 
    **/
    create<T extends HostCreateArgs>(
      args: SelectSubset<T, HostCreateArgs>
    ): CheckSelect<T, Prisma__HostClient<Host>, Prisma__HostClient<HostGetPayload<T>>>

    /**
     * Create many Hosts.
     *     @param {HostCreateManyArgs} args - Arguments to create many Hosts.
     *     @example
     *     // Create many Hosts
     *     const host = await prisma.host.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends HostCreateManyArgs>(
      args?: SelectSubset<T, HostCreateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Delete a Host.
     * @param {HostDeleteArgs} args - Arguments to delete one Host.
     * @example
     * // Delete one Host
     * const Host = await prisma.host.delete({
     *   where: {
     *     // ... filter to delete one Host
     *   }
     * })
     * 
    **/
    delete<T extends HostDeleteArgs>(
      args: SelectSubset<T, HostDeleteArgs>
    ): CheckSelect<T, Prisma__HostClient<Host>, Prisma__HostClient<HostGetPayload<T>>>

    /**
     * Update one Host.
     * @param {HostUpdateArgs} args - Arguments to update one Host.
     * @example
     * // Update one Host
     * const host = await prisma.host.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends HostUpdateArgs>(
      args: SelectSubset<T, HostUpdateArgs>
    ): CheckSelect<T, Prisma__HostClient<Host>, Prisma__HostClient<HostGetPayload<T>>>

    /**
     * Delete zero or more Hosts.
     * @param {HostDeleteManyArgs} args - Arguments to filter Hosts to delete.
     * @example
     * // Delete a few Hosts
     * const { count } = await prisma.host.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends HostDeleteManyArgs>(
      args?: SelectSubset<T, HostDeleteManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Update zero or more Hosts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HostUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Hosts
     * const host = await prisma.host.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends HostUpdateManyArgs>(
      args: SelectSubset<T, HostUpdateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Create or update one Host.
     * @param {HostUpsertArgs} args - Arguments to update or create a Host.
     * @example
     * // Update or create a Host
     * const host = await prisma.host.upsert({
     *   create: {
     *     // ... data to create a Host
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Host we want to update
     *   }
     * })
    **/
    upsert<T extends HostUpsertArgs>(
      args: SelectSubset<T, HostUpsertArgs>
    ): CheckSelect<T, Prisma__HostClient<Host>, Prisma__HostClient<HostGetPayload<T>>>

    /**
     * Find one Host that matches the filter or throw
     * `NotFoundError` if no matches were found.
     * @param {HostFindUniqueOrThrowArgs} args - Arguments to find a Host
     * @example
     * // Get one Host
     * const host = await prisma.host.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends HostFindUniqueOrThrowArgs>(
      args?: SelectSubset<T, HostFindUniqueOrThrowArgs>
    ): CheckSelect<T, Prisma__HostClient<Host>, Prisma__HostClient<HostGetPayload<T>>>

    /**
     * Find the first Host that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HostFindFirstOrThrowArgs} args - Arguments to find a Host
     * @example
     * // Get one Host
     * const host = await prisma.host.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends HostFindFirstOrThrowArgs>(
      args?: SelectSubset<T, HostFindFirstOrThrowArgs>
    ): CheckSelect<T, Prisma__HostClient<Host>, Prisma__HostClient<HostGetPayload<T>>>

    /**
     * Count the number of Hosts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HostCountArgs} args - Arguments to filter Hosts to count.
     * @example
     * // Count the number of Hosts
     * const count = await prisma.host.count({
     *   where: {
     *     // ... the filter for the Hosts we want to count
     *   }
     * })
    **/
    count<T extends HostCountArgs>(
      args?: Subset<T, HostCountArgs>,
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], HostCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Host.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HostAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends HostAggregateArgs>(args: Subset<T, HostAggregateArgs>): PrismaPromise<GetHostAggregateType<T>>

    /**
     * Group by Host.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HostGroupByArgs} args - Group by arguments.
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
      T extends HostGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: HostGroupByArgs['orderBy'] }
        : { orderBy?: HostGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
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
    >(args: SubsetIntersection<T, HostGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetHostGroupByPayload<T> : PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for Host.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__HostClient<T> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: runtime.DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';

    events<T extends EventFindManyArgs = {}>(args?: Subset<T, EventFindManyArgs>): CheckSelect<T, PrismaPromise<Array<Event>>, PrismaPromise<Array<EventGetPayload<T>>>>;

    hostRoles<T extends HostRoleFindManyArgs = {}>(args?: Subset<T, HostRoleFindManyArgs>): CheckSelect<T, PrismaPromise<Array<HostRole>>, PrismaPromise<Array<HostRoleGetPayload<T>>>>;

    creator<T extends UserArgs = {}>(args?: Subset<T, UserArgs>): CheckSelect<T, Prisma__UserClient<User | null >, Prisma__UserClient<UserGetPayload<T> | null >>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * Host base type for findUnique actions
   */
  export type HostFindUniqueArgsBase = {
    /**
     * Select specific fields to fetch from the Host
     * 
    **/
    select?: HostSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: HostInclude | null
    /**
     * Filter, which Host to fetch.
     * 
    **/
    where: HostWhereUniqueInput
  }

  /**
   * Host: findUnique
   */
  export interface HostFindUniqueArgs extends HostFindUniqueArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Host base type for findFirst actions
   */
  export type HostFindFirstArgsBase = {
    /**
     * Select specific fields to fetch from the Host
     * 
    **/
    select?: HostSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: HostInclude | null
    /**
     * Filter, which Host to fetch.
     * 
    **/
    where?: HostWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Hosts to fetch.
     * 
    **/
    orderBy?: Enumerable<HostOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Hosts.
     * 
    **/
    cursor?: HostWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Hosts from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Hosts.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Hosts.
     * 
    **/
    distinct?: Enumerable<HostScalarFieldEnum>
  }

  /**
   * Host: findFirst
   */
  export interface HostFindFirstArgs extends HostFindFirstArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Host findMany
   */
  export type HostFindManyArgs = {
    /**
     * Select specific fields to fetch from the Host
     * 
    **/
    select?: HostSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: HostInclude | null
    /**
     * Filter, which Hosts to fetch.
     * 
    **/
    where?: HostWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Hosts to fetch.
     * 
    **/
    orderBy?: Enumerable<HostOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Hosts.
     * 
    **/
    cursor?: HostWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Hosts from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Hosts.
     * 
    **/
    skip?: number
    distinct?: Enumerable<HostScalarFieldEnum>
  }


  /**
   * Host create
   */
  export type HostCreateArgs = {
    /**
     * Select specific fields to fetch from the Host
     * 
    **/
    select?: HostSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: HostInclude | null
    /**
     * The data needed to create a Host.
     * 
    **/
    data: XOR<HostCreateInput, HostUncheckedCreateInput>
  }


  /**
   * Host createMany
   */
  export type HostCreateManyArgs = {
    /**
     * The data used to create many Hosts.
     * 
    **/
    data: Enumerable<HostCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * Host update
   */
  export type HostUpdateArgs = {
    /**
     * Select specific fields to fetch from the Host
     * 
    **/
    select?: HostSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: HostInclude | null
    /**
     * The data needed to update a Host.
     * 
    **/
    data: XOR<HostUpdateInput, HostUncheckedUpdateInput>
    /**
     * Choose, which Host to update.
     * 
    **/
    where: HostWhereUniqueInput
  }


  /**
   * Host updateMany
   */
  export type HostUpdateManyArgs = {
    /**
     * The data used to update Hosts.
     * 
    **/
    data: XOR<HostUpdateManyMutationInput, HostUncheckedUpdateManyInput>
    /**
     * Filter which Hosts to update
     * 
    **/
    where?: HostWhereInput
  }


  /**
   * Host upsert
   */
  export type HostUpsertArgs = {
    /**
     * Select specific fields to fetch from the Host
     * 
    **/
    select?: HostSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: HostInclude | null
    /**
     * The filter to search for the Host to update in case it exists.
     * 
    **/
    where: HostWhereUniqueInput
    /**
     * In case the Host found by the `where` argument doesn't exist, create a new Host with this data.
     * 
    **/
    create: XOR<HostCreateInput, HostUncheckedCreateInput>
    /**
     * In case the Host was found with the provided `where` argument, update it with this data.
     * 
    **/
    update: XOR<HostUpdateInput, HostUncheckedUpdateInput>
  }


  /**
   * Host delete
   */
  export type HostDeleteArgs = {
    /**
     * Select specific fields to fetch from the Host
     * 
    **/
    select?: HostSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: HostInclude | null
    /**
     * Filter which Host to delete.
     * 
    **/
    where: HostWhereUniqueInput
  }


  /**
   * Host deleteMany
   */
  export type HostDeleteManyArgs = {
    /**
     * Filter which Hosts to delete
     * 
    **/
    where?: HostWhereInput
  }


  /**
   * Host: findUniqueOrThrow
   */
  export type HostFindUniqueOrThrowArgs = HostFindUniqueArgsBase
      

  /**
   * Host: findFirstOrThrow
   */
  export type HostFindFirstOrThrowArgs = HostFindFirstArgsBase
      

  /**
   * Host without action
   */
  export type HostArgs = {
    /**
     * Select specific fields to fetch from the Host
     * 
    **/
    select?: HostSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: HostInclude | null
  }



  /**
   * Model HostRole
   */


  export type AggregateHostRole = {
    _count: HostRoleCountAggregateOutputType | null
    _avg: HostRoleAvgAggregateOutputType | null
    _sum: HostRoleSumAggregateOutputType | null
    _min: HostRoleMinAggregateOutputType | null
    _max: HostRoleMaxAggregateOutputType | null
  }

  export type HostRoleAvgAggregateOutputType = {
    hostId: number | null
  }

  export type HostRoleSumAggregateOutputType = {
    hostId: number | null
  }

  export type HostRoleMinAggregateOutputType = {
    hostId: number | null
    userId: string | null
    role: string | null
  }

  export type HostRoleMaxAggregateOutputType = {
    hostId: number | null
    userId: string | null
    role: string | null
  }

  export type HostRoleCountAggregateOutputType = {
    hostId: number
    userId: number
    role: number
    _all: number
  }


  export type HostRoleAvgAggregateInputType = {
    hostId?: true
  }

  export type HostRoleSumAggregateInputType = {
    hostId?: true
  }

  export type HostRoleMinAggregateInputType = {
    hostId?: true
    userId?: true
    role?: true
  }

  export type HostRoleMaxAggregateInputType = {
    hostId?: true
    userId?: true
    role?: true
  }

  export type HostRoleCountAggregateInputType = {
    hostId?: true
    userId?: true
    role?: true
    _all?: true
  }

  export type HostRoleAggregateArgs = {
    /**
     * Filter which HostRole to aggregate.
     * 
    **/
    where?: HostRoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HostRoles to fetch.
     * 
    **/
    orderBy?: Enumerable<HostRoleOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     * 
    **/
    cursor?: HostRoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HostRoles from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HostRoles.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned HostRoles
    **/
    _count?: true | HostRoleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: HostRoleAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: HostRoleSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: HostRoleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: HostRoleMaxAggregateInputType
  }

  export type GetHostRoleAggregateType<T extends HostRoleAggregateArgs> = {
        [P in keyof T & keyof AggregateHostRole]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateHostRole[P]>
      : GetScalarType<T[P], AggregateHostRole[P]>
  }




  export type HostRoleGroupByArgs = {
    where?: HostRoleWhereInput
    orderBy?: Enumerable<HostRoleOrderByWithAggregationInput>
    by: Array<HostRoleScalarFieldEnum>
    having?: HostRoleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: HostRoleCountAggregateInputType | true
    _avg?: HostRoleAvgAggregateInputType
    _sum?: HostRoleSumAggregateInputType
    _min?: HostRoleMinAggregateInputType
    _max?: HostRoleMaxAggregateInputType
  }


  export type HostRoleGroupByOutputType = {
    hostId: number
    userId: string
    role: string
    _count: HostRoleCountAggregateOutputType | null
    _avg: HostRoleAvgAggregateOutputType | null
    _sum: HostRoleSumAggregateOutputType | null
    _min: HostRoleMinAggregateOutputType | null
    _max: HostRoleMaxAggregateOutputType | null
  }

  type GetHostRoleGroupByPayload<T extends HostRoleGroupByArgs> = PrismaPromise<
    Array<
      PickArray<HostRoleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof HostRoleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], HostRoleGroupByOutputType[P]>
            : GetScalarType<T[P], HostRoleGroupByOutputType[P]>
        }
      >
    >


  export type HostRoleSelect = {
    hostId?: boolean
    host?: boolean | HostArgs
    userId?: boolean
    user?: boolean | UserArgs
    role?: boolean
  }

  export type HostRoleInclude = {
    host?: boolean | HostArgs
    user?: boolean | UserArgs
  }

  export type HostRoleGetPayload<
    S extends boolean | null | undefined | HostRoleArgs,
    U = keyof S
      > = S extends true
        ? HostRole
    : S extends undefined
    ? never
    : S extends HostRoleArgs | HostRoleFindManyArgs
    ?'include' extends U
    ? HostRole  & {
    [P in TrueKeys<S['include']>]:
        P extends 'host' ? HostGetPayload<Exclude<S['include'], undefined | null>[P]> :
        P extends 'user' ? UserGetPayload<Exclude<S['include'], undefined | null>[P]> :  never
  } 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]:
        P extends 'host' ? HostGetPayload<Exclude<S['select'], undefined | null>[P]> :
        P extends 'user' ? UserGetPayload<Exclude<S['select'], undefined | null>[P]> :  P extends keyof HostRole ? HostRole[P] : never
  } 
    : HostRole
  : HostRole


  type HostRoleCountArgs = Merge<
    Omit<HostRoleFindManyArgs, 'select' | 'include'> & {
      select?: HostRoleCountAggregateInputType | true
    }
  >

  export interface HostRoleDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined> {
    /**
     * Find zero or one HostRole that matches the filter.
     * @param {HostRoleFindUniqueArgs} args - Arguments to find a HostRole
     * @example
     * // Get one HostRole
     * const hostRole = await prisma.hostRole.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends HostRoleFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, HostRoleFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'HostRole'> extends True ? CheckSelect<T, Prisma__HostRoleClient<HostRole>, Prisma__HostRoleClient<HostRoleGetPayload<T>>> : CheckSelect<T, Prisma__HostRoleClient<HostRole | null >, Prisma__HostRoleClient<HostRoleGetPayload<T> | null >>

    /**
     * Find the first HostRole that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HostRoleFindFirstArgs} args - Arguments to find a HostRole
     * @example
     * // Get one HostRole
     * const hostRole = await prisma.hostRole.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends HostRoleFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, HostRoleFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'HostRole'> extends True ? CheckSelect<T, Prisma__HostRoleClient<HostRole>, Prisma__HostRoleClient<HostRoleGetPayload<T>>> : CheckSelect<T, Prisma__HostRoleClient<HostRole | null >, Prisma__HostRoleClient<HostRoleGetPayload<T> | null >>

    /**
     * Find zero or more HostRoles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HostRoleFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all HostRoles
     * const hostRoles = await prisma.hostRole.findMany()
     * 
     * // Get first 10 HostRoles
     * const hostRoles = await prisma.hostRole.findMany({ take: 10 })
     * 
     * // Only select the `hostId`
     * const hostRoleWithHostIdOnly = await prisma.hostRole.findMany({ select: { hostId: true } })
     * 
    **/
    findMany<T extends HostRoleFindManyArgs>(
      args?: SelectSubset<T, HostRoleFindManyArgs>
    ): CheckSelect<T, PrismaPromise<Array<HostRole>>, PrismaPromise<Array<HostRoleGetPayload<T>>>>

    /**
     * Create a HostRole.
     * @param {HostRoleCreateArgs} args - Arguments to create a HostRole.
     * @example
     * // Create one HostRole
     * const HostRole = await prisma.hostRole.create({
     *   data: {
     *     // ... data to create a HostRole
     *   }
     * })
     * 
    **/
    create<T extends HostRoleCreateArgs>(
      args: SelectSubset<T, HostRoleCreateArgs>
    ): CheckSelect<T, Prisma__HostRoleClient<HostRole>, Prisma__HostRoleClient<HostRoleGetPayload<T>>>

    /**
     * Create many HostRoles.
     *     @param {HostRoleCreateManyArgs} args - Arguments to create many HostRoles.
     *     @example
     *     // Create many HostRoles
     *     const hostRole = await prisma.hostRole.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends HostRoleCreateManyArgs>(
      args?: SelectSubset<T, HostRoleCreateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Delete a HostRole.
     * @param {HostRoleDeleteArgs} args - Arguments to delete one HostRole.
     * @example
     * // Delete one HostRole
     * const HostRole = await prisma.hostRole.delete({
     *   where: {
     *     // ... filter to delete one HostRole
     *   }
     * })
     * 
    **/
    delete<T extends HostRoleDeleteArgs>(
      args: SelectSubset<T, HostRoleDeleteArgs>
    ): CheckSelect<T, Prisma__HostRoleClient<HostRole>, Prisma__HostRoleClient<HostRoleGetPayload<T>>>

    /**
     * Update one HostRole.
     * @param {HostRoleUpdateArgs} args - Arguments to update one HostRole.
     * @example
     * // Update one HostRole
     * const hostRole = await prisma.hostRole.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends HostRoleUpdateArgs>(
      args: SelectSubset<T, HostRoleUpdateArgs>
    ): CheckSelect<T, Prisma__HostRoleClient<HostRole>, Prisma__HostRoleClient<HostRoleGetPayload<T>>>

    /**
     * Delete zero or more HostRoles.
     * @param {HostRoleDeleteManyArgs} args - Arguments to filter HostRoles to delete.
     * @example
     * // Delete a few HostRoles
     * const { count } = await prisma.hostRole.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends HostRoleDeleteManyArgs>(
      args?: SelectSubset<T, HostRoleDeleteManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Update zero or more HostRoles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HostRoleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many HostRoles
     * const hostRole = await prisma.hostRole.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends HostRoleUpdateManyArgs>(
      args: SelectSubset<T, HostRoleUpdateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Create or update one HostRole.
     * @param {HostRoleUpsertArgs} args - Arguments to update or create a HostRole.
     * @example
     * // Update or create a HostRole
     * const hostRole = await prisma.hostRole.upsert({
     *   create: {
     *     // ... data to create a HostRole
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the HostRole we want to update
     *   }
     * })
    **/
    upsert<T extends HostRoleUpsertArgs>(
      args: SelectSubset<T, HostRoleUpsertArgs>
    ): CheckSelect<T, Prisma__HostRoleClient<HostRole>, Prisma__HostRoleClient<HostRoleGetPayload<T>>>

    /**
     * Find one HostRole that matches the filter or throw
     * `NotFoundError` if no matches were found.
     * @param {HostRoleFindUniqueOrThrowArgs} args - Arguments to find a HostRole
     * @example
     * // Get one HostRole
     * const hostRole = await prisma.hostRole.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends HostRoleFindUniqueOrThrowArgs>(
      args?: SelectSubset<T, HostRoleFindUniqueOrThrowArgs>
    ): CheckSelect<T, Prisma__HostRoleClient<HostRole>, Prisma__HostRoleClient<HostRoleGetPayload<T>>>

    /**
     * Find the first HostRole that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HostRoleFindFirstOrThrowArgs} args - Arguments to find a HostRole
     * @example
     * // Get one HostRole
     * const hostRole = await prisma.hostRole.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends HostRoleFindFirstOrThrowArgs>(
      args?: SelectSubset<T, HostRoleFindFirstOrThrowArgs>
    ): CheckSelect<T, Prisma__HostRoleClient<HostRole>, Prisma__HostRoleClient<HostRoleGetPayload<T>>>

    /**
     * Count the number of HostRoles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HostRoleCountArgs} args - Arguments to filter HostRoles to count.
     * @example
     * // Count the number of HostRoles
     * const count = await prisma.hostRole.count({
     *   where: {
     *     // ... the filter for the HostRoles we want to count
     *   }
     * })
    **/
    count<T extends HostRoleCountArgs>(
      args?: Subset<T, HostRoleCountArgs>,
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], HostRoleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a HostRole.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HostRoleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends HostRoleAggregateArgs>(args: Subset<T, HostRoleAggregateArgs>): PrismaPromise<GetHostRoleAggregateType<T>>

    /**
     * Group by HostRole.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HostRoleGroupByArgs} args - Group by arguments.
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
      T extends HostRoleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: HostRoleGroupByArgs['orderBy'] }
        : { orderBy?: HostRoleGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
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
    >(args: SubsetIntersection<T, HostRoleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetHostRoleGroupByPayload<T> : PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for HostRole.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__HostRoleClient<T> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: runtime.DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';

    host<T extends HostArgs = {}>(args?: Subset<T, HostArgs>): CheckSelect<T, Prisma__HostClient<Host | null >, Prisma__HostClient<HostGetPayload<T> | null >>;

    user<T extends UserArgs = {}>(args?: Subset<T, UserArgs>): CheckSelect<T, Prisma__UserClient<User | null >, Prisma__UserClient<UserGetPayload<T> | null >>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * HostRole base type for findUnique actions
   */
  export type HostRoleFindUniqueArgsBase = {
    /**
     * Select specific fields to fetch from the HostRole
     * 
    **/
    select?: HostRoleSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: HostRoleInclude | null
    /**
     * Filter, which HostRole to fetch.
     * 
    **/
    where: HostRoleWhereUniqueInput
  }

  /**
   * HostRole: findUnique
   */
  export interface HostRoleFindUniqueArgs extends HostRoleFindUniqueArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * HostRole base type for findFirst actions
   */
  export type HostRoleFindFirstArgsBase = {
    /**
     * Select specific fields to fetch from the HostRole
     * 
    **/
    select?: HostRoleSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: HostRoleInclude | null
    /**
     * Filter, which HostRole to fetch.
     * 
    **/
    where?: HostRoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HostRoles to fetch.
     * 
    **/
    orderBy?: Enumerable<HostRoleOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for HostRoles.
     * 
    **/
    cursor?: HostRoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HostRoles from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HostRoles.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of HostRoles.
     * 
    **/
    distinct?: Enumerable<HostRoleScalarFieldEnum>
  }

  /**
   * HostRole: findFirst
   */
  export interface HostRoleFindFirstArgs extends HostRoleFindFirstArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * HostRole findMany
   */
  export type HostRoleFindManyArgs = {
    /**
     * Select specific fields to fetch from the HostRole
     * 
    **/
    select?: HostRoleSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: HostRoleInclude | null
    /**
     * Filter, which HostRoles to fetch.
     * 
    **/
    where?: HostRoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HostRoles to fetch.
     * 
    **/
    orderBy?: Enumerable<HostRoleOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing HostRoles.
     * 
    **/
    cursor?: HostRoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HostRoles from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HostRoles.
     * 
    **/
    skip?: number
    distinct?: Enumerable<HostRoleScalarFieldEnum>
  }


  /**
   * HostRole create
   */
  export type HostRoleCreateArgs = {
    /**
     * Select specific fields to fetch from the HostRole
     * 
    **/
    select?: HostRoleSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: HostRoleInclude | null
    /**
     * The data needed to create a HostRole.
     * 
    **/
    data: XOR<HostRoleCreateInput, HostRoleUncheckedCreateInput>
  }


  /**
   * HostRole createMany
   */
  export type HostRoleCreateManyArgs = {
    /**
     * The data used to create many HostRoles.
     * 
    **/
    data: Enumerable<HostRoleCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * HostRole update
   */
  export type HostRoleUpdateArgs = {
    /**
     * Select specific fields to fetch from the HostRole
     * 
    **/
    select?: HostRoleSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: HostRoleInclude | null
    /**
     * The data needed to update a HostRole.
     * 
    **/
    data: XOR<HostRoleUpdateInput, HostRoleUncheckedUpdateInput>
    /**
     * Choose, which HostRole to update.
     * 
    **/
    where: HostRoleWhereUniqueInput
  }


  /**
   * HostRole updateMany
   */
  export type HostRoleUpdateManyArgs = {
    /**
     * The data used to update HostRoles.
     * 
    **/
    data: XOR<HostRoleUpdateManyMutationInput, HostRoleUncheckedUpdateManyInput>
    /**
     * Filter which HostRoles to update
     * 
    **/
    where?: HostRoleWhereInput
  }


  /**
   * HostRole upsert
   */
  export type HostRoleUpsertArgs = {
    /**
     * Select specific fields to fetch from the HostRole
     * 
    **/
    select?: HostRoleSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: HostRoleInclude | null
    /**
     * The filter to search for the HostRole to update in case it exists.
     * 
    **/
    where: HostRoleWhereUniqueInput
    /**
     * In case the HostRole found by the `where` argument doesn't exist, create a new HostRole with this data.
     * 
    **/
    create: XOR<HostRoleCreateInput, HostRoleUncheckedCreateInput>
    /**
     * In case the HostRole was found with the provided `where` argument, update it with this data.
     * 
    **/
    update: XOR<HostRoleUpdateInput, HostRoleUncheckedUpdateInput>
  }


  /**
   * HostRole delete
   */
  export type HostRoleDeleteArgs = {
    /**
     * Select specific fields to fetch from the HostRole
     * 
    **/
    select?: HostRoleSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: HostRoleInclude | null
    /**
     * Filter which HostRole to delete.
     * 
    **/
    where: HostRoleWhereUniqueInput
  }


  /**
   * HostRole deleteMany
   */
  export type HostRoleDeleteManyArgs = {
    /**
     * Filter which HostRoles to delete
     * 
    **/
    where?: HostRoleWhereInput
  }


  /**
   * HostRole: findUniqueOrThrow
   */
  export type HostRoleFindUniqueOrThrowArgs = HostRoleFindUniqueArgsBase
      

  /**
   * HostRole: findFirstOrThrow
   */
  export type HostRoleFindFirstOrThrowArgs = HostRoleFindFirstArgsBase
      

  /**
   * HostRole without action
   */
  export type HostRoleArgs = {
    /**
     * Select specific fields to fetch from the HostRole
     * 
    **/
    select?: HostRoleSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: HostRoleInclude | null
  }



  /**
   * Model Ticket
   */


  export type AggregateTicket = {
    _count: TicketCountAggregateOutputType | null
    _avg: TicketAvgAggregateOutputType | null
    _sum: TicketSumAggregateOutputType | null
    _min: TicketMinAggregateOutputType | null
    _max: TicketMaxAggregateOutputType | null
  }

  export type TicketAvgAggregateOutputType = {
    id: number | null
    eventId: number | null
    ticketQuantity: number | null
  }

  export type TicketSumAggregateOutputType = {
    id: number | null
    eventId: number | null
    ticketQuantity: number | null
  }

  export type TicketMinAggregateOutputType = {
    id: number | null
    eventId: number | null
    stripeSessionId: string | null
    stripeChargeId: string | null
    receiptUrl: string | null
    customerName: string | null
    customerPhoneNumber: string | null
    customerEmail: string | null
    userId: string | null
    ticketQuantity: number | null
    used: boolean | null
    purchasedAt: Date | null
  }

  export type TicketMaxAggregateOutputType = {
    id: number | null
    eventId: number | null
    stripeSessionId: string | null
    stripeChargeId: string | null
    receiptUrl: string | null
    customerName: string | null
    customerPhoneNumber: string | null
    customerEmail: string | null
    userId: string | null
    ticketQuantity: number | null
    used: boolean | null
    purchasedAt: Date | null
  }

  export type TicketCountAggregateOutputType = {
    id: number
    eventId: number
    stripeSessionId: number
    stripeChargeId: number
    receiptUrl: number
    customerName: number
    customerPhoneNumber: number
    customerEmail: number
    userId: number
    ticketQuantity: number
    used: number
    purchasedAt: number
    _all: number
  }


  export type TicketAvgAggregateInputType = {
    id?: true
    eventId?: true
    ticketQuantity?: true
  }

  export type TicketSumAggregateInputType = {
    id?: true
    eventId?: true
    ticketQuantity?: true
  }

  export type TicketMinAggregateInputType = {
    id?: true
    eventId?: true
    stripeSessionId?: true
    stripeChargeId?: true
    receiptUrl?: true
    customerName?: true
    customerPhoneNumber?: true
    customerEmail?: true
    userId?: true
    ticketQuantity?: true
    used?: true
    purchasedAt?: true
  }

  export type TicketMaxAggregateInputType = {
    id?: true
    eventId?: true
    stripeSessionId?: true
    stripeChargeId?: true
    receiptUrl?: true
    customerName?: true
    customerPhoneNumber?: true
    customerEmail?: true
    userId?: true
    ticketQuantity?: true
    used?: true
    purchasedAt?: true
  }

  export type TicketCountAggregateInputType = {
    id?: true
    eventId?: true
    stripeSessionId?: true
    stripeChargeId?: true
    receiptUrl?: true
    customerName?: true
    customerPhoneNumber?: true
    customerEmail?: true
    userId?: true
    ticketQuantity?: true
    used?: true
    purchasedAt?: true
    _all?: true
  }

  export type TicketAggregateArgs = {
    /**
     * Filter which Ticket to aggregate.
     * 
    **/
    where?: TicketWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tickets to fetch.
     * 
    **/
    orderBy?: Enumerable<TicketOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     * 
    **/
    cursor?: TicketWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tickets from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tickets.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Tickets
    **/
    _count?: true | TicketCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TicketAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TicketSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TicketMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TicketMaxAggregateInputType
  }

  export type GetTicketAggregateType<T extends TicketAggregateArgs> = {
        [P in keyof T & keyof AggregateTicket]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTicket[P]>
      : GetScalarType<T[P], AggregateTicket[P]>
  }




  export type TicketGroupByArgs = {
    where?: TicketWhereInput
    orderBy?: Enumerable<TicketOrderByWithAggregationInput>
    by: Array<TicketScalarFieldEnum>
    having?: TicketScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TicketCountAggregateInputType | true
    _avg?: TicketAvgAggregateInputType
    _sum?: TicketSumAggregateInputType
    _min?: TicketMinAggregateInputType
    _max?: TicketMaxAggregateInputType
  }


  export type TicketGroupByOutputType = {
    id: number
    eventId: number
    stripeSessionId: string
    stripeChargeId: string
    receiptUrl: string
    customerName: string
    customerPhoneNumber: string
    customerEmail: string
    userId: string | null
    ticketQuantity: number
    used: boolean
    purchasedAt: Date
    _count: TicketCountAggregateOutputType | null
    _avg: TicketAvgAggregateOutputType | null
    _sum: TicketSumAggregateOutputType | null
    _min: TicketMinAggregateOutputType | null
    _max: TicketMaxAggregateOutputType | null
  }

  type GetTicketGroupByPayload<T extends TicketGroupByArgs> = PrismaPromise<
    Array<
      PickArray<TicketGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TicketGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TicketGroupByOutputType[P]>
            : GetScalarType<T[P], TicketGroupByOutputType[P]>
        }
      >
    >


  export type TicketSelect = {
    id?: boolean
    eventId?: boolean
    event?: boolean | EventArgs
    stripeSessionId?: boolean
    stripeChargeId?: boolean
    receiptUrl?: boolean
    customerName?: boolean
    customerPhoneNumber?: boolean
    customerEmail?: boolean
    userId?: boolean
    user?: boolean | UserArgs
    ticketQuantity?: boolean
    used?: boolean
    purchasedAt?: boolean
  }

  export type TicketInclude = {
    event?: boolean | EventArgs
    user?: boolean | UserArgs
  }

  export type TicketGetPayload<
    S extends boolean | null | undefined | TicketArgs,
    U = keyof S
      > = S extends true
        ? Ticket
    : S extends undefined
    ? never
    : S extends TicketArgs | TicketFindManyArgs
    ?'include' extends U
    ? Ticket  & {
    [P in TrueKeys<S['include']>]:
        P extends 'event' ? EventGetPayload<Exclude<S['include'], undefined | null>[P]> :
        P extends 'user' ? UserGetPayload<Exclude<S['include'], undefined | null>[P]> | null :  never
  } 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]:
        P extends 'event' ? EventGetPayload<Exclude<S['select'], undefined | null>[P]> :
        P extends 'user' ? UserGetPayload<Exclude<S['select'], undefined | null>[P]> | null :  P extends keyof Ticket ? Ticket[P] : never
  } 
    : Ticket
  : Ticket


  type TicketCountArgs = Merge<
    Omit<TicketFindManyArgs, 'select' | 'include'> & {
      select?: TicketCountAggregateInputType | true
    }
  >

  export interface TicketDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined> {
    /**
     * Find zero or one Ticket that matches the filter.
     * @param {TicketFindUniqueArgs} args - Arguments to find a Ticket
     * @example
     * // Get one Ticket
     * const ticket = await prisma.ticket.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends TicketFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, TicketFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'Ticket'> extends True ? CheckSelect<T, Prisma__TicketClient<Ticket>, Prisma__TicketClient<TicketGetPayload<T>>> : CheckSelect<T, Prisma__TicketClient<Ticket | null >, Prisma__TicketClient<TicketGetPayload<T> | null >>

    /**
     * Find the first Ticket that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketFindFirstArgs} args - Arguments to find a Ticket
     * @example
     * // Get one Ticket
     * const ticket = await prisma.ticket.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends TicketFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, TicketFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'Ticket'> extends True ? CheckSelect<T, Prisma__TicketClient<Ticket>, Prisma__TicketClient<TicketGetPayload<T>>> : CheckSelect<T, Prisma__TicketClient<Ticket | null >, Prisma__TicketClient<TicketGetPayload<T> | null >>

    /**
     * Find zero or more Tickets that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Tickets
     * const tickets = await prisma.ticket.findMany()
     * 
     * // Get first 10 Tickets
     * const tickets = await prisma.ticket.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const ticketWithIdOnly = await prisma.ticket.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends TicketFindManyArgs>(
      args?: SelectSubset<T, TicketFindManyArgs>
    ): CheckSelect<T, PrismaPromise<Array<Ticket>>, PrismaPromise<Array<TicketGetPayload<T>>>>

    /**
     * Create a Ticket.
     * @param {TicketCreateArgs} args - Arguments to create a Ticket.
     * @example
     * // Create one Ticket
     * const Ticket = await prisma.ticket.create({
     *   data: {
     *     // ... data to create a Ticket
     *   }
     * })
     * 
    **/
    create<T extends TicketCreateArgs>(
      args: SelectSubset<T, TicketCreateArgs>
    ): CheckSelect<T, Prisma__TicketClient<Ticket>, Prisma__TicketClient<TicketGetPayload<T>>>

    /**
     * Create many Tickets.
     *     @param {TicketCreateManyArgs} args - Arguments to create many Tickets.
     *     @example
     *     // Create many Tickets
     *     const ticket = await prisma.ticket.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends TicketCreateManyArgs>(
      args?: SelectSubset<T, TicketCreateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Delete a Ticket.
     * @param {TicketDeleteArgs} args - Arguments to delete one Ticket.
     * @example
     * // Delete one Ticket
     * const Ticket = await prisma.ticket.delete({
     *   where: {
     *     // ... filter to delete one Ticket
     *   }
     * })
     * 
    **/
    delete<T extends TicketDeleteArgs>(
      args: SelectSubset<T, TicketDeleteArgs>
    ): CheckSelect<T, Prisma__TicketClient<Ticket>, Prisma__TicketClient<TicketGetPayload<T>>>

    /**
     * Update one Ticket.
     * @param {TicketUpdateArgs} args - Arguments to update one Ticket.
     * @example
     * // Update one Ticket
     * const ticket = await prisma.ticket.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends TicketUpdateArgs>(
      args: SelectSubset<T, TicketUpdateArgs>
    ): CheckSelect<T, Prisma__TicketClient<Ticket>, Prisma__TicketClient<TicketGetPayload<T>>>

    /**
     * Delete zero or more Tickets.
     * @param {TicketDeleteManyArgs} args - Arguments to filter Tickets to delete.
     * @example
     * // Delete a few Tickets
     * const { count } = await prisma.ticket.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends TicketDeleteManyArgs>(
      args?: SelectSubset<T, TicketDeleteManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tickets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Tickets
     * const ticket = await prisma.ticket.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends TicketUpdateManyArgs>(
      args: SelectSubset<T, TicketUpdateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Create or update one Ticket.
     * @param {TicketUpsertArgs} args - Arguments to update or create a Ticket.
     * @example
     * // Update or create a Ticket
     * const ticket = await prisma.ticket.upsert({
     *   create: {
     *     // ... data to create a Ticket
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Ticket we want to update
     *   }
     * })
    **/
    upsert<T extends TicketUpsertArgs>(
      args: SelectSubset<T, TicketUpsertArgs>
    ): CheckSelect<T, Prisma__TicketClient<Ticket>, Prisma__TicketClient<TicketGetPayload<T>>>

    /**
     * Find one Ticket that matches the filter or throw
     * `NotFoundError` if no matches were found.
     * @param {TicketFindUniqueOrThrowArgs} args - Arguments to find a Ticket
     * @example
     * // Get one Ticket
     * const ticket = await prisma.ticket.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends TicketFindUniqueOrThrowArgs>(
      args?: SelectSubset<T, TicketFindUniqueOrThrowArgs>
    ): CheckSelect<T, Prisma__TicketClient<Ticket>, Prisma__TicketClient<TicketGetPayload<T>>>

    /**
     * Find the first Ticket that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketFindFirstOrThrowArgs} args - Arguments to find a Ticket
     * @example
     * // Get one Ticket
     * const ticket = await prisma.ticket.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends TicketFindFirstOrThrowArgs>(
      args?: SelectSubset<T, TicketFindFirstOrThrowArgs>
    ): CheckSelect<T, Prisma__TicketClient<Ticket>, Prisma__TicketClient<TicketGetPayload<T>>>

    /**
     * Count the number of Tickets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketCountArgs} args - Arguments to filter Tickets to count.
     * @example
     * // Count the number of Tickets
     * const count = await prisma.ticket.count({
     *   where: {
     *     // ... the filter for the Tickets we want to count
     *   }
     * })
    **/
    count<T extends TicketCountArgs>(
      args?: Subset<T, TicketCountArgs>,
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TicketCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Ticket.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends TicketAggregateArgs>(args: Subset<T, TicketAggregateArgs>): PrismaPromise<GetTicketAggregateType<T>>

    /**
     * Group by Ticket.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketGroupByArgs} args - Group by arguments.
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
      T extends TicketGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TicketGroupByArgs['orderBy'] }
        : { orderBy?: TicketGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
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
    >(args: SubsetIntersection<T, TicketGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTicketGroupByPayload<T> : PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for Ticket.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__TicketClient<T> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: runtime.DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';

    event<T extends EventArgs = {}>(args?: Subset<T, EventArgs>): CheckSelect<T, Prisma__EventClient<Event | null >, Prisma__EventClient<EventGetPayload<T> | null >>;

    user<T extends UserArgs = {}>(args?: Subset<T, UserArgs>): CheckSelect<T, Prisma__UserClient<User | null >, Prisma__UserClient<UserGetPayload<T> | null >>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * Ticket base type for findUnique actions
   */
  export type TicketFindUniqueArgsBase = {
    /**
     * Select specific fields to fetch from the Ticket
     * 
    **/
    select?: TicketSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: TicketInclude | null
    /**
     * Filter, which Ticket to fetch.
     * 
    **/
    where: TicketWhereUniqueInput
  }

  /**
   * Ticket: findUnique
   */
  export interface TicketFindUniqueArgs extends TicketFindUniqueArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Ticket base type for findFirst actions
   */
  export type TicketFindFirstArgsBase = {
    /**
     * Select specific fields to fetch from the Ticket
     * 
    **/
    select?: TicketSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: TicketInclude | null
    /**
     * Filter, which Ticket to fetch.
     * 
    **/
    where?: TicketWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tickets to fetch.
     * 
    **/
    orderBy?: Enumerable<TicketOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tickets.
     * 
    **/
    cursor?: TicketWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tickets from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tickets.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tickets.
     * 
    **/
    distinct?: Enumerable<TicketScalarFieldEnum>
  }

  /**
   * Ticket: findFirst
   */
  export interface TicketFindFirstArgs extends TicketFindFirstArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Ticket findMany
   */
  export type TicketFindManyArgs = {
    /**
     * Select specific fields to fetch from the Ticket
     * 
    **/
    select?: TicketSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: TicketInclude | null
    /**
     * Filter, which Tickets to fetch.
     * 
    **/
    where?: TicketWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tickets to fetch.
     * 
    **/
    orderBy?: Enumerable<TicketOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Tickets.
     * 
    **/
    cursor?: TicketWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tickets from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tickets.
     * 
    **/
    skip?: number
    distinct?: Enumerable<TicketScalarFieldEnum>
  }


  /**
   * Ticket create
   */
  export type TicketCreateArgs = {
    /**
     * Select specific fields to fetch from the Ticket
     * 
    **/
    select?: TicketSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: TicketInclude | null
    /**
     * The data needed to create a Ticket.
     * 
    **/
    data: XOR<TicketCreateInput, TicketUncheckedCreateInput>
  }


  /**
   * Ticket createMany
   */
  export type TicketCreateManyArgs = {
    /**
     * The data used to create many Tickets.
     * 
    **/
    data: Enumerable<TicketCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * Ticket update
   */
  export type TicketUpdateArgs = {
    /**
     * Select specific fields to fetch from the Ticket
     * 
    **/
    select?: TicketSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: TicketInclude | null
    /**
     * The data needed to update a Ticket.
     * 
    **/
    data: XOR<TicketUpdateInput, TicketUncheckedUpdateInput>
    /**
     * Choose, which Ticket to update.
     * 
    **/
    where: TicketWhereUniqueInput
  }


  /**
   * Ticket updateMany
   */
  export type TicketUpdateManyArgs = {
    /**
     * The data used to update Tickets.
     * 
    **/
    data: XOR<TicketUpdateManyMutationInput, TicketUncheckedUpdateManyInput>
    /**
     * Filter which Tickets to update
     * 
    **/
    where?: TicketWhereInput
  }


  /**
   * Ticket upsert
   */
  export type TicketUpsertArgs = {
    /**
     * Select specific fields to fetch from the Ticket
     * 
    **/
    select?: TicketSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: TicketInclude | null
    /**
     * The filter to search for the Ticket to update in case it exists.
     * 
    **/
    where: TicketWhereUniqueInput
    /**
     * In case the Ticket found by the `where` argument doesn't exist, create a new Ticket with this data.
     * 
    **/
    create: XOR<TicketCreateInput, TicketUncheckedCreateInput>
    /**
     * In case the Ticket was found with the provided `where` argument, update it with this data.
     * 
    **/
    update: XOR<TicketUpdateInput, TicketUncheckedUpdateInput>
  }


  /**
   * Ticket delete
   */
  export type TicketDeleteArgs = {
    /**
     * Select specific fields to fetch from the Ticket
     * 
    **/
    select?: TicketSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: TicketInclude | null
    /**
     * Filter which Ticket to delete.
     * 
    **/
    where: TicketWhereUniqueInput
  }


  /**
   * Ticket deleteMany
   */
  export type TicketDeleteManyArgs = {
    /**
     * Filter which Tickets to delete
     * 
    **/
    where?: TicketWhereInput
  }


  /**
   * Ticket: findUniqueOrThrow
   */
  export type TicketFindUniqueOrThrowArgs = TicketFindUniqueArgsBase
      

  /**
   * Ticket: findFirstOrThrow
   */
  export type TicketFindFirstOrThrowArgs = TicketFindFirstArgsBase
      

  /**
   * Ticket without action
   */
  export type TicketArgs = {
    /**
     * Select specific fields to fetch from the Ticket
     * 
    **/
    select?: TicketSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: TicketInclude | null
  }



  /**
   * Model Service
   */


  export type AggregateService = {
    _count: ServiceCountAggregateOutputType | null
    _avg: ServiceAvgAggregateOutputType | null
    _sum: ServiceSumAggregateOutputType | null
    _min: ServiceMinAggregateOutputType | null
    _max: ServiceMaxAggregateOutputType | null
  }

  export type ServiceAvgAggregateOutputType = {
    id: number | null
    price: number | null
  }

  export type ServiceSumAggregateOutputType = {
    id: number | null
    price: number | null
  }

  export type ServiceMinAggregateOutputType = {
    id: number | null
    name: string | null
    description: string | null
    imageUrl: string | null
    price: number | null
  }

  export type ServiceMaxAggregateOutputType = {
    id: number | null
    name: string | null
    description: string | null
    imageUrl: string | null
    price: number | null
  }

  export type ServiceCountAggregateOutputType = {
    id: number
    name: number
    description: number
    imageUrl: number
    price: number
    _all: number
  }


  export type ServiceAvgAggregateInputType = {
    id?: true
    price?: true
  }

  export type ServiceSumAggregateInputType = {
    id?: true
    price?: true
  }

  export type ServiceMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    imageUrl?: true
    price?: true
  }

  export type ServiceMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    imageUrl?: true
    price?: true
  }

  export type ServiceCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    imageUrl?: true
    price?: true
    _all?: true
  }

  export type ServiceAggregateArgs = {
    /**
     * Filter which Service to aggregate.
     * 
    **/
    where?: ServiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Services to fetch.
     * 
    **/
    orderBy?: Enumerable<ServiceOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     * 
    **/
    cursor?: ServiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Services from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Services.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Services
    **/
    _count?: true | ServiceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ServiceAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ServiceSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ServiceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ServiceMaxAggregateInputType
  }

  export type GetServiceAggregateType<T extends ServiceAggregateArgs> = {
        [P in keyof T & keyof AggregateService]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateService[P]>
      : GetScalarType<T[P], AggregateService[P]>
  }




  export type ServiceGroupByArgs = {
    where?: ServiceWhereInput
    orderBy?: Enumerable<ServiceOrderByWithAggregationInput>
    by: Array<ServiceScalarFieldEnum>
    having?: ServiceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ServiceCountAggregateInputType | true
    _avg?: ServiceAvgAggregateInputType
    _sum?: ServiceSumAggregateInputType
    _min?: ServiceMinAggregateInputType
    _max?: ServiceMaxAggregateInputType
  }


  export type ServiceGroupByOutputType = {
    id: number
    name: string
    description: string | null
    imageUrl: string | null
    price: number
    _count: ServiceCountAggregateOutputType | null
    _avg: ServiceAvgAggregateOutputType | null
    _sum: ServiceSumAggregateOutputType | null
    _min: ServiceMinAggregateOutputType | null
    _max: ServiceMaxAggregateOutputType | null
  }

  type GetServiceGroupByPayload<T extends ServiceGroupByArgs> = PrismaPromise<
    Array<
      PickArray<ServiceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ServiceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ServiceGroupByOutputType[P]>
            : GetScalarType<T[P], ServiceGroupByOutputType[P]>
        }
      >
    >


  export type ServiceSelect = {
    id?: boolean
    name?: boolean
    description?: boolean
    imageUrl?: boolean
    price?: boolean
  }

  export type ServiceGetPayload<
    S extends boolean | null | undefined | ServiceArgs,
    U = keyof S
      > = S extends true
        ? Service
    : S extends undefined
    ? never
    : S extends ServiceArgs | ServiceFindManyArgs
    ?'include' extends U
    ? Service 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]:
    P extends keyof Service ? Service[P] : never
  } 
    : Service
  : Service


  type ServiceCountArgs = Merge<
    Omit<ServiceFindManyArgs, 'select' | 'include'> & {
      select?: ServiceCountAggregateInputType | true
    }
  >

  export interface ServiceDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined> {
    /**
     * Find zero or one Service that matches the filter.
     * @param {ServiceFindUniqueArgs} args - Arguments to find a Service
     * @example
     * // Get one Service
     * const service = await prisma.service.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends ServiceFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, ServiceFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'Service'> extends True ? CheckSelect<T, Prisma__ServiceClient<Service>, Prisma__ServiceClient<ServiceGetPayload<T>>> : CheckSelect<T, Prisma__ServiceClient<Service | null >, Prisma__ServiceClient<ServiceGetPayload<T> | null >>

    /**
     * Find the first Service that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServiceFindFirstArgs} args - Arguments to find a Service
     * @example
     * // Get one Service
     * const service = await prisma.service.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends ServiceFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, ServiceFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'Service'> extends True ? CheckSelect<T, Prisma__ServiceClient<Service>, Prisma__ServiceClient<ServiceGetPayload<T>>> : CheckSelect<T, Prisma__ServiceClient<Service | null >, Prisma__ServiceClient<ServiceGetPayload<T> | null >>

    /**
     * Find zero or more Services that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServiceFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Services
     * const services = await prisma.service.findMany()
     * 
     * // Get first 10 Services
     * const services = await prisma.service.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const serviceWithIdOnly = await prisma.service.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends ServiceFindManyArgs>(
      args?: SelectSubset<T, ServiceFindManyArgs>
    ): CheckSelect<T, PrismaPromise<Array<Service>>, PrismaPromise<Array<ServiceGetPayload<T>>>>

    /**
     * Create a Service.
     * @param {ServiceCreateArgs} args - Arguments to create a Service.
     * @example
     * // Create one Service
     * const Service = await prisma.service.create({
     *   data: {
     *     // ... data to create a Service
     *   }
     * })
     * 
    **/
    create<T extends ServiceCreateArgs>(
      args: SelectSubset<T, ServiceCreateArgs>
    ): CheckSelect<T, Prisma__ServiceClient<Service>, Prisma__ServiceClient<ServiceGetPayload<T>>>

    /**
     * Create many Services.
     *     @param {ServiceCreateManyArgs} args - Arguments to create many Services.
     *     @example
     *     // Create many Services
     *     const service = await prisma.service.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends ServiceCreateManyArgs>(
      args?: SelectSubset<T, ServiceCreateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Delete a Service.
     * @param {ServiceDeleteArgs} args - Arguments to delete one Service.
     * @example
     * // Delete one Service
     * const Service = await prisma.service.delete({
     *   where: {
     *     // ... filter to delete one Service
     *   }
     * })
     * 
    **/
    delete<T extends ServiceDeleteArgs>(
      args: SelectSubset<T, ServiceDeleteArgs>
    ): CheckSelect<T, Prisma__ServiceClient<Service>, Prisma__ServiceClient<ServiceGetPayload<T>>>

    /**
     * Update one Service.
     * @param {ServiceUpdateArgs} args - Arguments to update one Service.
     * @example
     * // Update one Service
     * const service = await prisma.service.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends ServiceUpdateArgs>(
      args: SelectSubset<T, ServiceUpdateArgs>
    ): CheckSelect<T, Prisma__ServiceClient<Service>, Prisma__ServiceClient<ServiceGetPayload<T>>>

    /**
     * Delete zero or more Services.
     * @param {ServiceDeleteManyArgs} args - Arguments to filter Services to delete.
     * @example
     * // Delete a few Services
     * const { count } = await prisma.service.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends ServiceDeleteManyArgs>(
      args?: SelectSubset<T, ServiceDeleteManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Update zero or more Services.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServiceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Services
     * const service = await prisma.service.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends ServiceUpdateManyArgs>(
      args: SelectSubset<T, ServiceUpdateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Create or update one Service.
     * @param {ServiceUpsertArgs} args - Arguments to update or create a Service.
     * @example
     * // Update or create a Service
     * const service = await prisma.service.upsert({
     *   create: {
     *     // ... data to create a Service
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Service we want to update
     *   }
     * })
    **/
    upsert<T extends ServiceUpsertArgs>(
      args: SelectSubset<T, ServiceUpsertArgs>
    ): CheckSelect<T, Prisma__ServiceClient<Service>, Prisma__ServiceClient<ServiceGetPayload<T>>>

    /**
     * Find one Service that matches the filter or throw
     * `NotFoundError` if no matches were found.
     * @param {ServiceFindUniqueOrThrowArgs} args - Arguments to find a Service
     * @example
     * // Get one Service
     * const service = await prisma.service.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends ServiceFindUniqueOrThrowArgs>(
      args?: SelectSubset<T, ServiceFindUniqueOrThrowArgs>
    ): CheckSelect<T, Prisma__ServiceClient<Service>, Prisma__ServiceClient<ServiceGetPayload<T>>>

    /**
     * Find the first Service that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServiceFindFirstOrThrowArgs} args - Arguments to find a Service
     * @example
     * // Get one Service
     * const service = await prisma.service.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends ServiceFindFirstOrThrowArgs>(
      args?: SelectSubset<T, ServiceFindFirstOrThrowArgs>
    ): CheckSelect<T, Prisma__ServiceClient<Service>, Prisma__ServiceClient<ServiceGetPayload<T>>>

    /**
     * Count the number of Services.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServiceCountArgs} args - Arguments to filter Services to count.
     * @example
     * // Count the number of Services
     * const count = await prisma.service.count({
     *   where: {
     *     // ... the filter for the Services we want to count
     *   }
     * })
    **/
    count<T extends ServiceCountArgs>(
      args?: Subset<T, ServiceCountArgs>,
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ServiceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Service.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServiceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ServiceAggregateArgs>(args: Subset<T, ServiceAggregateArgs>): PrismaPromise<GetServiceAggregateType<T>>

    /**
     * Group by Service.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServiceGroupByArgs} args - Group by arguments.
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
      T extends ServiceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ServiceGroupByArgs['orderBy'] }
        : { orderBy?: ServiceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
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
    >(args: SubsetIntersection<T, ServiceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetServiceGroupByPayload<T> : PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for Service.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__ServiceClient<T> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: runtime.DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';


    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * Service base type for findUnique actions
   */
  export type ServiceFindUniqueArgsBase = {
    /**
     * Select specific fields to fetch from the Service
     * 
    **/
    select?: ServiceSelect | null
    /**
     * Filter, which Service to fetch.
     * 
    **/
    where: ServiceWhereUniqueInput
  }

  /**
   * Service: findUnique
   */
  export interface ServiceFindUniqueArgs extends ServiceFindUniqueArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Service base type for findFirst actions
   */
  export type ServiceFindFirstArgsBase = {
    /**
     * Select specific fields to fetch from the Service
     * 
    **/
    select?: ServiceSelect | null
    /**
     * Filter, which Service to fetch.
     * 
    **/
    where?: ServiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Services to fetch.
     * 
    **/
    orderBy?: Enumerable<ServiceOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Services.
     * 
    **/
    cursor?: ServiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Services from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Services.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Services.
     * 
    **/
    distinct?: Enumerable<ServiceScalarFieldEnum>
  }

  /**
   * Service: findFirst
   */
  export interface ServiceFindFirstArgs extends ServiceFindFirstArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Service findMany
   */
  export type ServiceFindManyArgs = {
    /**
     * Select specific fields to fetch from the Service
     * 
    **/
    select?: ServiceSelect | null
    /**
     * Filter, which Services to fetch.
     * 
    **/
    where?: ServiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Services to fetch.
     * 
    **/
    orderBy?: Enumerable<ServiceOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Services.
     * 
    **/
    cursor?: ServiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Services from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Services.
     * 
    **/
    skip?: number
    distinct?: Enumerable<ServiceScalarFieldEnum>
  }


  /**
   * Service create
   */
  export type ServiceCreateArgs = {
    /**
     * Select specific fields to fetch from the Service
     * 
    **/
    select?: ServiceSelect | null
    /**
     * The data needed to create a Service.
     * 
    **/
    data: XOR<ServiceCreateInput, ServiceUncheckedCreateInput>
  }


  /**
   * Service createMany
   */
  export type ServiceCreateManyArgs = {
    /**
     * The data used to create many Services.
     * 
    **/
    data: Enumerable<ServiceCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * Service update
   */
  export type ServiceUpdateArgs = {
    /**
     * Select specific fields to fetch from the Service
     * 
    **/
    select?: ServiceSelect | null
    /**
     * The data needed to update a Service.
     * 
    **/
    data: XOR<ServiceUpdateInput, ServiceUncheckedUpdateInput>
    /**
     * Choose, which Service to update.
     * 
    **/
    where: ServiceWhereUniqueInput
  }


  /**
   * Service updateMany
   */
  export type ServiceUpdateManyArgs = {
    /**
     * The data used to update Services.
     * 
    **/
    data: XOR<ServiceUpdateManyMutationInput, ServiceUncheckedUpdateManyInput>
    /**
     * Filter which Services to update
     * 
    **/
    where?: ServiceWhereInput
  }


  /**
   * Service upsert
   */
  export type ServiceUpsertArgs = {
    /**
     * Select specific fields to fetch from the Service
     * 
    **/
    select?: ServiceSelect | null
    /**
     * The filter to search for the Service to update in case it exists.
     * 
    **/
    where: ServiceWhereUniqueInput
    /**
     * In case the Service found by the `where` argument doesn't exist, create a new Service with this data.
     * 
    **/
    create: XOR<ServiceCreateInput, ServiceUncheckedCreateInput>
    /**
     * In case the Service was found with the provided `where` argument, update it with this data.
     * 
    **/
    update: XOR<ServiceUpdateInput, ServiceUncheckedUpdateInput>
  }


  /**
   * Service delete
   */
  export type ServiceDeleteArgs = {
    /**
     * Select specific fields to fetch from the Service
     * 
    **/
    select?: ServiceSelect | null
    /**
     * Filter which Service to delete.
     * 
    **/
    where: ServiceWhereUniqueInput
  }


  /**
   * Service deleteMany
   */
  export type ServiceDeleteManyArgs = {
    /**
     * Filter which Services to delete
     * 
    **/
    where?: ServiceWhereInput
  }


  /**
   * Service: findUniqueOrThrow
   */
  export type ServiceFindUniqueOrThrowArgs = ServiceFindUniqueArgsBase
      

  /**
   * Service: findFirstOrThrow
   */
  export type ServiceFindFirstOrThrowArgs = ServiceFindFirstArgsBase
      

  /**
   * Service without action
   */
  export type ServiceArgs = {
    /**
     * Select specific fields to fetch from the Service
     * 
    **/
    select?: ServiceSelect | null
  }



  /**
   * Model Artist
   */


  export type AggregateArtist = {
    _count: ArtistCountAggregateOutputType | null
    _avg: ArtistAvgAggregateOutputType | null
    _sum: ArtistSumAggregateOutputType | null
    _min: ArtistMinAggregateOutputType | null
    _max: ArtistMaxAggregateOutputType | null
  }

  export type ArtistAvgAggregateOutputType = {
    id: number | null
    price: number | null
  }

  export type ArtistSumAggregateOutputType = {
    id: number | null
    price: number | null
  }

  export type ArtistMinAggregateOutputType = {
    id: number | null
    name: string | null
    description: string | null
    imageUrl: string | null
    price: number | null
    phoneNumber: string | null
    email: string | null
    website: string | null
  }

  export type ArtistMaxAggregateOutputType = {
    id: number | null
    name: string | null
    description: string | null
    imageUrl: string | null
    price: number | null
    phoneNumber: string | null
    email: string | null
    website: string | null
  }

  export type ArtistCountAggregateOutputType = {
    id: number
    name: number
    description: number
    imageUrl: number
    price: number
    phoneNumber: number
    email: number
    website: number
    genres: number
    _all: number
  }


  export type ArtistAvgAggregateInputType = {
    id?: true
    price?: true
  }

  export type ArtistSumAggregateInputType = {
    id?: true
    price?: true
  }

  export type ArtistMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    imageUrl?: true
    price?: true
    phoneNumber?: true
    email?: true
    website?: true
  }

  export type ArtistMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    imageUrl?: true
    price?: true
    phoneNumber?: true
    email?: true
    website?: true
  }

  export type ArtistCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    imageUrl?: true
    price?: true
    phoneNumber?: true
    email?: true
    website?: true
    genres?: true
    _all?: true
  }

  export type ArtistAggregateArgs = {
    /**
     * Filter which Artist to aggregate.
     * 
    **/
    where?: ArtistWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Artists to fetch.
     * 
    **/
    orderBy?: Enumerable<ArtistOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     * 
    **/
    cursor?: ArtistWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Artists from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Artists.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Artists
    **/
    _count?: true | ArtistCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ArtistAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ArtistSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ArtistMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ArtistMaxAggregateInputType
  }

  export type GetArtistAggregateType<T extends ArtistAggregateArgs> = {
        [P in keyof T & keyof AggregateArtist]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateArtist[P]>
      : GetScalarType<T[P], AggregateArtist[P]>
  }




  export type ArtistGroupByArgs = {
    where?: ArtistWhereInput
    orderBy?: Enumerable<ArtistOrderByWithAggregationInput>
    by: Array<ArtistScalarFieldEnum>
    having?: ArtistScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ArtistCountAggregateInputType | true
    _avg?: ArtistAvgAggregateInputType
    _sum?: ArtistSumAggregateInputType
    _min?: ArtistMinAggregateInputType
    _max?: ArtistMaxAggregateInputType
  }


  export type ArtistGroupByOutputType = {
    id: number
    name: string
    description: string | null
    imageUrl: string | null
    price: number
    phoneNumber: string | null
    email: string | null
    website: string | null
    genres: string[]
    _count: ArtistCountAggregateOutputType | null
    _avg: ArtistAvgAggregateOutputType | null
    _sum: ArtistSumAggregateOutputType | null
    _min: ArtistMinAggregateOutputType | null
    _max: ArtistMaxAggregateOutputType | null
  }

  type GetArtistGroupByPayload<T extends ArtistGroupByArgs> = PrismaPromise<
    Array<
      PickArray<ArtistGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ArtistGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ArtistGroupByOutputType[P]>
            : GetScalarType<T[P], ArtistGroupByOutputType[P]>
        }
      >
    >


  export type ArtistSelect = {
    id?: boolean
    name?: boolean
    description?: boolean
    imageUrl?: boolean
    price?: boolean
    phoneNumber?: boolean
    email?: boolean
    website?: boolean
    genres?: boolean
  }

  export type ArtistGetPayload<
    S extends boolean | null | undefined | ArtistArgs,
    U = keyof S
      > = S extends true
        ? Artist
    : S extends undefined
    ? never
    : S extends ArtistArgs | ArtistFindManyArgs
    ?'include' extends U
    ? Artist 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]:
    P extends keyof Artist ? Artist[P] : never
  } 
    : Artist
  : Artist


  type ArtistCountArgs = Merge<
    Omit<ArtistFindManyArgs, 'select' | 'include'> & {
      select?: ArtistCountAggregateInputType | true
    }
  >

  export interface ArtistDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined> {
    /**
     * Find zero or one Artist that matches the filter.
     * @param {ArtistFindUniqueArgs} args - Arguments to find a Artist
     * @example
     * // Get one Artist
     * const artist = await prisma.artist.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends ArtistFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, ArtistFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'Artist'> extends True ? CheckSelect<T, Prisma__ArtistClient<Artist>, Prisma__ArtistClient<ArtistGetPayload<T>>> : CheckSelect<T, Prisma__ArtistClient<Artist | null >, Prisma__ArtistClient<ArtistGetPayload<T> | null >>

    /**
     * Find the first Artist that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArtistFindFirstArgs} args - Arguments to find a Artist
     * @example
     * // Get one Artist
     * const artist = await prisma.artist.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends ArtistFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, ArtistFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'Artist'> extends True ? CheckSelect<T, Prisma__ArtistClient<Artist>, Prisma__ArtistClient<ArtistGetPayload<T>>> : CheckSelect<T, Prisma__ArtistClient<Artist | null >, Prisma__ArtistClient<ArtistGetPayload<T> | null >>

    /**
     * Find zero or more Artists that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArtistFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Artists
     * const artists = await prisma.artist.findMany()
     * 
     * // Get first 10 Artists
     * const artists = await prisma.artist.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const artistWithIdOnly = await prisma.artist.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends ArtistFindManyArgs>(
      args?: SelectSubset<T, ArtistFindManyArgs>
    ): CheckSelect<T, PrismaPromise<Array<Artist>>, PrismaPromise<Array<ArtistGetPayload<T>>>>

    /**
     * Create a Artist.
     * @param {ArtistCreateArgs} args - Arguments to create a Artist.
     * @example
     * // Create one Artist
     * const Artist = await prisma.artist.create({
     *   data: {
     *     // ... data to create a Artist
     *   }
     * })
     * 
    **/
    create<T extends ArtistCreateArgs>(
      args: SelectSubset<T, ArtistCreateArgs>
    ): CheckSelect<T, Prisma__ArtistClient<Artist>, Prisma__ArtistClient<ArtistGetPayload<T>>>

    /**
     * Create many Artists.
     *     @param {ArtistCreateManyArgs} args - Arguments to create many Artists.
     *     @example
     *     // Create many Artists
     *     const artist = await prisma.artist.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends ArtistCreateManyArgs>(
      args?: SelectSubset<T, ArtistCreateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Delete a Artist.
     * @param {ArtistDeleteArgs} args - Arguments to delete one Artist.
     * @example
     * // Delete one Artist
     * const Artist = await prisma.artist.delete({
     *   where: {
     *     // ... filter to delete one Artist
     *   }
     * })
     * 
    **/
    delete<T extends ArtistDeleteArgs>(
      args: SelectSubset<T, ArtistDeleteArgs>
    ): CheckSelect<T, Prisma__ArtistClient<Artist>, Prisma__ArtistClient<ArtistGetPayload<T>>>

    /**
     * Update one Artist.
     * @param {ArtistUpdateArgs} args - Arguments to update one Artist.
     * @example
     * // Update one Artist
     * const artist = await prisma.artist.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends ArtistUpdateArgs>(
      args: SelectSubset<T, ArtistUpdateArgs>
    ): CheckSelect<T, Prisma__ArtistClient<Artist>, Prisma__ArtistClient<ArtistGetPayload<T>>>

    /**
     * Delete zero or more Artists.
     * @param {ArtistDeleteManyArgs} args - Arguments to filter Artists to delete.
     * @example
     * // Delete a few Artists
     * const { count } = await prisma.artist.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends ArtistDeleteManyArgs>(
      args?: SelectSubset<T, ArtistDeleteManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Update zero or more Artists.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArtistUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Artists
     * const artist = await prisma.artist.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends ArtistUpdateManyArgs>(
      args: SelectSubset<T, ArtistUpdateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Create or update one Artist.
     * @param {ArtistUpsertArgs} args - Arguments to update or create a Artist.
     * @example
     * // Update or create a Artist
     * const artist = await prisma.artist.upsert({
     *   create: {
     *     // ... data to create a Artist
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Artist we want to update
     *   }
     * })
    **/
    upsert<T extends ArtistUpsertArgs>(
      args: SelectSubset<T, ArtistUpsertArgs>
    ): CheckSelect<T, Prisma__ArtistClient<Artist>, Prisma__ArtistClient<ArtistGetPayload<T>>>

    /**
     * Find one Artist that matches the filter or throw
     * `NotFoundError` if no matches were found.
     * @param {ArtistFindUniqueOrThrowArgs} args - Arguments to find a Artist
     * @example
     * // Get one Artist
     * const artist = await prisma.artist.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends ArtistFindUniqueOrThrowArgs>(
      args?: SelectSubset<T, ArtistFindUniqueOrThrowArgs>
    ): CheckSelect<T, Prisma__ArtistClient<Artist>, Prisma__ArtistClient<ArtistGetPayload<T>>>

    /**
     * Find the first Artist that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArtistFindFirstOrThrowArgs} args - Arguments to find a Artist
     * @example
     * // Get one Artist
     * const artist = await prisma.artist.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends ArtistFindFirstOrThrowArgs>(
      args?: SelectSubset<T, ArtistFindFirstOrThrowArgs>
    ): CheckSelect<T, Prisma__ArtistClient<Artist>, Prisma__ArtistClient<ArtistGetPayload<T>>>

    /**
     * Count the number of Artists.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArtistCountArgs} args - Arguments to filter Artists to count.
     * @example
     * // Count the number of Artists
     * const count = await prisma.artist.count({
     *   where: {
     *     // ... the filter for the Artists we want to count
     *   }
     * })
    **/
    count<T extends ArtistCountArgs>(
      args?: Subset<T, ArtistCountArgs>,
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ArtistCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Artist.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArtistAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ArtistAggregateArgs>(args: Subset<T, ArtistAggregateArgs>): PrismaPromise<GetArtistAggregateType<T>>

    /**
     * Group by Artist.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArtistGroupByArgs} args - Group by arguments.
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
      T extends ArtistGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ArtistGroupByArgs['orderBy'] }
        : { orderBy?: ArtistGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
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
    >(args: SubsetIntersection<T, ArtistGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetArtistGroupByPayload<T> : PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for Artist.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__ArtistClient<T> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: runtime.DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';


    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * Artist base type for findUnique actions
   */
  export type ArtistFindUniqueArgsBase = {
    /**
     * Select specific fields to fetch from the Artist
     * 
    **/
    select?: ArtistSelect | null
    /**
     * Filter, which Artist to fetch.
     * 
    **/
    where: ArtistWhereUniqueInput
  }

  /**
   * Artist: findUnique
   */
  export interface ArtistFindUniqueArgs extends ArtistFindUniqueArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Artist base type for findFirst actions
   */
  export type ArtistFindFirstArgsBase = {
    /**
     * Select specific fields to fetch from the Artist
     * 
    **/
    select?: ArtistSelect | null
    /**
     * Filter, which Artist to fetch.
     * 
    **/
    where?: ArtistWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Artists to fetch.
     * 
    **/
    orderBy?: Enumerable<ArtistOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Artists.
     * 
    **/
    cursor?: ArtistWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Artists from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Artists.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Artists.
     * 
    **/
    distinct?: Enumerable<ArtistScalarFieldEnum>
  }

  /**
   * Artist: findFirst
   */
  export interface ArtistFindFirstArgs extends ArtistFindFirstArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Artist findMany
   */
  export type ArtistFindManyArgs = {
    /**
     * Select specific fields to fetch from the Artist
     * 
    **/
    select?: ArtistSelect | null
    /**
     * Filter, which Artists to fetch.
     * 
    **/
    where?: ArtistWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Artists to fetch.
     * 
    **/
    orderBy?: Enumerable<ArtistOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Artists.
     * 
    **/
    cursor?: ArtistWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Artists from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Artists.
     * 
    **/
    skip?: number
    distinct?: Enumerable<ArtistScalarFieldEnum>
  }


  /**
   * Artist create
   */
  export type ArtistCreateArgs = {
    /**
     * Select specific fields to fetch from the Artist
     * 
    **/
    select?: ArtistSelect | null
    /**
     * The data needed to create a Artist.
     * 
    **/
    data: XOR<ArtistCreateInput, ArtistUncheckedCreateInput>
  }


  /**
   * Artist createMany
   */
  export type ArtistCreateManyArgs = {
    /**
     * The data used to create many Artists.
     * 
    **/
    data: Enumerable<ArtistCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * Artist update
   */
  export type ArtistUpdateArgs = {
    /**
     * Select specific fields to fetch from the Artist
     * 
    **/
    select?: ArtistSelect | null
    /**
     * The data needed to update a Artist.
     * 
    **/
    data: XOR<ArtistUpdateInput, ArtistUncheckedUpdateInput>
    /**
     * Choose, which Artist to update.
     * 
    **/
    where: ArtistWhereUniqueInput
  }


  /**
   * Artist updateMany
   */
  export type ArtistUpdateManyArgs = {
    /**
     * The data used to update Artists.
     * 
    **/
    data: XOR<ArtistUpdateManyMutationInput, ArtistUncheckedUpdateManyInput>
    /**
     * Filter which Artists to update
     * 
    **/
    where?: ArtistWhereInput
  }


  /**
   * Artist upsert
   */
  export type ArtistUpsertArgs = {
    /**
     * Select specific fields to fetch from the Artist
     * 
    **/
    select?: ArtistSelect | null
    /**
     * The filter to search for the Artist to update in case it exists.
     * 
    **/
    where: ArtistWhereUniqueInput
    /**
     * In case the Artist found by the `where` argument doesn't exist, create a new Artist with this data.
     * 
    **/
    create: XOR<ArtistCreateInput, ArtistUncheckedCreateInput>
    /**
     * In case the Artist was found with the provided `where` argument, update it with this data.
     * 
    **/
    update: XOR<ArtistUpdateInput, ArtistUncheckedUpdateInput>
  }


  /**
   * Artist delete
   */
  export type ArtistDeleteArgs = {
    /**
     * Select specific fields to fetch from the Artist
     * 
    **/
    select?: ArtistSelect | null
    /**
     * Filter which Artist to delete.
     * 
    **/
    where: ArtistWhereUniqueInput
  }


  /**
   * Artist deleteMany
   */
  export type ArtistDeleteManyArgs = {
    /**
     * Filter which Artists to delete
     * 
    **/
    where?: ArtistWhereInput
  }


  /**
   * Artist: findUniqueOrThrow
   */
  export type ArtistFindUniqueOrThrowArgs = ArtistFindUniqueArgsBase
      

  /**
   * Artist: findFirstOrThrow
   */
  export type ArtistFindFirstOrThrowArgs = ArtistFindFirstArgsBase
      

  /**
   * Artist without action
   */
  export type ArtistArgs = {
    /**
     * Select specific fields to fetch from the Artist
     * 
    **/
    select?: ArtistSelect | null
  }



  /**
   * Enums
   */

  // Based on
  // https://github.com/microsoft/TypeScript/issues/3192#issuecomment-261720275

  export const ArtistScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    imageUrl: 'imageUrl',
    price: 'price',
    phoneNumber: 'phoneNumber',
    email: 'email',
    website: 'website',
    genres: 'genres'
  };

  export type ArtistScalarFieldEnum = (typeof ArtistScalarFieldEnum)[keyof typeof ArtistScalarFieldEnum]


  export const EventNotificationScalarFieldEnum: {
    id: 'id',
    messageTime: 'messageTime',
    message: 'message',
    eventId: 'eventId',
    sent: 'sent'
  };

  export type EventNotificationScalarFieldEnum = (typeof EventNotificationScalarFieldEnum)[keyof typeof EventNotificationScalarFieldEnum]


  export const EventScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    published: 'published',
    prices: 'prices',
    media: 'media',
    thumbnail: 'thumbnail',
    hashtags: 'hashtags',
    maxTickets: 'maxTickets',
    location: 'location',
    stripeProductId: 'stripeProductId',
    snsTopicArn: 'snsTopicArn',
    startTime: 'startTime',
    endTime: 'endTime',
    hostId: 'hostId'
  };

  export type EventScalarFieldEnum = (typeof EventScalarFieldEnum)[keyof typeof EventScalarFieldEnum]


  export const HostRoleScalarFieldEnum: {
    hostId: 'hostId',
    userId: 'userId',
    role: 'role'
  };

  export type HostRoleScalarFieldEnum = (typeof HostRoleScalarFieldEnum)[keyof typeof HostRoleScalarFieldEnum]


  export const HostScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    createdBy: 'createdBy',
    imageUrl: 'imageUrl'
  };

  export type HostScalarFieldEnum = (typeof HostScalarFieldEnum)[keyof typeof HostScalarFieldEnum]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const ServiceScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    imageUrl: 'imageUrl',
    price: 'price'
  };

  export type ServiceScalarFieldEnum = (typeof ServiceScalarFieldEnum)[keyof typeof ServiceScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const TicketScalarFieldEnum: {
    id: 'id',
    eventId: 'eventId',
    stripeSessionId: 'stripeSessionId',
    stripeChargeId: 'stripeChargeId',
    receiptUrl: 'receiptUrl',
    customerName: 'customerName',
    customerPhoneNumber: 'customerPhoneNumber',
    customerEmail: 'customerEmail',
    userId: 'userId',
    ticketQuantity: 'ticketQuantity',
    used: 'used',
    purchasedAt: 'purchasedAt'
  };

  export type TicketScalarFieldEnum = (typeof TicketScalarFieldEnum)[keyof typeof TicketScalarFieldEnum]


  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    name: 'name',
    roles: 'roles'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  /**
   * Deep Input Types
   */


  export type EventWhereInput = {
    AND?: Enumerable<EventWhereInput>
    OR?: Enumerable<EventWhereInput>
    NOT?: Enumerable<EventWhereInput>
    id?: IntFilter | number
    name?: StringFilter | string
    description?: StringNullableFilter | string | null
    published?: BoolFilter | boolean
    prices?: JsonNullableListFilter
    media?: StringNullableListFilter
    thumbnail?: StringNullableFilter | string | null
    hashtags?: StringNullableListFilter
    maxTickets?: IntFilter | number
    location?: StringFilter | string
    tickets?: TicketListRelationFilter
    stripeProductId?: StringNullableFilter | string | null
    snsTopicArn?: StringNullableFilter | string | null
    startTime?: DateTimeFilter | Date | string
    endTime?: DateTimeFilter | Date | string
    eventNotifications?: EventNotificationListRelationFilter
    hostId?: IntFilter | number
    host?: XOR<HostRelationFilter, HostWhereInput>
  }

  export type EventOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    published?: SortOrder
    prices?: SortOrder
    media?: SortOrder
    thumbnail?: SortOrder
    hashtags?: SortOrder
    maxTickets?: SortOrder
    location?: SortOrder
    tickets?: TicketOrderByRelationAggregateInput
    stripeProductId?: SortOrder
    snsTopicArn?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    eventNotifications?: EventNotificationOrderByRelationAggregateInput
    hostId?: SortOrder
    host?: HostOrderByWithRelationInput
  }

  export type EventWhereUniqueInput = {
    id?: number
  }

  export type EventOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    published?: SortOrder
    prices?: SortOrder
    media?: SortOrder
    thumbnail?: SortOrder
    hashtags?: SortOrder
    maxTickets?: SortOrder
    location?: SortOrder
    stripeProductId?: SortOrder
    snsTopicArn?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    hostId?: SortOrder
    _count?: EventCountOrderByAggregateInput
    _avg?: EventAvgOrderByAggregateInput
    _max?: EventMaxOrderByAggregateInput
    _min?: EventMinOrderByAggregateInput
    _sum?: EventSumOrderByAggregateInput
  }

  export type EventScalarWhereWithAggregatesInput = {
    AND?: Enumerable<EventScalarWhereWithAggregatesInput>
    OR?: Enumerable<EventScalarWhereWithAggregatesInput>
    NOT?: Enumerable<EventScalarWhereWithAggregatesInput>
    id?: IntWithAggregatesFilter | number
    name?: StringWithAggregatesFilter | string
    description?: StringNullableWithAggregatesFilter | string | null
    published?: BoolWithAggregatesFilter | boolean
    prices?: JsonNullableListFilter
    media?: StringNullableListFilter
    thumbnail?: StringNullableWithAggregatesFilter | string | null
    hashtags?: StringNullableListFilter
    maxTickets?: IntWithAggregatesFilter | number
    location?: StringWithAggregatesFilter | string
    stripeProductId?: StringNullableWithAggregatesFilter | string | null
    snsTopicArn?: StringNullableWithAggregatesFilter | string | null
    startTime?: DateTimeWithAggregatesFilter | Date | string
    endTime?: DateTimeWithAggregatesFilter | Date | string
    hostId?: IntWithAggregatesFilter | number
  }

  export type EventNotificationWhereInput = {
    AND?: Enumerable<EventNotificationWhereInput>
    OR?: Enumerable<EventNotificationWhereInput>
    NOT?: Enumerable<EventNotificationWhereInput>
    id?: IntFilter | number
    messageTime?: DateTimeFilter | Date | string
    message?: StringFilter | string
    eventId?: IntFilter | number
    event?: XOR<EventRelationFilter, EventWhereInput>
    sent?: BoolFilter | boolean
  }

  export type EventNotificationOrderByWithRelationInput = {
    id?: SortOrder
    messageTime?: SortOrder
    message?: SortOrder
    eventId?: SortOrder
    event?: EventOrderByWithRelationInput
    sent?: SortOrder
  }

  export type EventNotificationWhereUniqueInput = {
    id?: number
  }

  export type EventNotificationOrderByWithAggregationInput = {
    id?: SortOrder
    messageTime?: SortOrder
    message?: SortOrder
    eventId?: SortOrder
    sent?: SortOrder
    _count?: EventNotificationCountOrderByAggregateInput
    _avg?: EventNotificationAvgOrderByAggregateInput
    _max?: EventNotificationMaxOrderByAggregateInput
    _min?: EventNotificationMinOrderByAggregateInput
    _sum?: EventNotificationSumOrderByAggregateInput
  }

  export type EventNotificationScalarWhereWithAggregatesInput = {
    AND?: Enumerable<EventNotificationScalarWhereWithAggregatesInput>
    OR?: Enumerable<EventNotificationScalarWhereWithAggregatesInput>
    NOT?: Enumerable<EventNotificationScalarWhereWithAggregatesInput>
    id?: IntWithAggregatesFilter | number
    messageTime?: DateTimeWithAggregatesFilter | Date | string
    message?: StringWithAggregatesFilter | string
    eventId?: IntWithAggregatesFilter | number
    sent?: BoolWithAggregatesFilter | boolean
  }

  export type UserWhereInput = {
    AND?: Enumerable<UserWhereInput>
    OR?: Enumerable<UserWhereInput>
    NOT?: Enumerable<UserWhereInput>
    id?: StringFilter | string
    email?: StringFilter | string
    name?: StringNullableFilter | string | null
    roles?: StringNullableListFilter
    hostRoles?: HostRoleListRelationFilter
    tickets?: TicketListRelationFilter
    hosts?: HostListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    roles?: SortOrder
    hostRoles?: HostRoleOrderByRelationAggregateInput
    tickets?: TicketOrderByRelationAggregateInput
    hosts?: HostOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = {
    id?: string
    email?: string
  }

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    roles?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: Enumerable<UserScalarWhereWithAggregatesInput>
    OR?: Enumerable<UserScalarWhereWithAggregatesInput>
    NOT?: Enumerable<UserScalarWhereWithAggregatesInput>
    id?: StringWithAggregatesFilter | string
    email?: StringWithAggregatesFilter | string
    name?: StringNullableWithAggregatesFilter | string | null
    roles?: StringNullableListFilter
  }

  export type HostWhereInput = {
    AND?: Enumerable<HostWhereInput>
    OR?: Enumerable<HostWhereInput>
    NOT?: Enumerable<HostWhereInput>
    id?: IntFilter | number
    name?: StringFilter | string
    description?: StringNullableFilter | string | null
    events?: EventListRelationFilter
    hostRoles?: HostRoleListRelationFilter
    createdBy?: StringFilter | string
    creator?: XOR<UserRelationFilter, UserWhereInput>
    imageUrl?: StringNullableFilter | string | null
  }

  export type HostOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    events?: EventOrderByRelationAggregateInput
    hostRoles?: HostRoleOrderByRelationAggregateInput
    createdBy?: SortOrder
    creator?: UserOrderByWithRelationInput
    imageUrl?: SortOrder
  }

  export type HostWhereUniqueInput = {
    id?: number
  }

  export type HostOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    createdBy?: SortOrder
    imageUrl?: SortOrder
    _count?: HostCountOrderByAggregateInput
    _avg?: HostAvgOrderByAggregateInput
    _max?: HostMaxOrderByAggregateInput
    _min?: HostMinOrderByAggregateInput
    _sum?: HostSumOrderByAggregateInput
  }

  export type HostScalarWhereWithAggregatesInput = {
    AND?: Enumerable<HostScalarWhereWithAggregatesInput>
    OR?: Enumerable<HostScalarWhereWithAggregatesInput>
    NOT?: Enumerable<HostScalarWhereWithAggregatesInput>
    id?: IntWithAggregatesFilter | number
    name?: StringWithAggregatesFilter | string
    description?: StringNullableWithAggregatesFilter | string | null
    createdBy?: StringWithAggregatesFilter | string
    imageUrl?: StringNullableWithAggregatesFilter | string | null
  }

  export type HostRoleWhereInput = {
    AND?: Enumerable<HostRoleWhereInput>
    OR?: Enumerable<HostRoleWhereInput>
    NOT?: Enumerable<HostRoleWhereInput>
    hostId?: IntFilter | number
    host?: XOR<HostRelationFilter, HostWhereInput>
    userId?: StringFilter | string
    user?: XOR<UserRelationFilter, UserWhereInput>
    role?: StringFilter | string
  }

  export type HostRoleOrderByWithRelationInput = {
    hostId?: SortOrder
    host?: HostOrderByWithRelationInput
    userId?: SortOrder
    user?: UserOrderByWithRelationInput
    role?: SortOrder
  }

  export type HostRoleWhereUniqueInput = {
    hostId_userId?: HostRoleHostIdUserIdCompoundUniqueInput
  }

  export type HostRoleOrderByWithAggregationInput = {
    hostId?: SortOrder
    userId?: SortOrder
    role?: SortOrder
    _count?: HostRoleCountOrderByAggregateInput
    _avg?: HostRoleAvgOrderByAggregateInput
    _max?: HostRoleMaxOrderByAggregateInput
    _min?: HostRoleMinOrderByAggregateInput
    _sum?: HostRoleSumOrderByAggregateInput
  }

  export type HostRoleScalarWhereWithAggregatesInput = {
    AND?: Enumerable<HostRoleScalarWhereWithAggregatesInput>
    OR?: Enumerable<HostRoleScalarWhereWithAggregatesInput>
    NOT?: Enumerable<HostRoleScalarWhereWithAggregatesInput>
    hostId?: IntWithAggregatesFilter | number
    userId?: StringWithAggregatesFilter | string
    role?: StringWithAggregatesFilter | string
  }

  export type TicketWhereInput = {
    AND?: Enumerable<TicketWhereInput>
    OR?: Enumerable<TicketWhereInput>
    NOT?: Enumerable<TicketWhereInput>
    id?: IntFilter | number
    eventId?: IntFilter | number
    event?: XOR<EventRelationFilter, EventWhereInput>
    stripeSessionId?: StringFilter | string
    stripeChargeId?: StringFilter | string
    receiptUrl?: StringFilter | string
    customerName?: StringFilter | string
    customerPhoneNumber?: StringFilter | string
    customerEmail?: StringFilter | string
    userId?: StringNullableFilter | string | null
    user?: XOR<UserRelationFilter, UserWhereInput> | null
    ticketQuantity?: IntFilter | number
    used?: BoolFilter | boolean
    purchasedAt?: DateTimeFilter | Date | string
  }

  export type TicketOrderByWithRelationInput = {
    id?: SortOrder
    eventId?: SortOrder
    event?: EventOrderByWithRelationInput
    stripeSessionId?: SortOrder
    stripeChargeId?: SortOrder
    receiptUrl?: SortOrder
    customerName?: SortOrder
    customerPhoneNumber?: SortOrder
    customerEmail?: SortOrder
    userId?: SortOrder
    user?: UserOrderByWithRelationInput
    ticketQuantity?: SortOrder
    used?: SortOrder
    purchasedAt?: SortOrder
  }

  export type TicketWhereUniqueInput = {
    id?: number
  }

  export type TicketOrderByWithAggregationInput = {
    id?: SortOrder
    eventId?: SortOrder
    stripeSessionId?: SortOrder
    stripeChargeId?: SortOrder
    receiptUrl?: SortOrder
    customerName?: SortOrder
    customerPhoneNumber?: SortOrder
    customerEmail?: SortOrder
    userId?: SortOrder
    ticketQuantity?: SortOrder
    used?: SortOrder
    purchasedAt?: SortOrder
    _count?: TicketCountOrderByAggregateInput
    _avg?: TicketAvgOrderByAggregateInput
    _max?: TicketMaxOrderByAggregateInput
    _min?: TicketMinOrderByAggregateInput
    _sum?: TicketSumOrderByAggregateInput
  }

  export type TicketScalarWhereWithAggregatesInput = {
    AND?: Enumerable<TicketScalarWhereWithAggregatesInput>
    OR?: Enumerable<TicketScalarWhereWithAggregatesInput>
    NOT?: Enumerable<TicketScalarWhereWithAggregatesInput>
    id?: IntWithAggregatesFilter | number
    eventId?: IntWithAggregatesFilter | number
    stripeSessionId?: StringWithAggregatesFilter | string
    stripeChargeId?: StringWithAggregatesFilter | string
    receiptUrl?: StringWithAggregatesFilter | string
    customerName?: StringWithAggregatesFilter | string
    customerPhoneNumber?: StringWithAggregatesFilter | string
    customerEmail?: StringWithAggregatesFilter | string
    userId?: StringNullableWithAggregatesFilter | string | null
    ticketQuantity?: IntWithAggregatesFilter | number
    used?: BoolWithAggregatesFilter | boolean
    purchasedAt?: DateTimeWithAggregatesFilter | Date | string
  }

  export type ServiceWhereInput = {
    AND?: Enumerable<ServiceWhereInput>
    OR?: Enumerable<ServiceWhereInput>
    NOT?: Enumerable<ServiceWhereInput>
    id?: IntFilter | number
    name?: StringFilter | string
    description?: StringNullableFilter | string | null
    imageUrl?: StringNullableFilter | string | null
    price?: FloatFilter | number
  }

  export type ServiceOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    imageUrl?: SortOrder
    price?: SortOrder
  }

  export type ServiceWhereUniqueInput = {
    id?: number
  }

  export type ServiceOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    imageUrl?: SortOrder
    price?: SortOrder
    _count?: ServiceCountOrderByAggregateInput
    _avg?: ServiceAvgOrderByAggregateInput
    _max?: ServiceMaxOrderByAggregateInput
    _min?: ServiceMinOrderByAggregateInput
    _sum?: ServiceSumOrderByAggregateInput
  }

  export type ServiceScalarWhereWithAggregatesInput = {
    AND?: Enumerable<ServiceScalarWhereWithAggregatesInput>
    OR?: Enumerable<ServiceScalarWhereWithAggregatesInput>
    NOT?: Enumerable<ServiceScalarWhereWithAggregatesInput>
    id?: IntWithAggregatesFilter | number
    name?: StringWithAggregatesFilter | string
    description?: StringNullableWithAggregatesFilter | string | null
    imageUrl?: StringNullableWithAggregatesFilter | string | null
    price?: FloatWithAggregatesFilter | number
  }

  export type ArtistWhereInput = {
    AND?: Enumerable<ArtistWhereInput>
    OR?: Enumerable<ArtistWhereInput>
    NOT?: Enumerable<ArtistWhereInput>
    id?: IntFilter | number
    name?: StringFilter | string
    description?: StringNullableFilter | string | null
    imageUrl?: StringNullableFilter | string | null
    price?: IntFilter | number
    phoneNumber?: StringNullableFilter | string | null
    email?: StringNullableFilter | string | null
    website?: StringNullableFilter | string | null
    genres?: StringNullableListFilter
  }

  export type ArtistOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    imageUrl?: SortOrder
    price?: SortOrder
    phoneNumber?: SortOrder
    email?: SortOrder
    website?: SortOrder
    genres?: SortOrder
  }

  export type ArtistWhereUniqueInput = {
    id?: number
  }

  export type ArtistOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    imageUrl?: SortOrder
    price?: SortOrder
    phoneNumber?: SortOrder
    email?: SortOrder
    website?: SortOrder
    genres?: SortOrder
    _count?: ArtistCountOrderByAggregateInput
    _avg?: ArtistAvgOrderByAggregateInput
    _max?: ArtistMaxOrderByAggregateInput
    _min?: ArtistMinOrderByAggregateInput
    _sum?: ArtistSumOrderByAggregateInput
  }

  export type ArtistScalarWhereWithAggregatesInput = {
    AND?: Enumerable<ArtistScalarWhereWithAggregatesInput>
    OR?: Enumerable<ArtistScalarWhereWithAggregatesInput>
    NOT?: Enumerable<ArtistScalarWhereWithAggregatesInput>
    id?: IntWithAggregatesFilter | number
    name?: StringWithAggregatesFilter | string
    description?: StringNullableWithAggregatesFilter | string | null
    imageUrl?: StringNullableWithAggregatesFilter | string | null
    price?: IntWithAggregatesFilter | number
    phoneNumber?: StringNullableWithAggregatesFilter | string | null
    email?: StringNullableWithAggregatesFilter | string | null
    website?: StringNullableWithAggregatesFilter | string | null
    genres?: StringNullableListFilter
  }

  export type EventCreateInput = {
    name?: string
    description?: string | null
    published?: boolean
    prices?: EventCreatepricesInput | Enumerable<InputJsonValue>
    media?: EventCreatemediaInput | Enumerable<string>
    thumbnail?: string | null
    hashtags?: EventCreatehashtagsInput | Enumerable<string>
    maxTickets?: number
    location?: string
    tickets?: TicketCreateNestedManyWithoutEventInput
    stripeProductId?: string | null
    snsTopicArn?: string | null
    startTime: Date | string
    endTime: Date | string
    eventNotifications?: EventNotificationCreateNestedManyWithoutEventInput
    host: HostCreateNestedOneWithoutEventsInput
  }

  export type EventUncheckedCreateInput = {
    id?: number
    name?: string
    description?: string | null
    published?: boolean
    prices?: EventCreatepricesInput | Enumerable<InputJsonValue>
    media?: EventCreatemediaInput | Enumerable<string>
    thumbnail?: string | null
    hashtags?: EventCreatehashtagsInput | Enumerable<string>
    maxTickets?: number
    location?: string
    tickets?: TicketUncheckedCreateNestedManyWithoutEventInput
    stripeProductId?: string | null
    snsTopicArn?: string | null
    startTime: Date | string
    endTime: Date | string
    eventNotifications?: EventNotificationUncheckedCreateNestedManyWithoutEventInput
    hostId: number
  }

  export type EventUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    published?: BoolFieldUpdateOperationsInput | boolean
    prices?: EventUpdatepricesInput | Enumerable<InputJsonValue>
    media?: EventUpdatemediaInput | Enumerable<string>
    thumbnail?: NullableStringFieldUpdateOperationsInput | string | null
    hashtags?: EventUpdatehashtagsInput | Enumerable<string>
    maxTickets?: IntFieldUpdateOperationsInput | number
    location?: StringFieldUpdateOperationsInput | string
    tickets?: TicketUpdateManyWithoutEventNestedInput
    stripeProductId?: NullableStringFieldUpdateOperationsInput | string | null
    snsTopicArn?: NullableStringFieldUpdateOperationsInput | string | null
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    eventNotifications?: EventNotificationUpdateManyWithoutEventNestedInput
    host?: HostUpdateOneRequiredWithoutEventsNestedInput
  }

  export type EventUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    published?: BoolFieldUpdateOperationsInput | boolean
    prices?: EventUpdatepricesInput | Enumerable<InputJsonValue>
    media?: EventUpdatemediaInput | Enumerable<string>
    thumbnail?: NullableStringFieldUpdateOperationsInput | string | null
    hashtags?: EventUpdatehashtagsInput | Enumerable<string>
    maxTickets?: IntFieldUpdateOperationsInput | number
    location?: StringFieldUpdateOperationsInput | string
    tickets?: TicketUncheckedUpdateManyWithoutEventNestedInput
    stripeProductId?: NullableStringFieldUpdateOperationsInput | string | null
    snsTopicArn?: NullableStringFieldUpdateOperationsInput | string | null
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    eventNotifications?: EventNotificationUncheckedUpdateManyWithoutEventNestedInput
    hostId?: IntFieldUpdateOperationsInput | number
  }

  export type EventCreateManyInput = {
    id?: number
    name?: string
    description?: string | null
    published?: boolean
    prices?: EventCreatepricesInput | Enumerable<InputJsonValue>
    media?: EventCreatemediaInput | Enumerable<string>
    thumbnail?: string | null
    hashtags?: EventCreatehashtagsInput | Enumerable<string>
    maxTickets?: number
    location?: string
    stripeProductId?: string | null
    snsTopicArn?: string | null
    startTime: Date | string
    endTime: Date | string
    hostId: number
  }

  export type EventUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    published?: BoolFieldUpdateOperationsInput | boolean
    prices?: EventUpdatepricesInput | Enumerable<InputJsonValue>
    media?: EventUpdatemediaInput | Enumerable<string>
    thumbnail?: NullableStringFieldUpdateOperationsInput | string | null
    hashtags?: EventUpdatehashtagsInput | Enumerable<string>
    maxTickets?: IntFieldUpdateOperationsInput | number
    location?: StringFieldUpdateOperationsInput | string
    stripeProductId?: NullableStringFieldUpdateOperationsInput | string | null
    snsTopicArn?: NullableStringFieldUpdateOperationsInput | string | null
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    published?: BoolFieldUpdateOperationsInput | boolean
    prices?: EventUpdatepricesInput | Enumerable<InputJsonValue>
    media?: EventUpdatemediaInput | Enumerable<string>
    thumbnail?: NullableStringFieldUpdateOperationsInput | string | null
    hashtags?: EventUpdatehashtagsInput | Enumerable<string>
    maxTickets?: IntFieldUpdateOperationsInput | number
    location?: StringFieldUpdateOperationsInput | string
    stripeProductId?: NullableStringFieldUpdateOperationsInput | string | null
    snsTopicArn?: NullableStringFieldUpdateOperationsInput | string | null
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    hostId?: IntFieldUpdateOperationsInput | number
  }

  export type EventNotificationCreateInput = {
    messageTime: Date | string
    message: string
    event: EventCreateNestedOneWithoutEventNotificationsInput
    sent?: boolean
  }

  export type EventNotificationUncheckedCreateInput = {
    id?: number
    messageTime: Date | string
    message: string
    eventId: number
    sent?: boolean
  }

  export type EventNotificationUpdateInput = {
    messageTime?: DateTimeFieldUpdateOperationsInput | Date | string
    message?: StringFieldUpdateOperationsInput | string
    event?: EventUpdateOneRequiredWithoutEventNotificationsNestedInput
    sent?: BoolFieldUpdateOperationsInput | boolean
  }

  export type EventNotificationUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    messageTime?: DateTimeFieldUpdateOperationsInput | Date | string
    message?: StringFieldUpdateOperationsInput | string
    eventId?: IntFieldUpdateOperationsInput | number
    sent?: BoolFieldUpdateOperationsInput | boolean
  }

  export type EventNotificationCreateManyInput = {
    id?: number
    messageTime: Date | string
    message: string
    eventId: number
    sent?: boolean
  }

  export type EventNotificationUpdateManyMutationInput = {
    messageTime?: DateTimeFieldUpdateOperationsInput | Date | string
    message?: StringFieldUpdateOperationsInput | string
    sent?: BoolFieldUpdateOperationsInput | boolean
  }

  export type EventNotificationUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    messageTime?: DateTimeFieldUpdateOperationsInput | Date | string
    message?: StringFieldUpdateOperationsInput | string
    eventId?: IntFieldUpdateOperationsInput | number
    sent?: BoolFieldUpdateOperationsInput | boolean
  }

  export type UserCreateInput = {
    id: string
    email: string
    name?: string | null
    roles?: UserCreaterolesInput | Enumerable<string>
    hostRoles?: HostRoleCreateNestedManyWithoutUserInput
    tickets?: TicketCreateNestedManyWithoutUserInput
    hosts?: HostCreateNestedManyWithoutCreatorInput
  }

  export type UserUncheckedCreateInput = {
    id: string
    email: string
    name?: string | null
    roles?: UserCreaterolesInput | Enumerable<string>
    hostRoles?: HostRoleUncheckedCreateNestedManyWithoutUserInput
    tickets?: TicketUncheckedCreateNestedManyWithoutUserInput
    hosts?: HostUncheckedCreateNestedManyWithoutCreatorInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    roles?: UserUpdaterolesInput | Enumerable<string>
    hostRoles?: HostRoleUpdateManyWithoutUserNestedInput
    tickets?: TicketUpdateManyWithoutUserNestedInput
    hosts?: HostUpdateManyWithoutCreatorNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    roles?: UserUpdaterolesInput | Enumerable<string>
    hostRoles?: HostRoleUncheckedUpdateManyWithoutUserNestedInput
    tickets?: TicketUncheckedUpdateManyWithoutUserNestedInput
    hosts?: HostUncheckedUpdateManyWithoutCreatorNestedInput
  }

  export type UserCreateManyInput = {
    id: string
    email: string
    name?: string | null
    roles?: UserCreaterolesInput | Enumerable<string>
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    roles?: UserUpdaterolesInput | Enumerable<string>
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    roles?: UserUpdaterolesInput | Enumerable<string>
  }

  export type HostCreateInput = {
    name?: string
    description?: string | null
    events?: EventCreateNestedManyWithoutHostInput
    hostRoles?: HostRoleCreateNestedManyWithoutHostInput
    creator: UserCreateNestedOneWithoutHostsInput
    imageUrl?: string | null
  }

  export type HostUncheckedCreateInput = {
    id?: number
    name?: string
    description?: string | null
    events?: EventUncheckedCreateNestedManyWithoutHostInput
    hostRoles?: HostRoleUncheckedCreateNestedManyWithoutHostInput
    createdBy: string
    imageUrl?: string | null
  }

  export type HostUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    events?: EventUpdateManyWithoutHostNestedInput
    hostRoles?: HostRoleUpdateManyWithoutHostNestedInput
    creator?: UserUpdateOneRequiredWithoutHostsNestedInput
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type HostUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    events?: EventUncheckedUpdateManyWithoutHostNestedInput
    hostRoles?: HostRoleUncheckedUpdateManyWithoutHostNestedInput
    createdBy?: StringFieldUpdateOperationsInput | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type HostCreateManyInput = {
    id?: number
    name?: string
    description?: string | null
    createdBy: string
    imageUrl?: string | null
  }

  export type HostUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type HostUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type HostRoleCreateInput = {
    host: HostCreateNestedOneWithoutHostRolesInput
    user: UserCreateNestedOneWithoutHostRolesInput
    role: string
  }

  export type HostRoleUncheckedCreateInput = {
    hostId: number
    userId: string
    role: string
  }

  export type HostRoleUpdateInput = {
    host?: HostUpdateOneRequiredWithoutHostRolesNestedInput
    user?: UserUpdateOneRequiredWithoutHostRolesNestedInput
    role?: StringFieldUpdateOperationsInput | string
  }

  export type HostRoleUncheckedUpdateInput = {
    hostId?: IntFieldUpdateOperationsInput | number
    userId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
  }

  export type HostRoleCreateManyInput = {
    hostId: number
    userId: string
    role: string
  }

  export type HostRoleUpdateManyMutationInput = {
    role?: StringFieldUpdateOperationsInput | string
  }

  export type HostRoleUncheckedUpdateManyInput = {
    hostId?: IntFieldUpdateOperationsInput | number
    userId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
  }

  export type TicketCreateInput = {
    event: EventCreateNestedOneWithoutTicketsInput
    stripeSessionId: string
    stripeChargeId: string
    receiptUrl: string
    customerName: string
    customerPhoneNumber: string
    customerEmail: string
    user?: UserCreateNestedOneWithoutTicketsInput
    ticketQuantity: number
    used: boolean
    purchasedAt?: Date | string
  }

  export type TicketUncheckedCreateInput = {
    id?: number
    eventId: number
    stripeSessionId: string
    stripeChargeId: string
    receiptUrl: string
    customerName: string
    customerPhoneNumber: string
    customerEmail: string
    userId?: string | null
    ticketQuantity: number
    used: boolean
    purchasedAt?: Date | string
  }

  export type TicketUpdateInput = {
    event?: EventUpdateOneRequiredWithoutTicketsNestedInput
    stripeSessionId?: StringFieldUpdateOperationsInput | string
    stripeChargeId?: StringFieldUpdateOperationsInput | string
    receiptUrl?: StringFieldUpdateOperationsInput | string
    customerName?: StringFieldUpdateOperationsInput | string
    customerPhoneNumber?: StringFieldUpdateOperationsInput | string
    customerEmail?: StringFieldUpdateOperationsInput | string
    user?: UserUpdateOneWithoutTicketsNestedInput
    ticketQuantity?: IntFieldUpdateOperationsInput | number
    used?: BoolFieldUpdateOperationsInput | boolean
    purchasedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TicketUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    eventId?: IntFieldUpdateOperationsInput | number
    stripeSessionId?: StringFieldUpdateOperationsInput | string
    stripeChargeId?: StringFieldUpdateOperationsInput | string
    receiptUrl?: StringFieldUpdateOperationsInput | string
    customerName?: StringFieldUpdateOperationsInput | string
    customerPhoneNumber?: StringFieldUpdateOperationsInput | string
    customerEmail?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    ticketQuantity?: IntFieldUpdateOperationsInput | number
    used?: BoolFieldUpdateOperationsInput | boolean
    purchasedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TicketCreateManyInput = {
    id?: number
    eventId: number
    stripeSessionId: string
    stripeChargeId: string
    receiptUrl: string
    customerName: string
    customerPhoneNumber: string
    customerEmail: string
    userId?: string | null
    ticketQuantity: number
    used: boolean
    purchasedAt?: Date | string
  }

  export type TicketUpdateManyMutationInput = {
    stripeSessionId?: StringFieldUpdateOperationsInput | string
    stripeChargeId?: StringFieldUpdateOperationsInput | string
    receiptUrl?: StringFieldUpdateOperationsInput | string
    customerName?: StringFieldUpdateOperationsInput | string
    customerPhoneNumber?: StringFieldUpdateOperationsInput | string
    customerEmail?: StringFieldUpdateOperationsInput | string
    ticketQuantity?: IntFieldUpdateOperationsInput | number
    used?: BoolFieldUpdateOperationsInput | boolean
    purchasedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TicketUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    eventId?: IntFieldUpdateOperationsInput | number
    stripeSessionId?: StringFieldUpdateOperationsInput | string
    stripeChargeId?: StringFieldUpdateOperationsInput | string
    receiptUrl?: StringFieldUpdateOperationsInput | string
    customerName?: StringFieldUpdateOperationsInput | string
    customerPhoneNumber?: StringFieldUpdateOperationsInput | string
    customerEmail?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    ticketQuantity?: IntFieldUpdateOperationsInput | number
    used?: BoolFieldUpdateOperationsInput | boolean
    purchasedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ServiceCreateInput = {
    name: string
    description?: string | null
    imageUrl?: string | null
    price: number
  }

  export type ServiceUncheckedCreateInput = {
    id?: number
    name: string
    description?: string | null
    imageUrl?: string | null
    price: number
  }

  export type ServiceUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    price?: FloatFieldUpdateOperationsInput | number
  }

  export type ServiceUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    price?: FloatFieldUpdateOperationsInput | number
  }

  export type ServiceCreateManyInput = {
    id?: number
    name: string
    description?: string | null
    imageUrl?: string | null
    price: number
  }

  export type ServiceUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    price?: FloatFieldUpdateOperationsInput | number
  }

  export type ServiceUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    price?: FloatFieldUpdateOperationsInput | number
  }

  export type ArtistCreateInput = {
    name: string
    description?: string | null
    imageUrl?: string | null
    price: number
    phoneNumber?: string | null
    email?: string | null
    website?: string | null
    genres?: ArtistCreategenresInput | Enumerable<string>
  }

  export type ArtistUncheckedCreateInput = {
    id?: number
    name: string
    description?: string | null
    imageUrl?: string | null
    price: number
    phoneNumber?: string | null
    email?: string | null
    website?: string | null
    genres?: ArtistCreategenresInput | Enumerable<string>
  }

  export type ArtistUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    price?: IntFieldUpdateOperationsInput | number
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    genres?: ArtistUpdategenresInput | Enumerable<string>
  }

  export type ArtistUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    price?: IntFieldUpdateOperationsInput | number
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    genres?: ArtistUpdategenresInput | Enumerable<string>
  }

  export type ArtistCreateManyInput = {
    id?: number
    name: string
    description?: string | null
    imageUrl?: string | null
    price: number
    phoneNumber?: string | null
    email?: string | null
    website?: string | null
    genres?: ArtistCreategenresInput | Enumerable<string>
  }

  export type ArtistUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    price?: IntFieldUpdateOperationsInput | number
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    genres?: ArtistUpdategenresInput | Enumerable<string>
  }

  export type ArtistUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    price?: IntFieldUpdateOperationsInput | number
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    genres?: ArtistUpdategenresInput | Enumerable<string>
  }

  export type IntFilter = {
    equals?: number
    in?: Enumerable<number>
    notIn?: Enumerable<number>
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntFilter | number
  }

  export type StringFilter = {
    equals?: string
    in?: Enumerable<string>
    notIn?: Enumerable<string>
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    mode?: QueryMode
    not?: NestedStringFilter | string
  }

  export type StringNullableFilter = {
    equals?: string | null
    in?: Enumerable<string> | null
    notIn?: Enumerable<string> | null
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    mode?: QueryMode
    not?: NestedStringNullableFilter | string | null
  }

  export type BoolFilter = {
    equals?: boolean
    not?: NestedBoolFilter | boolean
  }
  export type JsonNullableListFilter = 
    | PatchUndefined<
        Either<Required<JsonNullableListFilterBase>, Exclude<keyof Required<JsonNullableListFilterBase>, 'path'>>,
        Required<JsonNullableListFilterBase>
      >
    | OptionalFlat<Omit<Required<JsonNullableListFilterBase>, 'path'>>

  export type JsonNullableListFilterBase = {
    equals?: Enumerable<InputJsonValue> | null
    has?: InputJsonValue | null
    hasEvery?: Enumerable<InputJsonValue>
    hasSome?: Enumerable<InputJsonValue>
    isEmpty?: boolean
  }

  export type StringNullableListFilter = {
    equals?: Enumerable<string> | null
    has?: string | null
    hasEvery?: Enumerable<string>
    hasSome?: Enumerable<string>
    isEmpty?: boolean
  }

  export type TicketListRelationFilter = {
    every?: TicketWhereInput
    some?: TicketWhereInput
    none?: TicketWhereInput
  }

  export type DateTimeFilter = {
    equals?: Date | string
    in?: Enumerable<Date> | Enumerable<string>
    notIn?: Enumerable<Date> | Enumerable<string>
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeFilter | Date | string
  }

  export type EventNotificationListRelationFilter = {
    every?: EventNotificationWhereInput
    some?: EventNotificationWhereInput
    none?: EventNotificationWhereInput
  }

  export type HostRelationFilter = {
    is?: HostWhereInput
    isNot?: HostWhereInput
  }

  export type TicketOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type EventNotificationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type EventCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    published?: SortOrder
    prices?: SortOrder
    media?: SortOrder
    thumbnail?: SortOrder
    hashtags?: SortOrder
    maxTickets?: SortOrder
    location?: SortOrder
    stripeProductId?: SortOrder
    snsTopicArn?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    hostId?: SortOrder
  }

  export type EventAvgOrderByAggregateInput = {
    id?: SortOrder
    maxTickets?: SortOrder
    hostId?: SortOrder
  }

  export type EventMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    published?: SortOrder
    thumbnail?: SortOrder
    maxTickets?: SortOrder
    location?: SortOrder
    stripeProductId?: SortOrder
    snsTopicArn?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    hostId?: SortOrder
  }

  export type EventMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    published?: SortOrder
    thumbnail?: SortOrder
    maxTickets?: SortOrder
    location?: SortOrder
    stripeProductId?: SortOrder
    snsTopicArn?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    hostId?: SortOrder
  }

  export type EventSumOrderByAggregateInput = {
    id?: SortOrder
    maxTickets?: SortOrder
    hostId?: SortOrder
  }

  export type IntWithAggregatesFilter = {
    equals?: number
    in?: Enumerable<number>
    notIn?: Enumerable<number>
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntWithAggregatesFilter | number
    _count?: NestedIntFilter
    _avg?: NestedFloatFilter
    _sum?: NestedIntFilter
    _min?: NestedIntFilter
    _max?: NestedIntFilter
  }

  export type StringWithAggregatesFilter = {
    equals?: string
    in?: Enumerable<string>
    notIn?: Enumerable<string>
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter | string
    _count?: NestedIntFilter
    _min?: NestedStringFilter
    _max?: NestedStringFilter
  }

  export type StringNullableWithAggregatesFilter = {
    equals?: string | null
    in?: Enumerable<string> | null
    notIn?: Enumerable<string> | null
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter | string | null
    _count?: NestedIntNullableFilter
    _min?: NestedStringNullableFilter
    _max?: NestedStringNullableFilter
  }

  export type BoolWithAggregatesFilter = {
    equals?: boolean
    not?: NestedBoolWithAggregatesFilter | boolean
    _count?: NestedIntFilter
    _min?: NestedBoolFilter
    _max?: NestedBoolFilter
  }

  export type DateTimeWithAggregatesFilter = {
    equals?: Date | string
    in?: Enumerable<Date> | Enumerable<string>
    notIn?: Enumerable<Date> | Enumerable<string>
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeWithAggregatesFilter | Date | string
    _count?: NestedIntFilter
    _min?: NestedDateTimeFilter
    _max?: NestedDateTimeFilter
  }

  export type EventRelationFilter = {
    is?: EventWhereInput
    isNot?: EventWhereInput
  }

  export type EventNotificationCountOrderByAggregateInput = {
    id?: SortOrder
    messageTime?: SortOrder
    message?: SortOrder
    eventId?: SortOrder
    sent?: SortOrder
  }

  export type EventNotificationAvgOrderByAggregateInput = {
    id?: SortOrder
    eventId?: SortOrder
  }

  export type EventNotificationMaxOrderByAggregateInput = {
    id?: SortOrder
    messageTime?: SortOrder
    message?: SortOrder
    eventId?: SortOrder
    sent?: SortOrder
  }

  export type EventNotificationMinOrderByAggregateInput = {
    id?: SortOrder
    messageTime?: SortOrder
    message?: SortOrder
    eventId?: SortOrder
    sent?: SortOrder
  }

  export type EventNotificationSumOrderByAggregateInput = {
    id?: SortOrder
    eventId?: SortOrder
  }

  export type HostRoleListRelationFilter = {
    every?: HostRoleWhereInput
    some?: HostRoleWhereInput
    none?: HostRoleWhereInput
  }

  export type HostListRelationFilter = {
    every?: HostWhereInput
    some?: HostWhereInput
    none?: HostWhereInput
  }

  export type HostRoleOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type HostOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    roles?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
  }

  export type EventListRelationFilter = {
    every?: EventWhereInput
    some?: EventWhereInput
    none?: EventWhereInput
  }

  export type UserRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type EventOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type HostCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    createdBy?: SortOrder
    imageUrl?: SortOrder
  }

  export type HostAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type HostMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    createdBy?: SortOrder
    imageUrl?: SortOrder
  }

  export type HostMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    createdBy?: SortOrder
    imageUrl?: SortOrder
  }

  export type HostSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type HostRoleHostIdUserIdCompoundUniqueInput = {
    hostId: number
    userId: string
  }

  export type HostRoleCountOrderByAggregateInput = {
    hostId?: SortOrder
    userId?: SortOrder
    role?: SortOrder
  }

  export type HostRoleAvgOrderByAggregateInput = {
    hostId?: SortOrder
  }

  export type HostRoleMaxOrderByAggregateInput = {
    hostId?: SortOrder
    userId?: SortOrder
    role?: SortOrder
  }

  export type HostRoleMinOrderByAggregateInput = {
    hostId?: SortOrder
    userId?: SortOrder
    role?: SortOrder
  }

  export type HostRoleSumOrderByAggregateInput = {
    hostId?: SortOrder
  }

  export type TicketCountOrderByAggregateInput = {
    id?: SortOrder
    eventId?: SortOrder
    stripeSessionId?: SortOrder
    stripeChargeId?: SortOrder
    receiptUrl?: SortOrder
    customerName?: SortOrder
    customerPhoneNumber?: SortOrder
    customerEmail?: SortOrder
    userId?: SortOrder
    ticketQuantity?: SortOrder
    used?: SortOrder
    purchasedAt?: SortOrder
  }

  export type TicketAvgOrderByAggregateInput = {
    id?: SortOrder
    eventId?: SortOrder
    ticketQuantity?: SortOrder
  }

  export type TicketMaxOrderByAggregateInput = {
    id?: SortOrder
    eventId?: SortOrder
    stripeSessionId?: SortOrder
    stripeChargeId?: SortOrder
    receiptUrl?: SortOrder
    customerName?: SortOrder
    customerPhoneNumber?: SortOrder
    customerEmail?: SortOrder
    userId?: SortOrder
    ticketQuantity?: SortOrder
    used?: SortOrder
    purchasedAt?: SortOrder
  }

  export type TicketMinOrderByAggregateInput = {
    id?: SortOrder
    eventId?: SortOrder
    stripeSessionId?: SortOrder
    stripeChargeId?: SortOrder
    receiptUrl?: SortOrder
    customerName?: SortOrder
    customerPhoneNumber?: SortOrder
    customerEmail?: SortOrder
    userId?: SortOrder
    ticketQuantity?: SortOrder
    used?: SortOrder
    purchasedAt?: SortOrder
  }

  export type TicketSumOrderByAggregateInput = {
    id?: SortOrder
    eventId?: SortOrder
    ticketQuantity?: SortOrder
  }

  export type FloatFilter = {
    equals?: number
    in?: Enumerable<number>
    notIn?: Enumerable<number>
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedFloatFilter | number
  }

  export type ServiceCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    imageUrl?: SortOrder
    price?: SortOrder
  }

  export type ServiceAvgOrderByAggregateInput = {
    id?: SortOrder
    price?: SortOrder
  }

  export type ServiceMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    imageUrl?: SortOrder
    price?: SortOrder
  }

  export type ServiceMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    imageUrl?: SortOrder
    price?: SortOrder
  }

  export type ServiceSumOrderByAggregateInput = {
    id?: SortOrder
    price?: SortOrder
  }

  export type FloatWithAggregatesFilter = {
    equals?: number
    in?: Enumerable<number>
    notIn?: Enumerable<number>
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedFloatWithAggregatesFilter | number
    _count?: NestedIntFilter
    _avg?: NestedFloatFilter
    _sum?: NestedFloatFilter
    _min?: NestedFloatFilter
    _max?: NestedFloatFilter
  }

  export type ArtistCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    imageUrl?: SortOrder
    price?: SortOrder
    phoneNumber?: SortOrder
    email?: SortOrder
    website?: SortOrder
    genres?: SortOrder
  }

  export type ArtistAvgOrderByAggregateInput = {
    id?: SortOrder
    price?: SortOrder
  }

  export type ArtistMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    imageUrl?: SortOrder
    price?: SortOrder
    phoneNumber?: SortOrder
    email?: SortOrder
    website?: SortOrder
  }

  export type ArtistMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    imageUrl?: SortOrder
    price?: SortOrder
    phoneNumber?: SortOrder
    email?: SortOrder
    website?: SortOrder
  }

  export type ArtistSumOrderByAggregateInput = {
    id?: SortOrder
    price?: SortOrder
  }

  export type EventCreatepricesInput = {
    set: Enumerable<InputJsonValue>
  }

  export type EventCreatemediaInput = {
    set: Enumerable<string>
  }

  export type EventCreatehashtagsInput = {
    set: Enumerable<string>
  }

  export type TicketCreateNestedManyWithoutEventInput = {
    create?: XOR<Enumerable<TicketCreateWithoutEventInput>, Enumerable<TicketUncheckedCreateWithoutEventInput>>
    connectOrCreate?: Enumerable<TicketCreateOrConnectWithoutEventInput>
    createMany?: TicketCreateManyEventInputEnvelope
    connect?: Enumerable<TicketWhereUniqueInput>
  }

  export type EventNotificationCreateNestedManyWithoutEventInput = {
    create?: XOR<Enumerable<EventNotificationCreateWithoutEventInput>, Enumerable<EventNotificationUncheckedCreateWithoutEventInput>>
    connectOrCreate?: Enumerable<EventNotificationCreateOrConnectWithoutEventInput>
    createMany?: EventNotificationCreateManyEventInputEnvelope
    connect?: Enumerable<EventNotificationWhereUniqueInput>
  }

  export type HostCreateNestedOneWithoutEventsInput = {
    create?: XOR<HostCreateWithoutEventsInput, HostUncheckedCreateWithoutEventsInput>
    connectOrCreate?: HostCreateOrConnectWithoutEventsInput
    connect?: HostWhereUniqueInput
  }

  export type TicketUncheckedCreateNestedManyWithoutEventInput = {
    create?: XOR<Enumerable<TicketCreateWithoutEventInput>, Enumerable<TicketUncheckedCreateWithoutEventInput>>
    connectOrCreate?: Enumerable<TicketCreateOrConnectWithoutEventInput>
    createMany?: TicketCreateManyEventInputEnvelope
    connect?: Enumerable<TicketWhereUniqueInput>
  }

  export type EventNotificationUncheckedCreateNestedManyWithoutEventInput = {
    create?: XOR<Enumerable<EventNotificationCreateWithoutEventInput>, Enumerable<EventNotificationUncheckedCreateWithoutEventInput>>
    connectOrCreate?: Enumerable<EventNotificationCreateOrConnectWithoutEventInput>
    createMany?: EventNotificationCreateManyEventInputEnvelope
    connect?: Enumerable<EventNotificationWhereUniqueInput>
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type EventUpdatepricesInput = {
    set?: Enumerable<InputJsonValue>
    push?: InputJsonValue | Enumerable<InputJsonValue>
  }

  export type EventUpdatemediaInput = {
    set?: Enumerable<string>
    push?: string | Enumerable<string>
  }

  export type EventUpdatehashtagsInput = {
    set?: Enumerable<string>
    push?: string | Enumerable<string>
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type TicketUpdateManyWithoutEventNestedInput = {
    create?: XOR<Enumerable<TicketCreateWithoutEventInput>, Enumerable<TicketUncheckedCreateWithoutEventInput>>
    connectOrCreate?: Enumerable<TicketCreateOrConnectWithoutEventInput>
    upsert?: Enumerable<TicketUpsertWithWhereUniqueWithoutEventInput>
    createMany?: TicketCreateManyEventInputEnvelope
    set?: Enumerable<TicketWhereUniqueInput>
    disconnect?: Enumerable<TicketWhereUniqueInput>
    delete?: Enumerable<TicketWhereUniqueInput>
    connect?: Enumerable<TicketWhereUniqueInput>
    update?: Enumerable<TicketUpdateWithWhereUniqueWithoutEventInput>
    updateMany?: Enumerable<TicketUpdateManyWithWhereWithoutEventInput>
    deleteMany?: Enumerable<TicketScalarWhereInput>
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type EventNotificationUpdateManyWithoutEventNestedInput = {
    create?: XOR<Enumerable<EventNotificationCreateWithoutEventInput>, Enumerable<EventNotificationUncheckedCreateWithoutEventInput>>
    connectOrCreate?: Enumerable<EventNotificationCreateOrConnectWithoutEventInput>
    upsert?: Enumerable<EventNotificationUpsertWithWhereUniqueWithoutEventInput>
    createMany?: EventNotificationCreateManyEventInputEnvelope
    set?: Enumerable<EventNotificationWhereUniqueInput>
    disconnect?: Enumerable<EventNotificationWhereUniqueInput>
    delete?: Enumerable<EventNotificationWhereUniqueInput>
    connect?: Enumerable<EventNotificationWhereUniqueInput>
    update?: Enumerable<EventNotificationUpdateWithWhereUniqueWithoutEventInput>
    updateMany?: Enumerable<EventNotificationUpdateManyWithWhereWithoutEventInput>
    deleteMany?: Enumerable<EventNotificationScalarWhereInput>
  }

  export type HostUpdateOneRequiredWithoutEventsNestedInput = {
    create?: XOR<HostCreateWithoutEventsInput, HostUncheckedCreateWithoutEventsInput>
    connectOrCreate?: HostCreateOrConnectWithoutEventsInput
    upsert?: HostUpsertWithoutEventsInput
    connect?: HostWhereUniqueInput
    update?: XOR<HostUpdateWithoutEventsInput, HostUncheckedUpdateWithoutEventsInput>
  }

  export type TicketUncheckedUpdateManyWithoutEventNestedInput = {
    create?: XOR<Enumerable<TicketCreateWithoutEventInput>, Enumerable<TicketUncheckedCreateWithoutEventInput>>
    connectOrCreate?: Enumerable<TicketCreateOrConnectWithoutEventInput>
    upsert?: Enumerable<TicketUpsertWithWhereUniqueWithoutEventInput>
    createMany?: TicketCreateManyEventInputEnvelope
    set?: Enumerable<TicketWhereUniqueInput>
    disconnect?: Enumerable<TicketWhereUniqueInput>
    delete?: Enumerable<TicketWhereUniqueInput>
    connect?: Enumerable<TicketWhereUniqueInput>
    update?: Enumerable<TicketUpdateWithWhereUniqueWithoutEventInput>
    updateMany?: Enumerable<TicketUpdateManyWithWhereWithoutEventInput>
    deleteMany?: Enumerable<TicketScalarWhereInput>
  }

  export type EventNotificationUncheckedUpdateManyWithoutEventNestedInput = {
    create?: XOR<Enumerable<EventNotificationCreateWithoutEventInput>, Enumerable<EventNotificationUncheckedCreateWithoutEventInput>>
    connectOrCreate?: Enumerable<EventNotificationCreateOrConnectWithoutEventInput>
    upsert?: Enumerable<EventNotificationUpsertWithWhereUniqueWithoutEventInput>
    createMany?: EventNotificationCreateManyEventInputEnvelope
    set?: Enumerable<EventNotificationWhereUniqueInput>
    disconnect?: Enumerable<EventNotificationWhereUniqueInput>
    delete?: Enumerable<EventNotificationWhereUniqueInput>
    connect?: Enumerable<EventNotificationWhereUniqueInput>
    update?: Enumerable<EventNotificationUpdateWithWhereUniqueWithoutEventInput>
    updateMany?: Enumerable<EventNotificationUpdateManyWithWhereWithoutEventInput>
    deleteMany?: Enumerable<EventNotificationScalarWhereInput>
  }

  export type EventCreateNestedOneWithoutEventNotificationsInput = {
    create?: XOR<EventCreateWithoutEventNotificationsInput, EventUncheckedCreateWithoutEventNotificationsInput>
    connectOrCreate?: EventCreateOrConnectWithoutEventNotificationsInput
    connect?: EventWhereUniqueInput
  }

  export type EventUpdateOneRequiredWithoutEventNotificationsNestedInput = {
    create?: XOR<EventCreateWithoutEventNotificationsInput, EventUncheckedCreateWithoutEventNotificationsInput>
    connectOrCreate?: EventCreateOrConnectWithoutEventNotificationsInput
    upsert?: EventUpsertWithoutEventNotificationsInput
    connect?: EventWhereUniqueInput
    update?: XOR<EventUpdateWithoutEventNotificationsInput, EventUncheckedUpdateWithoutEventNotificationsInput>
  }

  export type UserCreaterolesInput = {
    set: Enumerable<string>
  }

  export type HostRoleCreateNestedManyWithoutUserInput = {
    create?: XOR<Enumerable<HostRoleCreateWithoutUserInput>, Enumerable<HostRoleUncheckedCreateWithoutUserInput>>
    connectOrCreate?: Enumerable<HostRoleCreateOrConnectWithoutUserInput>
    createMany?: HostRoleCreateManyUserInputEnvelope
    connect?: Enumerable<HostRoleWhereUniqueInput>
  }

  export type TicketCreateNestedManyWithoutUserInput = {
    create?: XOR<Enumerable<TicketCreateWithoutUserInput>, Enumerable<TicketUncheckedCreateWithoutUserInput>>
    connectOrCreate?: Enumerable<TicketCreateOrConnectWithoutUserInput>
    createMany?: TicketCreateManyUserInputEnvelope
    connect?: Enumerable<TicketWhereUniqueInput>
  }

  export type HostCreateNestedManyWithoutCreatorInput = {
    create?: XOR<Enumerable<HostCreateWithoutCreatorInput>, Enumerable<HostUncheckedCreateWithoutCreatorInput>>
    connectOrCreate?: Enumerable<HostCreateOrConnectWithoutCreatorInput>
    createMany?: HostCreateManyCreatorInputEnvelope
    connect?: Enumerable<HostWhereUniqueInput>
  }

  export type HostRoleUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<Enumerable<HostRoleCreateWithoutUserInput>, Enumerable<HostRoleUncheckedCreateWithoutUserInput>>
    connectOrCreate?: Enumerable<HostRoleCreateOrConnectWithoutUserInput>
    createMany?: HostRoleCreateManyUserInputEnvelope
    connect?: Enumerable<HostRoleWhereUniqueInput>
  }

  export type TicketUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<Enumerable<TicketCreateWithoutUserInput>, Enumerable<TicketUncheckedCreateWithoutUserInput>>
    connectOrCreate?: Enumerable<TicketCreateOrConnectWithoutUserInput>
    createMany?: TicketCreateManyUserInputEnvelope
    connect?: Enumerable<TicketWhereUniqueInput>
  }

  export type HostUncheckedCreateNestedManyWithoutCreatorInput = {
    create?: XOR<Enumerable<HostCreateWithoutCreatorInput>, Enumerable<HostUncheckedCreateWithoutCreatorInput>>
    connectOrCreate?: Enumerable<HostCreateOrConnectWithoutCreatorInput>
    createMany?: HostCreateManyCreatorInputEnvelope
    connect?: Enumerable<HostWhereUniqueInput>
  }

  export type UserUpdaterolesInput = {
    set?: Enumerable<string>
    push?: string | Enumerable<string>
  }

  export type HostRoleUpdateManyWithoutUserNestedInput = {
    create?: XOR<Enumerable<HostRoleCreateWithoutUserInput>, Enumerable<HostRoleUncheckedCreateWithoutUserInput>>
    connectOrCreate?: Enumerable<HostRoleCreateOrConnectWithoutUserInput>
    upsert?: Enumerable<HostRoleUpsertWithWhereUniqueWithoutUserInput>
    createMany?: HostRoleCreateManyUserInputEnvelope
    set?: Enumerable<HostRoleWhereUniqueInput>
    disconnect?: Enumerable<HostRoleWhereUniqueInput>
    delete?: Enumerable<HostRoleWhereUniqueInput>
    connect?: Enumerable<HostRoleWhereUniqueInput>
    update?: Enumerable<HostRoleUpdateWithWhereUniqueWithoutUserInput>
    updateMany?: Enumerable<HostRoleUpdateManyWithWhereWithoutUserInput>
    deleteMany?: Enumerable<HostRoleScalarWhereInput>
  }

  export type TicketUpdateManyWithoutUserNestedInput = {
    create?: XOR<Enumerable<TicketCreateWithoutUserInput>, Enumerable<TicketUncheckedCreateWithoutUserInput>>
    connectOrCreate?: Enumerable<TicketCreateOrConnectWithoutUserInput>
    upsert?: Enumerable<TicketUpsertWithWhereUniqueWithoutUserInput>
    createMany?: TicketCreateManyUserInputEnvelope
    set?: Enumerable<TicketWhereUniqueInput>
    disconnect?: Enumerable<TicketWhereUniqueInput>
    delete?: Enumerable<TicketWhereUniqueInput>
    connect?: Enumerable<TicketWhereUniqueInput>
    update?: Enumerable<TicketUpdateWithWhereUniqueWithoutUserInput>
    updateMany?: Enumerable<TicketUpdateManyWithWhereWithoutUserInput>
    deleteMany?: Enumerable<TicketScalarWhereInput>
  }

  export type HostUpdateManyWithoutCreatorNestedInput = {
    create?: XOR<Enumerable<HostCreateWithoutCreatorInput>, Enumerable<HostUncheckedCreateWithoutCreatorInput>>
    connectOrCreate?: Enumerable<HostCreateOrConnectWithoutCreatorInput>
    upsert?: Enumerable<HostUpsertWithWhereUniqueWithoutCreatorInput>
    createMany?: HostCreateManyCreatorInputEnvelope
    set?: Enumerable<HostWhereUniqueInput>
    disconnect?: Enumerable<HostWhereUniqueInput>
    delete?: Enumerable<HostWhereUniqueInput>
    connect?: Enumerable<HostWhereUniqueInput>
    update?: Enumerable<HostUpdateWithWhereUniqueWithoutCreatorInput>
    updateMany?: Enumerable<HostUpdateManyWithWhereWithoutCreatorInput>
    deleteMany?: Enumerable<HostScalarWhereInput>
  }

  export type HostRoleUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<Enumerable<HostRoleCreateWithoutUserInput>, Enumerable<HostRoleUncheckedCreateWithoutUserInput>>
    connectOrCreate?: Enumerable<HostRoleCreateOrConnectWithoutUserInput>
    upsert?: Enumerable<HostRoleUpsertWithWhereUniqueWithoutUserInput>
    createMany?: HostRoleCreateManyUserInputEnvelope
    set?: Enumerable<HostRoleWhereUniqueInput>
    disconnect?: Enumerable<HostRoleWhereUniqueInput>
    delete?: Enumerable<HostRoleWhereUniqueInput>
    connect?: Enumerable<HostRoleWhereUniqueInput>
    update?: Enumerable<HostRoleUpdateWithWhereUniqueWithoutUserInput>
    updateMany?: Enumerable<HostRoleUpdateManyWithWhereWithoutUserInput>
    deleteMany?: Enumerable<HostRoleScalarWhereInput>
  }

  export type TicketUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<Enumerable<TicketCreateWithoutUserInput>, Enumerable<TicketUncheckedCreateWithoutUserInput>>
    connectOrCreate?: Enumerable<TicketCreateOrConnectWithoutUserInput>
    upsert?: Enumerable<TicketUpsertWithWhereUniqueWithoutUserInput>
    createMany?: TicketCreateManyUserInputEnvelope
    set?: Enumerable<TicketWhereUniqueInput>
    disconnect?: Enumerable<TicketWhereUniqueInput>
    delete?: Enumerable<TicketWhereUniqueInput>
    connect?: Enumerable<TicketWhereUniqueInput>
    update?: Enumerable<TicketUpdateWithWhereUniqueWithoutUserInput>
    updateMany?: Enumerable<TicketUpdateManyWithWhereWithoutUserInput>
    deleteMany?: Enumerable<TicketScalarWhereInput>
  }

  export type HostUncheckedUpdateManyWithoutCreatorNestedInput = {
    create?: XOR<Enumerable<HostCreateWithoutCreatorInput>, Enumerable<HostUncheckedCreateWithoutCreatorInput>>
    connectOrCreate?: Enumerable<HostCreateOrConnectWithoutCreatorInput>
    upsert?: Enumerable<HostUpsertWithWhereUniqueWithoutCreatorInput>
    createMany?: HostCreateManyCreatorInputEnvelope
    set?: Enumerable<HostWhereUniqueInput>
    disconnect?: Enumerable<HostWhereUniqueInput>
    delete?: Enumerable<HostWhereUniqueInput>
    connect?: Enumerable<HostWhereUniqueInput>
    update?: Enumerable<HostUpdateWithWhereUniqueWithoutCreatorInput>
    updateMany?: Enumerable<HostUpdateManyWithWhereWithoutCreatorInput>
    deleteMany?: Enumerable<HostScalarWhereInput>
  }

  export type EventCreateNestedManyWithoutHostInput = {
    create?: XOR<Enumerable<EventCreateWithoutHostInput>, Enumerable<EventUncheckedCreateWithoutHostInput>>
    connectOrCreate?: Enumerable<EventCreateOrConnectWithoutHostInput>
    createMany?: EventCreateManyHostInputEnvelope
    connect?: Enumerable<EventWhereUniqueInput>
  }

  export type HostRoleCreateNestedManyWithoutHostInput = {
    create?: XOR<Enumerable<HostRoleCreateWithoutHostInput>, Enumerable<HostRoleUncheckedCreateWithoutHostInput>>
    connectOrCreate?: Enumerable<HostRoleCreateOrConnectWithoutHostInput>
    createMany?: HostRoleCreateManyHostInputEnvelope
    connect?: Enumerable<HostRoleWhereUniqueInput>
  }

  export type UserCreateNestedOneWithoutHostsInput = {
    create?: XOR<UserCreateWithoutHostsInput, UserUncheckedCreateWithoutHostsInput>
    connectOrCreate?: UserCreateOrConnectWithoutHostsInput
    connect?: UserWhereUniqueInput
  }

  export type EventUncheckedCreateNestedManyWithoutHostInput = {
    create?: XOR<Enumerable<EventCreateWithoutHostInput>, Enumerable<EventUncheckedCreateWithoutHostInput>>
    connectOrCreate?: Enumerable<EventCreateOrConnectWithoutHostInput>
    createMany?: EventCreateManyHostInputEnvelope
    connect?: Enumerable<EventWhereUniqueInput>
  }

  export type HostRoleUncheckedCreateNestedManyWithoutHostInput = {
    create?: XOR<Enumerable<HostRoleCreateWithoutHostInput>, Enumerable<HostRoleUncheckedCreateWithoutHostInput>>
    connectOrCreate?: Enumerable<HostRoleCreateOrConnectWithoutHostInput>
    createMany?: HostRoleCreateManyHostInputEnvelope
    connect?: Enumerable<HostRoleWhereUniqueInput>
  }

  export type EventUpdateManyWithoutHostNestedInput = {
    create?: XOR<Enumerable<EventCreateWithoutHostInput>, Enumerable<EventUncheckedCreateWithoutHostInput>>
    connectOrCreate?: Enumerable<EventCreateOrConnectWithoutHostInput>
    upsert?: Enumerable<EventUpsertWithWhereUniqueWithoutHostInput>
    createMany?: EventCreateManyHostInputEnvelope
    set?: Enumerable<EventWhereUniqueInput>
    disconnect?: Enumerable<EventWhereUniqueInput>
    delete?: Enumerable<EventWhereUniqueInput>
    connect?: Enumerable<EventWhereUniqueInput>
    update?: Enumerable<EventUpdateWithWhereUniqueWithoutHostInput>
    updateMany?: Enumerable<EventUpdateManyWithWhereWithoutHostInput>
    deleteMany?: Enumerable<EventScalarWhereInput>
  }

  export type HostRoleUpdateManyWithoutHostNestedInput = {
    create?: XOR<Enumerable<HostRoleCreateWithoutHostInput>, Enumerable<HostRoleUncheckedCreateWithoutHostInput>>
    connectOrCreate?: Enumerable<HostRoleCreateOrConnectWithoutHostInput>
    upsert?: Enumerable<HostRoleUpsertWithWhereUniqueWithoutHostInput>
    createMany?: HostRoleCreateManyHostInputEnvelope
    set?: Enumerable<HostRoleWhereUniqueInput>
    disconnect?: Enumerable<HostRoleWhereUniqueInput>
    delete?: Enumerable<HostRoleWhereUniqueInput>
    connect?: Enumerable<HostRoleWhereUniqueInput>
    update?: Enumerable<HostRoleUpdateWithWhereUniqueWithoutHostInput>
    updateMany?: Enumerable<HostRoleUpdateManyWithWhereWithoutHostInput>
    deleteMany?: Enumerable<HostRoleScalarWhereInput>
  }

  export type UserUpdateOneRequiredWithoutHostsNestedInput = {
    create?: XOR<UserCreateWithoutHostsInput, UserUncheckedCreateWithoutHostsInput>
    connectOrCreate?: UserCreateOrConnectWithoutHostsInput
    upsert?: UserUpsertWithoutHostsInput
    connect?: UserWhereUniqueInput
    update?: XOR<UserUpdateWithoutHostsInput, UserUncheckedUpdateWithoutHostsInput>
  }

  export type EventUncheckedUpdateManyWithoutHostNestedInput = {
    create?: XOR<Enumerable<EventCreateWithoutHostInput>, Enumerable<EventUncheckedCreateWithoutHostInput>>
    connectOrCreate?: Enumerable<EventCreateOrConnectWithoutHostInput>
    upsert?: Enumerable<EventUpsertWithWhereUniqueWithoutHostInput>
    createMany?: EventCreateManyHostInputEnvelope
    set?: Enumerable<EventWhereUniqueInput>
    disconnect?: Enumerable<EventWhereUniqueInput>
    delete?: Enumerable<EventWhereUniqueInput>
    connect?: Enumerable<EventWhereUniqueInput>
    update?: Enumerable<EventUpdateWithWhereUniqueWithoutHostInput>
    updateMany?: Enumerable<EventUpdateManyWithWhereWithoutHostInput>
    deleteMany?: Enumerable<EventScalarWhereInput>
  }

  export type HostRoleUncheckedUpdateManyWithoutHostNestedInput = {
    create?: XOR<Enumerable<HostRoleCreateWithoutHostInput>, Enumerable<HostRoleUncheckedCreateWithoutHostInput>>
    connectOrCreate?: Enumerable<HostRoleCreateOrConnectWithoutHostInput>
    upsert?: Enumerable<HostRoleUpsertWithWhereUniqueWithoutHostInput>
    createMany?: HostRoleCreateManyHostInputEnvelope
    set?: Enumerable<HostRoleWhereUniqueInput>
    disconnect?: Enumerable<HostRoleWhereUniqueInput>
    delete?: Enumerable<HostRoleWhereUniqueInput>
    connect?: Enumerable<HostRoleWhereUniqueInput>
    update?: Enumerable<HostRoleUpdateWithWhereUniqueWithoutHostInput>
    updateMany?: Enumerable<HostRoleUpdateManyWithWhereWithoutHostInput>
    deleteMany?: Enumerable<HostRoleScalarWhereInput>
  }

  export type HostCreateNestedOneWithoutHostRolesInput = {
    create?: XOR<HostCreateWithoutHostRolesInput, HostUncheckedCreateWithoutHostRolesInput>
    connectOrCreate?: HostCreateOrConnectWithoutHostRolesInput
    connect?: HostWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutHostRolesInput = {
    create?: XOR<UserCreateWithoutHostRolesInput, UserUncheckedCreateWithoutHostRolesInput>
    connectOrCreate?: UserCreateOrConnectWithoutHostRolesInput
    connect?: UserWhereUniqueInput
  }

  export type HostUpdateOneRequiredWithoutHostRolesNestedInput = {
    create?: XOR<HostCreateWithoutHostRolesInput, HostUncheckedCreateWithoutHostRolesInput>
    connectOrCreate?: HostCreateOrConnectWithoutHostRolesInput
    upsert?: HostUpsertWithoutHostRolesInput
    connect?: HostWhereUniqueInput
    update?: XOR<HostUpdateWithoutHostRolesInput, HostUncheckedUpdateWithoutHostRolesInput>
  }

  export type UserUpdateOneRequiredWithoutHostRolesNestedInput = {
    create?: XOR<UserCreateWithoutHostRolesInput, UserUncheckedCreateWithoutHostRolesInput>
    connectOrCreate?: UserCreateOrConnectWithoutHostRolesInput
    upsert?: UserUpsertWithoutHostRolesInput
    connect?: UserWhereUniqueInput
    update?: XOR<UserUpdateWithoutHostRolesInput, UserUncheckedUpdateWithoutHostRolesInput>
  }

  export type EventCreateNestedOneWithoutTicketsInput = {
    create?: XOR<EventCreateWithoutTicketsInput, EventUncheckedCreateWithoutTicketsInput>
    connectOrCreate?: EventCreateOrConnectWithoutTicketsInput
    connect?: EventWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutTicketsInput = {
    create?: XOR<UserCreateWithoutTicketsInput, UserUncheckedCreateWithoutTicketsInput>
    connectOrCreate?: UserCreateOrConnectWithoutTicketsInput
    connect?: UserWhereUniqueInput
  }

  export type EventUpdateOneRequiredWithoutTicketsNestedInput = {
    create?: XOR<EventCreateWithoutTicketsInput, EventUncheckedCreateWithoutTicketsInput>
    connectOrCreate?: EventCreateOrConnectWithoutTicketsInput
    upsert?: EventUpsertWithoutTicketsInput
    connect?: EventWhereUniqueInput
    update?: XOR<EventUpdateWithoutTicketsInput, EventUncheckedUpdateWithoutTicketsInput>
  }

  export type UserUpdateOneWithoutTicketsNestedInput = {
    create?: XOR<UserCreateWithoutTicketsInput, UserUncheckedCreateWithoutTicketsInput>
    connectOrCreate?: UserCreateOrConnectWithoutTicketsInput
    upsert?: UserUpsertWithoutTicketsInput
    disconnect?: boolean
    delete?: boolean
    connect?: UserWhereUniqueInput
    update?: XOR<UserUpdateWithoutTicketsInput, UserUncheckedUpdateWithoutTicketsInput>
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type ArtistCreategenresInput = {
    set: Enumerable<string>
  }

  export type ArtistUpdategenresInput = {
    set?: Enumerable<string>
    push?: string | Enumerable<string>
  }

  export type NestedIntFilter = {
    equals?: number
    in?: Enumerable<number>
    notIn?: Enumerable<number>
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntFilter | number
  }

  export type NestedStringFilter = {
    equals?: string
    in?: Enumerable<string>
    notIn?: Enumerable<string>
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringFilter | string
  }

  export type NestedStringNullableFilter = {
    equals?: string | null
    in?: Enumerable<string> | null
    notIn?: Enumerable<string> | null
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringNullableFilter | string | null
  }

  export type NestedBoolFilter = {
    equals?: boolean
    not?: NestedBoolFilter | boolean
  }

  export type NestedDateTimeFilter = {
    equals?: Date | string
    in?: Enumerable<Date> | Enumerable<string>
    notIn?: Enumerable<Date> | Enumerable<string>
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeFilter | Date | string
  }

  export type NestedIntWithAggregatesFilter = {
    equals?: number
    in?: Enumerable<number>
    notIn?: Enumerable<number>
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntWithAggregatesFilter | number
    _count?: NestedIntFilter
    _avg?: NestedFloatFilter
    _sum?: NestedIntFilter
    _min?: NestedIntFilter
    _max?: NestedIntFilter
  }

  export type NestedFloatFilter = {
    equals?: number
    in?: Enumerable<number>
    notIn?: Enumerable<number>
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedFloatFilter | number
  }

  export type NestedStringWithAggregatesFilter = {
    equals?: string
    in?: Enumerable<string>
    notIn?: Enumerable<string>
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringWithAggregatesFilter | string
    _count?: NestedIntFilter
    _min?: NestedStringFilter
    _max?: NestedStringFilter
  }

  export type NestedStringNullableWithAggregatesFilter = {
    equals?: string | null
    in?: Enumerable<string> | null
    notIn?: Enumerable<string> | null
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringNullableWithAggregatesFilter | string | null
    _count?: NestedIntNullableFilter
    _min?: NestedStringNullableFilter
    _max?: NestedStringNullableFilter
  }

  export type NestedIntNullableFilter = {
    equals?: number | null
    in?: Enumerable<number> | null
    notIn?: Enumerable<number> | null
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntNullableFilter | number | null
  }

  export type NestedBoolWithAggregatesFilter = {
    equals?: boolean
    not?: NestedBoolWithAggregatesFilter | boolean
    _count?: NestedIntFilter
    _min?: NestedBoolFilter
    _max?: NestedBoolFilter
  }

  export type NestedDateTimeWithAggregatesFilter = {
    equals?: Date | string
    in?: Enumerable<Date> | Enumerable<string>
    notIn?: Enumerable<Date> | Enumerable<string>
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeWithAggregatesFilter | Date | string
    _count?: NestedIntFilter
    _min?: NestedDateTimeFilter
    _max?: NestedDateTimeFilter
  }

  export type NestedFloatWithAggregatesFilter = {
    equals?: number
    in?: Enumerable<number>
    notIn?: Enumerable<number>
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedFloatWithAggregatesFilter | number
    _count?: NestedIntFilter
    _avg?: NestedFloatFilter
    _sum?: NestedFloatFilter
    _min?: NestedFloatFilter
    _max?: NestedFloatFilter
  }

  export type TicketCreateWithoutEventInput = {
    stripeSessionId: string
    stripeChargeId: string
    receiptUrl: string
    customerName: string
    customerPhoneNumber: string
    customerEmail: string
    user?: UserCreateNestedOneWithoutTicketsInput
    ticketQuantity: number
    used: boolean
    purchasedAt?: Date | string
  }

  export type TicketUncheckedCreateWithoutEventInput = {
    id?: number
    stripeSessionId: string
    stripeChargeId: string
    receiptUrl: string
    customerName: string
    customerPhoneNumber: string
    customerEmail: string
    userId?: string | null
    ticketQuantity: number
    used: boolean
    purchasedAt?: Date | string
  }

  export type TicketCreateOrConnectWithoutEventInput = {
    where: TicketWhereUniqueInput
    create: XOR<TicketCreateWithoutEventInput, TicketUncheckedCreateWithoutEventInput>
  }

  export type TicketCreateManyEventInputEnvelope = {
    data: Enumerable<TicketCreateManyEventInput>
    skipDuplicates?: boolean
  }

  export type EventNotificationCreateWithoutEventInput = {
    messageTime: Date | string
    message: string
    sent?: boolean
  }

  export type EventNotificationUncheckedCreateWithoutEventInput = {
    id?: number
    messageTime: Date | string
    message: string
    sent?: boolean
  }

  export type EventNotificationCreateOrConnectWithoutEventInput = {
    where: EventNotificationWhereUniqueInput
    create: XOR<EventNotificationCreateWithoutEventInput, EventNotificationUncheckedCreateWithoutEventInput>
  }

  export type EventNotificationCreateManyEventInputEnvelope = {
    data: Enumerable<EventNotificationCreateManyEventInput>
    skipDuplicates?: boolean
  }

  export type HostCreateWithoutEventsInput = {
    name?: string
    description?: string | null
    hostRoles?: HostRoleCreateNestedManyWithoutHostInput
    creator: UserCreateNestedOneWithoutHostsInput
    imageUrl?: string | null
  }

  export type HostUncheckedCreateWithoutEventsInput = {
    id?: number
    name?: string
    description?: string | null
    hostRoles?: HostRoleUncheckedCreateNestedManyWithoutHostInput
    createdBy: string
    imageUrl?: string | null
  }

  export type HostCreateOrConnectWithoutEventsInput = {
    where: HostWhereUniqueInput
    create: XOR<HostCreateWithoutEventsInput, HostUncheckedCreateWithoutEventsInput>
  }

  export type TicketUpsertWithWhereUniqueWithoutEventInput = {
    where: TicketWhereUniqueInput
    update: XOR<TicketUpdateWithoutEventInput, TicketUncheckedUpdateWithoutEventInput>
    create: XOR<TicketCreateWithoutEventInput, TicketUncheckedCreateWithoutEventInput>
  }

  export type TicketUpdateWithWhereUniqueWithoutEventInput = {
    where: TicketWhereUniqueInput
    data: XOR<TicketUpdateWithoutEventInput, TicketUncheckedUpdateWithoutEventInput>
  }

  export type TicketUpdateManyWithWhereWithoutEventInput = {
    where: TicketScalarWhereInput
    data: XOR<TicketUpdateManyMutationInput, TicketUncheckedUpdateManyWithoutTicketsInput>
  }

  export type TicketScalarWhereInput = {
    AND?: Enumerable<TicketScalarWhereInput>
    OR?: Enumerable<TicketScalarWhereInput>
    NOT?: Enumerable<TicketScalarWhereInput>
    id?: IntFilter | number
    eventId?: IntFilter | number
    stripeSessionId?: StringFilter | string
    stripeChargeId?: StringFilter | string
    receiptUrl?: StringFilter | string
    customerName?: StringFilter | string
    customerPhoneNumber?: StringFilter | string
    customerEmail?: StringFilter | string
    userId?: StringNullableFilter | string | null
    ticketQuantity?: IntFilter | number
    used?: BoolFilter | boolean
    purchasedAt?: DateTimeFilter | Date | string
  }

  export type EventNotificationUpsertWithWhereUniqueWithoutEventInput = {
    where: EventNotificationWhereUniqueInput
    update: XOR<EventNotificationUpdateWithoutEventInput, EventNotificationUncheckedUpdateWithoutEventInput>
    create: XOR<EventNotificationCreateWithoutEventInput, EventNotificationUncheckedCreateWithoutEventInput>
  }

  export type EventNotificationUpdateWithWhereUniqueWithoutEventInput = {
    where: EventNotificationWhereUniqueInput
    data: XOR<EventNotificationUpdateWithoutEventInput, EventNotificationUncheckedUpdateWithoutEventInput>
  }

  export type EventNotificationUpdateManyWithWhereWithoutEventInput = {
    where: EventNotificationScalarWhereInput
    data: XOR<EventNotificationUpdateManyMutationInput, EventNotificationUncheckedUpdateManyWithoutEventNotificationsInput>
  }

  export type EventNotificationScalarWhereInput = {
    AND?: Enumerable<EventNotificationScalarWhereInput>
    OR?: Enumerable<EventNotificationScalarWhereInput>
    NOT?: Enumerable<EventNotificationScalarWhereInput>
    id?: IntFilter | number
    messageTime?: DateTimeFilter | Date | string
    message?: StringFilter | string
    eventId?: IntFilter | number
    sent?: BoolFilter | boolean
  }

  export type HostUpsertWithoutEventsInput = {
    update: XOR<HostUpdateWithoutEventsInput, HostUncheckedUpdateWithoutEventsInput>
    create: XOR<HostCreateWithoutEventsInput, HostUncheckedCreateWithoutEventsInput>
  }

  export type HostUpdateWithoutEventsInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    hostRoles?: HostRoleUpdateManyWithoutHostNestedInput
    creator?: UserUpdateOneRequiredWithoutHostsNestedInput
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type HostUncheckedUpdateWithoutEventsInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    hostRoles?: HostRoleUncheckedUpdateManyWithoutHostNestedInput
    createdBy?: StringFieldUpdateOperationsInput | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type EventCreateWithoutEventNotificationsInput = {
    name?: string
    description?: string | null
    published?: boolean
    prices?: EventCreatepricesInput | Enumerable<InputJsonValue>
    media?: EventCreatemediaInput | Enumerable<string>
    thumbnail?: string | null
    hashtags?: EventCreatehashtagsInput | Enumerable<string>
    maxTickets?: number
    location?: string
    tickets?: TicketCreateNestedManyWithoutEventInput
    stripeProductId?: string | null
    snsTopicArn?: string | null
    startTime: Date | string
    endTime: Date | string
    host: HostCreateNestedOneWithoutEventsInput
  }

  export type EventUncheckedCreateWithoutEventNotificationsInput = {
    id?: number
    name?: string
    description?: string | null
    published?: boolean
    prices?: EventCreatepricesInput | Enumerable<InputJsonValue>
    media?: EventCreatemediaInput | Enumerable<string>
    thumbnail?: string | null
    hashtags?: EventCreatehashtagsInput | Enumerable<string>
    maxTickets?: number
    location?: string
    tickets?: TicketUncheckedCreateNestedManyWithoutEventInput
    stripeProductId?: string | null
    snsTopicArn?: string | null
    startTime: Date | string
    endTime: Date | string
    hostId: number
  }

  export type EventCreateOrConnectWithoutEventNotificationsInput = {
    where: EventWhereUniqueInput
    create: XOR<EventCreateWithoutEventNotificationsInput, EventUncheckedCreateWithoutEventNotificationsInput>
  }

  export type EventUpsertWithoutEventNotificationsInput = {
    update: XOR<EventUpdateWithoutEventNotificationsInput, EventUncheckedUpdateWithoutEventNotificationsInput>
    create: XOR<EventCreateWithoutEventNotificationsInput, EventUncheckedCreateWithoutEventNotificationsInput>
  }

  export type EventUpdateWithoutEventNotificationsInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    published?: BoolFieldUpdateOperationsInput | boolean
    prices?: EventUpdatepricesInput | Enumerable<InputJsonValue>
    media?: EventUpdatemediaInput | Enumerable<string>
    thumbnail?: NullableStringFieldUpdateOperationsInput | string | null
    hashtags?: EventUpdatehashtagsInput | Enumerable<string>
    maxTickets?: IntFieldUpdateOperationsInput | number
    location?: StringFieldUpdateOperationsInput | string
    tickets?: TicketUpdateManyWithoutEventNestedInput
    stripeProductId?: NullableStringFieldUpdateOperationsInput | string | null
    snsTopicArn?: NullableStringFieldUpdateOperationsInput | string | null
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    host?: HostUpdateOneRequiredWithoutEventsNestedInput
  }

  export type EventUncheckedUpdateWithoutEventNotificationsInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    published?: BoolFieldUpdateOperationsInput | boolean
    prices?: EventUpdatepricesInput | Enumerable<InputJsonValue>
    media?: EventUpdatemediaInput | Enumerable<string>
    thumbnail?: NullableStringFieldUpdateOperationsInput | string | null
    hashtags?: EventUpdatehashtagsInput | Enumerable<string>
    maxTickets?: IntFieldUpdateOperationsInput | number
    location?: StringFieldUpdateOperationsInput | string
    tickets?: TicketUncheckedUpdateManyWithoutEventNestedInput
    stripeProductId?: NullableStringFieldUpdateOperationsInput | string | null
    snsTopicArn?: NullableStringFieldUpdateOperationsInput | string | null
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    hostId?: IntFieldUpdateOperationsInput | number
  }

  export type HostRoleCreateWithoutUserInput = {
    host: HostCreateNestedOneWithoutHostRolesInput
    role: string
  }

  export type HostRoleUncheckedCreateWithoutUserInput = {
    hostId: number
    role: string
  }

  export type HostRoleCreateOrConnectWithoutUserInput = {
    where: HostRoleWhereUniqueInput
    create: XOR<HostRoleCreateWithoutUserInput, HostRoleUncheckedCreateWithoutUserInput>
  }

  export type HostRoleCreateManyUserInputEnvelope = {
    data: Enumerable<HostRoleCreateManyUserInput>
    skipDuplicates?: boolean
  }

  export type TicketCreateWithoutUserInput = {
    event: EventCreateNestedOneWithoutTicketsInput
    stripeSessionId: string
    stripeChargeId: string
    receiptUrl: string
    customerName: string
    customerPhoneNumber: string
    customerEmail: string
    ticketQuantity: number
    used: boolean
    purchasedAt?: Date | string
  }

  export type TicketUncheckedCreateWithoutUserInput = {
    id?: number
    eventId: number
    stripeSessionId: string
    stripeChargeId: string
    receiptUrl: string
    customerName: string
    customerPhoneNumber: string
    customerEmail: string
    ticketQuantity: number
    used: boolean
    purchasedAt?: Date | string
  }

  export type TicketCreateOrConnectWithoutUserInput = {
    where: TicketWhereUniqueInput
    create: XOR<TicketCreateWithoutUserInput, TicketUncheckedCreateWithoutUserInput>
  }

  export type TicketCreateManyUserInputEnvelope = {
    data: Enumerable<TicketCreateManyUserInput>
    skipDuplicates?: boolean
  }

  export type HostCreateWithoutCreatorInput = {
    name?: string
    description?: string | null
    events?: EventCreateNestedManyWithoutHostInput
    hostRoles?: HostRoleCreateNestedManyWithoutHostInput
    imageUrl?: string | null
  }

  export type HostUncheckedCreateWithoutCreatorInput = {
    id?: number
    name?: string
    description?: string | null
    events?: EventUncheckedCreateNestedManyWithoutHostInput
    hostRoles?: HostRoleUncheckedCreateNestedManyWithoutHostInput
    imageUrl?: string | null
  }

  export type HostCreateOrConnectWithoutCreatorInput = {
    where: HostWhereUniqueInput
    create: XOR<HostCreateWithoutCreatorInput, HostUncheckedCreateWithoutCreatorInput>
  }

  export type HostCreateManyCreatorInputEnvelope = {
    data: Enumerable<HostCreateManyCreatorInput>
    skipDuplicates?: boolean
  }

  export type HostRoleUpsertWithWhereUniqueWithoutUserInput = {
    where: HostRoleWhereUniqueInput
    update: XOR<HostRoleUpdateWithoutUserInput, HostRoleUncheckedUpdateWithoutUserInput>
    create: XOR<HostRoleCreateWithoutUserInput, HostRoleUncheckedCreateWithoutUserInput>
  }

  export type HostRoleUpdateWithWhereUniqueWithoutUserInput = {
    where: HostRoleWhereUniqueInput
    data: XOR<HostRoleUpdateWithoutUserInput, HostRoleUncheckedUpdateWithoutUserInput>
  }

  export type HostRoleUpdateManyWithWhereWithoutUserInput = {
    where: HostRoleScalarWhereInput
    data: XOR<HostRoleUpdateManyMutationInput, HostRoleUncheckedUpdateManyWithoutHostRolesInput>
  }

  export type HostRoleScalarWhereInput = {
    AND?: Enumerable<HostRoleScalarWhereInput>
    OR?: Enumerable<HostRoleScalarWhereInput>
    NOT?: Enumerable<HostRoleScalarWhereInput>
    hostId?: IntFilter | number
    userId?: StringFilter | string
    role?: StringFilter | string
  }

  export type TicketUpsertWithWhereUniqueWithoutUserInput = {
    where: TicketWhereUniqueInput
    update: XOR<TicketUpdateWithoutUserInput, TicketUncheckedUpdateWithoutUserInput>
    create: XOR<TicketCreateWithoutUserInput, TicketUncheckedCreateWithoutUserInput>
  }

  export type TicketUpdateWithWhereUniqueWithoutUserInput = {
    where: TicketWhereUniqueInput
    data: XOR<TicketUpdateWithoutUserInput, TicketUncheckedUpdateWithoutUserInput>
  }

  export type TicketUpdateManyWithWhereWithoutUserInput = {
    where: TicketScalarWhereInput
    data: XOR<TicketUpdateManyMutationInput, TicketUncheckedUpdateManyWithoutTicketsInput>
  }

  export type HostUpsertWithWhereUniqueWithoutCreatorInput = {
    where: HostWhereUniqueInput
    update: XOR<HostUpdateWithoutCreatorInput, HostUncheckedUpdateWithoutCreatorInput>
    create: XOR<HostCreateWithoutCreatorInput, HostUncheckedCreateWithoutCreatorInput>
  }

  export type HostUpdateWithWhereUniqueWithoutCreatorInput = {
    where: HostWhereUniqueInput
    data: XOR<HostUpdateWithoutCreatorInput, HostUncheckedUpdateWithoutCreatorInput>
  }

  export type HostUpdateManyWithWhereWithoutCreatorInput = {
    where: HostScalarWhereInput
    data: XOR<HostUpdateManyMutationInput, HostUncheckedUpdateManyWithoutHostsInput>
  }

  export type HostScalarWhereInput = {
    AND?: Enumerable<HostScalarWhereInput>
    OR?: Enumerable<HostScalarWhereInput>
    NOT?: Enumerable<HostScalarWhereInput>
    id?: IntFilter | number
    name?: StringFilter | string
    description?: StringNullableFilter | string | null
    createdBy?: StringFilter | string
    imageUrl?: StringNullableFilter | string | null
  }

  export type EventCreateWithoutHostInput = {
    name?: string
    description?: string | null
    published?: boolean
    prices?: EventCreatepricesInput | Enumerable<InputJsonValue>
    media?: EventCreatemediaInput | Enumerable<string>
    thumbnail?: string | null
    hashtags?: EventCreatehashtagsInput | Enumerable<string>
    maxTickets?: number
    location?: string
    tickets?: TicketCreateNestedManyWithoutEventInput
    stripeProductId?: string | null
    snsTopicArn?: string | null
    startTime: Date | string
    endTime: Date | string
    eventNotifications?: EventNotificationCreateNestedManyWithoutEventInput
  }

  export type EventUncheckedCreateWithoutHostInput = {
    id?: number
    name?: string
    description?: string | null
    published?: boolean
    prices?: EventCreatepricesInput | Enumerable<InputJsonValue>
    media?: EventCreatemediaInput | Enumerable<string>
    thumbnail?: string | null
    hashtags?: EventCreatehashtagsInput | Enumerable<string>
    maxTickets?: number
    location?: string
    tickets?: TicketUncheckedCreateNestedManyWithoutEventInput
    stripeProductId?: string | null
    snsTopicArn?: string | null
    startTime: Date | string
    endTime: Date | string
    eventNotifications?: EventNotificationUncheckedCreateNestedManyWithoutEventInput
  }

  export type EventCreateOrConnectWithoutHostInput = {
    where: EventWhereUniqueInput
    create: XOR<EventCreateWithoutHostInput, EventUncheckedCreateWithoutHostInput>
  }

  export type EventCreateManyHostInputEnvelope = {
    data: Enumerable<EventCreateManyHostInput>
    skipDuplicates?: boolean
  }

  export type HostRoleCreateWithoutHostInput = {
    user: UserCreateNestedOneWithoutHostRolesInput
    role: string
  }

  export type HostRoleUncheckedCreateWithoutHostInput = {
    userId: string
    role: string
  }

  export type HostRoleCreateOrConnectWithoutHostInput = {
    where: HostRoleWhereUniqueInput
    create: XOR<HostRoleCreateWithoutHostInput, HostRoleUncheckedCreateWithoutHostInput>
  }

  export type HostRoleCreateManyHostInputEnvelope = {
    data: Enumerable<HostRoleCreateManyHostInput>
    skipDuplicates?: boolean
  }

  export type UserCreateWithoutHostsInput = {
    id: string
    email: string
    name?: string | null
    roles?: UserCreaterolesInput | Enumerable<string>
    hostRoles?: HostRoleCreateNestedManyWithoutUserInput
    tickets?: TicketCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutHostsInput = {
    id: string
    email: string
    name?: string | null
    roles?: UserCreaterolesInput | Enumerable<string>
    hostRoles?: HostRoleUncheckedCreateNestedManyWithoutUserInput
    tickets?: TicketUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutHostsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutHostsInput, UserUncheckedCreateWithoutHostsInput>
  }

  export type EventUpsertWithWhereUniqueWithoutHostInput = {
    where: EventWhereUniqueInput
    update: XOR<EventUpdateWithoutHostInput, EventUncheckedUpdateWithoutHostInput>
    create: XOR<EventCreateWithoutHostInput, EventUncheckedCreateWithoutHostInput>
  }

  export type EventUpdateWithWhereUniqueWithoutHostInput = {
    where: EventWhereUniqueInput
    data: XOR<EventUpdateWithoutHostInput, EventUncheckedUpdateWithoutHostInput>
  }

  export type EventUpdateManyWithWhereWithoutHostInput = {
    where: EventScalarWhereInput
    data: XOR<EventUpdateManyMutationInput, EventUncheckedUpdateManyWithoutEventsInput>
  }

  export type EventScalarWhereInput = {
    AND?: Enumerable<EventScalarWhereInput>
    OR?: Enumerable<EventScalarWhereInput>
    NOT?: Enumerable<EventScalarWhereInput>
    id?: IntFilter | number
    name?: StringFilter | string
    description?: StringNullableFilter | string | null
    published?: BoolFilter | boolean
    prices?: JsonNullableListFilter
    media?: StringNullableListFilter
    thumbnail?: StringNullableFilter | string | null
    hashtags?: StringNullableListFilter
    maxTickets?: IntFilter | number
    location?: StringFilter | string
    stripeProductId?: StringNullableFilter | string | null
    snsTopicArn?: StringNullableFilter | string | null
    startTime?: DateTimeFilter | Date | string
    endTime?: DateTimeFilter | Date | string
    hostId?: IntFilter | number
  }

  export type HostRoleUpsertWithWhereUniqueWithoutHostInput = {
    where: HostRoleWhereUniqueInput
    update: XOR<HostRoleUpdateWithoutHostInput, HostRoleUncheckedUpdateWithoutHostInput>
    create: XOR<HostRoleCreateWithoutHostInput, HostRoleUncheckedCreateWithoutHostInput>
  }

  export type HostRoleUpdateWithWhereUniqueWithoutHostInput = {
    where: HostRoleWhereUniqueInput
    data: XOR<HostRoleUpdateWithoutHostInput, HostRoleUncheckedUpdateWithoutHostInput>
  }

  export type HostRoleUpdateManyWithWhereWithoutHostInput = {
    where: HostRoleScalarWhereInput
    data: XOR<HostRoleUpdateManyMutationInput, HostRoleUncheckedUpdateManyWithoutHostRolesInput>
  }

  export type UserUpsertWithoutHostsInput = {
    update: XOR<UserUpdateWithoutHostsInput, UserUncheckedUpdateWithoutHostsInput>
    create: XOR<UserCreateWithoutHostsInput, UserUncheckedCreateWithoutHostsInput>
  }

  export type UserUpdateWithoutHostsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    roles?: UserUpdaterolesInput | Enumerable<string>
    hostRoles?: HostRoleUpdateManyWithoutUserNestedInput
    tickets?: TicketUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutHostsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    roles?: UserUpdaterolesInput | Enumerable<string>
    hostRoles?: HostRoleUncheckedUpdateManyWithoutUserNestedInput
    tickets?: TicketUncheckedUpdateManyWithoutUserNestedInput
  }

  export type HostCreateWithoutHostRolesInput = {
    name?: string
    description?: string | null
    events?: EventCreateNestedManyWithoutHostInput
    creator: UserCreateNestedOneWithoutHostsInput
    imageUrl?: string | null
  }

  export type HostUncheckedCreateWithoutHostRolesInput = {
    id?: number
    name?: string
    description?: string | null
    events?: EventUncheckedCreateNestedManyWithoutHostInput
    createdBy: string
    imageUrl?: string | null
  }

  export type HostCreateOrConnectWithoutHostRolesInput = {
    where: HostWhereUniqueInput
    create: XOR<HostCreateWithoutHostRolesInput, HostUncheckedCreateWithoutHostRolesInput>
  }

  export type UserCreateWithoutHostRolesInput = {
    id: string
    email: string
    name?: string | null
    roles?: UserCreaterolesInput | Enumerable<string>
    tickets?: TicketCreateNestedManyWithoutUserInput
    hosts?: HostCreateNestedManyWithoutCreatorInput
  }

  export type UserUncheckedCreateWithoutHostRolesInput = {
    id: string
    email: string
    name?: string | null
    roles?: UserCreaterolesInput | Enumerable<string>
    tickets?: TicketUncheckedCreateNestedManyWithoutUserInput
    hosts?: HostUncheckedCreateNestedManyWithoutCreatorInput
  }

  export type UserCreateOrConnectWithoutHostRolesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutHostRolesInput, UserUncheckedCreateWithoutHostRolesInput>
  }

  export type HostUpsertWithoutHostRolesInput = {
    update: XOR<HostUpdateWithoutHostRolesInput, HostUncheckedUpdateWithoutHostRolesInput>
    create: XOR<HostCreateWithoutHostRolesInput, HostUncheckedCreateWithoutHostRolesInput>
  }

  export type HostUpdateWithoutHostRolesInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    events?: EventUpdateManyWithoutHostNestedInput
    creator?: UserUpdateOneRequiredWithoutHostsNestedInput
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type HostUncheckedUpdateWithoutHostRolesInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    events?: EventUncheckedUpdateManyWithoutHostNestedInput
    createdBy?: StringFieldUpdateOperationsInput | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UserUpsertWithoutHostRolesInput = {
    update: XOR<UserUpdateWithoutHostRolesInput, UserUncheckedUpdateWithoutHostRolesInput>
    create: XOR<UserCreateWithoutHostRolesInput, UserUncheckedCreateWithoutHostRolesInput>
  }

  export type UserUpdateWithoutHostRolesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    roles?: UserUpdaterolesInput | Enumerable<string>
    tickets?: TicketUpdateManyWithoutUserNestedInput
    hosts?: HostUpdateManyWithoutCreatorNestedInput
  }

  export type UserUncheckedUpdateWithoutHostRolesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    roles?: UserUpdaterolesInput | Enumerable<string>
    tickets?: TicketUncheckedUpdateManyWithoutUserNestedInput
    hosts?: HostUncheckedUpdateManyWithoutCreatorNestedInput
  }

  export type EventCreateWithoutTicketsInput = {
    name?: string
    description?: string | null
    published?: boolean
    prices?: EventCreatepricesInput | Enumerable<InputJsonValue>
    media?: EventCreatemediaInput | Enumerable<string>
    thumbnail?: string | null
    hashtags?: EventCreatehashtagsInput | Enumerable<string>
    maxTickets?: number
    location?: string
    stripeProductId?: string | null
    snsTopicArn?: string | null
    startTime: Date | string
    endTime: Date | string
    eventNotifications?: EventNotificationCreateNestedManyWithoutEventInput
    host: HostCreateNestedOneWithoutEventsInput
  }

  export type EventUncheckedCreateWithoutTicketsInput = {
    id?: number
    name?: string
    description?: string | null
    published?: boolean
    prices?: EventCreatepricesInput | Enumerable<InputJsonValue>
    media?: EventCreatemediaInput | Enumerable<string>
    thumbnail?: string | null
    hashtags?: EventCreatehashtagsInput | Enumerable<string>
    maxTickets?: number
    location?: string
    stripeProductId?: string | null
    snsTopicArn?: string | null
    startTime: Date | string
    endTime: Date | string
    eventNotifications?: EventNotificationUncheckedCreateNestedManyWithoutEventInput
    hostId: number
  }

  export type EventCreateOrConnectWithoutTicketsInput = {
    where: EventWhereUniqueInput
    create: XOR<EventCreateWithoutTicketsInput, EventUncheckedCreateWithoutTicketsInput>
  }

  export type UserCreateWithoutTicketsInput = {
    id: string
    email: string
    name?: string | null
    roles?: UserCreaterolesInput | Enumerable<string>
    hostRoles?: HostRoleCreateNestedManyWithoutUserInput
    hosts?: HostCreateNestedManyWithoutCreatorInput
  }

  export type UserUncheckedCreateWithoutTicketsInput = {
    id: string
    email: string
    name?: string | null
    roles?: UserCreaterolesInput | Enumerable<string>
    hostRoles?: HostRoleUncheckedCreateNestedManyWithoutUserInput
    hosts?: HostUncheckedCreateNestedManyWithoutCreatorInput
  }

  export type UserCreateOrConnectWithoutTicketsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutTicketsInput, UserUncheckedCreateWithoutTicketsInput>
  }

  export type EventUpsertWithoutTicketsInput = {
    update: XOR<EventUpdateWithoutTicketsInput, EventUncheckedUpdateWithoutTicketsInput>
    create: XOR<EventCreateWithoutTicketsInput, EventUncheckedCreateWithoutTicketsInput>
  }

  export type EventUpdateWithoutTicketsInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    published?: BoolFieldUpdateOperationsInput | boolean
    prices?: EventUpdatepricesInput | Enumerable<InputJsonValue>
    media?: EventUpdatemediaInput | Enumerable<string>
    thumbnail?: NullableStringFieldUpdateOperationsInput | string | null
    hashtags?: EventUpdatehashtagsInput | Enumerable<string>
    maxTickets?: IntFieldUpdateOperationsInput | number
    location?: StringFieldUpdateOperationsInput | string
    stripeProductId?: NullableStringFieldUpdateOperationsInput | string | null
    snsTopicArn?: NullableStringFieldUpdateOperationsInput | string | null
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    eventNotifications?: EventNotificationUpdateManyWithoutEventNestedInput
    host?: HostUpdateOneRequiredWithoutEventsNestedInput
  }

  export type EventUncheckedUpdateWithoutTicketsInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    published?: BoolFieldUpdateOperationsInput | boolean
    prices?: EventUpdatepricesInput | Enumerable<InputJsonValue>
    media?: EventUpdatemediaInput | Enumerable<string>
    thumbnail?: NullableStringFieldUpdateOperationsInput | string | null
    hashtags?: EventUpdatehashtagsInput | Enumerable<string>
    maxTickets?: IntFieldUpdateOperationsInput | number
    location?: StringFieldUpdateOperationsInput | string
    stripeProductId?: NullableStringFieldUpdateOperationsInput | string | null
    snsTopicArn?: NullableStringFieldUpdateOperationsInput | string | null
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    eventNotifications?: EventNotificationUncheckedUpdateManyWithoutEventNestedInput
    hostId?: IntFieldUpdateOperationsInput | number
  }

  export type UserUpsertWithoutTicketsInput = {
    update: XOR<UserUpdateWithoutTicketsInput, UserUncheckedUpdateWithoutTicketsInput>
    create: XOR<UserCreateWithoutTicketsInput, UserUncheckedCreateWithoutTicketsInput>
  }

  export type UserUpdateWithoutTicketsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    roles?: UserUpdaterolesInput | Enumerable<string>
    hostRoles?: HostRoleUpdateManyWithoutUserNestedInput
    hosts?: HostUpdateManyWithoutCreatorNestedInput
  }

  export type UserUncheckedUpdateWithoutTicketsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    roles?: UserUpdaterolesInput | Enumerable<string>
    hostRoles?: HostRoleUncheckedUpdateManyWithoutUserNestedInput
    hosts?: HostUncheckedUpdateManyWithoutCreatorNestedInput
  }

  export type TicketCreateManyEventInput = {
    id?: number
    stripeSessionId: string
    stripeChargeId: string
    receiptUrl: string
    customerName: string
    customerPhoneNumber: string
    customerEmail: string
    userId?: string | null
    ticketQuantity: number
    used: boolean
    purchasedAt?: Date | string
  }

  export type EventNotificationCreateManyEventInput = {
    id?: number
    messageTime: Date | string
    message: string
    sent?: boolean
  }

  export type TicketUpdateWithoutEventInput = {
    stripeSessionId?: StringFieldUpdateOperationsInput | string
    stripeChargeId?: StringFieldUpdateOperationsInput | string
    receiptUrl?: StringFieldUpdateOperationsInput | string
    customerName?: StringFieldUpdateOperationsInput | string
    customerPhoneNumber?: StringFieldUpdateOperationsInput | string
    customerEmail?: StringFieldUpdateOperationsInput | string
    user?: UserUpdateOneWithoutTicketsNestedInput
    ticketQuantity?: IntFieldUpdateOperationsInput | number
    used?: BoolFieldUpdateOperationsInput | boolean
    purchasedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TicketUncheckedUpdateWithoutEventInput = {
    id?: IntFieldUpdateOperationsInput | number
    stripeSessionId?: StringFieldUpdateOperationsInput | string
    stripeChargeId?: StringFieldUpdateOperationsInput | string
    receiptUrl?: StringFieldUpdateOperationsInput | string
    customerName?: StringFieldUpdateOperationsInput | string
    customerPhoneNumber?: StringFieldUpdateOperationsInput | string
    customerEmail?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    ticketQuantity?: IntFieldUpdateOperationsInput | number
    used?: BoolFieldUpdateOperationsInput | boolean
    purchasedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TicketUncheckedUpdateManyWithoutTicketsInput = {
    id?: IntFieldUpdateOperationsInput | number
    stripeSessionId?: StringFieldUpdateOperationsInput | string
    stripeChargeId?: StringFieldUpdateOperationsInput | string
    receiptUrl?: StringFieldUpdateOperationsInput | string
    customerName?: StringFieldUpdateOperationsInput | string
    customerPhoneNumber?: StringFieldUpdateOperationsInput | string
    customerEmail?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    ticketQuantity?: IntFieldUpdateOperationsInput | number
    used?: BoolFieldUpdateOperationsInput | boolean
    purchasedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventNotificationUpdateWithoutEventInput = {
    messageTime?: DateTimeFieldUpdateOperationsInput | Date | string
    message?: StringFieldUpdateOperationsInput | string
    sent?: BoolFieldUpdateOperationsInput | boolean
  }

  export type EventNotificationUncheckedUpdateWithoutEventInput = {
    id?: IntFieldUpdateOperationsInput | number
    messageTime?: DateTimeFieldUpdateOperationsInput | Date | string
    message?: StringFieldUpdateOperationsInput | string
    sent?: BoolFieldUpdateOperationsInput | boolean
  }

  export type EventNotificationUncheckedUpdateManyWithoutEventNotificationsInput = {
    id?: IntFieldUpdateOperationsInput | number
    messageTime?: DateTimeFieldUpdateOperationsInput | Date | string
    message?: StringFieldUpdateOperationsInput | string
    sent?: BoolFieldUpdateOperationsInput | boolean
  }

  export type HostRoleCreateManyUserInput = {
    hostId: number
    role: string
  }

  export type TicketCreateManyUserInput = {
    id?: number
    eventId: number
    stripeSessionId: string
    stripeChargeId: string
    receiptUrl: string
    customerName: string
    customerPhoneNumber: string
    customerEmail: string
    ticketQuantity: number
    used: boolean
    purchasedAt?: Date | string
  }

  export type HostCreateManyCreatorInput = {
    id?: number
    name?: string
    description?: string | null
    imageUrl?: string | null
  }

  export type HostRoleUpdateWithoutUserInput = {
    host?: HostUpdateOneRequiredWithoutHostRolesNestedInput
    role?: StringFieldUpdateOperationsInput | string
  }

  export type HostRoleUncheckedUpdateWithoutUserInput = {
    hostId?: IntFieldUpdateOperationsInput | number
    role?: StringFieldUpdateOperationsInput | string
  }

  export type HostRoleUncheckedUpdateManyWithoutHostRolesInput = {
    hostId?: IntFieldUpdateOperationsInput | number
    role?: StringFieldUpdateOperationsInput | string
  }

  export type TicketUpdateWithoutUserInput = {
    event?: EventUpdateOneRequiredWithoutTicketsNestedInput
    stripeSessionId?: StringFieldUpdateOperationsInput | string
    stripeChargeId?: StringFieldUpdateOperationsInput | string
    receiptUrl?: StringFieldUpdateOperationsInput | string
    customerName?: StringFieldUpdateOperationsInput | string
    customerPhoneNumber?: StringFieldUpdateOperationsInput | string
    customerEmail?: StringFieldUpdateOperationsInput | string
    ticketQuantity?: IntFieldUpdateOperationsInput | number
    used?: BoolFieldUpdateOperationsInput | boolean
    purchasedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TicketUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    eventId?: IntFieldUpdateOperationsInput | number
    stripeSessionId?: StringFieldUpdateOperationsInput | string
    stripeChargeId?: StringFieldUpdateOperationsInput | string
    receiptUrl?: StringFieldUpdateOperationsInput | string
    customerName?: StringFieldUpdateOperationsInput | string
    customerPhoneNumber?: StringFieldUpdateOperationsInput | string
    customerEmail?: StringFieldUpdateOperationsInput | string
    ticketQuantity?: IntFieldUpdateOperationsInput | number
    used?: BoolFieldUpdateOperationsInput | boolean
    purchasedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type HostUpdateWithoutCreatorInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    events?: EventUpdateManyWithoutHostNestedInput
    hostRoles?: HostRoleUpdateManyWithoutHostNestedInput
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type HostUncheckedUpdateWithoutCreatorInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    events?: EventUncheckedUpdateManyWithoutHostNestedInput
    hostRoles?: HostRoleUncheckedUpdateManyWithoutHostNestedInput
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type HostUncheckedUpdateManyWithoutHostsInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type EventCreateManyHostInput = {
    id?: number
    name?: string
    description?: string | null
    published?: boolean
    prices?: EventCreatepricesInput | Enumerable<InputJsonValue>
    media?: EventCreatemediaInput | Enumerable<string>
    thumbnail?: string | null
    hashtags?: EventCreatehashtagsInput | Enumerable<string>
    maxTickets?: number
    location?: string
    stripeProductId?: string | null
    snsTopicArn?: string | null
    startTime: Date | string
    endTime: Date | string
  }

  export type HostRoleCreateManyHostInput = {
    userId: string
    role: string
  }

  export type EventUpdateWithoutHostInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    published?: BoolFieldUpdateOperationsInput | boolean
    prices?: EventUpdatepricesInput | Enumerable<InputJsonValue>
    media?: EventUpdatemediaInput | Enumerable<string>
    thumbnail?: NullableStringFieldUpdateOperationsInput | string | null
    hashtags?: EventUpdatehashtagsInput | Enumerable<string>
    maxTickets?: IntFieldUpdateOperationsInput | number
    location?: StringFieldUpdateOperationsInput | string
    tickets?: TicketUpdateManyWithoutEventNestedInput
    stripeProductId?: NullableStringFieldUpdateOperationsInput | string | null
    snsTopicArn?: NullableStringFieldUpdateOperationsInput | string | null
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    eventNotifications?: EventNotificationUpdateManyWithoutEventNestedInput
  }

  export type EventUncheckedUpdateWithoutHostInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    published?: BoolFieldUpdateOperationsInput | boolean
    prices?: EventUpdatepricesInput | Enumerable<InputJsonValue>
    media?: EventUpdatemediaInput | Enumerable<string>
    thumbnail?: NullableStringFieldUpdateOperationsInput | string | null
    hashtags?: EventUpdatehashtagsInput | Enumerable<string>
    maxTickets?: IntFieldUpdateOperationsInput | number
    location?: StringFieldUpdateOperationsInput | string
    tickets?: TicketUncheckedUpdateManyWithoutEventNestedInput
    stripeProductId?: NullableStringFieldUpdateOperationsInput | string | null
    snsTopicArn?: NullableStringFieldUpdateOperationsInput | string | null
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    eventNotifications?: EventNotificationUncheckedUpdateManyWithoutEventNestedInput
  }

  export type EventUncheckedUpdateManyWithoutEventsInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    published?: BoolFieldUpdateOperationsInput | boolean
    prices?: EventUpdatepricesInput | Enumerable<InputJsonValue>
    media?: EventUpdatemediaInput | Enumerable<string>
    thumbnail?: NullableStringFieldUpdateOperationsInput | string | null
    hashtags?: EventUpdatehashtagsInput | Enumerable<string>
    maxTickets?: IntFieldUpdateOperationsInput | number
    location?: StringFieldUpdateOperationsInput | string
    stripeProductId?: NullableStringFieldUpdateOperationsInput | string | null
    snsTopicArn?: NullableStringFieldUpdateOperationsInput | string | null
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type HostRoleUpdateWithoutHostInput = {
    user?: UserUpdateOneRequiredWithoutHostRolesNestedInput
    role?: StringFieldUpdateOperationsInput | string
  }

  export type HostRoleUncheckedUpdateWithoutHostInput = {
    userId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
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