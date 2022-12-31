const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.set('strictQuery', false);
mongoose.connect("mongodb+srv://admin-rishabh:todolist123@cluster0.n7rcxjx.mongodb.net/todolistDB");

const itemSchema = {
  name: String,
};

const Item = mongoose.model("item", itemSchema);

const item1 = new Item({
  name: "welcome",
});

const defaultItems = [item1];



app.get("/", function (req, res) {
  var today = new Date();

  var options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };

  var day = today.toLocaleDateString("en-US", options);

  Item.find({}, function (err, foundItems) {
    // console.log(foundItems);
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("successfully saved default");
        }
      });

      res.redirect("/");
    } else {
      res.render("list", { kindOfday: day, newListItems: foundItems });
    }
  });
});


app.get("/:customListName",function(req,res){

  console.log(req.params.customListName);

})

app.post("/", function (req, res) {
  const itemName = req.body.newItem;
  const item = new Item({
    name: itemName,
  });
  item.save();
  res.redirect("/");
});

app.post("/delete", function(req,res){

 const checkedItemId = req.body.checkbox ;
 console.log( checkedItemId );

 Item.findByIdAndRemove(checkedItemId.trim(), function(err){

  if(!err){
    console.log("successfully deleted");
    res.redirect("/");
  
  }
  else{
    console.log(err);
  }

 });

});




app.listen(3000, function () {
  console.log("server started on port 3000");
});
