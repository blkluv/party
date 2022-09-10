
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum
} = require('./runtime/index-browser')


const Prisma = {}

exports.Prisma = Prisma

/**
 * Prisma Client JS version: 4.3.1
 * Query Engine version: c875e43600dfe042452e0b868f7a48b817b9640b
 */
Prisma.prismaVersion = {
  client: "4.3.1",
  engine: "c875e43600dfe042452e0b868f7a48b817b9640b"
}

Prisma.PrismaClientKnownRequestError = () => {
  throw new Error(`PrismaClientKnownRequestError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  throw new Error(`PrismaClientUnknownRequestError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientRustPanicError = () => {
  throw new Error(`PrismaClientRustPanicError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientInitializationError = () => {
  throw new Error(`PrismaClientInitializationError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientValidationError = () => {
  throw new Error(`PrismaClientValidationError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.NotFoundError = () => {
  throw new Error(`NotFoundError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  throw new Error(`sqltag is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.empty = () => {
  throw new Error(`empty is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.join = () => {
  throw new Error(`join is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.raw = () => {
  throw new Error(`raw is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.validator = () => (val) => val

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}

/**
 * Enums
 */
// Based on
// https://github.com/microsoft/TypeScript/issues/3192#issuecomment-261720275
function makeEnum(x) { return x; }

exports.Prisma.ArtistScalarFieldEnum = makeEnum({
  id: 'id',
  name: 'name',
  description: 'description',
  imageUrl: 'imageUrl',
  price: 'price',
  phoneNumber: 'phoneNumber',
  email: 'email',
  website: 'website',
  genres: 'genres'
});

exports.Prisma.EventNotificationScalarFieldEnum = makeEnum({
  id: 'id',
  messageTime: 'messageTime',
  message: 'message',
  eventId: 'eventId',
  sent: 'sent'
});

exports.Prisma.EventScalarFieldEnum = makeEnum({
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
});

exports.Prisma.HostRoleScalarFieldEnum = makeEnum({
  hostId: 'hostId',
  userId: 'userId',
  role: 'role'
});

exports.Prisma.HostScalarFieldEnum = makeEnum({
  id: 'id',
  name: 'name',
  description: 'description',
  createdBy: 'createdBy',
  imageUrl: 'imageUrl'
});

exports.Prisma.QueryMode = makeEnum({
  default: 'default',
  insensitive: 'insensitive'
});

exports.Prisma.ServiceScalarFieldEnum = makeEnum({
  id: 'id',
  name: 'name',
  description: 'description',
  imageUrl: 'imageUrl',
  price: 'price'
});

exports.Prisma.SortOrder = makeEnum({
  asc: 'asc',
  desc: 'desc'
});

exports.Prisma.TicketScalarFieldEnum = makeEnum({
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
});

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = makeEnum({
  id: 'id',
  email: 'email',
  name: 'name',
  roles: 'roles'
});


exports.Prisma.ModelName = makeEnum({
  Event: 'Event',
  EventNotification: 'EventNotification',
  User: 'User',
  Host: 'Host',
  HostRole: 'HostRole',
  Ticket: 'Ticket',
  Service: 'Service',
  Artist: 'Artist'
});

/**
 * Create the Client
 */
class PrismaClient {
  constructor() {
    throw new Error(
      `PrismaClient is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
    )
  }
}
exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
