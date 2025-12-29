const { Kafka } = require('kafkajs');
const fs = require('fs');
const path = require('path');

const kafka = new Kafka({
    clientId: 'kafka-demo',
    brokers: ['kafka-228188a3-csepawankalyan-d514.e.aivencloud.com:17601'],
    ssl: {
        ca: [fs.readFileSync(path.join(__dirname, 'certs', 'ca.pem'), 'utf-8')],
        key: fs.readFileSync(path.join(__dirname, 'certs', 'service.key'), 'utf-8'),
        cert: fs.readFileSync(path.join(__dirname, 'certs', 'service.cert'), 'utf-8'),
    }
})

const producer = kafka.producer();
producer.connect().catch((err) => {
    console.log('Failed to connect producer', err);
});

// data format => array of objects
// Ex: [{id: "1", email: "hello@gmail.com", "name": "Tester"}, {id: "2", email: "hai@gmail.com", "name": "Super Man"}]
// [{ email: "abc@gmail.com", otp: "123456" }] -> [{value: '{ "email": "abc@gmail.com", "otp": "123456" }'}]
const pushToKafka = async (topic, objArray) => {
    try {
        await producer.send({
            topic,
            messages: objArray.map(obj => ({ value: JSON.stringify(obj) }))
        })
    } catch (error) {
        console.error(error)
    }
}

const createConsumer = async (groupId, topics, callback, fromBeginning) => {
    const consumer = kafka.consumer({ groupId });
    await consumer.connect();
    for (const topic of topics) {
        await consumer.subscribe({ topic, fromBeginning });
        console.info(`Subscribing to topic ${topic} with fromBeginning set to ${fromBeginning}`)
    }
    await consumer.run({ eachMessage: callback });
}

module.exports = { pushToKafka, createConsumer };