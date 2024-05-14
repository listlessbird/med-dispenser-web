import { Elysia } from "elysia";
import { html } from "@elysiajs/html";
import { staticPlugin } from "@elysiajs/static";
import { readFile } from "fs/promises";
import { join, extname } from "path";

import { signupRouter } from "./signup";
import { loginRouter } from "./login";

const staticDir = "./public";

// staticPlugin does not work for some reason
const app = new Elysia()
  .use(html())
  .use(signupRouter)
  .use(loginRouter)
  // .use(
  //   staticPlugin({
  //     prefix: "/static/",
  //     assets: "./public/images",
  //     alwaysStatic: true,
  //   })
  // )
  .get("/", () => Bun.file("./public/home.html"))
  .get("/login", () => Bun.file("./public/login.html"))
  .get("/signup", () => Bun.file("./public/signup.html"))
  .get("/app", () => Bun.file("./public/app.html"))
  // .get("/static/out.css", () => Bun.file("./public/out.css"))
  .get("/static/*", async (req) => {
    const filePath = join(staticDir, req.params["*"]);

    try {
      const fileContent = await readFile(filePath);
      const contentType = getContentType(extname(filePath));

      return new Response(fileContent, {
        headers: {
          "Content-Type": contentType,
        },
      });
    } catch (err: any) {
      if (err?.code === "ENOENT") {
        return new Response("File not found", { status: 404 });
      }
      throw err;
    }
  })
  .listen(
    { port: process.env.PORT || 3000, hostname: "0.0.0.0" },
    ({ hostname, port }) => {
      const url = process.env.NODE_ENV === "production" ? "https" : "http";

      console.log(`🦊 Elysia is running at ${url}://${hostname}:${port}`);
    }
  );

function getContentType(ext: string) {
  switch (ext) {
    case ".html":
      return "text/html";
    case ".css":
      return "text/css";
    case ".js":
      return "application/javascript";
    case ".json":
      return "application/json";
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".gif":
      return "image/gif";
    default:
      return "application/octet-stream";
  }
}
console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

app
  .handle(
    new Request("http://localhost:3000/signup", {
      method: "POST",
      body: JSON.stringify({
        username: "test",
        password: "test",
      }),
    })
  )
  .then(console.log);
