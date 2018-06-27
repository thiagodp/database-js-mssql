# database-js-mssql

> Database-js driver for SQL Server that works on Linux, Mac, and Windows

!!! WARNING !!! - This library is under development and IS NOT STABLE YET.

Works with MS SQL Server 2000-2017 through the  [TDS protocol](http://msdn.microsoft.com/en-us/library/dd304523.aspx).


## Install

```bash
npm install --save database-js-mssql
```

## Example

```js
var Connection = require('database-js').Connection;

(async function() {
    let conn, statement, results;
    try {
        conn = new Connection('mssql:///username:password@localhost/database');
        statement = conn.prepareStatement("SELECT * FROM states WHERE state = ?");
        results = await statement.query("South Dakota");
        console.log(results);
    } catch (reason) {
        console.log(reason);
    } finally {
        if (conn) {
            await conn.close();
        }
        process.exit(0);
    }
})();
```

## See also

- [database-js](https://github.com/mlaanderson/database-js)