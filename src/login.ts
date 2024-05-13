import { Elysia, redirect, t } from "elysia";

const loginRouter = new Elysia().post(
  "/login",
  async (req) => {
    const { username, password } = req.body;

    console.log({ body: req.body });

    if (username === "test" && password === "test") {
      redirect("http://localhost:3001/app", 302);
    }
  },
  {
    body: t.Object({
      username: t.String(),
      password: t.String(),
    }),
  }
);

export { loginRouter };
