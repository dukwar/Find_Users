## Поиск пользователей (Find Users)

Simple table of users filtered by name (first + last).

Application components:
- loading indicator
- filter by username - input field + reset button
- table with users

Application features:
- When you enter a name in the filter field, a table is generated with users matching
  on request (only on the client). If nothing is found, is displayed
  message that nothing was found.
- In order to avoid unnecessary redrawings when entering in the filtering field, the decorator is used
  debounce.
- When you hover over a cell with a user photo, a tooltip is displayed with a picture of a higher
  permissions.

Technologies used:
- HTML
- CSS
- Javascript
- Parcel

You can watch this work [here](https://hungry-lumiere-27013e.netlify.app/)

All files are in the root folder.

You can run this project locally just do:
- clone branch `main` with `https://github.com/dukwar/find_users.git` or fork it and then clone it from your forked repo
- `cd find_users`
- `npm install`
- `npm run start`