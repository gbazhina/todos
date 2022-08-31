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
  // .post((req, res) => {
  //   console.log("req body id", req.body.id);
  //   if (req.body && req.body.id) {
  //     if (req.todos.hasOwnProperty(req.body.id))
  //       return res.status(409).send({ message: "Task already exists." });

  //     req.todos[req.body.id] = req.body;

  //     fs.writeFile(file, JSON.stringify(req.todos), (err, response) => {
  //       if (err)
  //         return res.status(500).send({ message: "Unable create task." });

  //       return res.status(200).send({ message: "Task created." });
  //     });
  //   } else return res.status(400).send({ message: "Bad request." });
  // })
  .put((req, res) => {
    if (req.body && req.body.id) {
      if (!req.todos.hasOwnProperty(req.body.id))
        return res.status(404).send({ message: "Task not found." });

      req.todos[req.body.id] = req.body;

      fs.writeFile(file, JSON.stringify(req.todos), (err, response) => {
        if (err)
          return res.status(500).send({ message: "Unable update task." });

        return res.status(200).send({ message: "Task updated." });
      });
    } else return res.status(400).send({ message: "Bad request." });
  });
  // .delete((req, res) => {
  //   console.log("req params", req.params);
  //   console.log("req query", req.query);
  //   console.log("req.todos", req.todos);
  //   console.log("req.todos.id", req.todos.id);
  //   if (req.query.id) {
  //     if (req.todos.hasOwnProperty(req.query.id)) {
  //       delete req.todos[req.query.id];

  //       fs.writeFile(file, JSON.stringify(req.todos), (err, response) => {
  //         if (err)
  //           return res.status(500).send({ message: "Unable delete task." });

  //         return res.status(200).send({ message: "Task deleted." });
  //       });
  //     } else return res.status(404).send({ message: "Task not found." });
  //   } else return res.status(400).send({ message: "Bad request." });
  // });

  app.post("/api/todos/", jsonParser, function (req, res) {
    if (!req.body) return res.sendStatus(400);

    const taskId = req.body.id;
    const taskTitle = req.body.title;
    const task = { id: taskId, title: taskTitle, isComplite: false };

    const data = fs.readFileSync("todos.json", "utf8");
    const todos = JSON.parse(data);

    const id = Math.max.apply(
      Math,
      todos.map(function (o) {
        return o.id;
      })
    );
    task.id = id + 1;
    todos.push(task);
    const dataTodos = JSON.stringify(todos);
    // fs.writeFileSync("todos.json", dataTodos);
    fs.writeFileSync("todos.json", dataTodos, (err, response) => {
      if (err) return res.status(500).send({ message: "Unable add task." });
      return res.status(200).send({ message: "Task added." });
    });
    
    res.send(task);
  });

  app.delete("/api/todos/:id", function (req, res) {
    delete req.todos[req.params.id];
    fs.writeFile("todos.json", JSON.stringify(req.todos), (err, response) => {
      if (err) return res.status(500).send({ message: "Unable delete task." });
      return res.status(200).send({ message: "Task deleted." });
    });
    // const id = req.params.id;
    // console.log("id", id);
    // const data = fs.readFileSync("todos.json", "utf8");
    // const todos = JSON.parse(data);
    // let index = -1;
    
    // for (let i = 0; i < todos.length; i++) {
    //   if (todos[i].id === id) {
    //     index = i;
    //     break;
    //   }
    // }
    // if (index > -1) {
    //   const task = todos.splice(index, 1)[0];
    //   const dataTodos = JSON.stringify(todos);
    //   fs.writeFileSync("todos.json", dataTodos);
    //   res.send(task);
    // } else {
    //   res.status(404).send();
    // }
  });

app.listen(port, host, () =>
  console.log(`Server listens http://${host}:${port}`)
);
