import { randomBytes, pbkdf2, createHash } from "node:crypto";

export async function hashPassword(
  password: string
): Promise<{ hashed: string; salt: string }> {
  const salt = randomBytes(16).toString("hex");

  return new Promise((res, rej) => {
    pbkdf2(password, salt, 1000, 64, "sha512", (error, derived) => {
      if (error) return rej(error);
      res({ hashed: derived.toString("hex"), salt });
    });
  });
}

export async function comparePassword(
  password: string,
  hashed: string,
  salt: string
): Promise<boolean> {
  return new Promise((res, rej) => {
    pbkdf2(password, salt, 1000, 64, "sha512", (error, derived) => {
      if (error) return rej(error);
      res(hashed === derived.toString("hex"));
    });
  });
}

export function md5hash(text: string) {
  return createHash("md5").update(text).digest("hex");
}
