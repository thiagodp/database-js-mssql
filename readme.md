# database-js-mssql

> Database-js driver for SQL Server that works on Linux, Mac, and Windows

This driver is a wrapper for [node-mssql](https://github.com/thiagodp/database-js-mssql.git) and works with MS SQL Server 2000-2017.

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
    }
})();
```

## See also

- [database-js](https://github.com/mlaanderson/database-js)

## License

[MIT](LICENSE) © [Thiago Delgado Pinto](https://github.com/thiagodp)
