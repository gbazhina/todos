const cors = require("cors");
const express = require("express"),
  app = express(),
  fs = require("fs");

const host = "127.0.0.1";
const port = 7000;

app.use(cors());
app.use(express.json());
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

app
  .route("/api/todos")
  .get((req, res) => {
    if (req.query.id) {
      if (req.todos.hasOwnProperty(req.query.id))
        return res.status(200).send({ data: req.todos[req.query.id] });
      else return res.status(404).send({ message: "Tasks not found." });
    } else if (!req.todos)
      return res.status(404).send({ message: "Tasks not found." });

    return res.status(200).send({ data: req.todos });
  })
  .post((req, res) => {
    if (req.body.task && req.body.task.id) {
      if (req.todos.hasOwnProperty(req.body.task.id))
        return res.status(409).send({ message: "Task already exists." });

      req.todos[req.body.task.id] = req.body.task;

      fs.writeFile(file, JSON.stringify(req.todos), (err, response) => {
        if (err)
          return res.status(500).send({ message: "Unable create task." });

        return res.status(200).send({ message: "Task created." });
      });
    } else return res.status(400).send({ message: "Bad request." });
  })
  .put((req, res) => {
    if (req.body.task && req.body.task.id) {
      if (!req.todos.hasOwnProperty(req.body.task.id))
        return res.status(404).send({ message: "Task not found." });

      req.todos[req.body.task.id] = req.body.task;

      fs.writeFile(file, JSON.stringify(req.todos), (err, response) => {
        if (err)
          return res.status(500).send({ message: "Unable update task." });

        return res.status(200).send({ message: "Task updated." });
      });
    } else return res.status(400).send({ message: "Bad request." });
  })
  .delete((req, res) => {

    console.log("req", req);
    console.log("res", res);
    if (req.query.id) {
      if (req.todos.hasOwnProperty(req.query.id)) {
        delete req.todos[req.query.id];

        fs.writeFile(file, JSON.stringify(req.todos), (err, response) => {
          if (err)
            return res.status(500).send({ message: "Unable delete task." });

          return res.status(200).send({ message: "Task deleted." });
        });
      } else return res.status(404).send({ message: "Task not found." });
    } else return res.status(400).send({ message: "Bad request." });
  });

app.listen(port, host, () =>
  console.log(`Server listens http://${host}:${port}`)
);
