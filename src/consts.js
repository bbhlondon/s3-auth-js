export const GATEWAY_URL = '/gateway.html';
export const INDEX_URL = '/test.html';
export const AUTH_METHOD = 'AWS4_SIGNED_HEADERS';
export const AUTH_IDENTIFIER_HEADER = 'AWS4-HMAC-SHA256';
export const AWS_REGION = 'eu_west_2';
export const BYPASSED_URLS = [
    '/client.js',
    'browser-sync',
];

// Messages
export const MESSAGE_SET_CREDENTIALS = 'MESSAGE_SET_CREDENTIALS';
export const MESSAGE_CREDENTIALS_SET = 'MESSAGE_CREDENTIALS_SET';
export const MESSAGE_DELETE_CREDENTIALS = 'MESSAGE_DELETE_CREDENTIALS';
export const MESSAGE_CREDENTIALS_DELETED = 'MESSAGE_CREDENTIALS_DELETED';

// HTTP methods
export const HTTP_METHOD_GET = 'GET';
export const HTTP_METHOD_POST = 'POST';
export const HTTP_METHOD_PUT = 'PUT';
export const HTTP_METHOD_DELETE = 'DELETE';
export const HTTP_METHODS_ALLOWED = [
    HTTP_METHOD_GET,
];

// Errors
export const ERROR_SERVICE_WORKER_NOT_SUPPORTED = 'ERROR_SERVICE_WORKER_NOT_SUPPORTED';
export const ERROR_SERVICE_WORKER_ALREADY_EXISTS = 'ERROR_SERVICE_WORKER_ALREADY_EXISTS';
export const ERROR_SERVICE_WORKER_REGISTRATION_FAILED = 'ERROR_SERVICE_WORKER_REGISTRATION_FAILED';
export const ERROR_PARAM_REQUIRED = 'ERROR_PARAM_REQUIRED';
export const ERROR_PARAM_TYPE_IS_NOT_STRING = '[Worker] Parameter must be a string';
export const ERROR_PARAM_TYPE_IS_NOT_BOOLEAN = '[Worker] Parameter must be a boolean';
export const ERROR_PARAM_TYPE_IS_NOT_OBJECT = 'Parameter must be an object';
export const ERROR_PARAM_IS_NOT_ALLOWED = 'Parameter value not allowed';
export const ERROR_PROPERTY_NOT_FOUND = 'Expected property not found on object';
