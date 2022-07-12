### A public demo of this code is available on https://m-keller.com/private-access-tokens-demo.html

This repository contains a PoC application for testing Private Access Tokens,
a new feature that has been presented by Apple at WWDC 2022. In a nutshell, website 
operators will be able to cut down/avoid the use of captchas by relying on blindly 
signed third party access tokens. Private Access Tokens are an implementation
of the IETF Privacy Pass framework.

When requesting a protected resource from this demo app, the demo app will return a token challenge
for one of the currently two available token issuers - Cloudflare and Fastly. The token issuer
then communicates with the device attester - Apple - before signing and returning the request.

Private Access Tokens are currently only supported on devices that run the beta versions of iOS 16,
 iPadOS 16, and macOS Ventura.

## Prerequisites

1. Access to a web server that can host a NodeJS application on HTTPS. Minimum version of Node: 12.19.0

2. Access to a device supporting Private Access Tokens, e.g., a device running iOS 16 beta or macOS Ventura beta

## Installation

1. `git clone https://github.com/m-keller/private-access-tokens-demo.git`

2. `cp .env.sample .env`

3. `npm install`

4. `npm start`

The Node server is now running on tcp/5000 and has to be made available to the public on HTTPS, e.g., using Apache,
 nginx, or AWS ELB.

## References

* https://developer.apple.com/news/?id=huqjyh7k

* https://www.fastly.com/blog/private-access-tokens-stepping-into-the-privacy-respecting-captcha-less

* https://blog.cloudflare.com/eliminating-captchas-on-iphones-and-macs-using-new-standard/

* https://www.ietf.org/archive/id/draft-ietf-privacypass-architecture-03.html?_fsi=jKxFixnl#name-architecture

* https://www.ietf.org/archive/id/draft-ietf-privacypass-protocol-04.html#name-token-type
