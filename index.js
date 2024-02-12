import express from "express";
import bodyParser from "body-parser";
import jokes from "./jokes.js";

const app = express();
const port = 3000;
const masterKey = "4VGP2DN-6EWM4SJ-N6FGRHV-Z3PR3TT";

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/random", (req, res) => {
  const randomIndex = Math.floor(Math.random() * jokes.length);
  res.json(jokes[randomIndex]);
});

app.get("/random/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const foundJoke = jokes.find((joke) => joke.id === id);
  if (foundJoke) res.json(foundJoke);
  else
    res.json({
      message: "Bad Request",
      code: 404,
    });
});

app.get("/filter", (req, res) => {
  try {
    const type = req.query.type;
    const foundJokes = jokes.filter(
      (joke) => joke.jokeType.toLocaleLowerCase() === type.toLocaleLowerCase()
    );
    if (foundJokes.length > 0) res.json(foundJokes);
    else
      res.json({
        message: "Joke Not Found",
        code: 404,
      });
  } catch {
    res.json({
      message: "Something Goes Wrong",
      code: 500,
    });
  }
});

app.post("/joke", (req, res) => {
  const newJoke = {
    id: jokes.length + 1,
    jokeText: req.body.joke,
    jokeType: req.body.type,
  };
  jokes.push(newJoke);
  res.json({
    message: "Your Joke added successfully!",
  });
});

app.put("/joke/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const updatedJoke = {
    id: id,
    jokeText: req.body.joke,
    jokeType: req.body.type,
  };
  const jokeIndex = jokes.findIndex((joke) => joke.id === id);
  jokes[jokeIndex] = updatedJoke;
  res.json({
    message: "Joke Replaced successfully!",
  });
});

app.patch("/joke/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const jokeIndex = jokes.findIndex((joke) => joke.id === id);
  const joke = jokes.find((joke) => joke.id === id);
  req.body.joke? joke["jokeText"] = req.body.joke: joke["jokeType"] = req.body.type
  jokes[jokeIndex] = joke
  res.json({
    message: "Joke Updated successfully!",
  })
});

app.listen(port, () => {
  console.log(`Successfully started server on port ${port}.`);
});
