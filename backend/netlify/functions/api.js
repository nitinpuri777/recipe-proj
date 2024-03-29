import serverless from "serverless-http"
import app from "../../app.js"

console.log("Express app initialized:", app);

export const handler = serverless(app)