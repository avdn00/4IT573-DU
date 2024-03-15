import express from "express";

const port = 3000;
let id = 1;

const todos = [
  {
    id: id++,
    text: "ukol1",
    done: true,
  },
  {
    id: id++,
    text: "ukol2",
    done: false,
  },
];

const app = express();

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log("Incomming request", req.method, req.url);
  next();
});

app.get("/toggle/:id", (req, res) => {
  const id = Number(req.params.id);
  const todo = todos.find((todo) => todo.id === id);

  if (todo !== undefined) {
    todo.done = !todo.done;
  }

  res.redirect(`/todo/${id}`);
});

app.get("/delete/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = todos.findIndex((todo) => todo.id === id);
  if (index !== -1) {
    todos.splice(index, 1);
  }

  res.redirect("/");
});

app.get("/", (req, res) => {
  res.render("index", {
    title: "ToDo seznam",
    todos,
  });
});

app.get("/todo/:id", (req, res) => {
  const id = Number(req.params.id);
  const todo = todos.find((todo) => todo.id === id);
  if (!todo) {
    return res.status(404).send("ToDo not found");
  }
  res.render("details", { todo });
});

app.post("/add", (req, res) => {
  const text = String(req.body.text);
  if (text) {
    todos.push({
      id: id++,
      text,
      done: false,
    });
  }
  res.redirect("/");
});

app.post("/update/:id", (req, res) => {
  const id = Number(req.params.id);
  const newText = String(req.body.text).trim();
  const todoIndex = todos.findIndex((todo) => todo.id === id);
  if (todoIndex !== -1 && newText) {
    todos[todoIndex].text = newText;
  }
  res.redirect(`/todo/${id}`);
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
