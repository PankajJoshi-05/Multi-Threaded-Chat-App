import { getSockets } from "./getSockets.js";

const emitEvent=(req,event,users,data)=>{
  const io=req.app.get("io");
  const userSocket=getSockets(users);
  io.to(userSocket).emit(event,data);
  console.log("Event emitted",event,users,data);
}
export default emitEvent;