const cors = require("cors");
const express = require("express"),
  app = express(),
  fs = require("fs");
const bodyParser = require("body-parser");

const host = "127.0.0.1";
const port = 7000;

app.use(cors());
app.use(express.json());

var jsonParser = bodyParser.json();
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

    const copy = [...todos];
    const current = copy.find((t) => t.id === Number(id));
    current.isComplite = !current.isComplite;

    const dataTodos = JSON.stringify(todos);
    fs.writeFileSync(file, dataTodos, (err, response) => {
      if (err) return res.status(500).send({ message: "Unable add task." });
      return res.status(200).send({ message: "Task added." });
    });

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
    const dataTodos = JSON.stringify(todos);
    fs.writeFileSync(file, dataTodos, (err, response) => {
      if (err) return res.status(500).send({ message: "Unable add task." });
      return res.status(200).send({ message: "Task added." });
    });
    
    res.send(task);
  });

  // удаление задачи
  app.delete("/api/todos/:id", (req, res) => {
    const id = req.params.id;
    const data = fs.readFileSync(file, "utf8");
    const todos = JSON.parse(data);

    const dataFiltred = [...todos].filter((t) => t.id !== Number(id));

    const dataTodos = JSON.stringify(dataFiltred);
    fs.writeFileSync(file, dataTodos, (err, response) => {
      if (err) return res.status(500).send({ message: "Unable add task." });
      return res.status(200).send({ message: "Task added." });
    });

    res.status(200).send();
  });

app.listen(port, host, () =>
  console.log(`Server listens http://${host}:${port}`)
);
