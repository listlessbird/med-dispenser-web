import { Elysia, t } from "elysia";
import { comparePassword, hashPassword } from "./utils";
import { db } from "./lib/db";
import { users } from "./lib/table";
import { randomBytes } from "node:crypto";
import { eq } from "drizzle-orm";
import cookie from "@elysiajs/cookie";
import jwt from "@elysiajs/jwt";

export function auth(app: Elysia) {
  return app
    .use(
      jwt({
        name: "jwt",
        secret: Bun.env.JWT_SECRET!,
      })
    )
    .use(cookie())
    .onBeforeHandle(async ({ jwt, cookie: { access_token }, set }) => {})
    .post(
      "/signup",
      async ({ body, set }) => {
        const { username, password } = body;

        const { hashed, salt } = await hashPassword(password);

        const newUser = await db.insert(users).values({
          username,
          hash: hashed,
          salt,
          id: randomBytes(16).toString("hex"),
        });

        set.status = 201;
        return {
          success: true,
          message: "User created",
          data: newUser,
        };
      },
      {
        body: t.Object({
          username: t.String(),
          password: t.String(),
        }),
      }
    )
    .post(
      "/login",
      async ({ body, set, setCookie, jwt }) => {
        const { username, password } = body;

        const user = await db
          .select()
          .from(users)
          .where(eq(users.username, username));

        if (!user.length) {
          set.status = 401;
          return {
            success: false,
            message: "User not found",
            data: null,
          };
        }
        const userFromdb = user[0];

        const { hash, salt } = userFromdb;

        const isValid = await comparePassword(password, hash, salt);

        if (!isValid) {
          set.status = 401;
          return {
            success: false,
            message: "Invalid password",
            data: null,
          };
        }

        const accessToken = await jwt.sign({
          userId: userFromdb.id,
        });

        setCookie("access_token", accessToken, {
          maxAge: 15 * 60, // 15 minutes
          path: "/",
        });

        return {
          success: true,
          data: null,
          message: "Account login successfully",
        };
      },
      {
        body: t.Object({
          username: t.String(),
          password: t.String(),
        }),
      }
    );
}
