const Queue = require('bull')

const notificationQueue = new Queue('notification', {
    redis: {
        host: '127.0.0.1',
        port: 6379
    }
})

const addJob = async (data) => {
    try {
        await notificationQueue.add(data, { removeOnComplete: true })
    } catch (error) {
        console.error('Failed to add job to notification queue with error "%s"', error.message)
    }
}

const processJob = async (callback) => {
    try {
        await notificationQueue.isReady()
        notificationQueue.process(callback)
    } catch (error) {
        console.error('Failed to process job of notification queue with error "%s"', error.message)
    }
}

module.exports = { addJob, processJob }


