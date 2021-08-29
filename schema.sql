CREATE database FinApi;


CREATE TABLE account(
  id serial not null primary key,
  nome text not null,
  cpf text not null unique,
  senha text not null,
);

CREATE TABLE transactions(
  id serial not null primary key,
  usuario_cpf text not null,
  tipo text not null,
  montante integer not null,
  descricao text not null,
  data_hora date not null,
  foreign key (usuario_cpf) references account (cpf)
);







