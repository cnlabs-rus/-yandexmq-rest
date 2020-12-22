/**
 * @jest-environment node
 */

const axios = require('axios').create();
const {aws4Interceptor} = require("aws4-axios");
const qs = require('querystring');
const {parseString} = require('xml2js');

module.exports = class {
    constructor(options) {
        this.options = options;
        if (!options.region) {
            this.options.region = 'ru-central1';
        }
        axios.interceptors.request.use(aws4Interceptor({
            region: this.options.region,
            service: "sqs"
        }, {
            accessKeyId: options.keyId,
            secretAccessKey: options.secretKey,
        }));
    }

    async query(target, request) {
        request.Action = target;
        request.Version = '2012-11-05';
        if (this.options.verbose) {
            console.log({target, request});
        }
        return axios.post('https://message-queue.api.cloud.yandex.net', qs.encode(request), {
            validateStatus: () => true
        }).then(async (response) => {
            if (response.status > 299) {
                console.log(response.status, "\n", response.data);
                throw new Error('Error while sending request');
            }
            if (this.options.verbose) {
                console.log(response.status, "\n", response.data);
            }
            return await new Promise((resolve, reject) => parseString(response.data, (e, d) => e && reject(e) || resolve(d)));
        });
    }
}
