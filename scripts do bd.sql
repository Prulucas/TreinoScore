ALTER TABLE "Users"
ADD CONSTRAINT cpf_valido CHECK (validar_cpf(cpf));