import mongoose from "mongoose"

type ConnectionObject={
    isConnected?:number
}

const connectionInstance:ConnectionObject={}

async function dbConnect():Promise<void> {
      if(connectionInstance.isConnected){
        console.log("Already connected to db")
        return;
      }
      try{
        const dbConnection  = await mongoose.connect(process.env.MONGO_URI ||"");
       connectionInstance.isConnected=dbConnection.connections[0].readyState
          console.log("Db connected Successfully")
      }
      catch(error){
        
        console.log(`There was an error in dbConnect${error}`)
        throw new Error(`THere was an error in dbConnect${error}`)
        
      }
}

export default dbConnect;