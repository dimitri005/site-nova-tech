-- Textes du site modifiés depuis l'administration (priment sur les catalogues d'origine).
CREATE TABLE translation_overrides (
    locale     varchar(2)   NOT NULL,
    msg_key    varchar(200) NOT NULL,
    msg_value  varchar(4000) NOT NULL,
    updated_at timestamp(6) with time zone NOT NULL DEFAULT now(),
    PRIMARY KEY (locale, msg_key)
);
