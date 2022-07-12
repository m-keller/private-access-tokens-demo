'use strict';

import axios from 'axios';

class IssuerDataFetcher {

    fetchIssuerData(dictionaryUrl) {

        console.log('Loading token issuer data from ', dictionaryUrl);

        return new Promise((resolve) => {
            const responsePromise = axios.get(dictionaryUrl, { headers: { 'User-Agent': 'private-access-tokens-demo +https://github.com/m-keller/private-access-tokens-demo' }});
            responsePromise.then(response => {
                const data = response.data;

                // Extract issuer name and issuer public key
                // If we find an absolute URL inside the dictionary we take that info instead
                const issuer_name = (data['issuer-request-uri'].startsWith('https://')) ?
                    data['issuer-request-uri'].replace('https://', '').split('/')[0] : dictionaryUrl.replace('https://', '').split('/')[0];
    
                var issuer_public_key_base64;
                for (var i = 0; i < data['token-keys'].length; i++) {
                    const key = data['token-keys'][i];
                    if (key['token-type'] == 2) {
                        issuer_public_key_base64 = key['token-key'];
                        break;
                    }
                }
    
                // Also prepare key in PEM format which we will need to verify redemption tokens
                var issuer_public_key_pem = "-----BEGIN PUBLIC KEY-----\n";
                for (i = 0; i < issuer_public_key_base64.length; i++) {
                    issuer_public_key_pem += issuer_public_key_base64[i].replace(/-/g, '+').replace(/_/g, '/');
                    if (i > 0 && i % 64 == 0) {
                        issuer_public_key_pem += "\n";
                    }
                }
                issuer_public_key_pem += "\n-----END PUBLIC KEY-----\n";
                
                resolve({
                    issuer_name,
                    issuer_public_key_base64,
                    issuer_public_key_pem
                });
            });
        });
    }
}

export default IssuerDataFetcher;