'use strict';

const nodeExternals = require('webpack-node-externals');

module.exports = {
	mode: 'development',
	entry: './src/main.ts',
	output: {
		filename: 'main.js', // <-- Important
		libraryTarget: 'this' // <-- Important
	},
	target: 'node', // <-- Important
	module: {
		rules: [{
			test: /\.ts?$/,
			loader: 'ts-loader',
		}]
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js']
	},
	externals: [nodeExternals()] // <-- Important
};