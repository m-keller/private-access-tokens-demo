import http from 'http';
import fs from 'fs';
import * as dotenv from 'dotenv';
dotenv.config()

import IssuerDataFetcher from './lib/IssuerDataFetcher.js';
import TokenRequestCreator from './lib/TokenRequestCreator.js';
import TokenRedemption from './lib/TokenRedemption.js';

const issuerDataFetcher = new IssuerDataFetcher();
const tokenRequestCreator = new TokenRequestCreator();
const tokenRedemption = new TokenRedemption();

if (!process.env.TOKEN_DICT_URL) {
    console.error('Please create a .env file from .env.sample.')
    process.exit(1);
}

issuerDataFetcher.fetchIssuerData(process.env.TOKEN_DICT_URL).then(issuerInfo => {
    http.createServer(function (req, res) {
    
        if ('authorization' in req.headers && tokenRedemption.validateAuthToken(issuerInfo, req.headers['authorization'])) {
            console.log('200 - Authenticated request, path=' + req.url + ', headers=' + JSON.stringify(req.headers));

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(fs.readFileSync("html/success200.html", "utf8").replace('AUTH_HEADER', req.headers['authorization']));
            res.end();
        } else {
            console.log('401 - Unauthenticated request, path=' + req.url + ', headers=' + JSON.stringify(req.headers));

            var tokenRequests = [];
            for (var i = 0; i < 1; i++) {
                var tokenRequest = tokenRequestCreator.createTokenRequest(issuerInfo.issuer_name, process.env.INCLUDE_RANDOM_NONCE || true, process.env.ORIGIN_SCOPE);
                tokenRedemption.registerTokenRequestForRedemption(Buffer.from(tokenRequest, 'base64'));
                tokenRequests.push('PrivateToken challenge=' + tokenRequest + ', token-key=' + issuerInfo.issuer_public_key_base64);
            }

            res.writeHead(401, { 'Content-Type': 'text/html', 'WWW-Authenticate': tokenRequests.join(', ') });
            res.write(fs.readFileSync("html/challenge401.html", "utf8"));
            res.end();
        }
    }).listen(process.env.NODE_PORT);
});
