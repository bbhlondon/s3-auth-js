# S3-auth-js

> Javascript / Service Worker helper for S3 authentication

[![CircleCI](https://circleci.com/gh/bbhlondon/s3-auth-js.svg?style=svg)](https://circleci.com/gh/bbhlondon/s3-auth-js) 
[![codecov](https://codecov.io/gh/bbhlondon/s3-auth-js/branch/master/graph/badge.svg)](https://codecov.io/gh/bbhlondon/s3-auth-js)
[![David](https://david-dm.org/bbhlondon/s3-auth-js.svg)](https://david-dm.org/bbhlondon/s3-auth-js.svg)

This library provides a browser based proxy that intercepts calls to a specified domain and either adds authentication information, or redirects to a login page. This was built with S3 website hosting in mind, in order to provide an easy way to create password protected static website hosting on AWS S3, though it would be easy to use this for any similar case.

Note that the authentication functionality itself is not covered in this project.