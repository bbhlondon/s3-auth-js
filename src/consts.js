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
export const ERROR_PARAM_TYPE_IS_NOT_STRING = 'ERROR_PARAM_TYPE_IS_NOT_STRING';
export const ERROR_PARAM_TYPE_IS_NOT_BOOLEAN = 'ERROR_PARAM_TYPE_IS_NOT_BOOLEAN';
export const ERROR_PARAM_TYPE_IS_NOT_OBJECT = 'ERROR_PARAM_TYPE_IS_NOT_OBJECT';
export const ERROR_PARAM_TYPE_IS_NOT_ARRAY = 'ERROR_PARAM_TYPE_IS_NOT_ARRAY';
export const ERROR_PARAM_IS_NOT_ALLOWED = 'ERROR_PARAM_IS_NOT_ALLOWED';
export const ERROR_PROPERTY_NOT_FOUND = 'ERROR_PROPERTY_NOT_FOUND';
export const ERROR_REQUIRED_HEADER_NOT_FOUND = 'ERROR_REQUIRED_HEADER_NOT_FOUND';
