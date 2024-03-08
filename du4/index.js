import http from "http";
import fs from "fs/promises";

const port = 3000;
const counterFile = "counter.txt";

const server = http.createServer(async (req, res) => {
  try {
    const name = req.url.slice(1);
    res.setHeader("Content-Type", "text/html");
    try {
      const data = await fs.readFile(counterFile, "utf8");
      const fileData = parseInt(data, 10);

      if (name == "increase") {
        const newValue = fileData + 1;
        await fs.writeFile(counterFile, newValue.toString());
        res.statusCode = 200;
        res.write(`<h1>OK</h1>`);
      } else if (name == "decrease") {
        const newValue = fileData - 1;
        await fs.writeFile(counterFile, newValue.toString());
        res.statusCode = 200;
        res.write(`<h1>OK</h1>`);
      } else if (name == "read") {
        res.write(`<h2>Counter: ${fileData}</h2>`);
      } else {
        res.statusCode = 200;
        res.write(`<h1>Welcome to counter</h1>`);
      }
    } catch (e) {
      await fs.writeFile(counterFile, "0");
      res.statusCode = 200;
      res.write(`<h1>Welcome to counter</h1>`);
    }
  } catch (e) {
    res.statusCode = 500;
    res.write(e.message);
  } finally {
    res.end();
  }
});

server.listen(port, () => {
  console.log("it's working");
});
