require("dotenv").config();

const server = require("./server");

server.listen(
    process.env.PORT || 8000,
    () => console.log(`Server is listening...`)
);
