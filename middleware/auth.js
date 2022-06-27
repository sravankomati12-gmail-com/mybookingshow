const valid = require("validator");
require("dotenv").config();

const userAccess = [
  "/allmovies",
  "/moviebyid",
  "/newticket",
  "/ticketsbooked",
  "/addpayment",
  "/moviesearch",
  "/paymentupdate",
];

module.exports = {
  userValidation: async (req, res, next) => {
    try {
      const { name, email, password, phone, dob, gender } = req.body;
      if (valid.isEmpty(name)) {
        res.json({ error: "Name not be empty" });
      }
      if (valid.isEmpty(email)) {
        res.json({ error: "Email not be empty" });
      }
      if (valid.isEmpty(password)) {
        res.json({ error: "The password is not empty" });
      }
      if (valid.isEmpty(phone)) {
        res.json({ error: "Phone no is not empty" });
      }
      if (valid.isEmpty(dob)) {
        res.json({ error: "Dob is not empty" });
      }
      if (valid.isEmpty(gender)) {
        res.json({ error: "Gender is not empty" });
      }
      if (!valid.isEmail(email)) {
        res.json({ error: "This email is not in a correct format" });
      }
      if (phone.length < 10) {
        res.json({ error: "Phone no should be 10 digit" });
      } else {
        next();
      }
    } catch (error) {
      res.json({ error: "All fields must be define" });
    }
  },
  authVerify: async (req, res, next) => {
    try {
      if (req.user) {
        if (!req.user.isDelated) {
          if (req.user.isAdmin) {
            next();
          } else if (userAccess.indexOf(req.path) !== -1) {
            next();
          } else {
            res.json({ error: "You have no access to this api" });
          }
        } else {
          res.json({ error: "You did not exist in database" });
        }
      } else {
        res.json({ error: "This URL is not existing" });
      }
    } catch (error) {
      res.json({ error: error.messsage });
    }
  },
  movieValidation: async (req, res, next) => {
    const {
      name,
      decription,
      language,
      releaseDate,
      rating,
      director,
      producers,
      casting,
    } = req.body;
    try {
      if (valid.isEmpty(name)) {
        res.json({ error: " The movie name is not empty" });
      }
      if (valid.isEmpty(decription)) {
        res.json({ error: "The movie description not be empty" });
      }
      if (valid.isEmpty(language)) {
        res.json({ error: "The movie language is not empty" });
      }
      if (valid.isEmpty(releaseDate)) {
        res.json({ error: "The movie release date is not empty" });
      }
      if (valid.isEmpty(rating)) {
        res.json({ error: "Rating is not zero" });
      }
      if (valid.isEmpty(director)) {
        res.json({ error: " Movie directors are not empty" });
      }
      if (valid.isEmpty(producers)) {
        res.json({ error: " Movie producers are not empty" });
      }
      if (valid.isEmpty(casting)) {
        res.json({ error: " Movie casting is not empty" });
      } else {
        next();
      }
    } catch (error) {
      console.log(error.messsage);
      // res.json({ error: "All fields must be define" });
    }
  },
  ticketValidation: async (req, res, next) => {
    const { name, seats, moviedate } = req.body;
    try {
      if (valid.isEmpty(name)) {
        res.json({ error: "The movie name field is not empty" });
      }
      if (valid.isEmpty(seats)) {
        res.json({ error: "Seats field not be empty" });
      }
      if (valid.isEmpty(moviedate)) {
        res.json({ error: "The movie date field is not empty" });
      } else {
        next();
      }
    } catch (error) {
      res.json({ error: "All fields must be define" });
    }
  },
  paymentValidation: async (req, res, next) => {
    const { acountno, payopt, currency, timmingslot, username, ticket } =
      req.body;

    try {
      if (valid.isEmpty(acountno)) {
        res.json({ error: "The acountno field is not empty" });
      }
      if (valid.isEmpty(currency)) {
        res.json({ error: "The currency field is not empty" });
      }
      if (valid.isEmpty(timmingslot)) {
        res.json({ error: "The timmingslot field is not empty" });
      }
      if (valid.isEmpty(username)) {
        res.json({ error: "The username field is not empty" });
      }
      if (valid.isEmpty(ticket)) {
        res.json({ error: "The ticket field is not empty" });
      } else {
        next();
      }
    } catch (error) {
      res.json({ error: "All fields must be define" });
    }
  },
};
