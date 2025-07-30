import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export const hashPassword = async (
  password: string,
  salt: number | string
): Promise<string> => {
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

export const getSalt = () => {
  return bcrypt.genSaltSync(SALT_ROUNDS);
};


export const verifyPassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};