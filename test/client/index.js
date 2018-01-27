const superagent = require("superagent");

function getPizzas() {
  return superagent.get("http://localhost:8061/api/v1/pizzas");
}

function postPizza() {
  return superagent
    .post("http://localhost:8061/api/v1/pizzas")
    .send({ name: "margherita" })
    .set('X-API-Key', 'foobar');
}

module.exports = {
  getPizzas,
  postPizza
};
