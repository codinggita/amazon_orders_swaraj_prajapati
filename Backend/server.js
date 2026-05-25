require("dotenv").config();

const app =  require("../Backend/src/app")

const connectDB =  require("../Backend/src/config/db")

const PORT = process.env.PORT || 5000;

connectDB();
app.listen(PORT,()=>{
    console.log(`server is ruunning in ${PORT} port`)
})

module.exports = app;
