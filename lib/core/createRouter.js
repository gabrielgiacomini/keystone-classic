/**
 * @fileoverview This file defines the `createRouter` method for the Keystone instance.
 * It provides a shorthand for creating a new Express router.
 * @module lib/core/createRouter
 */
var express = require('express');

/**
 * Creates a new Express router.
 * This is a shorthand method for Keystone instances to create a new Express router,
 * to make it simpler for projects that don't directly depend on Express.
 *
 * @returns {import('express').Router} A new Express router.
 */
function createRouter () {
	return express.Router();
}

module.exports = createRouter;
