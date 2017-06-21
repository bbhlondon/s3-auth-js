# S3-auth-js

> Javascript / Service Worker helper for S3 authentication

This library provides a browser based proxy that intercepts calls to a specified domain and either adds authentication information, or redirects to a login page. This was built with S3 website hosting in mind, in order to provide an easy way to create password protected static website hosting on AWS S3, though it would be easy to use this for any similar case.

Note that the authentication functionality itself is not covered in this project.