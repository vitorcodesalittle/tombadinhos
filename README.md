# Tombadinhos

> Em progresso

Projeto aberto para catalogar, buscar e visualizar bens tombados em Recife.

## Metas

1. ~~API para full text search e inserção de dados~~
2. Permitir a sugestão de alterações das informações de um edifício
3. Pensar em uma forma confiável e prática para especialistas aceitarem
   e refinarem sugestões.
4. Linkar com APIs externas com mídia, como twitter e instagram, talvez
   com campos tipo `twitterHashtags` e `instagramHashtags`
5. Melhorar as visualizações com o mapa

## Getting Started

Necessário:
- Docker 20
- Docker compose version 2.16
- Node 18.15

1. Rode o elastic search e espere serviço ficar de pé:

```bash
docker compose up --wait es01
```

2. ** Altere as permissões de config/* **
Esse passo é temporário até configurar as permissões dos volumes corretamente (passando owner
para um id de usuário comum entre o host e os containers)

```bash
sudo chown -R $USER:$USER ./config
```


3. Rode o servidor ou os testes:

```bash
# Começa um servidor na porta 8080 ou 3000 dependendo do humor do next
npm run dev
```

```bash
# Roda os testes de unidade com jest
npm run test
```

```bash
# Roda os testes com cypress na CLI
npm run test:e2e
```


## Histórico

Esse repo é um fork [desse outro](https://github.com/vitorcodesalittle/atlas), onde eu estava tentando usar apenas o SSR do React 18.
Uma hora percebi que seria muito mais fácil usar Next 13, então refiz o projeto nesse framework.
