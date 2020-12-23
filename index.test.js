const YandexMQ = require('./index');

describe('main', function () {
    const ymq = new YandexMQ({
        region: 'ru-central1',
        keyId: 'oDWgKxttn5gLd3iBIYH7',
        secretKey: '-1uidzTAZaWur-KDEIn_BZh5dpgiUWRBZGZjFl9P',
        verbose: true,
    });
    it('test auth', async () => {
        let queueName = (process.env.CI_PROJECT_NAME || process.env.USER) + '-' + new Date().getTime();
        const v1 = await ymq.query('CreateQueue', {QueueName: queueName});
        const queueUrlOnCreate = v1.CreateQueueResponse.CreateQueueResult[0].QueueUrl[0];
        const v2 = await ymq.query('GetQueueUrl', {QueueName: queueName});
        expect(v2.GetQueueUrlResponse.GetQueueUrlResult[0].QueueUrl[0]).toBe(queueUrlOnCreate);
        
        await ymq.query('SendMessage', {
            QueueUrl: queueUrlOnCreate,
            MessageBody: "Test",
        });
        const result = await ymq.query('ReceiveMessage', {QueueUrl: queueUrlOnCreate});
        console.log(JSON.stringify(result));
        expect(result.ReceiveMessageResponse.ReceiveMessageResult[0].Message[0].Body[0]).toBe("Test");
        await ymq.query('DeleteQueue', {QueueUrl: queueUrlOnCreate});
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
