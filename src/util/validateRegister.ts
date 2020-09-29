import { UsernamePasswordInput } from "../resolvers/UsernamePasswordInput";

export const validateRegister = (options: UsernamePasswordInput) => {
  if (options.username.length <= 2) {
    return [
      {
        field: "username",
        message: "Nome de usuário deve ter ao menos 3 caracteres",
      },
    ];
  }

  if (options.password.length < 6) {
    return [
      {
        field: "password",
        message: "Senha deve ter ao menos 6 caracteres",
      },
    ];
  }

  if (!options.email.includes("@")) {
    return [
      {
        field: "email",
        message: "Email inválido.",
      },
    ];
  }

  if (options.username.includes("@")) {
    return [
      {
        field: "username",
        message: "Nome de usuário não pode conter @.",
      },
    ];
  }
  return null;
};
