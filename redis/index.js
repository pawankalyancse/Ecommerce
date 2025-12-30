const redis = require('redis');

const redisClient = redis.createClient({
    url: 'redis://localhost:6379'
});

const pubClient = redis.createClient({
    url: 'redis://localhost:6379'
});

const subClient = redis.createClient({
    url: 'redis://localhost:6379'
});

(async () => {
    await redisClient.connect();
    await pubClient.connect();
    await subClient.connect();
    console.log('✅ Redis clients connected');
})();


const getDataFromRedis = async (key) => {
    try {
        const data = await redisClient.get(key);
        return data || null;
    } catch (error) {
        return null;
    }
}

const setDataToRedis = async (key, data) => {
    try {
        await redisClient.set(key, data)
    } catch (error) {
        console.error('failed to set key %s to redis with error "%s"', key, error.message)
    }
}

const clearCache = async (key) => {
    try {
        const exists = await redisClient.exists(key);
        if (exists)
            await redisClient.del(key);
    } catch (error) {
        console.error('failed to clear cache for key %s from redis with error "%s"', key, error.message)
    }
}

const publishDataToChannel = async (channel, message) => {
    try {
        if(typeof message === 'object') message = JSON.stringify(message);
        await pubClient.publish(channel, message);
    } catch (error) {
        console.error("Failed to publish message to channel %s with error %s", channel, error.message);
    }
}

const subscribeToChannel = async (channels, callback) => {
    try {
        await subClient.subscribe(channels, callback);
    } catch (error) {
        console.error("Failed to subscribe to channel %s with error %s", channel, error.message);
    }
}

module.exports = { getDataFromRedis, setDataToRedis, clearCache, publishDataToChannel, subscribeToChannel };