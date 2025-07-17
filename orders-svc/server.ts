import { startServer } from './launcher'
import amqp from 'amqplib/callback_api';

const PORT = 3000;

const { RABBITMQ_HOST, RABBITMQ_PORT } = process.env;

startServer(PORT);

amqp.connect(`amqp://${RABBITMQ_HOST}:${RABBITMQ_PORT}`, function (error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function (error1, channel) {
        if (error1) {
            throw error1;
        }
        let queue = 'fulfill_order_queue';

        channel.assertQueue(queue, {
            durable: false
        });
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

        channel.consume(queue, function (msg: any) {
            console.log(" [x] Received %s", msg.content.toString());
        }, {
            noAck: true
        });
    });
});