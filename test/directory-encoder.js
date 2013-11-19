var path = require( 'path' );
var constructor = require( path.join('..', 'lib', 'directory-encoder'));
var fs = require('fs');

"use strict";
var encoder, output = "test/output/encoded.css";

exports['encode'] = {
	setUp: function( done ) {
		encoder = new constructor( "test/encoding", output );
		done();
	},

	output: function( test ) {
		encoder.encode();
		test.ok( fs.existsSync(output) );
		test.ok( /\.bear/.test(fs.readFileSync(output)) );
		test.done();
	},

	selector: function( test ) {
		encoder._css = function( name, data ){
			test.ok( name === "bear" || name === "dog" );

			return constructor.prototype._css(name, data);
		};

		encoder.encode();
		test.done();
	},

	dup: function( test ) {
		encoder = new constructor( "test/encoding-dup", output );
		test.throws(function() { encoder.encode(); });
		test.done();
	}
};

var svg = constructor.encoders.svg,
  png = constructor.encoders.png;

exports['encoderSelection'] = {
	setUp: function( done ) {
		encoder = new constructor( "test/encoding", output );
		done();
	},

  tearDown: function( done ) {
    svg = constructor.encoders.svg;
    png = constructor.encoders.png;
    done();
  },

	handler: function( test ) {
    constructor.encoders.svg = function(){};
    constructor.encoders.svg.prototype.encode = function() {
      return "foo";
    };

    constructor.encoders.png = function(){};
    constructor.encoders.png.prototype.encode = function() {
      return "bar";
    };

    encoder._css= function( filename, datauri ) {
      test.ok( datauri === "foo" || datauri === "bar" );
    };

		encoder.encode();

		test.done();
	}
};


exports['css'] = {
	setUp: function( done ) {
		encoder = new constructor( "test/encoding", "test/output/encoded.css" );
		done();
	},

	rule: function( test ) {
		test.equal( encoder._css("foo", "bar"),
			".foo { background-image: url('bar'); background-repeat: no-repeat; }" );
		test.done();
	}
};
