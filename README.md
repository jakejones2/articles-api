## Connecting to databases with dotenv

To get this repo working, add two .env files for both testing and development:<br>

- `.env.development`<br>
- `.env.test`<br>

These files should be in the top level folder in the repo.<br>
Inside these .env files you must set `PGDATABASE` to your testing and development database names respectively.<br>
Make sure that these databases are created before running `npm run seed`.

### Example

Place the following inside `.env.development`:<br>

```
PGDATABASE=my_dev_database
```
