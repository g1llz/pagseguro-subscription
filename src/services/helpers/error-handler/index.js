const errorHandler = (error, msg, rejectFunction) => {
    console.log(error);
    rejectFunction({ error: msg });
}

module.exports = errorHandler;
