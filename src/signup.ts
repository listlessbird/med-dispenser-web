import { Elysia, t } from "elysia";
// import { db } from "./lib/db";
// import { lucia } from "./lib/auth";
// import { DatabaseUser } from "./lib/db";
// import { Argon2id } from "oslo/password";
// import { generateId } from "lucia";

const signupRouter = new Elysia().post(
  "/signup",
  () => "signup"
  //   async ({ cookie: { sessC }, ...c }) => {
  //     const { email, password } = c.body;

  //     const argon = new Argon2id();

  //     const passwordHash = await argon.hash(password);
  //     const userid = generateId(10);

  //     try {
  //       db.prepare(
  //         "INSERT INTO user (id, username, password) VALUES (?, ?, ?)"
  //       ).run(userid, email, passwordHash);

  //       const sess = await lucia.createSession(userid, {});

  //       const sessCookie = lucia.createSessionCookie(sess.id);

  //       sessC.set({ ...sessCookie });

  //       c.redirect("/app");
  //     } catch (e) {
  //       console.error(e);
  //     }
  //   },
  //   {
  //     body: t.Object({
  //       email: t.String(),
  //       password: t.String(),
  //     }),
  //   }
);

export { signupRouter };
