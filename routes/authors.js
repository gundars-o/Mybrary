const express = require( "express" );
const router = express.Router();
const Author = require( "../models/author" );
const Book = require( "../models/book" );
// All Authors Route
router.get( "/", async ( req, res ) => {
    let searchOptions ={};
    if ( req.query.name != null && req.query.name !== "" ) {
        searchOptions.name = new RegExp( req.query.name, "i" );
    };
    try {
        const authors = await Author.find( searchOptions );
        res.render( "authors/index", {
            authors: authors,
            searchOptions: req.query
        } );
    } catch {
        res.redirect( '/' );
    };
} );
// New Author Route
router.get( "/new", ( req, res ) => {
    res.render( "authors/new", { author: new Author() } );
} );
// Create Author Route
router.post( "/", async ( req,res ) => {/*npm i body-parser - no need for this?*/
    const author = new Author( { 
        name: req.body.name
    } );
    try {
        const newAuthor = await author.save();
        res.redirect( `authors/${ newAuthor.id }` );
    } catch {
         res.render( "authors/new", {
             author: author,
             errorMessage: "Error creating Author"
         } );
    };
} );
/*Show Author*/
router.get( "/:id", async ( req, res ) => {
    try {
        const author = await Author.findById( req.params.id );
        const books = await Book.find( { author: author.id } ).limit( 6 ).exec();
        res.render( "authors/show", {
            author: author,
            booksByAuthor: books
        } );
    } catch/*( err )*/ {
        /*console.log( err )*//*ReferenceError: Book is not defined at authors.js:44*/;
        res.redirect( "/" );
    };
} );
router.get( "/:id/edit", async ( req, res ) => {
    try {
        const author = await Author.findById( req.params.id );
        res.render( "authors/edit", { author: author } );
    } catch {
        res.redirect( "/authors" );
    };
    res.render( "authors/edit", { author: new Author() } );
} );
router.put( "/:id", async ( req, res ) => {
    let author;
    try {
        author = await Author.findById( req.params.id );
        author.name = req.body.name;
        await author.save();
        res.redirect( `/authors/${ author.id }` );
    } catch {
        if ( author == null ) {
            res.redirect( "/" );
        } else {
            res.render( "authors/edit", {
                author: author,
                errorMessage: "Error updating Author"
            } );
        };
    };
} );
router.delete( "/:id", async ( req, res ) => {
    let author;
    try {
        author = await Author.findById( req.params.id );
        await author.remove();
        res.redirect( "/authors" );
    } catch {
        if ( author == null ) {
            res.redirect( "/" );
        } else {
            res.redirect( `/authors/${ author.id }` );
        };
    };
} );
/*npm i method-override*/
/*From the browser you can make only GET or POST request. method-override library allows us to make PUT and DELETE.*/
module.exports = router;