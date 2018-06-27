var dbjs = require( 'database-js' );
var driver = require( '../' );
var assert = require( 'assert' );

describe( 'database-js-mssql', function () {

    var connStr = 'mssql:///root:123456@localhost/testdb';

    it( 'queries an existing table correctly', function( done ) {
        var conn;
        try {
            conn = new dbjs.Connection( connStr, driver );
        } catch ( err ) {
            assert.fail( err.message );
            return;
        }

        var st = conn.prepareStatement( 'SELECT * FROM user WHERE username = ?' );
        var search = 'alice';
        st.query( search )
            .then( function( data ) {
                assert.equal( data[ 0 ].username, search );
                done();
            } )
            .catch( function( err ) {
                done( err );
            } );
    } );

} );