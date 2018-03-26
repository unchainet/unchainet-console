/**
 * Main config file, uses node.js convention to set environment variables in process.env
 * This config file is excluded from webpack processing and can be easily modified on each environment
 */

if (!window.process) window.process = {};
if (!process.env) process.env = {};

//process.env.API_BASE_URL = 'https://api.unchainet.com';
