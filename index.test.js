const YandexMQ = require('./index');

describe('main', function () {
    const ymq = new YandexMQ({
        endpoint: 'https://message-queue.api.cloud.yandex.net/b1glho6pdsm66b2a60a2/dj6000000001g431046d/jwt-public-key',
        region: 'ru-central1',
        keyId: 'oDWgKxttn5gLd3iBIYH7',
        secretKey: '-1uidzTAZaWur-KDEIn_BZh5dpgiUWRBZGZjFl9P',
        verbose: true,
    });
    it('test auth', async () => {
        await ymq.query('SendMessage', {
            MessageBody: "Test",
        });
        const result = await ymq.query('ReceiveMessage', {});
        console.log(JSON.stringify(result));
        expect(result.ReceiveMessageResponse.ReceiveMessageResult[0].Message[0].Body[0]).toBe("Test");
    });

    it('error handling', async () => {
        try {
            await ymq.query('SendMessage', {
            });
            expect(true).toBeFalsy();
        } catch (e) {
        }
    });
});
