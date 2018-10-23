var mssql = require('mssql');

/**
 * Database-js driver for MS SQL Server
 *
 * @author  Thiago Delgado Pinto
 *
 * @see     https://github.com/mlaanderson/database-js
 * @see     https://github.com/tediousjs/node-mssql
 * @see     https://github.com/tediousjs/tedious
 */
class MsSql {

    constructor( connection ) {
        this.connection = connection;
        this._isConnected = false;

        this.pool = null;
        this.transaction = null;
        this._inTransaction = false;
    }

    /**
     * Creates a connection pool on demand.
     *
     * @returns Promise< Connection >
     */
    async _pool() {

        if ( this._isConnected ) {
            return this.pool;
        }

        var connection = this.connection;

        if ('string' === typeof connection) {
            this.pool = await mssql.connect( connection );
            this._isConnected = true;
            return this.pool;
        }

        var convertedConnection = {
            server: connection.Hostname || 'localhost',
            port: parseInt(connection.Port) || 1433,
            database: connection.Database,
            user: connection.Username,
            password: connection.Password,
            options: connection.options || {}
        };

        var config = Object.assign(
            convertedConnection,
            {
                options: {
                    abortTransactionOnError: true,
                    encrypt: false
                }
            }
        );

        this.pool = await mssql.connect( config );
        this._isConnected = true;
        return this.pool;
    }

    /**
     * Performs a query or data manipulation command.
     *
     * @param {string} sql
     * @returns Promise< Array< object > >
     */
    async query(sql) {
        let pool = await this._pool();
        let result = await pool.request().query( sql );
        return result.recordset;
    }

    /**
     * Executes a data manipulation command.
     *
     * @param {string} sql
     * @returns Promise< Array< object > >
     */
    async execute(sql) {
        return await this.query(sql);
    }

    /**
     * Closes a database connection.
     *
     * @returns Promise<>
     */
    async close() {
        if ( this._isConnected ) {
            let pool = await this._pool();
            await pool.close();
            this._isConnected = false;
        }
    }

    /**
     * Checks whether transaction is supported.
     *
     * @returns boolean
     */
    isTransactionSupported() {
        return true;
    }

    /**
     * Checks whether it is in a transaction.
     *
     * @returns boolean
     */
    inTransaction() {
        return this._inTransaction;
    }

    /**
     * Begins a transaction.
     *
     * @returns Promise< boolean >
     */
    async beginTransaction() {
        if ( this.inTransaction() ) {
            false;
        }
        let pool = await this._pool();
        this.transaction = new mssql.Transaction( pool );
        this._inTransaction = true;
        return this.transaction.begin();
    }

    /**
     * Confirms a transaction.
     *
     * @returns Promise< boolean >
     */
    async commit() {
        if ( ! this.inTransaction() ) {
            return false;
        }
        this._inTransaction = false;
        return this.transaction.commit();
    }

    /**
     * Undoes a transaction.
     *
     * @returns Promise< boolean >
     */
    async rollback() {
        if ( ! this.inTransaction() ) {
            return false;
        }
        this._inTransaction = false;
        return this.transaction.rollback();
    }

}

module.exports = {
    open: function(connection) {
        return new MsSql( connection );
    }
};
