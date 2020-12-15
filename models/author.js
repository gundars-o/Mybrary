const mongoose = require( "mongoose" );
const Book = require( "./book" );
const authorSchema = new mongoose.Schema( {
    name: {
        type: String,
        required: true
    }
} );
/*Mongoose allows to do something before or after certain action occures.*/
authorSchema.pre( "remove", function( next ) {
    Book.find( { author: this.id }, ( err, books ) => {
        if ( err ) {
            next( err );
        } else if ( books.length > 0 ) {
            next( new Error( "This author has books still" ) );
        } else {
            next()/*ok to continue to remove the author*/;
        };
    } );
} );
module.exports = mongoose.model( "Author"/*name of table in database*/, authorSchema );