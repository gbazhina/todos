const cors = require("cors");
const express = require("express"),
  app = express(),
  fs = require("fs");
const bodyParser = require("body-parser");

const host = "127.0.0.1";
const port = 7000;

app.use(cors());
app.use(express.json());

const jsonParser = bodyParser.json();
app.use(express.urlencoded({ extended: true }));

let file = "todos.json";

app.use((req, res, next) => {
  fs.readFile(file, (err, data) => {
    if (err)
      return res.status(500).send({ message: "Error while getting tasks." });

    req.todos = JSON.parse(data);

    next();
  });
});

const writeFile = (res, data) => {
  const dataTodos = JSON.stringify(data);
  fs.writeFileSync(file, dataTodos, (err, response) => {
    if (err) return res.status(500);
    return res.status(200);
  });
};

app.get("/api/todos", (req, res) => {
  if (req.query.id) {
    if (req.todos.hasOwnProperty(req.query.id))
      return res.status(200).send({ data: req.todos[req.query.id] });
    else return res.status(404).send({ message: "Tasks not found." });
  } else if (!req.todos)
    return res.status(404).send({ message: "Tasks not found." });

  return res.status(200).send({ data: req.todos });
});

// изменение состояния задачи
app.put("/api/todos/:id", (req, res) => {
  const id = req.params.id;
  const data = fs.readFileSync(file, "utf8");
  const todos = JSON.parse(data);

  const copyTodos = [...todos];
  const currentTask = copyTodos.find((t) => t.id === Number(id));
  currentTask.isComplite = !currentTask.isComplite;

  writeFile(res, todos);

  res.status(200).send();
});

// добавление задачи
app.post("/api/todos", jsonParser, (req, res) => {
  if (!req.body) return res.sendStatus(400);

  const taskId = req.body.id;
  const taskTitle = req.body.title;
  const task = { id: taskId, title: taskTitle, isComplite: false };

  const data = fs.readFileSync(file, "utf8");
  const todos = JSON.parse(data);

  task.id = Date.now();
  todos.push(task);

  writeFile(res, todos);

  res.send(task);
});

// удаление задачи
app.delete("/api/todos/:id", (req, res) => {
  const id = req.params.id;
  const data = fs.readFileSync(file, "utf8");
  const todos = JSON.parse(data);
  const dataFiltred = [...todos].filter((t) => t.id !== Number(id));

  writeFile(res, dataFiltred);

  res.status(200).send();
});

app.listen(port, host, () =>
  console.log(`Server listens http://${host}:${port}`)
);
