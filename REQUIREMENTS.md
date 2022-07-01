# Groups App/Money Manager

Idea is inspired by [Splitwise](https://www.splitwise.com/)

## Intro

Roles:

- Group admin: Can edit group details, add members, remove members, and delete group
- User: Can add expenses, view expenses, add photos, delete their own photos

Keywords:

- Group: Group of users with a single group admin. Group members can add transactions to the group
- Transaction: Dollar value representing an exchange of money between two or more users.

### Requirements

- Users must be able to login with their Google account (OAuth)
- Users must be able to create a group
- Users must be able to invite members to their group
- Users must be able to accept or decline group invitations
- Groups must have a name
- Groups must have a photo
- Transactions must have a value, name, and date

- Users should be able to invite members to groups using a combination of email and name
- Users should be able to view the sum of money that they owe the group (if any)
- Users should be able to split transactions between themselves and other users in the group

- Transactions could have categories assigned

### Pages

- Home: Shows the user's most recently accessed group. Within this page, we want to show the group's name, photo, members, and the sum of money that the user owes the group. This page will also contain a list of transactions within the group ordered by date.
- Sign In: List OAuth options. We'll just have Google for now.
- New Transaction: Allows a user to create a new transaction. We will need to collect the value, description, and methods by which this transaction is split. For example, if the group contains two users we will just need to collect what percentage of the transaction each user pays. If the group contains more than two users, we will have to collect the split percentages as well as the users' names.

### Components

- Transaction: Shows the description, value, and date of a transaction. These will be organized as a series of rows on the home page. Transactions have two additional tags associated with them: "paid" and "owed". Paid would signify a payment towards the group that reduces a user's amount owed. Owed would signify a user's debt, towards the group.
- User Search: Allows users to search for other users by name/email so that they can be added to a group.
