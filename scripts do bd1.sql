CREATE OR REPLACE FUNCTION validar_cpf(cpf TEXT) 
RETURNS BOOLEAN AS $$
DECLARE
    cpf_limpo TEXT;
    soma1 INT;
    soma2 INT;
    digito1 INT;
    digito2 INT;
    i INT;
BEGIN
    -- Remove caracteres não numéricos
    cpf_limpo := regexp_replace(cpf, '[^0-9]', '', 'g');
    
    -- Verifica se tem 11 dígitos
    IF LENGTH(cpf_limpo) != 11 THEN
        RETURN FALSE;
    END IF;
    
    -- Verifica se todos os dígitos são iguais (CPF inválido)
    IF cpf_limpo = regexp_replace(cpf_limpo, '^(.)\1*$', '\1', 'g') THEN
        RETURN FALSE;
    END IF;
    
    -- Cálculo do primeiro dígito verificador
    soma1 := 0;
    FOR i IN 1..9 LOOP
        soma1 := soma1 + CAST(SUBSTRING(cpf_limpo, i, 1) AS INT) * (11 - i);
    END LOOP;
    digito1 := (soma1 * 10) % 11;
    IF digito1 = 10 THEN
        digito1 := 0;
    END IF;
    
    -- Cálculo do segundo dígito verificador
    soma2 := 0;
    FOR i IN 1..10 LOOP
        soma2 := soma2 + CAST(SUBSTRING(cpf_limpo, i, 1) AS INT) * (12 - i);
    END LOOP;
    digito2 := (soma2 * 10) % 11;
    IF digito2 = 10 THEN
        digito2 := 0;
    END IF;
    
    -- Verifica se os dígitos batem
    RETURN (
        CAST(SUBSTRING(cpf_limpo, 10, 1) AS INT) = digito1 AND
        CAST(SUBSTRING(cpf_limpo, 11, 1) AS INT) = digito2
    );
END;
$$ LANGUAGE plpgsql;